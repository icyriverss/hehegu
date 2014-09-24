my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_order_okinfo.html',
        title: '报损登记确认',
        output: 0,
        current_quick: '返回修改',
        quick: { '返回修改': 'store_sun_cailiao'},
        real_recv: {},//实收数组
        init: function () {
            this.data = my.baosun;
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
            return my.order.getContent({order_type:5,store_id:my.baosun.current_store_id,adddate:my.baosun.adddate}, my.baosun.list, '', ['bianhao', 'name', 'guige', 'kucun_danwei', 'baosun_num', 'baosun_yuanyin'],'确认提交');
        },
        bindEvent: function () {
            var _this = this;
            $(".city_submit").click(function () {
                var arr = [];
                $.each(my.baosun.list, function () {
                    var tmp = {};
                    tmp.cInvCode = this.bianhao;
                    tmp.nums = this.baosun_num;
                    tmp.baosun_yuanyin = this.baosun_yuanyin;
                    arr.push(tmp);
                });
                my.view.load(1);
                my.util.send('order->addNewOrder', {
                    list: arr,
                    order_type: 5,
                    order_name: '材料报损登记',
                    order_date: my.baosun.adddate,
                    current_store_id: my.baosun.current_store_id
                }, function (data) {
                    if (!data.status == 0) return my.view.message('提交报损登记失败，请联系系统管理员！');
                    my.baosun = {};//提交成功，清空缓存
                    my.view.message('提交报损登记成功！', 1, function () {
                        my.view.showTable('store_sun_list');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.store_sun_confirm = a;
})();