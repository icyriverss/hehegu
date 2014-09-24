
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/rs_bumen_add.html',
        title: '部门管理-添加部门',
        current_quick: '返回部门列表',
        quick: { '返回部门列表': 'rs_bumen_list' },

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
                var department = $("#department").val();
                
                if (!department) return my.view.message('请输入部门名称!');

                my.view.load(1);
                my.util.send('personnel->add_department', {
                    department: department
                }, function (data) {
                    if (data.status != 0) return my.view.message('添加部门失败！');
                    my.view.message('添加部门成功！', 1, function () {
                        my.view.showTable('rs_bumen_list');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_bumen_add = a;
})();