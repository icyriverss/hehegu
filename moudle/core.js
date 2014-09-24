//数据传输

/*
基本流程：
用户点击某个链接，获取该链接的data-type数据，如sell，调用my.api方法从服务器获取所需数据后，读取view/yunying/sell.js中的配置，生成表格并显示。



my.moudle类：
    my.moudle数组包含所有表格模块，所有表格模块继承自my.table类

my.table类    暂定
    变量
    title：表格大标题
    title_tips：大标题tips内容
    year：年份，2011/2012
    month：月份，一月/二月
    store：分店名
    store_id：分店id
    config：表格配置对象
    hasYear：布尔，是否包含年份选择器
    hasMonth：布尔，是否包含月份选择器
    hasStore：布尔，是否包含分店选择器
    hasQuickTime：布尔，是否包含快速选择年历表/月历表/日历表
    qucikTimeType：nianli/yueli/rili，当前所属年历表/月历表/日历表
    baseTableName：'yy_sell'，当前所属基础表（快速切换时，根据此名称生成日历表/月历表/年历表名称，如yy_sell_yueli）


    方法
    getData(callback)：公有，从服务器获取所需数据
    getConfg(jsurl)：获取表格配置数据
    creatHead：生成表格标题行
    creatBody：生成表格body部分
    creatList：生成表格列表部分
    getTableHtml：公有，获取表格的html
    getTitle：生成表格大标题（过滤标题配置中分店名称/年份/月份）

my.util类：工具类   ok
    getDaysByYear(year)：获取某年的天数
    getMonthByFest(month,year)：获取某节日所在月份
    getWeekByDay(day,month,year)：获取某天是星期几
    getScript(jsrul，async，callback)：远程加载js，async:是否异步
    getDot(number,dot):获取数字的小数。参数：数字，小数点位数
    getPercent(number,total,dot)：获取百分比。参数：分子，分母，小数点位数
    send(method,arges,cb)：服务器交互。参数：方法名称、参数、回调

my.stores类：数组，所有分店数据    ok
    id：分店id
    title：分店名称

my.user类    ok
    变量
    power：权限对象
    user_name：用户名
    方法
    login(user_name,password)：登录，返回true/false
    logout：退出登录
    checkPower(parent)：检查用户所在大类的权限



my.menu类：菜单类   ok
    config：菜单配置对象
    currentParent：当前所在大类，如：运营部、加工中心
    currentChild：当前所在小类，如：概况、销售统计、促销统计。
    currentTable：当前所在表格，如：销售统计表、销售统计年历表
    changeParent(parent):切换大类
    changeChild(child)：切换小类
    changeTable(table)：切换表格


my.view类，视图控制类  暂定
    showTable(tableName):显示某个表格内容，使用my.table提供的方法刷新界面
    message（msg,type,cb）：显示提示信息。参数：信息内容，类别，回调。类别包括：1：msgbox，2：ok
    load(status)：加载中界面，on/off
    showLogin():显示登录界面
    showMain():显示登录后界面
*/

//操作处理函数


/**
 * my定义
 */

(function () {
    var my = {
        /**
         * 供全局引用的空函数
         */
        fn: new Function(),
        //创建
        create: function (parent, func) {
            var o = func;
            if (parent) my.inherit(o, parent);
            return o;
        },
        /**
         * 通过原型实现的类继承
         * @param {Function} childClass
         * @param {Function} parentClass
         */
        inherit: function (childClass, parentClass) {
            var Constructor = new Function();
            Constructor.prototype = parentClass.prototype;
            childClass.prototype = new Constructor();
            childClass.prototype.constructor = childClass;
            childClass.superclass = parentClass.prototype;

            if (childClass.prototype.constructor == Object.prototype.constructor) {
                childClass.prototype.constructor = parentClass;
            }
        },
        /**
         * 扩展和覆盖一个对象的属性
         * @param {Object} obj
         * @param {Object} newProperties
         */
        extend: function (obj, newProperties) {
            var key;

            for (key in newProperties) {
                if (newProperties.hasOwnProperty(key)) {
                    obj[key] = newProperties[key];
                }
            }

            return obj;
        },
        /**
         * 拷贝对象
         * @param {Object} obj
         * @param {Function} targetClass
         * @param {Object} newProperties
         */
        copy: function (obj, targetClass, newProperties) {
            if (typeof obj !== 'object') {
                return obj;
            }

            var value = obj.valueOf();
            if (obj != value) {
                return new obj.constructor(value);
            }
            var key;
            var o;
            if (obj instanceof obj.constructor && obj.constructor !== Object) {
                if (targetClass) {
                    o = new targetClass();
                } else {
                    o = my.clone(obj.constructor.prototype);
                }

                for (key in obj) {
                    if (targetClass || obj.hasOwnProperty(key)) {
                        o[key] = obj[key];
                    }
                }
            } else {
                o = {};
                for ( key in obj) {
                    o[key] = obj[key];
                }
            }

            if (newProperties) {
                for ( key in newProperties) {
                    o[key] = newProperties[key];
                }
            }

            return o;
        },
        /**
         * 克隆对象
         * @param {Object} obj
         */
        clone: function (obj) {
            my.__cloneFunc.prototype = obj;
            return new my.__cloneFunc();
        },
        /**
         * @private
         */
        __cloneFunc: function () {
        },
        /**
         * 通过毕包实现的事件代理
         * @param {Function} func
         * @param {Object} scope
         */
        delegate: function (func, scope) {
            scope = scope || window;

            if (arguments.length > 2) {
                var args = Array.prototype.slice.call(arguments, 2);

                return function () {
                    return func.apply(scope, args);
                };
            } else {
                return function () {
                    return func.call(scope);
                };
            }
        },
        moudle:[]
    };
    window.my = window.my||my;
})();

(function () {
    //用户消息管理对象
    var notice = {
        list:[],//消息队列
        index:0,//索引序号
        add: function (msg,cb) {
            this.index++;
            var res = '<div class="notice"><h4><a class="ico ico_notice"></a><span>' + msg + '</span><a class="ico ico_notice_arrow"></a></h4></div>';
            $(".nav").append(res);
            $(".nav h4").click(function () {
                if (cb && typeof cb == 'function') cb();
            });
            $(".notice h4").bind('mouseover', function () {
                $(".notice .ico_notice_arrow")[0].style.cssText += '-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);';
                $(this).height($('span', this).outerHeight() + 13);
            });
            $(".notice h4").bind('mouseout', function () {
                $(".notice .ico_notice_arrow")[0].style.cssText += '-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);';
                $(this).height('28px');
            });
        },
        remove: function (index) {


        },
        clear: function () {
            if ($(".notice").length > 0) $(".notice").remove();
        }
    }
    my.notice = notice;
})()
/*
my.table类
    变量
    title：表格大标题
    title_tips：大标题tips内容
    year：年份，2011/2012
    month：月份，一月/二月
    store：分店名
    store_id：分店id
    config：表格配置对象
    hasYear：布尔，是否包含年份选择器
    hasMonth：布尔，是否包含月份选择器
    hasStore：布尔，是否包含分店选择器
    hasQuickTime：布尔，是否包含快速选择年历表/月历表/日历表
    qucikTimeType：nianli/yueli/rili，当前所属年历表/月历表/日历表
    baseTableName：'yy_sell'，当前所属基础表（快速切换时，根据此名称生成日历表/月历表/年历表名称，如yy_sell_yueli）


    方法
    getData(callback)：公有，从服务器获取所需数据
    getTableHtml：公有，获取表格的html
    getTitle：生成表格大标题（过滤标题配置中分店名称/年份/月份）
*/
my.table = function () {

};
my.table.prototype = {
    title: '',//表格标题，可使用{title}{year}{month}标签
    tips: '',//表格标题的提示文字
    year: '',//年
    month: '',//月份
    store: '',//分店名称，目前版本已去掉
    store_id: null,//分店ID，数组
    config: {},//配置，目前版本已经去掉
    current_quick: '',// nianli / yueli / rili / 自定义字符
    quick: [],//nianli / yueli / rili
    jsurl: '',//js地址
    method: '',//默认调用方法
    arges: {},//api接口参数
    page: 1,//页码
    output: 1,//导出excel
    selection: 'tr',//选择高亮方式，tr或td
    startday: '',//起始日期
    endday: '',//结束日期
    data: {},//缓存数据
    async: {},//异步操作队列
    init: function () {//初始化配置,子类改写
    },
    initData: function (data) {//初始化获取到的数据,子类改写
        this.data = data;
    },
    bindEvent: function () {//生成并写入表格后，绑定表格事件，子类改写。
    },
    //获取数据
    getData: function (cb) {
        var _this = this;
        if (!this.method) {//没有方法 则不获取
            if (cb && typeof cb == 'function') cb();
            return;
        }
        my.util.send(this.method, this.arges, function (data) {
            _this.initData(data);//初始化数据
            try {

            } catch (e) {
                return my.view.message('该报表数据处理出错，请联系管理员！');
            }
            if (cb && typeof cb == 'function') cb();
        });
    },
    //生成表格数据
    getTableHtml: function () {
        var _this = this;
        this.data.sortBy = this.sortBy;
        this.data.sortStatus = this.sortStatus;
        var html = my.debug ? get_template_html(this.template_url + "?t=" + Math.random()) : get_template_html(this.template_url + "?ver=" + version);
        html = template(html, this.data);
        return html;
    },
    //获取大标题
    getTitle: function () {
        return this.title ? this.title.replace(/{year}/g, this.year).replace(/{month}/g, this.month).replace(/{store_name}/g, getStoreName(this.store_id)).replace(/{startday}/g, this.startday).replace(/{endday}/g, this.endday).replace(/{dayopt}/g, this.dayopt) : '';
    },
    //获取tips
    getTips: function () {
        return this.tips;
    },
    //切换分店
    changeStore: function (arr) {
        this.store_id = arr;
    },
    //切换车间
    changeChejian: function (arr) {
        this.chejian_id = arr;
    },
    //切换仓库
    changeBag: function (arr) {
        this.bag_id = arr;
    },
    //切换年份
    changeYear: function (year) {
        this.year = year;
    },
    //切换月份
    changeMonth: function (month) {
        this.month = month;
        if (this.dayopt)
            this.dayopt = 1;
    },
    //切换日
    changeDay: function (day) {
        this.dayopt = day
    },
    //切换类别，年历/月历/日历
    changeType: function (type) {

    },
    //设置每页显示条数
    setPerpage: function (perpage) {
        if (!perpage) perpage = 10;
        this.perpage = perpage;
    },
    //切换分页
    setPage: function (page) {
        if (!page) page = 1;
        this.page = page;
    },
    //切换日期范围
    changeStartDay: function (date) {
        this.startday = date;
    },
    changeEndDay: function (date) {
        this.endday = date;
    },
    //排序。字段、顺序/逆序
    sort: function (field, status) {
        if (!field) return;
        this.sortBy = field;
        this.sortStatus = status;
        this.data.list.sort(function (x, y) {
            return status ? y[field] - x[field] : x[field] - y[field];
        });
    },
    //执行异步操作队列
    runThread: function (cb) {
        $.each(this.async, function () {
            if (!this.status) {
                this.func(cb);
                this.status = 1;
            }
        });
    },
    //结束某异步操作
    endThread: function (name) {
        this.async[name].status = 2;
    },
    //检测是否有异步函数在运行。避免部分报表读取时间过长，可将部分接口在此函数中异步调用。
    chkThread: function () {
        var bRun = false;
        $.each(this.async, function () {
            if (this.status == 1 || !this.status) {//正在执行中
                bRun = true;
                return true;
            }
        });
        return !bRun;
    }
};
/*
my.menu类：菜单类
    config：菜单配置对象
    currentParent：当前所在大类，如：运营部、加工中心
    currentChild：当前所在小类，如：概况、销售统计、促销统计。
    currentTable：当前所在表格，如：销售统计表、销售统计年历表
    changeParent(parent):切换大类
    changeChild(child)：切换小类
    changeTable(table)：切换表格
*/
my.menu = {
    config: {},
    currenntParent: '',
    currentChild: '',
    currentTable: '',
    changeParent: function (parent) {
        var _this = this;
        if (!my.user.checkPower(parent)) return my.view.message('权限不足，请联系管理员！');
        var res = this.getMenuHtml(parent);
        if ($(".main .left .parent").length > 0) {
            $(".main .left .parent").fadeOut(300);
            setTimeout(function () {
                $(".main .left").html(res).stop().hide().fadeIn();
                _this.bindMenuEvent();
            }, 250);
        } else {
            $(".main .left").html(res);
            $(".main .left .parent").hide().fadeIn();
            _this.bindMenuEvent();
        }
    },
    //刷新左侧菜单绑定事件
    bindMenuEvent: function () {
        var _this = this;
        $(".left .parent li div").unbind().bind('click', function (e) {//左侧菜单点击效果
            var child = $(this).parent().find('.child').data('type');
            $(".left .parent li").removeClass('current-item');
            $(this).parent().addClass('current-item');
            _this.changeChild(child);
        });
        $(".child li").unbind().bind('click', function () {//子类点击效果
            var table = $(this).data('type');
            $(".child li").removeClass('current-item');
            $(this).addClass('current-item');
            _this.changeTable(table);
        });//点击菜单报表，显示对应报表
    },
    //刷新子类
    changeChild: function (child) {
        $(".left .parent .child").each(function () {
            var tmpthis = this;
            if ($(this).height() > 0 && $(this).data('type') != child) {
                if (isIE6) return $(this).height(0).hide();
                $(this).height(0);
                setTimeout(function () {
                    $(tmpthis).hide();
                }, 300);
            }
            if ($(this).data('type') == child) {
                if ($(this).height() > 10) return;
                $(this).show().height($(this).find('li').outerHeight() * $(this).find('li').length);
            }
        });
    },
    //更换报表
    changeTable: function (table) {
        if (!my.user.checkPower(table)) return my.view.message('权限不足，请联系管理员！');
        my.view.showTable(table);
    },
    //获取大类下的菜单html
    getMenuHtml: function (parent) {
        var res = '<ul class="parent">';
        $.each(my.menu.config[parent], function (m) {
            if (this.hide) return true;
            if (!my.user.checkPower(this.moudle)) return true;//没权限不显示
            if (m == 0) {
                res += '<li class="item-top">';
            } else if (m == my.menu.config[parent].length - 1) {
                res += '<li class="item-bottom">';
            } else {
                res += '<li>';
            }
            res += '<div data-type="' + this.moudle + '"><span class="ico ico_left_' + m + '"></span><span class="txt">' + this.title + '</span></div>';
            if (this.child) {
                res += my.debug ? '<ul class="child" data-type="' + this.moudle + '" title="' + this.moudle + '">' : '<ul class="child" data-type="' + this.moudle + '">';
                $.each(this.child, function (n) {
                    if (this.hide) return true;
                    if (!my.user.checkPower(this.moudle)) return true;//没权限不显示
                    if (my.debug) {
                        res += '<li data-type="' + this.moudle + '" title="' + this.moudle + '">' + this.title + '</li>';
                    } else {
                        res += '<li data-type="' + this.moudle + '">' + this.title + '</li>';
                    }
                });
                res += '</ul>';
            }
            res += '</li>';
        });
        res += '</ul><div class="clear"></div>';
        return res;
    }
};



/*
dasd
*/
my.menu.config = {
    '运营部': [
        {
            title: '概况',
            moudle: 'yy_base',
            child: [
                {
                    title: '经营报表',
                    moudle: 'yy_base_jy'
                },
                {
                    title: '奖励报表',
                    moudle: 'yy_base_jl',
                    hide: true
                },
                {
                    title: '门店基础档案表',
                    moudle: 'yy_base_store',
                    hide: true
                },
                {
                    title: '预算进度完成统计表',
                    moudle: 'yy_base_ys',
                    hide: true
                }, {
                    title: '外卖查询',
                    moudle: 'yy_wm'
                }, {
                    title: '财务信息报表',
                    moudle: 'yy_base_cwxx'
                }, {
                    title: '异动指标',
                    moudle: 'yy_base_ydzb'
                }, {
                    title: '特殊店',
                    moudle: 'yy_base_tsd'
                }, {
                    title: '百元耗电统计表',
                    moudle: 'yy_base_nhpmb'
                }, {
                    title: '百元耗电统计表-厨房',
                    moudle: 'yy_base_nhpmb_chufang'
                }, {
                    title: '百元耗电统计表-餐厅',
                    moudle: 'yy_base_nhpmb_canting'
                }, {
                    title: '指标综合排名表',
                    moudle: 'yy_base_zbzhpmb'
                }, {
                    title: '门店能耗排名表',
                    moudle: 'yy_base_mdnhpmb'
                }, {
                    title: '食材日定量差异表',
                    moudle: 'yy_base_scrdlcyb'
                }
            ]
        },
        {
            title: '销售统计',
            moudle: 'yy_sell_base',
            child: [
                {
                    title: '销售统计表',
                    moudle: 'yy_sell'
                },
                {
                    title: '销售统计趋势',
                    moudle: 'yy_sell_qushi'
                },
                {
                    title: '销售统计年历表',
                    moudle: 'yy_sell_nianli'
                },
                {
                    title: '销售统计月历表',
                    moudle: 'yy_sell_yueli'
                },
                {
                    title: '销售统计日历表',
                    moudle: 'yy_sell_rili'
                }
            ]
        },
        {
            title: '促销收入统计',
            moudle: 'yy_cuxiao_base',
            child: [
                {
                    title: '促销收入统计表',
                    moudle: 'yy_cuxiao'
                },
                {
                    title: '促销收入统计趋势',
                    moudle: 'yy_cuxiao_qushi'
                },
                {
                    title: '促销收入统计月历表',
                    moudle: 'yy_cuxiao_yueli'
                }
            ]
        },
        {
            title: '收入分类统计',
            moudle: 'yy_shouru_base',
            child: [
                {
                    title: '收入分类统计',
                    moudle: 'yy_shouru'
                },
                {
                    title: '收入分类统计趋势',
                    moudle: 'yy_shouru_qushi'
                },
                {
                    title: '收入分类统计年历表',
                    moudle: 'yy_shouru_nianli'
                },
                {
                    title: '收入分类统计月历表',
                    moudle: 'yy_shouru_yueli'
                }
            ]
        },
        {
            title: '新品需求',
            moudle: 'yy_newproduct_base',
            child: [
                {
                    title: '新品需求表',
                    moudle: 'yy_newproduct'
                },
                {
                    title: '新品需求月历表',
                    moudle: 'yy_newproduct_yueli'
                }
            ]
        },
        {
            title: '绩效指标',
            moudle: 'yy_jixiao_base',
            child: [
                {
                    title: '绩效指标统计表',
                    moudle: 'yy_jixiao'
                },
                {
                    title: '绩效指标趋势表',
                    moudle: 'yy_jixiao_qushi'
                },
                {
                    title: '绩效指标年历表',
                    moudle: 'yy_jixiao_nianli'
                },
                {
                    title: '绩效指标月历表',
                    moudle: 'yy_jixiao_yueli'
                }
            ]
        },
        {
            title: '能源消耗',
            moudle: 'yy_nengyuan_base',
            child: [
                {
                    title: '能源消耗统计表',
                    moudle: 'yy_nengyuan'
                },
                {
                    title: '能源消耗趋势表',
                    moudle: 'yy_nengyuan_qushi'
                },
                {
                    title: '能源消耗月历表',
                    moudle: 'yy_nengyuan_yueli'
                },
                {
                    title: '能源消耗日历表',
                    moudle: 'yy_nengyuan_rili'
                }
            ]
        },
        {
            title: '会员销售',
            moudle: 'yy_member_base',
            child: [
                {
                    title: '会员销售统计表',
                    moudle: 'yy_member'
                },
                {
                    title: '会员销售趋势表',
                    moudle: 'yy_member_qushi'
                },
                {
                    title: '会员销售年历表',
                    moudle: 'yy_member_nianli'
                },
                {
                    title: '会员销售月历表',
                    moudle: 'yy_member_yueli'
                },
                {
                    title: '会员销售日历表',
                    moudle: 'yy_member_rili'
                }
            ]
        },
        {
            title: '基期统计',
            moudle: 'yy_jiqi_base',
            hide: true,
            child: [
                {
                    title: '基期统计年历表',
                    moudle: 'yy_jiqi_nianli'
                },
                {
                    title: '基期统计月历表',
                    moudle: 'yy_jiqi_yueli'
                },
                {
                    title: '连续三期基期统计表',
                    moudle: 'yy_jiqi_lianxu'
                }
            ]
        },
        {
            title: '期间统计',
            moudle: 'yy_qijian_base',
            hide: true,
            child: [
                {
                    title: '期间统计年历表',
                    moudle: 'yy_qijian_nianli'
                },
                {
                    title: '期间统计年度表',
                    moudle: 'yy_qijian_niandu'
                },
                {
                    title: '连续三期期间销售统计表',
                    moudle: 'yy_qijian_lianxu'
                }
            ]
        },
        {
            title: '信息管理',
            moudle: 'yy_info_base',
            child: [
                {
                    title: '门店信息管理',
                    moudle: 'set_base_store'
                }
            ]

        }
    ],
    '人事部': [
        {
            title: '人员管理',
            moudle: 'rs_person',
            child: [
                {
                    title: '人员管理',
                    moudle: 'rs_person_list'
                },
                {
                    title: '录入',
                    moudle: 'rs_person_add'
                }, {
                    title: '转正',
                    moudle: 'rs_person_zhuanzheng'
                },
                {
                    title: '离职',
                    moudle: 'rs_person_lizhi'
                },
                {
                    title: '晋升',
                    moudle: 'rs_person_jinsheng'
                },
                {
                    title: '加薪',
                    moudle: 'rs_person_jiaxin'
                },
                {
                    title: '外派',
                    moudle: 'rs_person_waipai'
                },
                {
                    title: '请假',
                    moudle: 'rs_person_qingjia'
                },
                {
                    title: '外借',
                    moudle: 'rs_person_waijie'
                }
            ]
        },
        {
            title: '组织架构管理',
            moudle: 'rs_zuzhi',
            child: [
                {
                    title: '部门管理',
                    moudle: 'rs_bumen_list'
                }
            ]
        },
        {
            title: '门店薪资统计',
            moudle: 'rs_wage',
            child: [
                {
                    title: '门店薪资统计',
                    moudle: 'rs_store_wage'
                }
            ]
        },
        {
            title: '汇总趋势表',
            moudle: 'rs_base',
            child: [
                {
                    title: '汇总表',
                    moudle: 'rs_base_base'
                },
                {
                    title: '趋势表',
                    moudle: 'rs_base_qushi'
                }
            ]

        },
        {
            title: '历表',
            moudle: 'rs_li',
            child: [
                {
                    title: '日历表',
                    moudle: 'rs_li_rili'
                },
                {
                    title: '月历表',
                    moudle: 'rs_li_yueli'
                },
                {
                    title: '季历表',
                    moudle: 'rs_li_jili'
                },
                {
                    title: '年历表',
                    moudle: 'rs_li_nianli'
                }
            ]
        },
        {
            title: '信息管理',
            moudle: 'rs_info_base',
            child: [
                {
                    title: '门店信息管理',
                    moudle: 'set_base_store'
                }
            ]

        }
    ],
    '开发部': [
        {
            title: '汇总趋势表',
            moudle: 'kf_base',
            child: [
                {
                    title: '汇总表',
                    moudle: 'kf_base_base'
                },
                {
                    title: '趋势表',
                    moudle: 'kf_base_qushi'
                }
            ]

        },
        {
            title: '历表',
            moudle: 'kf_li',
            child: [
                {
                    title: '日历表',
                    moudle: 'kf_li_rili'
                },
                {
                    title: '月历表',
                    moudle: 'kf_li_yueli'
                },
//                {
//                    title: '季历表',
//                    moudle: 'kf_li_jili'
//                },
                {
                    title: '年历表',
                    moudle: 'kf_li_nianli'
                }
            ]
        },
        {
            title: '信息管理',
            moudle: 'kf_info_base',
            child: [
                {
                    title: '门店信息管理',
                    moudle: 'set_base_store'
                }
            ]

        }
    ],
    '工程部': [
        {
            title: '汇总趋势表',
            moudle: 'gc_base',
            child: [
                {
                    title: '汇总表',
                    moudle: 'gc_base_base'
                },
                {
                    title: '趋势表',
                    moudle: 'gc_base_qushi'
                }
            ]
        },
        {
            title: '历表',
            moudle: 'gc_li',
            child: [
                {
                    title: '日历表',
                    moudle: 'gc_li_rili'
                },
                {
                    title: '月历表',
                    moudle: 'gc_li_yueli'
                },
//                {
//                    title: '季历表',
//                    moudle: 'gc_li_jili'
//                },
                {
                    title: '年历表',
                    moudle: 'gc_li_nianli'
                }
            ]
        },
        {
            title: '信息管理',
            moudle: 'gc_info_base',
            child: [
                {
                    title: '门店信息管理',
                    moudle: 'set_base_store'
                }
            ]

        }
    ],
    '加工中心': [
        {
            title: '订单管理',
            moudle: 'chejian_order',
            child: [
                {
                    title: '申请订货',
                    moudle: 'chejian_order_order'
                },
                {
                    title: '收货确认',
                    moudle: 'chejian_order_ok'
                },
                {
                    title: '历史订单',
                    moudle: 'chejian_order_list'
                }
            ]
        },
        {
            title: '存货盘点',
            moudle: 'chejian_bag',
            child: [
                {
                    title: '日结盘点登记',
                    moudle: 'chejian_bag_day'
                },
                {
                    title: '月结盘点表',
                    moudle: 'chejian_bag_month'
                }, {
                    title: '历史盘点记录',
                    moudle: 'chejian_bag_list'
                }
            ]
        },
        {
            title: '报损登记',
            moudle: 'chejian_sun',
            child: [
                {
                    title: '材料报损登记',
                    moudle: 'chejian_sun_cailiao'
                }, {
                    title: '成品报损登记',
                    moudle: 'chejian_sun_chengpin'
                }, {
                    title: '历史报损记录',
                    moudle: 'chejian_sun_list'
                }
            ]
        },
        {
            title: '水电工时管理',
            moudle: 'chejian_dian',
            child: [
                {
                    title: '水电指数录入',
                    moudle: 'chejian_dian_input'
                }, {
                    title: '水电参数设置',
                    moudle: 'chejian_dian_price'
                },
                {
                    title: '工时管理',
                    moudle: 'chejian_gongshi'
                }
            ]
        },
        {
            title: '汇总趋势表',
            moudle: 'jg_base',
            child: [
                {
                    title: '汇总表',
                    moudle: 'jg_base_base'
                },
                {
                    title: '趋势表',
                    moudle: 'jg_base_qushi'
                }
            ]

        },
        {
            title: '历表',
            moudle: 'jg_li',
            child: [
                {
                    title: '日历表',
                    moudle: 'jg_li_rili'
                },
                {
                    title: '月历表',
                    moudle: 'jg_li_yueli'
                },
                {
                    title: '季历表',
                    moudle: 'jg_li_jili'
                },
                {
                    title: '年历表',
                    moudle: 'jg_li_nianli'
                }
            ]
        }
    ],

    '门店': [
        {
            title: '订单管理',
            moudle: 'store_order',
            child: [
                {
                    title: '申请订货',
                    moudle: 'store_order_order'
                },
                {
                    title: '收货确认',
                    moudle: 'store_order_ok'
                },
                {
                    title: '历史订单',
                    moudle: 'store_order_list'
                },
                {
                    title: '调入调出明细',
                    moudle: 'store_db_more'
                },
                {
                    title: '调入调出汇总',
                    moudle: 'store_db_total'
                }
            ]
        },
        {
            title: '存货盘点',
            moudle: 'store_bag',
            child: [
                {
                    title: '日结盘点登记',
                    moudle: 'store_bag_day'
                },
                {
                    title: '月结盘点表',
                    moudle: 'store_bag_month'
                }, {
                    title: '历史盘点记录',
                    moudle: 'store_bag_list'
                }
            ]
        },
        {
            title: '报损登记',
            moudle: 'store_sun',
            child: [
                {
                    title: '材料报损登记',
                    moudle: 'store_sun_cailiao'
                }, {
                    title: '成品报损登记',
                    moudle: 'store_sun_chengpin'
                }, {
                    title: '历史报损记录',
                    moudle: 'store_sun_list'
                }
            ]
        },
        {
            title: '水电录入',
            moudle: 'store_dian',
            child: [
                {
                    title: '水电指数录入',
                    moudle: 'store_dian_input'
                }, {
                    title: '水电参数设置',
                    moudle: 'store_dian_price'
                }
            ]
        },
        {
            title: '会展客诉工时管理',
            moudle: 'huizhan_kesu',
            child: [
                {
                    title: '会展收入管理',
                    moudle: 'store_dian_huizhan'
                },
                {
                    title: '客诉数量管理',
                    moudle: 'store_dian_kesu'
                },
                {
                    title: '工时管理',
                    moudle: 'store_dian_gongshi'
                }
            ]
        },
        {
            title: '小时工管理',
            moudle: 'store_renshi',
            child: [
                {
                    title: '小时工管理',
                    moudle: 'store_renshi_list'
                },
                {
                    title: '小时工录入',
                    moudle: 'store_renshi_add'
                }
            ]
        },
        {
            title: '成本分析',
            moudle: 'caiwu_chengben',
            child: [
                {
                    title: '食材实际成本表',
                    moudle: 'caiwu_chengben_shicai'
                },
                {
                    title: '成品定额成本表',
                    moudle: 'caiwu_chengben_cpde'
                },
                {
                    title: '成品月度成本表',
                    moudle: 'caiwu_chengben_cpmonth'
                }
                ,
                {
                    title: '食材月度成本表',
                    moudle: 'caiwu_chengben_shicaimonth'
                },
                {
                    title: '食材日定量差异表',
                    moudle: 'caiwu_chengben_shicairi'
                },
                {
                    title: '食材单价录入',
                    moudle: 'caiwu_chengben_shicaidanjiaadd'
                }
            ]
        }
    ],
    '仓库': [
        {
            title: '发货管理',
            moudle: 'bag_order',
            child: [
                {
                    title: '处理订货单',
                    moudle: 'bag_order_send'
                },
                {
                    title: '收货单审核',
                    moudle: 'bag_order_pass'
                },
                {
                    title: '出库单记录',
                    moudle: 'bag_order_list'
                }
            ]
        },
        {
            title: '补发退库',
            moudle: 'bag_bu',
            child: [
                {
                    title: '历史记录',
                    moudle: 'bag_order_listbu'
                }, {
                    title: '补发出库单',
                    moudle: 'bag_order_bu'
                }, {
                    title: '退库出库单',
                    moudle: 'bag_order_tui'
                }
            ]
        },
        {
            title: '工时管理',
            moudle: 'bag_gs',
            child: [
                {
                    title: '工时管理',
                    moudle: 'bag_gongshi'
                }
            ]

        }
    ],
    '财务部': [
        {
            title: '订单管理',
            moudle: 'caiwu_order',
            child: [
                {
                    title: '总部需求订单',
                    moudle: 'caiwu_order_list'
                },
                {
                    title: '直供需求订单',
                    moudle: 'caiwu_order_zg'
                },
                {
                    title: '调入调出订单',
                    moudle: 'caiwu_order_db'
                },
                {
                    title: '盘点订单',
                    moudle: 'caiwu_order_pd'
                },
                {
                    title: '材料报损订单',
                    moudle: 'caiwu_order_bs'
                }, {
                    title: '成品报损订单',
                    moudle: 'caiwu_order_cpbs'
                },
                {
                    title: '补发出库单',
                    moudle: 'caiwu_order_bf'
                },
                {
                    title: '退库出库单',
                    moudle: 'caiwu_order_tk'
                }
            ]
        },

        {
            title: '调入调出',
            moudle: 'caiwu_diaoru',
            child: [
                {
                    title: '月度调入调出明细',
                    moudle: 'store_db_more'
                },
                {
                    title: '月度调入调出汇总',
                    moudle: 'store_db_total'
                }
            ]

        },
        {
            title: '预算分类管理',
            moudle: 'caiwu_yusuan',
            child: [
                {
                    title: '预算项目分类',
                    moudle: 'caiwu_yusuan_type'
                },
                {
                    title: '预算项目明细',
                    moudle: 'caiwu_yusuan_type_more'
                }
            ]
        },
        {
            title: '预算数据管理',
            moudle: 'caiwu_data',
            child: [
                {
                    title: '预算数据管理',
                    moudle: 'caiwu_data_manage'
                },
                {
                    title: '预算执行情况',
                    moudle: 'caiwu_data_do'
                }
            ]
        }
    ],
    '系统配置': [
        {
            title: '基础配置',
            moudle: 'set_base',
            child: [
                {
                    title: '基础表配置',
                    moudle: 'set_base_dian'
                },
                {
                    title: '门店水电表配置',
                    moudle: 'store_dian_set'
                },
                {
                    title: '车间水电表配置',
                    moudle: 'chejian_dian_set'
                }
            ]
        },
        {
            title: '帐号权限',
            moudle: 'set_user',
            child: [
                {
                    title: '用户管理',
                    moudle: 'set_base_user'
                },
                {
                    title: '用户组管理',
                    moudle: 'set_base_userlevel'
                }
            ]
        },
        {
            title: '门店管理',
            moudle: 'set_store',
            child: [
                {
                    title: '门店管理',
                    moudle: 'set_base_store'
                },
                {
                    title: '订货分类管理',
                    moudle: 'set_order_type'
                }
            ]
        },
        {
            title: '仓库管理',
            moudle: 'set_bag',
            child: [
                {
                    title: '仓库管理',
                    moudle: 'set_bag_manage'
                }
            ]
        },
        {
            title: '加工中心管理',
            moudle: 'set_chejian',
            child: [
                {
                    title: '车间管理',
                    moudle: 'set_chejian_manage'
                },
                {
                    title: '订货分类管理',
                    moudle: 'set_chejian_type'
                }
            ]
        },
        {
            title: '其他',
            moudle: 'set_other',
            child: [
                {
                    title: '销售数据更新管理',
                    moudle: 'set_other_update'
                }
            ]
        }
    ]
};
/*
my.view类，视图控制类
    showTable(tableName):显示某个表格内容，使用my.table提供的方法刷新界面
    message（msg,type,cb）：显示提示信息。参数：信息内容，类别，回调。类别包括：1：msgbox，2：ok
    load(status)：加载中界面，on/off
    showLogin():显示登录界面
    showMain():显示登录后界面
*/
my.view = {
    //显示表格。表格名称、是否使用缓存（开启后不从服务器获取数据，仅刷新表格）
    showTable: function (tableName, useCache, arges) {
        var _this = this;
        var url = 'view/' + tableName + '.js?ver=' + version;
        if (my.debug) url += '?t=' + Math.random();
        if (!my.moudle[tableName]) my.util.getScript(url, false);//同步加载模块js
        if (my.moudle && my.moudle[tableName]) {
            var moudle = my.moudle[tableName];
            if (!useCache) {//不使用缓存，则清空排序条件，重新初始化，否则数据错乱
                moudle.sortBy = null;
                moudle.sortStatus = null;
            }
            moudle.init(arges);//模块初始化
            _this.load(true);

            if (useCache) {//开启缓存
                _this.freshTable(tableName);
            } else {
                moudle.getData(function () {
                    _this.freshTable(tableName);
                });
            }
        }
    },
    //无获取数据，直接刷新表格。type：1为图标形式，默认为表格形式
    freshTable: function (tableName, type) {
        var _this = this, res;
        var moudle = my.moudle[tableName];
        _this.load(false);
        if (type) {
            if (isIE6) {
                return my.view.message('不支持IE6查看图表功能，请升级浏览器！');
            }
            res = '<table class="data-load"  border="0" cellspacing="0" cellpadding="0" ><tr><td><div id="data_graph"></div></td></tr></table>';//设置表格的图表形式
        } else {
            res = moudle.getTableHtml();//获取表格html
        }
        _this.setOptYear(moudle.year, my.util.getYearList());//处理年份选择
        _this.setOptMonth(moudle.month, my.util.getMonthList(moudle.year));//处理月份选择
        _this.setOptDay(moudle.dayopt, my.util.getDateList(moudle.year, moudle.month));//处理日选择
        _this.setOptStore(moudle.store_id, my.allStores,moudle.is_allStore);//处理分店选择
        _this.setOptChejian(moudle.chejian_id, my.chejians);//处理分店选择
        _this.setOptBag(moudle.bag_id, my.bags);//处理仓库选择

        _this.initTable(tableName);//初始化表格
        _this.setTableContent(res, '', function () {//表格正文

            _this.setTableTips(moudle.getTips());//设置tips

            _this.setStartDay(moudle.startday, moudle.endday);//处理日期范围选择
            _this.checkOptions();//检查顶部选项,没有则去掉right的padding-top属性
            _this.setOutput(moudle.output, type);//设置导出Excel
            _this.setQuick(moudle.current_quick, moudle.quick);//处理年历/月历/日历表切换
            _this.setTableTitle(moudle.getTitle());//设置标题
            type ? _this.bindTableEvent() : _this.bindTableEvent(moudle.selection);//绑定表格事件

            //var height = $(window).height() - $(".top").outerHeight() - $(".nav").outerHeight() - $(".box_head").outerHeight() - $(".options").outerHeight() - 20;//自适应高度
            //var footer_height = $(".footer").outerHeight();
            //var body_height = $(".box_body").outerHeight();
            //if (body_height < height - footer_height - 13) {
            //    $(".box_body")[0].style.cssText += 'height:' + (height - footer_height - 13) + 'px';
            //}

            //if ($("#data_graph")[0]) $("#data_graph")[0].style.cssText += 'min-height:' + (height - 60) + 'px;';
            ////$(".data-load")[0].style.cssText += 'min-height:' + height + 'px';
            //var width = $(".box_body").outerWidth();
            //var minwidth = $(".data-load").data('min');
            //if (width < minwidth) {
            //    $(".data-load").width(minwidth);
            //}
            //if ($(".data-load").data('min')) {
            //    if ($(".data-load").data('min') >= width) {
            //        width = $(".data-load").data('min');
            //    }
            //} else {
            //    width = width < 745 ? 745 : width;
            //}
            //if ($(".data-load")[0]) $(".data-load")[0].style.cssText += 'min-width:' + (width-17) + 'px;\
            //_width:expression((document.documentElement.clientWidth||document.body.clientWidth)<=' + (width + 240 + 19 - 17) + '?"' + (width - 17) + 'px":"");';
            moudle.bindEvent();//绑定表格自定义事件
            if (moudle.chkThread() || type) {//检测是否存在异步操作。如操作为切换至图表样式，则跳过异步操作

                if (type) {
                    moudle.getGraph();//绘制图表
                }
                _this.setGraphBtn(moudle);//设置 图表 / 表格 切换按钮
            } else {
                moudle.runThread(function () {//每次执行完异步操作刷新表格
                    var table = $("#data").data('value');
                    if (tableName == table) {
                        _this.freshTable(table);
                    }
                });
            }
        });
    },
    //设置表格的图表形式
    setGraphBtn: function (moudle) {
        if ($(".graph").length > 0) $(".graph").remove();
        if (moudle.getGraph) {

            var bhas = false;
            if ($("#data_graph").length > 0) bhas = true;
            $(".right .box_title").append('<span class="graph"><a data-type="list" class="current-item">列表</a><a data-type="graph" href="javascript:void(0)">图表</a></span>');
            if (bhas) {
                $(".right .box_title .graph a").removeClass('current-item');
                $(".right .box_title .graph a").eq(1).addClass('current-item');
            }
            $(".right .box_title .graph a").eq(0).click(function () {
                var tableName = $("#data").data('value');
                my.view.freshTable(tableName);
            });
            $(".right .box_title .graph a").eq(1).click(function () {
                var tableName = $("#data").data('value');
                my.view.freshTable(tableName, 1);
            });
        }
    },
    //导出Excel按钮
    setOutput: function (current, type) {
        $(".right .box_head .export").remove();
        if (type) return;
        if (!current) return;
        $(".right .box_head").append('<div class=export><span class="ico ico_export" title="导出Excel"></span></div>');
        $(".right .box_head .export").bind('click', function () {
            my.view.saveToExcel();//导出Excel
        });
    },
    setQuick: function (current, obj) {
        var _this = this;
        var res = '', tmp = '';
        $(".right .box_head .option").remove();
        if ($.isEmptyObject(obj)) return;
        var div = document.createElement('div');
        div.className = 'option';
        $.each(obj, function (type, ele) {
            var li = document.createElement('li');
            if (current == type) li.className = 'current-item';
            li.innerHTML = type;
            var tableName = ele;
            if (typeof tableName == 'string') li.onclick = function () { _this.showTable(tableName); };
            if (typeof tableName == 'function') li.onclick = function () { tableName(); };
            div.appendChild(li);
        });
        $(".right .box_head").append(div);
    },
    //初始化表格
    initTable: function (tableName) {
        if ($("#data").length == 0) {
            var res = '<div class="box"><div class="box_head"><div class="box_title"><span></span></div><div class=option><li></li></div></div>\
                    <div class="box_body" id="box_body">\
                        <div id="data" data-value="' + tableName + '">\
                        </div>\
                    </div>\
                </div>';
            $(".right").append(res);
        } else {
            $("#data").data('value', tableName);
        }
    },
    //检查顶部选项,没有则去掉right的padding-top属性
    checkOptions: function () {

        if ($(".right .options").html() == '') {
            $(".right .options").remove();
            $(".right").css('padding-top', '0px');
        }
    },
    //设置表格tips内容
    //<a class="ico tips"><div class="tips_content"><div class="tips_arrow">◆</div>按日、周或月等按日、周或月等按日、周或月等按日、周或月等</div></a>
    setTableTips: function (str) {
        $(".box_title .tips").remove();
        if (!str || str == '') return;
        $(".box_title").append('<a class="ico tips"><div class="tips_content"><div class="tips_arrow">◆</div>' + str + '</div></a>');

    },
    //顶部添加选项栏
    setOptions: function () {
        if ($(".right .options").length > 0) return;
        $(".right .box").hide();//IE6 bug 先隐藏box再显示
        $(".right").prepend('<div class="options"></div>').css('padding-top', '40px');
        $(".right .box").show();
    },
    setStartDay: function (startday, endday) {
        $(".right .options .op_startday").remove();//先移除后添加,避免多个
        if (!startday || !endday) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op_startday">';
        res += '日期范围：<input type="text" value="' + startday + '" onfocus="WdatePicker()" id="startday" readonly> - ';
        res += '<input type="text" value="' + endday + '" onfocus="WdatePicker()" id="endday" readonly> <span class="submit_day">确定</span></div>';
        $(".right .options").append(res);

    },
    //设置年份选择
    setOptYear: function (current, array) {
        $(".right .options .year").remove();//先移除后添加,避免多个

        if (!current) return;

        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op year">';
        $.each(array, function () {
            if (current == this.value) {
                res += '<span>' + this.title + '<div class="ico ico_pulldown"></div></span><ul>';
                tmp += '<li data-value="' + this.value + '" data-type="year" class="current-item">' + this.title + '</li>';
            } else {
                tmp += '<li data-value="' + this.value + '" data-type="year">' + this.title + '</li>';
            }
        });
        res += tmp + '</ul></div>';
        $(".right .options").append(res);
    },
    //设置月份选择
    setOptMonth: function (current, array) {
        $(".right .options .month").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op month">';
        $.each(array, function () {
            if (current == this.value) {
                res += '<span>' + this.month + '<div class="ico ico_pulldown"></div></span><ul>';
                tmp += '<li data-value="' + this.value + '" data-type="month" class="current-item">' + this.month + '</li>';
            } else {
                tmp += '<li data-value="' + this.value + '" data-type="month">' + this.month + '</li>';
            }
        });
        res += tmp + '</ul></div>';
        $(".right .options").append(res);
    },
    //设置日选择
    setOptDay: function (current, array) {
        $(".right .options .day").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op day">';
        $.each(array, function () {
            if (current == this.value) {
                res += '<span>' + this.title + '<div class="ico ico_pulldown"></div></span><ul>';
                tmp += '<li data-value="' + this.value + '" data-type="dayopt" class="current-item">' + this.title + '</li>';
            } else {
                tmp += '<li data-value="' + this.value + '" data-type="dayopt">' + this.title + '</li>';
            }
        });
        res += tmp + '</ul></div>';
        $(".right .options").append(res);
    },
    //设置仓库选择
    setOptBag: function (current, array) {
        $(".right .options .bag").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '', city = '', has = false;
        if (typeof current == 'string') {
            res += '<div class="op bag">';
            $.each(array, function () {
                if (current == this.bag_id) {
                    res += '<span>' + this.bag_name + '<div class="ico ico_pulldown"></div></span><ul>';
                    tmp += '<li data-value="' + this.bag_id + '" data-type="bag" class="current-item">' + this.bag_name + '</li>';
                } else {
                    tmp += '<li data-value="' + this.bag_id + '" data-type="bag">' + this.bag_name + '</li>';
                }
            });
            res += tmp + '</ul></div>';
            $(".right .options").append(res);
            return;
        }
    },
    //设置车间选择
    setOptChejian: function (current, array) {
        $(".right .options .chejian").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '', city = '', has = false;
        if (typeof current == 'string') {
            res += '<div class="op chejian">';
            $.each(array, function () {
                if (current == this.chejian_id) {
                    res += '<span>' + this.chejian_name + '<div class="ico ico_pulldown"></div></span><ul>';
                    tmp += '<li data-value="' + this.chejian_id + '" data-type="chejian" class="current-item">' + this.chejian_name + '</li>';
                } else {
                    tmp += '<li data-value="' + this.chejian_id + '" data-type="chejian">' + this.chejian_name + '</li>';
                }
            });
            res += tmp + '</ul></div>';
            $(".right .options").append(res);
            return;
        }
    },
    //设置分店选择
    setOptStore: function (current, array,isAll) {
        $(".right .options .op_store").remove();//先移除后添加,避免多个
        $(".right .options .store").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '', city = '', has = false;
        if (typeof current == 'string' || typeof current == 'number') {
            res += '<div class="op store">';
            $.each(array, function () {
                if (!isAll && this.store_id > 8000)
                    return;
                if (current == this.store_id) {
                    res += '<span>' + this.store_name + '<div class="ico ico_pulldown"></div></span><ul>';
                    tmp += '<li data-value="' + this.store_id + '" data-type="store" class="current-item">' + this.store_name + '</li>';
                } else {
                    tmp += '<li data-value="' + this.store_id + '" data-type="store">' + this.store_name + '</li>';
                }
            });
            res += tmp + '</ul></div>';
            $(".right .options").append(res);
            return;
        }

        res += '<div class="op_store">';
        res += '<span>选择分店 <font color=blue><b>[' + current.length + ']</b></font> <div class="ico ico_pulldown"></div></span><ul>';
        stNo = 1;
        $.each(my.citys, function () {
            city = this;
            has = false;
            tmp = '';
            
            $.each(array, function () {
                if (!isAll && this.store_id > 8000) return;
                if (this.city != city) return true;
                if ($.inArray(this.store_id.toString(), current) != -1) {
                    tmp += '<div class="city_li"><input id="ck_' + this.store_id + '" type="checkbox" value="' + this.store_id + '" checked><label for="ck_' + this.store_id + '">' + this.store_name + '</label></div>';
                    has = true;
                } else {
                    tmp += '<div class="city_li"><input id="ck_' + this.store_id + '" type="checkbox" value="' + this.store_id + '"><label for="ck_' + this.store_id + '">' + this.store_name + '</label></div>';
                }
            });
            if (has) {
                res += '<li data-type="store"><input id="ck_store' + stNo + '" type="checkbox" class="selectcity" checked><label for="ck_store' + stNo + '">' + city + '</span><div class="citylist"><div class="arrow">◀</div>'; 
            } else {
                res += '<li data-type="store"><input id="ck_store' + stNo + '" type="checkbox" class="selectcity"><label for="ck_store' + stNo + '">' + city + '</span><div class="citylist"><div class="arrow">◀</div>'; 
            }
            res += tmp + '</div></li>';
            stNo++;
        });
        res += '<li><input type="checkbox" class="selectcityall" id="selectcityall"><label for="selectcityall">全选</label></li><li style="text-align:center;"><div class="city_submit">确定</div></li></ul></div>';
        $(".right .options").append(res);
    },
    //设置表格标题
    setTableTitle: function (title) {
        $(".right .box_title span").eq(0).html(title);
    },
    //设置表格内容，暂时只支持渐隐渐显
    setTableContent: function (content, animate, cb) {
        if ($("#data").html() == '') {
            typeof content == 'string' ? $("#data").html(content).hide().fadeIn() : $("#data").append(content).hide().fadeIn();
            if (cb && typeof cb == 'function') cb();
            return;
        }
        $("#data").fadeOut(300);
        setTimeout(function () {
            typeof content == 'string' ? $("#data").html(content).stop().hide().fadeIn() : $("#data").html('').append(content).stop().hide().fadeIn();
            if (cb && typeof cb == 'function') cb();
        }, 250);
    },
    //刷新表格绑定事件
    bindTableEvent: function (selection) {
        var _this = this;
        var _tmpTime = null;//缓冲时间
        var isa = false;//是否移除鼠标
        var isb = false;//是否移除鼠标
        var topEl = $("#data");
        if (selection) {
            $(selection, topEl).bind('mouseover', function () {//表格选中行变色
                if (selection.indexOf('tr') > -1) {
                    $('td', this).css('background-color', '#D3F0F1');
                } else {
                    $(this).data('bgcolor', $(this).css('background-color'));
                    $(this).css('background-color', '#D3F0F1');
                }
            });
            $(selection, topEl).bind('mouseout', function () {//表格选中行变色
                if (selection.indexOf('tr') > -1) {
                    $('td', this).css('background-color', '#fff');
                } else {
                    $(this).css('background-color', $(this).data('bgcolor'));
                }
            });



        }
        $("#data .ico_down,#data .ico_up,#data .ico_default").click(function () {
            var tableName = $("#data").data('value');
            var field = $(this).data('type');
            if ($(this).hasClass('ico_up')) {
                my.moudle[tableName].sort(field, 0);
                _this.showTable(tableName, 1);
            } else {
                my.moudle[tableName].sort(field, 1);
                _this.showTable(tableName, 1);
            }

        });
        $(".op_store ul li").bind('mouseover', function () {
            $('.citylist', this).show();
        });
        $(".op_store ul li").bind('mouseout', function () {
            $('.citylist', this).hide();
        });
        $(".op_store").bind('click', function (e) {//移动显示城市列表
            var tmpThis = this;
            e.stopPropagation();//阻止冒泡
            if ($(this).outerHeight() > 30) return;
            $(this).height(30 + $(this).find('ul').outerHeight());
            _tmpTime = setTimeout(function () {
                $(tmpThis).css('overflow', 'visible');
            }, 300);
            $(document).bind('click', function () {//绑定关闭事件
                clearTimeout(_tmpTime);
                $(tmpThis).stop().height(28).css('overflow', 'hidden');
                $(document).unbind('click');//关闭时取消绑定body
                var tableName = $("#data").data('value');
                var arr = [];
                $(".op_store .citylist input").each(function () {
                    if ($(this).attr('checked')) {
                        arr.push($(this).val());
                    }
                });
                if (arr.sort().toString() == my.moudle[tableName].store_id.sort().toString()) return;
                my.moudle[tableName].changeStore(arr);
                _this.showTable(tableName);
            });
        });
        $(".selectcityall").click(function () {
            if ($(this).attr('checked')) {
                $(".op_store input").attr('checked', true);
            } else {
                $(".op_store input").attr('checked', false);
            }
        });
        $(".op_store .selectcity").click(function () {//全选/全部选该城市分店
            if ($(this).attr("checked")) {
                $(this).parent().find(".citylist input").attr('checked', true);
            } else {
                $(this).parent().find(".citylist input").attr('checked', false);
            }
        });
        $(".op_store .citylist input").click(function () {//选中一个分店，则选中所在城市，一个分店没选中，则取消选中城市
            if ($(this).attr("checked")) {
                $(this).parent().parent().parent().find(".selectcity").attr('checked', true);
            } else {
                $(this).parent().parent().parent().find(".selectcity").attr('checked', false);
                $(this).parent().parent().find('input').each(function () {
                    if ($(this).attr('checked')) {
                        $(this).parent().parent().parent().find(".selectcity").attr('checked', true);
                    }
                });
            }
        });
        $(".op span").unbind().bind('click', function (e) {
            var height = 30;
            var tmpThis = this;
            if ($(this).parent().outerHeight() > height) {
                $(this).parent().height(height - 2);
                e.stopPropagation();//阻止冒泡
                e.preventDefault();//阻止默认
                $(document).unbind('click');//关闭时取消绑定body
            } else {
                $(this).parent().height(height + $(this).parent().find('ul').outerHeight());
                $(document).trigger('click');//先关闭其他选项
                $(document).bind('click', function () {//绑定关闭事件
                    $(tmpThis).trigger('click');//body任意点击关闭
                });
                e.stopPropagation();//阻止冒泡
                e.preventDefault();//阻止默认
            }
        });
        $(".op_store .city_submit").click(function () {
            var tableName = $("#data").data('value');
            var arr = [];
            $(document).unbind('click');//
            $(".op_store .citylist input").each(function () {
                if ($(this).attr('checked')) {
                    arr.push($(this).val());
                }
            });
            my.moudle[tableName].changeStore(arr);
            _this.showTable(tableName);
        });
        $(".op_startday .submit_day").click(function () {//更改日期范围
            var tableName = $("#data").data('value');
            var startday = $("#startday").val();
            var endday = $("#endday").val();
            var date = new Date();
            date.setDate(date.getDate() - 1);
            if (startday > date.format('yyyy-MM-dd') || endday > date.format('yyyy-MM-dd')) {
                return my.view.message('只能查询今日之前的数据！');
            }
            if (startday > endday) {
                return my.view.message('日期范围错误！');
            }
            my.moudle[tableName].changeStartDay(startday);
            my.moudle[tableName].changeEndDay(endday);
            _this.showTable(tableName);
        });

        $(".op ul li").unbind().bind('click', function () {//选择日期、年、
            var tableName = $("#data").data('value');
            var type = $(this).data('type');
            var value = $(this).data('value');
            if (type == 'month') {
                my.moudle[tableName].changeMonth(value);
            } else if (type == 'year') {
                my.moudle[tableName].changeYear(value);
            } else if (type == 'dayopt') {
                my.moudle[tableName].changeDay(value);
            } else if (type == 'store') {
                my.moudle[tableName].changeStore(value);
            } else if (type == 'chejian') {
                my.moudle[tableName].changeChejian(value);
            } else if (type == 'bag') {
                my.moudle[tableName].changeBag(value);
            }
            _this.showTable(tableName);
            $(this).parent().parent().find('span').html($(this).html() + '<div class="ico ico_pulldown"></div>');
            $(this).parent().find('.current-item').removeClass('current-item');
            $(this).addClass('current-item');
        });
        $(".tips").unbind().bind('mouseover click', function () {//小提示
            $("div", this).stop().show();
        });
        $(".tips").bind('mouseout', function () {//小提示
            $("div", this).stop().hide();
        });
    },
    //提示信息
    message: function (msg, type, cb) {
        var _this = this;
        this.load(true);
        $("#message,#fullbg").unbind().bind('click', function () {
            if (type == 1 && cb && typeof cb == 'function') cb();
            _this.load(false);
        });
        var top = ($(window).height() - $("#message").height()) / 2;
        var left = ($(window).width() - $("#message").width()) / 2;
        var scrollTop = $(document).scrollTop();
        var scrollLeft = $(document).scrollLeft();
        $("#message").css({ position: 'absolute', 'top': top + scrollTop, left: left + scrollLeft }).html('<div class="message_title">系统提示</div><div style="height:160px;"><table border=0 align="center" width="200" height=100%><tr><td >' + msg + ' <a >[点击关闭]</a></td></tr></table></div>');
    },
    //加载中界面
    load: function (status) {
        if (status) {
            $("#fullbg").height($(document).height()).unbind();
            $("#fullbg").show();
            $("#message").fadeIn();
            var top = ($(window).height() - $("#message").height()) / 2;
            var left = ($(window).width() - $("#message").width()) / 2;
            var scrollTop = $(document).scrollTop();
            var scrollLeft = $(document).scrollLeft();
            $("#message").unbind().css({ position: 'absolute', 'top': top + scrollTop, left: left + scrollLeft }).html('<div class="message_title">系统提示</div><div style="height:160px;"><table border=0 align="center" width="200" height=100%><tr><td align="right" width="50"><img src="images/loading.gif" width="30"></td><td>数据加载中，请稍候……</td></tr></table></div>');
        } else {
            $("#fullbg").stop().hide();
            $("#message").stop().fadeOut();
        }
    },
    //登录界面
    showLogin: function () {
        if ($(".login").length > 0) return;
        if ($(".nav").length > 0) {
            $(".nav").remove();
            $(".doc").remove();
            $(".footer").remove();
        }
        my.moudle = [];//彻底清空历史使用记录
        var res = '<ul class="login"><form id="loginform" onsubmit="return false;">\
                <li>\
                    <input type="text" name="user_name" class="input" placeholder="用户名" id="user_name" /></li>\
                <li>\
                    <input type="password" name="password" class="input" placeholder="密码" id="password" /></li>\
                <li>\
                    <input type="submit" value="登&nbsp;录" class="submit" accesskey="l" id="submit" /></form>\
                </li>\
        </ul>';
        $(".top").after(res);
        $("#loginform").bind('submit', function () {
            var user_name = $("#user_name").val();
            var password = $("#password").val();
            my.view.load(1);
            my.user.login(user_name, password, function () {
                my.view.load(0);
                my.view.showMain();
            }, function () {
                my.view.message('登录失败，请检查用户名和密码后重试！');
            });
            return false;
        });
        if (my.util.getCookie('loginid')) {
            $("#user_name").val(my.util.getCookie('loginid'));
            my.view.load(1);
            my.user.chkLoginStatus(function () {
                my.view.load(0);
                my.view.showMain();
            }, function () {
                my.view.load(0);
            });
        }
    },
    //主界面
    showMain: function () {
        if ($(".nav").length > 0) {
            my.view.showTable('main');
            return;
        }
        my.moudle = [];//彻底清空历史使用记录
        $(".login").fadeOut(500);
        setTimeout(function () {
            $(".login").remove();
            var res = '<ul class="nav">\
                        <li data-type="运营部"><span class="ico ico1"></span><span class="txt">运营部</span></li>\
                        <li data-type="人事部"><span class="ico ico2"></span><span class="txt">人事部</span></li>\
                        <li data-type="开发部"><span class="ico ico3"></span><span class="txt">开发部</span></li>\
                        <li data-type="工程部"><span class="ico ico4"></span><span class="txt">工程部</span></li>\
                        <li data-type="加工中心"><span class="ico ico5"></span><span class="txt">加工中心</span></li>\
                        <li data-type="门店"><span class="ico ico7"></span><span class="txt">门店</span></li>\
                        <li data-type="仓库"><span class="ico ico8"></span><span class="txt">仓库</span></li>\
                        <li data-type="财务部"><span class="ico ico9"></span><span class="txt">财务部</span></li>\
                        <li data-type="系统配置"><span class="ico ico6"></span><span class="txt">系统配置</span></li>\
                    </ul>\
                    <div class="doc">\
                        <div class="left">\
                        </div>\
                        <div class="right">\
                        </div>\
                        <div class="clear"></div>\
                    </div>\
                    <div class="clear"></div>\
                    <div class="footer">\
                        © 2013&nbsp;&nbsp;&nbsp;&nbsp;山西和合谷餐饮有限公司&nbsp;&nbsp;&nbsp;&nbsp;All Rights Reserved<br>\
                        技术支持：YinG&nbsp;&nbsp;&nbsp;&nbsp;E-mail：<a href="mailto:33098184@qq.com">33098184@qq.com</a>\
                    </div>\
        ';
            var tmpstr = '用户名：' + my.user.info.loginid + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名：' + my.user.info.user_name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：' + my.user.info.bumen;
            if (my.user.info.bumen == '门店') {
                tmpstr += ' ' + getStoreName(my.user.info.store_id);
            }
            tmpstr += ' <a >退出</a>';

            $(".top .user").html(tmpstr);
            $(".top .user a").unbind().bind('click', function () {
                my.view.load('on');
                my.user.logout(function () {
                    $(".top .user").html('当前帐号：游客');
                    my.view.load('off');
                    my.view.showLogin();
                });
            });
            $(".top").after(res);
            $(".nav li").each(function () {
                if ($(this).data('type') == my.user.bumen) {
                    $(this).addClass('current-item');
                }
            });
            $(".nav li").unbind().bind('click', function () {
                var type = $(this).data('type');
                //var power = my.user.power.split(',');
                //if ($.inArray(type, power) == -1) return my.view.message('权限不足，无法查看。');
                $(".nav li").removeClass('current-item');
                $(this).addClass('current-item');
                my.menu.changeParent(type);
            });
            my.menu.changeParent(my.user.info.bumen);
            my.view.showTable('main');
            my.user.chkTask();//检测用户是否存在任务
        }, 400);
    },
    saveToExcel: function () {
        var title = $(".box_title span").html();
        var table = my.util.getJsonTableData("data");
        var form = document.createElement('form');
        form.action = 'api/excel.php';
        form.method = 'post';
        form.style.display = 'none';
        var input = document.createElement('input');
        input.name = 'array';
        input.value = my.util.toJson({
            'title': title,
            'table': table
        });
        form.appendChild(input);
        document.body.appendChild(form);
        $(form).submit();
    },
    print: function (str) {
        var iframe;
        $(window.frames['iframe_print'].document.body).html('<link href="images/print.css" media="screen" rel="stylesheet" type="text/css" />').append(str);
        $(window.frames['iframe_print'].document.body).find('table').attr('border', '1').attr('width', '100%').css({ 'fontSize': '12px', 'lineHeight': '24px' });
        window.frames['iframe_print'].window.print();
    }
};
/*
my.util类：工具类
    getDaysByYear(year)：获取某年的天数
    getFestByYear(month,year)：获取某年的节日分布，返回{1：春节,2：'',3：清明节}格式
    getWeekByDay(day,month,year)：获取某天是星期几
    getScript(jsrul，async，callback)：远程加载js，async:是否异步
    toJson(object):将object转换为字符串格式
    getDot(number,dot):获取数字的小数。参数：数字，小数点位数
    getPercent(number,total,dot)：获取百分比。参数：分子，分母，小数点位数
*/
my.util = {
    //获取某年的天数
    getDaysByYear: function (year) {
        var d1 = new Date(year, 0, 1).getTime();
        var d2 = new Date(parseInt(year) + 1, 0, 1).getTime();
        return (d2 - d1) / (24 * 60 * 60 * 1000);
    },
    getMax: function (obj, field) {
        var max = 0;
        $.each(obj, function () {
            if (parseInt(this[field]) > max) max = this[field];
        });
        return max;
    },
    //计算某年某月有多少天
    getDaysByMonth: function (month, year) {
        var arr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year % 4 == 0) {
            if (month == 2) return 29;
        }
        return arr[month - 1];
    },
    //获取某年的节日分布，返回{1：春节,2：'',3：清明节}格式
    getFestByYear: function (year) {
        var festconfig = { "春节": { type: "cn", start: { month: 1, day: 1 }, end: { month: 1, day: 1 } }, "情人节": { type: "com", start: { month: 2, day: 14 }, end: { month: 2, day: 14 } }, "劳动节": { type: "com", start: { month: 5, day: 1 }, end: { month: 5, day: 1 } }, "儿童节": { type: "com", start: { month: 6, day: 1 }, end: { month: 6, day: 1 } }, "重阳节": { type: "cn", start: { month: 9, day: 9 }, end: { month: 9, day: 9 } }, "国庆节": { type: "com", start: { month: 10, day: 1 }, end: { month: 10, day: 1 } }, "中秋节": { type: "cn", start: { month: 8, day: 15 }, end: { month: 8, day: 15 } }, "清明节": { type: "com", start: { month: 4, day: 4 }, end: { month: 4, day: 6 } }, "端午节": { type: "cn", start: { month: 5, day: 5 }, end: { month: 5, day: 5 } } };
        var res = {};
        $.each(festconfig, function (k) {
            var month = 0;
            if (this.type == 'cn') {//转换为公历
                month = CalConvert(new Date(year, this.start.month - 1, this.start.day), false).getMonth();
            } else {
                month = this.start.month;
            }
            if (!res[month]) res[month] = [];
            res[month].push(k);
        });
        return res;
    },
    //获取某天周几
    getWeekByDay: function (day, month, year) {
        var res = new Date(year, month - 1, day).getDay();
        if (res == 0) res = 7;
        var arr = ['一', '二', '三', '四', '五', '六', '日'];
        return arr[res - 1];
    },
    //获取月份数组
    getMonths: function (year) {
        var fests = my.util.getFestByYear(year);
        var months = this.getMonthList();
        $.each(months, function () {
            if (fests[this.value]) this.fest = fests[this.value].join(',');
        });
        return months;
    },
    //获取月份列表
    getMonthsList: function (year) {
        return my.util.getFestByYear(year);
    },
    //获取日子数组
    getDays: function (month, year) {
        var days = this.getDaysByMonth(month, year);
        var res = [];
        for (var i = 1; i <= days; i++) {
            res.push({
                day: i,
                week: this.getWeekByDay(i, month, year)
            });
        }
        return res;
    },
    //获取日子数组
    getDayList: function (month, year) {

        var days = this.getDaysByMonth(month, year);
        var res = {};
        for (var i = 1; i <= days; i++) {
            res[i] = { week: this.getWeekByDay(i, month, year) };
        }
        return res;
    },
    //远程加载js，async:是否异步
    getScript: function (url, async, cb) {
        $.ajax({
            url: url,
            async: async,
            type: 'get',
            success: function (data) {
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
                if (cb && typeof cb == 'function') cb();
            },
            dataType: 'text'
        });
    },
    //将对象转换为json字符串
    toJson: function (obj) {
        return $.toJSON(obj);
        var res = '';
        res += "{";
        for (var key in obj) {
            if (typeof (obj[key]) == 'array' || typeof (obj[key]) == 'object') {
                res += "\"" + key + "\":" + this.toJson(obj[key]) + ",";
            } else {
                res += "\"" + key + "\":\"" + obj[key] + "\",";
            }
        }
        if (res[res.length - 1] == ',') { res = res.substring(0, res.length - 1); }
        res += "}";
        return res;
    },

    getMonthTxt: function (month) {
        var res = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        return res[month - 1];
    },
    //生成日对象数组
    getDateList: function (year, month) {
        var dayCount = 0, list = [];
        if (year == new Date().getFullYear() && month == new Date().getMonth() + 1) {
            dayCount = new Date().getDate();
        } else {
            dayCount = this.getDaysByMonth(month, year);
        }
        for (var i = 1; i <= dayCount; i++) {
            list.push({
                value: i,
                title: i + "日"
            })
        }
        return list;

    },
    //生成月份对象数组
    getMonthList: function (year) {
        var list = [
            { month: '一月', value: 1 },
            { month: '二月', value: 2 },
            { month: '三月', value: 3 },
            { month: '四月', value: 4 },
            { month: '五月', value: 5 },
            { month: '六月', value: 6 },
            { month: '七月', value: 7 },
            { month: '八月', value: 8 },
            { month: '九月', value: 9 },
            { month: '十月', value: 10 },
            { month: '十一月', value: 11 },
            { month: '十二月', value: 12 },
        ];
        if (year == new Date().getFullYear()) {
            var month = new Date().getMonth() + 1;
            var arr = [];
            for (var i = 1; i <= month; i++) {
                arr.push(list[i - 1]);
            }
            return arr;
        } else {
            return list;
        }

    },
    //生成年份列表
    getYearList: function () {
        var year = new Date().getFullYear();
        var arr = [];
        for (var i = 2013; i <= year; i++) {
            arr.push({
                title: i + '年',
                value: i
            });
        }
        return arr;
    },
    //
    getYears: function () {
        return [
                {
                    year: '2011年',
                    days: '365天'
                }, {
                    year: '2012年',
                    days: '366天'
                }, {
                    year: '2013年',
                    days: '365天'
                }
        ];
    },
    //发送api请求
    send: function (method, arges, cb, fail) {
        var url = "/api/index.php";
        if (my.debug) console.log('请求:' + method + '，发送数据：' + $.toJSON(arges));
        $.ajax({
            url: url,
            type: 'POST',
            data: 'request=' + $.toJSON(arges) + '&method=' + method,
            timeout: 60000,
            dataType: 'text',
            error: function (xhr, err, o) {
                my.view.message('获取数据超时，请稍后重试！');
            },
            success: function (data, status) {
                if (my.debug) console.log('接收数据：' + data);
                if (typeof data == 'string' && data == 'close') return my.view.message('非常抱歉，系统维护中，请稍候再试！');
                if (typeof data == 'string' && data == 'power error') return my.view.message('权限不足，请联系管理员！');
                try {
                    data = $.parseJSON(data);
                    if (!data.request) throw 'server error';
                    data = data.request;
                } catch (e) {
                    if (fail && typeof fail == 'function') {
                        fail(data);
                    } else {
                        my.view.message('服务器故障，请联系管理员。');
                    }
                    return;
                }
                if (cb && typeof cb == 'function') cb(data);
            }
        });
    },
    //获取指定key的cookie
    getCookie: function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            //alert(j);
            if (document.cookie.substring(i, j) == arg) return my.util.getCookieVal(j);
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return '';
    },
    getCookieVal: function (offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) endstr = document.cookie.length;
        return unescape(document.cookie.substring(offset, endstr));
    },
    HTMLEncode: function (input) {
        var converter = document.createElement("DIV");
        converter.innerText = input;
        var output = converter.innerHTML;
        converter = null;
        return output;
    },
    HTMLDecode: function (input) {
        var converter = document.createElement("DIV");
        converter.innerHTML = input;
        var output = converter.innerText;
        converter = null;
        return output;
    },
    //将表格数据转换为json，用于导出excel
    getJsonTableData: function (tableid) {
        var table = $("#" + tableid);
        var rows = table.find("tr");
        var res = [];
        $.each(rows, function () {
            var col = $(this).find('th,td');
            var tmptr = [];
            $.each(col, function () {
                var tmptd = {};
                tmptd.html = $(this).html().replace(/<[^>]+>/g, "").replace(/&nbsp;/g, ' ');
                tmptd.bgcolor = $(this).prop('tagName').toLowerCase() == 'td' ? 'FFFFFF' : 'F5F5F5';//td or th
                tmptd.colspan = $(this).attr('colspan') ? $(this).attr('colspan') : 1;
                tmptd.rowspan = $(this).attr('rowspan') ? $(this).attr('rowspan') : 1;
                tmptd.width = $(this).outerWidth();
                tmptr.push(tmptd);
            });
            res.push(tmptr);
        });
        return res;
    },
    //根据store_id
    getStore: function (store_id) {
        var res;
        $.each(my.stores, function () {
            if (this.value == store_id) {
                res = this;
                return true;
            }
        });
        return res;
    },
    getStores: function () {
        var arr = [];
        $.each(my.stores, function () {
            arr.push(this.store_id);
        });
        return arr;
    }
}
function isCP(code) {//是否成品
    if (!code || typeof code != 'string') return false;
    if (code.substr(0, 2) == '08') return true;
    return false;
}
function isTH(code) {//是否田和
    if (!code || typeof code != 'string') return false;
    if (code.substr(0, 8) == '01010202') return true;
    return false;
}
function isSL(code) {//雀巢
    if (!code || typeof code != 'string') return false;
    if (code.substr(0, 4) == '0201') return true;
    return false;
}
function isKL(code) {//可乐
    if (!code || typeof code != 'string') return false;
    if (code.substr(0, 4) == '0202') return true;
    return false;
}
function getOneStore_ID() {
    var res = '';
    $.each(my.stores, function () {
        res = this.store_id;
        return false;
    });
    return res;
}
function getOneStore_ID_All() {
    var res = '';
    $.each(my.allStores, function () {
        res = this.store_id;
        return false;
    });
    return res;
}
function getOneBag_ID() {
    var res = '';
    $.each(my.bags, function () {
        res = this.bag_id;
        return false;
    });
    return res;
}
function getOneChejian_ID() {
    var res = '';
    $.each(my.chejians, function () {
        res = this.chejian_id;
        return false;
    });
    return res;
}
function getDepartmentName(id) {
    var res = '';
    $.each(my.departments, function () {
        if (this.id == id) return res = this.department;
    });
    return res;
}
function getStoreName(store_id) {
    var res = '';
    $.each(my.stores, function () {
        if (this.store_id == store_id) return res = this.store_name;
    });
    return res ? res : store_id;
}
function getChejianName(chejian_id) {
    var res = '';
    $.each(my.chejians, function () {
        if (this.chejian_id == chejian_id) return res = this.chejian_name;
    });
    return res;
}
function getBagName(bag_id) {
    var res = '';
    $.each(my.bags, function () {
        if (this.bag_id == bag_id) return res = this.bag_name;
    });
    return res;
}
function getStoreZujin(store_id) {
    var res = '';
    $.each(my.stores, function () {
        if (this.store_id == store_id) return res = this.area;
    });
    return res;
}
function getStoreArea(store_id) {
    var res = '';
    $.each(my.stores, function () {
        if (this.store_id == store_id) return res = this.area;
    });
    return res;
}
function getStoreAreaAvg(arr) {
    var res = 0;
    $.each(my.stores, function () {
        var tmp = this;
        $.each(arr, function () {
            if (tmp.store_id == this) res = res + parseFloat(tmp.area);
        })
    });
    return res;
}
function div(num1, num2, dd) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (!num1 || !num2) return '--';
    if (num2 == 0) return '--';
    var res = num1 / num2;
    if (dd) return dot(res, dd);
    return res;
}
function mul(num1, num2) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    if (!num1 || !num2) return '--';
    return num1 * num2;
}
//加法运算  用于解决js小数运算BUG
function add(arg1, arg2) {
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
}
//减法运算  用于解决js小数运算BUG
function sub(arg1, arg2) {
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
//获取数字的小数。参数：数字，小数点位数
function dot(number, dot) {
    if (!number) return '--';
    var s = number.toString();
    var i = s.indexOf('.');
    if (i > 0) {
        s = s.substr(0, i + 1) + s.substr(i + 1, dot);
    }
    s = parseFloat(s);
    if (!s) return '--';
    return s;
}
//获取百分比，默认5位小数点
function per(number, total, dd) {
    if (!total) return '--';
    var a = number * 100 / total;
    if (!dd) dd = 4;
    if (dd) {
        a = a.toFixed(dd);
    }
    if (!parseFloat(a)) return '--';
    if (a == Infinity) return '--';
    return a + '%';
}
//给date类增加format方法
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份        
        "d+": this.getDate(), //日        
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时        
        "H+": this.getHours(), //小时        
        "m+": this.getMinutes(), //分        
        "s+": this.getSeconds(), //秒        
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度        
        "S": this.getMilliseconds() //毫秒        
    };
    var week = {
        "0": "\u65e5",
        "1": "\u4e00",
        "2": "\u4e8c",
        "3": "\u4e09",
        "4": "\u56db",
        "5": "\u4e94",
        "6": "\u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
function d(obj) {
    alert($.toJSON(obj));
}

var isIE = !!window.ActiveXObject;
var isIE6 = isIE && !window.XMLHttpRequest;
var isIE8 = isIE && !!document.documentMode;

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}




var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
//此处收录了375个多音字,数据来自于http://www.51window.net/page/pinyin
var oMultiDiff = { "19969": "DZ", "19975": "WM", "19988": "QJ", "20048": "YL", "20056": "SC", "20060": "NM", "20094": "QG", "20127": "QJ", "20167": "QC", "20193": "YG", "20250": "KH", "20256": "ZC", "20282": "SC", "20285": "QJG", "20291": "TD", "20314": "YD", "20340": "NE", "20375": "TD", "20389": "YJ", "20391": "CZ", "20415": "PB", "20446": "YS", "20447": "SQ", "20504": "TC", "20608": "KG", "20854": "QJ", "20857": "ZC", "20911": "PF", "20504": "TC", "20608": "KG", "20854": "QJ", "20857": "ZC", "20911": "PF", "20985": "AW", "21032": "PB", "21048": "XQ", "21049": "SC", "21089": "YS", "21119": "JC", "21242": "SB", "21273": "SC", "21305": "YP", "21306": "QO", "21330": "ZC", "21333": "SDC", "21345": "QK", "21378": "CA", "21397": "SC", "21414": "XS", "21442": "SC", "21477": "JG", "21480": "TD", "21484": "ZS", "21494": "YX", "21505": "YX", "21512": "HG", "21523": "XH", "21537": "PB", "21542": "PF", "21549": "KH", "21571": "E", "21574": "DA", "21588": "TD", "21589": "O", "21618": "ZC", "21621": "KHA", "21632": "ZJ", "21654": "KG", "21679": "LKG", "21683": "KH", "21710": "A", "21719": "YH", "21734": "WOE", "21769": "A", "21780": "WN", "21804": "XH", "21834": "A", "21899": "ZD", "21903": "RN", "21908": "WO", "21939": "ZC", "21956": "SA", "21964": "YA", "21970": "TD", "22003": "A", "22031": "JG", "22040": "XS", "22060": "ZC", "22066": "ZC", "22079": "MH", "22129": "XJ", "22179": "XA", "22237": "NJ", "22244": "TD", "22280": "JQ", "22300": "YH", "22313": "XW", "22331": "YQ", "22343": "YJ", "22351": "PH", "22395": "DC", "22412": "TD", "22484": "PB", "22500": "PB", "22534": "ZD", "22549": "DH", "22561": "PB", "22612": "TD", "22771": "KQ", "22831": "HB", "22841": "JG", "22855": "QJ", "22865": "XQ", "23013": "ML", "23081": "WM", "23487": "SX", "23558": "QJ", "23561": "YW", "23586": "YW", "23614": "YW", "23615": "SN", "23631": "PB", "23646": "ZS", "23663": "ZT", "23673": "YG", "23762": "TD", "23769": "ZS", "23780": "QJ", "23884": "QK", "24055": "XH", "24113": "DC", "24162": "ZC", "24191": "GA", "24273": "QJ", "24324": "NL", "24377": "TD", "24378": "QJ", "24439": "PF", "24554": "ZS", "24683": "TD", "24694": "WE", "24733": "LK", "24925": "TN", "25094": "ZG", "25100": "XQ", "25103": "XH", "25153": "PB", "25170": "PB", "25179": "KG", "25203": "PB", "25240": "ZS", "25282": "FB", "25303": "NA", "25324": "KG", "25341": "ZY", "25373": "WZ", "25375": "XJ", "25384": "A", "25457": "A", "25528": "SD", "25530": "SC", "25552": "TD", "25774": "ZC", "25874": "ZC", "26044": "YW", "26080": "WM", "26292": "PB", "26333": "PB", "26355": "ZY", "26366": "CZ", "26397": "ZC", "26399": "QJ", "26415": "ZS", "26451": "SB", "26526": "ZC", "26552": "JG", "26561": "TD", "26588": "JG", "26597": "CZ", "26629": "ZS", "26638": "YL", "26646": "XQ", "26653": "KG", "26657": "XJ", "26727": "HG", "26894": "ZC", "26937": "ZS", "26946": "ZC", "26999": "KJ", "27099": "KJ", "27449": "YQ", "27481": "XS", "27542": "ZS", "27663": "ZS", "27748": "TS", "27784": "SC", "27788": "ZD", "27795": "TD", "27812": "O", "27850": "PB", "27852": "MB", "27895": "SL", "27898": "PL", "27973": "QJ", "27981": "KH", "27986": "HX", "27994": "XJ", "28044": "YC", "28065": "WG", "28177": "SM", "28267": "QJ", "28291": "KH", "28337": "ZQ", "28463": "TL", "28548": "DC", "28601": "TD", "28689": "PB", "28805": "JG", "28820": "QG", "28846": "PB", "28952": "TD", "28975": "ZC", "29100": "A", "29325": "QJ", "29575": "SL", "29602": "FB", "30010": "TD", "30044": "CX", "30058": "PF", "30091": "YSP", "30111": "YN", "30229": "XJ", "30427": "SC", "30465": "SX", "30631": "YQ", "30655": "QJ", "30684": "QJG", "30707": "SD", "30729": "XH", "30796": "LG", "30917": "PB", "31074": "NM", "31085": "JZ", "31109": "SC", "31181": "ZC", "31192": "MLB", "31293": "JQ", "31400": "YX", "31584": "YJ", "31896": "ZN", "31909": "ZY", "31995": "XJ", "32321": "PF", "32327": "ZY", "32418": "HG", "32420": "XQ", "32421": "HG", "32438": "LG", "32473": "GJ", "32488": "TD", "32521": "QJ", "32527": "PB", "32562": "ZSQ", "32564": "JZ", "32735": "ZD", "32793": "PB", "33071": "PF", "33098": "XL", "33100": "YA", "33152": "PB", "33261": "CX", "33324": "BP", "33333": "TD", "33406": "YA", "33426": "WM", "33432": "PB", "33445": "JG", "33486": "ZN", "33493": "TS", "33507": "QJ", "33540": "QJ", "33544": "ZC", "33564": "XQ", "33617": "YT", "33632": "QJ", "33636": "XH", "33637": "YX", "33694": "WG", "33705": "PF", "33728": "YW", "33882": "SR", "34067": "WM", "34074": "YW", "34121": "QJ", "34255": "ZC", "34259": "XL", "34425": "JH", "34430": "XH", "34485": "KH", "34503": "YS", "34532": "HG", "34552": "XS", "34558": "YE", "34593": "ZL", "34660": "YQ", "34892": "XH", "34928": "SC", "34999": "QJ", "35048": "PB", "35059": "SC", "35098": "ZC", "35203": "TQ", "35265": "JX", "35299": "JX", "35782": "SZ", "35828": "YS", "35830": "E", "35843": "TD", "35895": "YG", "35977": "MH", "36158": "JG", "36228": "QJ", "36426": "XQ", "36466": "DC", "36710": "JC", "36711": "ZYG", "36767": "PB", "36866": "SK", "36951": "YW", "37034": "YX", "37063": "XH", "37218": "ZC", "37325": "ZC", "38063": "PB", "38079": "TD", "38085": "QY", "38107": "DC", "38116": "TD", "38123": "YD", "38224": "HG", "38241": "XTC", "38271": "ZC", "38415": "YE", "38426": "KH", "38461": "YD", "38463": "AE", "38466": "PB", "38477": "XJ", "38518": "YT", "38551": "WK", "38585": "ZC", "38704": "XS", "38739": "LJ", "38761": "GJ", "38808": "SQ", "39048": "JG", "39049": "XJ", "39052": "HG", "39076": "CZ", "39271": "XT", "39534": "TD", "39552": "TD", "39584": "PB", "39647": "SB", "39730": "LG", "39748": "TPB", "40109": "ZQ", "40479": "ND", "40516": "HG", "40536": "HG", "40583": "QJ", "40765": "YQ", "40784": "QJ", "40840": "YK", "40863": "QJG" };
//参数,中文字符串
//返回值:拼音首字母串数组
function makePy(str) {
    if (typeof (str) != "string")
        throw new Error(-1, "函数makePy需要字符串类型参数!");
    var arrResult = new Array(); //保存中间结果的数组
    for (var i = 0, len = str.length; i < len; i++) {
        //获得unicode码
        var ch = str.charAt(i);
        //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
        arrResult.push(checkCh(ch));
    }
    //处理arrResult,返回所有可能的拼音首字母串数组
    return mkRslt(arrResult);
}

function checkCh(ch) {
    var uni = ch.charCodeAt(0);
    //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
    if (uni > 40869 || uni < 19968)
        return ch; //dealWithOthers(ch);
    //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
    return (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));
}
function mkRslt(arr) {
    var arrRslt = [""];
    for (var i = 0, len = arr.length; i < len; i++) {
        var str = arr[i];
        var strlen = str.length;
        if (strlen == 1) {
            for (var k = 0; k < arrRslt.length; k++) {
                arrRslt[k] += str;
            }
        } else {
            var tmpArr = arrRslt.slice(0);
            arrRslt = [];
            for (k = 0; k < strlen; k++) {
                //复制一个相同的arrRslt
                var tmp = tmpArr.slice(0);
                //把当前字符str[k]添加到每个元素末尾
                for (var j = 0; j < tmp.length; j++) {
                    tmp[j] += str.charAt(k);
                }
                //把复制并修改后的数组连接到arrRslt上
                arrRslt = arrRslt.concat(tmp);
            }
        }
    }
    return arrRslt;
}
my.user = {
    user_name: null,
    power: {},
    regtime: '',
    logintimes: '',
    list: '',
    bumen: '',
    store_id: '',//用户所属门店
    info: {},//登录成功后的信息数组
    power: {},
    //初始化登录成功接收的信息
    initLoginInfo: function () {
        var _this = this;
        //门店
        my.stores = {};
        my.allStores = {};
        my.citys = [];//城市
        $.each(this.info.config.stores, function () {
            my.allStores[this.store_id] = this;
            if (this.store_id < 8000)
                my.stores[this.store_id] = this;//改成store_id索引
            if (!this.city) return true;
            if ($.inArray(this.city, my.citys) == -1) my.citys.push(this.city);
        });
        my.bags = this.info.config.bags;//仓库
        my.chejians = {};
        $.each(this.info.config.chejians, function () {
            my.chejians[this.chejian_id] = this;
        });
        _this.power = {};
        $.each(this.info.power, function () {
            _this.power[this] = 1;
        });
        my.departments = {};
        $.each(this.info.config.departments, function () {
            my.departments[this.id] = this;
        });
    },
    //登录信息
    login: function (loginid, password, sucess, fail) {
        var _this = this;
        my.util.send('user->userLogin', {
            loginid: loginid,
            password: password
        }, function (data) {
            if (data.status == 0) {
                _this.info = data;
                _this.initLoginInfo();
                if (sucess && typeof sucess == 'function') sucess();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    },
    //test:function(){
    //    var users = '范锁军,郭兴宇,贾新伟,刘海,李兵,郭艳青,曹冬丽,赵长青,王瑞斌,庞姝,董颖超,白俊林,程鹏,段玲玲,刘永毅,胡晓丽,郝磊,李艳丽,范云龙,邵晓瑞,杨庆辉,宋萌萌,亢鹏,杜胤,张晓丹,李艳青,卢亮,陈洋,卫龙,刑邵杰,杨彦芳,张强,赵杨杰,张波';
    //    var arr = users.split(',');
    //    var a = [];
    //    for(var i=0;i<arr.length;i++){
    //        var tmp = {};
    //        tmp.user_name = arr[i];
    //        tmp.loginid = makePy(arr[i])[0];
    //        tmp.password = '123456';
    //        tmp.level_name = '';
    //        tmp.bumen = '门店';
    //        this.addUser(tmp.loginid, tmp.password, tmp.user_name, '门店操作员', tmp.bumen,'','','');
    //    }
    //},
    //添加用户
    addUser: function (loginid, password, user_name, level_name, bumen, bag_id, chejian_id, store_id, cb, fail) {
        var _this = this;
        my.util.send('user->addUser', {
            loginid: loginid,
            password: password,
            user_name: user_name,
            level_name: level_name,
            bumen: bumen,
            bag_id: bag_id,
            chejian_id: chejian_id,
            store_id: store_id
        }, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail(data.status);
                return;
            }
            if (cb && typeof cb == 'function') cb();
        });
    },
    //修改用户
    editUser: function (user_id, loginid, password, user_name, level_name, bumen, bag_id, chejian_id, store_id, cb, fail) {
        var _this = this;
        my.util.send('user->editUser', {
            loginid: loginid,
            password: password,
            user_name: user_name,
            level_name: level_name,
            bumen: bumen,
            bag_id: bag_id,
            chejian_id: chejian_id,
            store_id: store_id,
            user_id: user_id
        }, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail();
                return;
            }
            if (cb && typeof cb == 'function') cb();
        });
    },
    //检测登录状态
    chkLoginStatus: function (sucess, fail) {
        var _this = this;
        my.util.send('user->chkStatus', {}, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail();
                return;
            }
            _this.info = data;
            _this.initLoginInfo();
            if (sucess && typeof sucess == 'function') sucess();
        });
    },

    //删除用户
    delUser: function (loginid, cb) {
        var _this = this;
        my.util.send('user->delUser', { loginid: loginid }, function (data) {
            if (cb && typeof cb == 'function') cb();
        });
    },
    //修改密码
    changePassword: function (oldpass, newpass, sucess, fail) {
        var _this = this;
        my.util.send('user->changePass', { oldpass: oldpass, newpass: newpass }, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail(data.status);
                return;
            }
            if (sucess && typeof sucess == 'function') sucess();
        });
    },
    //退出登录
    logout: function (cb) {
        var _this = this;
        my.util.send('user->logOut', {}, function () {
            _this.info = {};
            if (cb && typeof cb == 'function') cb();
        });
    },

    //检查权限
    checkPower: function (type) {
        var dispower = ['main'];
        if (this.power['admin'] == 1) return true;//超级管理员
        if (this.power[type] == 1) return true;
        if ($.inArray(type, dispower) != -1) return true;
        return false;
    },
    returnPower: function (type) {
        if (!this.checkPower(type)) return my.view.message('权限不足，请联系管理员。');
    },
    //检测用户的任务队列
    chkTask: function () {
        var _this = this;
        my.notice.clear();

        _this.chkIE6(function () {
            _this.chkUpdate(function (date) {
            });
        });

    },
    chkIE6: function (cb) {
        if (isIE6) {
            my.notice.add('您当前使用的浏览器版本过低，为获取更好的使用体验，请升级至高版本IE、chrome、firefox，点击获取最新IE版本。', function () {
                window.location.href = "http://windows.microsoft.com/zh-cn/internet-explorer/download-ie";
            });
        } else {
            if (cb && typeof cb == 'function') cb();//没有该任务则回调
        }
    },
    //有无最新报表需要生成
    chkUpdate: function (cb) {
        var _this = this;
        if (!my.user.checkPower('系统配置')) return;
        my.util.send('getLastUpdate', {}, function (data) {
            if (data.newday != data.reportday) {
                var d = new Date(data.reportday.replace('-', '/'));
                d.setDate(d.getDate() + 1);
                var es = d.format('yyyy-MM-dd');
                my.notice.add(es + '至' + data.newday + '的报表尚未生成，点击开始生成报表。', function () {
                    my.view.load('on');
                    my.util.send('updateReport', {}, function () {
                        my.view.message('生成报表成功！', 1, function () {
                            my.user.chkTask();
                        });
                    });
                });
            } else {
                if (cb && typeof cb == 'function') cb();//没有该任务则回调
            }
        });
    },
    //有无门店信息需要完善
    chkEditStore: function (cb) {

    }
};
//订单状态配置
my.orderStatus = {
    1: '<font color=red>等待发货</font>',
    2: '<font color=red>等待确认收货</font>',
    3: '<font color=blue>等待收货审核</font>',
    4:'<font color=blue>等待审核</font>',
    0: '<font color=green>已结束</font>'
};
//物品处理类
my.goods = {
    div: null,//窗体dom
    goodsList: [],//物品列表数组
    searchResult: [],//搜索结果缓存
    perpage: 10,//每页条数
    quick_search:true,//快速搜索
    //获取一条记录，返回物品编码
    getOne:function(arr,cb){
        this.showList(arr, cb);
    },
    setEvent: function (cb) {
        //选择
        var _this = this;
        $(".submit_order", this.div).click(function () {
            if (cb && typeof cb == 'function') {
                cb($(this).data('id'));
            }
            _this.hide();
        });
    },
    //显示物品列表，弹窗形式
    showList: function (arr, cb) {
        this.goodsList = arr;
        this.searchResult = arr;
        var _this = this;
        var div = document.createElement('div');
        var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
        var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
        var left = (maxwidth - 900) / 2;
        var top = (maxheight - 500) / 2;
        this.bg = document.createElement('div');
        this.bg.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:" + maxheight + "px;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;background:#000;z-index:10;";


        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";
        $(div).append('<table border="0" cellspacing="0" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist"><tr>\
                    <th colspan="5" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>添加物品</b> &nbsp;&nbsp;&nbsp;&nbsp;\
                        <input type="checkbox" id="quick_search" checked> 快速查询  \
                        <a class="ico tips"><div class="tips_content" style="width:300px;"><div class="tips_arrow">◆</div>\
                            支持按\
                            <b><font color="red">食材编码</font></b>、\
                            <b><font color="red">名称</font></b>、\
                            <b><font color="red">名称拼音首字母</font></b>搜索。<br>\
                            支持多关键词搜索，关键词之间以空格分开。如搜索 <b><font color="red">010 肥牛 GL</font></b> ，即可搜索到 <b><font color="red">咖喱（加肥牛）</font></b><br>\
                            选中快速查询后，可即输即查，无需点击 <b><font color="red">查询</font></b> 按钮。<br>\
                            如电脑配置较低，出现卡机情况，请去掉“快速查询”勾选，输入关键词后，点击“查询”按钮进行搜索。\
                         </div></a>\
                        关键词：<input type="text" id="keyword" class="input3"> \
                        <a  class="city_submit" id="search_start">查询</a>\
                        </span><span style="float:right"><a class="close">关闭</a></span>    \
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">编码</th>\
                    <th>名称</th>\
                    <th width="120">规格</th>\
                    <th width="70">单位</th>\
                    <th width="80">操作</th>\
                </tr></table>');
        $(document.body).append(div);
        this.div = div;
        $("#keyword", div).bind('keyup', function () {//实时搜索
            if (!$("#quick_search", div).attr('checked')) return;
            _this.search($(this).val().trim(),cb);
        });
        $("#search_start", div).bind('click', function () {//点击搜索
            _this.search($("#keyword").val().trim(), cb);
        });
        $("#quick_search").click(function () {//切换实时搜索
            if ($(this).attr('checked')) {
                _this.quick_search = true;
            } else {
                _this.quick_search = false;
            }
        });
        $(".tips",div).unbind().bind('mouseover click', function () {//小提示
            $("div", this).stop().show();
        });
        $(".tips", div).bind('mouseout', function () {//小提示
            $("div", this).stop().hide();
        });

        $(".close", div).click(function () { _this.hide(); });
        $(div).fadeIn();

        $(document.body).append(this.bg);
        $(this.bg).bind('click', function () { _this.hide(); });

        this.search('', cb);
    },
    //隐藏物品列表
    hide: function () {
        $(this.div).remove();
        $(this.bg).hide();
    },
    //智能搜索
    search:function(key,cb){
        var arrkey = key.split(' ');
        var res;
        var tmparr = this.goodsList;
        var _this = this;
        $.each(arrkey, function () {//支持多重条件搜索
            key = this;
            if (!key) return true;//为空则跳过
            res = [];//检索结果
            var keytype = _this.getKeyType(key);//搜索类型
            $.each(tmparr, function () {
                if (this.goods_type) return true;//隐藏已有分类的结果
                if (keytype == 1) {//数字查询
                    if (this.cInvCode.toString().indexOf(key.toString()) > -1) {
                        res.push(this);
                    }
                } else if (keytype == 2) {//拼音
                    var tmpThis = this;
                    $.each(this.py, function () {
                        if (this.indexOf(key.toUpperCase().toString()) > -1) {
                            res.push(tmpThis);
                            return false;//避免多音重复
                        }
                    });
                } else if (keytype == 3) {//中文
                    if (this.cInvName.toString().indexOf(key.toString()) > -1) {
                        res.push(this);
                    }
                }
            });
            tmparr = res;
        });
        this.searchResult = res;//缓存搜索结果，提供翻页使用
        this.insertTable(res,1,cb);
    },
    //获取关键词类型，数字返回1，拼音返回2，字符返回3
    getKeyType: function (key) {
        if (!isNaN(key)) return 1;
        var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        return !patrn.exec(key)?2:3;
    },
    //将搜索结果插入到表格，page参数为分页使用，默认为1
    insertTable: function (arr, page,cb) {
        var _this = this;
        var perpage = this.perpage;//每页显示条数
        //计算分页
        if (!page) page = 1;
        var total_page = Math.ceil(arr.length / perpage);
        if (page < 1) page = 1;
        if (page > total_page) page = total_page;
        //清空表格
        $("tr",this.div).each(function (i) {
            if (i < 2) return true;
            $(this).remove();
        });
        //生成tr
        var container = document.createDocumentFragment();
        for (var i = 1; i <= perpage; i++) {
            var tr = document.createElement('tr');
            if (arr[(page - 1) * perpage + i - 1]) {
                var tmp = arr[(page - 1) * perpage + i - 1];
            }else{
                tmp = {cInvCode:'--'};
            }
            tr.appendChild(this.th(tmp.cInvCode));
            tr.appendChild(this.td(tmp.cInvName));
            tr.appendChild(this.td(tmp.cInvStd));
            tr.appendChild(this.td(tmp.cInvUnit));
            tmp.baozhuang_num = tmp.baozhuang_num ? tmp.baozhuang_num : '';
            tmp.order_nums = tmp.order_nums ? tmp.order_nums : '';

            if (tmp.goods_type) {
                tr.appendChild(_this.td(tmp.goods_type));
            } else {
                if (tmp.cInvCode == '--') {
                    tr.appendChild(_this.td(tmp.cInvCode));
                } else {
                    tr.appendChild(_this.td('<a  class="submit_order" data-code="' + tmp.cInvCode + '" data-id="' + tmp.cInvCode + '">选择</a>'));
                }
            }
            
            container.appendChild(tr);
        }
        $("table",this.div).append(container);//插入搜索结果
        //处理翻页html
        var str = '<tr class="showpage"><th colspan="5">';
        str += '<a data-page="1">首页</a>';
        str += '<a data-page="' + (page - 1) + '">上一页</a>';
        str += '<a data-page="' + (page + 1) + '">下一页</a>';
        str += '<a data-page="' + (total_page) + '">尾页</a>';
        str += '共有' + arr.length + '条记录&nbsp;&nbsp;&nbsp;&nbsp;当前第' + page + '页/' + total_page + '页&nbsp;&nbsp;&nbsp;&nbsp;';
        str += '每页显示<input type="text" style="width:30px;" id="perpage" value="' + perpage + '">条记录';

        $("table", this.div).append(str);
        this.setEvent(cb);
        //分页
        $(".showpage a",this.div).click(function () {
            var tmppage = $(this).data('page');
            _this.insertTable(_this.searchResult, tmppage,cb);
        });
        //切换分页数
        $("#perpage", this.div).bind('change', function () {
            var perpage = parseInt($(this).val());
            if (!perpage) perpage = 10;
            if (perpage < 1) perpage = 1;
            if (perpage > 100) perpage = 100;
            _this.perpage = perpage;
            _this.insertTable(_this.searchResult,page, cb);
        });
        //选中变色
        $("table tr", this.div).bind('mouseover', function () {//表格选中行变色
            $('td', this).css('background-color', '#D3F0F1');
        });
        $("table tr", this.div).bind('mouseout', function () {//表格选中行变色
            $('td', this).css('background-color', '#fff');
        });
    },
    td: function (str,cfg) {
        var tmp = document.createElement('td');
        if (!cfg) cfg = {};
        var classname = cfg.classname;
        var colspan = cfg.colspan;
        if (classname) tmp.className = classname;
        if (colspan) tmp.colSpan = colspan;
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    },
    th: function (str) {
        var tmp = document.createElement('th');
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    }
}

//物品处理类
my.persons = {
    div: null,//窗体dom
    goodsList: [],//物品列表数组
    searchResult: [],//搜索结果缓存
    perpage: 10,//每页条数
    quick_search:true,//快速搜索
    //获取一条记录，返回物品编码
    getOne:function(arr,cb){
        this.showList(arr, cb);
    },
    setEvent: function (cb) {
        //选择
        var _this = this;
        $(".submit_order", this.div).click(function () {
            if (cb && typeof cb == 'function') {
                cb($(this).data('id'));
            }
            _this.hide();
        });
    },
    //显示物品列表，弹窗形式
    showList: function (arr, cb) {
        this.goodsList = arr;
        this.searchResult = arr;
        var _this = this;
        var div = document.createElement('div');
        var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
        var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
        var left = (maxwidth - 900) / 2;
        var top = (maxheight - 500) / 2;

        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";
        this.bg = document.createElement('div');
        this.bg.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:" + maxheight + "px;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;background:#000;z-index:10;";

        var department_str = '';
        $.each(my.departments, function () {
            department_str += '<option value="' + this.department + '">' + this.department + '</option>';
        })

        var store_str = '';
        $.each(my.stores, function () {
            store_str += '<option value="' + this.store_id + '">' + this.store_name + '</option>';
        })

        var bag_str = '';
        $.each(my.bags, function () {
            bag_str += '<option value="' + this.bag_id + '">' + this.bag_name + '</option>';
        })

        var chejian_str = '';
        $.each(my.chejians, function () {
            chejian_str += '<option value="' + this.chejian_id + '">' + this.chejian_name + '</option>';
        })
        $(div).append('<table border="0" cellspacing="0" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist"><tr>\
                    <th colspan="5" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>选择人员</b> &nbsp;&nbsp;&nbsp;&nbsp;\
                        <input type="checkbox" id="quick_search" checked> 快速查询  \
                        <a class="ico tips"><div class="tips_content" style="width:300px;"><div class="tips_arrow">◆</div>\
                            支持按\
                            <b><font color="red">ID</font></b>、\
                            <b><font color="red">姓名</font></b>、\
                            <b><font color="red">姓名拼音首字母</font></b>搜索。<br>\
                            支持多关键词搜索，关键词之间以空格分开。<br>\
                            选中快速查询后，可即输即查，无需点击 <b><font color="red">查询</font></b> 按钮。<br>\
                            如电脑配置较低，出现卡机情况，请去掉“快速查询”勾选，输入关键词后，点击“查询”按钮进行搜索。\
                         </div></a>\
<select name="department"><option value="">选择部门</option>'+department_str+'</select>\
<select name="store" style="display:none"><option value="">选择门店</option>' + store_str + '</select>\
<select name="bag" style="display:none"><option value="">选择仓库</option>' + bag_str + '</select>\
<select name="chejian" style="display:none"><option value="">选择车间</option>' + chejian_str + '</select>\
                        关键词：<input type="text" id="keyword" class="input3" style="width:100px;"> \
                        <a  class="city_submit" id="search_start">查询</a>\
                        </span><span style="float:right"><a class="close">关闭</a></span>    \
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">ID</th>\
                    <th>姓名</th>\
                    <th width="120">部门</th>\
                    <th width="70">职位</th>\
                    <th width="80">操作</th>\
                </tr></table>');
        $(document.body).append(div);
        this.div = div;
        $("select[name='department']", div).bind('change', function () {
            var department = $(this).val();
            $("select[name='store']", div).hide();
            $("select[name='bag']", div).hide();
            $("select[name='chejian']", div).hide();
            if (department == '门店') {
                $("select[name='store']", div).show();
            }
            if (department == '仓库') {
                $("select[name='bag']", div).show();
            }
            if (department == '加工中心') {
                $("select[name='chejian']", div).show();
            }
            _this.search($("#keyword").val().trim(), cb, department);
        });
        $("select[name='store'],select[name='bag'],select[name='chejian']", div).bind('change', function () {
            var department = $("select[name='department']", div).val();
            var depcode = $(this).val();
            _this.search($("#keyword").val().trim(), cb, department,depcode);
        });
        $("#keyword", div).bind('keyup', function () {//实时搜索
            if (!$("#quick_search", div).attr('checked')) return;
            var department = $("select[name='department']", div).val();
            var depcode = $("select[name='store']", div).val() || $("select[name='bag']", div).val() || $("select[name='chejian']", div).val();
            _this.search($(this).val().trim(),cb,department,depcode);
        });
        $("#search_start", div).bind('click', function () {//点击搜索
            var department = $("select[name='department']", div).val();
            var depcode = $("select[name='store']", div).val() || $("select[name='bag']", div).val() || $("select[name='chejian']", div).val();
            _this.search($("#keyword").val().trim(), cb,department, depcode);
        });
        $("#quick_search").click(function () {//切换实时搜索
            if ($(this).attr('checked')) {
                _this.quick_search = true;
            } else {
                _this.quick_search = false;
            }
        });
        $(".tips",div).unbind().bind('mouseover click', function () {//小提示
            $("div", this).stop().show();
        });
        $(".tips", div).bind('mouseout', function () {//小提示
            $("div", this).stop().hide();
        });
        
        $(document.body).append(this.bg);
        $(this.bg).bind('click', function () { _this.hide(); });

        $(".close", div).click(function () { _this.hide(); });
        $(div).fadeIn();
        this.search('', cb);
    },
    //隐藏物品列表
    hide: function () {
        $(this.div).remove();
        $(this.bg).hide();
    },
    //智能搜索
    search:function(key,cb,department,depcode){
        var arrkey = key.split(' ');
        var res;
        var tmparr = this.goodsList;
        var _this = this;
        $.each(arrkey, function () {//支持多重条件搜索
            key = this;
            if (!key) return true;//为空则跳过
            res = [];//检索结果
            var keytype = _this.getKeyType(key);//搜索类型
            $.each(tmparr, function () {
                if (department && this.department != department) return true;//按部门查看
                if (department == '门店' && depcode && this.store_id != depcode) return true;
                if (department == '加工中心' && depcode && this.chejian_id != depcode) return true;
                if (department == '仓库' && depcode && this.bag_id != depcode) return true;
                if (this.goods_type) return true;//隐藏已有分类的结果
                if (keytype == 1) {//数字查询
                    if (this.id.toString().indexOf(key.toString()) > -1) {
                        res.push(this);
                    }
                } else if (keytype == 2) {//拼音
                    var tmpThis = this;
                    $.each(this.py, function () {
                        if (this.indexOf(key.toUpperCase().toString()) > -1) {
                            res.push(tmpThis);
                            return false;//避免多音重复
                        }
                    });
                } else if (keytype == 3) {//中文
                    if (this.true_name.toString().indexOf(key.toString()) > -1) {
                        res.push(this);
                    }
                }
            });
            tmparr = res;
        });
        this.searchResult = res;//缓存搜索结果，提供翻页使用
        this.insertTable(res,1,cb);
    },
    //获取关键词类型，数字返回1，拼音返回2，字符返回3
    getKeyType: function (key) {
        if (!isNaN(key)) return 1;
        var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        return !patrn.exec(key)?2:3;
    },
    //将搜索结果插入到表格，page参数为分页使用，默认为1
    insertTable: function (arr, page,cb) {
        var _this = this;
        var perpage = this.perpage;//每页显示条数
        //计算分页
        if (!page) page = 1;
        var total_page = Math.ceil(arr.length / perpage);
        if (page < 1) page = 1;
        if (page > total_page) page = total_page;
        //清空表格
        $("tr",this.div).each(function (i) {
            if (i < 2) return true;
            $(this).remove();
        });
        //生成tr
        var container = document.createDocumentFragment();
        for (var i = 1; i <= perpage; i++) {
            var tr = document.createElement('tr');
            if (arr[(page - 1) * perpage + i - 1]) {
                var tmp = arr[(page - 1) * perpage + i - 1];
            }else{
                tmp = {id:'--'};
            }
            tr.appendChild(this.th(tmp.id));
            tr.appendChild(this.td(tmp.true_name));
            tr.appendChild(this.td(tmp.department == '门店' ? '门店（' + getStoreName(tmp.store_id) + '）' : (tmp.department=='仓库'?'仓库（'+getBagName(tmp.bag_id)+'）':(tmp.department=='加工中心'?'加工中心（'+getChejianName(tmp.chejian_id)+'）':tmp.department))));
            tr.appendChild(this.td(tmp.job));
            tmp.baozhuang_num = tmp.baozhuang_num ? tmp.baozhuang_num : '';
            tmp.order_nums = tmp.order_nums ? tmp.order_nums : '';

            if (tmp.goods_type) {
                tr.appendChild(_this.td(tmp.goods_type));
            } else {
                if (tmp.id == '--') {
                    tr.appendChild(_this.td(tmp.id));
                } else {
                    tr.appendChild(_this.td('<a  class="submit_order" data-code="' + tmp.id + '" data-id="' + tmp.id + '">选择</a>'));
                }
            }
            
            container.appendChild(tr);
        }
        $("table",this.div).append(container);//插入搜索结果
        //处理翻页html
        var str = '<tr class="showpage"><th colspan="5">';
        str += '<a data-page="1">首页</a>';
        str += '<a data-page="' + (page - 1) + '">上一页</a>';
        str += '<a data-page="' + (page + 1) + '">下一页</a>';
        str += '<a data-page="' + (total_page) + '">尾页</a>';
        str += '共有' + arr.length + '条记录&nbsp;&nbsp;&nbsp;&nbsp;当前第' + page + '页/' + total_page + '页&nbsp;&nbsp;&nbsp;&nbsp;';
        str += '每页显示<input type="text" style="width:30px;" id="perpage" value="' + perpage + '">条记录';

        $("table", this.div).append(str);
        this.setEvent(cb);
        //分页
        $(".showpage a",this.div).click(function () {
            var tmppage = $(this).data('page');
            _this.insertTable(_this.searchResult, tmppage,cb);
        });
        //切换分页数
        $("#perpage", this.div).bind('change', function () {
            var perpage = parseInt($(this).val());
            if (!perpage) perpage = 10;
            if (perpage < 1) perpage = 1;
            if (perpage > 100) perpage = 100;
            _this.perpage = perpage;
            _this.insertTable(_this.searchResult,page, cb);
        });
        //选中变色
        $("table tr", this.div).bind('mouseover', function () {//表格选中行变色
            $('td', this).css('background-color', '#D3F0F1');
        });
        $("table tr", this.div).bind('mouseout', function () {//表格选中行变色
            $('td', this).css('background-color', '#fff');
        });
    },
    td: function (str,cfg) {
        var tmp = document.createElement('td');
        if (!cfg) cfg = {};
        var classname = cfg.classname;
        var colspan = cfg.colspan;
        if (classname) tmp.className = classname;
        if (colspan) tmp.colSpan = colspan;
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    },
    th: function (str) {
        var tmp = document.createElement('th');
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    }
}
//翻页类
/*
传入参数：
    写入的JQUERY对象，
    总数，
    每页条数，
    页数，
    翻页处理回调函数，
    修改每页条数函数
*/
my.querypage = {
    show: function (el,total,perpage,page,gopage,setperpage) {
        var container = document.createDocumentFragment();
        var str = '';
        var maxpage = Math.ceil(total / perpage);
        if (page < 1) page = 1;
        if (page > maxpage) page = maxpage;
        str += '<a data-page="1">首页</a>';
        str += '<a data-page="' + (page - 1) + '">上一页</a>';
        str += '<a data-page="' + (page + 1) + '">下一页</a>';
        str += '<a data-page="' + (maxpage) + '">尾页</a>';
        str += '共有' + total + '条记录&nbsp;&nbsp;&nbsp;&nbsp;当前第' + page + '页/' + maxpage + '页&nbsp;&nbsp;&nbsp;&nbsp;';
        str += '每页显示<input type="text" style="width:30px;" value="' + perpage + '" name="perpage">条记录';
        $(container).append(str);
        $(el).append(container);
        $('a', $(el)).bind('click', function () {
            var page = $(this).data('page');
            
            if (gopage && typeof gopage == 'function') gopage(page);
        });
        $('input[name="perpage"]', $(el)).bind('change', function () {
            var perpage = parseInt($(this).val());
            if (isNaN(perpage)) perpage = 10;
            if (perpage < 1) perpage = 1;
            if (perpage > 100) perpage = 100;
            if (setperpage && typeof setperpage == 'function') setperpage(perpage);
        });
    }
}
//用户组管理类
my.userlevel = {
    //添加用户分组
    addLevel: function (name,power,cb) {
        my.util.send('userlevel->addLevel', { name: name, power: power }, function (data) {
            if (data.status == 1) return my.view.message('用户组已存在，请重试！');
            if (data.status == 2) return my.view.message('请输入用户组名和权限！');
            if(cb && typeof cb=='function') cb();
        });
    },
    //删除用户组
    delLevel: function (name,cb) {
        my.util.send('userlevel->delLevel', { name: name }, function (data) {
            if (data.status == 1) return my.view.message('用户组已存在用户，请先删除用户后重试！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    //编辑用户组
    editLevel: function (name, newname, power,cb) {
        if (!newname) return my.view.message('请输入用户组名称！');
        my.util.send('userlevel->editLevel', { name: name, newname: newname, power: power }, function (data) {
            if (data.status == 1) return my.view.message('用户组已存在，请重试！');
            if (data.status == 2) return my.view.message('请输入用户组名和权限！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    //获取权限列表
    getPowerList: function () {
        var arr = [];
        $.each(my.menu, function () {

        });
    },
    //检测权限，传入权限数组、栏目名
    checkPower: function (power,classname) {

    }
}
my.chejian = {
    add: function (chejian_id,chejian_name,cb,fail) {
        my.util.send('chejian->add', { chejian_id: chejian_id, chejian_name: chejian_name }, function (data) {
            if (data.status === 0) {
                if (cb && typeof cb == 'function') cb();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    },
    edit: function (id,chejian_id, chejian_name, cb, fail) {
        my.util.send('chejian->edit', { chejian_id: chejian_id, chejian_name: chejian_name,id:id }, function (data) {
            if (data.status === 0) {
                if (cb && typeof cb == 'function') cb();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    },
    del: function (id,cb,fail) {
        my.util.send('chejian->del', { id: id }, function (data) {
            if (data.status === 0) {
                if (cb && typeof cb == 'function') cb();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    }
};
my.shuidian = {
    addType: function (biao_name,biao_type,istotal,cb) {
        my.util.send('shuidian->addType', { biao_name: biao_name, biao_type: biao_type, istotal: istotal }, function (data) {
            if (data.status == 1) return my.view.message('请输入表名和表类别！');
            if (data.status == 2) return my.view.message('该类型的表已存在总表，请勿再添加总表！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    editType: function (biao_type_id, biao_name, biao_type, istotal, cb) {
        my.util.send('shuidian->editType', { biao_type_id:biao_type_id,biao_name: biao_name, biao_type: biao_type, istotal: istotal }, function (data) {
            if (data.status == 1) return my.view.message('请输入表名和表类别！');
            if (data.status == 2) return my.view.message('该类型的表已存在总表，请勿再添加总表！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    delType: function (biao_type_id,cb) {
        my.util.send('shuidian->delType', { biao_type_id: biao_type_id }, function (data) {
            if (cb && typeof cb == 'function') cb();
        });
    },
    editBiao: function (arges,cb) {
        my.util.send('shuidian->editBiao', { biao_type_ids: arges.ids, store_id: arges.store_id || '', bag_id: arges.bag_id || '', chejian_id: arges.chejian_id || '' }, function (data) {
            if (data.status != 0) return my.view.message('配置水电表失败！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    editPrice: function (arges, cb) {
        my.util.send('shuidian->editPrice', { list: arges.list, store_id: arges.store_id || '', bag_id: arges.bag_id || '', chejian_id: arges.chejian_id || '' }, function (data) {
            if (data.status == 1) return my.view.message('没有找到需要配置的表！');
            if (data.status == 2) return my.view.message('倍率至少为1倍！');
            if (data.status == 3) return my.view.message('单价必须大于0！');
            if (data.status == 4) return my.view.message('生效日期格式错误！');
            if (data.status == 5) return my.view.message('没有找到需要配置的表！');
            if (data.status != 0) return my.view.message('配置水电表参数失败！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    editZhishu: function (arges,cb) {
        my.util.send('shuidian->editZhishu', { list: arges.list, usedate: arges.usedate || '', store_id: arges.store_id || '', bag_id: arges.bag_id || '', chejian_id: arges.chejian_id || '' }, function (data) {
            if (data.status == 1) return my.view.message('请录入至少一项数据！');
            if (data.status == 2) return my.view.message('表不存在！');
            if (data.status == 3) return my.view.message('表的单价和倍率未设置或录入日期早于生效日期，无法录入数据！');
            if (data.status == 4) return my.view.message('没有录入期初数据时，该日指数不能小于前一天的指数！');
            if (cb && typeof cb == 'function') cb();
        });

    }


}
my.order = {
    
    /*
    统一订单列表的格式。根据传入的订单列表和参数，返回订单列表html
    list：订单列表数据
    fields:所需字段
    more:{
	    txt:更多列，显示文字
        cb:点击后跳转回调
    }
    */
    getList: function (list, fields, more,more1) {
        var _this = this;
        var head = {//文本，td、th，宽度，样式名称
            'order_id': ['单据编号', 'td', '', 'txtleft'],
            'store_id': ['制单部门', 'td', '90'],
            'chejian_id': ['制单部门', 'td', '90'],
            'use_name': ['订货人', 'td', '90'],
            'order_date': ['订货日期', 'td', '90'],
            'order_name': ['订单类别', 'td', '90'],
            'statusTxt': ['处理状态', 'td', '90'],
            'order_type': ['订单类别', 'td', '90'],
            'bagname': ['仓库', 'td', '90'],
            'vendorname': ['供应商', 'td', '90'],
            'storename': ['调入门店', 'td', '90'],
            'senddate': ['发货日期', 'td', '90'],
            'send_user_name': ['发货人', 'td', '90'],
            'recv_user_name': ['收货人', 'td', '90'],
            'recvdate': ['收货日期', 'td', '90'],
            'passdate': ['审核日期', 'td', '90'],
            'pass_user_name': ['审核人', 'td', '90'],
            'user_name': ['制单人', 'td', '90'],
            'goods_type': ['分类', 'td', '90'],
            'adddate':['登记日期','td','90']//只有盘点时调用了此字段，所以限定名称为 盘点日期 。如其他页面需要调用此字段，则需要修改盘点页面。
        };
        var colspan = fields.length;
        if (more) colspan++;

        var res = '';
        var container = document.createElement('table');
        container.className = 'data-load';
        container.border = 0;
        container.cellPadding = 0;
        container.cellSpacing = 0;
        var tbody = document.createElement('tbody');
        container.appendChild(tbody);
        var tr_head = document.createElement('tr');
        $.each(fields, function () {//生成表头
            var tmphead = head[this];
            if (this == 'select') {//单独处理选择框
                tr_head.appendChild(_this.td('选择', {
                    type: 'th',
                    width: 36
                }));
                return true;
            }
            tr_head.appendChild(_this.td(tmphead[0], {
                        type: 'th',
                        width: tmphead[2] ? tmphead[2] : '',
                        classname: tmphead[3] ? tmphead[3] : ''
                    }
                )
            );
        });
        if (more) tr_head.appendChild(_this.td('操作', { type: 'th', width: 120 }));
        tbody.appendChild(tr_head);
        $.each(list, function (k) {//生成列表
            var tr = document.createElement('tr');
            var tmplist = this;
            $.each(fields, function () {
                if (this == 'select') {//单独处理选择框
                    tr.appendChild(_this.td('<input type="checkbox" name="check_order" value="' + tmplist.order_id + '">', { type: 'th' }));
                    return true;
                }
                var tmp = tmplist[this];
                if (this == 'order_id') tmp = '<a>' + tmp + '</a>';
                if (this == 'store_id') tmp = getStoreName(tmp)||getChejianName(tmplist['chejian_id'])||'仓库';
                tr.appendChild(_this.td(tmp, {
                    classname: head[this][3] ? head[this][3] : ''
                }));
            });
            if (more) {
                var tmpstr = '<a class="submit_order">' + more.txt + '</a>';
                if (more1) tmpstr += '<a class="submit_order" style="margin-left:10px;">' + more1.txt + '</a>';
                //console.log(tmplist.status);
                //if (tmplist.status == 1) tmpstr += '<a class="delorder">删除</a>';
                tr.appendChild(_this.td(tmpstr));
            }
            $('a', tr).bind('click', function () {
                more.cb(tmplist.order_id);
            });
            if (more1) {
                $('a.submit_order', tr).eq(1).unbind().bind('click', function () {
                    more1.cb(tmplist.order_id);
                });
            }
            tbody.appendChild(tr);
        });
        if (fields[0] == 'select') {//单独处理选择框
            $(tbody).append('<tr class="showpage"><th colspan="' + colspan + '"><input type="checkbox" name="check_all"> 全选\
<span class="city_submit"  id="submit_order" >合并查看选中单据</span>&nbsp;&nbsp;&nbsp;&nbsp;\
</th></tr>');
        }else{
            $(tbody).append('<tr class="showpage"><th colspan="' + colspan + '"></th></tr>');
        }
        return container;
    },
    //根据订单详情，生成最终详情页面
    //订单详情、订单物品清单
    getContent: function (info, list, types, fields, more, ids, bPrint) {
        var _this = this;
        /*
        <tr>
        <th width="100">分类</th>
        <th width="100">编码</th>
        <th class="txtleft">名称</th>
        <th width="80">订货数量</th>
        <th width="80">包装数量</th>
        <th width="120">规格</th>
        <th width="70">库存单位</th>
        <th width="70">包装单位</th>
        <th width="80">包装换算率</th>
        <th width="80">定额换算率</th>
    </tr>
    {foreach $list as $k=>$v}
        <tr>
            {if $v['total']==1}<th rowspan="{$types[$v['type_name']]}">{$v['type_name']}</th>
            {/if}
            <td>{$v['bianhao']}</td>
            <td class="txtleft">{$v['name']}</td>
            <td>{$v['order_nums']}</td>
            <td>{$v['baozhuang_num']}</td>
            <td>{if($v['guige'])}{$v['guige']}{/if}</td>
            <td>{$v['kucun_danwei']}</td>
            <td>{$v['baozhuang_danwei']}</td>
            <td>{$v['baozhuang_hsl']}</td>
            <td>{$v['kucun_hsl']}</td>
        </tr>
    {/foreach}
    'type_name', 'bianhao', 'name', 'guige', 'order_nums','real_send','recv_send','chayi','chayi_yuanyin','kucun_danwei
        */
        var head = {//文本，td、th，宽度，样式名称
            'type_name': ['分类', 'td', '80'],
            'bianhao': ['编码', 'td', '80'],
            'name': ['名称', 'td', '', 'txtleft'],
            'order_nums': ['订货数量', 'td', '60'],
            'order_nums_edit': ['订货数量', 'td', '60'],
            'guige': ['规格', 'td', '90'],
            'kucun_danwei': ['单位', 'td', '40'],
            'real_send': ['实发','',40,'real_send'],
            'real_recv': ['实收', '', 40],
            'chayi': ['差异', '', 40,'chayi'],
            'chayi_yuanyin': ['差异原因', '', 100],
            'cost': ['单价', '', 90],
            'real_send_edit':['实发','',70],
            'real_recv_edit': ['实收','','70'],
            'chayi_yuanyin_edit': ['差异原因', '', '100'],
            'baosun_num': ['报损数量', '', '100'],
            'baosun_yuanyin': ['报损原因', '', '150']
        };
        var container = document.createElement('table'), tr_head,tr_head_str;
        container.className = 'data-load';
        container.border = 0;
        container.cellPadding = 0;
        container.cellSpacing = 0;
        var tbody = document.createElement('tbody');
        container.appendChild(tbody);
        var colspan = fields.length;
        //订单状态配置
        //my.orderStatus = {
        //    1: '<font color=red>等待发货</font>',
        //    2: '<font color=red>等待确认收货</font>',
        //    3: '<font color=blue>等待收货审核</font>',
        //    0: '<font color=green>已结束</font>'
        //};

        //合并出库单 只有一行
        if (ids) {
            tr_head = document.createElement('tr');
            tr_head_str = '';//合并出库单';//：<span class="order_info_txt" style="width:auto;">' + ids + '</span>';
            if (bPrint) tr_head_str += '<span style="float:right;padding-right:20px;"><a class="city_submit" id="print_order" target="_blank" href="#">打印出库单</a></span>';
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 8) {//退库
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">退库出库单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">退库日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }

            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 7) {//补发
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">补发出库单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">补发日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 6) {//报损
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">成品报损登记单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损部门：<span class="order_info_txt" style="width:100px;">' + (getStoreName(info.store_id) || getChejianName(info.chejian_id)) + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 5) {//报损
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">材料报损登记单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损部门：<span class="order_info_txt" style="width:100px;">' + (getStoreName(info.store_id) || getChejianName(info.chejian_id)) + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 4) {//盘点
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">' + info.order_name + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:240px;">单据编号：<span class="order_info_txt" style="width:160px;">' + info.order_id + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">盘点日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">盘点部门：<span class="order_info_txt" style="width:100px;">' + (getStoreName(info.store_id) || getChejianName(info.chejian_id)) + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else {
            //第一行
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">' + info.order_name + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:240px;">单据编号：<span class="order_info_txt" style="width:160px;">' + info.order_id + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">处理状态：<span class="order_info_txt" style="width:100px;">' + info.statusTxt + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            if (bPrint) tr_head_str += '<span style="float:right;padding-right:20px;"><a class="city_submit" id="print_order" target="_blank" href="#">打印出库单</a></span>';
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
            //第二行
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1">制单部门：<span class="order_info_txt">' + (getStoreName(info.store_id)||getChejianName(info.chejian_id)) + '</span></span>';
            tr_head_str += '<span class="order_info_1">制单人：<span class="order_info_txt">' + info.user_name + '</span></span>';
            tr_head_str += '<span class="order_info_1">制单日期：<span class="order_info_txt">' + info.adddate + '</span></span>';
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
            if (info.order_type != 3 && (info.status > 1 || info.status == 0)) {//调入调出订单无需发货，直接等待确认
                //第三行
                tr_head = document.createElement('tr');
                if (info.order_type == 1) {//总部订单，仓库发货
                    tr_head_str = '<span class="order_info_1">发货部门：<span class="order_info_txt">' + info.bagname + '</span></span>';
                } else if (info.order_type == 2) {//直供订单，供应商发货
                    tr_head_str = '<span class="order_info_1" style="width:340px;">发货部门：<span class="order_info_txt" style="width:260px;">' + info.vendorname + '</span></span>';
                }
                if (info.order_type == 1) {//直供订单无此项目
                    tr_head_str += '<span class="order_info_1">发货人：<span class="order_info_txt">' + info.send_user_name + '</span></span>';
                    tr_head_str += '<span class="order_info_1">发货日期：<span class="order_info_txt">' + info.order_date + '</span></span>';
                }
                tr_head.appendChild(_this.td(tr_head_str, {
                    type: 'th',
                    classname: 'txtleft',
                    colspan: colspan
                }));
                tbody.appendChild(tr_head);
            }
            //第四行
            if ((info.status == 3 || info.status == 0) && info.order_type != 2) {//等待审核和结束
                tr_head = document.createElement('tr');
                tr_head_str = '<span class="order_info_1">确认人：<span class="order_info_txt">' + (info.recv_user_name ? info.recv_user_name : '') + '</span></span>';
                tr_head_str += '<span class="order_info_1">确认日期：<span class="order_info_txt">' + (info.recvdate ? info.recvdate : '') + '</span></span>';
                tr_head.appendChild(_this.td(tr_head_str, {
                    type: 'th',
                    classname: 'txtleft',
                    colspan: colspan
                }));
                tbody.appendChild(tr_head);
            }

            //第五行
            if (info.order_type != 3 && info.status == 0) {//调入调出无需审核 and 订单已结束
                tr_head = document.createElement('tr');
                tr_head_str = '<span class="order_info_1">审核人：<span class="order_info_txt">' + (info.pass_user_name ? info.pass_user_name : '') + '</span></span>';
                tr_head_str += '<span class="order_info_1">审核日期：<span class="order_info_txt">' + (info.passdate ? info.passdate : '') + '</span></span>';
                tr_head.appendChild(_this.td(tr_head_str, {
                    type: 'th',
                    classname: 'txtleft',
                    colspan: colspan
                }));
                tbody.appendChild(tr_head);
            }
        }
        //表头
        tr_head = document.createElement('tr');
        $.each(fields, function () {//生成表头
            var tmphead = head[this];
            if (this == 'order_nums' && (info.order_type == 7 || info.order_type == 8)) {//补发 退库  订货数量修正为数量
                tr_head.appendChild(_this.td('数量', {
                    type: 'th',
                    width: tmphead[2] ? tmphead[2] : '',
                    classname: tmphead[3] ? tmphead[3] : ''
                }));
                return true;
            }
            if (this == 'order_nums' && (info.order_type == 5 || info.order_type == 6)) {//报损 订货数量修正为报损数量
                tr_head.appendChild(_this.td('报损数量', {
                    type: 'th',
                    width: tmphead[2] ? tmphead[2] : '',
                    classname: tmphead[3] ? tmphead[3] : ''
                }));
                return true;
            }
            if (this == 'order_nums' && info.order_type == 4) {//盘点 订货数量修正为盘点数量
                tr_head.appendChild(_this.td('盘点数量', {
                    type: 'th',
                    width: tmphead[2] ? tmphead[2] : '',
                    classname: tmphead[3] ? tmphead[3] : ''
                }));
                return true;
            }
            tr_head.appendChild(_this.td(tmphead[0], {
                type: 'th',
                width: tmphead[2] ? tmphead[2] : '',
                classname: tmphead[3] ? tmphead[3] : ''
            }));
        });
        tbody.appendChild(tr_head);
        //列表
        $.each(list, function (k) {//生成列表
            var tr = document.createElement('tr');
            var tmplist = this;
            $.each(fields, function () {
                //单独处理财务修改
                if (more == '修改') {
                    if (this == 'order_nums_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="order_nums" class="input4" value="' + tmplist['order_nums'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'real_send_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="real_send" class="input4" value="' + tmplist['real_send'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'real_recv_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="real_recv" class="input4" value="' + tmplist['real_recv'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'chayi_yuanyin_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="chayi_yuanyin" class="input4" value="' + tmplist['chayi_yuanyin'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                } else {
                    if (this == 'real_send_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="shifa_num" class="input4" value="' + tmplist['order_nums'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'real_recv_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="shishou_num" class="input4" value="' + tmplist['real_send'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'chayi_yuanyin_edit') {//差异编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="chayi_yuanyin" class="input4"  data-id="' + tmplist['bianhao'] + '" style="width:66px;">', {
                        }));
                        return true;
                    }
                }
                var tmp = tmplist[this];
                if (this == 'chayi') {
                    if (info.status < 3) {
                        tmp = '';//还没有确认收货，没有差异
                    } else {
                        tmp = parseInt(parseFloat(tmplist['real_recv'] * 10000) - parseFloat(tmplist['real_send'] * 10000)) / 10000;
                    }
                }
                var rowspan = '';
                var tmptype = 'td';
                if (this == 'type_name') {
                    if (tmplist['total'] != 1) return true;
                    rowspan = types[tmplist['type_name']];
                    tmptype = 'th';
                    if (!tmp) tmp = '临时增加';
                }
                
                tr.appendChild(_this.td(tmp, {
                    classname: head[this][3] ? head[this][3] : '',
                    rowspan: rowspan,
                    type:tmptype
                }));
            });
            $('a', tr).bind('click', function () {
                more.cb(tmplist.order_id);
            });
            tbody.appendChild(tr);
        });
        return container;
    },
    td: function (str, cfg) {
        cfg = cfg || {};
        var attr = cfg.type ? cfg.type : 'td';
        
        var tmp = document.createElement(attr);
        if (cfg.classname) tmp.className = cfg.classname;
        if (cfg.colspan) tmp.colSpan = cfg.colspan;
        if (cfg.rowspan) tmp.rowSpan = cfg.rowspan;
        if (cfg.width) tmp.width = cfg.width;
        tmp.innerHTML = str ? str : '&nbsp;';
        return tmp;
    }
};

my.node = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode:'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.code] = this;
        }); 
        //生成节点对象
        var baseinfo = { code: '编号', name: '项目名称', level: 0, parentcode: '' };
        var baseNode = new my.child(baseinfo);//根节点
        this.nodes = baseNode;
        $.each(this.nodelist, function () {
            _this.createChild(this);
        });
        this.nodes.open();
        $(el).append(this.nodes.fresh());
        this.nodelist['编号'] = baseinfo;
        this.nodelist['编号'].ref = this.nodes;
        this.bindEvent();
    },
    getChildByCode: function (code) {
        return this.nodelist[code].ref;
    },
    createChild: function (cfg) {
        if (!cfg) return;
        var child = new my.child(cfg);
        if (cfg.parentcode) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parentcode] || !this.nodelist[cfg.parentcode].ref) {
                if (!this.nodelist[cfg.parentcode]) return;
                var parent = this.createChild(this.nodelist[cfg.parentcode]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parentcode].ref.addChild(child);
            }
        } else {
            cfg.parentcode = '编号';
            child.parentcode = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        console.log(this.getTime() - this.starttime);
    },
    bindEvent: function () {
        var _this = this;
        $(".node_ul",this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#D3F0F1').find('.node_edit').show();
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            $(this).css('background-color', '#F5F5F5').find('.node_edit').hide();
        });
        $('a', this.el).unbind().bind('click', function (e) {
            e.stopPropagation();
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            var type = $(this).data('type');
            _this.clickEvent(code,type);
        });
        $(".node_ul", this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    },
    clickEvent: function (code, type) {
        var _this = this;
        console.log(code);
        if (type == 'add') {
            _this.addChild(code);
        } else if (type == 'del') {
            if (confirm('是否确定删除？删除后将不可恢复！')) {
                my.util.send('yusuan->delItem', {
                    code: code
                }, function (data) {
                    if (data.status != 0) return my.view.message('删除失败！');
                    _this.nodelist[_this.nodelist[code].parentcode].ref.delChild(code);
                });
            }
        } else if (type == 'edit') {
            _this.editChild(code);
        }
    },
    addChild: function (parentcode) {
        var _this = this;
        var parent = this.getChildByCode(parentcode);
        if (parent.status == 0) {
            parent.changeStatus();
        }
        var code = parent.createChildCode();
        var info = { code: code, name: '', parentcode: parentcode, level: parent.level + 1 };
        var child = new my.child(info);
        var dom = parent.getChildDom();
        if (dom.length == 0) {
            parent.getDom().after('<div class="node_childs" id="child'+parent.code+'"></div>');
            dom = parent.getChildDom();
        }
        $(dom).prepend(child.editHtml());
        var el = dom;
        this.mode = 'edit';
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            var newcode = $("input[name='code']", el).val();
            if (type == 'editcancel') {
                $("#code" + code).remove();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('yusuan->addItem', {
                    code: $("input[name='code']", el).val(),
                    parentcode: parentcode=='编号'?'':parentcode,
                    name: $("input[name='name']", el).val(),
                    isitem:0
                }, function (data) {
                    if (data.status == 1) return my.view.message('请输入项目名称和编号！');
                    if (data.status == 2) return my.view.message('存在重复的项目编号，请更换重试！');
                    if (data.status == 3) return my.view.message('父类编号不存在！');
                    if (data.status != 0) return my.view.message('添加失败，请重试！');
                    my.view.message('添加成功！', 1, function () {
                        child.getDom().attr('id', 'code' + newcode);
                        info.code = $("input[name='code']", el).val();
                        child.code = $("input[name='code']", el).val();
                        child.name = $("input[name='name']", el).val();
                        parent.addChild(child);
                        _this.nodelist[code] = info;
                        _this.nodelist[code].ref = child;
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    },
    editChild: function (code) {
        var _this = this;
        var child = this.getChildByCode(code);
        this.mode = 'edit';
        child.setEditMode();
        var el = child.getDom();
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            var newcode = $("input[name='code']", el).val();
            if (type == 'editcancel') {
                child.setBaseType();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('yusuan->editItem', {
                    code:code,
                    newcode: newcode,
                    name: $("input[name='name']", el).val(),
                    isitem: 0
                }, function (data) {
                    if (data.status == 1) return my.view.message('请输入项目名称和编号！');
                    if (data.status == 2) return my.view.message('存在重复的项目编号，请更换重试！');
                    if (data.status == 3) return my.view.message('父类编号不存在！');
                    if (data.status != 0) return my.view.message('添加失败，请重试！');
                    my.view.message('修改成功！', 1, function () {
                        child.getDom().attr('id', 'code' + newcode);
                        child.code = newcode;
                        child.name = $("input[name='name']", el).val();
                        _this.nodelist[newcode] = { name: child.name, code: child.code, parentcode: child.parentcode };
                        _this.nodelist[newcode].ref = child;
                        if (newcode != code) {
                            delete _this.nodelist[code];
                        }
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    }
};
//所有节点
my.child = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu;
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.status = cfg.status ? 1 : 0;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child.prototype = {
    //创建一个新的可用的节点ID
    createChildCode:function(){
        if ($.isEmptyObject(this.childs)) {
            return this.code + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.code) + 1;
            });
            return code;
        }
    },
    changeStatus:function(){
        return this.status == 1 ? this.close() : this.open();
    },
    addChild: function (child) {
        this.childs.push(child);
        child.setLevel(this.level + 1);
        return this;
    },
    setLevel: function (level) {
        this.level = level;
        return this;
    },
    open:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show:function(){
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide:function(){
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove:function(){
        this.getDom().remove();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.remove();
            })
        }
    },
    //删除某个子节点
    delChild: function (code) {
        var _this = this;
        $.each(this.childs, function (k) {
            if (this.code == code) {
                this.remove();
                delete _this.childs[k];
                return false;
            }
        })
    },
    fresh: function () {
        var _this = this;
        if ($.isEmptyObject(this.childs)) return this.getHtml();
        var str = this.getHtml();
        str += '<div class=node_childs id="child' + this.code + '" ' + (this.level != 0 ? 'style="display:none"' : '') + '>';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.code + '" data-code="' + this.code + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs) ? 'ico_open' : 'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.name + '</span></div>\
            <div class="node_code">'+ this.code + '</div>\
            <div class="node_submit"><a data-type="editsubmit" code="' + this.code + '">确认</a><a data-type="editcancel" code="' + this.code + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="'+ this.code + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.code + '">[修改]</a>\
            <a data-type="del" data-code="' + this.code + '">[删除]</a></div></div>';
    },
    getDom: function () {
        return $("#code" + this.code);
    },
    getChildDom: function () {
        return $("#child" + this.code);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.name); 
        $('.node_code', dom).html(this.code);
        $(".node_submit", dom).hide();
        $(dom).data('code', this.code);
        
        $("a", dom).data('code', this.code);
    },
    //设置节点编辑模式
    setEditMode: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html('<input type="text" name="name" value="' + this.name + '" style="width:150px;">');
        $('.node_code', dom).html('<input type="text" name="code" value="' + this.code + '" style="width:80px;">');
        $(".node_edit", dom).hide();
        $(".node_submit", dom).show();
        return this;
    },
    editHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.code + '" data-code="' + this.code + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="ico_open node_ico"></span>\
            <span class="node_title_txt"><input type="text" name="name" value="" style="width:150px;"></span></div>\
            <div class="node_code"><input type="text" name="code" value="' + this.code + '" style="width:80px;"></div>\
            <div class="node_submit" style="display:block"><a data-type="editsubmit" code="' + this.code + '">确认</a><a data-type="editcancel" code="' + this.code + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="' + this.code + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.code + '">[修改]</a>\
            <a data-type="del" data-code="' + this.code + '">[删除]</a></div></div>';
    }
};



my.node_menu = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode:'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.code] = this;
        });
        //生成节点对象
        var baseinfo = { code: '编号', name: '项目名称', level: 0, parentcode: '' };
        var baseNode = new my.child_menu(baseinfo);//根节点
        this.nodes = baseNode;
        $.each(this.nodelist, function () {
            _this.createChild(this);
        });
        this.nodes.open();
        $(el).append(this.nodes.fresh());
        this.nodelist['编号'] = baseinfo;
        this.nodelist['编号'].ref = this.nodes;
        this.bindEvent();
    },
    getChildByCode: function (code) {
        return this.nodelist[code].ref;
    },
    createChild: function (cfg) {
        if (!cfg) return;
        var child = new my.child_menu(cfg);
        if (cfg.parentcode) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parentcode] || !this.nodelist[cfg.parentcode].ref) {
                if (!this.nodelist[cfg.parentcode]) return;
                var parent = this.createChild(this.nodelist[cfg.parentcode]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parentcode].ref.addChild(child);
            }
        } else {
            child.parentcode = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        console.log(this.getTime() - this.starttime); 
    },
    bindEvent: function () {
        var _this = this;
        
        $(".node_ul", this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#53E2E6');
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            if ($(this).data('isclick')) return;
            $(this).css('background-color', '#e5e5e5');
        });
        $(".node_ico",this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).parent().parent().data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    }
};
//所有节点
my.child_menu = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu;
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.status = cfg.status ? 1 : 0;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_menu.prototype = {
    //创建一个新的可用的节点ID
    createChildCode:function(){
        if ($.isEmptyObject(this.childs)) {
            return this.code + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.code) + 1;
            });
            return code;
        }
    },
    changeStatus:function(){
        return this.status == 1 ? this.close() : this.open();
    },
    addChild: function (child) {
        this.childs.push(child);
        child.setLevel(this.level + 1);
        return this;
    },
    setLevel: function (level) {
        this.level = level;
        return this;
    },
    open:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show:function(){
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide:function(){
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove:function(){
        this.getDom().remove();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.remove();
            })
        }
    },
    //删除某个子节点
    delChild: function (code) {
        var _this = this;
        $.each(this.childs, function (k) {
            if (this.id == code) {
                this.remove();
                delete _this.childs[k];
                return false;
            }
        })
    },
    fresh: function () {
        var _this = this;
        if ($.isEmptyObject(this.childs)) return this.getHtml();
        var str = this.getHtml();
        str += '<div class=node_childs id="child_more' + this.code + '" ' + (this.level != 0 ? 'style="display:none"' : '') + '>';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        return '<div class="node_ul" id="'+'code_more' + this.code+'" data-code="'+this.code+'"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs)?'ico_open':'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.name + '</span></div>\
            <div class="node_code">'+ this.code + '</div></div>';
    },
    getDom: function () {
        return $("#code_more" + this.code);
    },
    getChildDom: function () {
        return $("#child_more" + this.code);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.name);
        $('.node_code', dom).html(this.code);
        $(".node_submit", dom).hide();
        $(dom).data('code', this.code);
        
        $("a", dom).data('code', this.code);
    }
};



my.node_child = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode:'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.code] = this;
        });
        //生成节点对象
        var baseinfo = { code: '编号', name: '项目名称', level: 0, parentcode: '',kemu:'科目' };
        var baseNode = new my.child_child(baseinfo);//根节点
        this.nodes = baseNode;
        $.each(this.nodelist, function () {
            _this.createChild(this);
        });
        this.nodes.open();
        $(el).append(this.nodes.fresh());
        this.nodelist['编号'] = baseinfo;
        this.nodelist['编号'].ref = this.nodes;
        this.bindEvent();
    },
    getChildByCode: function (code) {
        return this.nodelist[code].ref;
    },
    createChild: function (cfg) {
        if (!cfg) return;
        var child = new my.child_child(cfg);
        if (cfg.parentcode) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parentcode] || !this.nodelist[cfg.parentcode].ref) {
                if (!this.nodelist[cfg.parentcode]) return;
                var parent = this.createChild(this.nodelist[cfg.parentcode]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parentcode].ref.addChild(child);
            }
        } else {
            cfg.parentcode = '编号';
            child.parentcode = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        console.log(this.getTime() - this.starttime);
    },
    bindEvent: function () {
        var _this = this;
        $(".node_ul",this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#D3F0F1').find('.node_edit').show();
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            $(this).css('background-color', '#F5F5F5').find('.node_edit').hide();
        });
        $('a', this.el).unbind().bind('click', function (e) {
            e.stopPropagation();
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            var type = $(this).data('type');
            _this.clickEvent(code,type);
        });
        $(".node_ul", this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    },
    clickEvent: function (code, type) {
        var _this = this;
        console.log(code);
        if (type == 'add') {
            _this.addChild(code);
        } else if (type == 'del') {
            if (confirm('是否确定删除？删除后将不可恢复！')) {
                my.util.send('yusuan->delItem', {
                    code: code
                }, function (data) {
                    if (data.status != 0) return my.view.message('删除失败！');
                    _this.nodelist[_this.nodelist[code].parentcode].ref.delChild(code);
                });
            }
        } else if (type == 'edit') {
            _this.editChild(code);
        }
    },
    addChild: function (parentcode) {
        var _this = this;
        var parent = this.getChildByCode(parentcode);
        if (parent.status == 0) {
            parent.changeStatus();
        }
        var code = parent.createChildCode();
        var info = { code: code, name: '', parentcode: parentcode, level: parent.level + 1 };
        var child = new my.child_child(info);
        var dom = parent.getChildDom();
        if (dom.length == 0) {
            parent.getDom().after('<div class="node_childs" id="child'+parent.code+'"></div>');
            dom = parent.getChildDom();
        }
        $(dom).prepend(child.editHtml());
        var el = dom;
        this.mode = 'edit';
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            var newcode = $("input[name='code']", el).val();
            if (type == 'editcancel') {
                $("#code" + code).remove();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('yusuan->addItem', {
                    code: $("input[name='code']", el).val(),
                    parentcode: parentcode=='编号'?'':parentcode,
                    name: $("input[name='name']", el).val(),
                    kemu:$("input[name='kemu']",el).val(),
                    isitem:1
                }, function (data) {
                    if (data.status == 1) return my.view.message('请输入项目名称和编号！');
                    if (data.status == 2) return my.view.message('存在重复的项目编号，请更换重试！');
                    if (data.status == 3) return my.view.message('父类编号不存在！');
                    if (data.status != 0) return my.view.message('添加失败，请重试！');
                    my.view.message('添加成功！', 1, function () {
                        child.getDom().attr('id', 'code' + newcode);
                        info.code = $("input[name='code']", el).val();
                        child.code = $("input[name='code']", el).val();
                        child.name = $("input[name='name']", el).val();
                        child.kemu = $("input[name='kemu']", el).val();
                        parent.addChild(child);
                        _this.nodelist[code] = info;
                        _this.nodelist[code].ref = child;
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    },
    editChild: function (code) {
        var _this = this;
        var child = this.getChildByCode(code);
        this.mode = 'edit';
        child.setEditMode();
        var el = child.getDom();
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            var newcode = $("input[name='code']", el).val();
            if (type == 'editcancel') {
                child.setBaseType();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('yusuan->editItem', {
                    code:code,
                    newcode: newcode,
                    name: $("input[name='name']", el).val(),
                    kemu: $("input[name='kemu']", el).val(),
                    isitem: 1
                }, function (data) {
                    if (data.status == 1) return my.view.message('请输入项目名称和编号！');
                    if (data.status == 2) return my.view.message('存在重复的项目编号，请更换重试！');
                    if (data.status == 3) return my.view.message('父类编号不存在！');
                    if (data.status != 0) return my.view.message('添加失败，请重试！');
                    my.view.message('修改成功！', 1, function () {
                        child.getDom().attr('id', 'code' + newcode);
                        child.code = newcode;
                        child.name = $("input[name='name']", el).val();
                        child.kemu = $("input[name='kemu']", el).val();
                        _this.nodelist[newcode] = { name: child.name, code: child.code, parentcode: child.parentcode };
                        _this.nodelist[newcode].ref = child;
                        if (newcode != code) {
                            delete _this.nodelist[code];
                        }
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    }
};
//所有节点
my.child_child = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu;
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.status = cfg.status ? 1 : 0;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_child.prototype = {
    //创建一个新的可用的节点ID
    createChildCode:function(){
        if ($.isEmptyObject(this.childs)) {
            return this.code + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.code) + 1;
            });
            return code;
        }
    },
    changeStatus:function(){
        return this.status == 1 ? this.close() : this.open();
    },
    addChild: function (child) {
        this.childs.push(child);
        child.setLevel(this.level + 1);
        return this;
    },
    setLevel: function (level) {
        this.level = level;
        return this;
    },
    open:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show:function(){
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide:function(){
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove:function(){
        this.getDom().remove();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.remove();
            })
        }
    },
    //删除某个子节点
    delChild: function (code) {
        var _this = this;
        $.each(this.childs, function (k) {
            if (this.code == code) {
                this.remove();
                delete _this.childs[k];
                return false;
            }
        })
    },
    fresh: function () {
        var _this = this;
        if ($.isEmptyObject(this.childs)) return this.getHtml();
        var str = this.getHtml();
        str += '<div class=node_childs id="child' + this.code + '" ' + (this.level != 0 ? 'style="display:none"' : '') + '>';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.code + '" data-code="' + this.code + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs) ? 'ico_open' : 'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.name + '</span></div>\
            <div class="node_code">'+ this.code + '</div>\
            <div class="node_kemu">'+this.kemu +'</div>\
            <div class="node_submit"><a data-type="editsubmit" code="' + this.code + '">确认</a><a data-type="editcancel" code="' + this.code + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="'+ this.code + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.code + '">[修改]</a>\
            <a data-type="del" data-code="' + this.code + '">[删除]</a></div></div>';
    },
    getDom: function () {
        return $("#code" + this.code);
    },
    getChildDom: function () {
        return $("#child" + this.code);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.name); 
        $('.node_code', dom).html(this.code);
        $('.node_kemu', dom).html(this.kemu?this.kemu:'');
        $(".node_submit", dom).hide();
        $(dom).data('code', this.code);
        
        $("a", dom).data('code', this.code);
    },
    //设置节点编辑模式
    setEditMode: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html('<input type="text" name="name" value="' + this.name + '" style="width:150px;">');
        $('.node_code', dom).html('<input type="text" name="code" value="' + this.code + '" style="width:80px;">');
        $('.node_kemu', dom).html('<input type="text" name="kemu" value="' + (this.kemu ? this.kemu : '') + '" style="width:80px;">');
        $(".node_edit", dom).hide();
        $(".node_submit", dom).show();
        return this;
    },
    editHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.code + '" data-code="' + this.code + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="ico_open node_ico"></span>\
            <span class="node_title_txt"><input type="text" name="name" value="" style="width:150px;"></span></div>\
            <div class="node_code"><input type="text" name="code" value="' + this.code + '" style="width:80px;"></div>\
            <div class="node_kemu"><input type="text" name="kemu" value="' + (this.kemu ? this.kemu : '') + '" style="width:80px;"></div>\
            <div class="node_submit" style="display:block"><a data-type="editsubmit" code="' + this.code + '">确认</a><a data-type="editcancel" code="' + this.code + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="' + this.code + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.code + '">[修改]</a>\
            <a data-type="del" data-code="' + this.code + '">[删除]</a></div></div>';
    }
};



my.node_data = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode:'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.code] = this;
        });
        //生成节点对象
        var baseinfo = { code: '编号', name: '项目名称', level: 0, parentcode: '',kemu:'科目', M1: '一月', M2: '二月', M3: '三月', M4: '四月', M5: '五月', M6: '六月', M7: '七月', M8: '八月', M9: '九月', M10: '十月', M11: '十一月', M12: '十二月', YearAlarm: '全年', };
        var baseNode = new my.child_data(baseinfo);//根节点
        this.nodes = baseNode;
        $.each(this.nodelist, function () {
            _this.createChild(this);
        });
        this.nodes.open();
        $(el).append(this.nodes.fresh());
        this.nodelist['编号'] = baseinfo;
        this.nodelist['编号'].ref = this.nodes;
        this.bindEvent();
    },
    getChildByCode: function (code) {
        return this.nodelist[code].ref;
    },
    createChild: function (cfg) {
        if (!cfg) return;
        var child = new my.child_data(cfg);
        if (cfg.parentcode) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parentcode] || !this.nodelist[cfg.parentcode].ref) {
                if (!this.nodelist[cfg.parentcode]) return;
                var parent = this.createChild(this.nodelist[cfg.parentcode]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parentcode].ref.addChild(child);
            }
        } else {
            child.parentcode = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        console.log(this.getTime() - this.starttime); 
    },
    bindEvent: function () {
        var _this = this;
        
        $(".node_ul", this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#D3F0F1');
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            if ($(this).data('isclick')) return;
            $(this).css('background-color', '#f5f5f5');
        });
        $(".node_ico",this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).parent().parent().data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    }
};
//所有节点
my.child_data = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu?cfg.kemu:'';
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.M1 = cfg.M1 ? cfg.M1 : '';
    this.M2 = cfg.M2 ? cfg.M2 : '';
    this.M3 = cfg.M3 ? cfg.M3 : '';
    this.M4 = cfg.M4 ? cfg.M4 : '';
    this.M5 = cfg.M5 ? cfg.M5 : '';
    this.M6 = cfg.M6 ? cfg.M6 : '';
    this.M7 = cfg.M7 ? cfg.M7 : '';
    this.M8 = cfg.M8 ? cfg.M8 : '';
    this.M9 = cfg.M9 ? cfg.M9 : '';
    this.M10 = cfg.M10 ? cfg.M10 : '';
    this.M11 = cfg.M11 ? cfg.M11 : '';
    this.M12 = cfg.M12 ? cfg.M12 : '';
    this.YearAlarm = cfg.YearAlarm ? cfg.YearAlarm : '';
    this.status = cfg.status ? 0 : 1;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_data.prototype = {
    //创建一个新的可用的节点ID
    createChildCode:function(){
        if ($.isEmptyObject(this.childs)) {
            return this.code + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.code) + 1;
            });
            return code;
        }
    },
    changeStatus:function(){
        return this.status == 1 ? this.close() : this.open();
    },
    addChild: function (child) {
        this.childs.push(child);
        child.setLevel(this.level + 1);
        return this;
    },
    setLevel: function (level) {
        this.level = level;
        return this;
    },
    open:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show:function(){
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide:function(){
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove:function(){
        this.getDom().remove();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.remove();
            })
        }
    },
    //删除某个子节点
    delChild: function (code) {
        var _this = this;
        $.each(this.childs, function (k) {
            if (this.id == code) {
                this.remove();
                delete _this.childs[k];
                return false;
            }
        })
    },
    fresh: function () {
        var _this = this;
        if ($.isEmptyObject(this.childs)) return this.getHtml();
        var str = this.getHtml();
        str += '<div class=node_childs id="child_more' + this.code + '">';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        return '<div class="node_ul" id="'+'code_more' + this.code+'" data-code="'+this.code+'"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs)?'ico_open':'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.name + '</span></div>\
            <div class="node_code">'+ this.code + '</div>\
<div class="node_kemu">' + this.kemu + '</div>\
<div class="node_month" data-field="M1">' + this.M1 + '</div>\
<div class="node_month" data-field="M2">' + this.M2 + '</div>\
<div class="node_month" data-field="M3">' + this.M3 + '</div>\
<div class="node_month" data-field="M4">' + this.M4 + '</div>\
<div class="node_month" data-field="M5">' + this.M5 + '</div>\
<div class="node_month" data-field="M6">' + this.M6 + '</div>\
<div class="node_month" data-field="M7">' + this.M7 + '</div>\
<div class="node_month" data-field="M8">' + this.M8 + '</div>\
<div class="node_month" data-field="M9">' + this.M9 + '</div>\
<div class="node_month" data-field="M10">' + this.M10 + '</div>\
<div class="node_month" data-field="M11">' + this.M11 + '</div>\
<div class="node_month" data-field="M12">' + this.M12 + '</div>\
<div class="node_month" data-field="YearAlarm">' + this.YearAlarm + '</div>\
            </div>';
    },
    getDom: function () {
        return $("#code_more" + this.code);
    },
    getChildDom: function () {
        return $("#child_more" + this.code);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.name);
        $('.node_code', dom).html(this.code);
        $(".node_submit", dom).hide();
        $(dom).data('code', this.code);
        
        $("a", dom).data('code', this.code);
    }
};



my.node_do = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode:'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.code] = this;
        });
        //生成节点对象
        var baseinfo = { code: '编号', name: '项目名称', level: 0, parentcode: '',kemu:'科目', month:'本月预算', YearAlarm: '全年预算', };
        var baseNode = new my.child_do(baseinfo);//根节点
        this.nodes = baseNode;
        $.each(this.nodelist, function () {
            _this.createChild(this);
        });
        this.nodes.open();
        $(el).append(this.nodes.fresh());
        this.nodelist['编号'] = baseinfo;
        this.nodelist['编号'].ref = this.nodes;
        this.bindEvent();
    },
    getChildByCode: function (code) {
        return this.nodelist[code].ref;
    },
    createChild: function (cfg) {
        if (!cfg) return;
        var child = new my.child_do(cfg);
        if (cfg.parentcode) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parentcode] || !this.nodelist[cfg.parentcode].ref) {
                if (!this.nodelist[cfg.parentcode]) return;
                var parent = this.createChild(this.nodelist[cfg.parentcode]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parentcode].ref.addChild(child);
            }
        } else {
            child.parentcode = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        console.log(this.getTime() - this.starttime); 
    },
    bindEvent: function () {
        var _this = this;
        
        $(".node_ul", this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#D3F0F1');
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            if ($(this).data('isclick')) return;
            $(this).css('background-color', '#f5f5f5');
        });
        $(".node_ico",this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).parent().parent().data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    }
};
//所有节点
my.child_do = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu?cfg.kemu:'';
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.month = cfg.month ? cfg.month : '';
    this.YearAlarm = cfg.YearAlarm ? cfg.YearAlarm : '';
    this.status = cfg.status ? 0 : 1;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_do.prototype = {
    //创建一个新的可用的节点ID
    createChildCode:function(){
        if ($.isEmptyObject(this.childs)) {
            return this.code + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.code) + 1;
            });
            return code;
        }
    },
    changeStatus:function(){
        return this.status == 1 ? this.close() : this.open();
    },
    addChild: function (child) {
        this.childs.push(child);
        child.setLevel(this.level + 1);
        return this;
    },
    setLevel: function (level) {
        this.level = level;
        return this;
    },
    open:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show:function(){
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide:function(){
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove:function(){
        this.getDom().remove();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.remove();
            })
        }
    },
    //删除某个子节点
    delChild: function (code) {
        var _this = this;
        $.each(this.childs, function (k) {
            if (this.id == code) {
                this.remove();
                delete _this.childs[k];
                return false;
            }
        })
    },
    fresh: function () {
        var _this = this;
        if ($.isEmptyObject(this.childs)) return this.getHtml();
        var str = this.getHtml();
        str += '<div class=node_childs id="child_more' + this.code + '">';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        return '<div class="node_ul" id="'+'code_more' + this.code+'" data-code="'+this.code+'"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs)?'ico_open':'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.name + '</span></div>\
            <div class="node_code">'+ this.code + '</div>\
<div class="node_kemu">' + this.kemu + '</div>\
<div class="node_month">' + this.month + '</div>\
<div class="node_month">' + this.YearAlarm + '</div>\
            </div>';
    },
    getDom: function () {
        return $("#code_more" + this.code);
    },
    getChildDom: function () {
        return $("#child_more" + this.code);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.name);
        $('.node_code', dom).html(this.code);
        $(".node_submit", dom).hide();
        $(dom).data('code', this.code);
        
        $("a", dom).data('code', this.code);
    }
};



my.node_rs = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode: 'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.id] = this;
        });
        //生成节点对象
        var baseinfo = { id: '编号', department: '项目名称', level: 0, parent_id: '' };
        var baseNode = new my.child_rs(baseinfo);//根节点
        this.nodes = baseNode;
        $.each(this.nodelist, function () {
            _this.createChild(this);
        });
        this.nodes.open();
        $(el).append(this.nodes.fresh());
        this.nodelist['编号'] = baseinfo;
        this.nodelist['编号'].ref = this.nodes;
        this.bindEvent();
    },
    getChildByCode: function (code) {
        return this.nodelist[code].ref;
    },
    createChild: function (cfg) {
        if (!cfg) return;
        var child = new my.child_rs(cfg);
        if (cfg.parent_id) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parent_id] || !this.nodelist[cfg.parent_id].ref) {
                if (!this.nodelist[cfg.parent_id]) return;
                var parent = this.createChild(this.nodelist[cfg.parent_id]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parent_id].ref.addChild(child);
            }
        } else {
            cfg.parent_id = '编号';
            child.parent_id = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        //console.log(this.getTime() - this.starttime);
    },
    bindEvent: function () {
        var _this = this;
        $(".node_ul", this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#D3F0F1').find('.node_edit').show();
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            $(this).css('background-color', '#F5F5F5').find('.node_edit').hide();
        });
        $('a', this.el).unbind().bind('click', function (e) {
            e.stopPropagation();
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            var type = $(this).data('type');
            _this.clickEvent(code, type);
        });
        $(".node_ul", this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    },
    clickEvent: function (code, type) {
        var _this = this;
        if (type == 'add') {
            _this.addChild(code);
        } else if (type == 'del') {
            if (confirm('是否确定删除？删除后将不可恢复！')) {
                my.util.send('personnel->delDepartmentInfo', {
                    id: code
                }, function (data) {
                    if (data.status != 0) return my.view.message('删除失败！');
                    _this.nodelist[_this.nodelist[code].parent_id].ref.delChild(code);
                });
            }
        } else if (type == 'edit') {
            _this.editChild(code);
        } else if (type == 'zhiwei') {
            my.zhiwei.show(_this.nodelist[code]);
        }
    },
    addChild: function (parent_id) {
        var _this = this;
        var parent = this.getChildByCode(parent_id);
        if (parent.status == 0) {
            parent.changeStatus();
        }
        var id = parent.createChildCode();
        var info = { id: id, name: '', parent_id: parent_id, level: parent.level + 1 };
        var child = new my.child_rs(info);
        var dom = parent.getChildDom();
        if (dom.length == 0) {
            parent.getDom().after('<div class="node_rss" id="child' + parent.id + '"></div>');
            dom = parent.getChildDom();
        }
        $(dom).prepend(child.editHtml());
        var el = dom;
        this.mode = 'edit';
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            var newcode = $("input[name='code']", el).val();
            if (type == 'editcancel') {
                $("#code" + id).remove();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('personnel->add_department', {
                    parent_id: parent_id == '编号' ? '' : parent_id,
                    department: $("input[name='name']", el).val()
                }, function (data) {
                    if (data.status != 0) return my.view.message('添加失败！');
                    my.view.message('添加成功！', 1, function () {
                        newcode = data.id;
                        child.getDom().attr('id', 'code' + newcode);
                        info.id = newcode;
                        child.id = newcode;
                        child.department = $("input[name='name']", el).val();
                        parent.addChild(child);
                        _this.nodelist[newcode] = info;
                        _this.nodelist[newcode].ref = child;
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    },
    editChild: function (code) {
        var _this = this;
        var child = this.getChildByCode(code);
        this.mode = 'edit';
        child.setEditMode();
        var el = child.getDom();
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            if (type == 'editcancel') {
                child.setBaseType();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('personnel->editDepartment', {
                    id: code,
                    department: $("input[name='name']", el).val()
                }, function (data) {
                    if (data.status != 0) return my.view.message('修改失败！');
                    my.view.message('修改成功！', 1, function () {
                        child.getDom().attr('id', 'code' + code);
                        child.department = $("input[name='name']", el).val();
                        _this.nodelist[code]['name'] = child.department;
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    }
};
//所有节点
my.child_rs = function (cfg) {
    if (!cfg) return;
    this.id = cfg.id;
    this.department = cfg.department;
    this.kemu = cfg.kemu;
    this.parent_id = cfg.parent_id;
    this.level = cfg.level;
    this.disedit = cfg.disedit;
    this.status = cfg.status ? 0 : 1;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_rs.prototype = {
    //创建一个新的可用的节点ID
    createChildCode: function () {
        return '';
        if ($.isEmptyObject(this.childs)) {
            return this.id + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.id) + 1;
            });
            return code;
        }
    },
    changeStatus: function () {
        return this.status == 1 ? this.close() : this.open();
    },
    addChild: function (child) {
        this.childs.push(child);
        child.setLevel(this.level + 1);
        return this;
    },
    setLevel: function (level) {
        this.level = level;
        return this;
    },
    open: function () {
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close: function () {
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show: function () {
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide: function () {
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove: function () {
        this.getDom().remove();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.remove();
            })
        }
    },
    //删除某个子节点
    delChild: function (code) {
        var _this = this;
        $.each(this.childs, function (k) {
            if (this.id == code) {
                this.remove();
                delete _this.childs[k];
                return false;
            }
        })
    },
    fresh: function () {
        var _this = this;
        if ($.isEmptyObject(this.childs)) return this.getHtml();
        var str = this.getHtml();
        str += '<div class=node_rss id="child' + this.id + '" >';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        var str= '<div class="node_ul" id="' + 'code' + this.id + '" data-code="' + this.id + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs) ? 'ico_open' : 'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.department + '</span></div>\
            <div class="node_code">'+ this.id + '</div>\
            <div class="node_submit"><a data-type="editsubmit" code="' + this.id + '">确认</a><a data-type="editcancel" code="' + this.id + '">取消</a></div>\
            <div class="node_edit">';
        str += this.id=='编号'?'':'<a data-type="zhiwei" data-code="'+this.id+'">[岗位管理]</a>';
        str +=this.disedit?'':'<a data-type="add" data-code="'+ this.id + '">[新增子类]</a>';
        str += (this.id == '编号'||this.disedit) ? '' : '<a data-type="edit" data-code="' + this.id + '">[修改]</a>\
            <a data-type="del" data-code="' + this.id + '">[删除]</a>';
        str += '</div></div>';
        return str;
    },
    getDom: function () {
        return $("#code" + this.id);
    },
    getChildDom: function () {
        return $("#child" + this.id);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.department);
        $('.node_code', dom).html(this.id);
        $(".node_submit", dom).hide();
        $(dom).data('code', this.id);

        $("a", dom).data('code', this.id);
    },
    //设置节点编辑模式
    setEditMode: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html('<input type="text" name="name" value="' + this.department + '" style="width:150px;">');
        $('.node_code', dom).html(this.id);
        $(".node_edit", dom).hide();
        $(".node_submit", dom).show();
        return this;
    },
    editHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.id + '" data-code="' + this.id + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="ico_open node_ico"></span>\
            <span class="node_title_txt"><input type="text" name="name" value="" style="width:150px;"></span></div>\
            <div class="node_code">' + this.id + '</div>\
            <div class="node_submit" style="display:block"><a data-type="editsubmit" code="' + this.id + '">确认</a><a data-type="editcancel" code="' + this.id + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="' + this.id + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.id + '">[修改]</a>\
            <a data-type="del" data-code="' + this.id + '">[删除]</a></div></div>';
    }
};



//物品处理类
my.zhiwei = {
    div: null,//窗体dom
    goodsList: [],//物品列表数组
    searchResult: [],//搜索结果缓存
    perpage: 10,//每页条数
    quick_search:true,//快速搜索
    //获取一条记录，返回物品编码
    getOne:function(arr,cb){
        this.showList(arr, cb);
    },
    setEvent: function (cb) {
        //选择
        var _this = this;
        $(".submit_order", this.div).click(function () {
            if (cb && typeof cb == 'function') {
                cb($(this).data('id'));
            }
            _this.hide();
        });
    },
    show: function (info) {
        var _this = this;
        this.info = info;
        
        var div = document.createElement('div');
        var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
        var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
        var left = (maxwidth - 900) / 2;
        var top = (maxheight - 500) / 2;
        this.bg = document.createElement('div');
        this.bg.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:" + maxheight + "px;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;background:#000;z-index:10;";


        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";
        $(div).append('<table border="0" cellspacing="0" id="goods_list" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist" style="line-height:24px;"><tr>\
                    <th colspan="6" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>岗位管理</b> &nbsp;&nbsp;&nbsp;&nbsp;当前部门：<b>' + info.department + '</b> &nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" style="width:150px;" name="new_job"><a class="city_submit" id="addnew">新增岗位</a>\
                        <span style="float:right"><a class="close">关闭</a></span>\
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">ID</th>\
                    <th class="txtleft">岗位</th>\
                    <th width="120">编制</th>\
                    <th width="70">岗位工资</th>\
                    <th width="100">岗位级别</th>\
                    <th width="150">操作</th>\
                </tr><tr><th colspan="6">正在获取岗位信息，请稍候……</th></tr></table>');
        $(document.body).append(this.bg);
        $(document.body).append(div);
        this.div = div;
        $(this.bg).bind('click', function () { _this.hide(); });
        $(".close", div).click(function () { _this.hide(); });
        $("#addnew").click(function () {
            var name = $("input[name='new_job']", div).val();
            if (!name) return my.view.message('请输入新岗位名称！');
            my.view.load(1);
            var arges = _this.getArges();
            arges['job'] = name;
            my.util.send('personnel->add_job',arges, function (data) {
                if (data.status !== 0) return my.view.message('新增岗位失败！');
                my.view.message('新增岗位成功！', 1, function () {
                    $("input[name='new_job']", div).val('');
                    _this.fresh();
                });
            });
        });
        this.fresh();
        $(div).fadeIn();
    },
    //获取请求的参数。 门店、仓库、车间没有部门ID，所以需要单独处理
    getArges:function(){
        var arges = {};
        if (this.info.type == 'store') {
            arges['store_id'] = this.info.id;
        } else if (this.info.type == 'bag') {
            arges['bag_id'] = this.info.id;
        } else if (this.info.type == 'chejian') {
            arges['chejian_id'] = this.info.id;
        } else {
            arges['department_id'] = this.info.id;
        }
        return arges;
    },
    fresh: function () {
        var _this = this;
        var arges = this.getArges();
        my.view.load(1);
        
        my.util.send('personnel->job_list', arges, function (data) {
            my.view.load();
            _this.list = data.list;
            _this.showList();
        });
    },
    showList: function () {
        var _this = this;
        $("tr", this.div).each(function (i) {
            if (i < 2) return true;
            $(this).remove();
        });
        var str = '';
        if ($.isEmptyObject(this.list)) {
            str = '<tr><th colspan="6">目前没有岗位信息</th></tr>';
        } else {
            $.each(this.list, function () {
                var info = this;
                str += '<tr>\
                    <th>' + this.id + '</th>\
                    <th class="txtleft">'+this.job+'</th>\
                    <th>'+this.plan_nums+'</th>\
                    <th>'+this.wage+ '</th>';
                
                var level = ['专员', '主管', '经理', '总监'];
                str += '<th>'+level[this.job_level-1] + '</th>';
                
                str +='<th><a data-type="edit" style="padding-right:10px;" data-id="' + this.id + '">修改</a>\
<a data-type="del" style="padding-right:10px;" data-id="' + this.id + '">删除</a>\
<a data-type="history" data-id="'+this.id+'">历史记录</a></th>\
                </tr>';
            });
        }
        str = $(str);
        $("a", str).bind('click', function () {
            var id = $(this).data('id');
            var type = $(this).data('type');
            if (type == 'edit') {
                var tmpdom = $(this).parent().parent().find('th');
                var info = _this.getListInfo(id);
                tmpdom.eq(1).html('<input type="text" value="' + info.job + '" style="width:150px;" name="job">');
                tmpdom.eq(2).html('<input type="text" value="' + info.plan_nums + '" style="width:100px;" name="plan_nums">');
                tmpdom.eq(3).html('<input type="text" value="' + info.wage + '" style="width:60px;" name="wage">');
                var tmpstr = '';
                tmpstr += '<select name="job_level">';
                var level = ['专员', '主管', '经理', '总监'];
                $.each(level, function (k) {
                    if (info.job_level == (k + 1)) {
                        tmpstr += '<option value="' + (k + 1) + '" selected>' + this + '</option>';
                    } else {
                        tmpstr += '<option value="' + (k + 1) + '" >' + this + '</option>';
                    }
                });
                tmpstr += '</select>';
                tmpdom.eq(4).html(tmpstr);

                tmpdom.eq(5).html('<a data-type="editsubmit" style="padding-right:10px;">确认修改</a> <a data-type="cancel">取消</a>');
                tmpdom.eq(5).find('a').bind('click', function () {
                    var t = $(this).data('type');
                    if (t == 'cancel') {
                        _this.showList();
                    } else {
                        var job = $("input[name='job']", tmpdom).val();
                        var plan_nums = $("input[name='plan_nums']", tmpdom).val();
                        var wage = $("input[name='wage']", tmpdom).val();
                        var job_level = $("select[name='job_level']",tmpdom).val();
                        var arges = _this.getArges();
                        arges['id'] = id;
                        arges['job'] = job;
                        arges['plan_nums'] = plan_nums;
                        arges['wage'] = wage;
                        arges['job_level'] = job_level;
                        my.util.send('personnel->edit_job', arges, function (data) {
                            if (data.status != 0) return my.view.message('修改失败！');
                            my.view.message('修改成功！', 1, function () {
                                _this.fresh();
                            });
                        });
                    }
                });
                return;
            }
            if (type == 'history') {
                var str = '';
                if ($(".history_" + id).length > 0) {
                    $(".history_" + id).remove();
                    return;
                }
                var info = _this.getListInfo(id);
                $.each(info.list, function () {
                    str += '<tr class="history_'+id+'">';
                    str += '<td colspan="2"></td><td>' + this.plan_nums + '</td>';
                    str += '<td>' + this.wage + '</td>';
                    var level = ['专员', '主管', '经理', '总监'];
                    str += '<td>' + level[this.job_level - 1] + '</td>';
                    str += '<td>' + this.begin_time + '  [<a data-id="' + this.id + '">删除</a>]</td>';
                    str += '</tr>';
                })
                $(this).parent().parent().after(str);
                $(".history_" + id + ' a').click(function () {
                    var tmpthis = this;
                    var cache_id = $(this).data('id');
                    my.view.load(1);
                    my.util.send('personnel->del_job_cache_info', { id: cache_id }, function (data) {
                        if (data.status != 0) return my.view.message('删除失败！');
                        my.view.message('删除历史记录成功！', 1, function () {
                            $(tmpthis).parent().parent().remove();
                        });
                    });
                });
                return;
            }
            if (type == 'del') {
                if (confirm('确认删除职位吗？如该职位存在数据，将导致数据混乱，请谨慎操作！')) {
                    my.view.load(1);
                    my.util.send('personnel->del_job_info', { id: id }, function (data) {
                        if (data.status == 1) return my.view.message('该职位已有员工，请先调整该员工职位后再进行删除操作！');
                        if (data.status != 0) return my.view.message('删除职位失败！');
                        my.view.message('删除职位成功！', 1, function () {
                            _this.fresh();
                        });
                    });
                }
                return;
            }
        });
        $("table", this.div).append(str);
    },
    getListInfo: function (id) {
        var res;
        $.each(this.list, function () {
            if (this.id == id) return res = this;
        });
        return res;
    },
    //显示物品列表，弹窗形式
    showList1: function (arr, cb) {
        this.goodsList = arr;
        this.searchResult = arr;
        var _this = this;
        var div = document.createElement('div');
        var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
        var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
        var left = (maxwidth - 900) / 2;
        var top = (maxheight - 500) / 2;

        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";

        var department_str = '';
        $.each(my.departments, function () {
            department_str += '<option value="' + this.department + '">' + this.department + '</option>';
        })

        var store_str = '';
        $.each(my.stores, function () {
            store_str += '<option value="' + this.store_id + '">' + this.store_name + '</option>';
        })

        var bag_str = '';
        $.each(my.bags, function () {
            bag_str += '<option value="' + this.bag_id + '">' + this.bag_name + '</option>';
        })

        var chejian_str = '';
        $.each(my.chejians, function () {
            chejian_str += '<option value="' + this.chejian_id + '">' + this.chejian_name + '</option>';
        })
        $(div).append('<table border="0" cellspacing="0" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist"><tr>\
                    <th colspan="5" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>选择人员</b> &nbsp;&nbsp;&nbsp;&nbsp;\
                        <input type="checkbox" id="quick_search" checked> 快速查询  \
                        <a class="ico tips"><div class="tips_content" style="width:300px;"><div class="tips_arrow">◆</div>\
                            支持按\
                            <b><font color="red">ID</font></b>、\
                            <b><font color="red">姓名</font></b>、\
                            <b><font color="red">姓名拼音首字母</font></b>搜索。<br>\
                            支持多关键词搜索，关键词之间以空格分开。<br>\
                            选中快速查询后，可即输即查，无需点击 <b><font color="red">查询</font></b> 按钮。<br>\
                            如电脑配置较低，出现卡机情况，请去掉“快速查询”勾选，输入关键词后，点击“查询”按钮进行搜索。\
                         </div></a>\
<select name="department"><option value="">选择部门</option>'+department_str+'</select>\
<select name="store" style="display:none"><option value="">选择门店</option>' + store_str + '</select>\
<select name="bag" style="display:none"><option value="">选择仓库</option>' + bag_str + '</select>\
<select name="chejian" style="display:none"><option value="">选择车间</option>' + chejian_str + '</select>\
                        关键词：<input type="text" id="keyword" class="input3" style="width:100px;"> \
                        <a  class="city_submit" id="search_start">查询</a>\
                        </span><span style="float:right"><a class="close">关闭</a></span>    \
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">ID</th>\
                    <th>姓名</th>\
                    <th width="120">部门</th>\
                    <th width="70">职位</th>\
                    <th width="80">操作</th>\
                </tr></table>');
        $(document.body).append(div);
        this.div = div;
        $("select[name='department']", div).bind('change', function () {
            var department = $(this).val();
            $("select[name='store']", div).hide();
            $("select[name='bag']", div).hide();
            $("select[name='chejian']", div).hide();
            if (department == '门店') {
                $("select[name='store']", div).show();
            }
            if (department == '仓库') {
                $("select[name='bag']", div).show();
            }
            if (department == '加工中心') {
                $("select[name='chejian']", div).show();
            }
            _this.search($("#keyword").val().trim(), cb, department);
        });
        $("select[name='store'],select[name='bag'],select[name='chejian']", div).bind('change', function () {
            var department = $("select[name='department']", div).val();
            var depcode = $(this).val();
            _this.search($("#keyword").val().trim(), cb, department,depcode);
        });
        $("#keyword", div).bind('keyup', function () {//实时搜索
            if (!$("#quick_search", div).attr('checked')) return;
            var department = $("select[name='department']", div).val();
            var depcode = $("select[name='store']", div).val() || $("select[name='bag']", div).val() || $("select[name='chejian']", div).val();
            _this.search($(this).val().trim(),cb,department,depcode);
        });
        $("#search_start", div).bind('click', function () {//点击搜索
            var department = $("select[name='department']", div).val();
            var depcode = $("select[name='store']", div).val() || $("select[name='bag']", div).val() || $("select[name='chejian']", div).val();
            _this.search($("#keyword").val().trim(), cb,department, depcode);
        });
        $("#quick_search").click(function () {//切换实时搜索
            if ($(this).attr('checked')) {
                _this.quick_search = true;
            } else {
                _this.quick_search = false;
            }
        });
        $(".tips",div).unbind().bind('mouseover click', function () {//小提示
            $("div", this).stop().show();
        });
        $(".tips", div).bind('mouseout', function () {//小提示
            $("div", this).stop().hide();
        });
        $("#fullbg").height($(document).height()).show().unbind().bind('click', function () { _this.hide(); });
        $(".close", div).click(function () { _this.hide(); });
        $(div).fadeIn();
        this.search('', cb);
    },
    //隐藏物品列表
    hide: function () {
        $(this.div).remove();
        $(this.bg).remove();
    },
    //智能搜索
    search:function(key,cb,department,depcode){
        var arrkey = key.split(' ');
        var res;
        var tmparr = this.goodsList;
        var _this = this;
        $.each(arrkey, function () {//支持多重条件搜索
            key = this;
            if (!key) return true;//为空则跳过
            res = [];//检索结果
            var keytype = _this.getKeyType(key);//搜索类型
            $.each(tmparr, function () {
                if (department && this.department != department) return true;//按部门查看
                if (department == '门店' && depcode && this.store_id != depcode) return true;
                if (department == '加工中心' && depcode && this.chejian_id != depcode) return true;
                if (department == '仓库' && depcode && this.bag_id != depcode) return true;
                if (this.goods_type) return true;//隐藏已有分类的结果
                if (keytype == 1) {//数字查询
                    if (this.id.toString().indexOf(key.toString()) > -1) {
                        res.push(this);
                    }
                } else if (keytype == 2) {//拼音
                    var tmpThis = this;
                    $.each(this.py, function () {
                        if (this.indexOf(key.toUpperCase().toString()) > -1) {
                            res.push(tmpThis);
                            return false;//避免多音重复
                        }
                    });
                } else if (keytype == 3) {//中文
                    if (this.true_name.toString().indexOf(key.toString()) > -1) {
                        res.push(this);
                    }
                }
            });
            tmparr = res;
        });
        this.searchResult = res;//缓存搜索结果，提供翻页使用
        this.insertTable(res,1,cb);
    },
    //获取关键词类型，数字返回1，拼音返回2，字符返回3
    getKeyType: function (key) {
        if (!isNaN(key)) return 1;
        var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        return !patrn.exec(key)?2:3;
    },
    //将搜索结果插入到表格，page参数为分页使用，默认为1
    insertTable: function (arr, page,cb) {
        var _this = this;
        var perpage = this.perpage;//每页显示条数
        //计算分页
        if (!page) page = 1;
        var total_page = Math.ceil(arr.length / perpage);
        if (page < 1) page = 1;
        if (page > total_page) page = total_page;
        //清空表格
        $("tr",this.div).each(function (i) {
            if (i < 2) return true;
            $(this).remove();
        });
        //生成tr
        var container = document.createDocumentFragment();
        for (var i = 1; i <= perpage; i++) {
            var tr = document.createElement('tr');
            if (arr[(page - 1) * perpage + i - 1]) {
                var tmp = arr[(page - 1) * perpage + i - 1];
            }else{
                tmp = {id:'--'};
            }
            tr.appendChild(this.th(tmp.id));
            tr.appendChild(this.td(tmp.true_name));
            tr.appendChild(this.td(tmp.department == '门店' ? '门店（' + getStoreName(tmp.store_id) + '）' : (tmp.department=='仓库'?'仓库（'+getBagName(tmp.bag_id)+'）':(tmp.department=='加工中心'?'加工中心（'+getChejianName(tmp.chejian_id)+'）':tmp.department))));
            tr.appendChild(this.td(tmp.job));
            tmp.baozhuang_num = tmp.baozhuang_num ? tmp.baozhuang_num : '';
            tmp.order_nums = tmp.order_nums ? tmp.order_nums : '';

            if (tmp.goods_type) {
                tr.appendChild(_this.td(tmp.goods_type));
            } else {
                if (tmp.id == '--') {
                    tr.appendChild(_this.td(tmp.id));
                } else {
                    tr.appendChild(_this.td('<a  class="submit_order" data-code="' + tmp.id + '" data-id="' + tmp.id + '">选择</a>'));
                }
            }
            container.appendChild(tr);
        }
        $("table",this.div).append(container);//插入搜索结果
        //处理翻页html
        var str = '<tr class="showpage"><th colspan="5">';
        str += '<a data-page="1">首页</a>';
        str += '<a data-page="' + (page - 1) + '">上一页</a>';
        str += '<a data-page="' + (page + 1) + '">下一页</a>';
        str += '<a data-page="' + (total_page) + '">尾页</a>';
        str += '共有' + arr.length + '条记录&nbsp;&nbsp;&nbsp;&nbsp;当前第' + page + '页/' + total_page + '页&nbsp;&nbsp;&nbsp;&nbsp;';
        str += '每页显示<input type="text" style="width:30px;" id="perpage" value="' + perpage + '">条记录';

        $("table", this.div).append(str);
        this.setEvent(cb);
        //分页
        $(".showpage a",this.div).click(function () {
            var tmppage = $(this).data('page');
            _this.insertTable(_this.searchResult, tmppage,cb);
        });
        //切换分页数
        $("#perpage", this.div).bind('change', function () {
            var perpage = parseInt($(this).val());
            if (!perpage) perpage = 10;
            if (perpage < 1) perpage = 1;
            if (perpage > 100) perpage = 100;
            _this.perpage = perpage;
            _this.insertTable(_this.searchResult,page, cb);
        });
        //选中变色
        $("table tr", this.div).bind('mouseover', function () {//表格选中行变色
            $('td', this).css('background-color', '#D3F0F1');
        });
        $("table tr", this.div).bind('mouseout', function () {//表格选中行变色
            $('td', this).css('background-color', '#fff');
        });
    },
    td: function (str,cfg) {
        var tmp = document.createElement('td');
        if (!cfg) cfg = {};
        var classname = cfg.classname;
        var colspan = cfg.colspan;
        if (classname) tmp.className = classname;
        if (colspan) tmp.colSpan = colspan;
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    },
    th: function (str) {
        var tmp = document.createElement('th');
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    }
}
