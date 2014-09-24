my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'getSellTotal',
        template_url: 'view/yy_sell.html',
        tips:'外送只取订餐部分的数据，不包括打包。<br>早餐：10:00之前；<br>早班：10:00-16:00；<br>晚班：16:00之后。',
        title: '山西和合谷{startday}至{endday}销售统计表',
        init:function(){
            var date = new Date();
            date.setDate(date.getDate() - 1);//只能获取前一天的数据
            if (!this.startday) this.startday = date.format('yyyy-MM') + '-01';
            if (!this.endday) this.endday = date.format('yyyy-MM-dd');
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                startday: this.startday,
                endday: this.endday,
                stores: this.store_id,
                fields:['total','zaocan','wucan','wancan','waisong','taocan','cuxiao']
            }
            if (!this.sortBy) this.sortBy = 'ch_branchno';
        },
        initData: function (data) {
            this.data.list = data;
            $.each(this.data.list, function () {
                this.title = getStoreName(this.ch_branchno);
                if (!this.waisong) this.waisong = '--';
                this.zaocan_percent = per(this.zaocan, this.total,1);
                this.wucan_percent = per(this.wucan, this.total,1);
                this.wancan_percent = per(this.wancan, this.total,1);
                this.taocan_percent = per(this.taocan, this.total,1);
                this.waisong_percent = per(this.waisong, this.total,1);
                this.cuxiao_percent = per(this.cuxiao, this.total,1);
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
            graph,total_max=0;
            $.each(this.data.list, function (i) {
                if (this.istotal) return true;
                if (parseInt(this.total) > total_max) total_max = this.total;
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
                      tickDecimals: 0,
                      tickFormatter: function (x) {
                          var x = parseInt(x);
                          if (_this.data.list[x])
                          return _this.data.list[x].title;
                      }
                  },
                  bars: {
                      show: true,
                      horizontal:false,
                      shadowSize: 0,
                      barWidth: 0.5
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
    my.moudle.yy_sell = a;
})();