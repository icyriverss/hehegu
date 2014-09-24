
my.moudle = my.moudle || {};
(function () {
    var a = new my.table();
    var prop = {
        method: 'personnel->getPersonelWage',
        template_url: 'view/rs_store_wage.html',
        title: '人员管理-薪资统计',
        perpage:10,
        page: 1,
        userid: '',
        output: 0,
        department_id: 0,
        storeid: '',
        chejianid: '',
        bagid: '',
        init: function () {
            var date = new Date();
            if (!this.year) this.year = date.getFullYear();
            if (!this.month) this.month = date.getMonth() + 1;
            this.store_id = this.store_id || getOneStore_ID();
            this.arges = {
                year: this.year,
                month: this.month,
                page: this.page,
                perpage: this.perpage,
                department_id: this.department_id,
                store_id: this.store_id,
                chejian_id: this.chejianid,
                bag_id: this.bagid
            };
        },	
        initData:function(data){
            this.data = data;
   //         this.data.departments = my.departments;
//            this.data.department = getDepartmentName(this.data.department_id);
//            this.data.stores = my.stores;
//            this.data.chejians = my.chejians;
//            this.data.bags = my.bags;
        }
    };
    my.extend(a, prop);
    my.moudle.rs_store_wage = a;
})();