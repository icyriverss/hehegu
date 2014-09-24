my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_order_info.html',
        title: '订单详情 {order_id}',
        method:'order->getOrderInfo',
        perpage: 10,
        current_quick: '返回列表',
        output:0,
        quick: { '返回列表': 'caiwu_order_list'},
        init: function () {
            this.arges = {
                id: my.tmpOrder_id ? my.tmpOrder_id : '',
                ids: my.tmpOrder_ids ? my.tmpOrder_ids : ''
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
                this.real_send = this.real_send ? this.real_send : '0';
                this.real_recv = this.real_recv ? this.real_recv : '0';
                this.order_nums = this.order_nums ? this.order_nums : '0';
                this.chayi_yuanyin = this.chayi_yuanyin ? this.chayi_yuanyin : '';
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
                return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums_edit', 'real_send_edit'], '', this.data.ids);
            } else {
                return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums_edit', 'real_send_edit', 'real_recv_edit', 'chayi_yuanyin_edit'], '修改');
            }
        },
        bindEvent: function () {
            $("#submit_order").click(function () {
                var arr = {};
                $(".data-load td input[name='order_nums']").each(function () {
                    var id = $(this).data('id');
                    if (!arr[id]) arr[id] = {};
                    arr[id].order_nums = $(this).val();
                });
                $(".data-load td input[name='real_send']").each(function () {
                    var id = $(this).data('id');
                    if (!arr[id]) arr[id] = {};
                    arr[id].real_send = $(this).val();
                });
                $(".data-load td input[name='real_recv']").each(function () {
                    var id = $(this).data('id');
                    if (!arr[id]) arr[id] = {};
                    arr[id].real_recv = $(this).val();
                });
                $(".data-load td input[name='chayi_yuanyin']").each(function () {
                    var id = $(this).data('id');
                    if (!arr[id]) arr[id] = {};
                    arr[id].chayi_yuanyin = $(this).val();
                });
                var tmp = [];
                $.each(arr, function (k) {
                    tmp.push({
                        bianhao: k,
                        order_nums: this.order_nums,
                        real_send:this.real_send,
                        real_recv: this.real_recv,
                        chayi_yuanyin:this.chayi_yuanyin
                    });
                });
                my.view.load(1);
                my.util.send('order->editOrder', { order_id: my.tmpOrder_id, list: tmp }, function (data) {
                    if (data.status === 1) return my.view.message('修改失败！');
                    if (data.status === 0) {
                        my.view.message('修改成功！', 1, function () {
                            my.view.showTable('caiwu_order_info');
                        });
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_order_info = a;
})();