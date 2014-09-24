
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->getInfo',
        template_url: 'view/rs_person_add.html',
        title: '人员管理-修改',
        current_quick: '人员列表',
        quick: { '人员列表': 'rs_person_list' },
        output: 0,
        init: function () {
            this.id = my.moudle['rs_person_list'].id;//获取要修改的用户ID
            this.arges = { id: this.id };
        },
        initData:function(data){
            this.data = data;
            this.data.stores = my.stores;
            this.data.bags = my.bags;
            this.data.chejians = my.chejians;
            this.data.departments = my.departments;
        },
        bindEvent: function () {
            var _this = this;
            $("#department").bind('change', function () {
                $("#position").html('等待获取职位信息');
                var department_id = $(this).val();
                var department = getDepartmentName(department_id);
                $("#sel_store").hide();
                $("#sel_bag").hide();
                $("#sel_chejian").hide();
                if (!department) return;
                if (department == '门店') return $("#sel_store").show();
                if (department == '仓库') return $("#sel_bag").show();
                if (department == '加工中心') return $("#sel_chejian").show();
                _this.getJob();
            });
            $("#store_id,#chejian_id,#bag_id").bind('change', function () {
                _this.getJob();
            });
            $("#data .input-submit").bind('click', function () {
                arr = _this.getFormValue();
                arr.id = _this.id;
                my.view.load(1);
                my.util.send('personnel->edit', arr, function (data) {
                    if(data.status == 4){
                        return my.view.message('用户名不存在，请重试！');
                    }
                    if (data.status != 0) {
                        my.view.message('修改失败，请输入完整内容！');
                        return;
                    }
                    my.view.message('修改成功！', 1, function () {
                        my.view.showTable('rs_person_edit');
                    });
                });
            });
            _this.getJob();
        },
        getJob: function () {
            var _this = this;
            $("#position").html('正在获取职位信息，请稍候');
            my.view.load(1);
            var department_id = $("select[name='department']").val();
            var store_id = $("select[name='store_id']").val();
            var chejian_id = $("select[name='chejian_id']").val();
            var bag_id = $("select[name='bag_id']").val();
            var department = getDepartmentName(department_id);
            if (department == '门店' || department == '仓库' || department == '加工中心') {
                var arges = {
                    store_id: store_id,
                    chejian_id: chejian_id,
                    bag_id: bag_id
                };
            } else {
                var arges = {
                    department_id: department_id
                };
            }
            my.util.send('personnel->job_list', arges, function (data) {
                my.view.load(0);
                var list = data.list;
                if ($.isEmptyObject(list)) {
                    $("#position").html('没有当前部门的职位信息。');
                } else {
                    var str = '<select name="position"><option value="">请选择职位</option>';
                    $.each(list, function () {
                        if (_this.data.position == this.id) {
                            str += '<option value="' + this.id + '" selected>' + this.job + '</option>';
                        } else {
                            str += '<option value="' + this.id + '">' + this.job + '</option>';
                        }
                    });
                    str += '</select>';
                    $("#position").html(str);
                }
            });
        },
        getFormValue: function () {
            var arr = {};
            $("#person_add input").each(function () {
                var type = $(this).attr('type');
                var name = $(this).attr('name');
                switch (type) {
                    case 'text':
                        arr[name] = $(this).val(); break;
                    case 'radio':
                        if ($(this).attr('checked')) arr[name] = $(this).val(); break;
                }
            });
            $("#person_add select").each(function () {
                var name = $(this).attr('name');
                arr[name] = $(this).val();
            });
            return arr;
        }
    };
    my.extend(a, prop);
    my.moudle.rs_person_edit = a;
})();