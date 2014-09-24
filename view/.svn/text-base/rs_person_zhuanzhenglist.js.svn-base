
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->getList',
        template_url: 'view/rs_person_zhuanzhenglist.html',
        title: '人员管理-转正记录',
        current_quick: '转正',
        quick: { '转正': 'rs_person_zhuanzheng' },
        perpage:10,
        page: 1,
        userid: '',
        output: 0,
        init: function () {
            this.arges = {
                page: this.page,
                perpage: this.perpage
            };
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('rs_person_zhuanzhenglist');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('rs_person_zhuanzhenglist');
                }
            );
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var id = $(this).data('value');
                if (type == 'edit') {
                    _this.id = id;
                    my.view.showTable('rs_person_edit');
                } else {
                    if (confirm("确定要删除？一旦删除将不能恢复！")){
                        my.view.load(1);
                        my.user.delUser(loginid, function () {
                            my.view.message('删除成功！', 1, function () {
                                my.view.showTable('rs_person_zhuanzhenglist');
                            });
                        });
                    }
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_person_zhuanzhenglist = a;
})();