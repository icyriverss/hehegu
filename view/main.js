
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/main.html',
        title: '欢迎使用和合谷报表系统',
        output: 0,
        init: function () {
            
            this.data = my.user.info;
        },
        bindEvent: function () {
            
            var _this = this;
            $(".login_main a").eq(0).click(function () {
                if ($(".changepassword").is(":visible")) {
                    $(".changepassword").fadeOut(500);
                } else {
                    $(".changepassword").fadeIn(500);
                    $("#oldpassword").val('');
                    $("#password").val('');
                    $("#repassword").val('');
                }
            });
            $(".login_main a").eq(1).click(function () {
                my.view.load('on');
                my.user.logout(function () {
                    $(".top .user").html('当前帐号：游客');
                    my.view.load('off');
                    my.view.showLogin();
                });
            });
            $(".input-submit").click(function () {
                var oldpass = $("#oldpassword").val();
                var newpass = $("#password").val();
                var repass = $("#repassword").val();
                if (!oldpass) return my.view.message('请输入旧密码！');
                if (!newpass || newpass.length < 6 || newpass.length > 15) return my.view.message('新密码长度必须在6-15之间！');
                if (newpass != repass) return my.view.message('两次输入的密码不一致！');
                my.view.load('on');
                my.user.changePassword(oldpass, newpass, function () {
                    my.view.message('修改密码成功！', 1, function () {
                        $(".changepassword").fadeOut(500);
                        $("#oldpassword").val('');
                        $("#password").val('');
                        $("#repassword").val('');
                    });
                }, function () {
                    my.view.message('旧密码不正确，请重试！')
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.main = a;
})();