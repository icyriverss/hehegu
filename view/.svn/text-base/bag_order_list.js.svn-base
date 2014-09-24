my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/bag_order_list.html',
        title: '出库单记录',
        perpage: 10,
        page:1,
        output: 0,
        method: 'order->getOrderList',
        init: function () {
            this.arges = {
                perpage: this.perpage,
                page: this.page,
                gettype:'chukudan',//获取类型为出库单，
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
            return my.order.getList(this.data.list, ['select', 'store_id', 'order_name', 'order_id', 'statusTxt', 'user_name', 'order_date'], {
                txt: '详情',
                cb: function (order_id) {
                    my.tmpOrder_ids = null;
                    my.tmpOrder_id = order_id;
                    my.view.showTable('bag_order_chukudan');
                }
            });
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('bag_order_list');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('bag_order_list');
                }
            );
            $(".showpage input[name='check_all']").click(function () {
                if ($(this).attr('checked')) {
                    $(".data-load tr input[name='check_order']").attr('checked',true);
                } else {
                    $(".data-load tr input[name='check_order']").attr('checked', false);
                }
            });
            $("#submit_order").click(function () {
                var arr = [];
                $(".data-load tr input[name='check_order']").each(function () {
                    if ($(this).attr('checked')) {
                        arr.push($(this).val());
                    }
                });
                if ($.isEmptyObject(arr)) return my.view.message('请至少选择一个出库单！');
                my.tmpOrder_ids = arr;
                my.view.showTable('bag_order_chukudan');
            });
        }
    };
    my.extend(a, prop);
    my.moudle.bag_order_list = a;
})();