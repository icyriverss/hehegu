
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        method: 'getNewDishByMonths',
        store: '',
        store_id: '',
        template_url: 'view/yy_newproduct_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年新品需求月历表',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                stores: this.store_id
            }
        },
        initData: function (data) {
            var res = my.util.getMonths(this.year);
            this.data = data;
            $.each(this.data.list, function () {
                var tmpThis = this;
                $.each(res, function () {
                    if (this.value == parseInt(tmpThis.months)) {
                        tmpThis.month = this.month;
                        tmpThis.fest = this.fest ? this.fest : '';
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.yy_newproduct_yueli = a;
})();