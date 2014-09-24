
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'user->getList',
        template_url: 'view/set_base_user.html',
        title: '用户管理',
        current_quick: '添加新用户',
        quick: { '添加新用户': 'set_base_addnew' },
        perpage:10,
        page: 1,
        userid: '',
        output: 0,
        department_id: '',
        storeid: '',
        chejianid: '',
        bagid: '',
        init: function () {
            this.arges = {
                page: this.page,
                perpage: this.perpage,
                department_id: this.department_id,
                store_id: this.storeid,
                chejian_id: this.chejianid,
                bag_id: this.bagid
            };
        },
        initData: function (data) {
            this.data = data;
            this.data.departments = ['运营部','人事部','开发部','工程部','加工中心','门店','仓库','财务部'];
            this.data.stores = my.stores;
            this.data.chejians = my.chejians;
            this.data.bags = my.bags;
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('set_base_user');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('set_base_user');
                }
            );
            $("select[name='department']").bind('change', function () {
                $("#store_id").hide();
                $("#chejian_id").hide();
                $("#bag_id").hide();
                var department = $(this).val();
                if (department == '门店') $("#store_id").show();
                if (department == '加工中心') $("#chejian_id").show();
                if (department == '仓库') $("#bag_id").show();
            });
            $("#search_job").click(function () {
                _this.department_id = $("select[name='department']").val();
                _this.storeid = $("select[name='store_id']").val();
                _this.chejianid = $("select[name='chejian_id']").val();
                _this.bagid = $("select[name='bag_id']").val();
                my.view.showTable('set_base_user');
            });
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var user_id = $(this).data('value');
                var loginid = $(this).data('loginid');
                if (type == 'edit') {
                    _this.user_id = user_id;
                    my.view.showTable('set_base_edituser');
                } else {
                    if (confirm("确定要删除该用户吗？一旦删除将不能恢复！")){
                        my.view.load(1);
                        my.user.delUser(loginid, function () {
                            my.view.message('删除用户成功！', 1, function () {
                                my.view.showTable('set_base_user');
                            });
                        });
                    }
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_user = a;
})();