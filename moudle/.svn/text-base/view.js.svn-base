/*
my.view类，视图控制类
    showTable(tableName):显示某个表格内容，使用my.table提供的方法刷新界面
    message（msg,type,cb）：显示提示信息。参数：信息内容，类别，回调。类别包括：1：msgbox，2：ok
    load(status)：加载中界面，on/off
    showLogin():显示登录界面
    showMain():显示登录后界面
*/
my.view = {
    //显示表格。表格名称、是否使用缓存（开启后不从服务器获取数据，仅刷新表格）
    showTable: function (tableName, useCache, arges) {
        var _this = this;
        var url = 'view/' + tableName + '.js?ver=' + version;
        if (my.debug) url += '?t=' + Math.random();
        if (!my.moudle[tableName]) my.util.getScript(url, false);//同步加载模块js
        if (my.moudle && my.moudle[tableName]) {
            var moudle = my.moudle[tableName];
            if (!useCache) {//不使用缓存，则清空排序条件，重新初始化，否则数据错乱
                moudle.sortBy = null;
                moudle.sortStatus = null;
            }
            moudle.init(arges);//模块初始化
            _this.load(true);

            if (useCache) {//开启缓存
                _this.freshTable(tableName);
            } else {
                moudle.getData(function () {
                    _this.freshTable(tableName);
                });
            }
        }
    },
    //无获取数据，直接刷新表格。type：1为图标形式，默认为表格形式
    freshTable: function (tableName, type) {
        var _this = this, res;
        var moudle = my.moudle[tableName];
        _this.load(false);
        if (type) {
            if (isIE6) {
                return my.view.message('不支持IE6查看图表功能，请升级浏览器！');
            }
            res = '<table class="data-load"  border="0" cellspacing="0" cellpadding="0" ><tr><td><div id="data_graph"></div></td></tr></table>';//设置表格的图表形式
        } else {
            res = moudle.getTableHtml();//获取表格html
        }
        _this.setOptYear(moudle.year, my.util.getYearList());//处理年份选择
        _this.setOptMonth(moudle.month, my.util.getMonthList(moudle.year));//处理月份选择
        _this.setOptDay(moudle.dayopt, my.util.getDateList(moudle.year, moudle.month));//处理日选择
        _this.setOptStore(moudle.store_id, my.allStores,moudle.is_allStore);//处理分店选择
        _this.setOptChejian(moudle.chejian_id, my.chejians);//处理分店选择
        _this.setOptBag(moudle.bag_id, my.bags);//处理仓库选择

        _this.initTable(tableName);//初始化表格
        _this.setTableContent(res, '', function () {//表格正文

            _this.setTableTips(moudle.getTips());//设置tips

            _this.setStartDay(moudle.startday, moudle.endday);//处理日期范围选择
            _this.checkOptions();//检查顶部选项,没有则去掉right的padding-top属性
            _this.setOutput(moudle.output, type);//设置导出Excel
            _this.setQuick(moudle.current_quick, moudle.quick);//处理年历/月历/日历表切换
            _this.setTableTitle(moudle.getTitle());//设置标题
            type ? _this.bindTableEvent() : _this.bindTableEvent(moudle.selection);//绑定表格事件

            //var height = $(window).height() - $(".top").outerHeight() - $(".nav").outerHeight() - $(".box_head").outerHeight() - $(".options").outerHeight() - 20;//自适应高度
            //var footer_height = $(".footer").outerHeight();
            //var body_height = $(".box_body").outerHeight();
            //if (body_height < height - footer_height - 13) {
            //    $(".box_body")[0].style.cssText += 'height:' + (height - footer_height - 13) + 'px';
            //}

            //if ($("#data_graph")[0]) $("#data_graph")[0].style.cssText += 'min-height:' + (height - 60) + 'px;';
            ////$(".data-load")[0].style.cssText += 'min-height:' + height + 'px';
            //var width = $(".box_body").outerWidth();
            //var minwidth = $(".data-load").data('min');
            //if (width < minwidth) {
            //    $(".data-load").width(minwidth);
            //}
            //if ($(".data-load").data('min')) {
            //    if ($(".data-load").data('min') >= width) {
            //        width = $(".data-load").data('min');
            //    }
            //} else {
            //    width = width < 745 ? 745 : width;
            //}
            //if ($(".data-load")[0]) $(".data-load")[0].style.cssText += 'min-width:' + (width-17) + 'px;\
            //_width:expression((document.documentElement.clientWidth||document.body.clientWidth)<=' + (width + 240 + 19 - 17) + '?"' + (width - 17) + 'px":"");';
            moudle.bindEvent();//绑定表格自定义事件
            if (moudle.chkThread() || type) {//检测是否存在异步操作。如操作为切换至图表样式，则跳过异步操作

                if (type) {
                    moudle.getGraph();//绘制图表
                }
                _this.setGraphBtn(moudle);//设置 图表 / 表格 切换按钮
            } else {
                moudle.runThread(function () {//每次执行完异步操作刷新表格
                    var table = $("#data").data('value');
                    if (tableName == table) {
                        _this.freshTable(table);
                    }
                });
            }
        });
    },
    //设置表格的图表形式
    setGraphBtn: function (moudle) {
        if ($(".graph").length > 0) $(".graph").remove();
        if (moudle.getGraph) {

            var bhas = false;
            if ($("#data_graph").length > 0) bhas = true;
            $(".right .box_title").append('<span class="graph"><a data-type="list" class="current-item">列表</a><a data-type="graph" href="javascript:void(0)">图表</a></span>');
            if (bhas) {
                $(".right .box_title .graph a").removeClass('current-item');
                $(".right .box_title .graph a").eq(1).addClass('current-item');
            }
            $(".right .box_title .graph a").eq(0).click(function () {
                var tableName = $("#data").data('value');
                my.view.freshTable(tableName);
            });
            $(".right .box_title .graph a").eq(1).click(function () {
                var tableName = $("#data").data('value');
                my.view.freshTable(tableName, 1);
            });
        }
    },
    //导出Excel按钮
    setOutput: function (current, type) {
        $(".right .box_head .export").remove();
        if (type) return;
        if (!current) return;
        $(".right .box_head").append('<div class=export><span class="ico ico_export" title="导出Excel"></span></div>');
        $(".right .box_head .export").bind('click', function () {
            my.view.saveToExcel();//导出Excel
        });
    },
    setQuick: function (current, obj) {
        var _this = this;
        var res = '', tmp = '';
        $(".right .box_head .option").remove();
        if ($.isEmptyObject(obj)) return;
        var div = document.createElement('div');
        div.className = 'option';
        $.each(obj, function (type, ele) {
            var li = document.createElement('li');
            if (current == type) li.className = 'current-item';
            li.innerHTML = type;
            var tableName = ele;
            if (typeof tableName == 'string') li.onclick = function () { _this.showTable(tableName); };
            if (typeof tableName == 'function') li.onclick = function () { tableName(); };
            div.appendChild(li);
        });
        $(".right .box_head").append(div);
    },
    //初始化表格
    initTable: function (tableName) {
        if ($("#data").length == 0) {
            var res = '<div class="box"><div class="box_head"><div class="box_title"><span></span></div><div class=option><li></li></div></div>\
                    <div class="box_body" id="box_body">\
                        <div id="data" data-value="' + tableName + '">\
                        </div>\
                    </div>\
                </div>';
            $(".right").append(res);
        } else {
            $("#data").data('value', tableName);
        }
    },
    //检查顶部选项,没有则去掉right的padding-top属性
    checkOptions: function () {

        if ($(".right .options").html() == '') {
            $(".right .options").remove();
            $(".right").css('padding-top', '0px');
        }
    },
    //设置表格tips内容
    //<a class="ico tips"><div class="tips_content"><div class="tips_arrow">◆</div>按日、周或月等按日、周或月等按日、周或月等按日、周或月等</div></a>
    setTableTips: function (str) {
        $(".box_title .tips").remove();
        if (!str || str == '') return;
        $(".box_title").append('<a class="ico tips"><div class="tips_content"><div class="tips_arrow">◆</div>' + str + '</div></a>');

    },
    //顶部添加选项栏
    setOptions: function () {
        if ($(".right .options").length > 0) return;
        $(".right .box").hide();//IE6 bug 先隐藏box再显示
        $(".right").prepend('<div class="options"></div>').css('padding-top', '40px');
        $(".right .box").show();
    },
    setStartDay: function (startday, endday) {
        $(".right .options .op_startday").remove();//先移除后添加,避免多个
        if (!startday || !endday) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op_startday">';
        res += '日期范围：<input type="text" value="' + startday + '" onfocus="WdatePicker()" id="startday" readonly> - ';
        res += '<input type="text" value="' + endday + '" onfocus="WdatePicker()" id="endday" readonly> <span class="submit_day">确定</span></div>';
        $(".right .options").append(res);

    },
    //设置年份选择
    setOptYear: function (current, array) {
        $(".right .options .year").remove();//先移除后添加,避免多个

        if (!current) return;

        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op year">';
        $.each(array, function () {
            if (current == this.value) {
                res += '<span>' + this.title + '<div class="ico ico_pulldown"></div></span><ul>';
                tmp += '<li data-value="' + this.value + '" data-type="year" class="current-item">' + this.title + '</li>';
            } else {
                tmp += '<li data-value="' + this.value + '" data-type="year">' + this.title + '</li>';
            }
        });
        res += tmp + '</ul></div>';
        $(".right .options").append(res);
    },
    //设置月份选择
    setOptMonth: function (current, array) {
        $(".right .options .month").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op month">';
        $.each(array, function () {
            if (current == this.value) {
                res += '<span>' + this.month + '<div class="ico ico_pulldown"></div></span><ul>';
                tmp += '<li data-value="' + this.value + '" data-type="month" class="current-item">' + this.month + '</li>';
            } else {
                tmp += '<li data-value="' + this.value + '" data-type="month">' + this.month + '</li>';
            }
        });
        res += tmp + '</ul></div>';
        $(".right .options").append(res);
    },
    //设置日选择
    setOptDay: function (current, array) {
        $(".right .options .day").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '';
        res += '<div class="op day">';
        $.each(array, function () {
            if (current == this.value) {
                res += '<span>' + this.title + '<div class="ico ico_pulldown"></div></span><ul>';
                tmp += '<li data-value="' + this.value + '" data-type="dayopt" class="current-item">' + this.title + '</li>';
            } else {
                tmp += '<li data-value="' + this.value + '" data-type="dayopt">' + this.title + '</li>';
            }
        });
        res += tmp + '</ul></div>';
        $(".right .options").append(res);
    },
    //设置仓库选择
    setOptBag: function (current, array) {
        $(".right .options .bag").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '', city = '', has = false;
        if (typeof current == 'string') {
            res += '<div class="op bag">';
            $.each(array, function () {
                if (current == this.bag_id) {
                    res += '<span>' + this.bag_name + '<div class="ico ico_pulldown"></div></span><ul>';
                    tmp += '<li data-value="' + this.bag_id + '" data-type="bag" class="current-item">' + this.bag_name + '</li>';
                } else {
                    tmp += '<li data-value="' + this.bag_id + '" data-type="bag">' + this.bag_name + '</li>';
                }
            });
            res += tmp + '</ul></div>';
            $(".right .options").append(res);
            return;
        }
    },
    //设置车间选择
    setOptChejian: function (current, array) {
        $(".right .options .chejian").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '', city = '', has = false;
        if (typeof current == 'string') {
            res += '<div class="op chejian">';
            $.each(array, function () {
                if (current == this.chejian_id) {
                    res += '<span>' + this.chejian_name + '<div class="ico ico_pulldown"></div></span><ul>';
                    tmp += '<li data-value="' + this.chejian_id + '" data-type="chejian" class="current-item">' + this.chejian_name + '</li>';
                } else {
                    tmp += '<li data-value="' + this.chejian_id + '" data-type="chejian">' + this.chejian_name + '</li>';
                }
            });
            res += tmp + '</ul></div>';
            $(".right .options").append(res);
            return;
        }
    },
    //设置分店选择
    setOptStore: function (current, array,isAll) {
        $(".right .options .op_store").remove();//先移除后添加,避免多个
        $(".right .options .store").remove();//先移除后添加,避免多个
        if (!current) return;
        if ($(".right .options").length == 0) this.setOptions();
        var res = '', tmp = '', city = '', has = false;
        if (typeof current == 'string' || typeof current == 'number') {
            res += '<div class="op store">';
            $.each(array, function () {
                if (!isAll && this.store_id > 8000)
                    return;
                if (current == this.store_id) {
                    res += '<span>' + this.store_name + '<div class="ico ico_pulldown"></div></span><ul>';
                    tmp += '<li data-value="' + this.store_id + '" data-type="store" class="current-item">' + this.store_name + '</li>';
                } else {
                    tmp += '<li data-value="' + this.store_id + '" data-type="store">' + this.store_name + '</li>';
                }
            });
            res += tmp + '</ul></div>';
            $(".right .options").append(res);
            return;
        }

        res += '<div class="op_store">';
        res += '<span>选择分店 <font color=blue><b>[' + current.length + ']</b></font> <div class="ico ico_pulldown"></div></span><ul>';
        stNo = 1;
        $.each(my.citys, function () {
            city = this;
            has = false;
            tmp = '';
            
            $.each(array, function () {
                if (!isAll && this.store_id > 8000) return;
                if (this.city != city) return true;
                if ($.inArray(this.store_id.toString(), current) != -1) {
                    tmp += '<div class="city_li"><input id="ck_' + this.store_id + '" type="checkbox" value="' + this.store_id + '" checked><label for="ck_' + this.store_id + '">' + this.store_name + '</label></div>';
                    has = true;
                } else {
                    tmp += '<div class="city_li"><input id="ck_' + this.store_id + '" type="checkbox" value="' + this.store_id + '"><label for="ck_' + this.store_id + '">' + this.store_name + '</label></div>';
                }
            });
            if (has) {
                res += '<li data-type="store"><input id="ck_store' + stNo + '" type="checkbox" class="selectcity" checked><label for="ck_store' + stNo + '">' + city + '</span><div class="citylist"><div class="arrow">◀</div>'; 
            } else {
                res += '<li data-type="store"><input id="ck_store' + stNo + '" type="checkbox" class="selectcity"><label for="ck_store' + stNo + '">' + city + '</span><div class="citylist"><div class="arrow">◀</div>'; 
            }
            res += tmp + '</div></li>';
            stNo++;
        });
        res += '<li><input type="checkbox" class="selectcityall" id="selectcityall"><label for="selectcityall">全选</label></li><li style="text-align:center;"><div class="city_submit">确定</div></li></ul></div>';
        $(".right .options").append(res);
    },
    //设置表格标题
    setTableTitle: function (title) {
        $(".right .box_title span").eq(0).html(title);
    },
    //设置表格内容，暂时只支持渐隐渐显
    setTableContent: function (content, animate, cb) {
        if ($("#data").html() == '') {
            typeof content == 'string' ? $("#data").html(content).hide().fadeIn() : $("#data").append(content).hide().fadeIn();
            if (cb && typeof cb == 'function') cb();
            return;
        }
        $("#data").fadeOut(300);
        setTimeout(function () {
            typeof content == 'string' ? $("#data").html(content).stop().hide().fadeIn() : $("#data").html('').append(content).stop().hide().fadeIn();
            if (cb && typeof cb == 'function') cb();
        }, 250);
    },
    //刷新表格绑定事件
    bindTableEvent: function (selection) {
        var _this = this;
        var _tmpTime = null;//缓冲时间
        var isa = false;//是否移除鼠标
        var isb = false;//是否移除鼠标
        var topEl = $("#data");
        if (selection) {
            $(selection, topEl).bind('mouseover', function () {//表格选中行变色
                if (selection.indexOf('tr') > -1) {
                    $('td', this).css('background-color', '#D3F0F1');
                } else {
                    $(this).data('bgcolor', $(this).css('background-color'));
                    $(this).css('background-color', '#D3F0F1');
                }
            });
            $(selection, topEl).bind('mouseout', function () {//表格选中行变色
                if (selection.indexOf('tr') > -1) {
                    $('td', this).css('background-color', '#fff');
                } else {
                    $(this).css('background-color', $(this).data('bgcolor'));
                }
            });



        }
        $("#data .ico_down,#data .ico_up,#data .ico_default").click(function () {
            var tableName = $("#data").data('value');
            var field = $(this).data('type');
            if ($(this).hasClass('ico_up')) {
                my.moudle[tableName].sort(field, 0);
                _this.showTable(tableName, 1);
            } else {
                my.moudle[tableName].sort(field, 1);
                _this.showTable(tableName, 1);
            }

        });
        $(".op_store ul li").bind('mouseover', function () {
            $('.citylist', this).show();
        });
        $(".op_store ul li").bind('mouseout', function () {
            $('.citylist', this).hide();
        });
        $(".op_store").bind('click', function (e) {//移动显示城市列表
            var tmpThis = this;
            e.stopPropagation();//阻止冒泡
            if ($(this).outerHeight() > 30) return;
            $(this).height(30 + $(this).find('ul').outerHeight());
            _tmpTime = setTimeout(function () {
                $(tmpThis).css('overflow', 'visible');
            }, 300);
            $(document).bind('click', function () {//绑定关闭事件
                clearTimeout(_tmpTime);
                $(tmpThis).stop().height(28).css('overflow', 'hidden');
                $(document).unbind('click');//关闭时取消绑定body
                var tableName = $("#data").data('value');
                var arr = [];
                $(".op_store .citylist input").each(function () {
                    if ($(this).attr('checked')) {
                        arr.push($(this).val());
                    }
                });
                if (arr.sort().toString() == my.moudle[tableName].store_id.sort().toString()) return;
                my.moudle[tableName].changeStore(arr);
                _this.showTable(tableName);
            });
        });
        $(".selectcityall").click(function () {
            if ($(this).attr('checked')) {
                $(".op_store input").attr('checked', true);
            } else {
                $(".op_store input").attr('checked', false);
            }
        });
        $(".op_store .selectcity").click(function () {//全选/全部选该城市分店
            if ($(this).attr("checked")) {
                $(this).parent().find(".citylist input").attr('checked', true);
            } else {
                $(this).parent().find(".citylist input").attr('checked', false);
            }
        });
        $(".op_store .citylist input").click(function () {//选中一个分店，则选中所在城市，一个分店没选中，则取消选中城市
            if ($(this).attr("checked")) {
                $(this).parent().parent().parent().find(".selectcity").attr('checked', true);
            } else {
                $(this).parent().parent().parent().find(".selectcity").attr('checked', false);
                $(this).parent().parent().find('input').each(function () {
                    if ($(this).attr('checked')) {
                        $(this).parent().parent().parent().find(".selectcity").attr('checked', true);
                    }
                });
            }
        });
        $(".op span").unbind().bind('click', function (e) {
            var height = 30;
            var tmpThis = this;
            if ($(this).parent().outerHeight() > height) {
                $(this).parent().height(height - 2);
                e.stopPropagation();//阻止冒泡
                e.preventDefault();//阻止默认
                $(document).unbind('click');//关闭时取消绑定body
            } else {
                $(this).parent().height(height + $(this).parent().find('ul').outerHeight());
                $(document).trigger('click');//先关闭其他选项
                $(document).bind('click', function () {//绑定关闭事件
                    $(tmpThis).trigger('click');//body任意点击关闭
                });
                e.stopPropagation();//阻止冒泡
                e.preventDefault();//阻止默认
            }
        });
        $(".op_store .city_submit").click(function () {
            var tableName = $("#data").data('value');
            var arr = [];
            $(document).unbind('click');//
            $(".op_store .citylist input").each(function () {
                if ($(this).attr('checked')) {
                    arr.push($(this).val());
                }
            });
            my.moudle[tableName].changeStore(arr);
            _this.showTable(tableName);
        });
        $(".op_startday .submit_day").click(function () {//更改日期范围
            var tableName = $("#data").data('value');
            var startday = $("#startday").val();
            var endday = $("#endday").val();
            var date = new Date();
            date.setDate(date.getDate() - 1);
            if (startday > date.format('yyyy-MM-dd') || endday > date.format('yyyy-MM-dd')) {
                return my.view.message('只能查询今日之前的数据！');
            }
            if (startday > endday) {
                return my.view.message('日期范围错误！');
            }
            my.moudle[tableName].changeStartDay(startday);
            my.moudle[tableName].changeEndDay(endday);
            _this.showTable(tableName);
        });

        $(".op ul li").unbind().bind('click', function () {//选择日期、年、
            var tableName = $("#data").data('value');
            var type = $(this).data('type');
            var value = $(this).data('value');
            if (type == 'month') {
                my.moudle[tableName].changeMonth(value);
            } else if (type == 'year') {
                my.moudle[tableName].changeYear(value);
            } else if (type == 'dayopt') {
                my.moudle[tableName].changeDay(value);
            } else if (type == 'store') {
                my.moudle[tableName].changeStore(value);
            } else if (type == 'chejian') {
                my.moudle[tableName].changeChejian(value);
            } else if (type == 'bag') {
                my.moudle[tableName].changeBag(value);
            }
            _this.showTable(tableName);
            $(this).parent().parent().find('span').html($(this).html() + '<div class="ico ico_pulldown"></div>');
            $(this).parent().find('.current-item').removeClass('current-item');
            $(this).addClass('current-item');
        });
        $(".tips").unbind().bind('mouseover click', function () {//小提示
            $("div", this).stop().show();
        });
        $(".tips").bind('mouseout', function () {//小提示
            $("div", this).stop().hide();
        });
    },
    //提示信息
    message: function (msg, type, cb) {
        var _this = this;
        this.load(true);
        $("#message,#fullbg").unbind().bind('click', function () {
            if (type == 1 && cb && typeof cb == 'function') cb();
            _this.load(false);
        });
        var top = ($(window).height() - $("#message").height()) / 2;
        var left = ($(window).width() - $("#message").width()) / 2;
        var scrollTop = $(document).scrollTop();
        var scrollLeft = $(document).scrollLeft();
        $("#message").css({ position: 'absolute', 'top': top + scrollTop, left: left + scrollLeft }).html('<div class="message_title">系统提示</div><div style="height:160px;"><table border=0 align="center" width="200" height=100%><tr><td >' + msg + ' <a >[点击关闭]</a></td></tr></table></div>');
    },
    //加载中界面
    load: function (status) {
        if (status) {
            $("#fullbg").height($(document).height()).unbind();
            $("#fullbg").show();
            $("#message").fadeIn();
            var top = ($(window).height() - $("#message").height()) / 2;
            var left = ($(window).width() - $("#message").width()) / 2;
            var scrollTop = $(document).scrollTop();
            var scrollLeft = $(document).scrollLeft();
            $("#message").unbind().css({ position: 'absolute', 'top': top + scrollTop, left: left + scrollLeft }).html('<div class="message_title">系统提示</div><div style="height:160px;"><table border=0 align="center" width="200" height=100%><tr><td align="right" width="50"><img src="images/loading.gif" width="30"></td><td>数据加载中，请稍候……</td></tr></table></div>');
        } else {
            $("#fullbg").stop().hide();
            $("#message").stop().fadeOut();
        }
    },
    //登录界面
    showLogin: function () {
        if ($(".login").length > 0) return;
        if ($(".nav").length > 0) {
            $(".nav").remove();
            $(".doc").remove();
            $(".footer").remove();
        }
        my.moudle = [];//彻底清空历史使用记录
        var res = '<ul class="login"><form id="loginform" onsubmit="return false;">\
                <li>\
                    <input type="text" name="user_name" class="input" placeholder="用户名" id="user_name" /></li>\
                <li>\
                    <input type="password" name="password" class="input" placeholder="密码" id="password" /></li>\
                <li>\
                    <input type="submit" value="登&nbsp;录" class="submit" accesskey="l" id="submit" /></form>\
                </li>\
        </ul>';
        $(".top").after(res);
        $("#loginform").bind('submit', function () {
            var user_name = $("#user_name").val();
            var password = $("#password").val();
            my.view.load(1);
            my.user.login(user_name, password, function () {
                my.view.load(0);
                my.view.showMain();
            }, function () {
                my.view.message('登录失败，请检查用户名和密码后重试！');
            });
            return false;
        });
        if (my.util.getCookie('loginid')) {
            $("#user_name").val(my.util.getCookie('loginid'));
            my.view.load(1);
            my.user.chkLoginStatus(function () {
                my.view.load(0);
                my.view.showMain();
            }, function () {
                my.view.load(0);
            });
        }
    },
    //主界面
    showMain: function () {
        if ($(".nav").length > 0) {
            my.view.showTable('main');
            return;
        }
        my.moudle = [];//彻底清空历史使用记录
        $(".login").fadeOut(500);
        setTimeout(function () {
            $(".login").remove();
            var res = '<ul class="nav">\
                        <li data-type="运营部"><span class="ico ico1"></span><span class="txt">运营部</span></li>\
                        <li data-type="人事部"><span class="ico ico2"></span><span class="txt">人事部</span></li>\
                        <li data-type="开发部"><span class="ico ico3"></span><span class="txt">开发部</span></li>\
                        <li data-type="工程部"><span class="ico ico4"></span><span class="txt">工程部</span></li>\
                        <li data-type="加工中心"><span class="ico ico5"></span><span class="txt">加工中心</span></li>\
                        <li data-type="门店"><span class="ico ico7"></span><span class="txt">门店</span></li>\
                        <li data-type="仓库"><span class="ico ico8"></span><span class="txt">仓库</span></li>\
                        <li data-type="财务部"><span class="ico ico9"></span><span class="txt">财务部</span></li>\
                        <li data-type="系统配置"><span class="ico ico6"></span><span class="txt">系统配置</span></li>\
                    </ul>\
                    <div class="doc">\
                        <div class="left">\
                        </div>\
                        <div class="right">\
                        </div>\
                        <div class="clear"></div>\
                    </div>\
                    <div class="clear"></div>\
                    <div class="footer">\
                        © 2013&nbsp;&nbsp;&nbsp;&nbsp;山西和合谷餐饮有限公司&nbsp;&nbsp;&nbsp;&nbsp;All Rights Reserved<br>\
                        技术支持：YinG&nbsp;&nbsp;&nbsp;&nbsp;E-mail：<a href="mailto:33098184@qq.com">33098184@qq.com</a>\
                    </div>\
        ';
            var tmpstr = '用户名：' + my.user.info.loginid + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;姓名：' + my.user.info.user_name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门：' + my.user.info.bumen;
            if (my.user.info.bumen == '门店') {
                tmpstr += ' ' + getStoreName(my.user.info.store_id);
            }
            tmpstr += ' <a >退出</a>';

            $(".top .user").html(tmpstr);
            $(".top .user a").unbind().bind('click', function () {
                my.view.load('on');
                my.user.logout(function () {
                    $(".top .user").html('当前帐号：游客');
                    my.view.load('off');
                    my.view.showLogin();
                });
            });
            $(".top").after(res);
            $(".nav li").each(function () {
                if ($(this).data('type') == my.user.bumen) {
                    $(this).addClass('current-item');
                }
            });
            $(".nav li").unbind().bind('click', function () {
                var type = $(this).data('type');
                //var power = my.user.power.split(',');
                //if ($.inArray(type, power) == -1) return my.view.message('权限不足，无法查看。');
                $(".nav li").removeClass('current-item');
                $(this).addClass('current-item');
                my.menu.changeParent(type);
            });
            my.menu.changeParent(my.user.info.bumen);
            my.view.showTable('main');
            my.user.chkTask();//检测用户是否存在任务
        }, 400);
    },
    saveToExcel: function () {
        var title = $(".box_title span").html();
        var table = my.util.getJsonTableData("data");
        var form = document.createElement('form');
        form.action = 'api/excel.php';
        form.method = 'post';
        form.style.display = 'none';
        var input = document.createElement('input');
        input.name = 'array';
        input.value = my.util.toJson({
            'title': title,
            'table': table
        });
        form.appendChild(input);
        document.body.appendChild(form);
        $(form).submit();
    },
    print: function (str) {
        var iframe;
        $(window.frames['iframe_print'].document.body).html('<link href="images/print.css" media="screen" rel="stylesheet" type="text/css" />').append(str);
        $(window.frames['iframe_print'].document.body).find('table').attr('border', '1').attr('width', '100%').css({ 'fontSize': '12px', 'lineHeight': '24px' });
        window.frames['iframe_print'].window.print();
    }
};