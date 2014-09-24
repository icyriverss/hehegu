

my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'shuidian->getTypeList',
        template_url: 'view/set_base_dian.html',
        title: '水电气表类别管理',
        current_quick: '添加表类别',
        quick: { '添加表类别': 'set_base_addbiao' },
        page: 1,
        output: 0,
        init: function () {
        },
        bindEvent: function () {
            var _this = this;
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var biao_type_id = $(this).data('value');
                if (type == 'edit') {
                    $.each(_this.data.list, function () {
                        if (this.biao_type_id == biao_type_id) return _this.biao_type_info = this;
                    });
                    my.view.showTable('set_base_editbiao');
                } else {
                    if (confirm("确定要删除该表类别吗？如果系统已经使用此表，则会导致数据错乱，请谨慎操作！")){
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
    my.moudle.set_base_dian = a;
})();