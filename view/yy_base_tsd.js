
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'v1->specialList',
        template_url: 'view/yy_base_tsd.html',
        title: '山西和合谷{year}年{month}月特殊门店财务报表',
        quick: { '月': 'yy_base_tsd', '添加特殊店': 'yy_base_tsd_addnew' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year
            };
        },
        initData: function (data) {
            var _this = this;
            var tempArray = [];
            $.each(data, function (key, val) {
                data[key] = _this.formatData(this);
            })
            this.data.list = data;
        },
        formatData: function (data) {
            var dayCount = my.util.getDaysByMonth(this.month, this.year);
            $.each(data, function () {
                this.keliuliang = dot(this.keliuliang, 2);
                this.total = dot(this.total, 2);
                this.gongshi = dot(this.gongshi, 2);
                this.kedanjia = div(this.total, this.keliuliang, 2);
                this.gongshishouru = div(this.total, this.gongshi, 2);
                this.rijun = div(this.total, dayCount, 2);
            })
            return data;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_base_tsd = a;
})();