my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellData',
        template_url: 'view/jg_base_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月加工中心趋势表',
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
            if (!this.chejian_id) this.chejian_id = getOneChejian_ID();
        },
        initData: function (data) {
            var res = {};
            res.test = 'asd';
            res.list = [
                {
                    title: '合计'
                }
            ];
            this.data =  res;
        }
    };
    my.extend(a, prop);
    my.moudle.jg_base_qushi = a;
})();