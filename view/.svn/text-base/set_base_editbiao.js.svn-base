

my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/set_base_addbiao.html',
        title: '水电气表类别管理-修改表类别',
        current_quick: '返回所有类别',
        quick: { '返回所有类别': 'set_base_dian' },
        selection: '',
        output: 0,
        init: function () {
            this.data = my.moudle['set_base_dian'].biao_type_info;//获取要修改的用户ID
        },
        bindEvent: function () {
            var _this = this;
            $("#data .input-submit").bind('click', function () {
                var biao_name = $("#biao_name").val();
                var biao_type = $('input[name="biao_type"]:checked').val();
                var istotal = $('input[name="istotal"]:checked').val();
                if (!biao_name) return my.view.message('请输入表名!');
                my.view.load(1);
                my.shuidian.editType(_this.data.biao_type_id,biao_name, biao_type, istotal, function () {
                    my.view.message('修改成功！', 1, function () {
                        my.view.showTable('set_base_dian');
                    });
                });
            });
        }
    };
    my.extend(a, prop);
    my.moudle.set_base_editbiao = a;
})();