
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'shuidian->getUseTotal',
        data:{},
        template_url: 'view/yy_nengyuan.html',
        title: '山西和合谷{year}年{month}月能源消耗统计表',
        init:function(){
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.store_id) this.store_id = my.util.getStores();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                stores: this.store_id,
            };
        },
        initData: function (data) {
            this.data.list = data;
            if (this.data.list) {
                $.each(this.data.list, function () {
                    this.yongdian_percent = per(this.yongdian, this.total,1);
                    this.chufang_dian_percent = per(this.chufang_dian, this.total,1);
                    this.dating_dian_percent = per(this.dating_dian, this.total,1);
                    this.yongshui_percent = per(this.yongshui, this.total,1);
                });
            }
        }
    };
    my.extend(a, prop);
    my.moudle.yy_nengyuan = a;
})();