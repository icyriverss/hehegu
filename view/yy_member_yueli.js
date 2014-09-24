
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellData',
        store: '',
        store_id: '',
        template_url: 'view/yy_member_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年会员销售月历表',
        quick: { '年': 'yy_sell_nianli', '月': 'yy_sell_yueli', '日': 'yy_sell_rili' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
        },
        initData: function (data) {
            var res = {};
            res.months = my.util.getMonths(this.year);
            this.data =  res;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_member_yueli = a;
})();