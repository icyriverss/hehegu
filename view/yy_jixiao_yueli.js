
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByMonths',
        store: '',
        store_id: '',
        template_url: 'view/yy_jixiao_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年绩效指标月历表',
        quick: { '年': 'yy_jixiao_nianli', '月': 'yy_jixiao_yueli' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                stores: this.store_id,
                fields: ['total', 'keliuliang', 'fengshou','gongshi','kesu']
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
                this.kedanjia = dot(div(this.total, this.keliuliang), 4);
                this.jiazhishu = dot(div(div(this.total, this.days), area), 4);
                this.renqi = dot(div(div(this.keliuliang, this.days), area), 4);
                this.gongshi = div(this.total, this.gongshi);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.yy_jixiao_yueli = a;
})();