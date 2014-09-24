
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/rs_zhiwei_add.html',
        title: '职位管理-录入',
        output: 0,
        current_quick: '职位列表',
        quick: { '职位列表': 'rs_zhiwei' },
        init: function () {
            this.arges.page = this.page;
            this.data = {
                levels: my.user.info.config.levels,
                departments:my.departments,
                stores: my.stores,
                bags: my.bags,
                chejians:my.chejians
            };
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
                my.view.load(1);
                my.util.send('personnel->add_job', arr, function (data) {
                    if (data.status != 0) {
                        my.view.message('录入失败，请输入完整内容！');
                        return;
                    }
                    my.view.message('录入成功！', 1, function () {
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
    my.moudle.rs_zhiwei_add = a;
})();