
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'chengben->getCPCost',
        template_url: 'view/caiwu_chengben_cpde.html',
        title: '成品定额成本表',
        perpage:10,
        page: 1,
        output: 0,
        init: function () {
            if (my.user.info.bumen != '门店' && !this.store_id) this.store_id = getOneStore_ID();
            this.storeid = this.store_id || my.user.info.store_id;
            this.arges = {
                page: this.page,
                perpage: this.perpage,
                store_id: this.storeid
            };
        },
        bindEvent: function () {
            var _this = this;
            my.querypage.show($(".showpage th"), this.data.total, this.data.perpage, this.data.page,
                function (page) {
                    _this.setPage(page);
                    my.view.showTable('caiwu_chengben_cpde');
                }, function (perpage) {
                    _this.setPerpage(perpage);
                    my.view.showTable('caiwu_chengben_cpde');
                }
            );
            $(".user_list a").click(function () {
                var type = $(this).data('type');
                if (type != 'more') return;
                _this.showMore($(this).data('value'));
            });
        },
        showMore: function (id) {
            var info = this.getInfoByID(id);
            var div = document.createElement('div');
            var bg = document.createElement('div');
            var maxwidth = document.documentElement.clientWidth || document.body.clientWidth;
            var maxheight = document.documentElement.clientHeight || document.body.clientHeight;
            var left = (maxwidth - 900) / 2;
            var top = (maxheight - 500) / 2;
            bg.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:" + maxheight + "px;filter:alpha(opacity=50);-moz-opacity:0.5;-khtml-opacity: 0.5;opacity: 0.5;background:#000;z-index:10;";
            div.style.cssText = "position:absolute;left:" + left + "px;top:" + top + "px;width:880px;height:500px;border:1px solid #f4f4f4;background:#fff;overflow:scroll;z-index:999;display:none;";
            $(document.body).append(bg);
            $(document.body).append(div);
            var str = '';
            if (info.ch_suitflag == 'Y') {
                $.each(info.child, function () {
                    str += '<tr><th><b>' + this.ch_dishno + '</b></th>\
                        <th class="txtleft"><b>' + this.name + '</b></th>\
                        <th colspan="5" class="txtleft">' + this.num_num + '</th></tr>';
                    $.each(this.child, function () {
                        str += '<tr>\
                            <td>'+ this.stuff_code + '</td>\
                            <td class="txtleft">'+ this.name + '</td>\
                            <td  class="txtleft">' + this.nums + '</td>\
                            <td >'+ this.kucun_danwei + '</td>\
                            <td >' + this.price + '</td>\
                            <td >'+ this.guige + '</td>\
                            <td >' + this.cost + '</td>\
                        </tr>';
                    });
                });
            } else {
                $.each(info.child, function () {
                    str += '<tr>\
                            <td>'+ this.stuff_code + '</td>\
                            <td class="txtleft">'+ this.name + '</td>\
                            <td  class="txtleft">' + this.nums + '</td>\
                            <td >'+ this.kucun_danwei + '</td>\
                            <td >'+ this.price + '</td>\
                            <td >'+ this.guige + '</td>\
                            <td >' + this.cost + '</td>\
                        </tr>';
                });
            }
            $(div).append('<table border="0" cellspacing="0" id="goods_list" cellpadding="0" id="goods_list" style="width:860px;"  class="table_goodslist" style="line-height:24px;"><tr>\
                    <th colspan="7" class="txtleft" style="background:#dedede;border-bottom:1px solid #ccc;border-top:1px solid #ccc;">\
                        <span style="float:left;"><b>食材明细&nbsp;&nbsp;' + info.name + '</b> &nbsp;&nbsp;&nbsp;&nbsp;售价：<b>' + info.num_price + '</b> &nbsp;&nbsp;&nbsp;&nbsp;成本：<b>' + info.cost + '</b> &nbsp;&nbsp;&nbsp;&nbsp;</span>\
                        <span style="float:right"><a class="close">关闭</a></span>\
                    </th>\
                </tr>\
                <tr>\
                    <th width="100">食材编号</th>\
                    <th class="txtleft">食材名称</th>\
                    <th width="70">用量</th>\
                    <th width="70">单位</th>\
                    <th width="70">用量成本</th>\
                    <th width="120">规格</th>\
                    <th width="70">单位成本</th>\
                </tr><tr>'+str+'</table>');

            //选中变色
            $("table tr", div).bind('mouseover', function () {//表格选中行变色
                $('td', this).css('background-color', '#D3F0F1');
            });
            $("table tr", div).bind('mouseout', function () {//表格选中行变色
                $('td', this).css('background-color', '#fff');
            });
            $(bg).bind('click', function () { $(bg).remove(); $(div).remove(); });
            $(".close", div).click(function () { $(bg).remove(); $(div).remove(); });
            $(div).fadeIn();

        },
        getInfoByID: function (id) {
            var res = '';
            $.each(this.data.list, function () {
                if (this.ch_dishno == id) return res = this;
            });
            return res;
        }
    };
    my.extend(a, prop);
    my.moudle.caiwu_chengben_cpde = a;
})();