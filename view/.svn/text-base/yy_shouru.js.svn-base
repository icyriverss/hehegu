
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellTotal',
        template_url: 'view/yy_shouru.html',
        title: '山西和合谷{year}年{month}月收入分类统计表',
        tips:'分类销售额占比为该类销售额与该店总销售额的比例。<br>客流量占比为该店客流量在所有店总客流量的占比。',
        init: function () {
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                startday: this.startday,
                endday: this.endday,
                stores: this.store_id,
                fields: ['type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'zaocan','wucan','wancan','xianjin','chuzhi','yinhangka','cost','total','keliuliang','ch_tangshi','ch_waimai','ch_tuan','ch_huizhan']
            }
            if (!this.sortBy) this.sortBy = 'ch_branchno';
        },
        initData: function (data) {
            this.data.list = data;
            var fields = ['kedanjia', 'keliuliang', 'type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'zaocan', 'wucan', 'wancan', 'xianjin', 'chuzhi', 'yinhangka', 'ch_tangshi', 'ch_waimai', 'ch_tuan', 'ch_huizhan', 'cost', 'total', 'discount'];
            var tmpTotal;
            $.each(this.data.list, function () {
                if (this.istotal == 1) {//选择总计数据
                    tmpTotal = this;
                    return true;
                }
            });
            $.each(this.data.list, function () {
                this.title = getStoreName(this.ch_branchno);
                if (!this.waisong) this.waisong = '--';
                this.discount = per(this.total, this.cost);
                this.kedanjia = dot(div(this.total, this.keliuliang),4);
                var tmp = this;
                $.each(fields, function () {
                    if (this == 'kedanjia') {
                        tmp[this + '_percent'] = '--';
                    }else if(this == 'keliuliang'){
                        tmp[this + '_percent'] = per(tmp[this], tmpTotal['keliuliang'],1);
                    } else {
                        tmp[this + '_percent'] = per(tmp[this], tmp['total'],1);
                    }
                });
            });
            this.data.fields = fields;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_shouru = a;
})();