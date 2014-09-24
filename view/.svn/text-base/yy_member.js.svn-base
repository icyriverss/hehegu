
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellData',
        template_url: 'view/yy_member.html',
        title: '山西和合谷{year}年{month}月会员销售统计表',
        init:function(){
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.store_id) this.store_id = my.util.getStores();
        },
        initData: function (data) {
            var res = {};
            res.list = [
                {
                    title:'合计'
                }
            ];
            $.each(my.stores, function () {
                var o = {};
                o.title = this.store_name;
                res.list.push(o);
            });
            this.data =  res;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_member = a;
})();