
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_base_addnewuserlevel.html',
        title: '用户组管理-添加新用户组',
        current_quick: '返回用户组列表',
        quick: { '返回用户组列表': 'set_base_userlevel' },
        selection:'',
        output:0,
        init: function () {
            this.data.list = my.menu.config;
        },
        bindEvent: function () {
            var _this = this;
            $("#power_list a").click(function () {
                var type = $(this).data('type');
                var value = $(this).data('value');
                var status = $(this).data('status');//全选、全不选
                var bCheck = !!status ? false : true;
                $("#power_list input").each(function () {
                    if ($(this).data(type) == value || $(this).val()==value) {
                        $(this).attr('checked', bCheck);
                    }
                });
                $(this).data('status', bCheck);
            });
            $("#data .input-submit").bind('click', function () {
                var level_name = $("#level_name").val();
                var arr = [];
                $("#power_list input").each(function () {
                    if ($(this).attr('checked')) {
                        arr.push($(this).val());
                    }
                });
                my.view.load(1);
                my.userlevel.addLevel(level_name, arr, function () {
                    my.view.message('添加用户组成功！', 1, function () {
                        my.view.showTable('set_base_userlevel');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_addnewuserlevel = a;
})();