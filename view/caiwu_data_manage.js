my.moudle = my.moudle || {};
(function() {
    var a = new my.table();
    var prop = {
        template_url: 'view/caiwu_data_manage.html',
        title: '预算数据管理',
        perpage: 10,
        page: 1,
        output: 0,
        method: 'yusuan->getPlanList',
        init: function() {
            this.department = this.department ? this.department : '';
            this.arges = {
                department: this.department
            };
        },
        bindEvent: function() {
            var _this = this;
            my.node_data.loadSource(this.data.list, $("#itemslist"));
            $("select[name='department']").bind('change', function() {
                _this.department = $(this).val();
                my.view.showTable('caiwu_data_manage');
            });
            $(".node_month").bind("selectstart", function(e) {
                e.preventDefault();
            });
            $(".node_month").bind('dblclick', function(e) {
                e.stopPropagation();
                e.preventDefault();
                var code = $(this).parent().data('code');
                var field = $(this).data('field');
                var node = _this.data.list[code];
                if (!node || !node.kemu) return;
                if (field == 'YearAlarm') return; //不可直接修改全年预算
                $(this).html('<input type="text" name="' + field + '" value="' + (node[field] ? node[field] : '') + '" style="width:75px;">');
                var tmpthis = this;
                $('input', this).click(function(e) { //阻止input中的事件冒泡，否则导致触发document.body的事件
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document.body).bind('click', function() { //修改后任意点击完成修改
                    var list = {};
                    list[field] = $('input', tmpthis).val();
                    $(document.body).unbind();
                    $(tmpthis).html(_this.data.list[code][field] || '');
                    if (list[field] == node[field] || (!node[field] && !list[field])) return; // 没有改动 或 两者都为空 则直接返回
                    my.view.load(1);
                    my.util.send('yusuan->editPlan', {
                        department: _this.department,
                        accountname: node.name,
                        list: list
                    }, function(data) {
                        if (data.status != 0) return my.view.message('修改失败！');
                        my.view.message('修改成功！', 1, function() {
                            _this.data.list[code][field] = list[field];
                            _this.data.list[code]['YearAlarm'] = parseFloat(_this.data.list[code]['M1']) + parseFloat(_this.data.list[code]['M2']) + parseFloat(_this.data.list[code]['M3']) + parseFloat(_this.data.list[code]['M4']) + parseFloat(_this.data.list[code]['M5']) + parseFloat(_this.data.list[code]['M6']) + parseFloat(_this.data.list[code]['M7']) + parseFloat(_this.data.list[code]['M8']) + parseFloat(_this.data.list[code]['M9']) + parseFloat(_this.data.list[code]['M10']) + parseFloat(_this.data.list[code]['M11']) + parseFloat(_this.data.list[code]['M12']);
                            $(tmpthis).html(_this.data.list[code][field]);
                            $(tmpthis).parent().find('div').each(function() {
                                console.log($(this).data('field'));
                                if ($(this).data('field') == 'YearAlarm') {
                                    $(this).html(_this.data.list[code]['YearAlarm']);
                                    return false;
                                }
                            });
                        });
                    });
                });
            });
        },
        initData: function(data) {
            this.data = data;
            var arr_code = {};
            var arr_data = {};
            $.each(this.data.data, function() {
                arr_data[this.AccountCode] = this;
            });
            $.each(this.data.list, function() {
                this.parentcode = this.parentcode ? this.parentcode : null;
                arr_code[this.code] = this;
                if (arr_data[this.kemu]) {
                    my.extend(arr_code[this.code], arr_data[this.kemu]);
                }
            });
            this.data.list = arr_code;
            this.department = this.data.department;
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_data_manage = a;
})();