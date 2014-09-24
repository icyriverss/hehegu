my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'shuidian->getUseQushi',
        store_id:'',
        template_url: 'view/yy_nengyuan_qushi.html',
        arges: {},
        data: {},
        tips: '若当月没有结束，则“同期”数据取上一年该月到本日的数据。<br>如：今天为2013年7月20日，则“同期”取2012年7月1日到7月20日的数据。',
        title: '山西和合谷{year}年{month}月能源消耗趋势表',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.store_id) this.store_id = my.util.getStores();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                stores: this.store_id,
                ischange:1//获取趋势表数据
            };
        },
        initData: function (data) {
            this.data.list = data;
            var _this = this;
            var tmp = this.data.list;
            var fields = ['yongdian', 'dating', 'chufang', 'yongshui'];
            $.each(fields, function (k) {
                tmp[this + '_percent_p'] = per(tmp[this], tmp['p' + this],1);
                tmp[this + '_percent_p_all'] = per(tmp[this + '_all'], tmp['p' + this + '_all'],1);
                tmp[this + '_percent_s_all'] = per(tmp[this + '_all'], tmp['s' + this + '_all'],1);
                tmp[this + '_percent_s'] = per(tmp[this], tmp['s' + this],1);
            });
            this.data.fields = fields;
            this.data.titles = ['用电','餐厅用电','厨房用电','用水'];
        }
    };
    my.extend(a, prop);
    my.moudle.yy_nengyuan_qushi = a;
})();