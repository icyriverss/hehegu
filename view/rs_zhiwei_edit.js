
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->get_job_info',
        template_url: 'view/rs_zhiwei_add.html',
        title: '职位管理-修改',
        current_quick: '职位列表',
        quick: { '职位列表': 'rs_zhiwei' },
        output: 0,
        init: function () {
            this.id = my.moudle['rs_zhiwei'].id;//获取要修改的用户ID
            this.arges = { id: this.id };
        },
        initData:function(data){
            this.data = data;
            this.data.levels = my.user.info.config.levels;
            this.data.stores = my.stores;
            this.data.bags = my.bags;
            this.data.chejians = my.chejians;
            this.data.departments = my.departments;
        },
        bindEvent: function () {
            var _this = this;
            $("#department").bind('change', function () {
                var bumen = getDepartmentName($(this).val());
                $("#sel_store").hide();
                $("#sel_bag").hide();
                $("#sel_chejian").hide();
                if (!bumen) return;
                if (bumen == '门店') $("#sel_store").show();
                if (bumen == '仓库') $("#sel_bag").show();
                if (bumen == '加工中心') $("#sel_chejian").show();
            });
            $("#person_add .input-submit").bind('click', function () {
                arr = _this.getFormValue();
                arr.id = _this.id;
                my.view.load(1);
                my.util.send('personnel->edit_job', arr, function (data) {
                    if (data.status != 0) {
                        my.view.message('修改失败，请输入完整内容！');
                        return;
                    }
                    my.view.message('修改成功！', 1, function () {
                        my.view.showTable('rs_zhiwei');
                    });
                });
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
    my.moudle.rs_zhiwei_edit = a;
})();