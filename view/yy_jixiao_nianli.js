
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByYears',
        store: '',
        store_id:'',
        template_url: 'view/yy_jixiao_nianli.html',
        arges: {},
        data: {},
        title: '山西和合谷绩效指标年历表',
        quick: { '年': 'yy_jixiao_nianli', '月': 'yy_jixiao_yueli' },
        current_quick: '年',
        base: 'yy_sell',
        init: function () {
            var date = new Date();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                stores: this.store_id,
                fields: ['total', 'keliuliang', 'fengshou','kesu','gongshi']
            }
        },
        initData: function (data) {
            this.data.list = data;
            var area = getStoreAreaAvg(this.store_id);
            $.each(this.data.list, function () {
                this.days = my.util.getDaysByYear(this.years);
                this.kedanjia = dot(div(this.total, this.keliuliang), 4);
                this.jiazhishu = dot(div(div(this.total, this.days), area), 4);
                this.renqi = dot(div(div(this.keliuliang, this.days), area), 4);
                this.gongshi = div(this.total, this.gongshi);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.yy_jixiao_nianli = a;
})();