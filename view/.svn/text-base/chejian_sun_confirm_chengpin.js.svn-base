my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_order_okinfo.html',
        title: '报损登记确认',
        output: 0,
        current_quick: '返回修改',
        quick: { '返回修改': 'chejian_sun_chengpin'},
        real_recv: {},//实收数组
        init: function () {
            this.data = my.baosun_chengpin;
        },
        getTitle: function () {
            return this.title ? this.title.replace(/{order_id}/g, my.tmpOrder_id) : '';
        },
        initData:function(data){
            this.data = data;
            var arr_type = [];
            this.data.list.sort(function (x, y) {
                return parseInt(x.type_index) - parseInt(y.type_index);
            });
            $.each(this.data.list, function () {
                if (arr_type[this.type_name]) {
                    arr_type[this.type_name]++;
                } else {
                    arr_type[this.type_name]=1;
                }
                this.total = arr_type[this.type_name];
            });
            this.data.types = arr_type;
            this.data.info.statusTxt = my.orderStatus[this.data.info.status];
        },
        getTableHtml: function () {
            var _this = this;
            return my.order.getContent({order_type:6,chejian_id:my.baosun_chengpin.current_chejian_id,adddate:my.baosun_chengpin.adddate}, my.baosun_chengpin.list, '', ['bianhao', 'name', 'guige', 'kucun_danwei', 'baosun_num', 'baosun_yuanyin'],'确认提交');
        },
        bindEvent: function () {
            var _this = this;
            $(".city_submit").click(function () {
                var arr = [];
                $.each(my.baosun_chengpin.list, function () {
                    var tmp = {};
                    tmp.cInvCode = this.bianhao;
                    tmp.nums = this.baosun_num;
                    tmp.baosun_yuanyin = this.baosun_yuanyin;
                    arr.push(tmp);
                });
                my.view.load(1);
                my.util.send('order->addNewOrder', {
                    list: arr,
                    order_type: 6,
                    order_name: '成品报损登记',
                    order_date: my.baosun_chengpin.adddate,
                    current_chejian_id: my.baosun_chengpin.current_chejian_id
                }, function (data) {
                    if (!data.status == 0) return my.view.message('提交报损登记失败，请联系系统管理员！');
                    my.baosun_chengpin = {};//提交成功，清空缓存
                    my.view.message('提交报损登记成功！', 1, function () {
                        my.view.showTable('chejian_sun_list');
                    });
                });
            });
        },
    };
    my.extend(a, prop);
    my.moudle.chejian_sun_confirm_chengpin = a;
})();