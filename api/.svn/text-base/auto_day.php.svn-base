<?php
set_time_limit(0);
require_once 'inc/config.php';
require_once 'inc/cls_user.php';
require_once 'inc/store.php';
require_once 'inc/update_sell.php';
$sell = new cls_update_sell;

$type = 'day';
$day = $_GET['day'];



if(!$day){
    if($type=='month'){//每个月全部重新生成一次
        $res = $msdb->fetch_first("select top 1 CONVERT(varchar(10),dt_operdate ,111) as year from cyhq_u_orderdish order by dt_operdate asc");
        $day = date('Y-m-d',strtotime($res['year']));
    }else{//每天更新2次。每次重新生成7天之内的数据
        $day = date('Y-m-d',time() - 3600 * 24 * 7);
    }
}else{
    $day = strtotime($day .' 00:00:00') + 24 *3600;
    $day = date('Y-m-d',$day); 
}
while($day && $day<date('Y-m-d',time())){
    $sell->update_by_day($day);
    $day = strtotime($day .' 00:00:00') + 24 *3600;
    $day = date('Y-m-d',$day); 
}

echo 'Update report data complete.['.$type.']';
die();
?>