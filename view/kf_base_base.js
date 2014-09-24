
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellTotal',
        template_url: 'view/kf_base_base.html',
        title: '山西和合谷{year}年{month}月开发部汇总表',
        init:function(){
            var today = new Date();
            if (!this.year) this.year = today.getFullYear();
            if (!this.month) {
                this.month = today.getMonth() + 1;
                if (today.getDate() == 1) {
                    this.month--;
                    if (this.month < 1) {//最后一个月取上一年
                        this.month = 12;
                        this.year--;
                    }
                }
            }
            var days = my.util.getDaysByMonth(this.month, this.year);//该月的天数
            this.days = days;//本次查询的天数
            var startday = new Date(this.year, this.month - 1, 1).format('yyyy-MM-dd');
            var endday = new Date(this.year, this.month - 1, days).format('yyyy-MM-dd');
            if (new Date(endday) >= new Date(today.format('yyyy-MM-dd'))) {//大于今天
                this.days = today.getDate() - 1;
                endday = new Date(this.year, this.month - 1, this.days).format('yyyy-MM-dd');//则取今天的前一天
            }
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                startday: startday,
                endday: endday,
                stores: this.store_id,
                fields: ['total', 'keliuliang', 'fengshou','kesu','gongshi']
            }
            if (!this.sortBy) this.sortBy = 'ch_branchno';
        },
        initData: function (data) {
            this.data.list = data;
            var _this = this;
            $.each(this.data.list, function () {
                this.title = getStoreName(this.ch_branchno);
                this.rijun = div(this.total,_this.days,2);
                this.kedanjia = dot(div(this.total, this.keliuliang), 4);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.kf_base_base = a;
})();