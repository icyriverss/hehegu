my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_order_confirm.html',
        title: '订货单确认',
        perpage: 10,
        output: 0,
        current_quick: '返回修改订货单',
        quick: { '返回修改订货单': 'store_order_order' },
        init: function () {
            var _this = this;
            this.data = my.zongbu;
            this.data.list.sort(function (x, y) {
                return x.goods_type_index - y.goods_type_index;
            });
            $.each(this.data.list, function () {
                if (_this.data.type[this.goods_type]) {
                    if (!_this.data.type[this.goods_type].total) _this.data.type[this.goods_type].total = 0;
                    this.goods_rowspan = _this.data.type[this.goods_type].total;
                    _this.data.type[this.goods_type].total++;
                }
            });
        },
        bindEvent: function () {
            var _this = this;
            $(".city_submit").click(function () {
                var arr=[];
                $.each(_this.data.list, function () {
                    var tmp = {};
                    tmp.cInvCode = this.cInvCode;
                    tmp.nums = this.order_nums;//订货数量
                    tmp.type_name = this.goods_type;//分类
                    tmp.type_index = this.goods_type_index;//分类索引
                    arr.push(tmp);
                });
                my.view.load(1);
                my.util.send('order->addNewOrder', {
                    list: arr,
                    order_type: my.zongbu.order_type,
                    order_name: my.zongbu.order_name,
                    bagid: my.zongbu.bagid,
                    bagname: my.zongbu.bagname,
                    vendorid: my.zongbu.vendorid,
                    vendorname: my.zongbu.vendorname,
                    storeid: my.zongbu.storeid,
                    storename: my.zongbu.storename,
                    order_date: my.zongbu.order_date,
                    current_store_id:my.zongbu.current_store_id
                }, function (data) {
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
    my.moudle.store_order_confirm = a;
})();