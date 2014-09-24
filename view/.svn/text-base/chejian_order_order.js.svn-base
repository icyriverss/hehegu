
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'order->getGoodsTypeList',
        template_url: 'view/chejian_order_order.html',
        title: '申请订货',
        selection: 'tr table tr',//无需选中
        perpage: 10,
        order_type: 1,//默认订单类别
        bagid: '',//仓库id
        vendorid: '',//供应商id
        storeid: '',//门店id
        order_date:'',//订货日期
        current_quick: '查看历史订单',
        quick: { '查看历史订单': 'chejian_order_list' },
        onlyhas: false,//只看已定
        output: 0,
        data:{
            current_type:null//当前所在分类类型
        },
        init: function () {
            if (my.user.info.bumen != '加工中心' && !this.chejian_id) this.chejian_id = getOneChejian_ID();
            this.arges = {
                order_type: this.order_type,
                bagid: this.bagid,
                isstore:2
            }
            if (!this.order_date) this.order_date = new Date().format('yyyy-MM-dd');
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
                }
            });
            //原有分类中，增加临时分类
            tmpType['临时增加'] = { nums: 0, index: 999999 };
            this.data.type = tmpType;
            //初始化列表
            if (!$.isEmptyObject(my.zongbu)) {//历史缓存的订单记录
                this.data.list = my.zongbu.all;
            } else {
                var arr = {};
                $.each(this.data.list, function () {
                    if (isCP(this.cInvCCode)) return true;//成品
                    if (isTH) {//田和
                        this.th = 1;
                    } else if (isKL) {//可乐
                        this.kl = 1;
                    } else if (isSL) {//生力
                        this.sl = 1;
                    }
                    if (_this.data.typelist[this.cInvCode]) {//计算某类物品总数
                        this.goods_type = _this.data.typelist[this.cInvCode].type_name;//该物品分类
                        if (this.goods_type == '隐藏') return true;
                        this.goods_type_index = tmpType[this.goods_type].index;//该物品分类的索引
                        _this.data.type[this.goods_type].nums++;//该分类总数加1
                    }
                    this.py = makePy(this.cInvName);//获取拼音
                    this.order_nums = '';//订货数量
                    arr[this.cInvCode] = this;//按物品编码索引
                });
                this.data.list = arr;
            }
            if (this.data.type['隐藏']) delete this.data.type['隐藏'];
            this.data.order_type = this.order_type;//订单类别
            this.data.onlyhas = this.onlyhas;//只看已订
            this.data.current_type = this.current_type;//当前所在分类
            this.data.stores = my.stores;//分店们
            this.data.current_chejian_id = this.chejian_id || my.user.info.chejian_id;//当前所在门店
            this.data.order_date = this.order_date;//订货日期
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
                    this.order_nums = '';
                    if (this.goods_type == '临时增加') {
                        this.goods_type = '';
                        this.goods_type_index = '';
                    }
                });
                _this.showGoodsListByType(_this.current_type);
            });
            //提交订单
            $("#submit_order").click(function () {
                var arr = [];
                $.each(_this.data.list, function () {
                    if (this.order_nums>0) arr.push(this);
                });
                if ($.isEmptyObject(arr)) return my.view.message('请至少选择一种物品！');
                var order_date = $("#order_date").val();
                if (!order_date) return my.view.message('请选择订货日期！');
                _this.order_date = order_date;
                my.zongbu = {
                    list: arr,//已订列表
                    all:_this.data.list,//所有物品列表
                    type: _this.data.type,//分类列表
                    current_chejian_id: _this.data.current_chejian_id,//当前所在门店
                    order_type: $("#order_type").val(),//订单类别
                    order_name: $("#order_type").find("option:selected").text(),//订单名称
                    bagid: $("#bag select").val(),//仓库id
                    bagname: $("#bag select").find("option:selected").text(),//仓库名称
                    vendorid: $("#vendor select").val(),//供应商id
                    vendorname: $("#vendor select").find("option:selected").text(),//供应商名称
                    storeid: $("#store select").val(),//调入门店id
                    storename: $("#store select").find("option:selected").text(),//调入门店id
                    order_date:order_date
                };
                my.view.showTable('chejian_order_confirm');
            });
            _this.showGoodsListByType(_this.current_type);//显示默认列表
        },
        //显示分类所有物品
        showGoodsListByType: function (type) {
            var res = '<tr><th width="100">编码</th><th class="txtleft">名称</th><th width="120">规格</th><th width="80">订货数量</th><th width="70">单位</th></tr>';
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
                tr.appendChild(_this.td(this.cInvName,'txtleft'));
                tr.appendChild(_this.td(this.cInvStd));
                this.order_nums = this.order_nums?this.order_nums:'';
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
    my.moudle.chejian_order_order = a;
})();