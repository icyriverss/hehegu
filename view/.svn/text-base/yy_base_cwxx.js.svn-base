
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'v1->getSell',
        template_url: 'view/yy_base_cwxx.html',
        title: '山西和合谷{startday}至{endday}财务信息报表',
        quick: { '月': 'yy_base_cwxx' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                beginDate: this.startday,
                endDate: this.endday,
                stores: this.store_id
            }
        },
        initData: function (data) {
            data = data[0];
            data.zaocan = dot(data.zaocan, 2);
            data.wucan = dot(data.wucan, 2);
            data.wancan = dot(data.wancan, 2);
            data.waisong = dot(data.waisong, 2);
            data.total = dot(data.total, 2);
            data.zaocanzhanbi = dot(mul(div(data.zaocan, data.total), 100), 2);
            data.wucanzhanbi = dot(mul(div(data.wucan, data.total), 100), 2);
            data.wancanzhanbi = dot(mul(div(data.wancan, data.total), 100), 2);
            data.waisongzhanbi = dot(mul(div(data.waisong, data.total), 100), 2);
            this.data.list = data;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_base_cwxx = a;
})();