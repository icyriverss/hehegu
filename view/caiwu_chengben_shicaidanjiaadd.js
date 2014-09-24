my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        template_url: 'view/caiwu_chengben_shicaidanjiaadd.html',
        method: 'chengben->getMaterialPriceByMonth',
        title: '食材理论单价 - 录入',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            //初始化服务器获取数据的参数
            this.arges = {
                month: this.month,
                year: this.year,
            };
        },
        initData: function (data) {
            this.data.list = data;
        },
        bindEvent: function () {
            var _this = this;
            $("#subBtn,#submit_form").click(function () {
                var data = [];
                $("[name='price']").each(function () {
                    var code = $(this).attr("stuffCode");
                    var val = $(this).val();
                    data.push({
                        "stuffcode": code
                        , "price": val
                    })
                })
                var postData = {
                    "year": _this.year,
                    "month": _this.month,
                    "data": data
                }
                my.view.load(1);
                my.util.send("chengben->setMaterialMonth", postData, function () {
                    my.view.message('录入成功！', 1, function () {
                        my.view.showTable('caiwu_chengben_shicaidanjiaadd');
                    });
                })
            })

            $("#submit_order").click(function () {
                my.view.load(1);
                var Obj = {
                    month: _this.month,
                    year: _this.year
                }
                $.ajaxFileUpload({
                    url: '/api/index.php',
                    type:'POST',
                    data: { request: $.toJSON(Obj), method: "chengben->setMaterialMonth", leadExcel: 1 },
                    secureuri: false,
                    timeout: 60000,
                    fileElementId: "inputExcel",
                    dataType: 'text',
                    success: function (data, status) {
                        try {
                            data = $.parseJSON(data);
                        } catch (e) {
                            my.view.message('服务器故障，请联系管理员。');
                            return;
                        }
                        if(!data || !data.request || data.request.status != 0 ){
                            my.view.message('Excel格式错误或表格内不存在数据，请重试！<br> <font color=#ff0000>注：如果重复提示该错误，请手动将Excel文件另存为Excel03格式后再试。</font>');
                        }else{
                            my.view.message('导入Excel成功！',1,function(){
                                my.view.showTable('caiwu_chengben_shicaidanjiaadd');
                            });
                        }
                    },
                    error: function (data, status) {
                        my.view.message('导入Excel失败，请重试！');
                    }
                });
            })
        }
    };





    my.extend(a, prop);
    my.moudle.caiwu_chengben_shicaidanjiaadd = a;
})();