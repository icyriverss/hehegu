
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'personnel->store_waimai',
        template_url: 'view/yy_wm.html',
        title: '山西和合谷{startday}至{endday}外卖数据查询',
        init:function(){
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            if (!this.store_id) this.store_id = getOneStore_ID();
            this.arges = {
                startday: this.startday,
                endday: this.endday,
                store_id: this.store_id
            }
        },
        initData: function (data) {
            this.data.list = data;
            var days = (new Date(this.endday) - new Date(this.startday))/(1000*3600*24)+1;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_wm = a;
})();