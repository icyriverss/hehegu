
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'personnel->get_day_sum_data',
        store: '',
        store_id: '',
        template_url: 'view/rs_li_rili.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月人事情况日历表',
        quick: { '年': 'rs_li_nianli', '月': 'rs_li_yueli', '日': 'rs_li_rili', '季': 'rs_li_jili' },
        current_quick: '日',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year:this.year,
                month: this.month,
                stores:this.store_id
            }
        },
        initData: function (data) {
            var res = my.util.getDays(this.month, this.year);
            this.data.list = data;
            var nums = this.store_id.length;
            $.each(this.data.list, function (dayss) {
                var tmp = this;
                $.each(res, function () {
                    if (this.day == parseInt(dayss)) {
                        tmp.week = this.week;
                        tmp.day = this.day;
                        return true;
                    }
                });
                this.age = dot(this.age / this.nums, 2);
                this.degree = per(this.degree, this.nums, 2);
                this.sex = per(this.sex, this.nums, 2);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_li_rili = a;
})();