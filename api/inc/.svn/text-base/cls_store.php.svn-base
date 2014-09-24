<?php
class cls_store{
    function edit($arr){
        $store_id = parsepoststr($arr['store_id']);
        $sql = '';
        foreach($arr as $key=>$value){
            $key = parsepoststr($key);
            $value = parsepoststr($value);
            if($key=='store_id') continue;
            if(!$sql){
                $sql ="$key='$value'";
            }else{
                $sql .=",$key='$value'";
            }
        }
        $sql = "update store_list set $sql where store_id='$store_id'";
        global $localdb;
        $localdb->query($sql);
        
        $arr = $localdb->fetch_all("select city from store_list GROUP BY city");
        $res = array();
        foreach($arr as $k=>$v){
            if($v['city']) $res[]=$v['city'];
        }
        
        return array('status'=>0,'citys'=>$res);
    }
    function getList($arr){
        global $localdb;
        $perpage = intval($arr['perpage'])?intval($arr['perpage']):10;//Ä¬ÈÏ·ÖÒ³10
        $page = intval($arr['page'])?intval($arr['page']):1;//Ò³Âë
        $sql = "select id,store_id,store_name,CONVERT(varchar(10),startdate,20) as startdate,isnull(address,''),isnull(manager_mobile,'') from store_list  order by store_id asc";
        $res = $localdb->query_page_all($sql,$perpage,$page);
        return array('list'=>$res,'total'=>$localdb->total,'perpage'=>$perpage,'page'=>$page);
    }
    function getInfo($arr){
        global $localdb;
        $store_id = parsepoststr($arr['store_id']);
        $res = $localdb->fetch_first("select *,CONVERT(varchar(10),startdate,20) as startdate,
        CONVERT(varchar(10),stopdate_1,20) as stopdate_1,
        CONVERT(varchar(10),stopdate_2,20) as stopdate_2,
        CONVERT(varchar(10),xiaosha_date,20) as xiaosha_date,
        CONVERT(varchar(10),outside_clean_date,20) as outside_clean_date,
        CONVERT(varchar(10),lease_start_day,20) as lease_start_day,
        CONVERT(varchar(10),lease_end_day,20) as lease_end_day,
        CONVERT(varchar(10),pay_lease_day,20) as pay_lease_day
        from store_list where store_id='$store_id'");
        foreach($res as $k=>$v){
            if(!$v) $res[$k] = '';
        }
        return $res;
    }
}
?>