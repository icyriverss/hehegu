my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/caiwu_yusuan_type.html',
        title: '预算项目分类管理',
        perpage: 10,
        page:1,
        output: 0,
        method: 'yusuan->getItemList',
        init: function () {
            this.arges = {
                perpage: this.perpage,
                page: this.page,
                gettype: 'fahuo'//获取类型为出库单，
            };
        },
        getTableHtml: function () {
            return '<table class="data-load"  border="0" cellspacing="0" cellpadding="0" ><tr><th><div id="itemslist"></div></td></tr></table>';
        },
        bindEvent: function () {
            var _this = this;
            my.node.loadSource(this.data.list, $("#itemslist"));
        },
        initData: function (data) {
            this.data = data;
            var arr_code = {};
            $.each(this.data.list, function () {
                if (this.isitem == 1) return true;
                this.parentcode = this.parentcode ? this.parentcode : null;
                arr_code[this.code] = this;
            });
            this.data.list = arr_code;
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_yusuan_type = a;
})();
