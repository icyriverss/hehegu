
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getNewDish',
        template_url: 'view/yy_newproduct.html',
        title: '山西和合谷{year}年{month}月新品需求统计表',
        init:function(){
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
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                month: this.month,
                stores: this.store_id
            }
        },
        initData: function (data) {
            var _this = this;
            var res = my.util.getDays(this.month, this.year);
            this.data = data;
            $.each(this.data.list, function () {
                this.title = getStoreName(this.ch_branchno);
                var tmp = this;
                $.each(_this.data.dishlist, function () {
                    tmp['percent_' + this.ch_dishno] = per(tmp[this.ch_dishno], tmp[this.ch_seriesno], 1);
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.yy_newproduct = a;
})();
