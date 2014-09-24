my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/caiwu_yusuan_type.html',
        title: '预算项目明细管理',
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
            return '<table class="data-load"  border="0" cellspacing="0" cellpadding="0" ><tr><th valign="top" width=404><div id="itemslist_menu"></div></th><th valign="top"><div id="itemslist"></div></th></tr></table>';
        },
        bindEvent: function () {
            var _this = this;
            my.node_menu.loadSource(this.data.list, $("#itemslist_menu"));
            $("#itemslist_menu .node_ul").die().live('click',function () {
                var arr = {};
                var code = $(this).data('code');
                $("#itemslist_menu .node_ul").data('isclick', 0).css('background-color', '#e5e5e5');
                $(this).css('background-color', '#78E8EB').data('isclick', 1);
                $.each(_this.data.child, function () {
                    this.parentcode = this.parentcode_ext?this.parentcode_ext:this.parentcode;
                    if (this.parentcode == code) {
                        this.parentcode_ext = this.parentcode;
                        this.parentcode = '';
                    }
                });
                $("#itemslist").html('');
                my.node_child.loadSource(_this.data.child, $("#itemslist"));
            });
           
        },
        insertChilds:function(childs,code){
            var child = $("#child_" + code);
            if (child.length > 0) return;
        },
        getChilds:function(code){
            var arr = [];
            $.each(this.data.list, function () {
                if (this.parentcode == code) arr.push(this);
            });
            return arr;
        },
        initData: function (data) {
            this.data = data;
            var arr_code = {};
            var arr_child = {};
            $.each(this.data.list, function () {
                if (this.isitem == 1) {
                    this.parentcode = this.parentcode ? this.parentcode : null;
                    arr_child[this.code] = this;
                } else {
                    this.parentcode = this.parentcode ? this.parentcode : null;
                    arr_code[this.code] = this;
                }
            });
            this.data.list = arr_code;
            this.data.child = arr_child;
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_yusuan_type_more = a;
})();
