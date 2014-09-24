(function () {
    //用户消息管理对象
    var notice = {
        list:[],//消息队列
        index:0,//索引序号
        add: function (msg,cb) {
            this.index++;
            var res = '<div class="notice"><h4><a class="ico ico_notice"></a><span>' + msg + '</span><a class="ico ico_notice_arrow"></a></h4></div>';
            $(".nav").append(res);
            $(".nav h4").click(function () {
                if (cb && typeof cb == 'function') cb();
            });
            $(".notice h4").bind('mouseover', function () {
                $(".notice .ico_notice_arrow")[0].style.cssText += '-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);';
                $(this).height($('span', this).outerHeight() + 13);
            });
            $(".notice h4").bind('mouseout', function () {
                $(".notice .ico_notice_arrow")[0].style.cssText += '-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);';
                $(this).height('28px');
            });
        },
        remove: function (index) {


        },
        clear: function () {
            if ($(".notice").length > 0) $(".notice").remove();
        }
    }
    my.notice = notice;
})()