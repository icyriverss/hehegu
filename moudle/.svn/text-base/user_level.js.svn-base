//用户组管理类
my.userlevel = {
    //添加用户分组
    addLevel: function (name,power,cb) {
        my.util.send('userlevel->addLevel', { name: name, power: power }, function (data) {
            if (data.status == 1) return my.view.message('用户组已存在，请重试！');
            if (data.status == 2) return my.view.message('请输入用户组名和权限！');
            if(cb && typeof cb=='function') cb();
        });
    },
    //删除用户组
    delLevel: function (name,cb) {
        my.util.send('userlevel->delLevel', { name: name }, function (data) {
            if (data.status == 1) return my.view.message('用户组已存在用户，请先删除用户后重试！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    //编辑用户组
    editLevel: function (name, newname, power,cb) {
        if (!newname) return my.view.message('请输入用户组名称！');
        my.util.send('userlevel->editLevel', { name: name, newname: newname, power: power }, function (data) {
            if (data.status == 1) return my.view.message('用户组已存在，请重试！');
            if (data.status == 2) return my.view.message('请输入用户组名和权限！');
            if (cb && typeof cb == 'function') cb();
        });
    },
    //获取权限列表
    getPowerList: function () {
        var arr = [];
        $.each(my.menu, function () {

        });
    },
    //检测权限，传入权限数组、栏目名
    checkPower: function (power,classname) {

    }
}