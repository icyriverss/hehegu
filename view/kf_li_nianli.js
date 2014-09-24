
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByYears',
        store: '',
        store_id:'',
        template_url: 'view/kf_li_nianli.html',
        arges: {},
        data: {},
        title: '山西和合谷开发部年历表',
        quick: { '年': 'kf_li_nianli', '月': 'kf_li_yueli', '日': 'kf_li_rili','季':'kf_li_jili' },
        current_quick: '年',
        base: 'kf_li',
        init: function () {
            var date = new Date();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                stores: this.store_id,
                fields: ['total', 'keliuliang']
            }
        },
        initData: function (data) {
            this.data.list = data;
            $.each(this.data.list, function () {
                this.days = my.util.getDaysByYear(this.years);
                this.kedanjia = dot(div(this.total, this.keliuliang), 2);
                this.rijun = div(this.total, this.days, 2);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.kf_li_nianli = a;
})();