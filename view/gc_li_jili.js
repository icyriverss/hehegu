
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellData',
        store: '',
        store_id:'',
        template_url: 'view/gc_li_jili.html',
        arges: {},
        data: {},
        title: '山西和合谷能源消耗状况季历表',
        quick: { '年': 'gc_li_nianli', '月': 'gc_li_yueli', '日': 'gc_li_rili', '季': 'gc_li_jili' },
        current_quick: '季',
        base: 'yy_sell',
        init: function () {
            var date = new Date();
            if (!this.store_id) this.store_id = my.util.getStores();
        },
        initData: function (data) {
            var res = {};
            res.years = [
                {
                    title:'一季度',
                },
                {
                    title: '二季度',
                },
                {
                    title: '三季度',
                },
                {
                    title: '四季度',
                }
            ];
            this.data =  res;
        }
    };
    my.extend(a, prop);
    my.moudle.gc_li_jili = a;
})();