
<?php
class cls_order{
    /**
     * 删除订单
     *
     * @param mixed $order_id This is a description
     * @return mixed This is the return value description
     *
     */    
    public function delOrder($arr){
        global $localdb;
        global $t6db;
        $order_id = parsepoststr($arr['order_id']);
        $info = $localdb->fetch_first("select * from order_list where order_id='$order_id'");
        if(!$info) return array('status'=>0);
        $localdb->transaction();
        switch($info['order_type']){
            case 1://总部订单，需要检测出入库
                if($info['status']!=1){//先清理T6数据库
                    $this->delT6Order($order_id);
                }
            case 2://直供，需要检测出入库
                if($info['status']!=4){//清理T6数据库
                    
                }
            case 3://调拨
            case 4://盘点
            case 5://材料报损
            case 6://成品报损
                $localdb->query("delete from order_list_more where order_id='$order_id'");
                $localdb->query("delete from order_list where order_id='$order_id'");
                break;
        }
        if($localdb->error()){
            $localdb->rollback();
            return array('status'=>1);    
        }else{
            $localdb->commit();
            return array('status'=>0);
        }
    }
    //删除T6数据库中的出库单
    private function delT6Order($order_id){
        global $t6db;
        $info = $t6db->fetch_first("select id,cwhcode from rdrecord where ccode='$order_id'");
        if(!$info) return true;
        $id = $info['id'];
        $bagid = $info['cwhcode'];
        $arr = $t6db->fetch_all("select * from rdrecords where id='$id'");//明细表
        $t6db->transaction();
        for($i=0;$i<count($arr);$i++){
            $nums = $arr[$i]['iQuantity'];//出库的数量
            $cinvcode = $arr[$i]['cInvCode'];
            $t6db->query("update currentstock set fOutQuantity=fOutQuantity-$nums where cwhcode='$bagid' and cinvcode='$cinvcode'");
        }
        $t6db->query("delete from rdrecords where id='$id'");
        $t6db->query("delete from rdrecord where id='$id'");
        if($t6db->error()){
            $t6db->rollback();
            return false;    
        }else{
            $t6db->commit();    
            return true;
        }
    }
    //获取生成的childsid fatherid 返回数组
    function get_spid($rows){
        $reomoteid = '00';
        $cacc_id = '001';
        $cvouchtype = 'rd';
        $iamount = $rows;
        $ifatherid = 0;
        $ichildid = 0;
        //参数需要以如下数组方式赋值并标明类型，SQLSRV_PARAM_IN是输入类型，SQLSRV_PARAM_OUT是输出类型。注意要按照存储过程定义的顺序赋值
        $params = array( 
            array(&$reomoteid, SQLSRV_PARAM_IN),
            array(&$cacc_id, SQLSRV_PARAM_IN),
            array(&$cvouchtype, SQLSRV_PARAM_IN),
            array(&$iamount, SQLSRV_PARAM_IN),
            array($ifatherid, SQLSRV_PARAM_OUT,SQLSRV_PHPTYPE_INT),
            array($ichildid, SQLSRV_PARAM_OUT,SQLSRV_PHPTYPE_INT)
        );
        $tsql_callSP = "{call sp_GetId(?,?,?,?,?,?)}";
        global $t6db;
        $query = sqlsrv_query($t6db->link, $tsql_callSP, $params);
        if( $query === false )
        {
            echo "Error in executing statement 3.\n";
            die( print_r( sqlsrv_errors(), true));
        }
        sqlsrv_next_result($query);
        return array('fatherid'=>$ifatherid,'childid'=>$ichildid);
    }
    function test(){
        $this->createOut('ZBXQ20130825020101');
    }
    function getDBOrderlistTotal($arr){
        global $localdb;
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $store_id = parsepoststr($arr['store_id']);
        $date = date('Y-m',strtotime("$year-$month-01"));
        $sql = "select 
sum(b.cost * b.hesuan_num) as price,
a.store_id,
a.storeid
from order_list a,order_list_more b 
where 
(
	a.store_id='$store_id'  --所有订单 包括调出订单
	or a.storeid='$store_id'  --调入的订单
)
and a.order_type = 3
and	CONVERT(varchar(7),a.order_date,20) ='$date' 
and a.order_id = b.order_id
--and a.status = 0  --在已结束的订单中查询
group by a.store_id,a.storeid";    

        $res = $localdb->fetch_all($sql);
        return array('list'=>$res);
    }
    //月度调入调出明细表
    function getDBOrderlist($arr){
        global $localdb;
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $store_id = parsepoststr($arr['store_id']);
        $date = date('Y-m',strtotime("$year-$month-01"));
        $sql = "select 
b.name,b.guige,b.kucun_danwei,
b.cost,
sum(b.cost * b.hesuan_num) as price,
sum(b.hesuan_num) as nums,
a.store_id,
a.storeid,
b.bianhao,
CONVERT(varchar(10),a.order_date,20) as adddate
from order_list a,order_list_more b 
where 
(
	a.store_id='$store_id'  --所有订单 包括调出订单
	or a.storeid='$store_id'  --调入的订单
)
and a.order_type = 3
and	CONVERT(varchar(7),a.order_date,20) ='$date' 
and a.order_id = b.order_id
--and a.status = 0  --在已结束的订单中查询
group by b.bianhao,b.name,b.guige,b.kucun_danwei,b.cost,a.store_id,a.storeid,CONVERT(varchar(10),a.order_date,20)
order by adddate asc";
        $res = $localdb->fetch_all($sql);
        return array('list'=>$res);
    }
    //月度盘点表
    function getOrderlistByMonth($arr){
        global $localdb;
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $store_id = parsepoststr($arr['store_id']);
        $date = date('Y-m',strtotime("$year-$month-01"));
        $sql = "select 
b.name,b.guige,b.kucun_danwei,b.cost,
sum(case when a.order_type=1 or a.order_type=2 then b.real_send else 0 end)  as 'jinhuo', --总部和供应商进货数
sum(case when a.order_type=3 and a.storeid='$store_id' then b.hesuan_num else 0 end)  as 'diaoru', --调入
sum(case when a.order_type=3 and a.store_id='$store_id' then b.hesuan_num else 0 end)  as 'diaochu', --调出
sum(case when a.order_type=5 or a.order_type=6 then b.hesuan_num else 0 end) as 'baosun', --报损
b.bianhao
from order_list a,order_list_more b 
where 
(
	a.store_id='$store_id'  --所有订单 包括调出订单
	or (a.storeid='$store_id' and a.order_type =3 ) --调入的订单
)
and(
	CONVERT(varchar(7),a.order_date,20) ='$date' and (a.order_type=1 or a.order_type=2 or a.order_type=3) -- 总部订单、直供订单、调入调出按order_date查看
	or CONVERT(varchar(7),a.adddate,20) = '$date' and (a.order_type = 4 or a.order_type=5 or a.order_type = 6) -- 盘点、登记，按登记日期查看
)
and a.order_id = b.order_id
--and a.status = 0
group by b.bianhao,b.name,b.guige,b.kucun_danwei,b.cost";
        $res = $localdb->fetch_all($sql);
        return array('list'=>$res);
    }
    //在用友T6数据库操作 直供需求订单 直接生成入库单
    private function createIn($order_id){
        global $localdb;
        global $t6db;
        //插入收发主表
        $res = $localdb->fetch_first("select *,CONVERT(varchar(19),adddate,20) as adddate from order_list where order_id='$order_id'");

        $bagid = $res['bagid'];//缓存仓库ID
        
        $store_id = $this->getT6_storeID($res['store_id']);
        if(!$store_id) return array('status'=>6);
        
        //调用存储过程 获得最新的索引id
        $rows = $localdb->result_first("select max(id)-min(id)+1 from order_list_more where order_id='$order_id'");
        $ids = $this->get_spid($rows);
        
        $fatherid = $ids['fatherid'];
        $childid = $ids['childid'];
        
        $sql = "insert into rdrecord (biafirst,bisstqc,vt_id,bpufirst,brdflag,cbustype,ccode,cdefine16,cdefine7,cdepcode,cmaker,crdcode,cvencode,csource,cvouchtype,cwhcode,ddate,id,imquantity,iproorderid) values ('0','0','27','0','1','普通采购','$order_id','0','0','$store_id','$res[user_name]','0101','$res[vendorid]','库存','01','$res[bagid]','$res[order_date]','$fatherid','0','0')";
        $t6db->query($sql);
        //插入收发子表和库存表
        $arr = $localdb->fetch_all("select * from order_list_more where order_id='$order_id'");
        foreach($arr as $k=>$v){
            //插入收发子表
            $tmpid = $k - $rows + $childid;
            
            $sql = "insert into rdrecords (autoid,id,ifnum,ifquantity,innum,inquantity,inum,iquantity,iunitcost,iprice,isoutnum,cbvencode,cdefine26,cdefine27,cinvcode,cposition) values 
            ('$tmpid','$fatherid',0,0,0,0,0,'$v[hesuan_num]','$v[cost]','".$v[hesuan_num]*$v[cost]."',0,'','$v[hesuan_num]',0,'$v[bianhao]','')";
            $t6db->query($sql);
            //插入库存表
            $bhas = $t6db->fetch_first("select cinvcode from currentstock where cwhcode='$bagid' and cinvcode='$v[bianhao]'");
            if(!$bhas) $t6db->query("Insert Into CurrentStock(cWhcode,cInvCode,cFree1,cFree2,cFree3,cFree4,cFree5,cFree6,cFree7,cFree8,cFree9,cFree10,cBatch,dMDate,iMassDate,dVDate) values ('$bagid','$v[bianhao]','','','','','','','','','','','',Null,'',Null)");//该库目前没有该物品则插入一条记录
            $sql = "update currentstock set fInQuantity =fInQuantity+$v[hesuan_num] where cwhcode='$bagid' and cinvcode='$v[bianhao]'";
            $t6db->query($sql);
        }
    }
    //获取T6中对照的门店编号
    private function getT6_storeID($store_id){
        global $t6db;
        return $t6db->result_first("select cDepcode from Department where cDepMemo='$store_id'");
    }
    //在用友T6数据库生成出库单
    private function createOut($order_id){
        global $localdb;
        global $t6db;
        //插入收发主表
        $res = $localdb->fetch_first("select *,CONVERT(varchar(19),adddate,20) as adddate from order_list where order_id='$order_id'");

        $bagid = $res['bagid'];//缓存仓库ID
        
        $store_id = $this->getT6_storeID($res['store_id']);
        if(!$store_id) return array('status'=>6);
        
        //调用存储过程 获得最新的索引id
        $rows = $localdb->result_first("select max(id)-min(id)+1 from order_list_more where order_id='$order_id'");
        $ids = $this->get_spid($rows);
        
        $fatherid = $ids['fatherid'];
        $childid = $ids['childid'];
        
        $sql = "insert into rdrecord (biafirst,bisstqc,vt_id,bpufirst,brdflag,cbustype,ccode,cdefine16,cdefine7,cdepcode,cmaker,cdefine3,crdcode,csource,cvouchtype,cwhcode,ddate,id,imquantity,iproorderid) values 
        (0,0,65,0,0,'领料','$order_id',0,0,'$store_id','$res[send_user_name]','$res[user_name]','0201','库存','11','$res[bagid]','$res[order_date]','$fatherid',0,0)";
        $t6db->query($sql);
        //插入收发子表和库存表
        $arr = $localdb->fetch_all("select * from order_list_more where order_id='$order_id'");
        foreach($arr as $k=>$v){
            //插入收发子表
            $tmpid = $k - $rows + $childid;
            $sql = "insert into rdrecords 
            (autoid,id,ifnum,ifquantity,innum,inquantity,inum,iquantity,isoutnum,cbvencode,cdefine26,cdefine27,cinvcode,cposition) values
            ('$tmpid',convert(int,'$fatherid'),0,0,0,0,0,convert(float,'$v[real_send]'),0,'',convert(float,'$v[hesuan_num]'),0,'$v[bianhao]','')";
            $t6db->query($sql);
            //插入库存表
            $bhas = $t6db->fetch_first("select cinvcode from currentstock where cwhcode='$bagid' and cinvcode='$v[bianhao]'");
            if(!$bhas) $t6db->query("Insert Into CurrentStock(cWhcode,cInvCode,cFree1,cFree2,cFree3,cFree4,cFree5,cFree6,cFree7,cFree8,cFree9,cFree10,cBatch,dMDate,iMassDate,dVDate) values ('$bagid','$v[bianhao]','','','','','','','','','','','',Null,'',Null)");//该库目前没有该物品则插入一条记录
            $sql = "update currentstock set fOutQuantity =fOutQuantity+$v[real_send] where cwhcode='$bagid' and cinvcode='$v[bianhao]'";
            $t6db->query($sql);
        }
    }
    //获取物品列表
    function getGoodsList(){
        global $t6db;
        $date = date('Y-m-d',time());
        $sql = "SELECT     t.cInvCode, t.cInvName, t.cInvCCode,t.cInvStd, s.cComUnitName AS cInvUnit, ISNULL(t.cInvDefine2, s.cComUnitName) AS iBzUnit, ISNULL(t.cInvDefine3, 1) 
                      AS iBzHsl, ISNULL(t.cInvDefine4, s.cComUnitName) AS iDeUnit, ISNULL(t.cInvDefine5, 1) AS iDeHsl, t.cInvDefine1 AS cInvType, ISNULL(t.iInvNCost, 0) 
                      AS iUnitCost, ISNULL(t.iInvRCost, 0) AS iInvRCost
FROM         Inventory AS t LEFT OUTER JOIN
                      ComputationUnit AS s ON t.cComUnitCode = s.cComunitCode where dedate>'$date' or dedate is null";

        return $t6db->fetch_all($sql,true,3600*24);//物品列表，缓存一天
    }
    //获取某物品信息
    private function getGoodsInfo($id){
        global $t6db;
        $sql = "SELECT     t.cInvCode, t.cInvName, t.cInvStd, s.cComUnitName AS cInvUnit, ISNULL(t.cInvDefine2, s.cComUnitName) AS iBzUnit, ISNULL(t.cInvDefine3, 1) 
                      AS iBzHsl, ISNULL(t.cInvDefine4, s.cComUnitName) AS iDeUnit, ISNULL(t.cInvDefine5, 1) AS iDeHsl, t.cInvDefine1 AS cInvType, ISNULL(t.iInvNCost, 0) 
                      AS iUnitCost, ISNULL(t.iInvRCost, 0) AS iInvRCost
FROM         Inventory AS t LEFT OUTER JOIN
                      ComputationUnit AS s ON t.cComUnitCode = s.cComunitCode where t.cInvCode='$id'";
        return $t6db->fetch_first($sql);//物品列表，缓存一天
    }
    //每日订单上限数量100个，否则会出现重复订单
    function getNumber(){
        global $localdb;
        $sql = "SELECT RIGHT(order_id,2) as code FROM order_list where  adddate='" . date('Y-m-d',time()) . "' order by id desc";
        $res = $localdb->result_first($sql);
        $res = $res?($res + 1):1;
        $res = strlen($res)==1?'0'.$res:$res;
        return $res;
    }
    //审核收货单
    function passOrder($arr){
        global $localdb;
        $order_id = parsepoststr($arr['order_id']);
        $list = $arr['list'];
        //验证格式
        $status = $localdb->result_first("select status from order_list where order_id='$order_id'");
        if($status !=3) return array('status'=>1);
        $sql = "update order_list_more set status=0 where order_id='$order_id'";
        $localdb->query($sql);
        //更新订单状态
        $sql = "update order_list set status=0,passdate='".date('Y-m-d',time())."',pass_user_id='$_SESSION[user_id]',pass_user_name='$_SESSION[user_name]' where order_id='$order_id' and status=3";
        $localdb->query($sql);
        return array('status'=>0);
    }
    //确认收货
    function recvOrder($arr){
        global $localdb;
        $order_id = parsepoststr($arr['order_id']);
        $list = $arr['list'];
        //验证格式
        $status = $localdb->result_first("select status from order_list where order_id='$order_id'");
        if($status !=2) return array('status'=>1);
        foreach($list as $k=>$v){
            $sql = "update order_list_more set real_recv='$v[nums]',status=3,chayi_yuanyin='$v[chayi_yuanyin]' where order_id='$order_id' and bianhao='$k'";
            $localdb->query($sql);
        }
        //更新订单状态
        $sql = "update order_list set status=3,recvdate='".date('Y-m-d',time())."',recv_user_id='$_SESSION[user_id]',recv_user_name='$_SESSION[user_name]' where order_id='$order_id' and status=2";
        $localdb->query($sql);
        return array('status'=>0);
    }
    //发货
    function sendOrder($arr){
        global $localdb;
        $order_id = parsepoststr($arr['order_id']);
        $list = $arr['list'];
        //验证格式
        $status = $localdb->result_first("select status from order_list where order_id='$order_id'");
        if($status !=1) return array('status'=>1);
        foreach($list as $k=>$v){
            $sql = "update order_list_more set real_send='$v',status=2 where order_id='$order_id' and bianhao='$k'";
            $localdb->query($sql);
        }
        //更新订单状态
        $sql = "update order_list set status=2,senddate='".date('Y-m-d',time())."',send_user_id='$_SESSION[user_id]',send_user_name='$_SESSION[user_name]' where order_id='$order_id' and status=1";
        $localdb->query($sql);
        $this->createOut($order_id);//生成出库单
        return array('status'=>0);
    }
    //获取仓库列表
    function getBagList(){
        global $t6db;
        return $t6db->fetch_all("select cWhCode as bagid,cWhName as bagname from Warehouse where bFreeze=0");
    }
    //获取供应商列表
    function getVendorList(){
        global $t6db;
        return $t6db->fetch_all("SELECT  cVenCode as vendorid, cVenName as vendorfullname,cVenAbbName as vendorname, cVenDepart FROM  Vendor WHERE (cVenDepart LIKE '99%')");
    }
    //获取订单详情
    function getOrderInfo($arr){
        global $localdb;
        $order_id = parsepoststr($arr['id']);
        $order_ids = $arr['ids'];
        if($order_ids){//合并出库单
            foreach($order_ids as $k=>$v){
                $order_ids[$k] = "'".$v."'";
            }
            $info = $localdb->fetch_all("select *,CONVERT(varchar(10),adddate,20) as adddate,CONVERT(varchar(10),senddate,20) as senddate,CONVERT(varchar(10),order_date,20) as order_date,CONVERT(varchar(10),recvdate,20) as recvdate,CONVERT(varchar(10),passdate,20) as passdate from 
            order_list where order_id in (".join(',',$order_ids).")");
            //先获取store_id列表
            $stores = $localdb->fetch_all("select store_id,chejian_id from order_list where order_id in (".join(',',$order_ids).") group by store_id,chejian_id");
            $sql = '';
            foreach($stores as $k=>$v){
                if($v['store_id']){
                    $sql .="sum(case when store_id='$v[store_id]' then convert(decimal(9,2),hesuan_num) else 0 end) as '$v[store_id]',";  
                    $sql .="sum(case when store_id='$v[store_id]' then convert(decimal(9,2),real_send) else 0 end) as '$v[store_id]_send',";  
                    $stores[$k]['bianhao'] = $v['store_id'];
                    $stores[$k]['name'] = $this->getStorename($v['store_id']);
                }elseif($v['chejian_id']){
                    $sql .="sum(case when chejian_id='$v[chejian_id]' then hesuan_num else 0 end) as '$v[chejian_id]',";  
                    $sql .="sum(case when chejian_id='$v[chejian_id]' then real_send else 0 end) as '$v[chejian_id]_send',";  
                    $stores[$k]['bianhao'] = $v['chejian_id'];
                    $stores[$k]['name'] = $this->getChejianname($v['chejian_id']);
                }
            }
        
            $list = $localdb->fetch_all("select bianhao,sum(convert(decimal(9,2),real_send)) as real_send,sum(convert(decimal(9,2),hesuan_num)) as hesuan_num,guige,kucun_danwei,baozhuang_danwei,guige,name,$sql b.type_name from order_list_more a
left join goods_type_list b
on a.bianhao = b.cinvcode
 where order_id in (".join(',',$order_ids).") group by bianhao,guige,kucun_danwei,baozhuang_danwei,name,b.type_name order by b.type_name asc,bianhao asc");
        }else{//单个出库单
            $list = $localdb->fetch_all("select a.*,b.type_name,convert(decimal(9,2),a.real_send) as real_send,convert(decimal(9,2),a.hesuan_num) as hesuan_num  from order_list_more a
left join goods_type_list b
on a.bianhao = b.cinvcode
where order_id='$order_id'
order by b.type_name asc,a.bianhao asc");
            $info = $localdb->fetch_first("select *,CONVERT(varchar(10),adddate,20) as adddate,CONVERT(varchar(10),senddate,20) as senddate,CONVERT(varchar(10),order_date,20) as order_date,CONVERT(varchar(10),recvdate,20) as recvdate,CONVERT(varchar(10),passdate,20) as passdate from order_list where order_id='$order_id'");
            if($info['store_id']){
                $info['order_from'] = $this->getStorename($info['store_id']);
            }elseif($info['chejian_id']){
                $info['order_from'] = $this->getChejianname($info['store_id']);
            }
            $info['send_bumen'] = $this->getBagname($info['bagid']);
        }
        
        return array('list'=>$list,'info'=>$info,'stores'=>$stores);
    }
    function getStorename($store_id){
        global $localdb;
        return $localdb->result_first("select store_name from store_list where store_id='$store_id'");
    }
    function getChejianname($chejian_id){
        global $localdb;
        return $localdb->result_first("select chejian_name from chejian_list where chejian_id='$chejian_id'");
    }
    function getBagname($bagid){
        global $localdb;
        return $localdb->result_first("select bag_name from bag_list where bag_id='$bagid'");
    }
    //获取订单列表
    function getOrderList($arr){
        global $localdb;
        $perpage = intval($arr['perpage'])?intval($arr['perpage']):10;//默认分页10
        $page = intval($arr['page'])?intval($arr['page']):1;//页码
        $order_type = intval($arr['order_type']);
        $status = intval($arr['status']);
        $bagid = parsepoststr($arr['bagid']);
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $gettype = parsepoststr($arr['gettype']);
        $sql = '';
        switch ($gettype){
            case 'chukudan':
                $sql = " where status <> 1 and order_type=1 ";
                if($bagid)  $sql .=' and bagid='.$bagid;
                $sql .= ' order by order_list.senddate desc';
                break;
            case 'fahuo'://仓库获取等待发货订单
                $sql = " where order_type=1 and status = 1 order by order_list.order_date asc";
                break;
            case 'shenhe'://仓库获取等待审核的订单
                $sql = " where order_type=1 and status = 3 order by id desc";
                break;
            case 'history'://门店或加工中心获取历史订货记录
                if($store_id) {
                    $sql = " where (store_id='$store_id' or (storeid='$store_id' and order_type=3)) and order_type <4 order by id desc";
                }elseif($chejian_id) {
                    $sql = " where chejian_id='$chejian_id' and order_type <4 order by id desc";
                }
                break;
            case 'shouhuo'://门店或加工中心获取等待收货确认的记录
                if($store_id) $sql = " where ((order_type=1 and store_id='$store_id') or (order_type=3 and storeid='$store_id')) and status=2 order by id desc";
                if($chejian_id) $sql = " where order_type=1 and chejian_id='$chejian_id' and status=2 order by id desc";
                break;
            case 'pandian'://门店盘点
                if($store_id) $sql = " where order_type =4 and store_id = '$store_id' order by order_list.adddate desc";
                break;
            case 'cailiaobaosun'://报损
                if($store_id) $sql = " where order_type =5  and store_id = '$store_id' order by order_list.adddate desc";
                break;
            case 'chenpinbaosun'://报损
                if($store_id) $sql = " where order_type =6  and store_id = '$store_id' order by order_list.adddate desc";
                break;
            case 'baosun'://报损
                if($store_id) $sql = " where (order_type =6 or order_type=5 ) and store_id = '$store_id' order by order_list.adddate desc,id desc";
                break;
            case 'shenhezg'://审核直供订单
                $sql = " where order_type = 2 and status <>0 order by order_list.adddate desc,id desc";
                break;
            case 'admin'://管理员查看所有
                $sql = " order by id desc";
                break;
        }
        $sql = "select *,CONVERT(varchar(10),adddate,20) as adddate,CONVERT(varchar(10),senddate,20) as senddate,CONVERT(varchar(10),order_date,20) as order_date,CONVERT(varchar(10),recvdate,20) as recvdate,CONVERT(varchar(10),passdate,20) as passdate from order_list  $sql ";
        
        $res = $localdb->query_page_all($sql,$perpage,$page);
        $total = $localdb->total;
        for($i=0;$i<count($res);$i++){
            unset($v['more']);
        }
        if(!$total) $res = array();
        return array('list'=>$res,'total'=>$total,'perpage'=>$perpage,'page'=>$page);
    }

    //生成新订单
    function addNewOrder($arr){
        global $localdb;
        $number = $this->getNumber();//
        $list = $arr['list'];//订单物品列表
        $more = json_encode($arr['list']);//订单物品列表详情字符串
        $order_type =  int_val($arr['order_type']);//订单类别
        $order_name = parsepoststr($arr['order_name']);
        $bagid = parsepoststr($arr['bagid']);
        $bagname = parsepoststr($arr['bagname']);
        $vendorid = parsepoststr($arr['vendorid']);
        $vendorname = parsepoststr($arr['vendorname']);
        $storeid = parsepoststr($arr['storeid']);
        $storename = parsepoststr($arr['storename']);
        $order_date = parsepoststr($arr['order_date']);
        $current_store_id = parsepoststr($arr['current_store_id']);
        $current_chejian_id = parsepoststr($arr['current_chejian_id']);
        if($order_type >=4){
            $adddate = parsepoststr($arr['adddate']);
        }else{
            $adddate = date('Y-m-d',time());
        }
        if($order_type==4){//检测该日期是否存在盘点，有则报错 
            $bhas = $localdb->fetch_first("select order_id from order_list where store_id='$current_store_id' and order_type=4 and adddate='$adddate'");
            if($bhas) return array('status'=>5);
        }
        if(!$current_store_id && !$current_chejian_id) return array('status'=>3);//所在门店或车间参数错误
        
        switch ($order_type){
            case 1:
                $order_id = 'ZBXQ';break;
            case 2:
                $order_id = 'ZGXQ';break;
            case 3:
                $order_id = 'DB';break;
            case 4:
                $order_id = 'PD';break;
            case 5:
                $order_id = 'SCBS';break;
            case 6:
                $order_id = 'DPBS';break;
        }
        if(!$order_id) return array('status'=>1);
        $order_id = $order_id.date('Ymd',time()).$_SESSION['store_id'].$number;
        if($order_type==6){
            $status = 0;
        }elseif($order_type==5){
            $status = 0;
        }elseif($order_type ==4){//4为盘点。。by ying 2013 08 16
            $status = 0;
        }elseif($order_type==3){//调入调出 等待收货确认
            $status= 2;
        }elseif($order_type==2){//直供需求直接到审核阶段。此订单每月结束后，由财务部统计联系供货商确认后再进行入库/出库操作。
            $status = 4;
        }else{
            $status = 1;
        }
        //当门店调入调出时 ，直接存入senddate,send_user_id,send_user_name，和订货人数据一样
        if($order_type==3){
            $senddate = $order_date;
            $send_user_id = $_SESSION['user_id'];    
            $send_user_name = $_SESSION['user_name'];
        }
        $sql = "insert Into order_list (user_id,adddate,status,store_id,order_id,user_name,more,order_type,order_name,bagid,bagname,vendorid,vendorname,storeid,storename,order_date,senddate,send_user_id,send_user_name,chejian_id) values 
        ( '$_SESSION[user_id]','$adddate','$status','$current_store_id','$order_id','$_SESSION[user_name]','$more','$order_type','$order_name','$bagid','$bagname','$vendorid','$vendorname','$storeid','$storename','$order_date','$senddate','$send_user_id','$send_user_name','$current_chejian_id')";
        
        $localdb->query($sql);
        foreach($list as $k=>$v){
            $info = $this->getGoodsInfo($v['cInvCode']);
            $type_name = parsepoststr($v['type_name']);//分类
            $type_index = parsepoststr($v['type_index']);//分类索引
            $baosun_yuanyin = parsepoststr($v['baosun_yuanyin']);//分类
            if($order_type==3){//调入调出，默认已经发货
                $real_send = $v['nums'];
            }
            $sql = "insert Into order_list_more (order_id,bianhao,name,guige,baozhuang_num,baozhuang_danwei,baozhuang_hsl,hesuan_num,kucun_danwei,kucun_hsl,cost,cost_ext,type_name,type_index,classname,store_id,user_id,user_name,adddate,status,order_type,bagid,vendorid,storeid,real_send,baosun_yuanyin) values
            ('$order_id',
            '$info[cInvCode]',
            '$info[cInvName]',
            '$info[cInvStd]',
            '$v[baozhuang_num]',
            '$info[iBzUnit]',
            '$info[iBzHsl]',
            convert(money,'$v[nums]'),
            '$info[cInvUnit]',
            '$info[iDeHsl]',
            convert(money,'$info[iUnitCost]'),
            convert(money,'$info[iInvRCost]'),
            '$type_name',
            '$type_index',
            '$info[cInvType]',
            '$current_store_id',
            '$_SESSION[user_id]',
            '$_SESSION[user_name]',
            '$adddate',
            '$status',
            '$order_type',
            '$bagid',
            '$vendorid',
            '$storeid',
            '$real_send',
            '$baosun_yuanyin'
            )";
            $localdb->query($sql);
        }
        return array('status'=>0);
    }
    //移除分类
    function removeType($arr){
        global $localdb;
        $id = parsepoststr($arr['id']);
        $type = parsepoststr($arr['type']);
        $isstore = int_val($arr['isstore']);
        $sql = "delete from goods_type_list where cInvCode='$id' and isstore='$isstore'";
        $localdb->query($sql);
        return array();
    }
    //添加至分类
    function addToType($arr){
        global $localdb;
        $id = parsepoststr($arr['id']);
        $type = parsepoststr($arr['type']);
        $isstore = int_val($arr['isstore']);
        $sql = "select a.* from goods_type_list a,goods_type b where a.cInvCode='$id' and a.type_name=b.type_name and a.isstore='$isstore' and a.isstore = b.isstore";
    
        $res =  $localdb->fetch_first($sql);
        if($res) return array('status'=>1);
        $sql = "insert into  goods_type_list (cInvCode,type_name,isstore) values ('$id','$type','$isstore')";
        $localdb->query($sql);
        return array('status'=>0);
    }
    //获取物品分类和数据
    function getGoodsTypeList($arr){
        global $localdb;
        $order_type = intval($arr['order_type']);
        $bagid = parsepoststr($arr['bagid']);
        $isstore = int_val($arr['isstore']);//加工中心、门店 要区分
        $res = array();
        $res['list'] = $this->getGoodsList();
        $res['type'] = $this->getTypeList($isstore);
        $res['typelist'] = $this->getGoodsByType($isstore);
        $res['baglist'] = $this->getBagList();
        $res['vendorlist'] = $this->getVendorList();
        return $res;
    }
    //新增分类
    function addType($arr){
        global $localdb;
        $typename = parsepoststr($arr['name']);
        $isstore = int_val($arr['isstore']);
        $sql = "select * from goods_type where type_name='$typename' and isstore='$isstore'";
        $res = $localdb->fetch_first($sql);
        if($res){
            return array('status'=>1);
        }else{
            $sql = "insert into goods_type (type_name,isstore) values ('$typename','$isstore')";
            $res = $localdb->query($sql);
            return array('status'=>0);
        }
    }
    //删除分类
    function delType($arr){
        global $localdb;
        $typename = parsepoststr($arr['name']);
        $isstore = int_val($arr['isstore']);
        $sql = "delete from goods_type where type_name='$typename' and isstore='$isstore'";
        $localdb->query($sql);
        $localdb->query("delete from goods_type_list where type_name='$typename' and isstore='$isstore'");
        return array('status'=>0);
    }
    //修改分类名称
    public function editType($arr){
        global $localdb;
        $typename = parsepoststr($arr['name']);
        $newtypename = parsepoststr($arr['newname']);
        $isstore = int_val($arr['isstore']);
        $sql = "select * from goods_type where type_name='$newtypename' and type_name<>'$typename' and isstore='$isstore'";
        $res = $localdb->fetch_first($sql);
        if($res){
            return array('status'=>1);
        }else{
            $sql = "update goods_type set type_name='$newtypename' where type_name='$typename' and isstore='$isstore'";
            $res = $localdb->query($sql);
            $sql = "update goods_type_list set type_name='$newtypename' where type_name='$typename' and isstore='$isstore'";
            $res = $localdb->query($sql);
            return array('status'=>0);
        }
    }
    //获取分类列表
    private function getTypeList($isstore){
        global $localdb;
        $sql = "select * from goods_type where isstore='$isstore'";
        return $localdb->fetch_all($sql);
    }
    //获取物品列表，按分类分组
    private function getGoodsByType($isstore){
        global $localdb;
        $sql = "select * from goods_type_list where isstore='$isstore'";
        $arr = $localdb->fetch_all($sql);
        $tmparr = array();
        foreach($arr as $k=>$v){
            $tmparr[$v['cInvCode']]=$v['type_name'];
        }
        return $tmparr;
    }

}
?>