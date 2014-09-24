<?php
//销售数据类
function getNewDish($arr){
    global $msdb;
    //分店
    $stores = $arr['stores'];
    if($stores) {
    
    $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    
    //计算日期范围
    $nyear = $year = int_val($arr['year']);
    $month = int_val($arr['month']);

    $nday = date('t', strtotime("$year-$month-1"));
    
    if(strtotime("$year-$month-$nday")>time()){//查询本月数据，则取前一天
        $nday = date('d',time() - 24 * 3600);
    }
    
    $start = date('Y-m-d',strtotime("$year-$month-01"));
    $end = date('Y-m-d',strtotime("$year-$month-$nday"));
 
    $dishlist = $msdb->fetch_all("
    select vch_dishname,ch_dishno,b.vch_seriesname,a.ch_seriesno
    from cybr_bt_dish a,cybr_bt_dish_series b
    where 
	a.ch_seriesno = b.ch_seriesno
    and CHARINDEX('新品',a.vch_explain)>0
    and dt_build between '$start' and '$end' order by dt_build desc",false);
    
    //查询所有新品销售记录
    foreach($dishlist as $k=>$v){
        $sql .="cast(sum(case when a.ch_dishno='$v[ch_dishno]' then (num_num - num_back) else 0 end)as numeric(11,0)) as '$v[ch_dishno]',";
    }
    
    $sql = "select 
    grouping(ch_branchno) as istotal,
    $sql
	cast(sum(case when b.ch_seriesno='01' then (num_num-num_back) else 0 end) as numeric(11,0)) as '01',
	cast(sum(case when b.ch_seriesno='02' then (num_num-num_back) else 0 end) as numeric(11,0)) as '02',
	cast(sum(case when b.ch_seriesno='03' then (num_num-num_back) else 0 end) as numeric(11,0)) as '03',
	cast(sum(case when b.ch_seriesno='04' then (num_num-num_back) else 0 end) as numeric(11,0)) as '04',
	cast(sum(case when b.ch_seriesno='05' then (num_num-num_back) else 0 end) as numeric(11,0)) as '05',
	cast(sum(case when b.ch_seriesno='06' then (num_num-num_back) else 0 end) as numeric(11,0)) as '06',
    ch_branchno
    from cyhq_u_orderdish a,cybr_bt_dish b
    where
    dt_operdate between '$start' and '$end'
    $store
    and a.ch_dishno = b.ch_dishno
    group by ch_branchno with rollup
    having sum(num_num - num_back) <> 0
    order by istotal desc";
    $list = $msdb->fetch_all($sql,true);

    return array('dishlist'=>$dishlist,'list'=>$list);
}

function getNewDishByMonths($arr){
    //分店
    $stores = $arr['stores'];
    if($stores) {
    
    $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    //需求的字段
    $year = int_val($arr['year']);
    $sql = '';
    global $msdb;
    $start = date('Y-m-d',strtotime("$year-01-01"));
    $end = date('Y-m-d',strtotime("$year-12-31"));
    $today = date('Y-m-d',time());//使用该字段缓存每天的数据
    $dishlist = $msdb->fetch_all("
    select vch_dishname,ch_dishno,b.vch_seriesname,a.ch_seriesno
    from cybr_bt_dish a,cybr_bt_dish_series b
    where 
	a.ch_seriesno = b.ch_seriesno
    and CHARINDEX('新品',a.vch_explain)>0
    and dt_build between '$start' and '$end' order by dt_build desc",true);
    $sql = '';
    foreach($dishlist as $k=>$v){
        $sql .="cast(sum(case when ch_dishno='$v[ch_dishno]' then (num_num - num_back) else 0 end)as numeric(11,2)) as '$v[ch_dishno]',";
    }
    $sql = "select 
    $sql
    CONVERT(varchar(2),dt_operdate ,0) as months
    from cyhq_u_orderdish
    where
    dt_operdate between '$start' and '$end'
    $store
    and $today=$today
    group by CONVERT(varchar(2),dt_operdate ,0) with rollup
    having CONVERT(varchar(2),dt_operdate ,0) <> ''
    order by months asc";

    $list = $msdb->fetch_all($sql,true);

    return array('dishlist'=>$dishlist,'list'=>$list);
}
// 经营报表
function jingyinReport($arr){
    $sell = getSellTotal($arr);
    foreach($sell as $k=>$v){
        if($v['istotal']==1){
            $res = $v;
        }
    }
    global $localdb;
     //日期
    $startday = $arr['startday'];
    $endday = $arr['endday'];
    if(!$startday||!$endday) return array();
    //分店
    $stores = $arr['stores'];
    if($stores) {
        $store = " and store_id in (".join(',',$stores).") ";
    }else{
        $store = " and store_id =''";
    }
    $res['yongdian'] = $localdb->result_first("select sum(cost) from biao_use where biao_type_id =1 and usedate between '$startday' and '$endday' $store");
    $res['chufang'] = $localdb->result_first("select sum(cost) from biao_use where biao_type_id =2 and usedate between '$startday' and '$endday' $store");
    $res['dating'] = $localdb->result_first("select sum(cost) from biao_use where biao_type_id =3 and usedate between '$startday' and '$endday' $store");
    $res['yongshui'] = $localdb->result_first("select sum(cost) from biao_use where biao_type_id =5 and usedate between '$startday' and '$endday' $store");

    return $res;
}


function getSellTotal($arr){
    //日期
    $startday = $arr['startday'];
    $endday = $arr['endday'];
    if(!$startday||!$endday) return array();
    //分店
    $stores = $arr['stores'];
    if($stores) {
    
        $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    //需求的字段
    $fields = $arr['fields'];
    $sql = '';
    if($fields){
        foreach($fields as $k=>$v){
            $v = parsepoststr($v);
            if($v=='fengshou'){
                $sql .="isnull(max(total),0) as fengshou,";
            }else{
                $sql .="isnull(sum($v),0) as $v ,";
            }
        }
    }
    global $localdb;
    $sql = "select 
grouping(ch_branchno) as istotal,
$sql
ch_branchno
from hehegu_report_sell where 
report_date between '$startday' and '$endday'
and istotal=0
$store
group by ch_branchno with rollup
order by istotal desc";

    $res = $localdb->fetch_all($sql);


    foreach($res as $kk=>$vv){
        if($vv['istotal']==1){
            global $yusuan;
            foreach($fields as $k=>$v){
                $code = $yusuan->transfer($v);
                if($code){
                    $res[$kk][$v.'_yusuan'] = $yusuan->getPlan(array('stores'=>$stores,'code'=>$code));
                }
            }
        }
    }

    return $res;
}
function getSellByYears($arr){
    //分店
    $stores = $arr['stores'];
    if($stores) {
    
    $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    //需求的字段
    $fields = $arr['fields'];
    $sql = '';
    if($fields){
        foreach($fields as $k=>$v){
            $v = parsepoststr($v);
            if($v=='fengshou'){
                $sql .="isnull(max(total),0) as fengshou,";
            }else{
                $sql .="isnull(sum($v),0) as $v ,";
            }
        }
    }
    
    global $localdb;
    $sql = "select 
    $sql
    CONVERT(varchar(4),report_date ,111) as years
    from hehegu_report_sell where 
    report_date<'".date('Y-m-d',time())."' 
    and istotal=0
    $store
    group by CONVERT(varchar(4),report_date ,111) order by years asc";
    return $localdb->fetch_all($sql);
}
function getSellByMonths($arr){
    //分店
    $stores = $arr['stores'];
    if($stores) {
    
    $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    //需求的字段
    $fields = $arr['fields'];
    $year = int_val($arr['year']);
    $sql = '';
    if($fields){
        foreach($fields as $k=>$v){
            $v = parsepoststr($v);
            if($v=='fengshou'){
                $sql .="isnull(max(total),0) as fengshou,";
            }else{
                $sql .="isnull(sum($v),0) as $v ,";
            }
        }
    }
    global $localdb;
    $sql = "select 
    $sql
    CONVERT(varchar(2),report_date ,0) as months
    from hehegu_report_sell where 
    report_date between '$year-01-01' and '$year-12-31'
    and istotal=0
    $store
    group by CONVERT(varchar(2),report_date ,0) order by months asc";
    return $localdb->fetch_all($sql);
}
function getSellByDays($arr){
    //分店
    $stores = $arr['stores'];
    if($stores) {
    
    $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    //需求的字段
    $fields = $arr['fields'];
    $sql = '';
    if($fields){
        foreach($fields as $k=>$v){
            $v = parsepoststr($v);
            if($v=='fengshou'){
                $sql .="isnull(max(total),0) as fengshou,";
            }else{
                $sql .="isnull(sum($v),0) as $v ,";
            }
        }
    }
    $year = int_val($arr['year']);
    $month = int_val($arr['month']);
    $nmonth = $month+1;
    $nyear = $year;
    if($month==12){
        $nmonth = 1;
        $nyear++;
    }
    global $localdb;
    $sql = "select 
    $sql
    CONVERT(varchar(2),report_date ,3) as dayss
    from hehegu_report_sell where 
    report_date>='$year-$month-01' 
    and report_date <'$nyear-$nmonth-01'
    and istotal=0
    $store
    group by CONVERT(varchar(2),report_date ,3) order by dayss asc";
    return $localdb->fetch_all($sql);
}

function getSellQushi($arr){
    //分店
    $stores = $arr['stores'];
    if($stores) {
    
    $store = " and ch_branchno in (".join(',',$stores).") ";
    }else{
        $store = " and ch_branchno =''";
    }
    
    //需求的字段
    $fields = $arr['fields'];
    $field = '';
    if($fields){
        foreach($fields as $k=>$v){
            $v = parsepoststr($v);
            if($v=='fengshou'){
                $field .="isnull(max(total),0) as fengshou,";
            }else{
                $field .="isnull(sum($v),0) as $v ,";
            }
        }
    }
    //计算日期范围
    $year = int_val($arr['year']);
    $month = int_val($arr['month']);
    $start = date('Y-m-d',strtotime("$year-$month-01"));
    $end =getCurrentDay($year,$month);
    
    
    //查询本期
    global $localdb;
    $sql = "select 
    $field
    CONVERT(varchar(2),report_date ,0) as months
    from hehegu_report_sell where 
    report_date between '$start' and '$end'
    and istotal=0
    $store
    group by CONVERT(varchar(2),report_date ,0)";
    $res = $localdb->fetch_first($sql);
    
    
    //查询本期所有数据
    global $localdb;
    $sql = "select 
    $field
    CONVERT(varchar(2),report_date ,0) as months
    from hehegu_report_sell where 
    report_date between '$start' and '$end'
    and istotal=0
    group by CONVERT(varchar(2),report_date ,0)";
    $pres = $localdb->fetch_first($sql);
    foreach($fields as $k=>$v){
        $res[$v . '_all']=$pres[$v];
    }
    
    //同期的日期范围
    $arr = getSameDay($year,$month);
    $start = $arr['start'];
    $end = $arr['end'];
    
    //查询同期
    $sql = "select 
    $field
    CONVERT(varchar(2),report_date ,0) as months
    from hehegu_report_sell where 
    report_date between '$start' and '$end'
    and istotal=0
    $store
    group by CONVERT(varchar(2),report_date ,0)";
    $pres = $localdb->fetch_first($sql);
    //合并同期数据
    foreach($fields as $k=>$v){
        $res['s'.$v]=$pres[$v];
    }
    
    //查询同期总数据
    $sql = "select 
    $field
    CONVERT(varchar(2),report_date ,0) as months
    from hehegu_report_sell where 
    report_date between '$start' and '$end'
    and istotal=0
    group by CONVERT(varchar(2),report_date ,0)";
    $pres = $localdb->fetch_first($sql);
    //合并同期数据
    foreach($fields as $k=>$v){
        $res['s'.$v . '_all']=$pres[$v];
    }
    
    //上期的日期范围
    $arr = getPreDay($year,$month);
    $start = $arr['start'];
    $end = $arr['end'];
    //查询上期
    $sql = "select 
    $field
    CONVERT(varchar(2),report_date ,0) as months
    from hehegu_report_sell where 
    report_date between '$start' and '$end'
    and istotal=0
    $store
    group by CONVERT(varchar(2),report_date ,0)";
    $pres = $localdb->fetch_first($sql);
    
    //合并数据
    foreach($fields as $k=>$v){
        $res['p'.$v]=$pres[$v];
    }
    
    
    //查询上期所有店数据
    $sql = "select 
    $field
    CONVERT(varchar(2),report_date ,0) as months
    from hehegu_report_sell where 
    report_date between '$start' and '$end'
    and istotal=0
    group by CONVERT(varchar(2),report_date ,0)";
    $pres = $localdb->fetch_first($sql);
    
    //合并数据
    foreach($fields as $k=>$v){
        $res['p'.$v . '_all']=$pres[$v];
    }
    
    global $yusuan;
    foreach($fields as $k=>$v){
        $code = $yusuan->transfer($v);
        if($code){
            $res[$v.'_yusuan'] = $yusuan->getPlan(array('stores'=>$stores,'code'=>$code));
        }
    }
    return $res;
}
?>