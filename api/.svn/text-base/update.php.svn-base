<?php
require_once 'inc/config.php';
require_once 'inc/cls_user.php';
require_once 'inc/store.php';
require_once 'inc/update_sell.php';
$sell = new cls_update_sell;
$day = $_GET['day'];
if(!$day) {
    $res = $msdb->fetch_first("select top 1 CONVERT(varchar(10),dt_operdate ,111) as year from cyhq_u_orderdish order by dt_operdate asc");
    $day = date('Y-m-d',strtotime($res['year']));
    
}else{
    $day = strtotime($day .' 00:00:00') + + 24 *3600;
    $day = date('Y-m-d',$day); 
}
if($day>date('Y-m-d',time())){
    echo '更新报表完成\n';
    die();
}
$sell->update_by_day($day);
$url = '?day=' . $day;
showsucess('',$url);
?>