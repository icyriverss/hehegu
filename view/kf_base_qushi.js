my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellQushi',
        store_id:'',
        template_url: 'view/kf_base_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月趋势表',
        init: function () {
            var today = new Date();
            if (!this.year) this.year = today.getFullYear();
            if (!this.month) {
                this.month = today.getMonth() + 1;
                var day = today.getDate();
                if (day == 1) {
                    this.month--;
                    if (this.month == 0) {
                        this.year--;
                        this.month = 12;
                    }
                }
            }
            if (!this.store_id) this.store_id = my.util.getStores();
            var days = my.util.getDaysByMonth(this.month, this.year);//该月的天数
            this.days = days;//本次查询的天数
            var startday = new Date(this.year, this.month - 1, 1).format('yyyy-MM-dd');
            var endday = new Date(this.year, this.month - 1, days).format('yyyy-MM-dd');
            if (new Date(endday) >= new Date(today.format('yyyy-MM-dd'))) {//大于今天
                this.days = today.getDate() - 1;
            }

            this.arges = {
                year: this.year,
                month: this.month,
                stores: this.store_id,
                fields: ['total', 'keliuliang', 'fengshou', 'waisong', 'taocan', 'cuxiao','gongshi','kesu']
            };
        },
        initData: function (data) {
            var _this = this;
            this.data.list = data;
            var tmp = this.data.list;
            var fields = ['total', 'keliuliang','kedanjia','rijun'];
            var area = getStoreAreaAvg(this.store_id);
            tmp.kedanjia = dot(div(tmp.total, tmp.keliuliang), 2);
            tmp.pkedanjia = dot(div(tmp.ptotal, tmp.pkeliuliang), 2);
            tmp.skedanjia = dot(div(tmp.stotal, tmp.skeliuliang), 2);
            tmp.kedanjia_all = dot(div(tmp.total_all, tmp.keliuliang_all), 2);
            tmp.skedanjia_all = dot(div(tmp.stotal_all, tmp.skeliuliang_all), 2);
            tmp.pkedanjia_all = dot(div(tmp.ptotal_all, tmp.pkeliuliang_all), 2);

            tmp.rijun = div(tmp.total, _this.days,2);
            tmp.prijun = div(tmp.ptotal, _this.days,2);
            tmp.srijun = div(tmp.stotal, _this.days,2);
            tmp.rijun_all = div(tmp.total_all, _this.days,2);
            tmp.rijun_all = div(tmp.stotal_all, _this.days,2);
            tmp.rijun_all = div(tmp.ptotal_all, _this.days,2);
            
            $.each(fields, function (k) {//计算本期 同期 相比
                tmp[this + '_percent_p'] = per(tmp[this], tmp['p' + this],2);
                tmp[this + '_percent_p_all'] = per(tmp[this + '_all'], tmp['p' + this + '_all'],2);
                tmp[this + '_percent_s_all'] = per(tmp[this + '_all'], tmp['s' + this + '_all'],2);
                tmp[this + '_percent_s'] = per(tmp[this], tmp['s' + this],2);
            });
            this.data.fields = ['total', 'rijun','keliuliabg','kedanjia','zujin','chengben','feiyong','touzi','baobendian'];
            this.data.titles = ['<th>当期销售</th>',
                '<th>日均销售</th>', '<th>客流量</th>',
                '<th>客单价</th>', '<th>租金占比</th>', '<th>营业成本率</th>',
                '<th>营业费用率</th>', '<th>投资回报率</th>', '<th>保本点完成率</th>'];
        }
    };
    my.extend(a, prop);
    my.moudle.kf_base_qushi = a;
})();