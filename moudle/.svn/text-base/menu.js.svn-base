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