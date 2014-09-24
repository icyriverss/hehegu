//订单状态配置
my.orderStatus = {
    1: '<font color=red>等待发货</font>',
    2: '<font color=red>等待确认收货</font>',
    3: '<font color=blue>等待收货审核</font>',
    4:'<font color=blue>等待审核</font>',
    0: '<font color=green>已结束</font>'
};
//物品处理类
my.goods = {
    div: null,//窗体dom
    goodsList: [],//物品列表数组
    searchResult: [],//搜索结果缓存
    perpage: 10,//每页条数
    quick_search:true,//快速搜索
    //获取一条记录，返回物品编码
    getOne:function(arr,cb){
        this.showList(arr, cb);
    },
    setEvent: function (cb) {
        //选择
        var _this = this;
        $(".submit_order", this.div).click(function () {
            if (cb && typeof cb == 'function') {
                cb($(this).data('id'));
            }
            _this.hide();
        });
    },
    //显示物品列表，弹窗形式
    showList: function (arr, cb) {
        this.goodsList = arr;
        this.searchResult = arr;
        var _this = this;
        var div = document.createElement('div');
        var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
        var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
        var left = (maxwidth - 900) / 2;
        var top = (maxheight - 500) / 2;
        this.bg = document.createElement('div');
        this.bg.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:" + maxheight + "px;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;background:#000;z-index:10;";


        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";
        $(div).append('<table border="0" cellspacing="0" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist"><tr>\
                    <th colspan="5" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>添加物品</b> &nbsp;&nbsp;&nbsp;&nbsp;\
                        <input type="checkbox" id="quick_search" checked> 快速查询  \
                        <a class="ico tips"><div class="tips_content" style="width:300px;"><div class="tips_arrow">◆</div>\
                            支持按\
                            <b><font color="red">食材编码</font></b>、\
                            <b><font color="red">名称</font></b>、\
                            <b><font color="red">名称拼音首字母</font></b>搜索。<br>\
                            支持多关键词搜索，关键词之间以空格分开。如搜索 <b><font color="red">010 肥牛 GL</font></b> ，即可搜索到 <b><font color="red">咖喱（加肥牛）</font></b><br>\
                            选中快速查询后，可即输即查，无需点击 <b><font color="red">查询</font></b> 按钮。<br>\
                            如电脑配置较低，出现卡机情况，请去掉“快速查询”勾选，输入关键词后，点击“查询”按钮进行搜索。\
                         </div></a>\
                        关键词：<input type="text" id="keyword" class="input3"> \
                        <a  class="city_submit" id="search_start">查询</a>\
                        </span><span style="float:right"><a class="close">关闭</a></span>    \
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">编码</th>\
                    <th>名称</th>\
                    <th width="120">规格</th>\
                    <th width="70">单位</th>\
                    <th width="80">操作</th>\
                </tr></table>');
        $(document.body).append(div);
        this.div = div;
        $("#keyword", div).bind('keyup', function () {//实时搜索
            if (!$("#quick_search", div).attr('checked')) return;
            _this.search($(this).val().trim(),cb);
        });
        $("#search_start", div).bind('click', function () {//点击搜索
            _this.search($("#keyword").val().trim(), cb);
        });
        $("#quick_search").click(function () {//切换实时搜索
            if ($(this).attr('checked')) {
                _this.quick_search = true;
            } else {
                _this.quick_search = false;
            }
        });
        $(".tips",div).unbind().bind('mouseover click', function () {//小提示
            $("div", this).stop().show();
        });
        $(".tips", div).bind('mouseout', function () {//小提示
            $("div", this).stop().hide();
        });

        $(".close", div).click(function () { _this.hide(); });
        $(div).fadeIn();

        $(document.body).append(this.bg);
        $(this.bg).bind('click', function () { _this.hide(); });

        this.search('', cb);
    },
    //隐藏物品列表
    hide: function () {
        $(this.div).remove();
        $(this.bg).hide();
    },
    //智能搜索
    search:function(key,cb){
        var arrkey = key.split(' ');
        var res;
        var tmparr = this.goodsList;
        var _this = this;
        $.each(arrkey, function () {//支持多重条件搜索
            key = this;
            if (!key) return true;//为空则跳过
            res = [];//检索结果
            var keytype = _this.getKeyType(key);//搜索类型
            $.each(tmparr, function () {
                if (this.goods_type) return true;//隐藏已有分类的结果
                if (keytype == 1) {//数字查询
                    if (this.cInvCode.toString().indexOf(key.toString()) > -1) {
                        res.push(this);
                    }
                } else if (keytype == 2) {//拼音
                    var tmpThis = this;
                    $.each(this.py, function () {
                        if (this.indexOf(key.toUpperCase().toString()) > -1) {
                            res.push(tmpThis);
                            return false;//避免多音重复
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
        this.insertTable(res,1,cb);
    },
    //获取关键词类型，数字返回1，拼音返回2，字符返回3
    getKeyType: function (key) {
        if (!isNaN(key)) return 1;
        var patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
        return !patrn.exec(key)?2:3;
    },
    //将搜索结果插入到表格，page参数为分页使用，默认为1
    insertTable: function (arr, page,cb) {
        var _this = this;
        var perpage = this.perpage;//每页显示条数
        //计算分页
        if (!page) page = 1;
        var total_page = Math.ceil(arr.length / perpage);
        if (page < 1) page = 1;
        if (page > total_page) page = total_page;
        //清空表格
        $("tr",this.div).each(function (i) {
            if (i < 2) return true;
            $(this).remove();
        });
        //生成tr
        var container = document.createDocumentFragment();
        for (var i = 1; i <= perpage; i++) {
            var tr = document.createElement('tr');
            if (arr[(page - 1) * perpage + i - 1]) {
                var tmp = arr[(page - 1) * perpage + i - 1];
            }else{
                tmp = {cInvCode:'--'};
            }
            tr.appendChild(this.th(tmp.cInvCode));
            tr.appendChild(this.td(tmp.cInvName));
            tr.appendChild(this.td(tmp.cInvStd));
            tr.appendChild(this.td(tmp.cInvUnit));
            tmp.baozhuang_num = tmp.baozhuang_num ? tmp.baozhuang_num : '';
            tmp.order_nums = tmp.order_nums ? tmp.order_nums : '';

            if (tmp.goods_type) {
                tr.appendChild(_this.td(tmp.goods_type));
            } else {
                if (tmp.cInvCode == '--') {
                    tr.appendChild(_this.td(tmp.cInvCode));
                } else {
                    tr.appendChild(_this.td('<a  class="submit_order" data-code="' + tmp.cInvCode + '" data-id="' + tmp.cInvCode + '">选择</a>'));
                }
            }
            
            container.appendChild(tr);
        }
        $("table",this.div).append(container);//插入搜索结果
        //处理翻页html
        var str = '<tr class="showpage"><th colspan="5">';
        str += '<a data-page="1">首页</a>';
        str += '<a data-page="' + (page - 1) + '">上一页</a>';
        str += '<a data-page="' + (page + 1) + '">下一页</a>';
        str += '<a data-page="' + (total_page) + '">尾页</a>';
        str += '共有' + arr.length + '条记录&nbsp;&nbsp;&nbsp;&nbsp;当前第' + page + '页/' + total_page + '页&nbsp;&nbsp;&nbsp;&nbsp;';
        str += '每页显示<input type="text" style="width:30px;" id="perpage" value="' + perpage + '">条记录';

        $("table", this.div).append(str);
        this.setEvent(cb);
        //分页
        $(".showpage a",this.div).click(function () {
            var tmppage = $(this).data('page');
            _this.insertTable(_this.searchResult, tmppage,cb);
        });
        //切换分页数
        $("#perpage", this.div).bind('change', function () {
            var perpage = parseInt($(this).val());
            if (!perpage) perpage = 10;
            if (perpage < 1) perpage = 1;
            if (perpage > 100) perpage = 100;
            _this.perpage = perpage;
            _this.insertTable(_this.searchResult,page, cb);
        });
        //选中变色
        $("table tr", this.div).bind('mouseover', function () {//表格选中行变色
            $('td', this).css('background-color', '#D3F0F1');
        });
        $("table tr", this.div).bind('mouseout', function () {//表格选中行变色
            $('td', this).css('background-color', '#fff');
        });
    },
    td: function (str,cfg) {
        var tmp = document.createElement('td');
        if (!cfg) cfg = {};
        var classname = cfg.classname;
        var colspan = cfg.colspan;
        if (classname) tmp.className = classname;
        if (colspan) tmp.colSpan = colspan;
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    },
    th: function (str) {
        var tmp = document.createElement('th');
        if (!str) str = '&nbsp;';
        tmp.innerHTML = str;
        return tmp;
    }
}