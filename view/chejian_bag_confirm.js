my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_bag_confirm.html',
        title: '日结盘点登记确认',
        perpage: 10,
        output: 0,
        current_quick: '返回修改登记单',
        quick: { '返回修改登记单': 'chejian_bag_day' },
        init: function () {
            var _this = this;
            this.data = my.pandian;
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
                    tmp.nums = this.order_nums;
                    tmp.baozhuang_num = this.baozhuang_num;
                    tmp.type_name = this.goods_type;//分类
                    tmp.type_index = this.goods_type_index;//分类索引
                    arr.push(tmp);
                });
                my.view.load(1);
                my.util.send('order->addNewOrder', {
                    list: arr,
                    order_type: 4,
                    order_name: '日结盘点登记',
                    order_date: my.pandian.adddate,
                    current_chejian_id:my.pandian.current_chejian_id
                }, function (data) {
                    if (data.status == 5) return my.view.message('该日期已经提交盘点，每日请只能提交一次！');
                    if (!data.status == 0) return my.view.message('提交盘点登记失败，请联系系统管理员！');
                    my.pandian = {};//提交成功，清空缓存
                    my.view.message('提交盘点登记成功！', 1, function () {
                        my.view.showTable('chejian_bag_list');
                    });
                });
            });
        },
    };
    my.extend(a, prop);
    my.moudle.chejian_bag_confirm = a;
})();