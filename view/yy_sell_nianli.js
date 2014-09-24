
my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellByYears',
        store: '',
        store_id:'',
        template_url: 'view/yy_sell_nianli.html',
        arges: {},
        data: {},
        title: '山西和合谷销售年历表',
        quick: { '年': 'yy_sell_nianli', '月': 'yy_sell_yueli', '日': 'yy_sell_rili' },
        current_quick: '年',
        base: 'yy_sell',
        init: function () {
            var date = new Date();
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                stores: this.store_id,
                fields: ['total', 'zaocan', 'wucan', 'wancan', 'waisong', 'taocan', 'cuxiao']
            }
        },
        initData: function (data) {
            this.data.list = data;
            $.each(this.data.list, function () {
                this.days = my.util.getDaysByYear(this.years);
            });
        },
        getGraph: function () {
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
                d1.push([this.years, this.total]);
                d2.push([this.years, this.zaocan]);
                d3.push([this.years, this.wucan]);
                d4.push([this.years, this.wancan]);
                d5.push([this.years, this.waisong]);
                d6.push([this.years, this.taocan]);
                d7.push([this.years, this.cuxiao]);
            });
            graph = Flotr.draw(
              container,
              [
                {
                    data: d1,
                    label: '总销售额'
                },
                {
                    data: d2,
                    label: '早餐'
                },
                {
                    data: d3,
                    label: '早班'
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
                      tickDecimals: 0
                  },
                  yaxis: {
                      noTicks: 10,
                      showMinorLabels: true,
                      autoscale: true,
                      max: my.util.getMax(this.data.list, 'total')
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
    my.moudle.yy_sell_nianli = a;
})();