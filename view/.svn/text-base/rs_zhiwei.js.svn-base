
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->job_list',
        template_url: 'view/rs_zhiwei.html',
        title: '职位管理-职位列表',
        current_quick: '录入职位',
        quick: { '录入职位': 'rs_zhiwei_add' },
        perpage:10,
        page: 1,
        userid: '',
        output: 0,
        department_id: 0,
        storeid: '',
        chejianid: '',
        bagid:'',
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
                my.view.showTable('rs_zhiwei');
            });
            $("#data .user_list a").unbind().bind('click', function () {//修改、删除
                var type = $(this).data('type');
                var id = $(this).data('value');
                if (type == 'edit') {
                    _this.id = id;
                    my.view.showTable('rs_zhiwei_edit');
                } else {
                    if (confirm("确定要删除？一旦删除将不能恢复！")){
                        my.view.load(1);
                        my.util.send('personnel->del_job_info', {
                            id: id
                        }, function (data) {
                            if (data.status != 0) return my.view.message('删除职位失败！');
                            my.view.message('删除职位成功！', 1, function () {
                                my.view.showTable('rs_zhiwei');
                            });
                        });
                    }
                }
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_zhiwei = a;
})();