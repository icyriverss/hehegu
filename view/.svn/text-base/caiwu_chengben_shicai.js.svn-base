my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'chengben->getGoodsCost',
        template_url: 'view/caiwu_chengben_shicai.html',
        title: '山西和合谷{startday}至{endday}食材实际成本表',
        init:function(){
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            if (my.user.info.bumen != '门店' && !this.store_id) this.store_id = getOneStore_ID();
            this.storeid = this.store_id || my.user.info.store_id;
            this.arges = {
                startday: this.startday,
                endday: this.endday,
                store_id: this.storeid
            }
        },
        initData: function (data) {
            this.data = data;
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_chengben_shicai = a;
})();