<?php
class cls_user{
//检测权限
    function checkPower($type){
        if(!$type) exit('power error');
        $dispower = array('user->chkStatus','user->userLogin','user->logOut');
        if(!in_array($type,$dispower) && !$_SESSION['power']) exit('power error');
    }
    //获取用户列表
    function getList($arr){
        global $localdb;
        $perpage = int_val($arr['perpage'])?int_val($arr['perpage']):10;//默认分页10
        $page = int_val($arr['page'])?int_val($arr['page']):1;//页码
        $department_id = parsepoststr($arr['department_id']);
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        if($department_id){
            $sql = " where bumen='$department_id'";
        }
        
        if($store_id && $department_id=='门店') $sql .= " and store_id='$store_id'";
        if($chejian_id && $department_id=='加工中心') $sql .= " and chejian_id='$chejian_id'";
        if($bag_id && $department_id=='仓库') $sql .= " and bag_id='$bag_id'";
        
        $sql = "select * from user_list $sql order by user_id desc";
        $res = $localdb->query_page_all($sql,$perpage,$page);
        return array('list'=>$res,'total'=>$localdb->total,'perpage'=>$perpage,'page'=>$page,'department_id'=>$department_id,'store_id'=>$store_id,'chejian_id'=>$chejian_id,'bag_id'=>$bag_id);
    }
    //获取用户基本信息
    function getInfo($arr){
        global $localdb;
        $user_id= int_val($arr['user_id']);
        $res = $localdb->fetch_first("select * from user_list where user_id='$user_id'");
        return $res;
    }
    //添加用户
    function addUser($arr){
        $user_name = parsepoststr($arr['user_name']);
        $loginid = parsepoststr($arr['loginid']);
        $password = md5($arr['password']);
        $level_name = parsepoststr($arr['level_name']);
        $bumen = parsepoststr($arr['bumen']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $store_id = parsepoststr($arr['store_id']);
        
        if(!$user_name || !$password || !$level_name || !$loginid || !$bumen) return array('status'=>1);
        global $localdb;
        $result = $localdb->fetch_first("select * from user_list where loginid='$loginid'");
        if($result) return array('status'=>-1);
        $regtime = date('Y-m-d H:i:s',time());
        $localdb->query("insert into user_list (user_name,password,loginid,level_name,regtime,bag_id,chejian_id,store_id,bumen) values ('$user_name','$password','$loginid','$level_name','$regtime','$bag_id',
        '$chejian_id','$store_id','$bumen')");
        return array('status'=>0);
    }
    //修改用户
    function editUser($arr){
        $user_name = parsepoststr($arr['user_name']);
        $loginid = parsepoststr($arr['loginid']);
        $password = $arr['password'];
        $level_name = parsepoststr($arr['level_name']);
        $bumen = parsepoststr($arr['bumen']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $store_id = parsepoststr($arr['store_id']);
        
        $user_id = int_val($arr['user_id']);
        
        if(!$user_name || !$level_name || !$loginid || !$user_id) return array('status'=>1);
        global $localdb;
        $sql="select * from user_list where loginid='$loginid' and user_id <> '$user_id'";
        $result = $localdb->fetch_first($sql);
        if($result) return array('status'=>-1);//重复登陆名
        $regtime = date('Y-m-d H:i:s',time());
        $sql = "user_name='$user_name',loginid='$loginid',level_name='$level_name',regtime='$regtime',bag_id='$bag_id',chejian_id='$chejian_id',store_id='$store_id',";
        if($password && strlen($password)>5) $sql .="password='".md5($password)."',";
        $localdb->query("update user_list set $sql bumen='$bumen' where user_id='$user_id'");
        return array('status'=>0);
    }
    //删除用户
    function delUser($arr){
        $loginid = parsepoststr($arr['loginid']);
        global $localdb;
        $localdb->query("delete from user_list where loginid='$loginid'");
        return array('status'=>0);
    }
    //用户登录
    function userLogin($arr){
        $loginid = parsepoststr($arr['loginid']);
        $password = md5($arr['password']);
        global $localdb;
        $res = $localdb->fetch_first("select a.*,CONVERT(varchar(19),a.regtime,20) as regtime,b.power from user_list a,user_level b where a.level_name = b.level_name and a.loginid='$loginid'");
        if(!$res) return array('status'=>1);
        if($res['password']!=$password) return array('status'=>2);
        $this->setSession($res);//设置session
        
        return $this->getUserReturn($res);
    }
    //退出登录
    function logOut(){
        $this->clearSession();
        return array('status'=>0);
    }
    //修改密码
    function changePass($arr){
        $old = $arr['oldpass'];
        $new = $arr['newpass'];
        global $localdb;
        $result = $localdb->result_first("select password from user_list where user_id='$_SESSION[user_id]'");
        if($result != md5($old)){
            return array('status'=>1);
        }
        if(!$new) return array('status'=>1);
        $new = md5($new);
        $localdb->query("update user_list set password='$new' where user_id='$_SESSION[user_id]'");
        return array('status'=>0);
    }
    //检测登录状态
    function chkStatus($arr){
        if(!$_SESSION['user_id']) return array('status'=>1);
        global $localdb;
        $userid = $_SESSION['user_id'];
        $res = $localdb->fetch_first("select a.*,CONVERT(varchar(19),a.regtime,20) as regtime,b.power from user_list a,user_level b where a.level_name = b.level_name and a.user_id='$userid'");
        if(!$res) return array('status'=>1);
        $this->setSession($res);
        return $this->getUserReturn($res);
    }
    //统一返回用户登录后的信息
    private function getUserReturn($res){
        global $localdb;
        $time = date('Y-m-d H:i:s',time());
        $ip = _get_client_ip();
        $localdb->query("insert into login_logs (logintime,ip,user_id) values ('$time','$ip','$res[user_id]')");
        $logintimes = $localdb->result_first("select count(*) from login_logs where user_id=$res[user_id]");
        $login_list = $localdb->fetch_all("select top 10 *,CONVERT(varchar(19),logintime,20) as logintime from login_logs where user_id='$res[user_id]' order by id desc");

        return array(
            'status'=>0,
            'user_id'=>$res['user_id'],
            'power'=>json_decode($res['power'],true),
            'user_name'=>$res['user_name'],
            'loginid'=>$res['loginid'],
            'bumen'=>$res['bumen'],
            'bag_id'=>$res['bag_id'],
            'chejian_id'=>$res['chejian_id'],
            'store_id'=>$res['store_id'],
            'regtime'=>$res['regtime'],
            'logintimes'=>$logintimes,//登录次数
            'list'=>$login_list,//历史登录记录
            'config'=>$this->getSysConfig()
            //'stores'=>getStoreConfig(),//同时返回门店配置
            //'citys'=>getCitys()//返回城市配置
        );
    }
    //设置会话
    private function setSession($arr){
        $_SESSION['user_name'] = $arr['user_name'];
        $_SESSION['loginid'] = $arr['loginid'];
        $_SESSION['user_id'] = $arr['user_id'];
        $_SESSION['power'] = json_decode($arr['power'],true);
        $_SESSION['regtime'] = $arr['regtime'];
        $_SESSION['bumen'] = $arr['bumen'];
        $_SESSION['bag_id'] = $arr['bag_id'];
        $_SESSION['chejian_id'] = $arr['chejian_id'];
        $_SESSION['store_id'] = $arr['store_id'];
        setcookie('loginid',$arr['loginid'],time()+30*24*3600,'/');
    }
    //清空会话
    private function clearSession(){
        $_SESSION['user_name'] = '';
        $_SESSION['loginid'] = '';
        $_SESSION['user_id'] = '';
        $_SESSION['power'] = '';
        $_SESSION['regtime'] = '';
        $_SESSION['bumen'] = '';
        $_SESSION['bag_id'] = '';
        $_SESSION['chejian_id'] = '';
        $_SESSION['store_id'] = '';
        
    }
    //获取系统配置信息。门店、加工中心、仓库
    private function getSysConfig(){
        global $localdb;
        global $msdb;
        global $t6db;
        //门店部分
        $res = $msdb->fetch_all("select ch_branchno as store_id,vch_company as store_name from t_hq_branch_info where ch_branchno<8000 order by ch_branchno asc");
        $stores = array();
        foreach($res as $k=>$v){
            $stores[$v['store_id']] =array('store_name'=>$v['store_name']);
        }
        $res = $localdb->fetch_all("select store_id,store_name from store_list where store_id<8000 order by store_id asc");
        $stores_local = array();
        foreach($res as $k=>$v){
            $stores_local[$v['store_id']] =array('store_name'=>$v['store_name']);
        }
        //对比思讯系统和本地数据库门店信息
        foreach($stores as $k=>$v){
            if(!$stores_local[$k]){//本地不存在则新建
                $localdb->query("insert into store_list (store_id,store_name) values ('$k','$v[store_name]')");
            }
        }
        //最终取本地门店数据
        $stores = $localdb->fetch_all("select store_id,store_name,area,city from store_list order by store_id asc");
        
        //加工中心车间暂时以本地数据库为准 by ying 2013 08 17
        $chejians = $localdb->fetch_all("select chejian_id,chejian_name from chejian_list order by chejian_id asc");
        
        
        //仓库部分
        $res = $t6db->fetch_all("select cWhCode as bag_id,cWhName as bag_name from Warehouse where bFreeze=0");
        $bags = array();
        foreach($res as $k=>$v){
            $bags[$v['bag_id']] =array('bag_name'=>$v['bag_name']);
        }
        $res = $localdb->fetch_all("select bag_id,bag_name from bag_list");
        $bags_local = array();
        foreach($res as $k=>$v){
            $bags_local[$v['bag_id']] =array('bag_name'=>$v['bag_name']);
        }
        //对比思讯系统和本地数据库仓库信息
        foreach($bags as $k=>$v){
            if(!$bags_local[$k]){//本地不存在则新建
                $localdb->query("insert into bag_list (bag_id,bag_name) values ('$k','$v[bag_name]')");
            }
        }
        //最终取本地仓库数据
        $bags = $localdb->fetch_all("select bag_id,bag_name from bag_list order by id asc");
        return array(
            'stores'=>$stores,
            'chejians'=>$chejians,
            'bags'=>$bags,
            'departments'=>$this->getDepartment(),
            'levels'=>$localdb->fetch_all("select level_name from user_level order by id asc")
        );
    }
    private function  getDepartment(){
        global $localdb;
        return $localdb->fetch_all("select * from personnel_department order by id asc");    
    }
}
?>