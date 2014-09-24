
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'gongcheng->getTotal',
        template_url: 'view/gc_base_base.html',
        title: '山西和合谷{year}年{month}月能源消耗状况汇总表',
        init:function(){
            var date = new Date();
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                startday: this.startday,
                endday: this.endday,
                stores: this.store_id
            }
            if (!this.sortBy) this.sortBy = 'ch_branchno';
        },
        initData: function (data) {
            var res = {};
            this.data = data;
            console.log(data,123123);
            if ($.isEmptyObject(this.data.list)) return;
            $.each(this.data.list, function () {


            });
        }
    };
    my.extend(a, prop);
    my.moudle.gc_base_base = a;
})();