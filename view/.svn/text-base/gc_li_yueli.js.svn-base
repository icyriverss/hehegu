
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'gongcheng->getMonth',
        store: '',
        store_id: '',
        template_url: 'view/gc_li_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年能源消耗状况月历表',
        quick: { '年': 'gc_li_nianli', '月': 'gc_li_yueli', '日': 'gc_li_rili', '季': 'gc_li_jili' },
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
            var res = my.util.getMonths(this.year);
            this.data = data;
            $.each(this.data.list, function (months) {
                var tmpThis = this;
                $.each(res, function () {
                    if (this.value === parseInt(months)) {
                        tmpThis.month = this.month;
                        tmpThis.fest = this.fest?this.fest:'';
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.gc_li_yueli = a;
})();