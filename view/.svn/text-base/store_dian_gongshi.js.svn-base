
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/store_dian_gongshi.html',
        title: '工时管理',
        output: 0,
        data: {},
        selection: 'td',//td选择高亮
        hasDataColor: '#D3F0F1',
        method: 'shuidian->getWorkTimes',
        arges:{},
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.day) this.day = date.getDate();
            if (!this.startdate) this.startdate = date.format('yyyy-MM-dd');
            this.days = my.util.getDaysByMonth(this.month, this.year);//当月天数
            this.arr_days = my.util.getDays(this.month, this.year);//获取日历对象
            if (my.user.info.bumen != '门店' && !this.store_id) this.store_id = getOneStore_ID();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                store_id: this.store_id || my.user.info.store_id,
                type: 'huizhan'
            };
            //初始化模版数据
            this.data.arr_days = this.arr_days;//该月每天的数组
            this.data.year = this.year;
            this.data.month = my.util.getMonthTxt(this.month);
            this.data.day = this.day;
            this.data.color = this.hasDataColor;
            this.data.startdate = this.startdate;
        },
        initData: function (data) {
            var _this = this;
            var list = {};
            var current = {};
            this.data.personnel = data.personnel;
            $.each(data.list, function () {
                this.dayss = parseInt(this.dayss);
                if (!list[this.dayss]) list[this.dayss] = {};
                list[this.dayss][this.personnel_id] = this;
                if (_this.day == this.dayss) current[this.personnel_id] = this;
            });
            this.data.list = list;
            this.data.current = current;
        },
        bindEvent: function () {
            var _this = this;
            $(".selection_day").click(function () {
                var day = $(this).data('value');
                $("input[name='date']").val(new Date(_this.year, _this.month - 1, day).format('yyyy-MM-dd'));
                if (_this.data.list[day]) {//选择已有数据的日期，则显示该日期的预存、期初、指数、用量、倍率、价格
                    var tmp = _this.data.list[day];
                    _this.setGongshiList(tmp);
                } else {//选择没有数据的日期，录入新数据
                    _this.setGongshiList();
                }
            });
            $("#data .input-submit").bind('click', function () {
                var usedate = $("input[name='date']").val();
                if (!usedate) return my.view.message('请选择日期!');
                var gongshi = _this.getGongshiList();
                my.view.load(1);
                my.util.send('shuidian->setGongshi', {
                    gongshi: gongshi,
                    adddate: usedate,
                    store_id: _this.store_id || my.user.info.store_id
                }, function (data) {
                    if (data.status != 0) return my.view.message('录入数据失败！请联系管理员。');
                    my.view.message('录入成功！', 1, function () {
                        my.view.showTable('store_dian_gongshi');
                    });
                });
            });
        },
        setGongshiList: function (arr) {
            if (!arr) arr = {};
            $("#personnel_list input").each(function () {
                var id = $(this).data('id');
                var type = $(this).data('type');
                var value = $(this).val();
                if (!id || !type) return true;
                if (type == 'zhiye') {
                    if (arr[id] && arr[id]['zhiye']) {
                        $(this).attr('checked', true);
                    } else {
                        $(this).attr('checked', false)
                    }
                } else {
                    if (arr[id] && arr[id][type]) {
                        $(this).val(arr[id][type]);
                    } else {
                        $(this).val('');
                    }
                }
            });
        },
        getGongshiList: function () {
            var arr = {};
            $("#personnel_list input").each(function () {
                var id = $(this).data('id');
                var type = $(this).data('type');
                var value = $(this).val();
                var checked = $(this).attr('checked');
                if (!id || !type) return true;
                if (!arr[id]) arr[id] = {};
                arr[id][type] = type == 'zhiye' ? (checked ? 1 : 0) : value;
            });
            return arr;
        }
    };
    my.extend(a, prop);
    my.moudle.store_dian_gongshi = a;
})();