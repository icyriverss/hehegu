my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'gongcheng->getQushi',
        store_id:'',
        template_url: 'view/gc_base_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月能源消耗状况趋势表',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) {
                this.month = date.getMonth() + 1;
                var day = date.getDate();
                if (day === 1) {
                    this.month--;
                    if (this.month === 0) {
                        this.year--;
                        this.month = 12;
                    }
                }
            }
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                month: this.month,
                stores: this.store_id
            }
        },
        initData: function (data) {
            data.list.shangqi_percent = {};
            data.list.shangqi_percent_tong = {};
            data.list.tongqi_percent = {};
            data.list.tongqi_percent_tong = {};
            $.each(data.list.shiji,function(field){
                data.list.shangqi_percent[field] = per(data.list.shiji_all[field],data.list.shangqi_all[field],1);
                data.list.shangqi_percent_tong[field] = per(data.list.shiji[field],data.list.shangqi[field],1);
                data.list.tongqi_percent[field] = per(data.list.shiji_all[field],data.list.tongqi_all[field],1);
                data.list.tongqi_percent_tong[field] = per(data.list.shiji[field],data.list.tongqi[field],1);
            });
            this.data.list = {
                shiji:data.list.shiji,
                shangqi:data.list.shangqi,
                shangqi_percent:data.list.shangqi_percent,
                shangqi_percent_tong:data.list.shangqi_percent_tong,
                tongqi:data.list.tongqi,
                tongqi_percent:data.list.tongqi_percent,
                tongqi_percent_tong:data.list.tongqi_percent_tong,
                yusuan:{},
                yusuan_percent:{}
            };
        }
    };
    my.extend(a, prop);
    my.moudle.gc_base_qushi = a;
})();