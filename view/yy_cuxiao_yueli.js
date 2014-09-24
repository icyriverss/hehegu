
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByMonths',
        store: '',
        store_id: '',
        template_url: 'view/yy_cuxiao_yueli.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年促销收入月历表',
        quick: {  '月': 'yy_cuxiao_yueli' },
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                stores: this.store_id,
                fields: ['cuxiao', 'cuxiao_taocan', 'cuxiao_wucan', 'cuxiao_changgui', 'cuxiao_tuangou']
            }
        },
        initData: function (data) {
            var res = my.util.getMonths(this.year);
            this.data.list = data;
            $.each(this.data.list, function () {
                var tmpThis = this;
                $.each(res, function () {
                    if (this.value == parseInt(tmpThis.months)) {
                        tmpThis.month = this.month;
                        tmpThis.fest = this.fest ? this.fest : '';
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
                d1.push([i, this.cuxiao]);
                d2.push([i, this.cuxiao_taocan]);
                d3.push([i, this.cuxiao_wucan]);
                d4.push([i, this.cuxiao_changgui]);
                d5.push([i, this.cuxiao_tuangou]);
            });
            graph = Flotr.draw(
              container,
              [
                {
                    data: d1,
                    label: '促销收入'
                },
                {
                    data: d2,
                    label: '套餐销售'
                },
                {
                    data: d3,
                    label: '连锁活动'
                },
                {
                    data: d4,
                    label: '常规优惠'
                },
                {
                    data: d5,
                    label: '团购'
                }
              ], {
                  xaxis: {
                      noTicks: this.data.list.length,
                      tickDecimals: 0,
                      tickFormatter: function (x) {
                          var x = parseInt(x);
                          return _this.data.list[x].month + '<br>' + _this.data.list[x].fest;
                      }
                  },
                  yaxis: {
                      noTicks: 10,
                      showMinorLabels: true,
                      autoscale: true,
                      max: my.util.getMax(this.data.list, 'cuxiao')
                  },
                  title: this.getTitle(),
                  mouse: {
                      track: true,          // => 为true时,当鼠标移动到每个折点时,会显示折点的坐标
                      trackAll: true,
                      relative: true,
                      trackDecimals: 0,
                      sensibility: 10
                  }
              }
            );
        }
    };
    my.extend(a, prop);
    my.moudle.yy_cuxiao_yueli = a;
})();