my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_order_okinfo.html',
        title: '收货确认 {order_id}',
        method:'order->getOrderInfo',
        perpage: 10,
        output: 0,
        current_quick: '返回收货单列表',
        quick: { '返回收货单列表': 'chejian_order_ok' },
        real_recv: {},//实收数组
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
            return my.order.getContent(this.data.info, this.data.list, this.data.types, ['type_name', 'bianhao', 'name', 'guige', 'kucun_danwei', 'order_nums', 'real_send', 'real_recv_edit', 'chayi', 'chayi_yuanyin_edit'],'确认收货');
        },
        bindEvent: function () {
            var _this = this;
            $(".data-load td input[name='shishou_num']").bind('keyup', function () {//修改实收
                var nums = parseFloat($(this).val());
                if (isNaN(nums)) nums = 0;
                var real_send = parseFloat($(this).parent().parent().find('.real_send').html());
                if (isNaN(real_send)) real_send = 0;
                var chayi = parseInt(nums * 10000 - real_send * 10000)/10000;
                $(this).parent().parent().find('.chayi').html(chayi);
            });
            $("#submit_order").click(function () {
                var order_id = $(this).data('id');

                _this.real_recv = {};
                var bpass = true;
                $(".data-load td input[name='shishou_num']").each(function () {
                    var bianhao = $(this).data('id');
                    var nums = $(this).val();
                    nums = parseFloat(nums);
                    if (isNaN(nums)) nums = 0;
                    var real_send = parseFloat($(this).parent().parent().find('.real_send').html());
                    if (isNaN(real_send)) real_send = 0;
                    var chayi = nums - real_send;

                    //$(this).parent().html(nums);
                    var chayi_yuanyin = $(this).parent().parent().find('input[name="chayi_yuanyin"]').val();
                    if (chayi && !chayi_yuanyin) {
                        my.view.message('编号为：' + bianhao + '的物品没有录入差异原因，请录入差异原因！');
                        bpass = false;
                        return false;
                    }
                    _this.real_recv[bianhao] = {
                        nums: nums,
                        chayi_yuanyin: chayi_yuanyin,
                        chayi:chayi
                    };
                });
                if (!bpass) return;
                if(confirm('请问是否确认收货？确认后将不可修改！')){
                    my.view.load(1);
                    my.util.send('order->recvOrder', { order_id: my.tmpOrder_id, list: _this.real_recv }, function (data) {
                        if (data.status == 1) return my.view.message('该订单已经确认收货，请勿重复收货！');
                        if (data.status == 0) {
                            my.view.message('确认收货成功！', 1, function () {
                                my.view.showTable('chejian_order_ok');
                            });
                        }
                    });
                }   
            });
        }
    };
    my.extend(a, prop);
    my.moudle.chejian_order_okinfo = a;
})();