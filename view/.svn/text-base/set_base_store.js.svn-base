
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'store->getList',
        template_url: 'view/set_base_store.html',
        title: '门店管理',
        page: 1,
        userid: '',
        perpage:10,
        output: 0,
        init: function () {
            this.arges = {
                perpage: this.perpage,
                page: this.page
            };
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('set_base_store');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('set_base_store');
                }
            );
            $("#data .user_list a").unbind().bind('click', function () {//修改
                var type = $(this).data('type');
                var storeid = $(this).data('value');
                _this.storeid = storeid;
                my.view.showTable('set_base_editstore');
                
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_store = a;
})();