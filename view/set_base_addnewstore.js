
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_base_addnewstore.html',
        title: '门店管理-添加门店',

        current_quick: '返回门店列表',
        quick: { '返回门店列表': 'set_base_store' },

        output: 0,
        init: function () {
            this.arges.page = this.page;
            this.data = { citys: my.citys };
        },
        bindEvent: function () {
            var _this = this;
            $("#data .input-submit").bind('click', function () {
                var arges = {};
                var name = $("#name").val();
                var store_id = $("#store_id").val();
                if (!name) return my.view.message('门店名称必须填写！');
                if (!store_id) return my.view.message('门店ID必须填写！');
                $("#add_new_store input").each(function () {
                    if ($(this).attr('name')) arges[$(this).attr('name')] = $(this).val();
                });
                arges.market_type = $('input[name="market_type"]:checked').val();
                my.view.load(true);
                my.util.send('addNewStore', arges, function (data) {
                    if (data.status == 0) {
                        my.citys = data.citys;//更新城市列表
                        my.view.message('添加门店成功！', 1, function () {
                            my.view.showTable('set_base_store');
                        });
                    } else if (data.status == -1) {
                        my.view.message('门店ID已存在，请重试！');
                    } else {
                        my.view.message('添加门店失败！');
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_addnewstore = a;
})();