


my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_dian_price.html',
        title: '水电参数设置',
        method: 'shuidian->getBiaoList',
        output: 0,
        init: function () {
            if (my.user.info.bumen != '加工中心' && !this.chejian_id) this.chejian_id = getOneChejian_ID();
            this.arges = {
                chejian_id:this.chejian_id || my.user.info.chejian_id
            }
        },
        bindEvent: function () {
            var _this = this;
            $("#data .input-submit").bind('click', function () {
                var res = [];
                $(".biao_list").each(function () {
                    var biao_id = $(this).data('id');
                    var beilv = $('input[name="beilv"]', this).val();
                    var price = $('input[name="price"]', this).val();
                    var startdate = $('input[name="startdate"]', this).val();
                    if (!startdate) startdate = new Date().format('yyyy-MM-dd');
                    res.push({
                        biao_id:biao_id,
                        beilv: beilv,
                        price: price,
                        startdate: startdate
                    });
                });
                my.view.load(1);
                my.shuidian.editPrice({ list: res, chejian_id: _this.chejian_id || my.user.info.chejian_id }, function () {
                    my.view.message('配置成功！', 1, function () {
                        my.view.showTable('chejian_dian_price');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.chejian_dian_price = a;
})();