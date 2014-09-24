
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'personnel->get_year_sum_data',
        store: '',
        store_id:'',
        template_url: 'view/rs_li_nianli.html',
        arges: {},
        data: {},
        title: '山西和合谷人事情况年历表',
        quick: { '年': 'rs_li_nianli', '月': 'rs_li_yueli', '日': 'rs_li_rili','季':'rs_li_jili' },
        current_quick: '年',
        base: 'rs_li',
        init: function () {
            var date = new Date();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                stores: this.store_id
            }
        },
        initData: function (data) {
            this.data.list = data;
            var nums = this.store_id.length;
            $.each(this.data.list, function (years) {
                this.days = my.util.getDaysByYear(years);
                this.age = dot(this.age / this.nums,2);
                this.degree = per(this.degree , this.nums,2);
                this.sex = per(this.sex, this.nums, 2);
            });
        }
    };
    my.extend(a, prop);
    my.moudle.rs_li_nianli = a;
})();