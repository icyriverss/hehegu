my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/bag_order_pass.html',
        title: '收货单审核',
        perpage: 10,
        page:1,
        output: 0,
        method: 'order->getOrderList',
        current_quick: '出库单记录',
        quick: { '出库单记录': 'bag_order_list' },
        init: function () {
            this.arges = {
                perpage: this.perpage,
                page: this.page,
                gettype:'shenhe',
                bagid:my.user.bagid?my.user.bagid:0//所属仓库
            };
        },
        initData:function(data){
            this.data = data;
            $.each(this.data.list, function () {
                this.statusTxt = my.orderStatus[this.status];
            });
        },
        getTableHtml: function () {
            var _this = this;
            return my.order.getList(this.data.list, ['store_id', 'order_name', 'order_id', 'statusTxt', 'user_name', 'order_date'], {
                txt: '详情',
                cb: function (order_id) {
                    my.tmpOrder_id = order_id;
                    my.view.showTable('bag_order_passinfo');
                }
            });
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('bag_order_pass');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('bag_order_pass');
                }
            );
        }
    };
    my.extend(a, prop);
    my.moudle.bag_order_pass = a;
})();