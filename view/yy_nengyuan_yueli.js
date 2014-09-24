
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'shuidian->getUseMonths',
        store: '',
        store_id: '',
        template_url: 'view/yy_nengyuan_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年能源消耗月历表',
        quick: {  '月': 'yy_nengyuan_yueli', '日': 'yy_nengyuan_rili' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
            //初始化服务器获取数据的参数
            this.arges = {
                year: this.year,
                store_id: this.store_id
            };
        },
        initData: function (data) {
            var res = my.util.getMonths(this.year);
            this.data.list = data;
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
    my.moudle.yy_nengyuan_yueli = a;
})();