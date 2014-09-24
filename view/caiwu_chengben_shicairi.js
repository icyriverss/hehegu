my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        dayopt: '',
        method: 'chengben->getMaterialCostByMonth',
        template_url: 'view/caiwu_chengben_shicairi.html',
        title: '山西和合谷{year}年{month}月{dayopt}日食材定量差异表',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.dayopt) this.dayopt = date.getDate();
            if (!this.store_id) this.store_id = my.util.getStores();

            var tempDate = new Date();
            tempDate.setFullYear(this.year, this.month - 1, this.dayopt);

            //初始化服务器获取数据的参数
            this.arges = {
                startdate: tempDate.format("yyyy-MM-dd"),
                enddate: tempDate.format("yyyy-MM-dd"),
                stores: this.store_id
            };
        },
        initData: function (data) {
            this.data.list = data;
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_chengben_shicairi = a;
})();