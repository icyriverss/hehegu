<?php
error_reporting(0);
header("Cache-Control: no-cache, must-revalidate");
header("Content-Type: text/html; charset=UTF-8");

session_start();
set_time_limit(0);
ignore_user_abort(true);

require_once 'inc/config.php';

require_once 'inc/store.php';
require_once 'inc/sell.php';
require_once 'inc/update_sell.php';
require_once 'inc/cls_orders.php';
require_once 'inc/cls_level.php';
require_once 'inc/cls_user.php';
require_once 'inc/cls_chejian.php';
require_once 'inc/cls_store.php';
require_once 'inc/cls_shuidian.php';
require_once 'inc/cls_yusuan.php';
require_once 'inc/cls_t6.php';
require_once 'inc/cls_personnel.php';
require_once 'inc/cls_gongcheng.php';
require_once 'inc/cls_chengben.php';
require_once 'inc/cls_v1.php';

$order = new cls_order;
$userlevel = new cls_level;
$user = new cls_user;
$chejian = new cls_chejian;
$store = new cls_store;
$shuidian = new cls_shuidian;
$yusuan = new cls_yusuan;
$personnel = new cls_personnel;
$gongcheng = new cls_gc;
$chengben = new cls_chengben;
$v1 = new cls_v1;



$arr = array(
    'code'=>'01',
    'stores'=>array('0201','0202','0203','0204','0205','0206')
    );
// print_r($arr);

print_r($yusuan->getPlan($arr));
die();

print_r($yusuan->getPlan($arr));
die();

//$res =$localdb->fetch_all("select  * from yusuan_items order by code asc");
//
//echo json_encode($res);
//die();

//$order->test();

/*
方法：
userLogin(user_name,password):登录，返回｛status:0/1,power:{yunying:1,setting:0,admin:1}｝
userLogout:退出登录
*/
//saveasexcel($arr,'test.xls');
$request=isset($_POST['request'])?stripslashes($_POST['request']):0;
$request=json_decode($request,true);
$method = $_POST['method'];
$user->checkPower($method);//检测权限
switch($method){
    case 'getLastUpdate':
        $res = getLastUpdate($request);
        break;
    case 'updateReport':
        $res = updateReport($request);
        break;
    case 'getNewDish':
        $res = getNewDish($request);
        break;
    case 'getNewDishByMonths':
        $res = getNewDishByMonths($request);
        break;
    case 'getSellTotal':
        $res = getSellTotal($request);
        break;
    case 'getSellByYears':
        $res = getSellByYears($request);
        break;
    case 'getSellByMonths':
        $res = getSellByMonths($request);
        break;
    case 'getSellByDays':
        $res = getSellByDays($request);
        break;
    case 'getSellQushi':
        $res = getSellQushi($request);
        break;
    
    
    
    
    
    case 'getUserList':
        $page = int_val($request['page']);
        $res = getUserList($page);
        break;
    case 'addNewUser':
        $res = addNewUser($request);
        break;
    case 'getUserInfo':
        $res = getUserInfo($request);
        break;
    case 'editUser':
        $res = editUser($request);
        break;
    case 'delUser':
        $res = delUser($request['userid']);
        break;
    case 'getStoreList':
        $page = int_val($request['page']);
        $res = getStoreList($page);
        break;
    case 'addNewStore':
        $res = addNewStore($request);
        break;
    case 'getStoreInfo':
        $res = getStoreInfo($request);
        break;
    case 'editStore':
        $res = editStore($request);
        break;
    case 'delStore':
        $res = delStore($request['id']);
        break;
    case 'getStoreConfig':
        $res = getStoreConfig();
        break;
    case 'getWater':
        $res = getWater($request);
        break;
    case 'addWater':
        $res = addWater($request);
        break;
    case 'getSellData':
        $res = array();
        break;
    default:
        if(!strpos($method,'->')){
            if(function_exists($method)){
                eval('$res='.$method.'($request);');
            }else{
                $res = null;
            }
        }else{//调用类中的方法
            $tmparr = split('->',$method);
            eval('$tmpobj =$'.$tmparr[0].' ;');
            if(is_object($tmpobj) && method_exists($tmpobj,$tmparr[1])){
                eval('$res=$'.$method.'($request);');
            }else{
                $res = null;
            }
        }
}
echo json_encode(array('request'=>$res));
exit();
?>