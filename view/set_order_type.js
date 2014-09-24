my.moudle = my.moudle || {};
(function(){
    var a = new my.table();
    var prop = {
        year: '',//所属年份
        month: '',//所属月份
        method: 'order->getGoodsTypeList',
        template_url: 'view/set_order_type.html',
        title: '订货分类管理',
        selection: 'tr table tr',//无需选中
        perpage: 10,
        output:0,
        quick_search:true,
        init: function () {
            this.arges = {
                isstore:1
            };
        },
        //切换分类
        changeType:function(type){
            this.data.current_type = this.current_quick = type;
            my.view.freshTable('set_order_type');
        },
        initData: function (data) {
            var _this = this;
            this.data = data;
            //初始化搜索设置
            this.data.quick_search = this.quick_search;
            //初始化分类
            var tmparr = {};
            $.each(this.data.type, function () {
                tmparr[this.type_name] = 0;
            });
            this.data.type = tmparr;
            this.quick = {};
            if (!$.isEmptyObject(this.data.type)) {
                $.each(this.data.type, function (type_name) {
                    if (!type_name) return true;
                    if (!_this.current_quick) _this.current_quick = type_name;//默认显示第一个分类
                    _this.quick[type_name] = function () { _this.changeType(type_name);};
                });
            }
            this.data.current_type = this.current_quick;
            //初始化列表
            var tmparr = [];
            $.each(this.data.list, function () {
                if (isCP(this.cInvCCode)) return true;
                this.py = makePy(this.cInvName);
                if (_this.data.typelist[this.cInvCode]) {
                    this.goods_type = _this.data.typelist[this.cInvCode].type_name;
                    this.showorder  = _this.data.typelist[this.cInvCode].showorder;
                    _this.data.type[this.goods_type]++;
                }
                tmparr.push(this);
            });
            this.data.list = tmparr;
            this.searchResult = this.data.list;
        },
        bindEvent: function () {
            var _this = this;
            $("#keyword").bind('keyup', function () {//实时搜索
                if (!$("#quick_search").attr('checked')) return;
                _this.search($(this).val().trim());
            });
            $("#search_start").bind('click', function () {//点击搜索
                _this.search($("#keyword").val().trim());
            });
            $("#quick_search").click(function () {//切换实时搜索
                if ($(this).attr('checked')) {
                    _this.quick_search = true;
                } else {
                    _this.quick_search = false;
                }
            });
            $("#addtype").click(function () { _this.addType(); });
            $("#edittype").click(function () { _this.editType(); });
            $("#deltype").click(function () { _this.delType(); });
            $("#showall").click(function () {
                if ($(this).html() == '展开') {
                    if (_this.data.type[_this.current_quick] == 0) return my.view.message('该分类下暂无数据！');
                    $(this).html('收起');
                    _this.showGoodsListByType(_this.current_quick);
                } else {
                    $("#set_order_type_list tr").each(function (i) {
                        if (i < 1) return true;
                        $(this).remove();
                    });
                    $(this).html('展开');
                }
            });
            //初始化表格
            _this.showGoodsListByType(_this.current_quick);
            this.insertTable(this.data.list);
        },
        //显示分类所有物品
        showGoodsListByType:function(type){
            var res = '<tr><th width="100">编码</th><th>名称</th><th width="120">规格</th><th width="70">库存单位</th><th width="70">包装单位</th><th width="80">包装换算率</th><th width="80">定额换算率</th><th width=70>排序</th><th width="100">操作</th></tr>';
            var _this = this;
            $("#set_order_type_list tr").each(function (i) {
                if (i < 1) return true;
                $(this).remove();
            });
            var i = 1;
            var container = document.createDocumentFragment();
            var tmplist=[];
            $.each(this.data.list, function () {
                if (this.goods_type != type) return true;
                tmplist.push(this);
            });
            tmplist.sort(function(x,y){
                return x.showorder-y.showorder;
            });
            $.each(tmplist,function(){
                var tr = document.createElement('tr');
                tr.appendChild(_this.th(this.cInvCode));
                tr.appendChild(_this.td(this.cInvName));
                tr.appendChild(_this.td(this.cInvStd));
                tr.appendChild(_this.td(this.cInvUnit));
                tr.appendChild(_this.td(this.iBzUnit));
                tr.appendChild(_this.td(this.iBzHsl));
                tr.appendChild(_this.td(this.iDeHsl));
                tr.appendChild(_this.td('<input type="text" class="input4" value="'+this.showorder+'"/>'));
                tr.appendChild(_this.td('<a class="submit_order"  data-id="' + this.cInvCode + '">移除</a>'));
                container.appendChild(tr);
                var tmpGood = this;
                $("input",tr).bind("change",function(){
                    var showorder = $(this).val();
                    $(document.body).unbind().bind('click',function(){
                        $(document.body).unbind();
                        my.view.load(1);
                        my.util.send('order->changeGoodsOrder',{id:tmpGood.cInvCode,isstore:1,showorder:showorder},function(){
                            my.view.load(0);
                            $.each(_this.data.list,function(){
                                if(this.cInvCode==tmpGood.cInvCode){
                                    this.showorder = showorder;
                                    return false;
                                }
                            });
                            _this.showGoodsListByType(_this.current_quick);
                        });
                    });
                });
            })
            $("#set_order_type_list").append(res).append(container);
            //选中变色
            $("#set_order_type_list tr").bind('mouseover', function () {//表格选中行变色
                $('td', this).css('background-color', '#D3F0F1');
            });
            $("#set_order_type_list tr").bind('mouseout', function () {//表格选中行变色
                $('td', this).css('background-color', '#fff');
            });
            $("#set_order_type_list tr .submit_order").click(function () {
                var id = $(this).data('id');
                if (!id) return;
                var tmpobj = this;
                my.view.load(1);
                my.util.send('order->removeType', { id: id, type: _this.current_quick,isstore:1 }, function (data) {
                    my.view.load(0);
                    $(tmpobj).parent().parent().remove();
                    $.each(_this.data.list, function () {
                        if (this.cInvCode == id) {
                            this.goods_type = '';
                            return false;
                        }
                    });
                    _this.insertTable(_this.data.list);
                    _this.data.type[_this.current_quick]--;
                    $("#type_name").html(_this.current_quick + '(' + _this.data.type[_this.current_quick] + ')');
                });
            });
        },
        //加入分类
        addToType:function(id){
            
        },
        //新增分类
        addType: function () {
            var type_name = $("#newtype").val();
            if (!type_name) return my.view.message('请输入新分类名称！');
            my.view.load(1);
            my.util.send('order->addType', { name: type_name, isstore: 1 }, function (data) {
                if (data.status == 1) return my.view.message('已存在该分类名称！');
                my.view.message('新增分类成功！', 1, function () {
                    my.view.showTable('set_order_type');
                });
            });
        },
        //修改分类名称
        editType: function () {
            var _this = this;
            if ($("#edit_submit").length > 0) {
                $("#type_name").html(this.current_quick+'('+this.data.type[this.current_quick]+')');
                return;
            }
            var old_type_name = this.current_quick;
            var res = '<input type="text" class="input3" value="' + old_type_name + '" id="edit_new_name" style="width:100px;height:20px !important;line-height:20px !important;height:16px;line-height:16px;"> <a class="city_submit" id="edit_submit">修改</a>';
            $("#type_name").html(res);
            $("#edit_submit").click(function () {
                var new_type_name = $("#edit_new_name").val();
                if (!new_type_name) return my.view.message('请输入新分类名称！');
                my.view.load(1);
                my.util.send('order->editType', {
                    name: old_type_name,
                    newname: new_type_name,
                    isstore: 1
                }, function (data) {
                    if (data.status == 1) return my.view.message('已存在新分类名称！');
                    my.view.message('修改分类成功！', 1, function () {
                        _this.current_quick = new_type_name;//清空
                        my.view.showTable('set_order_type');
                    });
                });
            });
        },
        //删除分类
        delType: function () {
            var _this = this;
            if (confirm('确定要删除该分类吗？一旦删除将不能恢复！')) {
                my.view.load(1);
                my.util.send('order->delType', {
                    name: this.current_quick, isstore: 1
                }, function (data) {
                    _this.current_quick = null;//清空
                     my.view.showTable('set_order_type');
                });
            }
        },
        search: function (key) {
            var arrkey = key.split(' ');
            var res;
            var tmparr = this.data.list;
            var _this = this;
            $.each(arrkey, function () {//支持多重条件搜索
                key = this;
                if (!key) return true;//为空则跳过
                res = [];//检索结果
                var keytype = _this.getKeyType(key);//搜索类型
                $.each(tmparr, function () {
                    if (keytype == 1) {//数字查询
                        if (this.cInvCode.toString().indexOf(key.toString()) > -1) {
                            res.push(this);
                        }
                    } else if (keytype == 2) {//拼音
                        var tmpThis = this;
                        $.each(this.py, function () {
                            if (this.indexOf(key.toUpperCase().toString()) > -1) {
                                res.push(tmpThis);
                            }
                        });
                    } else if (keytype == 3) {//中文
                        if (this.cInvName.toString().indexOf(key.toString()) > -1) {
                            res.push(this);
                        }
                    }
                });
                tmparr = res;
            });
            this.searchResult = res;//缓存搜索结果，提供翻页使用
            this.insertTable(res);
        },
        //将搜索结果插入到表格，page参数为分页使用，默认为1
        insertTable: function (arr, page) {
            var _this = this;
            var perpage = this.perpage;//每页显示条数
            //计算分页
            if (!page) page = 1;
            var total_page = Math.ceil(arr.length / perpage);
            if (page < 1) page = 1;
            if (page > total_page) page = total_page;

            //清空表格
            $("#pro_list tr").each(function (i) {
                if (i < 2) return true;
                $(this).remove();
            });
            //生成tr
            var container = document.createDocumentFragment();
            for (var i = 1; i <= perpage; i++) {
                if (!arr[(page -1) * perpage +  i - 1]) break;
                var tmp = arr[(page - 1) * perpage + i - 1];
                var tr = document.createElement('tr');
                tr.appendChild(this.th(tmp.cInvCode));
                tr.appendChild(this.td(tmp.cInvName));
                tr.appendChild(this.td(tmp.cInvStd));
                tr.appendChild(this.td(tmp.cInvUnit));
                tr.appendChild(this.td(tmp.iBzUnit));
                tr.appendChild(this.td(tmp.iBzHsl));
                tr.appendChild(this.td(tmp.iDeHsl));
                if (_this.data.type[tmp.goods_type]) {
                    tr.appendChild(this.th(tmp.goods_type));
                } else {
                    tr.appendChild(this.th('<a class="submit_order" data-code="' + tmp.cInvCode + '" data-id="' + tmp.cInvCode + '">加入</a>'));
                }
                container.appendChild(tr);
            }
            $("#pro_list").append(container);//插入搜索结果
            //处理翻页html
            var str = '<tr class="showpage"><th colspan="8">';
            str += '<a data-page="1">首页</a>';
            str += '<a data-page="' + (page - 1) + '">上一页</a>';
            str += '<a data-page="' + (page + 1) + '">下一页</a>';
            str += '<a data-page="' + (total_page) + '">尾页</a>';
            str += '共有' + arr.length + '条记录&nbsp;&nbsp;&nbsp;&nbsp;当前第' + page + '页/' + total_page + '页&nbsp;&nbsp;&nbsp;&nbsp;';
            str += '每页显示<input type="text" style="width:30px;" id="perpage" value="'+perpage+'">条记录';

            $("#pro_list").append(str);
            $("#pro_list .showpage a").click(function () {
                var tmppage = $(this).data('page');
                _this.insertTable(_this.searchResult,tmppage);
            });
            $("#perpage").bind('change', function () {
                var perpage = parseInt($(this).val());
                if (!perpage) perpage = 10;
                if (perpage < 1) perpage = 1;
                if (perpage > 100) perpage = 100;
                _this.perpage = perpage;
                _this.insertTable(_this.searchResult);
            });

            //选中变色
            $("#pro_list tr").bind('mouseover', function () {//表格选中行变色
                $('td', this).css('background-color', '#D3F0F1');
            });
            $("#pro_list tr").bind('mouseout', function () {//表格选中行变色
                $('td', this).css('background-color', '#fff');
            });

            //添加至分类
            $("#pro_list .submit_order").click(function () {
                var id = $(this).data('id');
                var tmpobj = this;
                my.view.load(1);
                my.util.send('order->addToType', { id: id, type: _this.current_quick, isstore: 1 }, function (data) {
                    if (data.status == 1) return my.view.message('该物品已加入分类！');
                    my.view.load(0);
                    $(tmpobj).parent().html(_this.current_quick);
                    $.each(_this.data.list, function () {//更新本地缓存
                        if (this.cInvCode == id) {
                            this.goods_type = _this.current_quick;
                            this.showorder = data.showorder;
                            return false;
                        }
                    });
                    _this.data.type[_this.current_quick]++;
                    if ($("#showall").html() == '收起') {//添加至列表
                        _this.showGoodsListByType(_this.current_quick);
                    }
                    $("#type_name").html(_this.current_quick + '('+_this.data.type[_this.current_quick]+')');
                });
            });
        },
        td: function (str) {
            var tmp = document.createElement('td');
            tmp.innerHTML = str;
            return tmp;
        },
        th: function (str) {
            var tmp = document.createElement('th');
            tmp.innerHTML = str;
            return tmp;
        },
        //获取关键词类型，数字返回1，拼音返回2，字符返回3
        getKeyType: function (key) {
            if (!isNaN(key)) return 1;
            var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi; 
            if(!patrn.exec(key)){ 
                return 2; 
            }else{ 
                return 3; 
            } 
        }
    };
    my.extend(a, prop);
    my.moudle.set_order_type = a;
})();