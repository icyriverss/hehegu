
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellTotal',
        template_url: 'view/yy_cuxiao.html',
        title: '山西和合谷{startday}至{endday}促销统计表',
        init: function () {
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                startday: this.startday,
                endday: this.endday,
                stores: this.store_id,
                fields: ['cuxiao', 'cuxiao_taocan', 'cuxiao_wucan', 'cuxiao_changgui', 'cuxiao_tuangou']
            }
            if (!this.sortBy) this.sortBy = 'ch_branchno';
        },
        initData: function (data) {
            this.data.list = data;
            $.each(this.data.list, function () {
                this.title = getStoreName(this.ch_branchno);
                if (!this.waisong) this.waisong = '--';
                var fields = ['cuxiao', 'cuxiao_taocan', 'cuxiao_wucan', 'cuxiao_changgui', 'cuxiao_tuangou'];
                var tmp = this;
                $.each(fields, function () {
                    tmp[this + '_percent'] = per(tmp[this], tmp['cuxiao'],1);
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
            graph, total_max = 0;
            $.each(this.data.list, function (i) {
                if (this.istotal) return true;
                if (parseInt(this.cuxiao) > total_max) total_max = this.cuxiao;
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
                          return _this.data.list[x].title;
                      }
                  },
                  yaxis: {
                      noTicks: 10,
                      showMinorLabels: true,
                      autoscale: true,
                      max: total_max
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
    my.moudle.yy_cuxiao = a;
})();