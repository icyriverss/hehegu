
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_base_addnew.html',
        title: '用户管理-添加新用户',


        current_quick: '返回用户列表',
        quick: { '返回用户列表': 'set_base_user' },

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
            $("#bumen").bind('change', function () {
                var bumen = $(this).val();
                $("#sel_store").hide();
                $("#sel_bag").hide();
                $("#sel_chejian").hide();
                if (!bumen) return;
                if (bumen == '门店') $("#sel_store").show();
                if (bumen == '仓库') $("#sel_bag").show();
                if (bumen == '加工中心') $("#sel_chejian").show();

            });
            $("#data .input-submit").bind('click', function () {
                var user_name = $("#user_name").val();
                var password = $("#password").val();
                var repassword = $("#repassword").val();
                var bumen = $("#bumen").val();
                var loginid = $("#loginid").val();
                var bag_id = $("#bag_id").val();
                var store_id = $("#store_id").val();
                var chejian_id = $("#chejian_id").val();
                var level_name = $("#level_name").val();


                if (!loginid) return my.view.message('请输入用户名!');
                if (!user_name) return my.view.message('请输入姓名!');
                if (!password) return my.view.message('请输入密码!');
                if (password.length < 6 || password.length > 15) return my.view.message('密码长度必须在6-15位之间。');
                if (repassword != password) return my.view.message('两次输入的密码不一致!');
                if (!bumen) return my.view.message('请选择所属部门!');
                if(!level_name) return my.view.message('请选择用户组！');
                if (bumen == '门店' && !store_id) return my.view.message('请选择所在门店！');
                if (bumen == '仓库' && !bag_id) return my.view.message('请选择所在仓库！');
                if (bumen == '加工中心' && !chejian_id) return my.view.message('请选择所在车间！');

                my.view.load(1);
                my.user.addUser(loginid, password, user_name, level_name, bumen, bag_id, chejian_id, store_id, function () {
                    my.view.message('添加新用户成功！', 1, function () {
                        my.view.showTable('set_base_user');
                    });
                }, function (i) {
                    if (i == -1) return my.view.message('用户名已存在，请更换用户名重试！');
                    if (i == 1) return my.view.message('请完善用户基本信息！');
                    my.view.message('添加新用户失败！');
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_addnew = a;
})();