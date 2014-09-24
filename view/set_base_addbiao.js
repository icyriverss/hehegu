
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_base_addbiao.html',
        title: '水电气表类别管理-添加表类别',


        current_quick: '返回所有类别',
        quick: { '返回所有类别': 'set_base_dian' },

        output:0,
        init: function () {
            this.arges.page = this.page;
            this.data = {
                levels: my.user.info.config.levels,
                stores: my.stores,
                bags: my.bags,
                chejians:my.chejians
            };
        },
        bindEvent: function () {
            var _this = this;
            $("#data .input-submit").bind('click', function () {
                var biao_name = $("#biao_name").val();
                var biao_type = $('input[name="biao_type"]:checked').val();
                var istotal = $('input[name="istotal"]:checked').val();


                if (!biao_name) return my.view.message('请输入表名!');

                my.view.load(1);
                my.shuidian.addType(biao_name, biao_type, istotal, function () {
                    my.view.message('添加成功！', 1, function () {
                        my.view.showTable('set_base_dian');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_addbiao = a;
})();