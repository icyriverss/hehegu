
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'userlevel->getLevelInfo',
        template_url: 'view/set_base_addnewuserlevel.html',
        title: '用户组管理-修改用户组',
        current_quick: '返回用户组列表',
        quick: { '返回用户组列表': 'set_base_userlevel' },
        selection: '',
        output: 0,
        init: function () {
            this.level_name = my.moudle['set_base_userlevel'].level_name;//获取要修改的用户ID
            this.arges = { level_name: this.level_name };
        },
        initData: function (data) {
            if (data.power) {//格式化权限
                var power = data.power;
                data.power = {};
                $.each(power, function () {
                    data.power[this] = 1;
                });
            }
            this.data = data;
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
                    if ($(this).data(type) == value || $(this).val() == value) {
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
                my.userlevel.editLevel(_this.data.level_name,level_name, arr, function () {
                    my.view.message('修改用户组成功！', 1, function () {
                        my.view.showTable('set_base_userlevel');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_edituserlevel = a;
})();