
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellData',
        store: '',
        store_id: '',
        template_url: 'view/jg_li_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年加工中心月历表',
        quick: { '年': 'jg_li_nianli', '月': 'jg_li_yueli', '日': 'jg_li_rili', '季': 'jg_li_jili' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.chejian_id) this.chejian_id = getOneChejian_ID();
        },
        initData: function (data) {
            var res = {};
            res.months = my.util.getMonths(this.year);
            this.data =  res;
        }
    };
    my.extend(a, prop);
    my.moudle.jg_li_yueli = a;
})();