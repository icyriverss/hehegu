
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'chejian->getList',
        template_url: 'view/set_chejian_manage.html',
        title: '车间管理',
        current_quick: '添加车间',
        quick: { '添加车间': 'set_chejian_add' },
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
                    my.view.showTable('set_chejian_manage');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('set_chejian_manage');
                }
            );
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var id = $(this).data('value');
                if (type == 'edit') {
                    _this.id = id;
                    my.view.showTable('set_chejian_edit');
                } else {
                    if (confirm("确定要删除该车间吗？一旦删除将不能恢复！")){
                        my.view.load(1);
                        my.chejian.del(id, function () {
                            my.view.message('删除车间成功！', 1, function () {
                                my.view.showTable('set_chejian_manage');
                            });
                        });
                    }
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_chejian_manage = a;
})();