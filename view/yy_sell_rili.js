
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByDays',
        store: '',
        store_id: '',
        template_url: 'view/yy_sell_rili.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月销售日历表',
        quick: { '年': 'yy_sell_nianli', '月': 'yy_sell_yueli', '日': 'yy_sell_rili'},
        current_quick: '日',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) {
                this.month = date.getMonth() + 1;
                var day = date.getDate();
                if (day == 1) {
                    this.month--;
                    if (this.month == 0) {
                        this.year--;
                        this.month = 12;
                    }
                }
            }
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                month: this.month,
                stores: this.store_id,
                fields: ['total', 'zaocan', 'wucan', 'wancan', 'waisong', 'taocan', 'cuxiao']
            }
        },
        initData: function (data) {
            var res = my.util.getDays(this.month, this.year);
            this.data.list = data;
            $.each(this.data.list, function () {
                var tmp = this;
                $.each(res, function () {
                    if (this.day == parseInt(tmp.dayss)) {
                        tmp.week = this.week;
                        tmp.day = this.day;
                        return true;
                    }
                });
            });
        },
        getGraph: function () {
            var _this = this;
            var container = document.getElementById('data_graph');
            var
            d1 = [],
            d2 = [],
            d3 = [],
            d4 = [],
            d5 = [],
            d6 = [],
            d7 = [],
            graph;
            $.each(this.data.list, function (i) {
                d1.push([i, this.total]);
                d2.push([i, this.zaocan]);
                d3.push([i, this.wucan]);
                d4.push([i, this.wancan]);
                d5.push([i, this.waisong]);
                d6.push([i, this.taocan]);
                d7.push([i, this.cuxiao]);
            });
            graph = Flotr.draw(
              container,
              [
                {
                    data:d1,
                    label:'总销售额'
                },
                {
                    data: d2,
                    label:'早餐'
                },
                {
                    data: d3,
                    label:'早班'
                },
                {
                    data: d4,
                    label: '晚班'
                },
                {
                    data: d5,
                    label: '外送'
                },
                {
                    data: d6,
                    label: '套餐'
                },
                {
                    data: d7,
                    label: '促销'
                }
              ], {
                  xaxis: {
                      noTicks: this.data.list.length,
                      tickDecimals: 0,
                      tickFormatter: function (x) {
                          var x = parseInt(x);
                          return _this.data.list[x].day +'<br>'+ _this.data.list[x].week ;
                      }
                  },
                  yaxis:{
                      noTicks: 10,
                      showMinorLabels: true,
                      autoscale: true,
                      max:my.util.getMax(this.data.list,'total')
                  },
                  title: this.getTitle(),
                  mouse: {
                      track: true,          // => 为true时,当鼠标移动到每个折点时,会显示折点的坐标
                      trackAll: true,
                      relative: true,
                      trackDecimals: 0,
                      sensibility:10
                  }
              }
            );
        }
    };
    my.extend(a, prop);
    my.moudle.yy_sell_rili = a;
})();