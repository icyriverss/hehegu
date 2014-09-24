//翻页类
/*
传入参数：
    写入的JQUERY对象，
    总数，
    每页条数，
    页数，
    翻页处理回调函数，
    修改每页条数函数
*/
my.querypage = {
    show: function (el,total,perpage,page,gopage,setperpage) {
        var container = document.createDocumentFragment();
        var str = '';
        var maxpage = Math.ceil(total / perpage);
        if (page < 1) page = 1;
        if (page > maxpage) page = maxpage;
        str += '<a data-page="1">首页</a>';
        str += '<a data-page="' + (page - 1) + '">上一页</a>';
        str += '<a data-page="' + (page + 1) + '">下一页</a>';
        str += '<a data-page="' + (maxpage) + '">尾页</a>';
        str += '共有' + total + '条记录&nbsp;&nbsp;&nbsp;&nbsp;当前第' + page + '页/' + maxpage + '页&nbsp;&nbsp;&nbsp;&nbsp;';
        str += '每页显示<input type="text" style="width:30px;" value="' + perpage + '" name="perpage">条记录';
        $(container).append(str);
        $(el).append(container);
        $('a', $(el)).bind('click', function () {
            var page = $(this).data('page');
            
            if (gopage && typeof gopage == 'function') gopage(page);
        });
        $('input[name="perpage"]', $(el)).bind('change', function () {
            var perpage = parseInt($(this).val());
            if (isNaN(perpage)) perpage = 10;
            if (perpage < 1) perpage = 1;
            if (perpage > 100) perpage = 100;
            if (setperpage && typeof setperpage == 'function') setperpage(perpage);
        });
    }
}