

my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_dian_set.html',
        title: '水电配置',
        method:'shuidian->getTypeList',
        output: 0,
        init: function () {
            if (my.user.info.bumen != '门店' && !this.store_id) this.store_id = getOneStore_ID();
            this.arges = {
                store_id:this.store_id || my.user.info.store_id
            }
        },
        bindEvent: function () {
            var _this = this;
            $("#data .input-submit").bind('click', function () {
                var res = [];
                $("input[name='biao_type']:checked").each(function () { res.push($(this).val());});
                my.view.load(1);
                my.shuidian.editBiao({ ids: res, store_id: _this.store_id || my.user.info.store_id }, function () {
                    my.view.message('配置成功！', 1, function () {
                        my.view.showTable('store_dian_set');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.store_dian_set = a;
})();