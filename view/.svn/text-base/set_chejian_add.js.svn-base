
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_chejian_add.html',
        title: '车间管理-添加车间',
        current_quick: '返回车间列表',
        quick: { '返回车间列表': 'set_chejian_manage' },

        output:0,
        init: function () {
            this.arges.page = this.page;
            this.data = {
                levels: my.user.info.config.levels,
                stores: my.stores,
                bags: my.bags,
                chejians:my.chejians
            };
        },
        bindEvent: function () {
            var _this = this;
            $("#data .input-submit").bind('click', function () {
                var chejian_name = $("#chejian_name").val();
                var chejian_id = $("#chejian_id").val();
                
                if (!chejian_id) return my.view.message('请输入车间ID!');
                if (!chejian_name) return my.view.message('请输入车间名称!');

                my.view.load(1);
                my.chejian.add(chejian_id, chejian_name, function () {
                    my.view.message('添加车间成功！', 1, function () {
                        my.view.showTable('set_chejian_manage');
                    });
                }, function (i) {
                    if (i == 2) return my.view.message('车间ID或名称已存在，请更换重试！');
                    if (i == 1) return my.view.message('请完善基本信息！');
                    my.view.message('添加车间失败！');
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_chejian_add = a;
})();