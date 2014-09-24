my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->getList',
        template_url: 'view/store_renshi_list.html',
        title: '人员管理-人员列表',
        current_quick: '录入人员',
        quick: { '录入人员': 'store_renshi_add' },
        perpage:10,
        page: 1,
        userid: '',
        output: 0,
        department_id: 0,
        storeid: '',
        chejianid: '',
        bagid: '',
        init: function () {
            if (my.user.info.bumen !== '门店' && !this.store_id) this.store_id = getOneStore_ID();
            var department = '';
            $.each(my.departments,function(){
                if(this.department==='门店') department = this.id;
            });
            this.arges = {
                page: this.page,
                perpage: this.perpage,
                department_id: department,
                store_id: this.store_id || my.user.info.store_id
            };
        },
        initData:function(data){
            this.data = data;
            this.data.departments = my.departments;
            this.data.department = getDepartmentName(this.data.department_id);
            this.data.stores = my.stores;
            this.data.chejians = my.chejians;
            this.data.bags = my.bags;
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('store_renshi_list');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('store_renshi_list');
                }
            );
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var id = $(this).data('value');
                if (type == 'edit') {
                    _this.id = id;
                    my.view.showTable('store_renshi_edit');
                } else {
                    if (confirm("确定要删除？一旦删除将不能恢复！")){
                        my.view.load(1);
                        my.util.send('personnel->del',{id:id}, function () {
                            my.view.message('删除成功！', 1, function () {
                                my.view.showTable('store_renshi_list');
                            });
                        });
                    }
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.store_renshi_list = a;
})();