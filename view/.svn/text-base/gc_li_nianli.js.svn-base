
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'gongcheng->getYear',
        store: '',
        store_id:'',
        template_url: 'view/gc_li_nianli.html',
        arges: {},
        data: {},
        title: '山西和合谷能源消耗状况年历表',
        quick: { '年': 'gc_li_nianli', '月': 'gc_li_yueli', '日': 'gc_li_rili','季':'gc_li_jili' },
        current_quick: '年',
        base: 'gc_li',
        init: function () {
            var date = new Date();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges.store_id = this.store_id;
        },
        initData: function (data) {
            this.data = data;
            console.log(data);
            $.each(this.data.list, function (years) {
                this.days = my.util.getDaysByYear(years);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.gc_li_nianli = a;
})();