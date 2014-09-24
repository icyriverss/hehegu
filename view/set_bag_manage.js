
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_bag_manage.html',
        title: '仓库管理',
        tips:'仓库数据与用友系统仓库数据同步，暂不提供修改功能。',
        output: 0,
        init: function () {
            this.data.bags = my.bags;
        }
    };
    my.extend(a, prop);
    my.moudle.set_bag_manage = a;
})();