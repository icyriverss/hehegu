my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellQushi',
        store_id:'',
        template_url: 'view/yy_shouru_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月收入分类趋势表',
        init: function () {
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
                stores: this.store_id,
                fields: ['type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'zaocan', 'wucan', 'wancan', 'xianjin', 'chuzhi', 'yinhangka', 'cost', 'total', 'keliuliang', 'ch_tangshi', 'ch_waimai', 'ch_tuan', 'ch_huizhan']
            }
        },
        initData: function (data) {
            this.data.list = data;
            var _this = this;
            var tmp = this.data.list;
            var fields = ['kedanjia', 'keliuliang', 'type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'zaocan', 'wucan', 'wancan', 'xianjin', 'chuzhi', 'yinhangka', 'ch_tangshi', 'ch_waimai', 'ch_tuan', 'ch_huizhan', 'cost', 'total', 'discount'];
            tmp.kedanjia = dot(div(tmp.total, tmp.keliuliang), 4);
            tmp.pkedanjia = dot(div(tmp.ptotal, tmp.pkeliuliang), 4);
            tmp.skedanjia = dot(div(tmp.stotal, tmp.skeliuliang), 4);
            tmp.kedanjia_all = dot(div(tmp.total_all, tmp.keliuliang_all), 4);
            tmp.skedanjia_all = dot(div(tmp.stotal_all, tmp.skeliuliang_all), 4);
            tmp.pkedanjia_all = dot(div(tmp.ptotal_all, tmp.pkeliuliang_all), 4);

            tmp.discount = per(tmp.total, tmp.cost);
            tmp.pdiscount = per(tmp.ptotal, tmp.pcost);
            tmp.sdiscount = per(tmp.stotal, tmp.scost);

            tmp.discount_all = per(tmp.total_all, tmp.cost_all);
            tmp.pdiscount_all = per(tmp.ptotal_all, tmp.pcost_all);
            tmp.sdiscount_all = per(tmp.stotal_all, tmp.scost_all);

            $.each(fields, function (k) {
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
            this.data.titles = ['<th rowspan="2">按因素</th><th>客单价</th>', '<th>客流量</th>',
                '<th rowspan="4">按品种</th><th>早餐</th>','<th>饭品</th>', '<th>副品</th>','<th>饮品</th>',
                '<th rowspan="3">按时段</th><th>早餐</th>', '<th>午餐</th>', '<th>晚餐</th>',
                '<th rowspan="3">按结账方式</th><th>现金</th>', '<th>储值</th>', '<th>银行卡</th>',
                '<th rowspan="4">按渠道</th><th>堂食</th>', '<th>外卖', '<th>团餐</th>',
                '<th>会展</th>', '<th rowspan="3">按折扣</th><th>应收销售额</th>', '<th>实收销售额</th>', '<th>折扣率</th>'];
        }
    };
    my.extend(a, prop);
    my.moudle.yy_shouru_qushi = a;
})();