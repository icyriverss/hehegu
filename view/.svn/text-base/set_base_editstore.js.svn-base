
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'store->getInfo',
        template_url: 'view/set_base_addnewstore.html',
        title: '门店管理-修改门店信息',
        current_quick: '返回门店列表',
        quick: { '返回门店列表': 'set_base_store' },
        output: 0,
        init: function () {
            this.storeid = my.moudle['set_base_store'].storeid;//获取要修改的用户ID
            this.arges = { store_id: this.storeid };
        },
        initData: function (data) {
            data.citys = my.citys;
            this.data = data;
            this.data.bumen = my.user.info.bumen;
            this.data.power = my.user.power;
        },
        bindEvent: function () {
            var _this = this;
            $("#selectcity").bind('change', function () {
                $("#city").val($(this).val());
            });
            $("#data .input-submit").bind('click', function () {
                var arges = {};
                var name = $("#name").val();
                var store_id = $("#store_id").val();
                $("#add_new_store input").each(function () {
                    if ($(this).attr('name')) arges[$(this).attr('name')] = $(this).val();
                });
                arges.store_id = _this.storeid;
                arges.market_type = $('input[name="market_type"]:checked').val();
                my.view.load(true);
                my.util.send('store->edit', arges, function (data) {
                    if (data.status == 0) {
                        my.citys = data.citys;//更新城市列表
                        my.view.message('修改门店信息成功！', 1, function () {
                            my.view.showTable('set_base_store');
                        });
                    } else if (data.status == -1) {
                        my.view.message('门店ID已存在，请重试！');
                    } else {
                        my.view.message('修改门店信息失败！');
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_editstore = a;
})();