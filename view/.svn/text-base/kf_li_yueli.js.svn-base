
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByMonths',
        store: '',
        store_id: '',
        template_url: 'view/kf_li_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年开发部月历表',
        quick: { '年': 'kf_li_nianli', '月': 'kf_li_yueli', '日': 'kf_li_rili', '季': 'kf_li_jili' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                stores: this.store_id,
                fields: ['total', 'keliuliang']
            }
        },
        initData: function (data) {
            var res = my.util.getMonths(this.year);
            this.data.list = data;
            var area = getStoreAreaAvg(this.store_id);
            $.each(this.data.list, function () {
                var tmpThis = this;
                $.each(res, function () {
                    if (this.value == parseInt(tmpThis.months)) {
                        tmpThis.month = this.month;
                        tmpThis.fest = this.fest ? this.fest : '';
                    }
                });
                this.days = my.util.getDaysByMonth(this.months,this.years);
                this.kedanjia = dot(div(this.total, this.keliuliang), 2);
                this.rijun = div(this.total, this.days,2);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.kf_li_yueli = a;
})();