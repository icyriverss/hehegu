my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/bag_order_chukudan.html',
        title: '出库单 {order_id}',
        method:'order->getOrderInfo',
        perpage: 10,
        current_quick: '出库单记录',
        quick: { '出库单记录': 'bag_order_list' },
        real_send:{},
        init: function () {
            this.arges = {
                id: my.tmpOrder_id?my.tmpOrder_id:'',
                ids:my.tmpOrder_ids?my.tmpOrder_ids:''
            };
        },
        getTitle: function () {
            if (!$.isEmptyObject(my.tmpOrder_ids)) my.tmpOrder_id = '合并出库单' + new Date().format('yyyyMMddhhmmss');
            return this.title ? this.title.replace(/\{order_id\}/g, my.tmpOrder_id) : '';
        },
        initData: function (data) {
            this.data = data;
            var arr_type = [];
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
            if (!$.isEmptyObject(my.tmpOrder_ids)) {
                this.data.ids = my.tmpOrder_ids.join('_');
            }
            
        },
        getTableHtml: function () {
            var _this = this;
            if (this.data.ids) {
                return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums', 'real_send'], '', this.data.ids,1);
            } else {
                if (this.data.info.order_type == 7 || this.data.info.order_type == 8) {//补发出库单
                    return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums'], '', '', 1);
                } else {
                    return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums', 'real_send', 'real_recv', 'chayi', 'chayi_yuanyin'], '', '', 1);
                }
            }
        },
        bindEvent: function () {
            var _this = this;
            if (!$.isEmptyObject(my.tmpOrder_ids)) {
                var ids = my.tmpOrder_ids.join(',');
            }
            $(".data-load td input[name='shifa_num']").bind('keyup', function () {
                var nums = parseFloat($(this).val());
                if (isNaN(nums)) nums = 0;
                $(this).val(nums);
            });
            $("#print_order").click(function () {
                if (ids) {
                    this.href = 'print.html#' + ids;
                } else {
                    this.href = 'print.html#' + _this.data.info.order_id;
                }
            });
            $("#submit_order").click(function () {
                var order_id = $(this).data('id');
                var page_status = $(this).data('status');
                if (page_status === 1) {//生成发货单
                    _this.real_send = {};
                    $(".data-load td input[name='shifa_num']").each(function () {
                        var bianhao = $(this).data('id');
                        var nums = $(this).val();
                        nums = parseInt(nums,10);
                        if (isNaN(nums)) nums = 0;
                        $(this).parent().html(nums);
                        _this.real_send[bianhao] = nums;
                    });
                    $(this).data('status', '2');
                    $(this).val('确认发货');
                } else {//确认发货
                    my.view.load(1);
                    my.util.send('order->sendOrder', { order_id: my.tmpOrder_id, list: _this.real_send }, function (data) {
                        if (data.status === 1) return my.view.message('该订单已经发货，请勿重复发货！');
                        if (data.status === 0) {
                            my.view.message('发货成功！', 1, function () {
                                my.view.showTable('bag_order_list');
                            });
                        }
                    });
                }
            });
            my.tmpOrder_ids = [];//清空多选的出库单
        }
    };
    my.extend(a, prop);
    my.moudle.bag_order_chukudan = a;
})();