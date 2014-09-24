
my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'jingyinReport',
        template_url: 'view/yy_base_jy.html',
        title: '山西和合谷{startday}至{endday}经营报表',
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
                fields: ['total', 'zaocan', 'wucan', 'wancan', 'waisong', 'taocan', 'cuxiao', 'keliuliang',
                    'ch_tangshi', 'ch_waimai', 'ch_tuan', 'ch_huizhan',
                    'type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'cost',
                    'xianjin','chuzhi','yinhangka','fengshou','cuxiao_taocan', 'cuxiao_wucan', 'cuxiao_changgui', 'cuxiao_tuangou'

                ]
            }
            if (!this.sortBy) this.sortBy = 'ch_branchno';
        },
        initData: function (data) {
            var days = (new Date(this.endday) - new Date(this.startday))/(1000*3600*24)+1;
            var tmp = data;
            var _this = this;

            
            if ($.isEmptyObject(tmp)) return;
            //计算日均销售额
            tmp.rijun_total = div(tmp.total, days,2);
            tmp.rijun_zaocan = div(tmp.zaocan, days, 2);
            tmp.rijun_wucan = div(tmp.wucan, days, 2);
            tmp.rijun_wancan = div(tmp.wancan, days, 2);
            tmp.rijun_waisong = div(tmp.waisong, days, 2);
            tmp.rijun_cuxiao = div(tmp.cuxiao, days, 2);

            tmp.rijun_zaocan_percent = per(tmp.rijun_zaocan, tmp.rijun_total, 1);
            tmp.rijun_wucan_percent = per(tmp.rijun_wucan, tmp.rijun_total, 1);
            tmp.rijun_wancan_percent = per(tmp.rijun_wancan, tmp.rijun_total, 1);
            tmp.rijun_waisong_percent = per(tmp.rijun_waisong, tmp.rijun_total, 1);
            tmp.rijun_cuxiao_percent = per(tmp.rijun_cuxiao, tmp.rijun_total, 1);


            //计算分类销售
            tmp.kedanjia = div(tmp.total, tmp.keliuliang, 2);
            tmp.discount = per(tmp.total, tmp.cost);
            var fields = ['type_zaocan', 'type_fanpin', 'type_fupin', 'type_yinpin', 'zaocan', 'wucan', 'wancan', 'xianjin', 'chuzhi', 'yinhangka', 'ch_tangshi', 'ch_waimai', 'ch_tuan', 'ch_huizhan','total','waisong','keliuliang'];
            $.each(fields, function () {
                tmp[this + '_percent'] = per(tmp[this], tmp.total, 1);
                if(tmp[this + '_yusuan']){
                    
                    tmp[this + '_yusuan'] = dot(tmp[this + '_yusuan'][0]['m' + (new Date(_this.startday).getMonth()+1)],2);
                    tmp[this + '_yusuan_percent'] = per(tmp[this], tmp[this + '_yusuan'],1);
                    tmp[this+'_chayi'] = tmp[this]  - tmp[this + '_yusuan'];

                    console.log('m' + (new Date(_this.startday).getMonth()+1),123123123,this,tmp[this+'_yusuan']);
                }else{
                    tmp[this + '_yusuan'] = '--';
                    tmp[this + '_yusuan_percent'] = '--';
                    tmp[this+'_chayi'] = '--';
                }
            });
            //计算绩效指标
            var area = getStoreAreaAvg(this.store_id);
            tmp.jiazhishu = dot(div(div(tmp.total, days), area), 4);
            tmp.renqi = dot(div(div(tmp.keliuliang, days), area), 4);


            //计算促销收入
            tmp.cuxiao_taocan_percent = per(tmp.cuxiao_taocan, tmp.total, 1);
            tmp.cuxiao_wucan_percent = per(tmp.cuxiao_wucan, tmp.total, 1);
            tmp.cuxiao_changgui_percent = per(tmp.cuxiao_changgui, tmp.total, 1);
            tmp.cuxiao_tuangou_percent = per(tmp.cuxiao_tuangou, tmp.total, 1);

            tmp.yongdian_percent = per(tmp.yongdian,tmp.total,1);
            tmp.chufang_percent = per(tmp.chufang,tmp.total,1);
            tmp.dating_percent = per(tmp.dating,tmp.total,1);
            tmp.yongshui_percent = per(tmp.yongshui,tmp.total,1);

            this.data = tmp;
        }
    };
    my.extend(a, prop);
    my.moudle.yy_base_jy = a;
})();