my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_order_info.html',
        title: '订单详情 {order_id}',
        method:'order->getOrderInfo',
        perpage: 10,
        current_quick: '返回历史订货记录',
        quick: { '返回历史订货记录': 'store_order_list' },
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
                    if(!this.type_name) this.type_name='临时增加';
                    arr_type[this.type_name]=1;
                }
                this.total = arr_type[this.type_name];
            });
            this.data.types = arr_type;
            this.data.info.statusTxt = my.orderStatus[this.data.info.status];
        },
        getTableHtml: function () {
            var _this = this;
            return my.order.getContent(this.data.info, this.data.list,this.data.types, ['type_name', 'bianhao', 'name', 'guige','kucun_danwei', 'order_nums', 'real_send', 'real_recv', 'chayi', 'chayi_yuanyin']);
        },
        bindEvent: function () {
            var _this = this;
            $(".city_submit").click(function () {
                var arr=[];
                $.each(_this.data.list, function () {
                    var tmp = {};
                    tmp.cInvCode = this.cInvCode;
                    tmp.nums = this.order_nums;
                    tmp.baozhuang_num = this.baozhuang_num;
                    arr.push(tmp);
                });
                my.view.load(1);
                my.util.send('order->addNewOrder', { list: arr,bagid:my.zongbu.bagid }, function (data) {
                    if (!data.status == 0) return my.view.message('提交订货单失败，请联系系统管理员！');
                    my.zongbu = {};//提交成功，清空缓存
                    my.view.message('提交订货单成功！', 1, function () {
                        my.view.showTable('store_order_list');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.store_order_info = a;
})();