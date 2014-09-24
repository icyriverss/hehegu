
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellData',
        template_url: 'view/jg_base_base.html',
        title: '山西和合谷{year}年{month}月加工中心汇总表',
        init:function(){
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
        },
        initData: function (data) {
            var res = {};
            res.list = [
                {
                    title:'合计'
                },
                {
                    title:'平均'
                }
            ];
            $.each(my.chejians, function () {
                var o = {};
                o.title = this.chejian_name;
                res.list.push(o);
            });
            this.data =  res;
        }
    };
    my.extend(a, prop);
    my.moudle.jg_base_base = a;
})();