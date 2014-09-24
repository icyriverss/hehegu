

my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_dian_set.html',
        title: '水电配置',
        method:'shuidian->getTypeList',
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
                $("input[name='biao_type']:checked").each(function () { res.push($(this).val());});
                my.view.load(1);
                my.shuidian.editBiao({ ids: res, chejian_id: _this.chejian_id || my.user.info.chejian_id }, function () {
                    my.view.message('配置成功！', 1, function () {
                        my.view.showTable('chejian_dian_set');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.chejian_dian_set = a;
})();