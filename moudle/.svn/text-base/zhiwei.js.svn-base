
//物品处理类
my.zhiwei = {
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
    show: function (info) {
        var _this = this;
        this.info = info;
        
        var div = document.createElement('div');
        var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
        var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
        var left = (maxwidth - 900) / 2;
        var top = (maxheight - 500) / 2;
        this.bg = document.createElement('div');
        this.bg.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:" + maxheight + "px;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;background:#000;z-index:10;";


        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";
        $(div).append('<table border="0" cellspacing="0" id="goods_list" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist" style="line-height:24px;"><tr>\
                    <th colspan="6" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>岗位管理</b> &nbsp;&nbsp;&nbsp;&nbsp;当前部门：<b>' + info.department + '</b> &nbsp;&nbsp;&nbsp;&nbsp;</span><input type="text" style="width:150px;" name="new_job"><a class="city_submit" id="addnew">新增岗位</a>\
                        <span style="float:right"><a class="close">关闭</a></span>\
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">ID</th>\
                    <th class="txtleft">岗位</th>\
                    <th width="120">编制</th>\
                    <th width="70">岗位工资</th>\
                    <th width="100">岗位级别</th>\
                    <th width="150">操作</th>\
                </tr><tr><th colspan="6">正在获取岗位信息，请稍候……</th></tr></table>');
        $(document.body).append(this.bg);
        $(document.body).append(div);
        this.div = div;
        $(this.bg).bind('click', function () { _this.hide(); });
        $(".close", div).click(function () { _this.hide(); });
        $("#addnew").click(function () {
            var name = $("input[name='new_job']", div).val();
            if (!name) return my.view.message('请输入新岗位名称！');
            my.view.load(1);
            var arges = _this.getArges();
            arges['job'] = name;
            my.util.send('personnel->add_job',arges, function (data) {
                if (data.status !== 0) return my.view.message('新增岗位失败！');
                my.view.message('新增岗位成功！', 1, function () {
                    $("input[name='new_job']", div).val('');
                    _this.fresh();
                });
            });
        });
        this.fresh();
        $(div).fadeIn();
    },
    //获取请求的参数。 门店、仓库、车间没有部门ID，所以需要单独处理
    getArges:function(){
        var arges = {};
        if (this.info.type == 'store') {
            arges['store_id'] = this.info.id;
        } else if (this.info.type == 'bag') {
            arges['bag_id'] = this.info.id;
        } else if (this.info.type == 'chejian') {
            arges['chejian_id'] = this.info.id;
        } else {
            arges['department_id'] = this.info.id;
        }
        return arges;
    },
    fresh: function () {
        var _this = this;
        var arges = this.getArges();
        my.view.load(1);
        
        my.util.send('personnel->job_list', arges, function (data) {
            my.view.load();
            _this.list = data.list;
            _this.showList();
        });
    },
    showList: function () {
        var _this = this;
        $("tr", this.div).each(function (i) {
            if (i < 2) return true;
            $(this).remove();
        });
        var str = '';
        if ($.isEmptyObject(this.list)) {
            str = '<tr><th colspan="6">目前没有岗位信息</th></tr>';
        } else {
            $.each(this.list, function () {
                var info = this;
                str += '<tr>\
                    <th>' + this.id + '</th>\
                    <th class="txtleft">'+this.job+'</th>\
                    <th>'+this.plan_nums+'</th>\
                    <th>'+this.wage+ '</th>';
                
                var level = ['专员', '主管', '经理', '总监'];
                str += '<th>'+level[this.job_level-1] + '</th>';
                
                str +='<th><a data-type="edit" style="padding-right:10px;" data-id="' + this.id + '">修改</a>\
<a data-type="del" style="padding-right:10px;" data-id="' + this.id + '">删除</a>\
<a data-type="history" data-id="'+this.id+'">历史记录</a></th>\
                </tr>';
            });
        }
        str = $(str);
        $("a", str).bind('click', function () {
            var id = $(this).data('id');
            var type = $(this).data('type');
            if (type == 'edit') {
                var tmpdom = $(this).parent().parent().find('th');
                var info = _this.getListInfo(id);
                tmpdom.eq(1).html('<input type="text" value="' + info.job + '" style="width:150px;" name="job">');
                tmpdom.eq(2).html('<input type="text" value="' + info.plan_nums + '" style="width:100px;" name="plan_nums">');
                tmpdom.eq(3).html('<input type="text" value="' + info.wage + '" style="width:60px;" name="wage">');
                var tmpstr = '';
                tmpstr += '<select name="job_level">';
                var level = ['专员', '主管', '经理', '总监'];
                $.each(level, function (k) {
                    if (info.job_level == (k + 1)) {
                        tmpstr += '<option value="' + (k + 1) + '" selected>' + this + '</option>';
                    } else {
                        tmpstr += '<option value="' + (k + 1) + '" >' + this + '</option>';
                    }
                });
                tmpstr += '</select>';
                tmpdom.eq(4).html(tmpstr);

                tmpdom.eq(5).html('<a data-type="editsubmit" style="padding-right:10px;">确认修改</a> <a data-type="cancel">取消</a>');
                tmpdom.eq(5).find('a').bind('click', function () {
                    var t = $(this).data('type');
                    if (t == 'cancel') {
                        _this.showList();
                    } else {
                        var job = $("input[name='job']", tmpdom).val();
                        var plan_nums = $("input[name='plan_nums']", tmpdom).val();
                        var wage = $("input[name='wage']", tmpdom).val();
                        var job_level = $("select[name='job_level']",tmpdom).val();
                        var arges = _this.getArges();
                        arges['id'] = id;
                        arges['job'] = job;
                        arges['plan_nums'] = plan_nums;
                        arges['wage'] = wage;
                        arges['job_level'] = job_level;
                        my.util.send('personnel->edit_job', arges, function (data) {
                            if (data.status != 0) return my.view.message('修改失败！');
                            my.view.message('修改成功！', 1, function () {
                                _this.fresh();
                            });
                        });
                    }
                });
                return;
            }
            if (type == 'history') {
                var str = '';
                if ($(".history_" + id).length > 0) {
                    $(".history_" + id).remove();
                    return;
                }
                var info = _this.getListInfo(id);
                $.each(info.list, function () {
                    str += '<tr class="history_'+id+'">';
                    str += '<td colspan="2"></td><td>' + this.plan_nums + '</td>';
                    str += '<td>' + this.wage + '</td>';
                    var level = ['专员', '主管', '经理', '总监'];
                    str += '<td>' + level[this.job_level - 1] + '</td>';
                    str += '<td>' + this.begin_time + '  [<a data-id="' + this.id + '">删除</a>]</td>';
                    str += '</tr>';
                })
                $(this).parent().parent().after(str);
                $(".history_" + id + ' a').click(function () {
                    var tmpthis = this;
                    var cache_id = $(this).data('id');
                    my.view.load(1);
                    my.util.send('personnel->del_job_cache_info', { id: cache_id }, function (data) {
                        if (data.status != 0) return my.view.message('删除失败！');
                        my.view.message('删除历史记录成功！', 1, function () {
                            $(tmpthis).parent().parent().remove();
                        });
                    });
                });
                return;
            }
            if (type == 'del') {
                if (confirm('确认删除职位吗？如该职位存在数据，将导致数据混乱，请谨慎操作！')) {
                    my.view.load(1);
                    my.util.send('personnel->del_job_info', { id: id }, function (data) {
                        if (data.status == 1) return my.view.message('该职位已有员工，请先调整该员工职位后再进行删除操作！');
                        if (data.status != 0) return my.view.message('删除职位失败！');
                        my.view.message('删除职位成功！', 1, function () {
                            _this.fresh();
                        });
                    });
                }
                return;
            }
        });
        $("table", this.div).append(str);
    },
    getListInfo: function (id) {
        var res;
        $.each(this.list, function () {
            if (this.id == id) return res = this;
        });
        return res;
    },
    //显示物品列表，弹窗形式
    showList1: function (arr, cb) {
        this.goodsList = arr;
        this.searchResult = arr;
        var _this = this;
        var div = document.createElement('div');
        var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
        var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
        var left = (maxwidth - 900) / 2;
        var top = (maxheight - 500) / 2;

        div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";

        var department_str = '';
        $.each(my.departments, function () {
            department_str += '<option value="' + this.department + '">' + this.department + '</option>';
        })

        var store_str = '';
        $.each(my.stores, function () {
            store_str += '<option value="' + this.store_id + '">' + this.store_name + '</option>';
        })

        var bag_str = '';
        $.each(my.bags, function () {
            bag_str += '<option value="' + this.bag_id + '">' + this.bag_name + '</option>';
        })

        var chejian_str = '';
        $.each(my.chejians, function () {
            chejian_str += '<option value="' + this.chejian_id + '">' + this.chejian_name + '</option>';
        })
        $(div).append('<table border="0" cellspacing="0" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist"><tr>\
                    <th colspan="5" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>选择人员</b> &nbsp;&nbsp;&nbsp;&nbsp;\
                        <input type="checkbox" id="quick_search" checked> 快速查询  \
                        <a class="ico tips"><div class="tips_content" style="width:300px;"><div class="tips_arrow">◆</div>\
                            支持按\
                            <b><font color="red">ID</font></b>、\
                            <b><font color="red">姓名</font></b>、\
                            <b><font color="red">姓名拼音首字母</font></b>搜索。<br>\
                            支持多关键词搜索，关键词之间以空格分开。<br>\
                            选中快速查询后，可即输即查，无需点击 <b><font color="red">查询</font></b> 按钮。<br>\
                            如电脑配置较低，出现卡机情况，请去掉“快速查询”勾选，输入关键词后，点击“查询”按钮进行搜索。\
                         </div></a>\
<select name="department"><option value="">选择部门</option>'+department_str+'</select>\
<select name="store" style="display:none"><option value="">选择门店</option>' + store_str + '</select>\
<select name="bag" style="display:none"><option value="">选择仓库</option>' + bag_str + '</select>\
<select name="chejian" style="display:none"><option value="">选择车间</option>' + chejian_str + '</select>\
                        关键词：<input type="text" id="keyword" class="input3" style="width:100px;"> \
                        <a  class="city_submit" id="search_start">查询</a>\
                        </span><span style="float:right"><a class="close">关闭</a></span>    \
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">ID</th>\
                    <th>姓名</th>\
                    <th width="120">部门</th>\
                    <th width="70">职位</th>\
                    <th width="80">操作</th>\
                </tr></table>');
        $(document.body).append(div);
        this.div = div;
        $("select[name='department']", div).bind('change', function () {
            var department = $(this).val();
            $("select[name='store']", div).hide();
            $("select[name='bag']", div).hide();
            $("select[name='chejian']", div).hide();
            if (department == '门店') {
                $("select[name='store']", div).show();
            }
            if (department == '仓库') {
                $("select[name='bag']", div).show();
            }
            if (department == '加工中心') {
                $("select[name='chejian']", div).show();
            }
            _this.search($("#keyword").val().trim(), cb, department);
        });
        $("select[name='store'],select[name='bag'],select[name='chejian']", div).bind('change', function () {
            var department = $("select[name='department']", div).val();
            var depcode = $(this).val();
            _this.search($("#keyword").val().trim(), cb, department,depcode);
        });
        $("#keyword", div).bind('keyup', function () {//实时搜索
            if (!$("#quick_search", div).attr('checked')) return;
            var department = $("select[name='department']", div).val();
            var depcode = $("select[name='store']", div).val() || $("select[name='bag']", div).val() || $("select[name='chejian']", div).val();
            _this.search($(this).val().trim(),cb,department,depcode);
        });
        $("#search_start", div).bind('click', function () {//点击搜索
            var department = $("select[name='department']", div).val();
            var depcode = $("select[name='store']", div).val() || $("select[name='bag']", div).val() || $("select[name='chejian']", div).val();
            _this.search($("#keyword").val().trim(), cb,department, depcode);
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
        $("#fullbg").height($(document).height()).show().unbind().bind('click', function () { _this.hide(); });
        $(".close", div).click(function () { _this.hide(); });
        $(div).fadeIn();
        this.search('', cb);
    },
    //隐藏物品列表
    hide: function () {
        $(this.div).remove();
        $(this.bg).remove();
    },
    //智能搜索
    search:function(key,cb,department,depcode){
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
                if (department && this.department != department) return true;//按部门查看
                if (department == '门店' && depcode && this.store_id != depcode) return true;
                if (department == '加工中心' && depcode && this.chejian_id != depcode) return true;
                if (department == '仓库' && depcode && this.bag_id != depcode) return true;
                if (this.goods_type) return true;//隐藏已有分类的结果
                if (keytype == 1) {//数字查询
                    if (this.id.toString().indexOf(key.toString()) > -1) {
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
                    if (this.true_name.toString().indexOf(key.toString()) > -1) {
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
                tmp = {id:'--'};
            }
            tr.appendChild(this.th(tmp.id));
            tr.appendChild(this.td(tmp.true_name));
            tr.appendChild(this.td(tmp.department == '门店' ? '门店（' + getStoreName(tmp.store_id) + '）' : (tmp.department=='仓库'?'仓库（'+getBagName(tmp.bag_id)+'）':(tmp.department=='加工中心'?'加工中心（'+getChejianName(tmp.chejian_id)+'）':tmp.department))));
            tr.appendChild(this.td(tmp.job));
            tmp.baozhuang_num = tmp.baozhuang_num ? tmp.baozhuang_num : '';
            tmp.order_nums = tmp.order_nums ? tmp.order_nums : '';

            if (tmp.goods_type) {
                tr.appendChild(_this.td(tmp.goods_type));
            } else {
                if (tmp.id == '--') {
                    tr.appendChild(_this.td(tmp.id));
                } else {
                    tr.appendChild(_this.td('<a  class="submit_order" data-code="' + tmp.id + '" data-id="' + tmp.id + '">选择</a>'));
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