
my.node_child = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode:'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.code] = this;
        });
        //生成节点对象
        var baseinfo = { code: '编号', name: '项目名称', level: 0, parentcode: '',kemu:'科目' };
        var baseNode = new my.child_child(baseinfo);//根节点
        this.nodes = baseNode;
        $.each(this.nodelist, function () {
            _this.createChild(this);
        });
        this.nodes.open();
        $(el).append(this.nodes.fresh());
        this.nodelist['编号'] = baseinfo;
        this.nodelist['编号'].ref = this.nodes;
        this.bindEvent();
    },
    getChildByCode: function (code) {
        return this.nodelist[code].ref;
    },
    createChild: function (cfg) {
        if (!cfg) return;
        var child = new my.child_child(cfg);
        if (cfg.parentcode) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parentcode] || !this.nodelist[cfg.parentcode].ref) {
                if (!this.nodelist[cfg.parentcode]) return;
                var parent = this.createChild(this.nodelist[cfg.parentcode]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parentcode].ref.addChild(child);
            }
        } else {
            cfg.parentcode = '编号';
            child.parentcode = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        console.log(this.getTime() - this.starttime);
    },
    bindEvent: function () {
        var _this = this;
        $(".node_ul",this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#D3F0F1').find('.node_edit').show();
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            $(this).css('background-color', '#F5F5F5').find('.node_edit').hide();
        });
        $('a', this.el).unbind().bind('click', function (e) {
            e.stopPropagation();
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            var type = $(this).data('type');
            _this.clickEvent(code,type);
        });
        $(".node_ul", this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    },
    clickEvent: function (code, type) {
        var _this = this;
        console.log(code);
        if (type == 'add') {
            _this.addChild(code);
        } else if (type == 'del') {
            if (confirm('是否确定删除？删除后将不可恢复！')) {
                my.util.send('yusuan->delItem', {
                    code: code
                }, function (data) {
                    if (data.status != 0) return my.view.message('删除失败！');
                    _this.nodelist[_this.nodelist[code].parentcode].ref.delChild(code);
                });
            }
        } else if (type == 'edit') {
            _this.editChild(code);
        }
    },
    addChild: function (parentcode) {
        var _this = this;
        var parent = this.getChildByCode(parentcode);
        if (parent.status == 0) {
            parent.changeStatus();
        }
        var code = parent.createChildCode();
        var info = { code: code, name: '', parentcode: parentcode, level: parent.level + 1 };
        var child = new my.child_child(info);
        var dom = parent.getChildDom();
        if (dom.length == 0) {
            parent.getDom().after('<div class="node_childs" id="child'+parent.code+'"></div>');
            dom = parent.getChildDom();
        }
        $(dom).prepend(child.editHtml());
        var el = dom;
        this.mode = 'edit';
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            var newcode = $("input[name='code']", el).val();
            if (type == 'editcancel') {
                $("#code" + code).remove();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('yusuan->addItem', {
                    code: $("input[name='code']", el).val(),
                    parentcode: parentcode=='编号'?'':parentcode,
                    name: $("input[name='name']", el).val(),
                    kemu:$("input[name='kemu']",el).val(),
                    isitem:1
                }, function (data) {
                    if (data.status == 1) return my.view.message('请输入项目名称和编号！');
                    if (data.status == 2) return my.view.message('存在重复的项目编号，请更换重试！');
                    if (data.status == 3) return my.view.message('父类编号不存在！');
                    if (data.status != 0) return my.view.message('添加失败，请重试！');
                    my.view.message('添加成功！', 1, function () {
                        child.getDom().attr('id', 'code' + newcode);
                        info.code = $("input[name='code']", el).val();
                        child.code = $("input[name='code']", el).val();
                        child.name = $("input[name='name']", el).val();
                        child.kemu = $("input[name='kemu']", el).val();
                        parent.addChild(child);
                        _this.nodelist[code] = info;
                        _this.nodelist[code].ref = child;
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    },
    editChild: function (code) {
        var _this = this;
        var child = this.getChildByCode(code);
        this.mode = 'edit';
        child.setEditMode();
        var el = child.getDom();
        $("a", el).unbind().bind('click', function (e) {
            e.stopPropagation();
            var type = $(this).data('type');
            var newcode = $("input[name='code']", el).val();
            if (type == 'editcancel') {
                child.setBaseType();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('yusuan->editItem', {
                    code:code,
                    newcode: newcode,
                    name: $("input[name='name']", el).val(),
                    kemu: $("input[name='kemu']", el).val(),
                    isitem: 1
                }, function (data) {
                    if (data.status == 1) return my.view.message('请输入项目名称和编号！');
                    if (data.status == 2) return my.view.message('存在重复的项目编号，请更换重试！');
                    if (data.status == 3) return my.view.message('父类编号不存在！');
                    if (data.status != 0) return my.view.message('添加失败，请重试！');
                    my.view.message('修改成功！', 1, function () {
                        child.getDom().attr('id', 'code' + newcode);
                        child.code = newcode;
                        child.name = $("input[name='name']", el).val();
                        child.kemu = $("input[name='kemu']", el).val();
                        _this.nodelist[newcode] = { name: child.name, code: child.code, parentcode: child.parentcode };
                        _this.nodelist[newcode].ref = child;
                        if (newcode != code) {
                            delete _this.nodelist[code];
                        }
                        _this.mode = 'base';
                        child.setBaseType();
                        _this.bindEvent();
                    });
                });
            }
        });
    }
};
//所有节点
my.child_child = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu;
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.status = cfg.status ? 1 : 0;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_child.prototype = {
    //创建一个新的可用的节点ID
    createChildCode:function(){
        if ($.isEmptyObject(this.childs)) {
            return this.code + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.code) + 1;
            });
            return code;
        }
    },
    changeStatus:function(){
        return this.status == 1 ? this.close() : this.open();
    },
    addChild: function (child) {
        this.childs.push(child);
        child.setLevel(this.level + 1);
        return this;
    },
    setLevel: function (level) {
        this.level = level;
        return this;
    },
    open:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close:function(){
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show:function(){
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide:function(){
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove:function(){
        this.getDom().remove();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.remove();
            })
        }
    },
    //删除某个子节点
    delChild: function (code) {
        var _this = this;
        $.each(this.childs, function (k) {
            if (this.code == code) {
                this.remove();
                delete _this.childs[k];
                return false;
            }
        })
    },
    fresh: function () {
        var _this = this;
        if ($.isEmptyObject(this.childs)) return this.getHtml();
        var str = this.getHtml();
        str += '<div class=node_childs id="child' + this.code + '" ' + (this.level != 0 ? 'style="display:none"' : '') + '>';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.code + '" data-code="' + this.code + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs) ? 'ico_open' : 'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.name + '</span></div>\
            <div class="node_code">'+ this.code + '</div>\
            <div class="node_kemu">'+this.kemu +'</div>\
            <div class="node_submit"><a data-type="editsubmit" code="' + this.code + '">确认</a><a data-type="editcancel" code="' + this.code + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="'+ this.code + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.code + '">[修改]</a>\
            <a data-type="del" data-code="' + this.code + '">[删除]</a></div></div>';
    },
    getDom: function () {
        return $("#code" + this.code);
    },
    getChildDom: function () {
        return $("#child" + this.code);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.name); 
        $('.node_code', dom).html(this.code);
        $('.node_kemu', dom).html(this.kemu?this.kemu:'');
        $(".node_submit", dom).hide();
        $(dom).data('code', this.code);
        
        $("a", dom).data('code', this.code);
    },
    //设置节点编辑模式
    setEditMode: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html('<input type="text" name="name" value="' + this.name + '" style="width:150px;">');
        $('.node_code', dom).html('<input type="text" name="code" value="' + this.code + '" style="width:80px;">');
        $('.node_kemu', dom).html('<input type="text" name="kemu" value="' + (this.kemu ? this.kemu : '') + '" style="width:80px;">');
        $(".node_edit", dom).hide();
        $(".node_submit", dom).show();
        return this;
    },
    editHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.code + '" data-code="' + this.code + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="ico_open node_ico"></span>\
            <span class="node_title_txt"><input type="text" name="name" value="" style="width:150px;"></span></div>\
            <div class="node_code"><input type="text" name="code" value="' + this.code + '" style="width:80px;"></div>\
            <div class="node_kemu"><input type="text" name="kemu" value="' + (this.kemu ? this.kemu : '') + '" style="width:80px;"></div>\
            <div class="node_submit" style="display:block"><a data-type="editsubmit" code="' + this.code + '">确认</a><a data-type="editcancel" code="' + this.code + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="' + this.code + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.code + '">[修改]</a>\
            <a data-type="del" data-code="' + this.code + '">[删除]</a></div></div>';
    }
};

