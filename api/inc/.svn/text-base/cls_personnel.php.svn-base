<?php

class cls_personnel {

    private $db;
    private $t6db;

    function __construct() {
        global $localdb;
        global $t6db;
        $this->db = $localdb;
        $this->t6db = $t6db;
    }
    
    //外卖测试
    function store_waimai($arr) {
        $store_ip = array(
            '0201' => '172.129.1.201',
            '0202' => '172.129.2.201',
            '0203' => '172.129.3.201',
            '0204' => '172.129.4.201',
            '0205' => '172.129.5.201',
            '0206' => '172.129.6.201',
            '0207' => '172.129.7.201',
            '0208' => '172.129.8.201',
            '0209' => '172.129.9.201',
            '0210' => '172.129.10.201',
            '0211' => '172.129.11.201',
            '0212' => '172.129.12.201',
            '0213' => '172.129.13.201',
            '0214' => '172.129.14.201',
            '0215' => '172.129.15.201',
            '8888' => '10.128.1.100',
        );
        $show = array();
        $store_id = $arr['store_id'];
        $begintime = $arr['startday'];
        $endtime = $arr['endday'];
        if (empty($store_id)) {
            return $show;
        }
        if (array_key_exists($store_id, $store_ip)) {
            //连接MSSQL
            $db_local = array(//数据库配置
                'server' => $store_ip[$store_id], //服务器地址
                'user' => 'sa', //用户名
                'pass' => $store_ip[$store_id] == '10.128.1.100' ? 'HHGsx_10!' : 'Bjsiss_918', //密码
                'dbname' => 'issfoodv5_branch', //数据库名称
                'CharacterSet' => 'UTF-8'//编码,不用修改
            );
            $localdb = new mssql_class;
            $localdb->connect($db_local['server'], $db_local['user'], $db_local['pass'], $db_local['dbname'], $db_local['CharacterSet'], 0);
            if (!empty($localdb->err)) {
                $show[$store_id]['total'] = '无法连接';
                return $show;
            }
            //接电话个数
            $sql = "select count(DISTINCT vch_tel) as total from cybr_u_togo where  ch_payflag='Y' and vch_tel<>'' and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59'";
            $show[$store_id]['total'] = $localdb->result_first($sql);
            //新增个数
            $sql = "select count(DISTINCT vch_tel) as newAdd "
                    . "from cybr_u_togo "
                    . "where ch_payflag='Y' and vch_tel<>'' and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59'"
                    . "and vch_tel in(select DISTINCT vch_handtel from t_mhq_member where ch_typeno=99 and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59') ";
            $show[$store_id]['newAdd'] = $localdb->result_first($sql);
            //没地址个数
            $sql = "select count(DISTINCT vch_tel) as noaddress "
                    . "from cybr_u_togo "
                    . "where  ch_payflag='Y' and vch_tel<>'' and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59'"
                    . "and vch_tel in(select DISTINCT vch_handtel from t_mhq_member where ch_typeno=99 and (vch_address='默认地址' or vch_address='' or vch_address is NULL)) ";
            $show[$store_id]['noaddress'] = $localdb->result_first($sql);
        }
        return $show;
    }

    //外卖测试
    function testwm($arr){
        global $msdb;
        $show = array();
        $stores = $arr['stores'];
        if ($stores == '') {
            $stores_str = "ch_branchno <>'' and";
        } else {
            $stores_str = "ch_branchno in (" . join(',', $stores) . ") and ";
        }
        $begintime = $arr['startday'];
        $endtime = $arr['endday'];
        //接电话个数
        $sql = "select ch_branchno,count(*) as total from cyhq_u_togo where ".$stores_str."  ch_payflag='Y' and vch_tel<>'' and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59' group by ch_branchno";
        $total = $msdb->fetch_all($sql);
        if(empty($total)){ return $show;}
        foreach($total as $k=>$v){
            $show[$v['ch_branchno']]['total'] = $v['total'];
        }
        //新增个数
        $sql = "select ch_branchno,count(*) as newAdd "
                . "from cyhq_u_togo "
                . "where ".$stores_str."  ch_payflag='Y' and vch_tel<>'' and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59'"
                . "and vch_tel in(select vch_handtel from t_hq_m_member where ch_typeno=99 and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59') "
                . "group by ch_branchno ";
        $newAdd = $msdb->fetch_all($sql);
        if(!empty($newAdd)){
            foreach($newAdd as $k=>$v){
                $show[$v['ch_branchno']]['newAdd'] = $v['newAdd'];
            }
        }
        //没地址个数
        $sql = "select ch_branchno,count(*) as noaddress "
                . "from cyhq_u_togo "
                . "where ".$stores_str."  ch_payflag='Y' and vch_tel<>'' and dt_operdate >= '$begintime 00:00:00' and dt_operdate <= '$endtime 23:59:59'"
                . "and vch_tel in(select DISTINCT vch_handtel from t_hq_m_member where ch_typeno=99 and (vch_address='默认地址' or vch_address='' or vch_address is NULL)) "
                . "group by ch_branchno ";
        $noaddress = $msdb->fetch_all($sql);
        if(!empty($noaddress)){
            foreach($noaddress as $k=>$v){
                $show[$v['ch_branchno']]['noaddress'] = $v['noaddress'];
            }
        }
       return $show;
    }
    //部门录入
    function add_department($arr) {
        $department = parsepoststr($arr['department']);
        $parent_id = int_val($arr['parent_id']);
        if ($department == '') {
            return array('status' => 2);
        }
        $sql = "insert into personnel_department(department,parent_id) values('" . $department . "','" . $parent_id . "')";
        if ($this->db->query($sql)) {
            $id = $this->db->result_first("select top 1 id from personnel_department where department='$department' and parent_id='$parent_id' order by id desc");
            return array('status' => 0, 'id' => $id);
        }
    }

    //修改部门
    function editDepartment($arr) {
        $id = int_val($arr['id']);
        $bhas = $this->db->fetch_first("select * from personnel_department where id='$id'");
        if (!$bhas)
            return array('status' => 1);
        $department = parsepoststr($arr['department']);
        $sql = "update personnel_department set department='$department' where id='$id'";
        $this->db->query($sql);
        return array('status' => 0);
    }

    //删除部门信息
    function delDepartmentInfo($arr) {
        $id = int_val($arr['id']);
        $sql = "select id from personnel_job where department_id=" . $id;
        $job = $this->db->fetch_first($sql);
        if (!empty($job)) {
            return array('status' => 1);
        }//有子分类不能删除
        $sql = "delete from personnel_department where id=" . $id;
        if ($this->db->query($sql)) {
            return array('status' => 0);
        }
    }

    //获取部门信息
    function getDepartmentInfo($arr) {
        $id = int_val($arr['id']);
        $sql = "select * from personnel_department where id='$id'";
        return $this->db->fetch_first($sql);
    }

    //部门列表
    function department_list($arr) {
        $sql = "select * from personnel_department order by id desc";
        $res = $this->db->query($sql);
        while ($list = $this->db->fetch_array($res)) {
            $department[] = $list;
        }
        return array('list' => $department);
    }

    //职位录入
    function add_job($arr) {
        $job = parsepoststr($arr['job']);
        $parent_id = int_val($arr['parent_id']);
        $department_id = int_val($arr['department_id']);

        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        if ($job == '' || ($department_id == 0 && !$store_id && !$chejian_id && !$bag_id)) {
            return array('status' => 2);
        }
        $sql = "insert into personnel_job(job,parent_id,department_id,store_id,chejian_id,bag_id) values('" . $job . "','" . $parent_id . "','" . $department_id . "','" . $store_id . "','" . $chejian_id . "','" . $bag_id . "')";
        if ($this->db->query($sql)) {
            return array('status' => 0);
        }
    }

    //修改职位
    function edit_job($arr) {
        $id = int_val($arr['id']);
        $job = parsepoststr($arr['job']);
        $job_level = int_val($arr['job_level']);
        $parent_id = int_val($arr['parent_id']);
        $department_id = int_val($arr['department_id']);
        $plan_nums = int_val($arr['plan_nums']);
        $wage = int_val($arr['wage']);
        $begin_time = date('Y-m-d', time());
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        if (($id == 0) || ($job == '') || ($department_id == 0 && !$store_id && !$chejian_id && !$bag_id) || ($plan_nums == 0)) {
            return array('status' => 2);
        }
        $sql = "update personnel_job set 
				job = '" . $job . "',
				job_level = '" . $job_level . "',
				parent_id ='" . $parent_id . "',
				department_id = '" . $department_id . "',
				store_id = '" . $store_id . "',
				chejian_id = '" . $chejian_id . "',
				bag_id = '" . $bag_id . "'  
				where id='" . $id . "'
		";
        if ($this->db->query($sql)) {
            $sql = "select top 1 * from personnel_job_cache where job_id='" . $id . "' order by begin_time desc,id desc";
            $cache = $this->db->fetch_first($sql);
            if (!empty($cache)) {
                $old_plan_nums = $cache['plan_nums'];
                $old_wage = $cache['wage'];
            } else {
                $old_plan_nums = 0;
                $old_wage = 0;
            }
            $sql = "insert into personnel_job_cache(job_id,plan_nums,wage,begin_time,old_plan_nums,old_wage,job_level) values('" . $id . "','" . $plan_nums . "','" . $wage . "','" . $begin_time . "','" . $old_plan_nums . "','" . $old_wage . "','" . $job_level . "')";
            if ($this->db->query($sql)) {
                return array('status' => 0);
            }
        }
    }

    //获取职位信息
    function get_job_info($arr) {
        $id = int_val($arr['id']);
        $sql = "select * from personnel_job where id=" . $id;
        $personnel_job = $this->db->fetch_first($sql);
        if (empty($personnel_job)) {
            return array('status' => 1);
        }//ID错误
        $sql = "select * from personnel_job_cache where job_id='" . $id . "' order by begin_time";
        $res = $this->db->query($sql);
        while ($list = $this->db->fetch_array($res)) {
            $job[] = $list;
        }
        $personnel_job['list'] = $job;
        return $personnel_job;
    }

    //删除职位信息
    function del_job_info($arr) {
        $id = int_val($arr['id']);
        $sql = "select top 1 id from personnel_list where position='" . $id . "'";
        $position = $this->db->fetch_first($sql);
        if (!empty($position)) {
            return array('status' => 1);
        }//职位下有员工不能删除
        $sql = "delete from personnel_job where id=" . $id;
        if ($this->db->query($sql)) {
            $sql = "delete from personnel_job_cache where job_id=" . $id;
            if ($this->db->query($sql)) {
                return array('status' => 0);
            }
        }
    }

    //职位列表
    function job_list($arr) {
        $department_id = int_val($arr['department_id']);
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        if ($department_id) {
            $sql = "select * from personnel_job where department_id='$department_id' order by id desc";
        } else {
            if ($store_id)
                $sql = "store_id='$store_id'";
            if ($chejian_id)
                $sql = "chejian_id='$chejian_id'";
            if ($bag_id)
                $sql = "bag_id='$bag_id'";
            if (!$sql)
                return array('status' => 2);
            $sql = "select * from personnel_job where $sql order by id desc";
        }
        $res = $this->db->query($sql);
        while ($list = $this->db->fetch_array($res)) {
            $sql = "select a.*,convert(varchar(10),a.begin_time,20) as begin_time from personnel_job_cache a where job_id='" . $list['id'] . "' order by a.begin_time desc,a.id desc";
            $temp = $this->db->query($sql);
            $job_cache = array();
            while ($arr = $this->db->fetch_array($temp)) {
                $job_cache[] = $arr;
            }
            $list['list'] = $job_cache;
            if ($job_cache[0]) {
                $list['wage'] = $job_cache[0]['wage'];
                $list['plan_nums'] = $job_cache[0]['plan_nums'];
            } else {
                $list['wage'] = 0;
                $list['plan_nums'] = 0;
            }
            $job[] = $list;
        }
        return array('list' => $job);
    }

    //删除职位历史信息
    function del_job_cache_info($arr) {
        $id = int_val($arr['id']);
        $sql = "delete from personnel_job_cache where id=" . $id;
        if ($this->db->query($sql)) {
            return array('status' => 0);
        }
    }

    function getOneStore_ID() {
        return $this->db->result_first("select top 1 store_id from store_list");
    }

    function getOneChejian_ID() {
        return $this->db->result_first("select top 1 chejian_id from chejian_list");
    }

    function getOneBag_ID() {
        return $this->tdb->result_first("select top 1 cWhCode as bag_id from Warehouse where bFreeze=0");
    }

    //指标录入
    function add_statistics($arr) {
        $store_id = parsepoststr($arr['store_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $year = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $month = min(max(1, int_val($arr['month'])), 12);
        $time = $year . '-' . $month . '-1';
        $statistics_date = date("Y-m-d", strtotime($time));
        $human_cost = int_val($arr['human_cost']);
        $wage_cost = int_val($arr['wage_cost']);
        $bonus_cost = int_val($arr['bonus_cost']);
        $wage_cost_dz = int_val($arr['wage_cost_dz']);
        $bonus_cost_dz = int_val($arr['bonus_cost_dz']);
        $total_cost = int_val($arr['total_cost']);
        if (($human_cost == 0) || ($wage_cost == 0) || ($bonus_cost == 0) || ($wage_cost_dz == 0) || ($bonus_cost_dz == 0) || ($total_cost == 0))
            return array('status' => 1); //信息录入格式错误
        $sql = "select id from personnel_statistics where store_id='" . $store_id . "' and bag_id='" . $bag_id . "' and chejian_id='" . $chejian_id . "' and statistics_date='" . $statistics_date . "'";
        $statistics = $this->db->fetch_first($sql);
        if (!empty($statistics)) {
            return array('status' => 2);
        }//录入重复
        $sql = "insert into personnel_statistics(store_id,bag_id,chejian_id,statistics_date,human_cost,wage_cost,bonus_cost,wage_cost_dz,bonus_cost_dz,total_cost) values('" . $store_id . "','" . $bag_id . "','" . $chejian_id . "','" . $statistics_date . "','" . $human_cost . "','" . $wage_cost . "','" . $bonus_cost . "','" . $wage_cost_dz . "','" . $bonus_cost_dz . "','" . $total_cost . "')";
        if ($this->db->query($sql)) {
            return array('status' => 0);
        }
    }

    //指标编辑
    function edit_statistics($arr) {
        $id = int_val($arr['id']);
        $store_id = parsepoststr($arr['store_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $year = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $month = min(max(1, int_val($arr['month'])), 12);
        $time = $year . '-' . $month . '-1';
        $statistics_date = date("Y-m-d", strtotime($time));
        $human_cost = int_val($arr['human_cost']);
        $wage_cost_dz = int_val($arr['wage_cost_dz']);
        $bonus_cost_dz = int_val($arr['bonus_cost_dz']);
        $total_cost = int_val($arr['total_cost']);
        if (($human_cost == 0) || ($wage_cost == 0) || ($bonus_cost == 0) || ($wage_cost_dz == 0) || ($bonus_cost_dz == 0) || ($total_cost == 0))
            return array('status' => 1); //信息录入格式错误
        $sql = "select id from personnel_statistics where store_id='" . $store_id . "' and bag_id='" . $bag_id . "' and chejian_id='" . $chejian_id . "' and statistics_date='" . $statistics_date . "'";
        $statistics = $this->db->fetch_first($sql);
        if (!empty($statistics)) {
            return array('status' => 2);
        }//录入重复
        $sql = "update personnel_statistics set 
					store_id='" . $store_id . "',
					bag_id='" . $bag_id . "',
					chejian_id='" . $chejian_id . "',
					statistics_date='" . $statistics_date . "',
					human_cost='" . $human_cost . "',
					wage_cost='" . $wage_cost . "',
					bonus_cost='" . $bonus_cost . "',
					total_cost='" . $total_cost . "',
					bonus_cost_dz='" . $bonus_cost_dz . "',
					total_cost_dz='" . $total_cost_dz . "'
				where id='" . $id . "'";
        if ($this->db->query($sql)) {
            return array('status' => 0);
        }
    }

    //员工录入
    function add($arr) {
        $true_name = parsepoststr($arr['true_name']);
        $sex = int_val($arr['sex']) == 1 ? 1 : 0;
        $birthday = date('Y-m-d', strtotime($arr['birthday']));
        $degree = int_val($arr['degree']);
        $train = int_val($arr['train']) == 1 ? 1 : 0;
        $certificate = parsepoststr($arr['certificate']);
        if ($certificate != '') {
            $certificate = str_replace("，", ",", $certificate);
        }
        $certificate_nums = count(explode(",", $certificate));
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $store_id = parsepoststr($arr['store_id']);
        $department = int_val($arr['department']);
        $position = int_val($arr['position']);
        $job_nature = int_val($arr['job_nature']);
        $address = int_val($arr['address']) == 1 ? 1 : 0;
        $loginid = parsepoststr($arr['loginid']);
        if($loginid){
            $info = $this->db->fetch_first("select * from user_list where loginid='".$loginid."'");
            if(!$info){
                // 用户名不存在
                return array('status'=>4);
            }
        }



        if (!isset($arr['begin_time']))
            return array('status' => 1); //信息录入格式错误	
        $begin_time = date('Y-m-d', strtotime($arr['begin_time']));
        $addtime = date('Y-m-d H:i:s', time());
        if (($true_name == '') || ($position == 0) || ($department == 0) || ($job_nature == 0) || ($job_nature > 3))
            return array('status' => 1); //信息录入格式错误
        $sql = "select id from personnel_list where true_name='" . $true_name . "' and sex='" . $sex . "' and birthday='" . $birthday . "' and department='" . $department . "' and position='" . $position . "'";
        $personnel = $this->db->fetch_first($sql);
        if (!empty($personnel)) {
            return array('status' => 2);
        }//人员录入重复
        $sql = "insert into personnel_list(true_name,sex,birthday,degree,train,certificate,certificate_nums,bag_id,chejian_id,store_id,department,position,job_nature,addtime,address,join_time,loginid) values( '" . $true_name . "','" . $sex . "','" . $birthday . "','" . $degree . "','" . $train . "','" . $certificate . "','" . $certificate_nums . "','" . $bag_id . "','" . $chejian_id . "','" . $store_id . "','" . $department . "','" . $position . "','" . $job_nature . "','" . $addtime . "','" . $address . "','" . $begin_time . "','".$loginid."')";
        if ($this->db->query($sql)) {
            $personnel = $this->db->fetch_first("select id,store_id,chejian_id from  personnel_list order by id desc");
            $sql = "insert into personnel_dynamic(personnel_id,store_id,chejian_id,dynamic,detail,user_id,begin_time) values('" . $personnel['id'] . "','" . $personnel['store_id'] . "','" . $personnel['chejian_id'] . "','" . $job_nature . "','" . json_encode($arr) . "','" . $_SESSION['user_id'] . "','" . $begin_time . "')";
            $this->db->query($sql);
            return array('status' => 0);
        }
    }

    //员工基本信息编辑
    function edit($arr) {
        $id = int_val($arr['id']);
        $true_name = parsepoststr($arr['true_name']);
        $sex = int_val($arr['sex']) == 1 ? 1 : 0;
        $birthday = date('Y-m-d', strtotime($arr['birthday']));
        $degree = int_val($arr['degree']);
        $train = int_val($arr['train']) == 1 ? 1 : 0;
        $certificate = parsepoststr($arr['certificate']);
        if ($certificate != '') {
            $certificate = str_replace("，", ",", $certificate);
        }
        $certificate_nums = count(explode(",", $certificate));
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $store_id = parsepoststr($arr['store_id']);
        $department = int_val($arr['department']);
        $position = int_val($arr['position']);
        $loginid = parsepoststr($arr['loginid']);
        $loginid = parsepoststr($arr['loginid']);
        if($loginid){
            $info = $this->db->fetch_first("select * from user_list where loginid='".$loginid."'");
            if(!$info){
                // 用户名不存在
                return array('status'=>4);
            }
        }
        if (($true_name == '') || ($position == 0) || ($department == 0))
            return array('status' => 1); //信息录入格式错误
        $personnel = $this->db->fetch_first("select id from personnel_list where id =" . $id);
        if (empty($personnel)) {
            return array('status' => 2);
        }//ID错误
        $sql = "update personnel_list set 
						true_name = '" . $true_name . "',
						sex = '" . $sex . "',
						birthday = '" . $birthday . "',
						degree = '" . $degree . "',
						train = '" . $train . "',
						certificate = '" . $certificate . "',
						certificate_nums = '" . $certificate_nums . "',
						bag_id = '" . $bag_id . "',
						chejian_id = '" . $chejian_id . "',
						store_id = '" . $store_id . "',
						department = '" . $department . "',
						position = '" . $position . "', 
                        loginid = '".$loginid."' 
						where id='" . $id . "'
				";
        if ($this->db->query($sql)) {
            return array('status' => 0);
        }
    }

    //删除员工基本信息
    function del($arr) {
        $id = int_val($arr['id']);
        $sql = "delete from personnel_list where id=" . $id;
        $this->db->query($sql);
        return array('status' => 0);
    }

    //获取员工列表-分页
    function getList($arr) {
        $perpage = int_val($arr['perpage']) ? int_val($arr['perpage']) : 10; //默认分页10
        $page = int_val($arr['page']) ? int_val($arr['page']) : 1; //页码
        $department_id = int_val($arr['department_id']);
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        if ($department_id) {
            $department = $this->db->result_first("select department from personnel_department where id='$department_id'");
            $sql = " where a.department='$department_id'";
        }

        if ($store_id && $department == '门店')
            $sql .= " and a.store_id='$store_id'";
        if ($chejian_id && $department == '加工中心')
            $sql .= " and a.chejian_id='$chejian_id'";
        if ($bag_id && $department == '仓库')
            $sql .= " and a.bag_id='$bag_id'";

        $sql = "select a.*,ISNULL(b.department,'') as department,ISNULL(c.job,'') as job from personnel_list a left join personnel_department b on a.department = b.id left join personnel_job c on a.position = c.id $sql order by a.id desc";
        $res = $this->db->query_page_all($sql, $perpage, $page);
        return array('list' => $res, 'total' => $this->db->total, 'perpage' => $perpage, 'page' => $page, 'department_id' => $department_id, 'store_id' => $store_id, 'chejian_id' => $chejian_id, 'bag_id' => $bag_id);
    }

    //获取员工列表-全部
    function getAll($arr) {
        $job_nature = $arr['job_nature'];
        //$job_nature = array(1,2,3);
        if (!is_array($job_nature)) {
            return array('status' => 1);
        }//信息录入格式错误	
        $where = isset($arr['job_nature']) ? "where a.job_nature in (" . join(',', $job_nature) . ")" : "";
        $sql = "select a.*,ISNULL(b.department,'') as department,b.id as department_id,ISNULL(c.job,'') as job from personnel_list a left join personnel_department b on a.department = b.id left join personnel_job c on a.position = c.id $where order by a.id desc";
        $res = $this->db->fetch_all($sql);
        return array('list' => $res);
    }

    //获取员工个人资料
    function getInfo($arr) {
        $id = int_val($arr['id']);
        return $this->db->fetch_first("select *,CONVERT(varchar(10),birthday,20) as birthday from personnel_list where id=" . $id);
    }

    //员工动态变更
    function edit_dynamic($arr) {
        $id = int_val($arr['id']);
        if (!isset($arr['dynamic']))
            return array('status' => 1); //信息录入格式错误
        $dynamic = int_val($arr['dynamic']);
        $detail = parsepoststr($arr['detail']);
        $loginid = parsepoststr($arr['loginid']);
        $user_id = $_SESSION['user_id'];
        if (!isset($arr['begin_time']) || !$arr['begin_time'])
            return array('status' => 1); //信息录入格式错误	
        $begin_time = date('Y-m-d', strtotime($arr['begin_time']));
        $personnel = $this->db->fetch_first("select * from personnel_list where id =" . $id);
        if (empty($personnel)) {
            return array('status' => 2);
        }//ID错误	
        switch ($dynamic) {
            case 10://转岗
                $old_job_id = $personnel['position'];
                $new_job_id = int_val($arr['new_job_id']); //新岗位 ID
                $bag_id = parsepoststr($arr['bag_id']) == '' ? $personnel['bag_id'] : parsepoststr($arr['bag_id']);
                $chejian_id = parsepoststr($arr['chejian_id']) == '' ? $personnel['chejian_id'] : parsepoststr($arr['chejian_id']);
                $store_id = parsepoststr($arr['store_id']) == '' ? $personnel['store_id'] : parsepoststr($arr['store_id']);
                $department = int_val($arr['department']) == 0 ? $personnel['department'] : parsepoststr($arr['department']);
                if ($new_job_id == 0) {
                    return array('status' => 1);
                }//信息录入格式错误
                $sql = "update personnel_list set position='" . $new_job_id . "',
												  bag_id='" . $bag_id . "',
												  chejian_id='" . $chejian_id . "',
												  store_id='" . $store_id . "',
												  department='" . $department . "'
												  where id=" . $id;
                if ($this->db->query($sql)) {
                    $old_job_1 = ",old_job_id";
                    $old_job_2 = ",'" . $old_job_id . "'";
                    $personnel['store_id'] = $store_id;
                }
                if($personnel['loginid']){
                    $department_name = $this->db->result_first("select department from personnel_department where id='".$department."'");
                    $this->db->query("update user_list set bumen='".$department_name."',bag_id='" . $bag_id . "',
                                                  chejian_id='" . $chejian_id . "',
                                                  store_id='" . $store_id . "' where loginid='".$personnel['loginid']."'");
                }
                break;
            case 11://外派，长假，外借
            case 12:
            case 13:
                if ($personnel['job_nature'] != 0) {
                    if (!isset($arr['end_time']))
                        return array('status' => 1); //信息录入格式错误
                    $end_time = date('Y-m-d', strtotime($arr['end_time']));
                    $end_1 = ",end_time";
                    $end_2 = ",'" . $end_time . "'";
                }else {
                    return array('status' => 3); //员工状态错误
                }
                break;
            case 4://转正
                if (($personnel['job_nature'] == 2) || ($personnel['job_nature'] == 3)) {
                    $sql = "update personnel_list set job_nature=1 where id=" . $id;
                    $this->db->query($sql);
                    $sql = "select dynamic from personnel_dynamic where personnel_id='" . $id . "' order by id desc";
                    $old_dynamic = $this->db->result_first($sql);
                    $old_1 = ",old_dynamic";
                    $old_2 = ",'" . $old_dynamic . "'";
                } else {
                    return array('status' => 3); //员工状态错误
                }
                break;
            case 5://升职
            case 6://加薪
            case 7://表扬
            case 8://奖励
            case 9://批评
                if ($personnel['job_nature'] == 0) {
                    return array('status' => 3);
                }//员工状态错误
                break;
            case 0://离职
                if ($personnel['job_nature'] != 0) {
                    $sql = "update personnel_list set job_nature=0 where id=" . $id;
                    $this->db->query($sql);
                    $sql = "select dynamic from personnel_dynamic where dynamic in(1,2,3,4) and personnel_id='" . $id . "' order by id desc";
                    $old_dynamic = $this->db->result_first($sql);
                    $old_1 = ",old_dynamic";
                    $old_2 = ",'" . $old_dynamic . "'";
                } else {
                    return array('status' => 3); //员工状态错误
                }
                break;
            default:
                return array('status' => 1); //信息录入格式错误	
        }
        $sql = "insert into personnel_dynamic(personnel_id,store_id,bag_id,chejian_id,dynamic,detail,user_id,begin_time" . $end_1 . " " . $old_1 . " " . $old_job_1 . ") values('" . $personnel['id'] . "','" . $personnel['store_id'] . "','" . $personnel['bag_id'] . "','" . $personnel['chejian_id'] . "','" . $dynamic . "','" . $detail . "','" . $_SESSION['user_id'] . "','" . $begin_time . "'" . $end_2 . " " . $old_2 . " " . $old_job_2 . ")";
        if ($this->db->query($sql)) {
            return array('status' => 0);
        }
    }

    //计算门店员工薪资
    function getPersonelWage($arr) {
        $gongshi_gz = 10; //工时工资/工时
        $jiaban_gz = 15; //加班工时工资/工时
        $waimai_gz = 2; //外卖工资/次
        $zhiye_gz = 20; //夜班工资/次
        $store_id = parsepoststr($arr['store_id']);
        $year = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $month = int_val($arr['month']) == 0 ? date("m", time()) : min(12, int_val($arr['month']));
        if ($month == 0) {
            $begin_time = $year . '-1-1';
            $end_time = ($year + 1) . '-1-1';
        } else {
            $begin_time = $year . '-' . $month . '-1';
            $end_time = $month == 12 ? ($year + 1) . '-1-1' : $year . '-' . ($month + 1) . '-1';
        }
        if ($store_id == '') {
            return array('status' => 1);
        }//信息录入格式错误	
        //获取门店所有员工
        $sql = "select 
				A.personnel_id,B.true_name,C.job,
				isnull(sum(gongshi),0) as gongshi,
				isnull(sum(waimai),0) as waimai,
				isnull(sum(zhiye),0) as zhiye,
				D.job_id,
				isnull(D.wage,0) as wage
				from 
				gongshi as A left join personnel_list as B on A.personnel_id=B.id left join personnel_job as C on C.id=B.position left join (select job_id,sum(wage-old_wage) as wage
				from personnel_job_cache where begin_time<='" . $begin_time . "'  group by job_id) as D on C.id=D.job_id
				where 
				A.store_id='" . $store_id . "' and work_date>='" . $begin_time . "' and work_date<'" . $end_time . "'
				group by A.personnel_id,B.true_name,C.job,D.wage,D.job_id
				";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            //计算工资。工资= 职位基本工资 + 工时 + 值夜 + 外卖
            $base_wage = $list['wage'];
            $list['gongshi_wage'] = $gongshi_wage = $list['gongshi'] > 169 ? (169 * $gongshi_gz) : ($list['gongshi'] * $gongshi_gz);
            $list['jiaban_wage'] = $jiaban_wage = $list['gongshi'] > 169 ? (($list['gongshi'] - 169) * $jiaban_gz) : 0;
            $list['waimai_wage'] = $waimai_wage = $list['waimai'] * $waimai_gz;
            $list['zhiye_wage'] = $zhiye_wage = $list['zhiye'] * $zhiye_gz;
            $list['total_wage'] = $base_wage + $gongshi_wage + $jiaban_wage + $waimai_wage + $zhiye_wage;
            $data[] = $list;
        }
        return array('list' => $data);
    }

//-----------------------完成--------------------------//		
    //基础数据查询表
    private function get_base_data($arr) {
        $show = array();
        $data = array();
        $stores = $arr['stores'];
        if ($stores == '') {
            $stores_str = "store_id <>'' and";
        } else {
            $stores_str = "store_id in (" . join(',', $stores) . ") and ";
        }
        $year = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $month = min(int_val($arr['month']), 12);
        if ($month == 0) {
            $begin_time = $year . '-1-1';
            $end_time = ($year + 1) . '-1-1';
        } else {
            $begin_time = $year . '-' . $month . '-1';
            $end_time = $month == 12 ? ($year + 1) . '-1-1' : $year . '-' . ($month + 1) . '-1';
        }
        if (isset($arr['begin_time'])) {
            $begin_time = $arr['begin_time'];
        }
        if (isset($arr['end_time'])) {
            $end_time = $arr['end_time'];
        }
        //人员动态
        $data['rydt'] = array();
        $sql = "select dynamic,old_dynamic,count(*) as nums from personnel_dynamic 
				where " . $stores_str . " 
				(dynamic<11 and (begin_time >='" . $begin_time . "' and begin_time <'" . $end_time . "'))
				group by dynamic,old_dynamic";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            switch ($list['dynamic']) {
                case '0':
                    if ($list['old_dynamic'] == 1) {
                        $show['rydt_lz_htg'] += $list['nums'];
                    } else {
                        $show['rydt_lz_lwg'] += $list['nums'];
                    }
                    break;
                case '1':
                    $show['rydt_ly_htg'] += $list['nums'];
                    break;
                case '2':
                    $show['rydt_sx'] += $list['nums'];
                    break;
                case '3':
                    $show['rydt_ly_lwg'] += $list['nums'];
                    break;
                case '4':
                    $show['rydt_zz'] += $list['nums'];
                    break;
                case '5':
                    $show['rydt_js'] += $list['nums'];
                    break;
                case '6':
                    $show['rydt_jx'] += $list['nums'];
                    break;
                case '7':
                    $show['rydt_by'] += $list['nums'];
                    break;
                case '8':
                    $show['rydt_jl'] += $list['nums'];
                    break;
                case '9':
                    $show['rydt_pp'] += $list['nums'];
                    break;
            }
        }
        $sql = "select dynamic,count(*) as nums from personnel_dynamic 
				where " . $stores_str . " 
				(dynamic>10 and end_time >='" . $begin_time . "' and begin_time<='" . $end_time . "') 
				group by dynamic";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            switch ($list['dynamic']) {
                case '10':
                    $show['rydt_zg'] += $list['nums'];
                    break;
                case '11':
                    $show['rydt_wp'] += $list['nums'];
                    break;
                case '12':
                    $show['rydt_cj'] += $list['nums'];
                    break;
                case '13':
                    $show['rydt_wj'] += $list['nums'];
                    break;
            }
        }
        //在岗统计-编制人数
        $sql = "select isnull(sum(plan_nums-old_plan_nums),0)as nums from personnel_job_cache as A left join personnel_job as B on A.job_id=B.id where " . $stores_str . " begin_time<'" . $end_time . "'";
        $show['bzrs'] = $this->db->result_first($sql);
        //在岗统计(在岗人数=合同+实习+小时)					
        $sql = "select personnel_id,job_level,
						isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
						isnull(sum(case when (dynamic=3) then 1 when old_dynamic=3 then -1 end),0) as xs,
						isnull(sum(case when (dynamic=4) then 1 when old_dynamic=4 then -1 end),0) as zz
						from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id left join personnel_job as C on B.position=C.id where A." . $stores_str . " begin_time<'" . $end_time . "'
						group by personnel_id,job_level";
        $sql = "select (sum(ht)+sum(zz)) as ht,sum(xs) as xs,sum(case when  job_level=3  then 1 else 0 end)as dz
				from (" . $sql . ") as A ";
        $zgtj = $this->db->fetch_first($sql);
        $show['zgzk_htg'] = $zgtj['ht'];
        $show['zgzk_lwg'] = $zgtj['xs'];
        $show['zgzk_dz'] = $zgtj['dz'];
        //人员结构
        $stores_str_2 = "B." . $stores_str;
        $sql = "select personnel_id,A.store_id,DATEDIFF(year, birthday,'" . $end_time . "')AS age,sex,degree,address,DATEDIFF(month, join_time,'" . $end_time . "')AS join_time,job_level,certificate_nums,
				isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
				isnull(sum(case when (dynamic=4 ) then 1 when old_dynamic=4 then -1 end) ,0)as zz
				from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id 
				left join personnel_job as C on B.position=C.id
				where  " . $stores_str_2 . "  A.begin_time<'" . $end_time . "' 
				GROUP BY A.personnel_id,A.store_id,B.birthday, B.sex, B.degree,address,join_time,job_level,certificate_nums";
        $sql = "select
				sum(case when age<='20' then 1 else 0 end) as age_20,
				sum(case when (age>'20' and age<='30') then 1 else 0 end) as age_30,
				sum(case when (age>'30' and age<='40') then 1 else 0 end) as age_40,
				sum(case when (age>'40' and age<='50') then 1 else 0 end) as age_50,
				sum(case when  age>'50' then 1 else 0 end) as age_60,
				sum(age) as sum_age,
				sum(case when degree=0 then 1 else 0 end) as degree_0,
				sum(case when degree=1 then 1 else 0 end) as degree_1,
				sum(case when degree=2 then 1 else 0 end) as degree_2,
				sum(case when degree=3 then 1 else 0 end) as degree_3,
				sum(case when sex=1 then 1 else 0 end) as sex_nan,
				sum(case when sex=0 then 1 else 0 end) as sex_nv,
				sum(case when address=1 then 1 else 0 end) as address_1,
				sum(case when address=0 then 1 else 0 end) as address_0,
				sum(case when join_time<6 then 1 else 0 end)as join_0,
				sum(case when (join_time>=6 and join_time<12) then 1 else 0 end)as join_1,
				sum(case when (join_time>=12 and join_time<24) then 1 else 0 end)as join_2,
				sum(case when (join_time>=24 and join_time<36) then 1 else 0 end)as join_3,
				sum(case when join_time>=36 then 1 else 0 end)as join_4,
				sum(case when job_level=4 then 1 else 0 end)as level_4,
				sum(case when job_level=3 then 1 else 0 end)as level_3,
				sum(case when job_level=2 then 1 else 0 end)as level_2,
				sum(case when job_level=1 then 1 else 0 end)as level_1,
				sum(certificate_nums) as certificate_nums,
				count(personnel_id) as nums
				from (" . $sql . ")as T where (ht<>0 or zz<>0)";
        $ryjg = $this->db->fetch_first($sql);
        foreach ($ryjg as $k => $v) {
            $show[$k] = $v;
        }
        $show['avg_age'] = int_val($show['sum_age'] / $show['nums']);
        //加班统计--待定
        //工时收入-工时碗数
        $jjr = nongli(date("Y-m-d", strtotime($begin_time)), date("Y-m-d", strtotime($end_time)));
        if (!empty($jjr)) {
            foreach ($jjr as $k => $v) {
                $jjr[$k] = "'" . $v . "'";
            }
        } else {
            $jjr = array("''");
        }
        $ch_branchno = $stores == '' ? "" : "ch_branchno in('" . join("','", $stores) . "') and ";
        $sql = "select 
		--工时收入
		sum(zaocan) as zaocan,
		sum(wucan) as wucan,
		sum(wancan) as wancan,
		sum(total) as total,
		sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then total end) as gzr,
		sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then total end) as zm,
		sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ")  then total end) as jjr,
		sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then total end) as yhj,
		--工时碗数
		sum(zaocan_wan) as zaocan_wan,
		sum(wucan_wan) as wucan_wan,
		sum(wancan_wan) as wancan_wan,
		sum(keliuliang) as rhj_wan,
		sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then keliuliang end) as gzr_wan,
		sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then keliuliang end) as zm_wan,
		sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ") then keliuliang end) as jjr_wan,
		sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then keliuliang end) as yhj_wan
		from hehegu_report_sell
		where " . $ch_branchno . " istotal=0 and  report_date>='" . $begin_time . "' and report_date<'" . $end_time . "'
		";
        $list = $this->db->fetch_first($sql);
        foreach ($list as $k => $v) {
            $show[$k] += $v;
        }
        //人力指标统计
        //总销售额
        $ch_branchno = $stores == '' ? "" : "ch_branchno in('" . join("','", $stores) . "') and ";
        $sql = "select SUM(total) AS nums from hehegu_report_sell where istotal=0 and " . $ch_branchno . " (report_date > '" . $begin_time . "' and report_date <'" . $end_time . "')";
        $list = $this->db->fetch_first($sql);
        $xiaoshou = $list['nums'];
        //离职人数
        $lizhi = array();
        $sql = "select count(case when (old_dynamic=1 or old_dynamic=4) then personnel_id end) as lizhi_htg,
				count(case when old_dynamic=3 then personnel_id end) as lizhi_lwg
				from personnel_dynamic where dynamic=0 and " . $stores_str . " begin_time>='" . $begin_time . "' and begin_time<'" . $end_time . "'";
        $list = $this->db->fetch_first($sql);
        $lizhi['lizhi_htg'] = $list['lizhi_htg'];
        $lizhi['lizhi_lwg'] = $list['lizhi_lwg'];

        $sql = "select  isnull(SUM(human_cost),0) AS human_cost, 
						isnull(SUM(wage_cost_dz),0) AS wage_cost_dz, 
						isnull(SUM(bonus_cost_dz),0) AS bonus_cost_dz,
						isnull(SUM(wage_cost),0) AS wage_cost, 
						isnull(SUM(bonus_cost),0) AS bonus_cost,
						isnull(SUM(total_cost),0) AS total_cost 
						from personnel_statistics where " . $stores_str . " (statistics_date >= '" . $begin_time . "' and statistics_date<'" . $end_time . "')";
        $index_data = $this->db->fetch_first($sql);
        $show['rlcb_ysb'] += round($index_data['human_cost'] * 100 / $xiaoshou, 2);
        $show['gz_ysb'] += round($index_data['wage_cost'] * 100 / $xiaoshou, 2);
        $show['jxjj_ysb'] += round($index_data['bonus_cost'] * 100 / $xiaoshou, 2);
        $show['rjgz_htg'] += round($index_data['wage_cost'] / ($show['zgzk_htg'] - $show['zgzk_dz']), 2);
        $show['rjgz_dz'] += round($index_data['wage_cost_dz'] / $show['zgzk_dz'], 2);
        $show['rjjj_htg'] += round($index_data['bonus_cost'] / ($show['zgzk_htg'] - $show['zgzk_dz']), 2);
        $show['rjjj_dz'] += round($index_data['bonus_cost_dz'] / $show['zgzk_dz'], 2);
        $show['lizhi_htg'] += round($lizhi['lizhi_htg'] * 100 / ($lizhi['lizhi_htg'] + $show['zgzk_htg']), 2);
        $show['lizhi_lwg'] += round($lizhi['lizhi_lwg'] * 100 / ($lizhi['lizhi_lwg'] + $show['zgzk_lwg']), 2);

        return $show;
    }

    //汇总数据
    function get_sum_data($arr) {
        $data = array();
        $stores = $arr['stores'];
        if ($stores == '')
            return array('status' => 1);
        $stores_str = "store_id in (" . join(',', $stores) . ") and ";
        $year = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $month = min(int_val($arr['month']), 12);
        if ($month == 0) {
            $begin_time = $year . '-1-1';
            $end_time = ($year + 1) . '-1-1';
        } else {
            $begin_time = $year . '-' . $month . '-1';
            $end_time = $month == 12 ? ($year + 1) . '-1-1' : $year . '-' . ($month + 1) . '-1';
        }
        $tj_arr = array('total', 'zczx', 'chejian', 'store');
        //人员动态-统计
        $stores_arr = '';
        if (is_array($stores)) {
            foreach ($stores as $k) {
                $stores_arr .= "sum(case when store_id='" . $k . "' then 1 else 0 end)as '" . $k . "',";
            }
            $temp_arr = array_merge($tj_arr, $stores);
        }
        $sql = "select dynamic, 
					count(*)as total,
					sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then 1 else 0 end)as zczx,
					sum(case when chejian_id<>''  then 1 else 0 end)as chejian,
					sum(case when store_id<>''  then 1 else 0 end)as store,
					" . $stores_arr . "
					old_dynamic
					from personnel_dynamic 
					where (
					(dynamic<11 and (begin_time >='" . $begin_time . "' and begin_time <'" . $end_time . "'))
					or
					(dynamic>10 and end_time >='" . $begin_time . "' and begin_time<='" . $end_time . "') 
					)group by dynamic,store_id,old_dynamic";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            switch ($list['dynamic']) {
                case '0':
                    if ($list['old_dynamic'] == 1) {
                        foreach ($temp_arr as $k) {
                            $data[$k]['rydt_lz_htg'] += $list[$k];
                        }
                    } else {
                        foreach ($temp_arr as $k) {
                            $data[$k]['rydt_lz_lwg'] += $list[$k];
                        }
                    }
                    break;
                case '1':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_ly_htg'] += $list[$k];
                    }
                    break;
                case '2':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_sx'] += $list[$k];
                    }
                    break;
                case '3':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_ly_lwg'] += $list[$k];
                    }
                    break;
                case '4':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_zz'] += $list[$k];
                    }
                    break;
                case '5':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_js'] += $list[$k];
                    }
                    break;
                case '6':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_jx'] += $list[$k];
                    }
                    break;
                case '7':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_by'] += $list[$k];
                    }
                    break;
                case '8':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_jl'] += $list[$k];
                    }
                    break;
                case '9':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_pp'] += $list[$k];
                    }
                    break;
                case '10':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_zg'] += $list[$k];
                    }
                    break;
                case '11':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_wp'] += $list[$k];
                    }
                    break;
                case '12':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_cj'] += $list[$k];
                    }
                    break;
                case '13':
                    foreach ($temp_arr as $k) {
                        $data[$k]['rydt_wj'] += $list[$k];
                    }
                    break;
            }
        }
        //在岗统计-编制人数
        $stores_arr = '';
        if (is_array($stores)) {
            foreach ($stores as $k) {
                $stores_arr .= "sum(case when store_id='" . $k . "' then (plan_nums-old_plan_nums) else 0 end)as '" . $k . "',";
            }
            $temp_arr = array_merge($tj_arr, $stores);
        }
        $sql = "select 
				" . $stores_arr . "
				sum(plan_nums-old_plan_nums)as total,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then (plan_nums-old_plan_nums) else 0 end)as zczx,
				sum(case when chejian_id<>''  then (plan_nums-old_plan_nums) else 0 end)as chejian,
				sum(case when store_id<>''  then (plan_nums-old_plan_nums) else 0 end)as store
				from personnel_job_cache as A left join personnel_job as B on A.job_id=B.id 
				where  begin_time<='" . $end_time . "'";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            foreach ($temp_arr as $k) {
                $data[$k]['bzrs'] += $list[$k];
            }
        }
        //在岗统计(在岗人数=合同+实习+小时)
        $stores_arr = '';
        if (is_array($stores)) {
            foreach ($stores as $k) {
                $stores_arr .= "sum(case when store_id='" . $k . "' then (ht+zz) else 0 end)as '" . $k . "_ht',";
                $stores_arr .= "sum(case when store_id='" . $k . "' then xs else 0 end)as '" . $k . "_xs',";
                $stores_arr .= "sum(case when store_id='" . $k . "' and job_level=3 then 1 else 0 end)as '" . $k . "_dz',";
            }
            $temp_arr = array_merge($tj_arr, $stores);
        }
        $sql = "select personnel_id,A.store_id,A.chejian_id,C.job_level,
						isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
						isnull(sum(case when (dynamic=3) then 1 when old_dynamic=3 then -1 end),0) as xs,
						isnull(sum(case when (dynamic=4) then 1 when old_dynamic=4 then -1 end),0) as zz
						from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id left join personnel_job as C on B.position=C.id where begin_time<'" . $end_time . "'
						group by personnel_id,A.store_id,A.chejian_id,C.job_level";
        $sql = "select  
				" . $stores_arr . "
				sum(ht+zz) as total_ht,
				sum(xs) as total_xs,
				sum(case when store_id<>'' and job_level=3  then 1 else 0 end)as total_dz,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then (ht+zz) else 0 end)as zczx_ht,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then xs else 0 end)as zczx_xs,
				sum(case when chejian_id<>''  then (ht+zz) else 0 end)as chejian_ht,
				sum(case when chejian_id<>''  then xs else 0 end)as chejian_xs,
				sum(case when store_id<>''  then (ht+zz) else 0 end)as store_ht,
				sum(case when store_id<>''  then xs else 0 end)as store_xs,
				sum(case when store_id<>'' and job_level=3  then 1 else 0 end)as store_dz
				from (" . $sql . ") as T";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            foreach ($temp_arr as $k) {
                $data[$k]['zgzk_htg'] += $list[$k . '_ht'];
                $data[$k]['zgzk_lwg'] += $list[$k . '_xs'];
                $data[$k]['zgzk_dz'] += $list[$k . '_dz'];
            }
        }
        //人员结构
        $sql = "select personnel_id,A.store_id,A.chejian_id,DATEDIFF(year, birthday,'" . $begin_time . "')AS age,sex,degree,address,DATEDIFF(month, join_time,'" . $begin_time . "')AS join_time,job_level,certificate_nums,
				isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
				isnull(sum(case when (dynamic=4 ) then 1 when old_dynamic=4 then -1 end) ,0)as zz
				from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id 
				left join personnel_job as C on B.position=C.id
				where A.begin_time<'" . $end_time . "'  
				GROUP BY A.personnel_id,A.store_id,B.birthday, B.sex, B.degree,A.chejian_id,address,join_time,job_level,certificate_nums";
        $sql = "select store_id,
				chejian_id,
				sum(case when age<='20' then 1 else 0 end) as age_20,
				sum(case when (age>'20' and age<='30') then 1 else 0 end) as age_30,
				sum(case when (age>'30' and age<='40') then 1 else 0 end) as age_40,
				sum(case when (age>'40' and age<='50') then 1 else 0 end) as age_50,
				sum(case when  age>'50' then 1 else 0 end) as age_60,
				avg(age) as avg_age,
				sum(case when degree=0 then 1 else 0 end) as degree_0,
				sum(case when degree=1 then 1 else 0 end) as degree_1,
				sum(case when degree=2 then 1 else 0 end) as degree_2,
				sum(case when degree=3 then 1 else 0 end) as degree_3,
				sum(case when sex=1 then 1 else 0 end) as sex_nan,
				sum(case when sex=0 then 1 else 0 end) as sex_nv,
				sum(case when address=1 then 1 else 0 end) as address_1,
				sum(case when address=0 then 1 else 0 end) as address_0,
				sum(case when join_time<6 then 1 else 0 end)as join_0,
				sum(case when (join_time>=6 and join_time<12) then 1 else 0 end)as join_1,
				sum(case when (join_time>=12 and join_time<24) then 1 else 0 end)as join_2,
				sum(case when (join_time>=24 and join_time<36) then 1 else 0 end)as join_3,
				sum(case when join_time>=36 then 1 else 0 end)as join_4,
				sum(case when job_level=4 then 1 else 0 end)as level_4,
				sum(case when job_level=3 then 1 else 0 end)as level_3,
				sum(case when job_level=2 then 1 else 0 end)as level_2,
				sum(case when job_level=1 then 1 else 0 end)as level_1,
				sum(certificate_nums) as certificate_nums,
				count(personnel_id) as nums 
				from (" . $sql . ")as T where (ht<>0 or zz<>0) group by store_id,chejian_id";
        $arr = $this->db->query($sql);
        //$tj_arr = array('total','zczx','chejian','store');
        $age_i = 0;
        while ($list = $this->db->fetch_array($arr)) {
            foreach ($list as $k => $v) {
                if (($k != 'store_id') && ($k != 'chejian_id') && ($k != 'nums')) {
                    $data['total'][$k] +=$v;
                    if (($list['store_id'] == '') && ($list['chejian_id'] == '')) {
                        $data['zczx'][$k] +=$v;
                    }
                    if ($list['chejian_id'] != '') {
                        $data['chejian'][$k] +=$v;
                    }
                    if ($list['store_id'] != '') {
                        $data['store'][$k] +=$v;
                    }
                    if (isset($data[$list['store_id']])) {
                        $data[$list['store_id']][$k] +=$v;
                    }
                }
            }
            $age_i++;
        }
        $data['total']['avg_age'] = floor($data['total']['avg_age'] / $age_i);
        //加班统计
        //工时收入-工时碗数
        $jjr = nongli(date("Y-m-d", strtotime($begin_time)), date("Y-m-d", strtotime($end_time)));
        if (!empty($jjr)) {
            foreach ($jjr as $k => $v) {
                $jjr[$k] = "'" . $v . "'";
            }
        } else {
            $jjr = array("''");
        }
        $sql = "select 
		--工时收入
		sum(zaocan) as zaocan,
		sum(wucan) as wucan,
		sum(wancan) as wancan,
		sum(total) as total,
		sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then total end) as gzr,
		sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then total end) as zm,
		sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ")  then total end) as jjr,
		sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then total end) as yhj,
		--工时碗数
		sum(zaocan_wan) as zaocan_wan,
		sum(wucan_wan) as wucan_wan,
		sum(wancan_wan) as wancan_wan,
		sum(keliuliang) as rhj_wan,
		sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then keliuliang end) as gzr_wan,
		sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then keliuliang end) as zm_wan,
		sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ") then keliuliang end) as jjr_wan,
		sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then keliuliang end) as yhj_wan
		from hehegu_report_sell
		where istotal=1 and  report_date>='" . $begin_time . "' and report_date<'" . $end_time . "'
		";
        $list = $this->db->fetch_first($sql);
        foreach ($list as $k => $v) {
            $data['total'][$k] = $data['store'][$k] = $v;
        }
        if ((is_array($stores)) && (!empty($stores))) {
            $ch_branchno = "ch_branchno in (" . join(',', $stores) . ") and ";
            $sql = "select ch_branchno,
			--工时收入
			sum(zaocan) as zaocan,
			sum(wucan) as wucan,
			sum(wancan) as wancan,
			sum(total) as total,
			sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then total end) as gzr,
			sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then total end) as zm,
			sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ")  then total end) as jjr,
			sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then total end) as yhj,
			--工时碗数
			sum(zaocan_wan) as zaocan_wan,
			sum(wucan_wan) as wucan_wan,
			sum(wancan_wan) as wancan_wan,
			sum(keliuliang) as rhj_wan,
			sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then keliuliang end) as gzr_wan,
			sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then keliuliang end) as zm_wan,
			sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ") then keliuliang end) as jjr_wan,
			sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then keliuliang end) as yhj_wan
			from hehegu_report_sell
			where " . $ch_branchno . " istotal=0 and  report_date>='" . $begin_time . "' and report_date<'" . $end_time . "'
			group by ch_branchno
			";
            $arr = $this->db->query($sql);
            while ($list = $this->db->fetch_array($arr)) {
                foreach ($list as $k => $v) {
                    $data[$list['ch_branchno']][$k] = $v;
                    unset($data[$list['ch_branchno']]['ch_branchno']);
                }
            }
        }
        //人力指标统计
        //总销售额
        $ch_branchno = $stores == '' ? "" : "ch_branchno in('" . join("','", $stores) . "') and ";
        $sql = "select ch_branchno as store_id,sum(total) as xiaoshou from hehegu_report_sell where istotal=0 and " . $ch_branchno . " (report_date >='" . $begin_time . "' and report_date <'" . $end_time . "') group by ch_branchno";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            $xiaoshou[$list['store_id']] = $list['xiaoshou'];
            $xiaoshou['total'] += $list['xiaoshou'];
        }
        //print_r($xiaoshou);die();
        //离职人数
        $stores_arr = '';
        if (is_array($stores)) {
            foreach ($stores as $k) {
                $stores_arr .= "isnull(count(case when (old_dynamic=1 or old_dynamic=4) and store_id='" . $k . "' then personnel_id end),0)as '" . $k . "_htg',";
                $stores_arr .= "isnull(count(case when old_dynamic=3 and store_id='" . $k . "' then personnel_id end),0)as '" . $k . "_lwg',";
            }
            $temp_arr = array_merge($tj_arr, $stores);
        }
        $sql = "select 
				" . $stores_arr . "
				count(case when (old_dynamic=1 or old_dynamic=4) then personnel_id end) as total_htg,
				count(case when old_dynamic=3 then personnel_id end) as total_lwg,
				count(case when (old_dynamic=1 or old_dynamic=4) and ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then personnel_id end)as zczx_htg,
				count(case when old_dynamic=3 and ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then personnel_id end)as zczx_lwg,
				count(case when (old_dynamic=1 or old_dynamic=4) and chejian_id<>''  then personnel_id end)as chejian_htg,
				count(case when old_dynamic=3 and chejian_id<>''  then personnel_id end)as chejian_lwg,
				count(case when (old_dynamic=1 or old_dynamic=4) and store_id<>''  then personnel_id end)as store_htg,
				count(case when old_dynamic=3 and store_id<>''  then personnel_id end)as store_lwg
				from personnel_dynamic where dynamic=0 and begin_time>='" . $begin_time . "' and begin_time<'" . $end_time . "'";
        $lizhi = $this->db->fetch_first($sql);
        //人力指标计算
        $stores_arr = '';
        if (is_array($stores)) {
            foreach ($stores as $k) {
                $stores_arr .= "isnull(sum(case when store_id='" . $k . "' then human_cost end),0)as '" . $k . "_human_cost',";
                $stores_arr .= "isnull(sum(case when store_id='" . $k . "' then wage_cost_dz end),0)as '" . $k . "_wage_cost_dz',";
                $stores_arr .= "isnull(sum(case when store_id='" . $k . "' then bonus_cost_dz end),0)as '" . $k . "_bonus_cost_dz',";
                $stores_arr .= "isnull(sum(case when store_id='" . $k . "' then wage_cost end),0)as '" . $k . "_wage_cost',";
                $stores_arr .= "isnull(sum(case when store_id='" . $k . "' then bonus_cost end),0)as '" . $k . "_bonus_cost',";
            }
            $temp_arr = array_merge($tj_arr, $stores);
        }
        $sql = "select 
				" . $stores_arr . "
				sum(human_cost) as total_human_cost, 
				sum(wage_cost) as total_wage_cost, 
				sum(bonus_cost) as total_bonus_cost,
				sum(wage_cost_dz) as total_wage_cost_dz, 
				sum(bonus_cost_dz) as total_bonus_cost_dz,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then human_cost end)as zczx_human_cost,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then wage_cost end)as zczx_wage_cost,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then bonus_cost end)as zczx_bonus_cost,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then wage_cost_dz end)as zczx_wage_cost_dz,
				sum(case when ((store_id='' or store_id is null) and (chejian_id='' or chejian_id is null)) then bonus_cost_dz end)as zczx_bonus_cost_dz,
				sum(case when chejian_id<>''  then human_cost end)as chejian_human_cost,
				sum(case when chejian_id<>''  then wage_cost end)as chejian_wage_cost,
				sum(case when chejian_id<>''  then bonus_cost end)as chejian_bonus_cost,
				sum(case when chejian_id<>''  then wage_cost_dz end)as chejian_wage_cost_dz,
				sum(case when chejian_id<>''  then bonus_cost_dz end)as chejian_bonus_cost_dz,
				sum(case when store_id<>''  then human_cost end)as store_human_cost,
				sum(case when store_id<>''  then wage_cost end)as store_wage_cost,
				sum(case when store_id<>''  then bonus_cost end)as store_bonus_cost,
				sum(case when store_id<>''  then wage_cost_dz end)as store_wage_cost_dz,
				sum(case when store_id<>''  then bonus_cost_dz end)as store_bonus_cost_dz
				from personnel_statistics where (statistics_date >= '" . $begin_time . "' and statistics_date<'" . $end_time . "')
				";
        $list = $this->db->fetch_first($sql);
        foreach ($temp_arr as $k) {
            if (in_array($k, $tj_arr)) {
                $data[$k]['rlcb_ysb'] += round($list[$k . '_human_cost'] * 100 / $xiaoshou['total'], 2);
                $data[$k]['gz_ysb'] += round($list[$k . '_wage_cost'] * 100 / $xiaoshou['total'], 2);
                $data[$k]['jxjj_ysb'] += round($list[$k . '_bonus_cost'] * 100 / $xiaoshou['total'], 2);
            } else {
                $data[$k]['rlcb_ysb'] += round($list[$k . '_human_cost'] * 100 / $xiaoshou[$k], 2);
                $data[$k]['gz_ysb'] += round($list[$k . '_wage_cost'] * 100 / $xiaoshou[$k], 2);
                $data[$k]['jxjj_ysb'] += round($list[$k . '_bonus_cost'] * 100 / $xiaoshou[$k], 2);
            }
            $data[$k]['rjgz_htg'] += round($list[$k . '_wage_cost'] / ($data[$k]['zgzk_htg'] - $data[$k]['zgzk_dz']), 2);
            $data[$k]['rjgz_dz'] += round($list[$k . '_wage_cost_dz'] / $data[$k]['zgzk_dz'], 2);
            $data[$k]['rjjj_htg'] += round($list[$k . '_bonus_cost'] / ($data[$k]['zgzk_htg'] - $data[$k]['zgzk_dz']), 2);
            $data[$k]['rjjj_dz'] += round($list[$k . '_bonus_cost_dz'] / $data[$k]['zgzk_dz'], 2);
            $data[$k]['lizhi_htg'] += round($lizhi[$k . '_htg'] * 100 / ($lizhi[$k . '_htg'] + $data[$k]['zgzk_htg']), 2);
            $data[$k]['lizhi_lwg'] += round($lizhi[$k . '_lwg'] * 100 / ($lizhi[$k . '_lwg'] + $data[$k]['zgzk_lwg']), 2);
        }
        return $data;
    }

    //趋势表
    function get_current_data($arr) {
        $data = array();
        //实际
        $shiji = array();
        $shiji['stores'] = $arr['stores'];
        $shiji['year'] = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $shiji['month'] = min(max(1, int_val($arr['month'])), 12);
        $data['shiji'] = $this->get_base_data($shiji);
        //上期
        $shangqi = array();
        $shangqi['stores'] = $arr['stores'];
        if ($shiji['month'] == 1) {
            $shangqi['year'] = $shiji['year'] - 1;
            $shangqi['month'] = 12;
        } else {
            $shangqi['year'] = $shiji['year'];
            $shangqi['month'] = $shiji['month'] - 1;
        }
        $data['shangqi'] = $this->get_base_data($shangqi);
        //同期
        $tongqi = array();
        $tongqi['stores'] = $arr['stores'];
        $tongqi['year'] = $shiji['year'] - 1;
        $tongqi['month'] = $shiji['month'];
        $data['tongqi'] = $this->get_base_data($tongqi);
        //实际所有
        $shiji_all = array();
        $shiji_all['stores'] = '';
        $shiji_all['year'] = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $shiji_all['month'] = min(max(1, int_val($arr['month'])), 12);
        $data['shiji_all'] = $this->get_base_data($shiji_all);
        //上期所有
        $shangqi_all = array();
        $shangqi_all['stores'] = '';
        if ($shiji['month'] == 1) {
            $shangqi_all['year'] = $shiji['year'] - 1;
            $shangqi_all['month'] = 12;
        } else {
            $shangqi_all['year'] = $shiji['year'];
            $shangqi_all['month'] = $shiji['month'] - 1;
        }
        $data['shangqi_all'] = $this->get_base_data($shangqi_all);
        //同期所有
        $tongqi_all = array();
        $tongqi_all['stores'] = '';
        $tongqi_all['year'] = $shiji['year'] - 1;
        $tongqi_all['month'] = $shiji['month'];
        $data['tongqi_all'] = $this->get_base_data($tongqi_all);

        return $data;
    }

    //汇总日历表
    function get_day_sum_data($arr) {
        $show = array();
        $data = array();
        $stores = $arr['stores'];

        if ($stores == '') {
            $stores_str = "store_id <>'' and";
        } else {
            $stores_str = "store_id in (" . join(',', $stores) . ") and ";
        }
        $year = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        $month = min(max(1, int_val($arr['month'])), 12);
        if ($month == 0) {
            $begin_time = $year . '-1-1';
            $end_time = ($year + 1) . '-1-1';
        } else {
            $begin_time = $year . '-' . $month . '-1';
            $end_time = $month == 12 ? ($year + 1) . '-1-1' : $year . '-' . ($month + 1) . '-1';
        }
        for ($i = 0; $i < date("t", strtotime($begin_time)); $i++) {
            $temp_time = strtotime($begin_time) + ($i * 3600 * 24);
            $show[$temp_time] = array();
        }
        //人员动态
        $data['rydt'] = array();
        $sql = "select CONVERT(varchar(10),begin_time,20) as time,dynamic,old_dynamic,count(*) as nums from personnel_dynamic 
				where " . $stores_str . " 
				(dynamic<11 and (begin_time >='" . $begin_time . "' and begin_time <'" . $end_time . "'))
				group by CONVERT(varchar(10),begin_time,20),dynamic,old_dynamic";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            switch ($list['dynamic']) {
                case '0':
                    if ($list['old_dynamic'] == 1) {
                        $show[strtotime($list['time'])]['rydt_lz']['htg'] += $list['nums'];
                    } else {
                        $show[strtotime($list['time'])]['rydt_lz']['lwg'] += $list['nums'];
                    }
                    break;
                case '1':
                    $show[strtotime($list['time'])]['rydt_ly']['htg'] += $list['nums'];
                    break;
                case '2':
                    $show[strtotime($list['time'])]['rydt_sx'] += $list['nums'];
                    break;
                case '3':
                    $show[strtotime($list['time'])]['rydt_ly']['lwg'] += $list['nums'];
                    break;
                case '4':
                    $show[strtotime($list['time'])]['rydt_zz'] += $list['nums'];
                    break;
                case '5':
                    $show[strtotime($list['time'])]['rydt_js'] += $list['nums'];
                    break;
                case '6':
                    $show[strtotime($list['time'])]['rydt_jx'] += $list['nums'];
                    break;
                case '7':
                    $show[strtotime($list['time'])]['rydt_by'] += $list['nums'];
                    break;
                case '8':
                    $show[strtotime($list['time'])]['rydt_jl'] += $list['nums'];
                    break;
                case '9':
                    $show[strtotime($list['time'])]['rydt_pp'] += $list['nums'];
                    break;
            }
        }
        $sql = "select CONVERT(varchar(10),begin_time,20) as begin_time,CONVERT(varchar(10),end_time,20) as end_time,dynamic,count(*) as nums from personnel_dynamic 
				where " . $stores_str . " 
				(dynamic>10 and end_time >='" . $begin_time . "' and begin_time<='" . $end_time . "') 
				group by CONVERT(varchar(10),begin_time,20),CONVERT(varchar(10),end_time,20),dynamic";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            for ($i = 0; $i < date("t", strtotime($begin_time)); $i++) {
                $temp_time = strtotime($begin_time) + ($i * 3600 * 24);
                if ((strtotime($list['begin_time']) <= $temp_time) && ($temp_time <= strtotime($list['end_time']))) {
                    switch ($list['dynamic']) {
                        case '10':
                            $show[$temp_time]['rydt_zg'] += $list['nums'];
                            break;
                        case '11':
                            $show[$temp_time]['rydt_wp'] += $list['nums'];
                            break;
                        case '12':
                            $show[$temp_time]['rydt_cj'] += $list['nums'];
                            break;
                        case '13':
                            $show[$temp_time]['rydt_wj'] += $list['nums'];
                            break;
                    }
                }
            }
        }
        //在岗统计-编制人数
        $data['bzrs'] = array();
        $sql = "select sum(plan_nums-old_plan_nums)as nums from personnel_job_cache as A left join personnel_job as B on A.job_id=B.id where " . $stores_str . " begin_time<'" . $begin_time . "'";
        $total_nums = $this->db->result_first($sql);
        $sql = "select CONVERT(varchar(10),begin_time,20) as time,sum(plan_nums-old_plan_nums)as nums from personnel_job_cache as A left join personnel_job as B on A.job_id=B.id where " . $stores_str . " begin_time>='" . $begin_time . "' and begin_time<'" . $end_time . "' group by CONVERT(varchar(10),begin_time,20)";
        $arr = $this->db->query($sql);
        $temp_list = array();
        while ($list = $this->db->fetch_array($arr)) {
            $temp_list[strtotime($list['time'])] = $list['nums'];
        }
        for ($i = 0; $i < date("t", strtotime($begin_time)); $i++) {
            $temp_time = strtotime($begin_time) + ($i * 3600 * 24);
            if (isset($temp_list[$temp_time])) {
                $total_nums = $total_nums + $temp_list[$temp_time];
            }
            $show[$temp_time]['bzrs'] = int_val($total_nums);
        }
        //在岗统计(在岗人数=合同+实习+小时)							
        $sql = "select personnel_id,job_level,
						isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
						isnull(sum(case when (dynamic=3) then 1 when old_dynamic=3 then -1 end),0) as xs,
						isnull(sum(case when (dynamic=4) then 1 when old_dynamic=4 then -1 end),0) as zz
						from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id left join personnel_job as C on B.position=C.id where A." . $stores_str . " begin_time<='" . $begin_time . "'
						group by personnel_id,job_level";
        $sql = "select (sum(ht)+sum(zz)) as ht,sum(xs) as xs,sum(case when  job_level=3  then 1 else 0 end)as dz
				from (" . $sql . ") as A ";
        $zgtj = $this->db->fetch_first($sql);
        $sql = "SELECT  CONVERT(varchar(10), begin_time, 20) AS time, 
						isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
						isnull(sum(case when (dynamic=3) then 1 when old_dynamic=3 then -1 end),0) as xs,
						isnull(sum(case when (dynamic=4) then 1 when old_dynamic=4 then -1 end),0) as zz,
						isnull(sum(case when job_level=3 then 1 end),0) as dz
						from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id left join personnel_job as C on B.position=C.id where A." . $stores_str . "  begin_time>='" . $begin_time . "' and begin_time<'" . $end_time . "' 
						group by CONVERT(varchar(10), begin_time, 20)";
        $arr = $this->db->query($sql);
        $temp_list = array();
        while ($list = $this->db->fetch_array($arr)) {
            $temp_list[strtotime($list['time'])]['ht'] = $list['ht'];
            $temp_list[strtotime($list['time'])]['xs'] = $list['xs'];
            $temp_list[strtotime($list['time'])]['zz'] = $list['zz'];
            $temp_list[strtotime($list['time'])]['dz'] = $list['dz'];
        }
        for ($i = 0; $i < date("t", strtotime($begin_time)); $i++) {
            $temp_arr = array();
            $temp_time = strtotime($begin_time) + ($i * 3600 * 24);
            if (isset($temp_list[$temp_time])) {
                $zgtj['ht'] = $zgtj['ht'] + $temp_list[$temp_time]['ht'] + $temp_list[$temp_time]['zz'];
                $zgtj['xs'] = $zgtj['xs'] + $temp_list[$temp_time]['xs'];
                $zgtj['dz'] = $zgtj['dz'] + $temp_list[$temp_time]['dz'];
            }
            $temp_arr['time'] = date("Y-m-d", $temp_time);
            $temp_arr['ht'] = $zgtj['ht'];
            $temp_arr['xs'] = $zgtj['xs'];
            $temp_arr['dz'] = $zgtj['dz'];
            $show[$temp_time]['zgzk_htg'] = $temp_arr['ht'];
            $show[$temp_time]['zgzk_lwg'] = $temp_arr['xs'];
            $show[$temp_time]['zgzk_dz'] = $temp_arr['dz'];
        }
        //人员结构
        $stores_str_2 = "B." . $stores_str;
        //计算之前总和
        $sql = "select personnel_id,A.store_id,DATEDIFF(year, birthday,'" . $begin_time . "')AS age,sex,degree,address,DATEDIFF(month, join_time,'" . $begin_time . "')AS join_time,job_level,certificate_nums,
				isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
				isnull(sum(case when (dynamic=4 ) then 1 when old_dynamic=4 then -1 end) ,0)as zz
				from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id 
				left join personnel_job as C on B.position=C.id
				where  " . $stores_str_2 . "  A.begin_time<='" . $begin_time . "' 
				GROUP BY A.personnel_id,A.store_id,B.birthday, B.sex, B.degree,address,join_time,job_level,certificate_nums";
        $sql = "select
				sum(case when age<='20' then 1 else 0 end) as age_20,
				sum(case when (age>'20' and age<='30') then 1 else 0 end) as age_30,
				sum(case when (age>'30' and age<='40') then 1 else 0 end) as age_40,
				sum(case when (age>'40' and age<='50') then 1 else 0 end) as age_50,
				sum(case when  age>'50' then 1 else 0 end) as age_60,
				sum(age) as sum_age,
				sum(case when degree=0 then 1 else 0 end) as degree_0,
				sum(case when degree=1 then 1 else 0 end) as degree_1,
				sum(case when degree=2 then 1 else 0 end) as degree_2,
				sum(case when degree=3 then 1 else 0 end) as degree_3,
				sum(case when sex=1 then 1 else 0 end) as sex_nan,
				sum(case when sex=0 then 1 else 0 end) as sex_nv,
				sum(case when address=1 then 1 else 0 end) as address_1,
				sum(case when address=0 then 1 else 0 end) as address_0,
				sum(case when join_time<6 then 1 else 0 end)as join_0,
				sum(case when (join_time>=6 and join_time<12) then 1 else 0 end)as join_1,
				sum(case when (join_time>=12 and join_time<24) then 1 else 0 end)as join_2,
				sum(case when (join_time>=24 and join_time<36) then 1 else 0 end)as join_3,
				sum(case when join_time>=36 then 1 else 0 end)as join_4,
				sum(case when job_level=4 then 1 else 0 end)as level_4,
				sum(case when job_level=3 then 1 else 0 end)as level_3,
				sum(case when job_level=2 then 1 else 0 end)as level_2,
				sum(case when job_level=1 then 1 else 0 end)as level_1,
				sum(certificate_nums) as certificate_nums,
				count(personnel_id) as nums
				from (" . $sql . ")as T where (ht<>0 or zz<>0)";
        $ryjg = $this->db->fetch_first($sql);
        //人员当月分天计算
        $sql = "select CONVERT(varchar(10), begin_time, 20) as time,personnel_id,A.store_id,DATEDIFF(year, birthday,'" . $begin_time . "')AS age,sex,degree,address,DATEDIFF(month, join_time,'" . $begin_time . "')AS join_time,job_level,certificate_nums,
				isnull(sum(case when (dynamic=1 ) then 1 when old_dynamic=1 then -1 end) ,0)as ht,
				isnull(sum(case when (dynamic=4 ) then 1 when old_dynamic=4 then -1 end) ,0)as zz
				from personnel_dynamic as A left join personnel_list as B on A.personnel_id=B.id 
				left join personnel_job as C on B.position=C.id
				where  " . $stores_str_2 . "  A.begin_time>='" . $begin_time . "' and A.begin_time<'" . $end_time . "'
				GROUP BY A.personnel_id,A.store_id,B.birthday, B.sex, B.degree,address,join_time,job_level,certificate_nums,CONVERT(varchar(10), begin_time, 20)";
        $sql = "select
				time,
				sum(case when age<='20' then 1 else 0 end) as age_20,
				sum(case when (age>'20' and age<='30') then 1 else 0 end) as age_30,
				sum(case when (age>'30' and age<='40') then 1 else 0 end) as age_40,
				sum(case when (age>'40' and age<='50') then 1 else 0 end) as age_50,
				sum(case when  age>'50' then 1 else 0 end) as age_60,
				sum(age) as sum_age,
				sum(case when degree=0 then 1 else 0 end) as degree_0,
				sum(case when degree=1 then 1 else 0 end) as degree_1,
				sum(case when degree=2 then 1 else 0 end) as degree_2,
				sum(case when degree=3 then 1 else 0 end) as degree_3,
				sum(case when sex=1 then 1 else 0 end) as sex_nan,
				sum(case when sex=0 then 1 else 0 end) as sex_nv,
				sum(case when address=1 then 1 else 0 end) as address_1,
				sum(case when address=0 then 1 else 0 end) as address_0,
				sum(case when join_time<6 then 1 else 0 end)as join_0,
				sum(case when (join_time>=6 and join_time<12) then 1 else 0 end)as join_1,
				sum(case when (join_time>=12 and join_time<24) then 1 else 0 end)as join_2,
				sum(case when (join_time>=24 and join_time<36) then 1 else 0 end)as join_3,
				sum(case when join_time>=36 then 1 else 0 end)as join_4,
				sum(case when job_level=4 then 1 else 0 end)as level_4,
				sum(case when job_level=3 then 1 else 0 end)as level_3,
				sum(case when job_level=2 then 1 else 0 end)as level_2,
				sum(case when job_level=1 then 1 else 0 end)as level_1,
				sum(certificate_nums) as certificate_nums,
				count(personnel_id) as nums
				from (" . $sql . ")as T where (ht<>0 or zz<>0) group by time";
        $arr = $this->db->query($sql);
        $temp_list = array();
        while ($list = $this->db->fetch_array($arr)) {
            foreach ($list as $k => $v) {
                if ($k != 'time') {
                    $temp_list[strtotime($list['time'])][$k] = $v;
                }
            }
        }
        for ($i = 0; $i < date("t", strtotime($begin_time)); $i++) {
            $temp_time = strtotime($begin_time) + ($i * 3600 * 24);
            if (isset($temp_list[$temp_time])) {
                foreach ($ryjg as $k => $v) {
                    $ryjg[$k] = $v + $temp_list[$temp_time][$k];
                }
            }
            foreach ($ryjg as $k => $v) {
                $show[$temp_time][$k] = $v;
            }
            $show[$temp_time]['avg_age'] = int_val($show[$temp_time]['sum_age'] / $show[$temp_time]['nums']);
        }
        //加班统计--待定
        //工时收入-工时碗数
        $jjr = nongli(date("Y-m-d", strtotime($begin_time)), date("Y-m-d", strtotime($end_time)));
        if (!empty($jjr)) {
            foreach ($jjr as $k => $v) {
                $jjr[$k] = "'" . $v . "'";
            }
        } else {
            $jjr = array("''");
        }
        $ch_branchno = "ch_branchno in (" . join(',', $stores) . ") and ";
        $sql = "select CONVERT(varchar(10), report_date, 20) AS time,
		--工时收入
		sum(zaocan) as zaocan,
		sum(wucan) as wucan,
		sum(wancan) as wancan,
		sum(total) as total,
		sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then total end) as gzr,
		sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then total end) as zm,
		sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ")  then total end) as jjr,
		sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then total end) as yhj,
		--工时碗数
		sum(zaocan_wan) as zaocan_wan,
		sum(wucan_wan) as wucan_wan,
		sum(wancan_wan) as wancan_wan,
		sum(keliuliang) as rhj_wan,
		sum(case when (DATEPART(w,report_date)<>1 and DATEPART(w,report_date)<>7)  then keliuliang end) as gzr_wan,
		sum(case when (DATEPART(w,report_date)=1 or DATEPART(w,report_date)=7)  then keliuliang end) as zm_wan,
		sum(case when CONVERT(VARCHAR(10),report_date,20) in(" . join(',', $jjr) . ") then keliuliang end) as jjr_wan,
		sum(case when CONVERT(VARCHAR(7),report_date,20)='" . date("Y-m", strtotime($begin_time)) . "' then keliuliang end) as yhj_wan
		from hehegu_report_sell
		where " . $ch_branchno . " istotal=0 and  report_date>='" . $begin_time . "' and report_date<'" . $end_time . "'
		group by CONVERT(varchar(10), report_date, 20)
		";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            foreach ($list as $k => $v) {
                $show[strtotime($list['time'])][$k] += $v;
                unset($show[strtotime($list['time'])]['time']);
            }
        }
        //人力指标统计
        //总销售额
        $xiaoshou = array();
        $ch_branchno = $stores == '' ? "" : "ch_branchno in('" . join("','", $stores) . "') and ";
        $sql = "select CONVERT(varchar(10), report_date, 20) AS time, SUM(total) AS nums from hehegu_report_sell where istotal=0 and " . $ch_branchno . " (report_date > '" . $begin_time . "' and report_date <'" . $end_time . "') group by CONVERT(varchar(10), report_date, 20)";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            $xiaoshou[strtotime($list['time'])] = $list['nums'];
        }
        //离职人数
        $lizhi = array();
        $sql = "select count(case when (old_dynamic=1 or old_dynamic=4) then personnel_id end) as lizhi_htg,
				count(case when old_dynamic=3 then personnel_id end) as lizhi_lwg,
				CONVERT(varchar(10), begin_time, 20) AS time 
				from personnel_dynamic where dynamic=0 and " . $stores_str . " begin_time>='" . $begin_time . "' and begin_time<'" . $end_time . "' group by CONVERT(varchar(10), begin_time, 20)";
        $arr = $this->db->query($sql);
        while ($list = $this->db->fetch_array($arr)) {
            $lizhi[strtotime($list['time'])]['lizhi_htg'] = $list['lizhi_htg'];
            $lizhi[strtotime($list['time'])]['lizhi_lwg'] = $list['lizhi_lwg'];
        }
        $sql = "select  isnull(SUM(human_cost),0) AS human_cost, 
						isnull(SUM(wage_cost_dz),0) AS wage_cost_dz, 
						isnull(SUM(bonus_cost_dz),0) AS bonus_cost_dz,
						isnull(SUM(wage_cost),0) AS wage_cost, 
						isnull(SUM(bonus_cost),0) AS bonus_cost,
						isnull(SUM(total_cost),0) AS total_cost 
						from personnel_statistics where " . $stores_str . " (statistics_date >= '" . $begin_time . "' and statistics_date<'" . $end_time . "')";
        $index_data = $this->db->fetch_first($sql);
        for ($i = 0; $i < date("t", strtotime($begin_time)); $i++) {
            $temp_arr = array();
            $temp_time = strtotime($begin_time) + ($i * 3600 * 24);
            $show[$temp_time]['rlcb_ysb'] += round($index_data['human_cost'] * 100 / $xiaoshou[$temp_time], 2);
            $show[$temp_time]['gz_ysb'] += round($index_data['wage_cost'] * 100 / $xiaoshou[$temp_time], 2);
            $show[$temp_time]['jxjj_ysb'] += round($index_data['bonus_cost'] * 100 / $xiaoshou[$temp_time], 2);
            $show[$temp_time]['rjgz_htg'] += round($index_data['wage_cost'] / ($show[$temp_time]['zgzk_htg'] - $show[$temp_time]['zgzk_dz']), 2);
            $show[$temp_time]['rjgz_dz'] += round($index_data['wage_cost_dz'] / $show[$temp_time]['zgzk_dz'], 2);
            $show[$temp_time]['rjjj_htg'] += round($index_data['bonus_cost'] / ($show[$temp_time]['zgzk_htg'] - $show[$temp_time]['zgzk_dz']), 2);
            $show[$temp_time]['rjjj_dz'] += round($index_data['bonus_cost_dz'] / $show[$temp_time]['zgzk_dz'], 2);
            $show[$temp_time]['lizhi_htg'] += round($lizhi[$temp_time]['lizhi_htg'] * 100 / ($lizhi[$temp_time]['lizhi_htg'] + $show[$temp_time]['zgzk_htg']), 2);
            $show[$temp_time]['lizhi_lwg'] += round($lizhi[$temp_time]['lizhi_lwg'] * 100 / ($lizhi[$temp_time]['lizhi_lwg'] + $show[$temp_time]['zgzk_lwg']), 2);
        }

        $show_data = array();
        foreach ($show as $k => $v) {
            $show_data[int_val(date("d", $k))] = $v;
        }
        return $show_data;
    }

    //汇总月历表
    function get_month_sum_data($arr) {
        $data = array();
        for ($i = 1; $i <= 12; $i++) {
            $arr['month'] = $i;
            $data[$i] = $this->get_base_data($arr);
        }
        return $data;
    }

    //汇总季历表
    function get_quarter_sum_data($arr) {
        $data = array();
        $year = int_val($arr['year']) == 0 ? date("Y", time()) : int_val($arr['year']);
        for ($i = 0; $i < 4; $i++) {
            $begin_time = $year . '-' . (($i * 3) + 1) . '-1';
            $end_time = $i == 3 ? ($year + 1) . '-1-1' : $year . '-' . (($i * 3) + 4) . '-1';
            $arr['begin_time'] = $begin_time;
            $arr['end_time'] = $end_time;
            $data[($i + 1)] = $this->get_base_data($arr);
        }
        return $data;
    }

    //汇总年历表
    function get_year_sum_data($arr) {
        $data = array();
        $year = date("Y", time());
        $begin_year = $year - 4;
        for ($i = $begin_year; $i <= $year; $i++) {
            $begin_time = $i . '-1-1';
            $end_time = ($i + 1) . '-1-1';
            $arr['begin_time'] = $begin_time;
            $arr['end_time'] = $end_time;
            $data[$i] = $this->get_base_data($arr);
        }
        return $data;
    }

    //测试
    function test() {
        $arr['true_name'] = 'test' . mt_rand(0, 5000);
        $arr['sex'] = mt_rand(0, 1);
        $arr['birthday'] = mt_rand(1965, 1990) . '-' . mt_rand(1, 12) . '-' . mt_rand(1, 25);
        $arr['degree'] = mt_rand(0, 3);
        $arr['train'] = mt_rand(0, 1);
        $arr['address'] = mt_rand(0, 1);
        $aa = array('英语,4级,计算机2级', '日语AV', '', '');
        $arr['certificate'] = $aa[array_rand($aa)];

        $arr['bag_id'] = '';
        //$arr['chejian_id'] = '0102';
        //$arr['store_id'] = '0202';//********
        $arr['department'] = 10; //******
        $bb = array('56', '57', '58', '59'); //******
        $arr['position'] = $bb[array_rand($bb)];
        if ($arr['position'] == 59) {//******
            $arr['job_nature'] = mt_rand(1, 3);
        } else {
            $arr['job_nature'] = 1;
        }
        $arr['begin_time'] = mt_rand(2000, 2013) . '-' . mt_rand(1, 12) . '-' . mt_rand(1, 25);

        //return $this->add($arr);
    }

}

?>