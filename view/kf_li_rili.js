
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByDays',
        store: '',
        store_id: '',
        template_url: 'view/kf_li_rili.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月开发部日历表',
        quick: { '年': 'kf_li_nianli', '月': 'kf_li_yueli', '日': 'kf_li_rili', '季': 'kf_li_jili' },
        current_quick: '日',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) {
                this.month = date.getMonth() + 1;
                var day = date.getDate();
                if (day == 1) {
                    this.month--;
                    if (this.month == 0) {
                        this.year--;
                        this.month = 12;
                    }
                }
            }
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                month: this.month,
                stores: this.store_id,
                fields: ['total', 'keliuliang']
            }
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
                this.rijun = this.total;
                this.kedanjia = dot(div(this.total, this.keliuliang), 2);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.kf_li_rili = a;
})();