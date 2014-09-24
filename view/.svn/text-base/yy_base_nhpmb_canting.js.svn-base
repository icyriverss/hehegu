
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        dayopt: '',
        method: 'v1->powerConsumption',
        template_url: 'view/yy_base_nhpmb_canting.html',
        title: '山西和合谷{year}年{month}月{dayopt}日门店百元耗电统计表-餐厅',
        quick: { '全部': 'yy_base_nhpmb', '厨房': 'yy_base_nhpmb_chufang', '餐厅': 'yy_base_nhpmb_canting' },
        current_quick: '餐厅',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.dayopt) this.dayopt = date.getDate();
            if (!this.store_id) this.store_id = my.util.getStores();
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
                day: this.dayopt,
                stores: this.store_id
            };
        },
        initData: function (data) {
            $.each(data, function () {
                this.shouru = dot(this.shouru, 2);
                this.yueshouru = dot(this.yueshouru, 2);
                this.dating = dot(this.dating, 2);
                this.yuedating = dot(this.yuedating, 2);
                this.datingbaiyuan = dot(mul(div(this.dating, this.shouru), 100), 2);
                this.datingpingjun = div(mul(div(this.yuedating, this.yueshouru), 100), this.dayopt, 2);
                this.datingchayi = dot(sub(this.datingbaiyuan, this.datingpingjun), 2);
            })
            data.sort(function (a, b) {
                return a.datingbaiyuan - b.datingbaiyuan;
            })
            this.data.list = data;
        },
        getGraph: function () {
            var _this = this;
            var container = document.getElementById('data_graph');
            var DataList = [];
            $.each(this.data.list, function () {
                DataList.push({
                    "storeName": this.store_name,
                    "zhi": this.datingbaiyuan
                })
            })
            var
              horizontal = (horizontal ? true : false), // Show horizontal bars
              d1 = [],                                  // First data series

              point,                                    // Data point variable declaration
              i;

            for (i = 0; i < DataList.length; i++) {


                point = [DataList[i].zhi, i * 2 + 1];


                d1.push(point);

            };

            // Draw the graph
            Flotr.draw(
              container,
              [d1],
              {
                  title: this.getTitle(),
                  bars: {
                      show: true,
                      horizontal: !horizontal,
                      shadowSize: 0,
                      barWidth: 1
                  },
                  mouse: {
                      track: true,
                      relative: true,
                      trackFormatter: function (obj) { return '百元耗电量 = ' + obj.x + '度'; }
                  },
                  xaxis: {
                      min: 0
                  },
                  yaxis: {

                      autoscaleMargin: 1,
                      ticks: function () {
                          var rowNode = [];
                          for (var i = 0; i < DataList.length; i++) {
                              rowNode.push([i * 2 + 1, DataList[i].storeName]);
                          }
                          return rowNode;
                      }
                  }
              }
            );


        }
    };
    my.extend(a, prop);
    my.moudle.yy_base_nhpmb_canting = a;
})();