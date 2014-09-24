my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        dayopt: '',
        method: 'v1->powerConsumption',
        template_url: 'view/yy_base_nhpmb.html',
        title: '山西和合谷{year}年{month}月{dayopt}日门店百元耗电统计表',
        quick: { '全部': 'yy_base_nhpmb', '厨房': 'yy_base_nhpmb_chufang', '餐厅': 'yy_base_nhpmb_canting' },
        current_quick: '全部',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.dayopt) this.dayopt = date.getDate();
            if (!this.store_id) this.store_id = my.util.getStores();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                day: this.dayopt,
                stores: this.store_id
            };
        },
        initData: function (data) {
            $.each(data, function () {
                this.shouru = dot(this.shouru, 2);
                this.yueshouru = dot(this.yueshouru, 2);
                this.dating = dot(this.dating, 2);
                this.yuedating = dot(this.yuedating, 2);
                this.chufang = dot(this.chufang, 2);
                this.yuechufang = dot(this.yuechufang, 2);
                this.heji = dot(add(this.dating, this.chufang), 2);

                this.datingbaiyuan = dot(mul(div(this.dating, this.shouru), 100), 2);
                this.chufangbaiyuan = dot(mul(div(this.chufang, this.shouru), 100), 2);
                this.hejibaiyuan = dot(add(this.datingbaiyuan, this.chufangbaiyuan), 2);

                this.datingpingjun = div(mul(div(this.yuedating, this.yueshouru), 100), this.dayopt, 2);
                this.chufangpingjun = div(mul(div(this.yuechufang, this.yueshouru), 100), this.dayopt, 2);
                this.hejipingjun = dot(add(this.datingpingjun, this.chufangpingjun), 2);

                this.datingchayi = dot(sub(this.datingbaiyuan, this.datingpingjun), 2);
                this.chufangchayi = dot(sub(this.chufangbaiyuan, this.chufangpingjun), 2);
                this.hejichayi = dot(add(this.datingchayi, this.chufangchayi), 2);

                this.datingchayilv = dot(mul(div(this.datingchayi, this.datingbaiyuan), 100), 2);
                this.chufangchayilv = dot(mul(div(this.chufangchayi, this.chufangbaiyuan), 100), 2);
                this.hejichayilv = dot(add(this.datingchayilv, this.chufangchayilv), 2);
            })
            this.data.list = data;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_base_nhpmb = a;
})();