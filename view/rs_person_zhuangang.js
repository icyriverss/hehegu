
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/rs_person_zhuangang.html',
        title: '人员管理-转岗',
        output: 0,
        method: 'personnel->getAll',
        init: function () {
            this.arges = {
                job_nature:[1]//0离职１合同工２实习３小时工
            };
            this.data = {
                levels: my.user.info.config.levels
            };
        },
        initData: function (data) {
            var _this = this;
            this.data = data;
            this.data.departments = my.departments;
            this.data.stores = my.stores;
            this.data.bags = my.bags;
            this.data.chejians = my.chejians;
            var arr = {};
            $.each(this.data.list, function () {
                this.py = makePy(this.true_name);//获取拼音
                arr[this.id] = this;
            });
            this.data.list = arr;
        },
        bindEvent: function () {
            var _this = this;
            $(".sel_person").bind('click', function () {
                my.persons.getOne(_this.data.list, function (id) {
                    list = _this.data.list[id];
                    _this.data.position = list.position;
                    $("input[name='true_name']").val(list.true_name);
                    $("input[name='id']").val(id);
                    $("input[name='loginid']").val(list.loginid);
                    $('#department').val(list.department_id);

                    $('#old_department').html(list.department + '  ');
                    $('#old_job').html(list.job);

                    $("#sel_store").hide();
                    $("#sel_bag").hide();
                    $("#sel_chejian").hide();

                    if (!list.department) return;
                    if (list.department == '门店') {
                        $("#sel_store").show();
                        $("select[name='store_id']").val(list.store_id);
                        $('#old_department').append(getStoreName(list.store_id));
                        
                    }
                    if (list.department == '仓库') {
                        $("#sel_bag").show();
                        $("select[name='bag_id']").val(list.bag_id);
                        $('#old_department').append(getBagName(list.bag_id));
                        
                    } 
                    if (list.department == '加工中心'){
                        $("#sel_chejian").show();
                        $("select[name='chejian_id']").val(list.chejian_id);
                        $('#old_department').append(getChejianName(list.chejian_id));
                        
                    } 
                    _this.getJob();
                });
            });
            $("#person_add .input-submit").bind('click', function () {
                arr = _this.getFormValue();
                arr.dynamic = 10;//转岗
                my.view.load(1);
                my.util.send('personnel->edit_dynamic', arr, function (data) {
                    if (data.status != 0) {
                        my.view.message('操作失败，请输入完整内容！');
                        return;
                    }
                    my.view.message('操作成功！', 1, function () {
                        my.view.showTable('rs_person_zhuangang');
                    });
                });
            });

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
                    var str = '<select name="new_job_id"><option value="">请选择职位</option>';
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
    my.moudle.rs_person_zhuangang = a;
})();