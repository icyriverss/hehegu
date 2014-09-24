my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_order_ok.html',
        title: '收货单列表',
        perpage: 10,
        page:1,
        output: 0,
        method: 'order->getOrderList',
        current_quick: '查看历史订单',
        quick: { '查看历史订单': 'chejian_order_list' },
        init: function () {
            if (my.user.info.bumen != '加工中心' && !this.chejian_id) this.chejian_id = getOneChejian_ID();
            this.arges = {
                perpage: this.perpage,
                page: this.page,
                status: '2',
                gettype:'shouhuo',
                chejian_id: this.chejian_id || my.user.info.chejian_id
            };
        },
        getTableHtml: function () {
            var _this = this;
            return my.order.getList(this.data.list, ['order_name', 'order_id', 'statusTxt', 'user_name', 'order_date'], {
                txt: '详情',
                cb: function (order_id) {
                    my.tmpOrder_id = order_id;
                    my.view.showTable('chejian_order_okinfo');
                }
            });
        },
        initData:function(data){
            this.data = data;
            $.each(this.data.list, function () {
                this.statusTxt = my.orderStatus[this.status];
            });
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('chejian_order_ok');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('chejian_order_ok');
                }
            );
        }
    };
    my.extend(a, prop);
    my.moudle.chejian_order_ok = a;
})();