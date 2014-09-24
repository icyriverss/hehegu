
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'order->getOrderlistByMonth',
        store: '',
        chejian_id: '',
        template_url: 'view/chejian_bag_month.html',
        arges: {},
        data: {},
        title: '山西和合谷{chejian}{year}年{month}月月结盘点表',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) {
                this.month = date.getMonth() + 1;
                var day = date.getDate();
                if (day == 1) {
                    this.month--;
                    if (this.month == 0) {
                        this.year--;
                        this.month = 12;
                    }
                }
            }
            if (my.user.info.bumen != '加工中心' && !this.chejian_id) this.chejian_id = getOneChejian_ID();
            this.arges = {
                year: this.year,
                month: this.month,
                chejian_id: this.chejian_id || my.user.info.chejian_id
            }
        },
        getTitle: function () {
            var chejian_id = this.chejian_id || my.user.info.chejian_id;
            return this.title ? this.title.replace(/{year}/g, this.year).replace(/{month}/g, this.month).replace(/{chejian}/g, getChejianName(chejian_id)).replace(/{startday}/g, this.startday).replace(/{endday}/g, this.endday) : '';
        },
        initData: function (data) {
            this.data = data;
        }
    };
    my.extend(a, prop);
    my.moudle.chejian_bag_month = a;
})();