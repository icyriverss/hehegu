/*
my.table类
    变量
    title：表格大标题
    title_tips：大标题tips内容
    year：年份，2011/2012
    month：月份，一月/二月
    store：分店名
    store_id：分店id
    config：表格配置对象
    hasYear：布尔，是否包含年份选择器
    hasMonth：布尔，是否包含月份选择器
    hasStore：布尔，是否包含分店选择器
    hasQuickTime：布尔，是否包含快速选择年历表/月历表/日历表
    qucikTimeType：nianli/yueli/rili，当前所属年历表/月历表/日历表
    baseTableName：'yy_sell'，当前所属基础表（快速切换时，根据此名称生成日历表/月历表/年历表名称，如yy_sell_yueli）


    方法
    getData(callback)：公有，从服务器获取所需数据
    getTableHtml：公有，获取表格的html
    getTitle：生成表格大标题（过滤标题配置中分店名称/年份/月份）
*/
my.table = function () {

};
my.table.prototype = {
    title: '',//表格标题，可使用{title}{year}{month}标签
    tips: '',//表格标题的提示文字
    year: '',//年
    month: '',//月份
    store: '',//分店名称，目前版本已去掉
    store_id: null,//分店ID，数组
    config: {},//配置，目前版本已经去掉
    current_quick: '',// nianli / yueli / rili / 自定义字符
    quick: [],//nianli / yueli / rili
    jsurl: '',//js地址
    method: '',//默认调用方法
    arges: {},//api接口参数
    page: 1,//页码
    output: 1,//导出excel
    selection: 'tr',//选择高亮方式，tr或td
    startday: '',//起始日期
    endday: '',//结束日期
    data: {},//缓存数据
    async: {},//异步操作队列
    init: function () {//初始化配置,子类改写
    },
    initData: function (data) {//初始化获取到的数据,子类改写
        this.data = data;
    },
    bindEvent: function () {//生成并写入表格后，绑定表格事件，子类改写。
    },
    //获取数据
    getData: function (cb) {
        var _this = this;
        if (!this.method) {//没有方法 则不获取
            if (cb && typeof cb == 'function') cb();
            return;
        }
        my.util.send(this.method, this.arges, function (data) {
            _this.initData(data);//初始化数据
            try {

            } catch (e) {
                return my.view.message('该报表数据处理出错，请联系管理员！');
            }
            if (cb && typeof cb == 'function') cb();
        });
    },
    //生成表格数据
    getTableHtml: function () {
        var _this = this;
        this.data.sortBy = this.sortBy;
        this.data.sortStatus = this.sortStatus;
        var html = my.debug ? get_template_html(this.template_url + "?t=" + Math.random()) : get_template_html(this.template_url + "?ver=" + version);
        html = template(html, this.data);
        return html;
    },
    //获取大标题
    getTitle: function () {
        return this.title ? this.title.replace(/{year}/g, this.year).replace(/{month}/g, this.month).replace(/{store_name}/g, getStoreName(this.store_id)).replace(/{startday}/g, this.startday).replace(/{endday}/g, this.endday).replace(/{dayopt}/g, this.dayopt) : '';
    },
    //获取tips
    getTips: function () {
        return this.tips;
    },
    //切换分店
    changeStore: function (arr) {
        this.store_id = arr;
    },
    //切换车间
    changeChejian: function (arr) {
        this.chejian_id = arr;
    },
    //切换仓库
    changeBag: function (arr) {
        this.bag_id = arr;
    },
    //切换年份
    changeYear: function (year) {
        this.year = year;
    },
    //切换月份
    changeMonth: function (month) {
        this.month = month;
        if (this.dayopt)
            this.dayopt = 1;
    },
    //切换日
    changeDay: function (day) {
        this.dayopt = day
    },
    //切换类别，年历/月历/日历
    changeType: function (type) {

    },
    //设置每页显示条数
    setPerpage: function (perpage) {
        if (!perpage) perpage = 10;
        this.perpage = perpage;
    },
    //切换分页
    setPage: function (page) {
        if (!page) page = 1;
        this.page = page;
    },
    //切换日期范围
    changeStartDay: function (date) {
        this.startday = date;
    },
    changeEndDay: function (date) {
        this.endday = date;
    },
    //排序。字段、顺序/逆序
    sort: function (field, status) {
        if (!field) return;
        this.sortBy = field;
        this.sortStatus = status;
        this.data.list.sort(function (x, y) {
            return status ? y[field] - x[field] : x[field] - y[field];
        });
    },
    //执行异步操作队列
    runThread: function (cb) {
        $.each(this.async, function () {
            if (!this.status) {
                this.func(cb);
                this.status = 1;
            }
        });
    },
    //结束某异步操作
    endThread: function (name) {
        this.async[name].status = 2;
    },
    //检测是否有异步函数在运行。避免部分报表读取时间过长，可将部分接口在此函数中异步调用。
    chkThread: function () {
        var bRun = false;
        $.each(this.async, function () {
            if (this.status == 1 || !this.status) {//正在执行中
                bRun = true;
                return true;
            }
        });
        return !bRun;
    }
};