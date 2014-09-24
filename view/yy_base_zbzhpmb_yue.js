
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'v1->getRankListAddYusuan',
        template_url: 'view/yy_base_zbzhpmb.html',
        title: '山西和合谷{year}年{month}月指标综合排名表',
        quick: { '年': 'yy_base_zbzhpmb','月': 'yy_base_zbzhpmb_yue', '日': 'yy_base_zbzhpmb_ri'},
        current_quick: '月',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if(!this.month) this.month = date.getMonth() + 1;


            //初始化服务器获取数据的参数
            this.arges = {
                startday: this.year + '-' + this.month + '-01',
                endday: this.year + '-' + this.month+'-' + my.util.getDaysByMonth(this.month,this.year)
            };
        },
        initData: function (data) {
            var dayCount = my.util.getDaysByMonth(this.month, this.year),
                count = 1;
            $.each(data, function () {
                this.shouru = dot(this.shouru, 2);
                this.dating = dot(this.dating, 2);
                this.chufang = dot(this.chufang, 2);
                this.datingbaiyuan = dot(mul(div(this.dating, this.shouru), 100), 2);
                this.chufangbaiyuan = dot(mul(div(this.chufang, this.shouru), 100), 2);
                this.hejibaiyuan = dot(add(this.datingbaiyuan, this.chufangbaiyuan), 2);
            })
            //收入排名
            data.sort(function (a, b) {
                return b.shouru - a.shouru;
            });
            $.each(data, function () {
                this.shouru_paiming = count;
                count++;
            })
            //合计百元耗电排名
            count = 1;
            data.sort(function (a, b) {
                var V1 = isNaN(a.hejibaiyuan) ? 0 : a.hejibaiyuan;
                var V2 = isNaN(b.hejibaiyuan) ? 0 : b.hejibaiyuan;
                return V1 - V2;
            });
            $.each(data, function () {
                this.heji_paiming = count;
                count++;
            })
            //预算完成比排名
            count = 1;
            data.sort(function (a, b) {
                return b.yusuan_percent - a.yusuan_percent;
            });
            $.each(data, function () {
                this.yusuan_paiming = count;
                count++;
            })

            this.data.list = data;
        },
        getGraph: function () {

            var _this = this;
            var container = document.getElementById('data_graph');

            console.debug("container!!!!!!!!!!!", container);

            ////DataList这个是数据格式！！！！！！！！！！！！
            var DataList = [{ "storeName": "国贸店", "shouru": "70", "songchu": "50" }, { "storeName": "火车站", "shouru": "30", "songchu": "20" }, { "storeName": "铜锣湾", "shouru": "60", "songchu": "40" }, { "storeName": "其他店。。", "shouru": "50", "songchu": "70" }];
            var
            horizontal = (horizontal ? true : false), //显示水平条
            d1 = [],                                  //第一个数据系列
            d2 = [],                                  //第二个数据系列
            point,                                    //数据点
            i;

            for (i = 0; i < DataList.length; i++) {

                if (horizontal) {
                    point = [parseFloat(DataList[i].shouru), i];
                } else {
                    point = [i * 1.5, parseFloat(DataList[i].shouru)];
                }
                d1.push(point);

                if (horizontal) {
                    point = [parseFloat(DataList[i].songchu), i + 0.5];
                } else {
                    point = [i * 1.5 + 0.5, parseFloat(DataList[i].songchu)];
                }

                d2.push(point);
            };


            // 画图
            Flotr.draw(
              container,
              [{ data: d1, label: '收入' }, { data: d2, label: '外送占比' }],
              {
                  bars: {
                      show: true,
                      horizontal: horizontal,
                      shadowSize: 0,
                      barWidth: 0.5
                  },
                  mouse: {
                      track: true,
                      relative: true,
                      trackFormatter: function (obj) { return '值 = ' + obj.y + '元'; }
                  },
                  yaxis: {
                      min: 0,
                      autoscaleMargin: null
                  }
                  ,
                  defaultType: 'lines',
                  title: '收入与外送占比',
                  xaxis: {
                      ticks: function () {
                          var rowNode = [];
                          for (var i = 0; i < DataList.length; i++) {
                              rowNode.push([i * 1.5 + 0.25, DataList[i].storeName]);
                          }
                          return rowNode;
                      }
                  }
              }
            );

            console.debug("container!!!!!!!!!!!", container);

            //创建图表2

            var data_graph2 = document.createElement("div");
            data_graph2.id = "data_graph2";
            data_graph2.style.height = "600px";
            document.body.appendChild(data_graph2);

            var container2 = document.getElementById('data_graph2');

            $("#data_graph2").insertAfter("#data_graph");
            $("#data_graph2").css({ margin: 20 });



            ////这个是第二张表的数据格式！！！！！！！！！！！！
            var DataList = [{ "storeName": "国贸店", "waisong": "35%", "baozhuang": "10%" }, { "storeName": "火车站", "waisong": "10%", "baozhuang": "15%" }, { "storeName": "铜锣湾", "waisong": "15%", "baozhuang": "7%" }];
            var
            horizontal = (horizontal ? true : false), //显示水平条
            d1 = [],                                  //第一个数据系列
            d2 = [],                                  //第二个数据系列
            point,                                    //数据点
            i;

            for (i = 0; i < DataList.length; i++) {

                if (horizontal) {
                    point = [parseInt(DataList[i].waisong), i];
                } else {
                    point = [i * 1.5, parseInt(DataList[i].waisong)];
                }
                d1.push(point);

                if (horizontal) {
                    point = [parseInt(DataList[i].baozhuang), i + 0.5];
                } else {
                    point = [i * 1.5 + 0.5, parseInt(DataList[i].baozhuang)];
                }

                d2.push(point);
            };
            // 画图
            Flotr.draw(
              container2,
              [{ data: d1, label: '外送占比' }, { data: d2, label: '包装物占比' }],
              {
                  bars: {
                      show: true,
                      horizontal: horizontal,
                      shadowSize: 0,
                      barWidth: 0.5
                  },
                  mouse: {
                      track: true,
                      relative: true,
                      trackFormatter: function (obj) { return '值 = ' + obj.y + '%'; }
                  },
                  yaxis: {
                      min: 0,
                      autoscaleMargin: null
                  }
                  ,
                  defaultType: 'lines',
                  title: '外卖与包装物使用',
                  parseFloat: false,
                  xaxis: {
                      ticks: function () {
                          var rowNode = [];
                          for (var i = 0; i < DataList.length; i++) {
                              rowNode.push([i * 1.5 + 0.25, DataList[i].storeName]);
                          }
                          return rowNode;
                      }
                  }
              }
            );
            console.debug("container2", container2);

            //创建图表3

            var data_graph3 = document.createElement("div");
            data_graph3.id = "data_graph3";
            data_graph3.style.height = "600px";
            document.body.appendChild(data_graph3);

            var container3 = document.getElementById('data_graph3');

            $("#data_graph3").insertAfter("#data_graph2");
            $("#data_graph3").css({ margin: 20 });



            ////这个是第三张表的数据格式！！！！！！！！！！！！
            var DataList = [{ "storeName": "国贸店", "shouru": "10000", "haodianliang": "2" }, { "storeName": "火车站", "shouru": "11000", "haodianliang": "1" }, { "storeName": "铜锣湾", "shouru": "8500", "haodianliang": "3" }];
            var
            horizontal = (horizontal ? true : false), //显示水平条
            d1 = [],                                  //第一个数据系列
            d2 = [],                                  //第二个数据系列
            point,                                    //数据点
            i;

            for (i = 0; i < DataList.length; i++) {

                if (horizontal) {
                    point = [parseInt(DataList[i].shouru), i];
                } else {
                    point = [i * 1.5, parseInt(DataList[i].shouru)];
                }
                d1.push(point);

                if (horizontal) {
                    point = [parseInt(DataList[i].haodianliang), i + 0.5];
                } else {
                    point = [i * 1.5 + 0.5, parseInt(DataList[i].haodianliang)];
                }

                d2.push(point);
            };
            // 画图
            Flotr.draw(
              container3,
              [{ data: d1, label: '收入' }, { data: d2, label: '百元耗电量' }],
              {
                  bars: {
                      show: true,
                      horizontal: horizontal,
                      shadowSize: 0,
                      barWidth: 0.5
                  },
                  mouse: {
                      track: true,
                      relative: true,
                      trackFormatter: function (obj) { return '值 = ' + obj.y + ''; }
                  },
                  yaxis: {
                      min: 0,
                      autoscaleMargin: null
                  }
                  ,
                  defaultType: 'lines',
                  title: '收入与百元耗电量',
                  parseFloat: false,
                  xaxis: {
                      ticks: function () {
                          var rowNode = [];
                          for (var i = 0; i < DataList.length; i++) {
                              rowNode.push([i * 1.5 + 0.25, DataList[i].storeName]);
                          }
                          return rowNode;
                      }
                  }
              }
            );
            console.debug("container3", container3);




        }

    };
    my.extend(a, prop);
    my.moudle.yy_base_zbzhpmb_yue = a;
})();