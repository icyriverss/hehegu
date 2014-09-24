
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->getList',
        template_url: 'view/rs_person_list.html',
        title: '人员管理-人员列表',
        current_quick: '录入人员',
        quick: { '录入人员': 'rs_person_add' },
        perpage:10,
        page: 1,
        userid: '',
        output: 0,
        department_id: 0,
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
                    my.view.showTable('rs_person_list');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('rs_person_list');
                }
            );
            $("#data select[name='department']").bind('change', function () {
                $("#store_id").hide();
                $("#chejian_id").hide();
                $("#bag_id").hide();
                var department = getDepartmentName($(this).val());
                if (department == '门店') $("#store_id").show();
                if (department == '加工中心') $("#chejian_id").show();
                if (department == '仓库') $("#bag_id").show();
            });
            $("#search_job").click(function () {
                _this.department_id = $("select[name='department']").val();
                _this.storeid = $("select[name='store_id']").val();
                _this.chejianid = $("select[name='chejian_id']").val();
                _this.bagid = $("select[name='bag_id']").val();
                my.view.showTable('rs_person_list');
            });
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var id = $(this).data('value');
                if (type == 'edit') {
                    _this.id = id;
                    my.view.showTable('rs_person_edit');
                } else {
                    if (confirm("确定要删除？一旦删除将不能恢复！")){
                        my.view.load(1);
                        my.util.send('personnel->del',{id:id}, function () {
                            my.view.message('删除成功！', 1, function () {
                                my.view.showTable('rs_person_list');
                            });
                        });
                    }
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_person_list = a;
})();