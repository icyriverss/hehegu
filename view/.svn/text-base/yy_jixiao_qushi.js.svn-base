my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellQushi',
        store_id:'',
        template_url: 'view/yy_jixiao_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月绩效指标趋势表',
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
            var fields = ['kedanjia', 'jiazhishu', 'fengshou', 'keliuliang', 'renqi', 'kesu', 'zhiliang', 'gongshi', 'xingfujiang'];
            var area = getStoreAreaAvg(this.store_id);
            tmp.kedanjia = dot(div(tmp.total, tmp.keliuliang), 4);
            tmp.pkedanjia = dot(div(tmp.ptotal, tmp.pkeliuliang), 4);
            tmp.skedanjia = dot(div(tmp.stotal, tmp.skeliuliang), 4);
            tmp.kedanjia_all = dot(div(tmp.total_all, tmp.keliuliang_all), 4);
            tmp.skedanjia_all = dot(div(tmp.stotal_all, tmp.skeliuliang_all), 4);
            tmp.pkedanjia_all = dot(div(tmp.ptotal_all, tmp.pkeliuliang_all), 4);

            

            tmp.jiazhishu = dot(div(div(tmp.total, _this.days),area), 4);
            tmp.pjiazhishu = dot(div(div(tmp.ptotal, _this.days),area), 4);
            tmp.sjiazhishu = dot(div(div(tmp.stotal, _this.days),area), 4);
            tmp.jiazhishu_all = dot(div(div(tmp.total_all, _this.days),area), 4);
            tmp.sjiazhishu_all = dot(div(div(tmp.stotal_all, _this.days),area), 4);
            tmp.pjiazhishu_all = dot(div(div(tmp.ptotal_all, _this.days), area), 4);

            tmp.renqi = dot(div(div(tmp.keliuliang, _this.days), area), 4);
            tmp.prenqi = dot(div(div(tmp.pkeliuliang, _this.days), area), 4);
            tmp.srenqi = dot(div(div(tmp.skeliuliang, _this.days), area), 4);
            tmp.renqi_all = dot(div(div(tmp.keliuliang_all, _this.days), area), 4);
            tmp.srenqi_all = dot(div(div(tmp.skeliuliang_all, _this.days), area), 4);
            tmp.prenqi_all = dot(div(div(tmp.pkeliuliang_all, _this.days), area), 4);


            $.each(fields, function (k) {//计算本期 同期 相比
                tmp[this + '_percent_p'] = per(tmp[this], tmp['p' + this],1);
                tmp[this + '_percent_p_all'] = per(tmp[this + '_all'], tmp['p' + this + '_all'],1);
                tmp[this + '_percent_s_all'] = per(tmp[this + '_all'], tmp['s' + this + '_all'],1);
                tmp[this + '_percent_s'] = per(tmp[this], tmp['s' + this],1);
                if(tmp[this + '_yusuan']){
                    tmp[this + '_yusuan'] = dot(tmp[this + '_yusuan'][0]['m' + _this.month],2);
                    tmp[this + '_yusuan_percent'] = per(tmp[this], tmp[this + '_yusuan'],1);
                }else{
                    tmp[this + '_yusuan'] = '--';
                    tmp[this + '_yusuan_percent'] = '--';
                }
            });
            this.data.fields = fields;
            this.data.titles = ['<th rowspan="3" width="10%">销售</th><th width="10%">客单价</th>',
                '<th>价值数</th>', '<th>丰收记录</th>',
                '<th rowspan="3">顾客</th><th>客流量</th>', '<th>人气数</th>', '<th>客诉</th>',
                '<th rowspan="3">员工</th><th>质量</th>', '<th>工时收入</th>', '<th>幸福奖</th>'];
        }
    };
    my.extend(a, prop);
    my.moudle.yy_jixiao_qushi = a;
})();