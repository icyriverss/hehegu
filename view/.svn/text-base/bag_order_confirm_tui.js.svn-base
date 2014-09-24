my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_order_okinfo.html',
        title: '退库出库单确认',
        output: 0,
        current_quick: '返回修改',
        quick: { '返回修改': 'bag_order_tui' },
        real_recv: {},//实收数组
        init: function () {
            this.data = my.tuiku;
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
            return my.order.getContent({ order_type: 8, adddate: my.tuiku.adddate }, my.tuiku.list, '', ['bianhao', 'name', 'guige', 'kucun_danwei', 'baosun_num'], '确认提交');
        },
        bindEvent: function () {
            var _this = this;
            $(".city_submit").click(function () {
                var arr = [];
                $.each(my.tuiku.list, function () {
                    var tmp = {};
                    tmp.cInvCode = this.bianhao;
                    tmp.nums = this.baosun_num;
                    arr.push(tmp);
                });
                my.view.load(1);
                my.util.send('order->addNewOrder', {
                    list: arr,
                    order_type: 8,
                    order_name: '退库出库单',
                    order_date: my.tuiku.adddate
                }, function (data) {
                    if (!data.status == 0) return my.view.message('提交失败，请联系系统管理员！');
                    my.tuiku = {};//提交成功，清空缓存
                    my.view.message('提交成功！', 1, function () {
                        my.view.showTable('bag_order_list');
                    });
                });
            });
        },
    };
    my.extend(a, prop);
    my.moudle.bag_order_confirm_tui = a;
})();