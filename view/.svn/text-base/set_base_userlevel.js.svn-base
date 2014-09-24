
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'userlevel->getLevelList',
        template_url: 'view/set_base_userlevel.html',
        title: '用户组管理',
        current_quick: '添加新用户组',
        quick: { '添加新用户组': 'set_base_addnewuserlevel' },
        page: 1,
        perpage:10,
        output: 0,
        init: function () {
            this.arges = {
                page: this.page,
                perpage:this.perpage
            };
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('set_base_userlevel');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('set_base_userlevel');
                }
            );
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var level_name = $(this).data('value');
                if (type == 'edit') {
                    _this.level_name = level_name;
                    my.view.showTable('set_base_edituserlevel');
                } else {
                    if (confirm("确定要删除该用户组吗？一旦删除将不能恢复，同时该用户组下所有用户将无法登陆！")){
                        my.view.load(1);
                        my.userlevel.delLevel(level_name, function () {
                            my.view.message('删除用户组成功！', 1, function () {
                                my.view.showTable('set_base_userlevel');
                            });
                        });
                    }
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_userlevel = a;
})();