my.moudle = my.moudle || {};

(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'personnel->get_current_data',
        store_id:'',
        template_url: 'view/rs_base_qushi.html',
        arges: {},
        data: {},
        title: '山西和合谷{year}年{month}月人事情况趋势表',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            if (!this.store_id) this.store_id = my.util.getStores();
            this.arges = {
                year: this.year,
                month: this.month,
                stores: this.store_id
            };
        },
        initData: function (data) {
            var rydt = {
                'rydt_lz': {
                    title: '离职人数',
                    type:1
                },
                'rydt_ly': {
                    title: '录用人数',
                    type: 1
                },
                'rydt_zz': {
                    title: '转正人数',
                    type: 1
                },
                'rydt_sx': {
                    title: '实习人数',
                    type: 1
                },
                'rydt_js': {
                    title: '晋升人数',
                    type: 1
                },
                'rydt_jx': {
                    title: '加薪人数',
                    type: 1
                },
                'rydt_wp': {
                    title: '外派人数',
                    type: 1
                },
                'rydt_cj': {
                    title: '长假人数',
                    type: 1
                },
                'rydt_wj': {
                    title: '外借人数',
                    type: 1
                },
                'bzrs': {
                    title: '编制人数',
                    type: 2
                },
                'zgzk_zg': {
                    title: '在岗人数',
                    type: 2
                },
                'zgzk_ht': {
                    title: '合同工人数',
                    type: 2
                },
                'zgzk_xs': {
                    title: '小时工人数',
                    type: 2
                },
                'age': {
                    title: '平均年龄',
                    type: 3
                },
                'sex': {
                    title: '男性占比',
                    type: 3
                },
                'degree': {
                    title: '本科占比',
                    type: 3
                },
                'gssr': {
                    title: '工时收入',
                    type: 4
                },
                'rlcb': {
                    title: '人力成本占营收比',
                    type: 4
                },
                'gzzb': {
                    title: '工资占营收比',
                    type: 4
                },
                'jxzb': {
                    title: '绩效奖金占营收比',
                    type: 4
                },
                'rjcz': {
                    title: '人均产值（万元）',
                    type: 4
                },
                'rjcb': {
                    title: '人均成本（元）',
                    type: 4
                },
                'rjgz': {
                    title: '人均工资（元）',
                    type: 4
                },
                'lzl': {
                    title: '离职率',
                    type: 4
                }
            }
            $.each(rydt, function (field) {
                if (field == 'age') {
                    this.shiji = dot(data.shiji[field] / data.shiji.nums, 2);
                    this.tongqi = dot(data.tongqi[field] / data.tongqi.nums, 2);
                    this.shangqi = dot(data.shangqi[field] / data.shangqi.nums, 2);
                    this.shiji_all = dot(data.shiji_all[field] / data.shiji_all.nums, 2);
                    this.tongqi_all = dot(data.tongqi_all[field] / data.tongqi_all.nums, 2);
                    this.shangqi_all = dot(data.shangqi_all[field] / data.shangqi_all.nums, 2);
                } else if (field == 'sex' || field == 'degree') {
                    this.shiji = dot(data.shiji[field] * 100 / data.shiji.nums, 2);
                    this.tongqi = dot(data.tongqi[field] * 100 / data.tongqi.nums, 2);
                    this.shangqi = dot(data.shangqi[field] * 100 / data.shangqi.nums, 2);
                    this.shiji_all = dot(data.shiji_all[field] * 100 / data.shiji_all.nums, 2);
                    this.tongqi_all = dot(data.tongqi_all[field] * 100 / data.tongqi_all.nums, 2);
                    this.shangqi_all = dot(data.shangqi_all[field] * 100 / data.shangqi_all.nums, 2);
                } else {
                    this.shiji = data.shiji[field];
                    this.tongqi = data.tongqi[field];
                    this.shangqi = data.shangqi[field];
                    this.shiji_all = data.shiji_all[field];
                    this.tongqi_all = data.tongqi_all[field];
                    this.shangqi_all = data.shangqi_all[field];
                }
                this.shangqi_hejibi = per(this.shiji_all , this.shangqi_all,2);
                this.shangqi_tongdianbi = per(this.shiji, this.shangqi, 2);
                this.tongqi_hejibi = per(this.shiji_all, this.tongqi_all, 2);
                this.tongqi_tongdianbi = per(this.shiji, this.tongqi, 2);
            })
            this.data = {
                rydt: rydt
            };
        }
    };
    my.extend(a, prop);
    my.moudle.rs_base_qushi = a;
})();