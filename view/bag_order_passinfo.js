my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/bag_order_passinfo.html',
        title: '审核收货单 {order_id}',
        method:'order->getOrderInfo',
        perpage: 10,
        output: 0,
        current_quick: '收货单审核',
        quick: { '收货单审核': 'bag_order_pass' },
        real_send:{},
        init: function () {
            this.arges = {
                id: my.tmpOrder_id
            };
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
            return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums', 'real_send','real_recv','chayi','chayi_yuanyin'], '确认审核');
        },
        bindEvent: function () {
            var _this = this;
            $(".data-load td input[name='shifa_num']").bind('keyup', function () {
                var nums = parseFloat($(this).val());
                if (isNaN(nums)) nums = 0;
                $(this).val(nums);
            });
            $("#submit_order").click(function () {
                var order_id = $(this).data('id');
                my.view.load(1);
                my.util.send('order->passOrder', { order_id: my.tmpOrder_id}, function (data) {
                    if (data.status == 1) return my.view.message('该订单已经审核，请勿重复审核！');
                    if (data.status == 0) {
                        my.view.message('审核成功！', 1, function () {
                            my.view.showTable('bag_order_pass');
                        });
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.bag_order_passinfo = a;
})();