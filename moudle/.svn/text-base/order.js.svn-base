my.order = {
    
    /*
    统一订单列表的格式。根据传入的订单列表和参数，返回订单列表html
    list：订单列表数据
    fields:所需字段
    more:{
	    txt:更多列，显示文字
        cb:点击后跳转回调
    }
    */
    getList: function (list, fields, more,more1) {
        var _this = this;
        var head = {//文本，td、th，宽度，样式名称
            'order_id': ['单据编号', 'td', '', 'txtleft'],
            'store_id': ['制单部门', 'td', '90'],
            'chejian_id': ['制单部门', 'td', '90'],
            'use_name': ['订货人', 'td', '90'],
            'order_date': ['订货日期', 'td', '90'],
            'order_name': ['订单类别', 'td', '90'],
            'statusTxt': ['处理状态', 'td', '90'],
            'order_type': ['订单类别', 'td', '90'],
            'bagname': ['仓库', 'td', '90'],
            'vendorname': ['供应商', 'td', '90'],
            'storename': ['调入门店', 'td', '90'],
            'senddate': ['发货日期', 'td', '90'],
            'send_user_name': ['发货人', 'td', '90'],
            'recv_user_name': ['收货人', 'td', '90'],
            'recvdate': ['收货日期', 'td', '90'],
            'passdate': ['审核日期', 'td', '90'],
            'pass_user_name': ['审核人', 'td', '90'],
            'user_name': ['制单人', 'td', '90'],
            'goods_type': ['分类', 'td', '90'],
            'adddate':['登记日期','td','90']//只有盘点时调用了此字段，所以限定名称为 盘点日期 。如其他页面需要调用此字段，则需要修改盘点页面。
        };
        var colspan = fields.length;
        if (more) colspan++;

        var res = '';
        var container = document.createElement('table');
        container.className = 'data-load';
        container.border = 0;
        container.cellPadding = 0;
        container.cellSpacing = 0;
        var tbody = document.createElement('tbody');
        container.appendChild(tbody);
        var tr_head = document.createElement('tr');
        $.each(fields, function () {//生成表头
            var tmphead = head[this];
            if (this == 'select') {//单独处理选择框
                tr_head.appendChild(_this.td('选择', {
                    type: 'th',
                    width: 36
                }));
                return true;
            }
            tr_head.appendChild(_this.td(tmphead[0], {
                        type: 'th',
                        width: tmphead[2] ? tmphead[2] : '',
                        classname: tmphead[3] ? tmphead[3] : ''
                    }
                )
            );
        });
        if (more) tr_head.appendChild(_this.td('操作', { type: 'th', width: 120 }));
        tbody.appendChild(tr_head);
        $.each(list, function (k) {//生成列表
            var tr = document.createElement('tr');
            var tmplist = this;
            $.each(fields, function () {
                if (this == 'select') {//单独处理选择框
                    tr.appendChild(_this.td('<input type="checkbox" name="check_order" value="' + tmplist.order_id + '">', { type: 'th' }));
                    return true;
                }
                var tmp = tmplist[this];
                if (this == 'order_id') tmp = '<a>' + tmp + '</a>';
                if (this == 'store_id') tmp = getStoreName(tmp)||getChejianName(tmplist['chejian_id'])||'仓库';
                tr.appendChild(_this.td(tmp, {
                    classname: head[this][3] ? head[this][3] : ''
                }));
            });
            if (more) {
                var tmpstr = '<a class="submit_order">' + more.txt + '</a>';
                if (more1) tmpstr += '<a class="submit_order" style="margin-left:10px;">' + more1.txt + '</a>';
                //console.log(tmplist.status);
                //if (tmplist.status == 1) tmpstr += '<a class="delorder">删除</a>';
                tr.appendChild(_this.td(tmpstr));
            }
            $('a', tr).bind('click', function () {
                more.cb(tmplist.order_id);
            });
            if (more1) {
                $('a.submit_order', tr).eq(1).unbind().bind('click', function () {
                    more1.cb(tmplist.order_id);
                });
            }
            tbody.appendChild(tr);
        });
        if (fields[0] == 'select') {//单独处理选择框
            $(tbody).append('<tr class="showpage"><th colspan="' + colspan + '"><input type="checkbox" name="check_all"> 全选\
<span class="city_submit"  id="submit_order" >合并查看选中单据</span>&nbsp;&nbsp;&nbsp;&nbsp;\
</th></tr>');
        }else{
            $(tbody).append('<tr class="showpage"><th colspan="' + colspan + '"></th></tr>');
        }
        return container;
    },
    //根据订单详情，生成最终详情页面
    //订单详情、订单物品清单
    getContent: function (info, list, types, fields, more, ids, bPrint) {
        var _this = this;
        /*
        <tr>
        <th width="100">分类</th>
        <th width="100">编码</th>
        <th class="txtleft">名称</th>
        <th width="80">订货数量</th>
        <th width="80">包装数量</th>
        <th width="120">规格</th>
        <th width="70">库存单位</th>
        <th width="70">包装单位</th>
        <th width="80">包装换算率</th>
        <th width="80">定额换算率</th>
    </tr>
    {foreach $list as $k=>$v}
        <tr>
            {if $v['total']==1}<th rowspan="{$types[$v['type_name']]}">{$v['type_name']}</th>
            {/if}
            <td>{$v['bianhao']}</td>
            <td class="txtleft">{$v['name']}</td>
            <td>{$v['order_nums']}</td>
            <td>{$v['baozhuang_num']}</td>
            <td>{if($v['guige'])}{$v['guige']}{/if}</td>
            <td>{$v['kucun_danwei']}</td>
            <td>{$v['baozhuang_danwei']}</td>
            <td>{$v['baozhuang_hsl']}</td>
            <td>{$v['kucun_hsl']}</td>
        </tr>
    {/foreach}
    'type_name', 'bianhao', 'name', 'guige', 'order_nums','real_send','recv_send','chayi','chayi_yuanyin','kucun_danwei
        */
        var head = {//文本，td、th，宽度，样式名称
            'type_name': ['分类', 'td', '80'],
            'bianhao': ['编码', 'td', '80'],
            'name': ['名称', 'td', '', 'txtleft'],
            'order_nums': ['订货数量', 'td', '60'],
            'order_nums_edit': ['订货数量', 'td', '60'],
            'guige': ['规格', 'td', '90'],
            'kucun_danwei': ['单位', 'td', '40'],
            'real_send': ['实发','',40,'real_send'],
            'real_recv': ['实收', '', 40],
            'chayi': ['差异', '', 40,'chayi'],
            'chayi_yuanyin': ['差异原因', '', 100],
            'cost': ['单价', '', 90],
            'real_send_edit':['实发','',70],
            'real_recv_edit': ['实收','','70'],
            'chayi_yuanyin_edit': ['差异原因', '', '100'],
            'baosun_num': ['报损数量', '', '100'],
            'baosun_yuanyin': ['报损原因', '', '150']
        };
        var container = document.createElement('table'), tr_head,tr_head_str;
        container.className = 'data-load';
        container.border = 0;
        container.cellPadding = 0;
        container.cellSpacing = 0;
        var tbody = document.createElement('tbody');
        container.appendChild(tbody);
        var colspan = fields.length;
        //订单状态配置
        //my.orderStatus = {
        //    1: '<font color=red>等待发货</font>',
        //    2: '<font color=red>等待确认收货</font>',
        //    3: '<font color=blue>等待收货审核</font>',
        //    0: '<font color=green>已结束</font>'
        //};

        //合并出库单 只有一行
        if (ids) {
            tr_head = document.createElement('tr');
            tr_head_str = '';//合并出库单';//：<span class="order_info_txt" style="width:auto;">' + ids + '</span>';
            if (bPrint) tr_head_str += '<span style="float:right;padding-right:20px;"><a class="city_submit" id="print_order" target="_blank" href="#">打印出库单</a></span>';
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 8) {//退库
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">退库出库单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">退库日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }

            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 7) {//补发
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">补发出库单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">补发日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 6) {//报损
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">成品报损登记单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损部门：<span class="order_info_txt" style="width:100px;">' + (getStoreName(info.store_id) || getChejianName(info.chejian_id)) + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 5) {//报损
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">材料报损登记单</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">报损部门：<span class="order_info_txt" style="width:100px;">' + (getStoreName(info.store_id) || getChejianName(info.chejian_id)) + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else if (info.order_type == 4) {//盘点
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">' + info.order_name + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:240px;">单据编号：<span class="order_info_txt" style="width:160px;">' + info.order_id + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">盘点日期：<span class="order_info_txt" style="width:100px;">' + info.order_date + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">盘点部门：<span class="order_info_txt" style="width:100px;">' + (getStoreName(info.store_id) || getChejianName(info.chejian_id)) + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
        } else {
            //第一行
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1" style="width:180px;">单据类别：<span class="order_info_txt" style="width:100px;">' + info.order_name + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:240px;">单据编号：<span class="order_info_txt" style="width:160px;">' + info.order_id + '</span></span>';
            tr_head_str += '<span class="order_info_1" style="width:180px;">处理状态：<span class="order_info_txt" style="width:100px;">' + info.statusTxt + '</span></span>';
            if (more) {
                tr_head_str += '<span style="float: right;padding-right:20px;">\
                <a class="city_submit" id="submit_order" data-id="'+ info.order_id + '" data-status="1">' + more + '</a>\
            </span>';
            }
            if (bPrint) tr_head_str += '<span style="float:right;padding-right:20px;"><a class="city_submit" id="print_order" target="_blank" href="#">打印出库单</a></span>';
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
            //第二行
            tr_head = document.createElement('tr');
            tr_head_str = '<span class="order_info_1">制单部门：<span class="order_info_txt">' + (getStoreName(info.store_id)||getChejianName(info.chejian_id)) + '</span></span>';
            tr_head_str += '<span class="order_info_1">制单人：<span class="order_info_txt">' + info.user_name + '</span></span>';
            tr_head_str += '<span class="order_info_1">制单日期：<span class="order_info_txt">' + info.adddate + '</span></span>';
            tr_head.appendChild(_this.td(tr_head_str, {
                type: 'th',
                classname: 'txtleft',
                colspan: colspan
            }));
            tbody.appendChild(tr_head);
            if (info.order_type != 3 && (info.status > 1 || info.status == 0)) {//调入调出订单无需发货，直接等待确认
                //第三行
                tr_head = document.createElement('tr');
                if (info.order_type == 1) {//总部订单，仓库发货
                    tr_head_str = '<span class="order_info_1">发货部门：<span class="order_info_txt">' + info.bagname + '</span></span>';
                } else if (info.order_type == 2) {//直供订单，供应商发货
                    tr_head_str = '<span class="order_info_1" style="width:340px;">发货部门：<span class="order_info_txt" style="width:260px;">' + info.vendorname + '</span></span>';
                }
                if (info.order_type == 1) {//直供订单无此项目
                    tr_head_str += '<span class="order_info_1">发货人：<span class="order_info_txt">' + info.send_user_name + '</span></span>';
                    tr_head_str += '<span class="order_info_1">发货日期：<span class="order_info_txt">' + info.order_date + '</span></span>';
                }
                tr_head.appendChild(_this.td(tr_head_str, {
                    type: 'th',
                    classname: 'txtleft',
                    colspan: colspan
                }));
                tbody.appendChild(tr_head);
            }
            //第四行
            if ((info.status == 3 || info.status == 0) && info.order_type != 2) {//等待审核和结束
                tr_head = document.createElement('tr');
                tr_head_str = '<span class="order_info_1">确认人：<span class="order_info_txt">' + (info.recv_user_name ? info.recv_user_name : '') + '</span></span>';
                tr_head_str += '<span class="order_info_1">确认日期：<span class="order_info_txt">' + (info.recvdate ? info.recvdate : '') + '</span></span>';
                tr_head.appendChild(_this.td(tr_head_str, {
                    type: 'th',
                    classname: 'txtleft',
                    colspan: colspan
                }));
                tbody.appendChild(tr_head);
            }

            //第五行
            if (info.order_type != 3 && info.status == 0) {//调入调出无需审核 and 订单已结束
                tr_head = document.createElement('tr');
                tr_head_str = '<span class="order_info_1">审核人：<span class="order_info_txt">' + (info.pass_user_name ? info.pass_user_name : '') + '</span></span>';
                tr_head_str += '<span class="order_info_1">审核日期：<span class="order_info_txt">' + (info.passdate ? info.passdate : '') + '</span></span>';
                tr_head.appendChild(_this.td(tr_head_str, {
                    type: 'th',
                    classname: 'txtleft',
                    colspan: colspan
                }));
                tbody.appendChild(tr_head);
            }
        }
        //表头
        tr_head = document.createElement('tr');
        $.each(fields, function () {//生成表头
            var tmphead = head[this];
            if (this == 'order_nums' && (info.order_type == 7 || info.order_type == 8)) {//补发 退库  订货数量修正为数量
                tr_head.appendChild(_this.td('数量', {
                    type: 'th',
                    width: tmphead[2] ? tmphead[2] : '',
                    classname: tmphead[3] ? tmphead[3] : ''
                }));
                return true;
            }
            if (this == 'order_nums' && (info.order_type == 5 || info.order_type == 6)) {//报损 订货数量修正为报损数量
                tr_head.appendChild(_this.td('报损数量', {
                    type: 'th',
                    width: tmphead[2] ? tmphead[2] : '',
                    classname: tmphead[3] ? tmphead[3] : ''
                }));
                return true;
            }
            if (this == 'order_nums' && info.order_type == 4) {//盘点 订货数量修正为盘点数量
                tr_head.appendChild(_this.td('盘点数量', {
                    type: 'th',
                    width: tmphead[2] ? tmphead[2] : '',
                    classname: tmphead[3] ? tmphead[3] : ''
                }));
                return true;
            }
            tr_head.appendChild(_this.td(tmphead[0], {
                type: 'th',
                width: tmphead[2] ? tmphead[2] : '',
                classname: tmphead[3] ? tmphead[3] : ''
            }));
        });
        tbody.appendChild(tr_head);
        //列表
        $.each(list, function (k) {//生成列表
            var tr = document.createElement('tr');
            var tmplist = this;
            $.each(fields, function () {
                //单独处理财务修改
                if (more == '修改') {
                    if (this == 'order_nums_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="order_nums" class="input4" value="' + tmplist['order_nums'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'real_send_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="real_send" class="input4" value="' + tmplist['real_send'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'real_recv_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="real_recv" class="input4" value="' + tmplist['real_recv'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'chayi_yuanyin_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="chayi_yuanyin" class="input4" value="' + tmplist['chayi_yuanyin'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                } else {
                    if (this == 'real_send_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="shifa_num" class="input4" value="' + tmplist['order_nums'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'real_recv_edit') {//实收编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="shishou_num" class="input4" value="' + tmplist['real_send'] + '" data-id="' + tmplist['bianhao'] + '" style="width:36px;">', {
                        }));
                        return true;
                    }
                    if (this == 'chayi_yuanyin_edit') {//差异编辑框 单独处理
                        tr.appendChild(_this.td('<input type="text" name="chayi_yuanyin" class="input4"  data-id="' + tmplist['bianhao'] + '" style="width:66px;">', {
                        }));
                        return true;
                    }
                }
                var tmp = tmplist[this];
                if (this == 'chayi') {
                    if (info.status < 3) {
                        tmp = '';//还没有确认收货，没有差异
                    } else {
                        tmp = parseInt(parseFloat(tmplist['real_recv'] * 10000) - parseFloat(tmplist['real_send'] * 10000)) / 10000;
                    }
                }
                var rowspan = '';
                var tmptype = 'td';
                if (this == 'type_name') {
                    if (tmplist['total'] != 1) return true;
                    rowspan = types[tmplist['type_name']];
                    tmptype = 'th';
                    if (!tmp) tmp = '临时增加';
                }
                
                tr.appendChild(_this.td(tmp, {
                    classname: head[this][3] ? head[this][3] : '',
                    rowspan: rowspan,
                    type:tmptype
                }));
            });
            $('a', tr).bind('click', function () {
                more.cb(tmplist.order_id);
            });
            tbody.appendChild(tr);
        });
        return container;
    },
    td: function (str, cfg) {
        cfg = cfg || {};
        var attr = cfg.type ? cfg.type : 'td';
        
        var tmp = document.createElement(attr);
        if (cfg.classname) tmp.className = cfg.classname;
        if (cfg.colspan) tmp.colSpan = cfg.colspan;
        if (cfg.rowspan) tmp.rowSpan = cfg.rowspan;
        if (cfg.width) tmp.width = cfg.width;
        tmp.innerHTML = str ? str : '&nbsp;';
        return tmp;
    }
};