
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByYears',
        store: '',
        store_id:'',
        template_url: 'view/yy_shouru_nianli.html',
        arges: {},
        data: {},
        title: '山西和合谷收入分类年历表',
        quick: { '年': 'yy_shouru_nianli', '月': 'yy_shouru_yueli' },
        current_quick: '年',
        init: function () {
            var date = new Date();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                stores: this.store_id,
                fields: ['type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'zaocan', 'wucan', 'wancan', 'xianjin', 'chuzhi', 'yinhangka', 'cost', 'total', 'keliuliang', 'ch_tangshi', 'ch_waimai', 'ch_tuan', 'ch_huizhan']
            }
        },
        initData: function (data) {
            this.data.list = data;
            $.each(this.data.list, function () {
                this.days = my.util.getDaysByYear(this.years);
                this.discount = per(this.total, this.cost);
                this.kedanjia = dot(div(this.total, this.keliuliang), 4);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.yy_shouru_nianli = a;
})();