<?php
class cls_gc{
    private $db;
    private $t6db;
    private $msdb;
    function __construct(){
        global $localdb;
        global $t6db;
        global $msdb;
        $this->db = $localdb;
        $this->t6db = $t6db;
        $this->msdb = $msdb;
    }
    function getDay($arr){
        $stores = $arr['store_id'];
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $nmonth = $month+1;
        $nyear = $year;
        if($month==12){
            $nmonth = 1;
            $nyear++;
        }
        $startday = date('Y-m-d',strtotime("$year-$month-01"));
        $lastday = date(t,strtotime("$year-$month-01"));
        $endday = date('Y-m-d',strtotime("$year-$month-$lastday"));
        
        $days = 1 + abs(strtotime($startday) - strtotime($endday))/86400;
        $sell = $this->getSellData($startday,$endday,$stores,'dayss');
        $water = $this->getWater($startday,$endday,$stores,'dayss');
        
        $list = array();
        for($indexname=1;$indexname<=$lastday;$indexname++){
            if(!$sell[$indexname]) $sell[$indexname] = array();
            if(!$water[$indexname]) $water[$indexname] = array();
            $list[$indexname] = array_merge($sell[$indexname],$water[$indexname]);
            // if(!$water[$indexname])                continue;
            $tmp = $list[$indexname];
            $tmp['days'] = $days;
            $tmp['100元用电量（度）'] = floor(100 * 10 / $tmp['dian_price'])/10;
            $tmp['日均用电量（度/天）'] = floor($tmp['dian_total'] * 10 / $days )/10;
            $tmp['日均用电量（元/天）'] = floor($tmp['dian_cost_total'] * 10 / $days)/10;
            $tmp['100元用电量（天）'] = floor(100 * 10 / $tmp['日均用电量（元/天）'])/10;
            
            $tmp['100元用水量（吨）'] = floor(100 * 10 / $tmp['shui_price']) / 10; 
            $tmp['日均用水量（吨/天）'] = floor($tmp['yongshui'] * 10 / $days) / 10;
            $tmp['日均用水量（元/天）'] = floor($tmp['shui_cost'] * 10 / $days)/10;
            $tmp['100元用水量（天）'] = floor(100 * 10 / $tmp['日均用水量（元/天）'])/10;
            $list[$indexname] = $tmp;
        }
        return array('list'=>$list);
    }
    function getMonth($arr){
        $stores = $arr['stores'];
        $year = int_val($arr['year']);
        $startday = date('Y-m-d',strtotime("$year-01-01"));
        $endday = date('Y-m-d',strtotime("$year-12-31"));
        
        $days = 1 + abs(strtotime($startday) - strtotime($endday))/86400;
        $sell = $this->getSellData($startday,$endday,$stores,'months');
        $water = $this->getWater($startday,$endday,$stores,'months');
        
        $list = array();
        for($indexname=1;$indexname<=12;$indexname++){
            if(!$sell[$indexname]) $sell[$indexname] = array();
            if(!$water[$indexname]) $water[$indexname] = array();
            $list[$indexname] = array_merge($sell[$indexname],$water[$indexname]);
            // if(!$water[$indexname])                continue;
            $tmp = $list[$indexname];
            $tmp['days'] = date(t,strtotime("$year-$indexname-01"));
            $tmp['100元用电量（度）'] = floor(100 * 10 / $tmp['dian_price'])/10;
            $tmp['日均用电量（度/天）'] = floor($tmp['dian_total'] * 10 / $days )/10;
            $tmp['日均用电量（元/天）'] = floor($tmp['dian_cost_total'] * 10 / $days)/10;
            $tmp['100元用电量（天）'] = floor(100 * 10 / $tmp['日均用电量（元/天）'])/10;
            
            $tmp['100元用水量（吨）'] = floor(100 * 10 / $tmp['shui_price']) / 10; 
            $tmp['日均用水量（吨/天）'] = floor($tmp['yongshui'] * 10 / $days) / 10;
            $tmp['日均用水量（元/天）'] = floor($tmp['shui_cost'] * 10 / $days)/10;
            $tmp['100元用水量（天）'] = floor(100 * 10 / $tmp['日均用水量（元/天）'])/10;
            $list[$indexname] = $tmp;
        }
        return array('list'=>$list);
    }
    function getYear($arr){
        $stores = $arr['store_id'];
        $startday = date('Y-m-d',strtotime("2013-01-01"));
        $endday = date('Y-m-d',time());
        $lastyear = date('Y',time());
        
        $days = 1 + abs(strtotime($startday) - strtotime($endday))/86400;
        $sell = $this->getSellData($startday,$endday,$stores,'years');
        $water = $this->getWater($startday,$endday,$stores,'years');
        
        // print_r($water);
        $list = array();
        for($indexname=2013;$indexname<=$lastyear;$indexname++){
            if(!$sell[$indexname]) $sell[$indexname] = array();
            if(!$water[$indexname]) $water[$indexname] = array();
            $list[$indexname] = array_merge($sell[$indexname],$water[$indexname]);

            // if(!$water[$indexname])                continue;
            $tmp = $list[$indexname];
            $tmp['days'] = 365;
            $tmp['100元用电量（度）'] = floor(100 * 10 / $tmp['dian_price'])/10;
            $tmp['日均用电量（度/天）'] = floor($tmp['dian_total'] * 10 / $days )/10;
            $tmp['日均用电量（元/天）'] = floor($tmp['dian_cost_total'] * 10 / $days)/10;
            $tmp['100元用电量（天）'] = floor(100 * 10 / $tmp['日均用电量（元/天）'])/10;
            
            $tmp['100元用水量（吨）'] = floor(100 * 10 / $tmp['shui_price']) / 10; 
            $tmp['日均用水量（吨/天）'] = floor($tmp['yongshui'] * 10 / $days) / 10;
            $tmp['日均用水量（元/天）'] = floor($tmp['shui_cost'] * 10 / $days)/10;
            $tmp['100元用水量（天）'] = floor(100 * 10 / $tmp['日均用水量（元/天）'])/10;
            $list[$indexname] = $tmp;
        }
        // print_r($list);
        return array('list'=>$list);
    }
    function getStores(){
        $res = $this->msdb->fetch_all("select ch_branchno as store_id,vch_company as store_name from t_hq_branch_info where ch_branchno<8000 order by ch_branchno asc");
        $arr = array();
        foreach($res as $k=>$v){
            array_push($arr, $v['store_id']);
        }
        return $arr;
    }
    

    function getQushi($arr){
        $stores = $arr['stores'];
        $stores_all = $this->getStores();
        $list = array();
        //计算日期范围
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $start = date('Y-m-d',strtotime("$year-$month-01"));
        $end =getCurrentDay($year,$month);
        
        $res = $this->getTotalByDays($start, $end, $stores);
        $list['shiji'] = $res['合计'];
        $res = $this->getTotalByDays($start, $end, $stores_all);
        $list['shiji_all'] = $res['合计'];
        
        //同期的日期范围
        $arr = getSameDay($year,$month);
        $start = $arr['start'];
        $end = $arr['end'];
        
        $res = $this->getTotalByDays($start, $end, $stores);
        $list['tongqi'] = $res['合计'];
        $res = $this->getTotalByDays($start, $end, $stores_all);
        $list['tongqi_all'] = $res['合计'];
        
        
        //上期的日期范围
        $arr = getPreDay($year,$month);
        $start = $arr['start'];
        $end = $arr['end'];
        
        $res = $this->getTotalByDays($start, $end, $stores);
        $list['shangqi'] = $res['合计'];
        $res = $this->getTotalByDays($start, $end, $stores_all);
        $list['shangqi_all'] = $res['合计'];
        
        
        return array('list'=>$list);
        
    }
    function getTotal($arr){
        $startday = parsepoststr($arr['startday']);
        $endday = parsepoststr($arr['endday']);
        $stores = $arr['stores'];
        return array('list'=>$this->getTotalByDays($startday, $endday, $stores));
    }
    function getTotalByDays($startday,$endday,$stores){
        $nums = count($stores);
        $nums = $nums==0?1:$nums;
        $days = 1 + abs(strtotime($startday) - strtotime($endday))/86400;
        
        $sell = $this->getSellData($startday,$endday,$stores);
        $water = $this->getWater($startday,$endday,$stores);
        
        $list = array();
        $list['合计'] = array();
        $list['平均'] = array();
        $keys = array();
        // print_r($water);
        foreach($stores as $k => $indexname){
            if(!$sell[$indexname]) $sell[$indexname] = array();
            if(!$water[$indexname]) $water[$indexname] = array();
            $list[$indexname] = array_merge($sell[$indexname],$water[$indexname]);
            $tmp = $list[$indexname];
            $tmp['days'] = $days;
            $tmp['100元用电量（度）'] = floor(100 * 10 / $tmp['dian_price'])/10;
            $tmp['日均用电量（度/天）'] = floor($tmp['dian_total'] * 10 / $days )/10;
            $tmp['日均用电量（元/天）'] = floor($tmp['dian_cost_total'] * 10 / $days)/10;
            $tmp['100元用电量（天）'] = floor(100 * 10 / $tmp['日均用电量（元/天）'])/10;
            
            $tmp['100元用水量（吨）'] = floor(100 * 10 / $tmp['shui_price']) / 10; 
            $tmp['日均用水量（吨/天）'] = floor($tmp['yongshui'] * 10 / $days) / 10;
            $tmp['日均用水量（元/天）'] = floor($tmp['shui_cost'] * 10 / $days)/10;
            $tmp['100元用水量（天）'] = floor(100 * 10 / $tmp['日均用水量（元/天）'])/10;
            $list[$indexname] = $tmp;
            $tmpkeys = array_keys($tmp);
            foreach($tmpkeys as $a=>$b){
                if(!in_array($b,$keys)) array_push($keys,$b);
            }
        }
        
        //求总计和平均
        $avg = array();
        $total = array();
        foreach($keys as $x=>$y){
            foreach($stores as $k=>$store_id){
                $total[$y] += $list[$store_id][$y];
            }
            $avg[$y] = floor($total[$y] * 100 /$nums) / 100;
        }
        $list['合计'] = $total;
        $list['平均'] = $avg;
        return $list;
    }
    //获取门店的销售数据
    function getSellData($startday,$endday,$stores = '',$groupby='ch_branchno'){
        if($stores) {
            $sql = " and ch_branchno in (".join(',',$stores).") ";
        }else{
            $sql = " and ch_branchno =''";
        }
        if($groupby==='dayss'){
            $sql_groupby = 'CONVERT(varchar(2),report_date ,3)';
        }elseif($groupby==='months'){
            $sql_groupby = 'CONVERT(varchar(2),report_date ,0)';
        }elseif($groupby==='years'){
            $sql_groupby = 'CONVERT(varchar(4),report_date ,111)';
        }elseif($groupby==='ch_branchno'){
            $sql_groupby = 'ch_branchno';
        }
        $sql = "select isnull(sum(total),0) as total,$sql_groupby as $groupby  from hehegu_report_sell where report_date between '$startday' and '$endday' $sql group by $sql_groupby";
        $list = $this->db->fetch_all($sql);
        $res = array();
        for($i=0;$i<count($list);$i++){//转换为门店索引
            if($groupby!=='store_id') $list[$i][$groupby] = int_val($list[$i][$groupby]);
            $res[$list[$i][$groupby]] = $list[$i];
        }
        return $res;
    }
    //获取门店用电
    function getWater($startday,$endday,$stores='',$groupby='store_id'){
        if($stores) {
            $sql = " and store_id in (".join(',',$stores).") ";
        }else{
            $sql = " and store_id =''";
        }
        if($groupby==='dayss'){
            $sql_groupby = 'CONVERT(varchar(2),usedate ,3)';
        }elseif($groupby==='months'){
            $sql_groupby = 'CONVERT(varchar(2),usedate ,0)';
        }elseif($groupby==='years'){
            $sql_groupby = 'CONVERT(varchar(4),usedate ,111)';
        }elseif($groupby==='store_id'){
            $sql_groupby = 'store_id';
        }
        $sql = "select 
        isnull(sum(case when biao_type_id=3 then yongliang end),0) as dating,
        isnull(sum(case when biao_type_id=2 then yongliang end),0) as chufang,
        isnull(avg(case when biao_type_id=3 then price end),0) as dating_price,
        isnull(avg(case when biao_type_id=2 then price end),0) as chufang_price,
        isnull(sum(case when biao_type_id=3 then cost end),0) as dating_cost,
        isnull(sum(case when biao_type_id=2 then cost end),0) as chufang_cost,
        isnull(sum(case when biao_type_id=5 then yongliang end),0) as yongshui,
        isnull(avg(case when biao_type_id=5 then price end),0) as shui_price,
        isnull(sum(case when biao_type_id=5 then cost end),0) as shui_cost,
        $sql_groupby as $groupby from biao_use where usedate between '$startday' and '$endday' $sql group by $sql_groupby";
        $list = $this->db->fetch_all($sql);
        $res = array();
        for($i=0;$i<count($list);$i++){//转换为门店索引
            $list[$i]['dian_total'] = $list[$i]['dating'] + $list[$i]['chufang'];
            $list[$i]['dian_cost_total'] = $list[$i]['dating_cost'] + $list[$i]['chufang_cost'];
            $list[$i]['dian_price'] = ($list[$i]['dating_price'] + $list[$i]['chufang_price'])/2;
            if($groupby!=='store_id') $list[$i][$groupby] = int_val($list[$i][$groupby]);
            $res[$list[$i][$groupby]] = $list[$i];
        }
        return $res;
    }
}
?>