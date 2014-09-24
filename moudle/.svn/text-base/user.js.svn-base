my.user = {
    user_name: null,
    power: {},
    regtime: '',
    logintimes: '',
    list: '',
    bumen: '',
    store_id: '',//用户所属门店
    info: {},//登录成功后的信息数组
    power: {},
    //初始化登录成功接收的信息
    initLoginInfo: function () {
        var _this = this;
        //门店
        my.stores = {};
        my.allStores = {};
        my.citys = [];//城市
        $.each(this.info.config.stores, function () {
            my.allStores[this.store_id] = this;
            if (this.store_id < 8000)
                my.stores[this.store_id] = this;//改成store_id索引
            if (!this.city) return true;
            if ($.inArray(this.city, my.citys) == -1) my.citys.push(this.city);
        });
        my.bags = this.info.config.bags;//仓库
        my.chejians = {};
        $.each(this.info.config.chejians, function () {
            my.chejians[this.chejian_id] = this;
        });
        _this.power = {};
        $.each(this.info.power, function () {
            _this.power[this] = 1;
        });
        my.departments = {};
        $.each(this.info.config.departments, function () {
            my.departments[this.id] = this;
        });
    },
    //登录信息
    login: function (loginid, password, sucess, fail) {
        var _this = this;
        my.util.send('user->userLogin', {
            loginid: loginid,
            password: password
        }, function (data) {
            if (data.status == 0) {
                _this.info = data;
                _this.initLoginInfo();
                if (sucess && typeof sucess == 'function') sucess();
                return;
            }
            if (fail && typeof fail == 'function') fail(data.status);
        });
    },
    //test:function(){
    //    var users = '范锁军,郭兴宇,贾新伟,刘海,李兵,郭艳青,曹冬丽,赵长青,王瑞斌,庞姝,董颖超,白俊林,程鹏,段玲玲,刘永毅,胡晓丽,郝磊,李艳丽,范云龙,邵晓瑞,杨庆辉,宋萌萌,亢鹏,杜胤,张晓丹,李艳青,卢亮,陈洋,卫龙,刑邵杰,杨彦芳,张强,赵杨杰,张波';
    //    var arr = users.split(',');
    //    var a = [];
    //    for(var i=0;i<arr.length;i++){
    //        var tmp = {};
    //        tmp.user_name = arr[i];
    //        tmp.loginid = makePy(arr[i])[0];
    //        tmp.password = '123456';
    //        tmp.level_name = '';
    //        tmp.bumen = '门店';
    //        this.addUser(tmp.loginid, tmp.password, tmp.user_name, '门店操作员', tmp.bumen,'','','');
    //    }
    //},
    //添加用户
    addUser: function (loginid, password, user_name, level_name, bumen, bag_id, chejian_id, store_id, cb, fail) {
        var _this = this;
        my.util.send('user->addUser', {
            loginid: loginid,
            password: password,
            user_name: user_name,
            level_name: level_name,
            bumen: bumen,
            bag_id: bag_id,
            chejian_id: chejian_id,
            store_id: store_id
        }, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail(data.status);
                return;
            }
            if (cb && typeof cb == 'function') cb();
        });
    },
    //修改用户
    editUser: function (user_id, loginid, password, user_name, level_name, bumen, bag_id, chejian_id, store_id, cb, fail) {
        var _this = this;
        my.util.send('user->editUser', {
            loginid: loginid,
            password: password,
            user_name: user_name,
            level_name: level_name,
            bumen: bumen,
            bag_id: bag_id,
            chejian_id: chejian_id,
            store_id: store_id,
            user_id: user_id
        }, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail();
                return;
            }
            if (cb && typeof cb == 'function') cb();
        });
    },
    //检测登录状态
    chkLoginStatus: function (sucess, fail) {
        var _this = this;
        my.util.send('user->chkStatus', {}, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail();
                return;
            }
            _this.info = data;
            _this.initLoginInfo();
            if (sucess && typeof sucess == 'function') sucess();
        });
    },

    //删除用户
    delUser: function (loginid, cb) {
        var _this = this;
        my.util.send('user->delUser', { loginid: loginid }, function (data) {
            if (cb && typeof cb == 'function') cb();
        });
    },
    //修改密码
    changePassword: function (oldpass, newpass, sucess, fail) {
        var _this = this;
        my.util.send('user->changePass', { oldpass: oldpass, newpass: newpass }, function (data) {
            if (data.status != 0) {
                if (fail && typeof fail == 'function') fail(data.status);
                return;
            }
            if (sucess && typeof sucess == 'function') sucess();
        });
    },
    //退出登录
    logout: function (cb) {
        var _this = this;
        my.util.send('user->logOut', {}, function () {
            _this.info = {};
            if (cb && typeof cb == 'function') cb();
        });
    },

    //检查权限
    checkPower: function (type) {
        var dispower = ['main'];
        if (this.power['admin'] == 1) return true;//超级管理员
        if (this.power[type] == 1) return true;
        if ($.inArray(type, dispower) != -1) return true;
        return false;
    },
    returnPower: function (type) {
        if (!this.checkPower(type)) return my.view.message('权限不足，请联系管理员。');
    },
    //检测用户的任务队列
    chkTask: function () {
        var _this = this;
        my.notice.clear();

        _this.chkIE6(function () {
            _this.chkUpdate(function (date) {
            });
        });

    },
    chkIE6: function (cb) {
        if (isIE6) {
            my.notice.add('您当前使用的浏览器版本过低，为获取更好的使用体验，请升级至高版本IE、chrome、firefox，点击获取最新IE版本。', function () {
                window.location.href = "http://windows.microsoft.com/zh-cn/internet-explorer/download-ie";
            });
        } else {
            if (cb && typeof cb == 'function') cb();//没有该任务则回调
        }
    },
    //有无最新报表需要生成
    chkUpdate: function (cb) {
        var _this = this;
        if (!my.user.checkPower('系统配置')) return;
        my.util.send('getLastUpdate', {}, function (data) {
            if (data.newday != data.reportday) {
                var d = new Date(data.reportday.replace('-', '/'));
                d.setDate(d.getDate() + 1);
                var es = d.format('yyyy-MM-dd');
                my.notice.add(es + '至' + data.newday + '的报表尚未生成，点击开始生成报表。', function () {
                    my.view.load('on');
                    my.util.send('updateReport', {}, function () {
                        my.view.message('生成报表成功！', 1, function () {
                            my.user.chkTask();
                        });
                    });
                });
            } else {
                if (cb && typeof cb == 'function') cb();//没有该任务则回调
            }
        });
    },
    //有无门店信息需要完善
    chkEditStore: function (cb) {

    }
};