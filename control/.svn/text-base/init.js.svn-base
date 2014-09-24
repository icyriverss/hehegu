$(document).ready(function () {
    if (window.location.hash === '#debug' || window.location.href.indexOf('hhg.x.com')!==-1) {
        my.debug = true;
    } else {
        my.debug = false;
        console = {};
        console.log = function () { };
    }
    var bTest = false;
    if (bTest) {
        my.view.showMain();
        setTimeout(function () {
            my.view.showTable('caiwu_yusuan_type');
        }, 500);
        return;
    }
    my.view.showLogin();
    $(".logo").bind('click', function () {
        if (my.user.user_name) {//已登录状态
            my.view.showMain();
        } else {
            my.view.showLogin();//未登录状态
        }
    });
});