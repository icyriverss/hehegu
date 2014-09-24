my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_order_list.html',
        title: '历史订货记录',
        perpage: 10,
        page:1,
        output: 0,
        method:'order->getOrderList',
        current_quick: '申请订货',
        quick: { '申请订货': 'chejian_order_order' },
        init: function () {
            if (my.user.info.bumen != '加工中心' && !this.chejian_id) this.chejian_id = getOneChejian_ID();
            this.arges = {
                perpage: this.perpage,
                page: this.page,
                gettype: 'history',//获取类型为出库单，
                chejian_id: this.chejian_id || my.user.info.chejian_id
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
            return my.order.getList(this.data.list, ['order_name', 'order_id',  'statusTxt', 'user_name', 'order_date'], {
                txt: '详情',
                cb: function (order_id) {
                    my.tmpOrder_id = order_id;
                    my.view.showTable('chejian_order_info');
                }
            });
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('chejian_order_list');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('chejian_order_list');
                }
            );
        }
    };
    my.extend(a, prop);
    my.moudle.chejian_order_list = a;
})();