
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->department_list',
        template_url: 'view/rs_bumen_list.html',
        title: '部门管理',
        current_quick: '添加部门',
        quick: { '添加部门': 'rs_bumen_add' },
        page: 1,
        userid: '',
        output: 0,
        perpage: 10,
        getTableHtml: function () {
            return '<table class="data-load"  border="0" cellspacing="0" cellpadding="0" ><tr><th><div id="itemslist"></div></td></tr></table>';
        },
        bindEvent: function () {
            var _this = this;
            my.node_rs.loadSource(this.data.list, $("#itemslist"));
        },
        initData: function (data) {
            this.data = data;
            var arr_code = {};
            var store_parent = '',bag_parent='',chejian_parent='';
            $.each(this.data.list, function () {
                this.parent_id = this.parent_id ? this.parent_id : null;
                if (this.department == '门店') store_parent = this.id;
                if (this.department == '仓库') bag_parent = this.id;
                if (this.department == '加工中心') chejian_parent = this.id;
                arr_code[this.id] = this;
            });
            if (store_parent) {
                $.each(my.stores, function () {
                    arr_code[this.store_id] = {
                        id: this.store_id,
                        type:'store',
                        parent_id: store_parent,
                        department: this.store_name,
                        disedit:true
                    }
                })
            }
            if (bag_parent) {
                $.each(my.bags, function () {
                    arr_code[this.bag_id] = {
                        id: this.bag_id,
                        type: 'bag',
                        parent_id: bag_parent,
                        department: this.bag_name,
                        disedit: true
                    }
                })
            }
            if (chejian_parent) {
                $.each(my.chejians, function () {
                    arr_code[this.chejian_id] = {
                        id: this.chejian_id,
                        type: 'chejian',
                        parent_id: chejian_parent,
                        department: this.chejian_name,
                        disedit: true
                    }
                })
            }
            this.data.list = arr_code;
        },
        //bindEvent: function () {
        //    var _this = this;
        //    $("#data .user_list a").unbind().bind('click', function () {//修改、删除
        //        var type = $(this).data('type');
        //        var id = $(this).data('value');
        //        if (type == 'edit') {
        //            _this.id = id;
        //            my.view.showTable('rs_bumen_edit');
        //        } else {
        //            if (confirm("确定要删除该部门吗？一旦删除将不能恢复，同时该部门所有职位将一并删除！")){
        //                my.view.load(1);
        //                my.util.send('personnel->delDepartmentInfo', {
        //                    id:id
        //                }, function (data) {
        //                    if (data.status != 0) return my.view.message('删除部门失败！');
        //                    my.view.message('删除部门成功！', 1, function () {
        //                        my.view.showTable('rs_bumen_list');
        //                    });
        //                });
        //            }
        //        }
        //    });
        //}
    };
    my.extend(a, prop);
    my.moudle.rs_bumen_list = a;
})();