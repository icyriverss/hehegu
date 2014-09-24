my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'gongcheng->getDay',
        store: '',
        store_id: '',
        template_url: 'view/gc_li_rili.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月能源消耗状况日历表',
        quick: { '年': 'gc_li_nianli', '月': 'gc_li_yueli', '日': 'gc_li_rili', '季': 'gc_li_jili' },
        current_quick: '日',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.startdate) this.startdate = date.format('yyyy-MM-dd');
            if (!this.store_id) this.store_id = my.util.getStores();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                store_id: this.store_id
            };
        },
        initData: function (data) {
            this.data = data;
            var res = my.util.getDays(this.month, this.year);
            this.data = data;
            $.each(this.data.list, function (dayss) {
                var tmp = this;
                $.each(res, function () {
                    if (this.day == parseInt(dayss)) {
                        tmp.week = this.week;
                        tmp.day = this.day;
                        return true;
                    }
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.gc_li_rili = a;
})();