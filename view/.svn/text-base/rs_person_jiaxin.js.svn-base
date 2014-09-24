
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/rs_person_jiaxin.html',
        title: '人员管理-加薪',
        output: 0,
        method: 'personnel->getAll',
        init: function () {
            this.arges = {
                job_nature:[1]//0离职１合同工２实习３小时工
            };
            this.data = {
                levels: my.user.info.config.levels,
                stores: my.stores,
                bags: my.bags,
                chejians:my.chejians
            };
        },
        initData: function (data) {
            var _this = this;
            this.data = data;
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
                    $("input[name='true_name']").val(_this.data.list[id].true_name);
                    $("input[name='id']").val(id);
                });
            });
            $("#person_add .input-submit").bind('click', function () {
                arr = _this.getFormValue();
                arr.dynamic = 5;//加薪
                my.view.load(1);
                my.util.send('personnel->edit_dynamic', arr, function (data) {
                    if (data.status != 0) {
                        my.view.message('操作失败，请输入完整内容！');
                        return;
                    }
                    my.view.message('操作成功！', 1, function () {
                        my.view.showTable('rs_person_jiaxin');
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
    my.moudle.rs_person_jiaxin = a;
})();