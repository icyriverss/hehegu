

my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_other_update.html',
        title: '销售数据更新管理',
        method: 'getLastUpdate',
        output: 0,
        enddate:null,
        bindEvent: function () {
            var _this = this;
            $("#count").click(function () {
                if (_this.data.reportday == _this.data.newday) return my.view.message('已经是最新的数据，无需更新！');
                my.view.load('on');
                my.util.send('updateReport', {}, function () {
                    my.view.message('更新数据成功！', 1, function () {
                        my.view.showTable('set_other_update');
                    });
                });
            });
            $("#recount").click(function () {
                var startdate = $("input[name='startdate']").val();
                var enddate = $("input[name='enddate']").val();
                if (!startdate || !enddate) return my.view.message('请选择起始日期和结束日期！');
                if (enddate < startdate) return my.view.message('结束日期不能早于起始日期！');
                my.view.load('on');
                _this.enddate = enddate;
                _this.update(startdate, function () {
                    my.view.load();
                    $(".recount_status").html('更新完成。');
                });
            });
        },
        update: function (day, cb) {
            var _this = this;
            $(".recount_status").html('正在更新'+day+'的销售数据……');
            my.util.send('updateReportByDay', { day: day }, function () {
                if (day < _this.enddate) {
                    day = _this.addDate(day, 1);
                    _this.update(day, cb);
                } else {
                    if (cb && typeof cb == 'function') cb();
                }
            });
        },
        addDate: function (date, days) {
            var d = new Date(date);
            d.setDate(d.getDate() + days);
            var m = d.getMonth() + 1;
            return d.format('yyyy-MM-dd');
        }
    };
    my.extend(a, prop);
    my.moudle.set_other_update = a;
})();