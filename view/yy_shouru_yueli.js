
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByMonths',
        store: '',
        store_id: '',
        template_url: 'view/yy_shouru_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年收入分类月历表',
        quick: { '年': 'yy_shouru_nianli', '月': 'yy_shouru_yueli' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                stores: this.store_id,
                fields: ['type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'zaocan', 'wucan', 'wancan', 'xianjin', 'chuzhi', 'yinhangka', 'cost', 'total', 'keliuliang', 'ch_tangshi', 'ch_waimai', 'ch_tuan', 'ch_huizhan']
            }
        },
        initData: function (data) {
            var res = my.util.getMonths(this.year);
            this.data.list = data;
            $.each(this.data.list, function () {
                var tmpThis = this;
                this.discount = per(this.total, this.cost);
                this.kedanjia = dot(div(this.total, this.keliuliang), 4);
                $.each(res, function () {
                    if (this.value == parseInt(tmpThis.months)) {
                        tmpThis.month = this.month;
                        tmpThis.fest = this.fest ? this.fest : '';
                    }
                });
            });
        },
    };
    my.extend(a, prop);
    my.moudle.yy_shouru_yueli = a;
})();