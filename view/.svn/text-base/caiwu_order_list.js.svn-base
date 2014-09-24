my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/caiwu_order_list.html',
        title: '历史订货记录',
        perpage: 10,
        page:1,
        output: 0,
        method: 'order->getOrderList',
        storeid: '',
        chejianid: '',
        order_date: '',
        order_id: '',
        bumen:'',
        init: function () {
            //if (!this.order_date) this.order_date = new Date().format('yyyy-MM-dd');
            this.arges = {
                perpage: this.perpage,
                page: this.page,
                gettype: 'caiwu',//获取类型为财务，
                order_date: this.order_date,
                order_id: this.order_id,
                storeid: this.storeid,
                chejianid: this.chejianid,
                bumen:this.bumen,
                order_type:1
            };
        },
        initData:function(data){
            this.data = data;
            $.each(this.data.list, function () {
                this.statusTxt = my.orderStatus[this.status];
            });
            this.data.order_date = this.order_date;
            this.data.stores = my.allStores;
            this.data.chejians = my.chejians;
            this.data.bumen = this.bumen;
            this.data.storeid = this.storeid;
            this.data.chejianid = this.chejianid;
            this.data.order_id = this.order_id;
        },
        bindEvent: function () {
            var _this = this;
            this.setShowPage();
            $("input[name='bumen']").click(function () {
                var value = $(this).val();
                if (!value) {
                    $(".store_list").hide();
                    $(".chejian_list").hide();
                    return;
                }
                if (value == 'store') {
                    $(".store_list").show();
                    $(".chejian_list").hide();
                    return;
                }
                if (value == 'chejian') {
                    $(".store_list").hide();
                    $(".chejian_list").show();
                    return;
                }
            });
            $(".datalist a").bind('click', function () {
                var type = $(this).data('type');
                var order_id = $(this).data('id');
                if (!order_id) return;
                if (type == 'info') {
                    my.tmpOrder_id = order_id;
                    my.view.showTable('caiwu_order_info');
                } else if (type == 'del') {
                    _this.delOrder(order_id);
                }
            });
            $("#submit_order").click(function () {
                _this.bumen = $("input[name='bumen']:checked").val();
                _this.order_date = $("input[name='order_date']").val();
                _this.storeid = $("select[name='store']").val();
                _this.chejianid = $("select[name='chejian']").val();
                _this.order_id = $("input[name='order_id']").val();
                if (_this.bumen == 'store') {
                    _this.chejianid = '';
                } else if (_this.bumen == 'chejian') {
                    _this.storeid = '';
                } else {
                    _this.chejianid = '';
                    _this.storeid = '';
                }
                my.view.showTable('caiwu_order_list');
            });
        },
        delOrder: function (order_id) {
            if (confirm("是否确认删除？删除后将不可恢复！")) {
                my.util.send('order->delOrder', { order_id: order_id }, function (data) {
                    if (data.status == 1) return my.view.message('删除订单失败！');
                    if (data.status == 0) {
                        my.view.message('删除成功！', 1, function () {
                            my.view.showTable('caiwu_order_list');
                        });
                    }
                });
            }
        },
        setShowPage: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('caiwu_order_list');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('caiwu_order_list');
                }
            );
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_order_list = a;
})();