my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'chengben->getGoodsCostMonth',
        template_url: 'view/caiwu_chengben_cpmonth.html',
        title: '成品月度成本表',
        page: 1,
        perpage: 10,
        tips: '<font color=red>理论单价</font>为财务进行上一月度结算后的统一成本。<br><font color=red>实际单价</font> = 门店月度实际消耗食材*月度理论单价/月度理论消耗食材。',
        init:function(){
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (my.user.info.bumen != '门店' && !this.store_id) this.store_id = getOneStore_ID();
            this.storeid = this.store_id || my.user.info.store_id;

            this.arges = {
                year: this.year,
                month: this.month,
                store_id: this.storeid,
                page: this.page,
                perpage:this.perpage
            }
        },
        initData: function (data) {
            this.data = data;
        },
        bindEvent: function () {
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_chengben_cpmonth = a;
})();