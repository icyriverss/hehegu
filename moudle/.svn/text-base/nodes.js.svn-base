my.node = {
    nodelist: {},//节点对象
    //加载节点配置
    loadSource: function (nodelist, el) {
        var t1 = new Date().getTime();
        this.nodes = null;
        this.nodelist = nodelist;
        this.initNodes();//解析成code索引
        this.nodes.el = el;
        var t2 = new Date().getTime();
        
        this.nodes.fresh();
        var t3 = new Date().getTime();
        return;
        this.bindNodeEvent(el);
    },
    //将节点转换为成code索引
    initNodes: function () {
        var _this = this;
        var arr = {};
        $.each(this.nodelist, function () {
            if (!this.code) return true;//没有code的扔掉
            if (!this.parentcode) this.parentcode = '编号';
            arr[this.code] = this;
            arr[this.code].bParse = false;
        });
        this.nodelist = arr;//code索引
        //建立根节点
        this.nodelist['编号'] = { name: '项目名称', code: '编号', kemu: '科目' };
        $.each(arr, function () {
            _this.createNodes(this);
        });
        this.nodes.sortbycode();
    },
    //生成每个节点
    createNodes: function (info) {
        if (info.ref) return info.ref;//已解析
        var node = new my.childnode(info);//新建节点
        //node.nodelist = this.nodelist;
        info.ref = node;//引用之
        if(!info.parentcode){
            this.nodes = node;//根节点
            return node;
        }
        var parent = this.nodelist[info.parentcode];
        //插入到父节点
        if (!parent) return node;//找不到父节点
        if (!parent.bParse) this.createNodes(parent);
        parent.ref.addChild(node);
        return node;
    },
    //绑定某个节点的事件
    bindNodeEvent: function (el) {
        var _this = this;//使用事件代理，加载速度能提高40%
        $('.node_ul', el).die().bind('mouseover', function () {
            $(this).css('background-color', '#D3F0F1').find('.node_edit').find('a').show();
        });
        $('.node_ul', el).bind('mouseout', function () {
            $(this).css('background-color', '#ffffff').find('.node_edit').find('a').hide();
        });
        $('a', el).die().live('click', function () { _this.clickEvent(this); });
        $(".node_ico", el).die().live('click', function () {
            var code = $(this).parent().parent().data('code');
            if (!code) return;
            var ref = _this.nodelist[code].ref;
            ref.open($(this).hasClass('ico_close'));
        });
    },
    //点击事件
    clickEvent: function (el) {
        var eventType = $(el).data('type');
        var code = $(el).parent().parent().data('code');
        var ref = this.nodelist[code].ref;
        if (ref[eventType]) ref[eventType]();
    }
}
my.childnode = function (cfg) {
    if (!cfg) return;
    this.code = cfg.code;
    this.name = cfg.name;
    this.kemu = cfg.kemu;
    this.parentcode = cfg.parentcode;
    this.level = cfg.level;
    this.el = cfg.el;//顶层元素dom

    this.dom = null;//dom引用
    this.childDom = null;//子类dom引用
    this.childs = null;//子节点对象数组
    this.parent = cfg.parent;//父类的引用

    this.bOpen = true;//开关
    this.childsnum = 0;
    this.nodelist = null;//索引过的节点
};
//所有操作之操作自身和子节点，不管父节点，以免混乱
my.childnode.prototype = {
    //删除自身和子节点，父类不管
    del: function () {
        this.removeDom();
        this.parent.removeChild(this.code);
        this.childs = null;
    },
    //修改确认
    editsubmit: function () {
        var name = $('input[name="name"]', this.dom).val();
        var newcode = $('input[name="code"]', this.dom).val();
        var kemu = $('input[name="kemu"]', this.dom).val();
        if (!name) return my.view.message('项目名称不能为空！');
        if (!newcode) return my.view.message('项目编码不能为空！');
        if (newcode != this.code && this.nodelist[newcode]) return my.view.message('已存在该项目编码，请更换重试！');
        this.nodelist[newcode] = this.nodelist[this.code];
        this.name = name;
        this.code = newcode;
        this.kemu = kemu;
        this.fresh();
        //my.util.send('yusuan->editItem', { code: node.code, newcode: newcode, name: name, kemu: kemu, parentcode: node.parentcode }, function (data) {
        //    if (data.status == 0) {
        //        _this.setNode(code, newcode, name, kemu);
        //        _this.setNodeNormal(code);
        //    }
        //});
    },
    //子类增加一个节点
    add: function () {
        var newcode = this.getNewCode();
        var info = { name: '', code: newcode, parentcode: this.code, bParse: true };
        var node = new my.childnode(info);
        this.addChild(node);
        node.sortby = -1;
        this.sortbysort().removeChildsDom().freshChild();
        node.setEditMode();
        info.ref = node;
        node.nodelist = this.nodelist;
        this.nodelist[newcode] = info;
    },
    //获取一个新的可用节点
    getNewCode: function () {
        for (var i = 1; i < 999999999; i++) {
            if (!this.nodelist[this.code + i]) return this.code + i;
        }
    },
    edit: function () {
        $(this.dom).data('status') ? this.setNormalMode() : this.setEditMode();
    },
    //开关
    open: function (b) {
        if (!this.childs) return;
        this.bOpen = b;
        $('.node_ico', this.dom).removeClass().addClass('node_ico').addClass(this.bOpen ? 'ico_open' : 'ico_close');
        if (this.bOpen) {
            if (!this.childDom) this.freshChild();
            $(this.childDom).stop().animate({ height: this.getChildHeight() - 36 }, 300, '', function () { $(this)[0].style.height = 'auto'; });
        } else {
            $(this.childDom).stop().animate({ height: 0 }, 300, '');
        }
    },
    //按sortby排序
    sortbysort: function () {
        if (!this.childs) return this;
        this.childs.sort(function (x, y) {
            return x.sortby - y.sortby;
        });
        $.each(this.childs, function () {
            this.sortbycode();
        });
        return this;
    },
    //按编号重新排序
    sortbycode: function () {
        if (!this.childs) return;
        this.childs.sort(function (x, y) {
            return parseInt(x.code) - parseInt(y.code);
        });
        $.each(this.childs, function () {
            this.sortbycode();
        });
        return this;
    },
    moveUp: function () {
        var node = this.prev();
        if (!node) return;
        this.sortby ^= node.sortby;
        node.sortby ^= this.sortby;
        this.sortby ^= node.sortby;//互换
        this.parent.childs.sort(function (x, y) {//重新排序
            return x.sortby - y.sortby;
        });
        this.parent.removeChildsDom();
        this.parent.fresh();
    },
    moveDown: function () {
        var node = this.next();
        if (!node) return;
        this.sortby ^= node.sortby;
        node.sortby ^= this.sortby;
        this.sortby ^= node.sortby;//互换
        this.parent.childs.sort(function (x, y) {//重新排序
            return x.sortby - y.sortby;
        });
        this.parent.removeChildsDom();
        this.parent.fresh();
    },
    //左移
    moveLeft: function () {
        var parent = this.parent.parentcode ? this.parent.parent : '';
        if (!parent) return;
        this.parent.removeChild(this.code);//父节点移除自身引用
        this.removeDom();//移除dom
        var sortby = this.parent.sortby;
        parent.removeChildsDom();
        parent.addChild(this);//加入新父节点病刷新dom
        this.sortby = sortby;
        parent.sortbysort().freshChild();
    },
    //右移
    moveRight: function () {
        var parent = this.prev();
        if (!parent) return;
        this.parent.removeChild(this.code);//父节点移除自身引用
        this.removeDom();//移除dom
        var sortby = this.parent.sortby;
        parent.addChild(this);//加入新父节点病刷新dom
        this.sortby = sortby;
        parent.sortbysort().removeChildsDom().freshChild();
        return this;
    },
    //获取本节点的上一个同级节点
    prev: function () {
        if (!this.parentcode) return;//顶层，没有同级
        var a, b, _this = this;
        $.each(this.parent.childs, function () {
            if (this.code == _this.code) return false;
            a = this;
        });
        return a;
    },
    //获取本节点的下一个同级节点
    next: function () {
        if (!this.parentcode) return;//顶层，没有同级
        var a, b, _this = this;
        $.each(this.parent.childs, function () {
            if (this.code == _this.code) {
                a = true;
                return true;
            }
            if (!a) return true;
            b = this;
            return false;
        });
        return b;
    },
    //移除所有子节点的dom
    removeChildsDom: function () {
        $(this.childDom).remove();
        this.childDom = null;
        if (!this.childs) return this;
        $.each(this.childs, function () {
            this.removeDom();
        });
        return this;
    },
    //移除自身和子节点的dom
    removeDom: function () {
        $(this.dom).remove();
        this.dom = null;
        this.removeChildsDom();
    },
    //移除子节点，不删除
    removeChild: function (code) {
        var index = this.getChildIndexByCode(code);
        if (index == -1) return this;//不存在
        this.childs.splice(index, 1);
        if ($.isEmptyObject(this.childs)) {//没有子节点了
            $(this.childDom).remove();
            this.childDom = null;
        }
        return this;
    },
    //删除自身某个子节点
    delChild: function (code) {
        var index = this.getChildIndexByCode(code);
        if (index == -1) return this;//不存在
        this.childs[index].del();//删除引用
        this.childs.splice(index, 1);
        if ($.isEmptyObject(this.childs)) {//没有子节点了
            $(this.childDom).remove();
            this.childDom = null;
        }
        return this;
    },
    //根据code索引返回子节点引用
    getChildIndexByCode: function (code) {
        if (!this.childs) return;
        var index = -1;
        $.each(this.childs, function (k) {
            if (this.code == code) {
                index = k; return false;
            }
        })
        return index;
    },
    //添加子节点
    addChild: function (node) {
        if (!this.childs) this.childs = [];
        node.parentcode = this.code;
        node.level = this.level + 1;
        node.parent = this;
        this.childs.push(node);
        return this;
    },
    //刷新本节点的html元素并返回
    fresh: function () {
        var _this = this;
        if (!this.el) return this;//找不到顶层元素
        this.level = this.parentcode ? this.parent.level + 1 : 0;
        var className = this.bOpen ? 'ico_open' : 'ico_close';
        if (!this.dom) {
            this.dom = document.createElement('div');
            $(this.el).append(this.dom);
        }
        $(this.dom).html('').addClass('node_ul').data('code', this.code).append('\
            <div class="node_title">\
                <span class="node_space">'+ new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
                <span class="' + className + ' node_ico"></span>\
                <span class="node_title_txt">' + this.name + '</span>\
            </div>\
            <div class="node_code">' + this.code + '</div>\
            <div class="node_kemu">'+ (this.kemu ? this.kemu : '') + '</div>\
            <div class="node_submit"><a data-type="editsubmit">确认</a></div>');
        if (this.code == '编号') {
            $(this.dom).append('<div class="node_edit"><a data-type="add">[增]</a></div>');
        } else {
            $(this.dom).append('<div class="node_edit"><a data-type="moveUp">[上]</a><a data-type="moveDown">[下]</a><a data-type="moveLeft">[左]</a><a data-type="moveRight">[右]</a><a data-type="add">[增]</a><a data-type="edit">[改]</a><a data-type="del">[删]</a></div>');
        }
        this.freshChild();
        return this;
    },
    //刷新本节点的子节点
    freshChild: function () {
        if (!this.childs) return this;
        if (!this.el) return;//找不到顶层元素
        var _this = this;
        if (!this.bOpen) return;//关闭状态
        if (!this.childDom) {
            this.childDom = document.createElement('div');
            this.childDom.className = 'node_childs';
            $(this.dom).after(this.childDom);
        }
        for (key in this.childs) {
            this.childs[key].el = _this.childDom;
            this.childs[key].sortby = key;//用于排序
            this.childs[key].fresh();
        }
        return this;
    },
    //获取子节点的高度
    getChildHeight: function () {
        var height = 36;
        if (!this.bOpen || !this.childs) return height;
        var _this = this;
        $.each(this.childs, function () {
            height = height + this.getChildHeight();
        });
        return height;
    },
    //设置节点编辑模式
    setEditMode: function () {
        if (!this.dom) return;
        $(this.dom).data('status', 1);
        $('.node_title_txt', this.dom).html('<input type="text" name="name" value="' + this.name + '" style="width:150px;">');
        $('.node_code', this.dom).html('<input type="text" name="code" value="' + this.code + '" style="width:80px;">');
        $('.node_kemu', this.dom).html('<input type="text" name="kemu" value="' + (this.kemu ? this.kemu : '') + '" style="width:80px;">');
        $(".node_submit a", this.dom)[0].style.display = 'block';
        return this;
    },
    //设置节点普通模式
    setNormalMode: function () {
        $(this.dom).data('status', 0);
        $('.node_title_txt', this.dom).html(this.name);
        $('.node_code', this.dom).html(this.code);
        $('.node_kemu', this.dom).html(this.kemu ? this.kemu : '');
        $(".node_submit a", this.dom)[0].style.display = 'none';
        return this;
    }
};


