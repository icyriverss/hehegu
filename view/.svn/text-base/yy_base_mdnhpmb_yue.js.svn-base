my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'v1->getRankList',
        template_url: 'view/yy_base_mdnhpmb.html',
        title: '山西和合谷{year}年{month}月门店能耗排名表',
        quick: { '年': 'yy_base_mdnhpmb', '月': 'yy_base_mdnhpmb_yue', '日': 'yy_base_mdnhpmb_ri' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if(!this.month) this.month = date.getMonth() + 1;


            //初始化服务器获取数据的参数
            this.arges = {
                startday: this.year + '-' + this.month + '-01',
                endday: this.year + '-' + this.month+'-' + my.util.getDaysByMonth(this.month,this.year)
            };
        },
        initData: function (data) {
            var dayCount = my.util.getDaysByMonth(this.month, this.year),
                count = 1;
            $.each(data, function () {
                this.shouru = dot(this.shouru, 2);
                this.dating = dot(this.dating, 2);
                this.chufang = dot(this.chufang, 2);
                this.heji = dot(add(this.dating, this.chufang), 2)
                this.datingbaiyuan = dot(mul(div(this.dating, this.shouru), 100), 2);
                this.chufangbaiyuan = dot(mul(div(this.chufang, this.shouru), 100), 2);
                this.hejibaiyuan = dot(add(this.datingbaiyuan, this.chufangbaiyuan), 2);
            })

            //厨房百元耗电排名
            data.sort(function (a, b) {
                var V1 = isNaN(a.chufangbaiyuan) ? 0 : a.chufangbaiyuan;
                var V2 = isNaN(b.chufangbaiyuan) ? 0 : b.chufangbaiyuan;
                return V1 - V2;
            });
            $.each(data, function () {
                this.chufang_paiming = count;
                count++;
            })
            //餐厅百元耗电排名
            count = 1;
            data.sort(function (a, b) {
                var V1 = isNaN(a.datingbaiyuan) ? 0 : a.datingbaiyuan;
                var V2 = isNaN(b.datingbaiyuan) ? 0 : b.datingbaiyuan;
                return V1 - V2;
            });
            $.each(data, function () {
                this.dating_paiming = count;
                count++;
            })
            //合计百元耗电排名
            count = 1;
            data.sort(function (a, b) {
                var V1 = isNaN(a.hejibaiyuan) ? 0 : a.hejibaiyuan;
                var V2 = isNaN(b.hejibaiyuan) ? 0 : b.hejibaiyuan;
                return V1 - V2;
            });
            $.each(data, function () {
                this.heji_paiming = count;
                count++;
            })
            this.data.list = data;

        }
    };
    my.extend(a, prop);
    my.moudle.yy_base_mdnhpmb_yue = a;
})();