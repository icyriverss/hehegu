/// <reference path="~/moudle/my.js" />
/// <reference path="~/moudle/util.js" />
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/bag_order_info.html',
        title: '生成发货单 {order_id}',
        method:'order->getOrderInfo',
        perpage: 10,
        current_quick: '处理订货单',
        quick: { '处理订货单': 'bag_order_send' },
        real_send:{},
        init: function () {
            this.arges = {
                id: my.tmpOrder_id ? my.tmpOrder_id : '',
                ids: my.tmpOrder_ids ? my.tmpOrder_ids : ''
            };
        },
        getTitle: function () {
            if (!$.isEmptyObject(my.tmpOrder_ids)) my.tmpOrder_id = '合并单据' + new Date().format('yyyyMMddhhmmss');
            return this.title ? this.title.replace(/\{order_id\}/g, my.tmpOrder_id) : '';
        },
        getTableHtml: function () {
            var _this = this;
            if (this.data.ids) {
                return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums'], '', this.data.ids,1);
            } else {
                return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums', 'real_send_edit'], '确认发货');
            }
        },
        initData:function(data){
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

        bindEvent: function () {
            var _this = this;
            $(".data-load td input[name='shifa_num']").bind('keyup', function () {
                var nums = parseFloat($(this).val());
                if (isNaN(nums)) nums = 0;
            });
            $("#print_order").click(function () {
                var tablestr = my.order.getContent(_this.data.info, _this.data.list, _this.data.types, ['type_name', 'name', 'kucun_danwei', 'order_nums', 'real_send']);
                my.view.print(tablestr);
            });
            $("#submit_order").click(function () {
                var order_id = $(this).data('id');
                _this.real_send = {};
                $(".data-load td input[name='shifa_num']").each(function () {
                    var bianhao = $(this).data('id');
                    var nums = $(this).val();
                    nums = parseFloat(nums, 10);
                    if (isNaN(nums)) nums = 0;
                    _this.real_send[bianhao] = nums;
                });
                if (confirm('请问是否确认发货？确认后将不可修改！')) {
                    $.each(_this.data.list, function () {
                        this.real_send = _this.real_send[this.bianhao];
                    });
                    
                    my.view.load(1);
                    my.util.send('order->sendOrder', { order_id: my.tmpOrder_id, list: _this.real_send }, function (data) {
                        if (data.status === 1) return my.view.message('该订单已经发货，请勿重复发货！');
                        if (data.status === 0) {
                            my.view.message('发货成功！', 1, function () {
                                //var tablestr = my.order.getContent(_this.data.info, _this.data.list, _this.data.types, ['type_name', 'name', 'kucun_danwei', 'order_nums', 'real_send']);
                                //my.view.print(tablestr);
                                my.view.showTable('bag_order_list');
                            });
                        }
                    });
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.bag_order_info = a;
})();