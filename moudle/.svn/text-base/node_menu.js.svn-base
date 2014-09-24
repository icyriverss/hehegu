
my.node_menu = {
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
        var baseinfo = { code: '编号', name: '项目名称', level: 0, parentcode: '' };
        var baseNode = new my.child_menu(baseinfo);//根节点
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
        var child = new my.child_menu(cfg);
        if (cfg.parentcode) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parentcode] || !this.nodelist[cfg.parentcode].ref) {
                if (!this.nodelist[cfg.parentcode]) return;
                var parent = this.createChild(this.nodelist[cfg.parentcode]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parentcode].ref.addChild(child);
            }
        } else {
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
        
        $(".node_ul", this.el).unbind().bind('mouseover', function () {
            if (_this.mode == 'edit') return;
            $(this).css('background-color', '#53E2E6');
        });
        $(".node_ul", this.el).bind('mouseout', function () {
            if ($(this).data('isclick')) return;
            $(this).css('background-color', '#e5e5e5');
        });
        $(".node_ico",this.el).bind('click', function () {
            if (_this.mode == 'edit') return;
            var code = $(this).parent().parent().data('code');
            if (!code || code == '编号') return;
            _this.getChildByCode(code).changeStatus();
        });
    }
};
//所有节点
my.child_menu = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu;
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.status = cfg.status ? 1 : 0;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_menu.prototype = {
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
            if (this.id == code) {
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
        str += '<div class=node_childs id="child_more' + this.code + '" ' + (this.level != 0 ? 'style="display:none"' : '') + '>';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        return '<div class="node_ul" id="'+'code_more' + this.code+'" data-code="'+this.code+'"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs)?'ico_open':'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.name + '</span></div>\
            <div class="node_code">'+ this.code + '</div></div>';
    },
    getDom: function () {
        return $("#code_more" + this.code);
    },
    getChildDom: function () {
        return $("#child_more" + this.code);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.name);
        $('.node_code', dom).html(this.code);
        $(".node_submit", dom).hide();
        $(dom).data('code', this.code);
        
        $("a", dom).data('code', this.code);
    }
};

