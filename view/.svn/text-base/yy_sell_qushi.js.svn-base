my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellQushi',
        store_id:'',
        template_url: 'view/yy_sell_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月销售趋势表',
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
                fields: ['total', 'zaocan', 'wucan', 'wancan', 'waisong', 'taocan', 'cuxiao']
            }
        },
        initData: function (data) {
            this.data.list = data;
            var _this = this;
            var tmp = this.data.list;
            var fields = ['total', 'zaocan', 'wucan', 'wancan', 'waisong', 'taocan', 'cuxiao'];
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
            this.data.titles = ['销售额','早餐','早班','晚班','外送销售额','套餐销售额','促销销售额'];
        }
    };
    my.extend(a, prop);
    my.moudle.yy_sell_qushi = a;
})();