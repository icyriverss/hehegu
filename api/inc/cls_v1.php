<?php
class cls_v1{
    function caiwu($arr){
        $beginDate = parsepoststr($arr['beginDate']);
        $endDate = parsepoststr($arr['endDate']);
        global $localdb;
        $res = $localdb->fetch_first("select sum(zaocan) as zaocan,sum(wucan) as wucan, sum(wancan) as wancan, sum(waisong) as waisong from hehegu_report_sell where  report_date between '$beginDate' and '$endDate'");
        return $res;
    }

    // 耗电统计。
    // 参数：
    // year:年份
    // month:月份
    // day:日
    // stores:门店数组
    function powerConsumption($arr){

        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $day = int_val($arr['day']);
        $stores = $arr['stores'];

        if($stores) {
            $stores = "  in (".join(',',$stores).") ";
        }else{
            $stores = "  =''";
        }
        $searchDate = date('Y-m-d',strtotime("$year-$month-$day"));

        $sql = "select 
store_name,
(select sum(total) from hehegu_report_sell where report_date = '$searchDate' and ch_branchno = sl.store_id) as shouru,
(select sum(yongliang) from biao_use where biao_type_id = 2 and usedate = '$searchDate' and store_id = sl.store_id) as chufang,
(select sum(yongliang) from biao_use where biao_type_id = 3 and usedate = '$searchDate' and store_id = sl.store_id) as dating,
(select sum(total) from hehegu_report_sell where report_date between (cast(year('$searchDate') as VARCHAR(50)) + '-' + cast(month('$searchDate') as VARCHAR(50)) + '-01') and '$searchDate' and ch_branchno = sl.store_id) as yueshouru,
(select sum(yongliang) from biao_use where biao_type_id = 2 and usedate between (cast(year('$searchDate') as VARCHAR(50)) + '-' + cast(month('$searchDate') as VARCHAR(50)) + '-01') and '$searchDate' and store_id = sl.store_id) as yuechufang,
(select sum(yongliang) from biao_use where biao_type_id = 3 and usedate between (cast(year('$searchDate') as VARCHAR(50)) + '-' + cast(month('$searchDate') as VARCHAR(50)) + '-01') and '$searchDate' and store_id = sl.store_id) as yuedating
from store_list as sl where sl.store_id $stores";
        global $localdb;
        $res = $localdb->fetch_all($sql);

        if($res){
            return $res;
        }else{
            return array();
        }
    }

    // 添加/修改 模范问题店
    // 参数列表：
    // year:年
    // month:月
    // list:数组，格式如下
    //      store_id:门店
    //      is_wt:是否问题店
    //      is_mf:是否模范店
    function addSpecial($arr){
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $list = $arr['list'];
        $report_date = date('Y-m-d',strtotime($year.'-'.$month.'-01'));
        global $localdb;
        foreach($list as $k=>$v){
            $store_id = parsepoststr($v['store_id']);
            $is_wt = int_val($v['is_wt']);
            $is_mf = int_val($v['is_mf']);
            $id = $localdb->result_first("select id from special_store where store_id='$store_id' and report_date='$report_date'");
            if($id){
                $localdb->query("update special_store set is_wt='$is_wt',is_mf='$is_mf' where id='$id'");
            }else{
                $localdb->query("insert into special_store (store_id,is_wt,is_mf,report_date) values ('$store_id','$is_wt','$is_mf','$report_date')");
            }
        }
        return array('status'=>0);
    }

    // 获取某月的问题莫饭店
    // 参数列表：
    // year:年
    // month:月
    // 返回结果：
    // 门店列表数字：格式如下：
    //      store_id:门店id
    //      is_wt:是否问题店
    //      is_mf:是否模范店
    //      report_date:年月日，其中日为01号
    function getSpecial($arr){
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $report_date = date('Y-m-d',strtotime($year.'-'.$month.'-01'));
        global $localdb;
        $res = $localdb->fetch_all("select * from special_store where report_date='$report_date'");
        if($res){
            return $res;
        }else{
            return array();
        }
    }


    // 获取特殊店列表
    // 参数列表：
    // year:年
    // month:月
    // 返回结果：
    //      门店列表：
    //      wenti:问题店数组
    //      mofan:模范店数组
    //      xinzeng:年度新增数组
    //      tongqi:同期同店数组
    //      shangye:商业店
    //      shangwu:商务店
    //      shequ:社区店
    //      hunhe:混合店
    //      门店数组字段：
    //      store_name:门店名称
    //      store_id:门店ID
    //      startdate:开业日期
    //      keliuliang:客流量、碗数
    //      total:总收入
    //      gongshi:总工时
    function specialList($arr){
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $firstday = date('Y-m-d',strtotime($year.'-'.$month.'-01'));
        $lastday = date('Y-m-t',strtotime($year.'-'.$month.'-01'));

        $oldyear_firstday = strtotime(($year - 1).'-'.$month.'-01');
        $oldyear_lastday = strtotime(date('Y-m-t',strtotime(($year - 1).'-'.$month.'-01')));
        global $localdb;
        $res = array();
        $stores = array();
        $sql = "select 
a.store_name,
a.store_id,
a.startdate,
a.market_type,
sum(b.keliuliang) as keliuliang,
sum(b.total) as total,
sum(b.gongshi) as gongshi,
c.is_wt,
c.is_mf
from store_list a
left JOIN
hehegu_report_sell b 
on a.store_id = b.ch_branchno
left join special_store c
on a.store_id = c.store_id
where
b.report_date between '$firstday' and '$lastday'
and
c.report_date between '$firstday' and '$lastday'
group by a.store_name,a.store_id,a.market_type,a.startdate,c.is_wt,c.is_mf;";
        $tmp = $localdb->fetch_all($sql);
        $res['wenti'] = array();
        $res['mofan'] = array();
        $res['xinzeng'] = array();
        $res['tongqi'] = array();
        $res['shangye'] = array();
        $res['shangwu'] = array();
        $res['shequ'] = array();
        $res['hunhe'] = array();

        foreach($tmp as $k=>$v){
            $v['startdate_time'] = strtotime($v['startdate']);
            if($v['is_wt']==1){
                $res['wenti'][] = $v;
            }
            if($v['is_mf']==1){
                $res['mofan'][] = $v;
            }
            if($v['market_type']==1){
                $res['shangye'][] = $v;
            }
            if($v['market_type']==2){
                $res['shangwu'][] = $v;
            }
            if($v['market_type']==3){
                $res['shequ'][] = $v;
            }
            if($v['market_type']==4){
                $res['hunhe'][] = $v;
            }
            if($v['startdate_time']>=strtotime($year.'-01-01') && $v['startdate_time']<=strtotime($year.'-12-31')){
                $res['xinzeng'][] = $v;
            }
            if($v['startdate_time']>=strtotime(($year-1).'-01-01') && $v['startdate_time']<=strtotime(($year-1).'-12-31')){
                $res['tongqi'][] = $v;
            }
        }

        return $res;
    }

    // 获取收入
    // 参数列表：
    //  beginDate:起始查询日期
    //  endDate:结束查询日期
    //  stores:门店数组，例如：['0201','0202']
    function getSell($arr){
        $beginDate = parsepoststr($arr['beginDate']);
        $endDate = parsepoststr($arr['endDate']);
         //分店
        $stores = $arr['stores'];
        if($stores) {
            $stores = " and ch_branchno in (".join(',',$stores).") ";
        }else{
            $stores = " and ch_branchno =''";
        }
        global $localdb;
        $res=$localdb->fetch_all("select sum(zaocan) as zaocan,sum(wucan) as wucan, sum(wancan) as wancan, sum(waisong) as waisong, sum(total) as total from hehegu_report_sell where report_date between '$beginDate' and '$endDate' $stores");
        if($res){
            return $res;
        }else{
            return array();
        }
    }

    // 指标综合排名表
    // 参数列表：
    // year:年
    // month:月
    // 返回结果：门店数组
    function getRankList($arr){
        $startday = parsepoststr($arr['startday']);
        $endday = parsepoststr($arr['endday']);

        
        global $localdb;
        $sql = "select 
store_name,store_id,
(select sum(total) from hehegu_report_sell where report_date between '$startday' and '$endday' and ch_branchno = sl.store_id) as shouru,
(select sum(yongliang) from biao_use where biao_type_id = 2 and usedate between '$startday' and '$endday' and store_id = sl.store_id) as chufang,
(select sum(yongliang) from biao_use where biao_type_id = 3 and usedate between '$startday' and '$endday' and store_id = sl.store_id) as dating
from store_list  as sl where store_id<8000";
        $res = $localdb->fetch_all($sql);
        
        if($res){
            return $res;
        }else{
            return array();
        }
    }

    function getRankListAddYusuan($arr){

        $res = $this->getRankList($arr);
         if(!$res){
            $res = array();
        }
        $month = int_val(date('m',strtotime(parsepoststr($arr['startday']))));
        global $yusuan;
        $code = $yusuan->transfer('total');
        foreach($res as $k=>$v){
            if($v['store_id']){
                $stores = array();
                array_push($stores,$v['store_id']);
                $tmp_yusuan = $yusuan->getPlan(array('code'=>$code,'stores'=>$stores));
                $res[$k]['yusuan'] = $tmp_yusuan[0]['m' . $month];
                $res[$k]['yusuan_percent'] = round($res[$k]['shouru'] * 100 / $res[$k]['yusuan'],1);
            }
        }
        return $res;

    }
    //获取T6中对照的门店编号
    private function getT6DepCode($store_id){
        $cdepcode = $this->t6db->result_first("select cDepcode from Department where cDepMemo='$store_id'");
        return $cdepcode;
    }
}
?>