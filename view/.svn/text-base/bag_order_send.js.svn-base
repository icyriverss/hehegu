my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/bag_order_send.html',
        title: '处理订货单',
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
                gettype: 'fahuo'//获取类型为出库单，
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
            return my.order.getList(this.data.list, ['select', 'store_id', 'order_name', 'order_date', 'order_id', 'statusTxt', 'user_name'], {
                txt: '详情',
                cb: function (order_id) {
                    my.tmpOrder_id = order_id;
                    my.tmpOrder_ids = null;
                    my.view.showTable('bag_order_info');
                }
            }, {
                txt: '删除',
                cb: function (order_id) {
                    if (confirm("是否确认删除？删除后将不可恢复！")) {
                        my.util.send('order->delOrder', { order_id: order_id }, function (data) {
                            if (data.status == 1) return my.view.message('删除订单失败！');
                            if (data.status == 0) {
                                my.view.message('删除成功！', 1, function () {
                                    my.view.showTable('bag_order_send');
                                });
                            }
                        });
                    }
                }
            });
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('bag_order_send');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('bag_order_send');
                }
            );
            $(".showpage input[name='check_all']").click(function () {
                if ($(this).attr('checked')) {
                    $(".data-load tr input[name='check_order']").attr('checked', true);
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
                if ($.isEmptyObject(arr)) return my.view.message('请至少选择一个单据！');
                my.tmpOrder_ids = arr;
                my.view.showTable('bag_order_info');
            });
        }
    };
    my.extend(a, prop);
    my.moudle.bag_order_send = a;
})();