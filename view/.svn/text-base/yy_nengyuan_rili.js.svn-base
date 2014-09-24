
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'shuidian->getUseDays',
        store: '',
        store_id: '',
        template_url: 'view/yy_nengyuan_rili.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月能源消耗日历表',
        quick: { '月': 'yy_nengyuan_yueli', '日': 'yy_nengyuan_rili'},
        current_quick: '日',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.day) this.day = date.getDate();
            if (!this.startdate) this.startdate = date.format('yyyy-MM-dd');
            this.days = my.util.getDaysByMonth(this.month, this.year);//当月天数
            this.rows = Math.ceil(this.days / 7);//日历显示多少行
            this.arr_days = my.util.getDays(this.month, this.year);//获取日历对象
            if (!this.store_id) this.store_id = my.util.getStores();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                store_id: this.store_id
            };
        },
        initData: function (data) {
            var res = my.util.getDays(this.month, this.year);
            this.data.list = data;
            $.each(this.data.list, function () {
                var tmp = this;
                $.each(res, function () {
                    if (this.day == parseInt(tmp.dayss)) {
                        tmp.week = this.week;
                        tmp.day = this.day;
                        return true;
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.yy_nengyuan_rili = a;
})();