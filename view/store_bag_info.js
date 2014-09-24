my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_bag_info.html',
        title: '订货单详情{order_id}',
        method:'order->getOrderInfo',
        perpage: 10,
        current_quick: '查看历史盘点记录',
        quick: { '查看历史盘点记录': 'store_bag_list' },
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
            return my.order.getContent(this.data.info, this.data.list,this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'order_nums','kucun_danwei']);
        }
    };
    my.extend(a, prop);
    my.moudle.store_bag_info = a;
})();