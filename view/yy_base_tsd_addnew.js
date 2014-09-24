
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'v1->getSpecial',
        template_url: 'view/yy_base_tsd_addnew.html',
        title: '特殊店管理-添加特殊店',
        current_quick: '返回特殊店管理',
        quick: { '返回特殊店管理': 'yy_base_tsd' },
        output: 0,
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year
            };
        },
        initData: function (data) {
            var _this = this;
            this.data.stores = this.stores = my.stores;
            $.each(data, function () {
                _this.data.stores[this.store_id].is_mf = this.is_mf;
                _this.data.stores[this.store_id].is_wt = this.is_wt;
            })
        },
        bindEvent: function () {
            var _this = this;
            $(".input-submit").bind('click', function () {
                var wtList = $('input[name="is_wt"]:checked');
                var mfList = $('input[name="is_mf"]:checked');
                $.each(wtList, function () {
                    _this.stores[$(this).val()].is_wt = 1;
                })
                $.each(mfList, function () {
                    _this.stores[$(this).val()].is_mf = 1;
                })
                _this.setData();
                var postData = [];
                $.each(_this.stores, function () {
                    postData.push({
                        store_id: this.store_id,
                        is_wt: this.is_wt,
                        is_mf: this.is_mf
                    });
                })
                my.util.send('v1->addSpecial', { year: _this.year, month: _this.month, list: postData }, function (data) {
                    my.view.message('提交成功！');
                });
            });
        },
        setData: function () {
            $.each(this.stores, function () {
                if (!this.is_wt) this.is_wt = 0;
                if (!this.is_mf) this.is_mf = 0;
            })
        }

    };
    my.extend(a, prop);
    my.moudle.yy_base_tsd_addnew = a;
})();