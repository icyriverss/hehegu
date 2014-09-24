my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'personnel->get_sum_data',
        template_url: 'view/rs_base_base.html',
        title: '山西和合谷{year}年{month}月人事情况汇总表',
        init:function(){
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                month: this.month,
                stores: this.store_id
            };
        },
        initData: function (data) {
            this.data.list = data;
            if($.isEmptyObject(this.data.list)) return;
            // 总人数
            this.data.list['total'].age_total = this.data.list['total'].age_20 + this.data.list['total'].age_30 + this.data.list['total'].age_40 + this.data.list['total'].age_50 + this.data.list['total'].age_60;
            this.data.list['total'].degree_total = this.data.list['total'].degree_0 + this.data.list['total'].degree_1 + this.data.list['total'].degree_2 + this.data.list['total'].degree_3;
            this.data.list['total'].join_total = this.data.list['total'].join_0 + this.data.list['total'].join_1 + this.data.list['total'].join_2 + this.data.list['total'].join_3 + this.data.list['total'].join_4;
            this.data.list['total'].level_total = this.data.list['total'].level_0 + this.data.list['total'].level_1 + this.data.list['total'].level_2 + this.data.list['total'].level_3+ this.data.list['total'].level_4;
            $.each(this.data.list,function(){
                
                
                
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_base_base = a;
})();