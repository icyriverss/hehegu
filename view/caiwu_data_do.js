my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/caiwu_data_do.html',
        title: '预算执行情况',
        perpage: 10,
        page:1,
        output: 0,
        method: 'yusuan->getPlanDo',
        init: function () {
            this.department = this.department ? this.department : '';
            if (!this.month) this.month = new Date().getMonth() + 1;;
            this.arges = {
                department: this.department,
                month:this.month
            };
        },
        bindEvent: function () {
            var _this = this;
            my.node_do.loadSource(this.data.list, $("#itemslist"));
            $("select[name='department']").bind('change', function () {
                _this.department = $(this).val();
                my.view.showTable('caiwu_data_do');
            });
        },
        initData: function (data) {
            this.data = data;
            var arr_code = {};
            var arr_data = {};
            $.each(this.data.data, function () {
                arr_data[this.AccountCode] = this;
            });
            $.each(this.data.list, function () {
                this.parentcode = this.parentcode ? this.parentcode : null;
                arr_code[this.code] = this;
                if (arr_data[this.kemu]) {
                    my.extend(arr_code[this.code],arr_data[this.kemu]);
                }
            });
            this.data.list = arr_code;
            this.department = this.data.department;
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_data_do = a;
})();
