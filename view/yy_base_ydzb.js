
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'v1->getRankListAddYusuan',
        template_url: 'view/yy_base_ydzb.html',
        title: '山西和合谷{startday}至{endday}异动指标',
        init: function () {
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            
   
            //初始化服务器获取数据的参数
            this.arges = {
                startday: this.startday,
                endday: this.endday,
            };
        },
        initData: function (data) {
            var dayCount = my.util.getDaysByMonth(this.month, this.year),
                count = 1;
            var avg = {
                chufang:0,
                dating:0,
                heji:0
            },nums=0;
            $.each(data, function () {
                this.shouru = dot(this.shouru, 2);
                this.dating = dot(this.dating, 2);
                this.chufang = dot(this.chufang, 2);
                this.datingbaiyuan = dot(mul(div(this.dating, this.shouru), 100), 2);
                this.chufangbaiyuan = dot(mul(div(this.chufang, this.shouru), 100), 2);
                this.hejibaiyuan = dot(add(this.datingbaiyuan, this.chufangbaiyuan), 2);
                this.avg = avg;
                nums++;
                avg.chufang +=this.chufangbaiyuan;
                avg.dating  +=this.datingbaiyuan;
                avg.heji += this.hejibaiyuan;
            })
            avg.chufang = avg.chufang / nums;
            avg.dating = avg.dating / nums;
            avg.heji = avg.heji / nums;
            //收入排名
            data.sort(function (a, b) {
                return b.shouru - a.shouru;
            });
            $.each(data, function () {
                this.shouru_paiming = count;
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
            //预算完成比排名
            count = 1;
            data.sort(function (a, b) {
                return b.yusuan_percent - a.yusuan_percent;
            });
            $.each(data, function () {
                this.yusuan_paiming = count;
                count++;
            })

            this.data.list = data;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_base_ydzb = a;
})();