my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'order->getGoodsTypeList',
        template_url: 'view/store_bag_day.html',
        title: '日结盘点登记',
        selection: 'tr table tr',//无需选中
        perpage: 10,
        order_type: 1,//默认订单类别
        bagid: '',//仓库id
        vendorid: '',//供应商id
        storeid:'',//门店id
        current_quick: '查看历史盘点记录',
        quick: { '查看历史盘点记录': 'store_bag_list' },
        onlyhas: false,//只看已定
        output: 0,
        data:{
            current_type:null//当前所在分类类型
        },
        init: function () {
            if (my.user.info.bumen !== '门店' && !this.store_id) this.store_id = getOneStore_ID();
            this.arges = {
                order_type: this.order_type,
                bagid: this.bagid,
                isstore:1
            };
        },
        initData: function (data) {
            /*
            data:
                type:分类数组
                typelist:分类物品列表
                list:物品列表
            */
            var _this = this;
            this.data = data;
            //初始化分类
            var tmpType = {};
            $.each(this.data.type, function (k) {
                tmpType[this.type_name] = {
                    nums: 0,
                    index:k
                };
            });
            tmpType['临时增加'] = { nums: 0, index: 999999 };
            this.data.type = tmpType;
            //初始化列表
            if (!$.isEmptyObject(my.pandian)) {//历史缓存的订单记录
                this.data.list = my.pandian.all;
            } else {
                var arr = {};
                $.each(this.data.list, function () {
                    this.py = makePy(this.cInvName);//获取拼音
                    this.baozhuang_num = '';//包装数量
                    this.order_nums = '';//订货数量
                    if (_this.data.typelist[this.cInvCode]) {
                        this.goods_type = _this.data.typelist[this.cInvCode].type_name;//该物品分类
                        this.goods_type_index = tmpType[this.goods_type].index;//该物品分类的索引
                        _this.data.type[this.goods_type].nums++;//该分类总数加1
                    }
                    arr[this.cInvCode] = this;//按物品编码索引
                });
                this.data.list = arr;
            }
            this.data.order_type = this.order_type;
            this.data.onlyhas = this.onlyhas;//只看已订
            this.data.current_type = this.current_type;//当前所在分类
            this.data.stores = my.stores;
            this.data.adddate = new Date().format('yyyy-MM-dd');
            this.data.current_store_id = this.store_id || my.user.info.store_id;//当前所在门店
        },
        bindEvent: function () {
            var _this = this;
            //切换订单类别
            $("#order_type").bind('change', function () {
                var order_type = $(this).val();
                _this.order_type = order_type;
                $("#bag").hide();
                $("#vendor").hide();
                $("#store").hide();
                if (order_type == 1) {
                    $("#bag").show();
                } else if (order_type == 2) {
                    $("#vendor").show();
                } else {
                    $("#store").show();
                }
            });
            $("#bag select").bind('change', function () {//切换仓库
                _this.bagid = $(this).val();
            });
            $("#vendor select").bind('change', function () {//切换供应商
                _this.vendorid = $(this).val();
            });
            $("#store select").bind('change', function () {//切换调入门店
                _this.storeid = $(this).val();
            });
            $("#view_by_type a").click(function () {//切换分类
                var type = $(this).data('type');
                $("#view_by_type .order_type").removeClass('order_type');
                $(this).addClass('order_type');
                _this.current_type = type;
                _this.showGoodsListByType(_this.current_type);
            });
            $("#onlyhas").click(function () {//只看已定
                if ($(this).attr('checked')) {
                    _this.onlyhas = true;
                } else {
                    _this.onlyhas = false;
                }
                _this.data.onlyhas = _this.onlyhas;
                _this.showGoodsListByType(_this.current_type);
            });
            //清空已选
            $("#clearhas").click(function () {
                $.each(_this.data.list, function () {
                    this.baozhuang_num = '';
                    this.order_nums = '';
                    if (this.goods_type == '临时增加') {
                        this.goods_type = '';
                        this.goods_type_index = '';
                    }
                });
                _this.showGoodsListByType(_this.current_type);
            });
            $("#submit_order").click(function () {//提交订单
                var adddate = $("#adddate").val();
                var arr = [];
                $.each(_this.data.list, function () {
                    if (this.order_nums>0) arr.push(this);
                });
                if ($.isEmptyObject(arr)) return my.view.message('请至少选择一种物品！');
                if(!adddate) return my.view.message('请选择盘点日期！');
                my.pandian = {
                    list: arr,//已订列表
                    all:_this.data.list,//所有物品列表
                    type: _this.data.type,//分类列表
                    store_id: _this.data.current_store_id,
                    store_name: my.stores[_this.data.current_store_id].store_name,
                    current_store_id: _this.data.current_store_id,//当前所在门店
                    adddate: adddate//
                };
                my.view.showTable('store_bag_confirm');
            });
            _this.showGoodsListByType(_this.current_type);//显示默认列表
        },
        //显示分类所有物品
        showGoodsListByType: function (type) {
            var res = '<tr><th width="100">编码</th><th class="txtleft">名称</th><th width="120">规格</th><th width="80">盘点数量</th><th width="70">单位</th></tr>';
            var _this = this;
            $("#set_order_type_list tr").each(function (i) {
                if (i < 2) return true;
                $(this).remove();
            });
            var i = 1;
            var container = document.createDocumentFragment();
            $.each(this.data.list, function () {
                if (!type && !this.goods_type) return true;
                if (type && this.goods_type != type) return true;
                if (_this.data.onlyhas) {//只看已经订货的物品
                    if (!this.order_nums) return true;
                }
                var tr = document.createElement('tr');
                var tmp = this;
                tr.appendChild(_this.th(this.cInvCode));
                tr.appendChild(_this.td(this.cInvName, 'txtleft'));
                tr.appendChild(_this.td(this.cInvStd));
                this.order_nums = this.order_nums ? this.order_nums : '';
                tr.appendChild(_this.td('<input type="text" name="order_nums" class="input4" value="' + this.order_nums + '">'));

                tr.appendChild(_this.td(this.cInvUnit));
                container.appendChild(tr);
                $('input', tr).bind('keyup', function () {//输入数量
                    var nums;
                    nums = parseFloat($(this).val());
                    if (isNaN(nums)) nums = 0;
                    tmp.order_nums = nums;
                });
            });
            if (type == '临时增加') {
                var tr = document.createElement('tr');
                $(tr).append('<th colspan="5" height="36"><a class="submit_order">增加一个临时物品</a></th>');
                $(container).append(tr);
                $('.submit_order', tr).click(function () {//临时增加
                    _this.addTmp();
                });
            }
            $("#set_order_type_list").append(res).append(container);
            //选中变色
            $("#set_order_type_list tr").bind('mouseover', function () {//表格选中行变色
                $('td', this).css('background-color', '#D3F0F1');
            });
            $("#set_order_type_list tr").bind('mouseout', function () {//表格选中行变色
                $('td', this).css('background-color', '#fff');
            });
        },
        //添加一个物品到临时分类
        addTmp: function () {
            var _this = this;
            my.goods.getOne(_this.data.list, function (id) {
                _this.data.list[id].goods_type = '临时增加';
                _this.data.list[id].goods_type_index = _this.data.type['临时增加'].index;
                _this.showGoodsListByType(_this.current_type);
            });
        },
        td: function (str,classname) {
            var tmp = document.createElement('td');
            if (classname) tmp.className = classname;
            tmp.innerHTML = str;
            return tmp;
        },
        th: function (str) {
            var tmp = document.createElement('th');
            tmp.innerHTML = str;
            return tmp;
        }
    };
    my.extend(a, prop);
    my.moudle.store_bag_day = a;
})();