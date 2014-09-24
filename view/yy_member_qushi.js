my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellData',
        store_id:'',
        template_url: 'view/yy_member_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月会员销售趋势表',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.store_id) this.store_id = my.util.getStores();
        },
        initData: function (data) {
            var res = {};
            res.test = 'asd';
            res.list = [
                {
                    title: '合计'
                }
            ];
            this.data =  res;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_member_qushi = a;
})();