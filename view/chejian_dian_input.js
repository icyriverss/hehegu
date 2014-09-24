
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/chejian_dian_input.html',
        title: '水电指数录入',
        output: 0,
        data: {},
        selection: 'td',//td选择高亮
        hasDataColor: '#D3F0F1',
        method: 'shuidian->getUseList',
        tips:'录入之前请先设置单价和倍率；<br>修改之前的记录会导致后一天的用量重计；<br>表的指数清空时，请录入期初数据，否则请留空。',
        arges:{},
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.day) this.day = date.getDate();
            if (!this.startdate) this.startdate = date.format('yyyy-MM-dd');
            this.days = my.util.getDaysByMonth(this.month, this.year);//当月天数
            this.arr_days = my.util.getDays(this.month, this.year);//获取日历对象
            if (my.user.info.bumen != '加工中心' && !this.chejian_id) this.chejian_id = getOneChejian_ID();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                chejian_id: this.chejian_id || my.user.info.chejian_id
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
            var list = {};
            if ($.isEmptyObject(data.biao_list)) return;
            if (!$.isEmptyObject(data.use_list)) {
                $.each(data.use_list, function () {
                    var day = new Date(this.usedate).getDate();
                    if (!list[day]) list[day] = {};
                    list[day][this.biao_id] = this;
                });
            }
            var biao_list = {};
            $.each(data.biao_list, function () {
                biao_list[this.biao_id] = this;
            });
            this.data.biao_list = biao_list;
            this.data.use_list = list;
        },
        bindEvent: function () {
            var _this = this;
            $(".selection_day").click(function () {
                var day = $(this).data('value');
                $("input[name='date']").val(new Date(_this.year, _this.month - 1, day).format('yyyy-MM-dd'));
                if (_this.data.use_list[day]) {//选择已有数据的日期，则显示该日期的预存、期初、指数、用量、倍率、价格
                    var tmp = _this.data.use_list[day];
                    $(".use_list").each(function () {
                        var biao_id = $(this).data('id');
                        var t = tmp[biao_id];
                        $('input[name="yucun"]', this).val(t.yucun);
                        $('input[name="qichu"]', this).val(t.qichu);
                        $('input[name="zhishu"]', this).val(t.zhishu);
                        $(".yongliang", this).html(t.yongliang);
                        $(".beilv", this).html(t.beilv);
                        $(".price", this).html(t.price);
                        $(".cost", this).html(t.cost);
                    });
                } else {//选择没有数据的日期，录入新数据
                    $(".use_list").each(function () {
                        var biao_id = $(this).data('id');
                        $('input',this).val('');
                        $(".yongliang", this).html('');
                        $(".cost", this).html('');
                        if (new Date(_this.year, _this.month - 1, day).format('yyyy-MM-dd') == new Date().format('yyyy-MM-dd')) {//选择今日的话显示当前的倍率和单价
                            $(".beilv", this).html(_this.data.biao_list[biao_id].beilv);
                            $(".price", this).html(_this.data.biao_list[biao_id].price);
                        } else {
                            $(".beilv", this).html('');
                            $(".price", this).html('');
                        }
                    });
                }
            });
            $("#data .input-submit").bind('click', function () {
                
                var usedate = $("input[name='date']").val();
                if (!usedate) return my.view.message('请选择日期!');
                var arr = [];
                $(".use_list").each(function () {
                    var biao_id = $(this).data('id');
                    var yucun = $('input[name="yucun"]', this).val();
                    var qichu = $('input[name="qichu"]', this).val();
                    var zhishu = $('input[name="zhishu"]', this).val();
                    arr.push({
                        biao_id: biao_id,
                        yucun: yucun,
                        qichu: qichu,
                        zhishu: zhishu
                    });
                });
                my.view.load(1);
                my.shuidian.editZhishu({ list: arr, usedate: usedate, chejian_id: _this.chejian_id || my.user.info.chejian_id }, function () {
                    my.view.message('录入成功！', 1, function () {
                        my.view.showTable('chejian_dian_input');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.chejian_dian_input = a;
})();