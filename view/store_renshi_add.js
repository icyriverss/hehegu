my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_renshi_add.html',
        title: '人员管理-录入',
        output: 0,
        current_quick: '人员列表',
        method:'personnel->job_list',
        quick: { '人员列表': 'store_renshi_list' },
        init: function () {
            if (my.user.info.bumen !== '门店' && !this.store_id) this.store_id = getOneStore_ID();
            this.arges = {
                store_id: this.store_id || my.user.info.store_id
            };
        },
        initData:function(data){
            this.data = {
                stores: my.stores,
                bags: my.bags,
                chejians: my.chejians,
                departments:my.departments,
                jobs:data.list,
                store_id:this.store_id || my.user.info.store_id
            };
        },
        bindEvent: function () {
            var _this = this;
            $("#person_add .input-submit").bind('click', function () {
                arr = _this.getFormValue();
                arr['store_id'] = _this.store_id || my.user.info.store_id;
                my.view.load(1);
                my.util.send('personnel->add', arr, function (data) {
                    if (data.status != 0) {
                        my.view.message('录入失败，请输入完整内容！');
                        return;
                    }
                    my.view.message('录入成功！', 1, function () {
                        my.view.showTable('store_renshi_list');
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
    my.moudle.store_renshi_add = a;
})();