<?php

//获取水电数据列表
function getWater($arr){
    $year = int_val($arr['year']);
    $month = int_val($arr['month']);
    
    $stores = $arr['stores'];
    if($stores) {
        $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    
    
    $ischange = int_val($arr['ischange']);//是否是趋势表
    if($ischange){//趋势表
        $res = getWaterChange($store_id,$year,$month);
    }else if(!$store_id){//统计表
        $res = array();
       /* foreach($stores as $key=>$value){
            $store_id = $value['store_id'];
            $res[$store_id] = getWaterTotalByMonth($store_id,$year,$month);
            $res[$store_id]['title'] = $value['title'];
        }*/
    }else if(!$month){//月历表
        $res = array();
        for($i=1;$i<=12;$i++){
            $res[$i]=getWaterTotalByMonth($store_id,$year,$i);
        }
    }else{//日历表，详细表
        $res= getWaterByMonth($store_id,$year,$month);
    }
    return $res;
}
//获取趋势数据
function getWaterChange($store_id,$year,$month){
    $res = array();
    if($month==1){
        $nmonth = 12;
        $nyear = $year - 1;
    }else{
        $nmonth= $month-1;
        $nyear = $year;
    }
    $date = date('Y-m',strtotime("$year-$month"));
    if($date ==date(('Y-m-d'),time())){$day=1;}
    $res['base'] = getWaterTotalByMonth($store_id,$year,$month);//实际
    $res['shangqi'] = getWaterTotalByMonth($store_id,$nyear,$nmonth);//上期
    $res['tongqi'] = getWaterTotalByMonth($store_id,$year-1,$month,$day);//同期
    return $res;
}

//获取某店某月能源总数据
function getWaterTotalByMonth($store_id,$year,$month,$day=0){
    global $db;
    $date = date('Y-m',strtotime("$year-$month"));
    if($day>0){
        $startdate = date('Y-m-d',strtotime("$year-$month-01"));
        $enddate = date('Y-m-d',strtotime("$year-$month-$day"));
        $sql = "select sum(yongshui) as yongshui,sum(yongdian) as yongdian,sum(chufang_dian) as chufang_dian,sum(dating_dian) as dating_dian from water where adddate>='$startdate' and adddate<='$enddate' and store_id ='$store_id'";
    }else{
        $sql = "select sum(yongshui) as yongshui,sum(yongdian) as yongdian,sum(chufang_dian) as chufang_dian,sum(dating_dian) as dating_dian from water where convert(varchar(7),adddate, 20)='$date' and store_id ='$store_id'";
    }
    $res = $db->fetch_first($sql);
    if(!$res['yongshui']) $res['yongshui']='--';
    if(!$res['yongdian']) $res['yongdian']='--';
    if(!$res['chufang_dian']) $res['chufang_dian']='--';
    if(!$res['dating_dian']) $res['dating_dian']='--';
    return $res;
}
//获取某月详细数据
function getWaterByMonth($store_id,$year,$month){
    global $db;
    $date = date('Y-m',strtotime("$year-$month"));
    $sql = "select * from water where convert(varchar(7),adddate, 20)='$date' and store_id='$store_id'";
    $query = $db->query($sql);
    $res = array();
    while($info=$db->fetch_array($query)){
        $res[]= $info;
    }
    return $res;
}
?>