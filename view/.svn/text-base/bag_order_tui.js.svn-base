
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'order->getGoodsTypeList',
        template_url: 'view/bag_order_tui.html',
        title: '退库出库单',
        selection: 'tr table tr',//无需选中
        perpage: 10,
        order_type: 1,//默认订单类别
        bagid: '',//仓库id
        vendorid: '',//供应商id
        storeid:'',//门店id
        current_quick: '历史记录',
        quick: { '历史记录': 'bag_order_listbu' },
        onlyhas: false,//只看已定
        output: 0,
        data:{
            current_type:null//当前所在分类类型
        },
        init: function () {
            this.arges = {
                order_type: this.order_type,
                bagid: this.bagid
            }
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
            tmpType['临时增加'] = { nums: 0, index: 999999 };
            this.data.type = tmpType;
            //初始化列表
            var arr = {};
            var bhistory = !$.isEmptyObject(my.baosun);
            $.each(this.data.list, function () {
                if (isCP(this.cInvCCode)) return true;
                this.py = makePy(this.cInvName);//获取拼音
                this.baosun_yuanyin = '';
                this.baosun_num = '';
                arr[this.cInvCode] = this;//按物品编码索引
                if (!bhistory) return true;
                //历史缓存的订单记录
                if (!my.bufa.list[this.cInvCode]) return true;
                this.baosun_yuanyin = my.baosun.list[this.cInvCode].baosun_yuanyin ;
                this.baosun_num = my.baosun.list[this.cInvCode].baosun_num;
                this.goods_type = '临时增加';
            });
            this.data.list = arr;
            if (bhistory) {
                this.data.adddate = my.baosun.adddate;
            } else {
                this.data.adddate = new Date().format('yyyy-MM-dd');
            }
        },
        bindEvent: function () {
            var _this = this;
            $("#submit_order").click(function () {//提交订单
                var adddate = $("#adddate").val();
                var arr = {};
                $("#set_order_type_list tr").each(function () {
                    var id = $(this).data('id');
                    if (!id) return true;
                    var baosun_num = parseFloat($('input[name="order_nums"]', this).val());
                    if (baosun_num > 0) {
                        var tmparr = {};
                        tmparr.baosun_num = baosun_num;
                        tmparr.name = _this.data.list[id].cInvName;
                        tmparr.bianhao = _this.data.list[id].cInvCode;
                        tmparr.guige = _this.data.list[id].cInvStd;
                        tmparr.kucun_danwei = _this.data.list[id].cInvUnit;
                        arr[id] = tmparr;
                    }
                });
                if ($.isEmptyObject(arr)) return my.view.message('请至少选择一种物品！');
                if(!adddate) return my.view.message('请选择报损日期！');
                my.tuiku = {
                    list: arr,//已订列表
                    adddate: adddate//
                };
                my.view.showTable('bag_order_confirm_tui');
            });
            _this.showGoodsListByType('临时增加');//显示默认列表
        },
        //显示分类所有物品
        showGoodsListByType: function (type) {
            var res = '<tr><th width="100">编码</th><th class="txtleft">名称</th><th width="120">规格</th><th width="70">单位</th><th width="80">数量</th></tr>';
            var _this = this;
            $("#set_order_type_list tr").each(function (i) {
                if (i < 1) return true;
                $(this).remove();
            });
            var i = 1;
            var container = document.createDocumentFragment();
            $.each(this.data.list, function () {
                if (!type && !this.goods_type) return true;
                if (type && this.goods_type != type) return true;
                var tr = document.createElement('tr');
                var tmp = this;
                tr.setAttribute('data-id', this.cInvCode);
                tr.appendChild(_this.th(this.cInvCode));
                tr.appendChild(_this.td(this.cInvName, 'txtleft'));
                tr.appendChild(_this.td(this.cInvStd));
                tr.appendChild(_this.td(this.cInvUnit));
                this.baosun_num = this.baosun_num ? this.baosun_num : '';
                tr.appendChild(_this.td('<input type="text" name="order_nums" class="input4" value="' + this.baosun_num + '">'));
                container.appendChild(tr);
                $('input[name="order_nums"]', tr).bind('keyup', function () {//输入数量
                    var nums;
                    nums = parseFloat($(this).val());
                    if (isNaN(nums)) nums = 0;
                    tmp.baosun_num = nums;
                });
                $('select[name="baosun_yuanyin"]', tr).bind('change', function () {//输入数量
                    var yuanyin = $(this).val();
                    tmp.baosun_yuanyin = yuanyin;
                });
            });
            if (type == '临时增加') {
                var tr = document.createElement('tr');
                $(tr).append('<th colspan="6" height="36"><a class="submit_order">添加物品</a></th>');
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
                _this.showGoodsListByType('临时增加');
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
    my.moudle.bag_order_tui = a;
})();