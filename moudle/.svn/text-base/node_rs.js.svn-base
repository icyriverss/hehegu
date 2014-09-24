
my.node_rs = {
    nodelist: {},//节点对象
    nodes: {},//解析过的所有节点
    starttime: null,
    el: null,
    mode: 'base',
    //加载节点配置。节点数组和绑定的dom元素
    loadSource: function (nodelist, el) {
        var _this = this;
        this.el = el;
        this.mode = 'base';
        this.nodelist = {};
        this.nodes = {};
        //转换为code索引
        $.each(nodelist, function () {
            _this.nodelist[this.id] = this;
        });
        //生成节点对象
        var baseinfo = { id: '编号', department: '项目名称', level: 0, parent_id: '' };
        var baseNode = new my.child_rs(baseinfo);//根节点
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
        var child = new my.child_rs(cfg);
        if (cfg.parent_id) {//父类没创建，先创建父类
            if (!this.nodelist[cfg.parent_id] || !this.nodelist[cfg.parent_id].ref) {
                if (!this.nodelist[cfg.parent_id]) return;
                var parent = this.createChild(this.nodelist[cfg.parent_id]);
                parent.addChild(child);
            } else {
                this.nodelist[cfg.parent_id].ref.addChild(child);
            }
        } else {
            cfg.parent_id = '编号';
            child.parent_id = '编号';
            this.nodes.addChild(child);
        }
        cfg.ref = child;
        return child;
    },
    getTime: function () {
        return new Date().getTime();
    },
    runTime: function () {
        //console.log(this.getTime() - this.starttime);
    },
    bindEvent: function () {
        var _this = this;
        $(".node_ul", this.el).unbind().bind('mouseover', function () {
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
            _this.clickEvent(code, type);
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
        if (type == 'add') {
            _this.addChild(code);
        } else if (type == 'del') {
            if (confirm('是否确定删除？删除后将不可恢复！')) {
                my.util.send('personnel->delDepartmentInfo', {
                    id: code
                }, function (data) {
                    if (data.status != 0) return my.view.message('删除失败！');
                    _this.nodelist[_this.nodelist[code].parent_id].ref.delChild(code);
                });
            }
        } else if (type == 'edit') {
            _this.editChild(code);
        } else if (type == 'zhiwei') {
            my.zhiwei.show(_this.nodelist[code]);
        }
    },
    addChild: function (parent_id) {
        var _this = this;
        var parent = this.getChildByCode(parent_id);
        if (parent.status == 0) {
            parent.changeStatus();
        }
        var id = parent.createChildCode();
        var info = { id: id, name: '', parent_id: parent_id, level: parent.level + 1 };
        var child = new my.child_rs(info);
        var dom = parent.getChildDom();
        if (dom.length == 0) {
            parent.getDom().after('<div class="node_rss" id="child' + parent.id + '"></div>');
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
                $("#code" + id).remove();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('personnel->add_department', {
                    parent_id: parent_id == '编号' ? '' : parent_id,
                    department: $("input[name='name']", el).val()
                }, function (data) {
                    if (data.status != 0) return my.view.message('添加失败！');
                    my.view.message('添加成功！', 1, function () {
                        newcode = data.id;
                        child.getDom().attr('id', 'code' + newcode);
                        info.id = newcode;
                        child.id = newcode;
                        child.department = $("input[name='name']", el).val();
                        parent.addChild(child);
                        _this.nodelist[newcode] = info;
                        _this.nodelist[newcode].ref = child;
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
            if (type == 'editcancel') {
                child.setBaseType();
                _this.mode = 'base';
                _this.bindEvent();
            } else if (type == 'editsubmit') {
                my.util.send('personnel->editDepartment', {
                    id: code,
                    department: $("input[name='name']", el).val()
                }, function (data) {
                    if (data.status != 0) return my.view.message('修改失败！');
                    my.view.message('修改成功！', 1, function () {
                        child.getDom().attr('id', 'code' + code);
                        child.department = $("input[name='name']", el).val();
                        _this.nodelist[code]['name'] = child.department;
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
my.child_rs = function (cfg) {
    if (!cfg) return;
    this.id = cfg.id;
    this.department = cfg.department;
    this.kemu = cfg.kemu;
    this.parent_id = cfg.parent_id;
    this.level = cfg.level;
    this.disedit = cfg.disedit;
    this.status = cfg.status ? 0 : 1;//打开 关闭状态，1为打开
    this.childs = [];
};
my.child_rs.prototype = {
    //创建一个新的可用的节点ID
    createChildCode: function () {
        return '';
        if ($.isEmptyObject(this.childs)) {
            return this.id + '01';
        } else {
            var code = '';
            $.each(this.childs, function () {
                code = parseInt(this.id) + 1;
            });
            return code;
        }
    },
    changeStatus: function () {
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
    open: function () {
        if (!$.isEmptyObject(this.childs)) {
            this.status = 1;
            $('.node_ico', this.getDom()).removeClass('ico_close').addClass('ico_open');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    close: function () {
        if (!$.isEmptyObject(this.childs)) {
            this.status = 0;
            $('.node_ico', this.getDom()).removeClass('ico_open').addClass('ico_close');
            this.getChildDom().slideToggle();
        }
        return this;
    },
    //显示
    show: function () {
        $(this.getDom()).show();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.show();
            });
        }
    },
    //隐藏
    hide: function () {
        $(this.getDom()).hide();
        if (!$.isEmptyObject(this.childs)) {
            $.each(this.childs, function () {
                this.hide();
            });
        }
    },
    //移除自身和子节点
    remove: function () {
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
        str += '<div class=node_rss id="child' + this.id + '" >';
        $.each(this.childs, function () {
            str += this.fresh();
        });
        str += '</div>';
        return str;
    },
    getHtml: function () {
        var str= '<div class="node_ul" id="' + 'code' + this.id + '" data-code="' + this.id + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="' + (this.status ? 'ico_open' : ($.isEmptyObject(this.childs) ? 'ico_open' : 'ico_close')) + ' node_ico"></span>\
            <span class="node_title_txt">'+ this.department + '</span></div>\
            <div class="node_code">'+ this.id + '</div>\
            <div class="node_submit"><a data-type="editsubmit" code="' + this.id + '">确认</a><a data-type="editcancel" code="' + this.id + '">取消</a></div>\
            <div class="node_edit">';
        str += this.id=='编号'?'':'<a data-type="zhiwei" data-code="'+this.id+'">[岗位管理]</a>';
        str +=this.disedit?'':'<a data-type="add" data-code="'+ this.id + '">[新增子类]</a>';
        str += (this.id == '编号'||this.disedit) ? '' : '<a data-type="edit" data-code="' + this.id + '">[修改]</a>\
            <a data-type="del" data-code="' + this.id + '">[删除]</a>';
        str += '</div></div>';
        return str;
    },
    getDom: function () {
        return $("#code" + this.id);
    },
    getChildDom: function () {
        return $("#child" + this.id);
    },
    setBaseType: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html(this.department);
        $('.node_code', dom).html(this.id);
        $(".node_submit", dom).hide();
        $(dom).data('code', this.id);

        $("a", dom).data('code', this.id);
    },
    //设置节点编辑模式
    setEditMode: function () {
        var dom = this.getDom();
        $('.node_title_txt', dom).html('<input type="text" name="name" value="' + this.department + '" style="width:150px;">');
        $('.node_code', dom).html(this.id);
        $(".node_edit", dom).hide();
        $(".node_submit", dom).show();
        return this;
    },
    editHtml: function () {
        return '<div class="node_ul" id="' + 'code' + this.id + '" data-code="' + this.id + '"><div class="node_title">\
            <span class="node_space">' + new Array(this.level + 1).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>\
            <span class="ico_open node_ico"></span>\
            <span class="node_title_txt"><input type="text" name="name" value="" style="width:150px;"></span></div>\
            <div class="node_code">' + this.id + '</div>\
            <div class="node_submit" style="display:block"><a data-type="editsubmit" code="' + this.id + '">确认</a><a data-type="editcancel" code="' + this.id + '">取消</a></div>\
            <div class="node_edit"><a data-type="add" data-code="' + this.id + '">[新增子类]</a>\
            <a data-type="edit" data-code="' + this.id + '">[修改]</a>\
            <a data-type="del" data-code="' + this.id + '">[删除]</a></div></div>';
    }
};

