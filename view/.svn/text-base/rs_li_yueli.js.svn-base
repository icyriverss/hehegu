
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'personnel->get_month_sum_data',
        store: '',
        store_id: '',
        template_url: 'view/rs_li_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年人事情况月历表',
        quick: { '年': 'rs_li_nianli', '月': 'rs_li_yueli', '日': 'rs_li_rili', '季': 'rs_li_jili' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                stores: this.store_id
            }
        },
        initData: function (data) {
            var _this = this;
            var res = my.util.getMonths(this.year);
            this.data.list = data;
            var nums = this.store_id.length;
            $.each(this.data.list, function (month) {
                var tmpThis = this;
                $.each(res, function () {
                    if (this.value == parseInt(month)) {
                        tmpThis.month = this.month;
                        tmpThis.fest = this.fest ? this.fest : '';
                    }
                });
                this.days = my.util.getDaysByMonth(month, _this.year);
                this.age = dot(this.age / this.nums, 2);
                this.degree = per(this.degree, this.nums, 2);
                this.sex = per(this.sex, this.nums, 2);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_li_yueli = a;
})();