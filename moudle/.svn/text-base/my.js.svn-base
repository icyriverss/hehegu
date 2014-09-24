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
