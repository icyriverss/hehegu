﻿my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_order_list.html',
        title: '历史报损记录',
        perpage: 10,
        page:1,
        output: 0,
        method:'order->getOrderList',
        init: function () {
            if (my.user.info.bumen != '门店' && !this.store_id) this.store_id = getOneStore_ID();
            this.arges = {
                perpage: this.perpage,
                page: this.page,
                gettype: 'baosun',//获取类型为出库单，
                store_id:this.store_id || my.user.info.store_id
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
            return my.order.getList(this.data.list, ['order_name', 'order_id',  'user_name', 'order_date'], {
                txt: '详情',
                cb: function (order_id) {
                    my.tmpOrder_id = order_id;
                    my.view.showTable('store_sun_info');
                }
            });
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('store_sun_list');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('store_sun_list');
                }
            );
        }
    };
    my.extend(a, prop);
    my.moudle.store_sun_list = a;
})();