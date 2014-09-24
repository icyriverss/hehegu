<?php
class cls_order{
    protected $db;
    protected $t6db;
    public function __construct(){
        global $localdb;
        global $t6db;
        $this->db= $localdb;
        $this->t6db = $t6db;
    }
    
    //添加订单
    public function addNewOrder($arr){
        $list = $arr['list'];//订单物品列表
        $more = json_encode($arr['list']);//json保存原始订单物品记录
        $order_type = int_val($arr['order_type']);
        $order_name = parsepoststr($arr['order_name']);
        $bagid = parsepoststr($arr['bagid']);//仓库ID
        $bagname = parsepoststr($arr['bagname']);//仓库名称
        $vendorid = parsepoststr($arr['vendorid']);//供应商ID
        $vendorname = parsepoststr($arr['vendorname']);//供应商名称
        $storeid = parsepoststr($arr['storeid']);//调拨订单 调入的门店
        $storename = parsepoststr($arr['storename']);//调拨订单 调入的门店名称
        $order_date = parsepoststr($arr['order_date']);//订单日期
        $current_store_id = parsepoststr($arr['current_store_id']);//发出订单的门店
        $current_chejian_id = parsepoststr($arr['current_chejian_id']);//发出订单的车间
        $depcode = $current_store_id ?$current_store_id: $current_chejian_id;
        $isstore = $current_store_id?1:2;
        $adddate = date('Y-m-d H:i:s',time());//添加日期
        if(!$depcode) $depcode=$_SESSION['user_id'];//所在门店或车间参数错误
        if($order_type==4 && $current_store_id && $this->hasPD($current_store_id,$order_date)) return array('status'=>5);//已存在门店盘点
        if($order_type==4 && $current_chejian_id && $this->hasChejianPD($current_chejian_id,$order_date)) return array('status'=>5);//已存在车间盘点
        $order_id = $this->createOrderID($order_type,$depcode,$order_date);
        $status = $this->getOrderStatusDefault($order_type);
        if($order_type==3){//调拨订单，直接发货
            $senddate = $order_date;
            $send_user_id = $_SESSION['user_id'];    
            $send_user_name = $_SESSION['user_name'];
        }
        $this->transaction();//开启事务
        $this->db->query("insert into order_list (user_id,adddate,status,store_id,order_id,user_name,more,order_type,order_name,bagid,bagname,vendorid,vendorname,storeid,storename,order_date,senddate,send_user_id,send_user_name,chejian_id,isstore) values 
('$_SESSION[user_id]','$adddate','$status','$current_store_id','$order_id','$_SESSION[user_name]','$more','$order_type','$order_name','$bagid','$bagname','$vendorid','$vendorname','$storeid','$storename','$order_date','$senddate','$send_user_id','$send_user_name','$current_chejian_id','$isstore')");
        $lastid = $this->db->result_first("select id from order_list where order_id='$order_id' order by id desc");
        if(!$lastid) $lastid = 0;
        for($i=0;$i<count($list);$i++){
            $this->addOrderMore($order_id,$order_type,$status,$isstore,$lastid,$list[$i]);//插入明细表
        }
        if($order_type==7){
            $this->createT6Order($order_id,'out'); 
        }
        return $this->iscommit()?array('status'=>0):array('status'=>1);
    }
    //删除订单
    public function delOrder($arr){
        $order_id = parsepoststr($arr['order_id']);
        $info = $this->db->fetch_first("select * from order_list where order_id='$order_id'");
        if(!$info) return array('status'=>2);//不存在的订单
        $this->transaction();
        $this->delLocalOrder($order_id);
        if($info['order_type']==2 && $info['status']==0){//已经审核通过的直供订单，需要删除2次
            $this->delT6Order($order_id .'01');
            $this->delT6Order($order_id .'02');
        }else{
            $this->delT6Order($order_id);
        }
        return $this->iscommit()?array('status'=>0):array('status'=>1);
    }
    //发货
    public function sendOrder($arr){
        $order_id = parsepoststr($arr['order_id']);
        $list = $arr['list'];
        //验证格式
        $info = $this->getOrderInfoByID($order_id);
        if($info['status'] !=1) return array('status'=>1);
        $this->transaction();//开启事务
        $this->changeOrderList($order_id,$list,'real_send',2);//先存入发货数量
        //更新订单状态
        $this->setOrderStatus($order_id,2);
        $this->createT6Order($order_id,'out');//生成出库单
        return $this->iscommit()?array('status'=>0):array('status'=>1);
    }
    //确认收货
    public function recvOrder($arr){
        $order_id = parsepoststr($arr['order_id']);
        $list = $arr['list'];
        //验证格式
        $info = $this->getOrderInfoByID($order_id);
        if($info['status'] !=2) return array('status'=>1);
        $this->transaction();//开启事务
        $this->changeOrderList($order_id,$list,'real_recv',3);//先存入收货数量和收货原因
        //更新订单状态
        $this->setOrderStatus($order_id,3);
        return $this->iscommit()?array('status'=>0):array('status'=>1);
    }
    //审核收货单
    public function passOrder($arr){
        $order_id = parsepoststr($arr['order_id']);
        $list = $arr['list'];
        //验证格式
        $info = $this->getOrderInfoByID($order_id);
        if($info['status'] !=4) return array('status'=>1);
        $this->transaction();//开启事务
        //更新订单状态
        $this->setOrderStatus($order_id,0);
        $this->createT6Order($order_id,'in');//生成入库单
        $this->createT6Order($order_id,'out');//生成入库单
        return $this->iscommit()?array('status'=>0):array('status'=>1);
    }
    //修改订单
    public function editOrder($arr){
        $order_id = parsepoststr($arr['order_id']);
        $list = $arr['list'];
        $ids = array();
        $info = $this->db->fetch_first("select *,CONVERT(varchar(19),adddate,20) as adddate from order_list where order_id='$order_id'");
        if(!$info) return array('status'=>2);
        $order_type = $info['order_type'];
        $this->transaction();//开启事务
        //先修改本地订单
        for($i=0;$i<count($list);$i++){
            $tmp = $list[$i];
            $order_nums = $tmp['order_nums'];
            $real_send = $tmp['real_send'];
            $real_recv = $tmp['real_recv'];
            $chayi_yuanyin = $tmp['chayi_yuanyin'];
            $bianhao = $tmp['bianhao'];
            $sql = "update order_list_more set order_nums='$order_nums',real_send='$real_send',real_recv='$real_recv',chayi_yuanyin='$chayi_yuanyin' where bianhao='$bianhao' and order_id='$order_id'";
            $this->db->query($sql);
            array_push($ids,$tmp['bianhao']);
        }
        $this->db->query("delete from order_list_more where order_id='$order_id' and bianhao not in ('".join("','",$ids)."')");
        //判断是否需要修改T6数据库
        if($order_type==1){//总部需求订单
            if($status!=1){//已经发货，需要同步
                $this->syncOrder($order_id,'out');
            }
        }elseif($order_type==2){//直供需求
            if($status==0) {//财务已经审核，需要同步
                $this->syncOrder($order_id,'in');
                $this->syncOrder($order_id,'out');
            }
        }elseif($order_type==7){//补发
            $this->syncOrder($order_id,'out');
        }elseif($order_type==8){//退库
            $this->syncOrder($order_id,'out');
        }else{//其他订单 不需要同步
            
        }
        return $this->iscommit()?array('status'=>0):array('status'=>1);
    }
    
    //获取物品分类和数据
    public function getGoodsTypeList($arr){
        $order_type = intval($arr['order_type']);
        $isstore = int_val($arr['isstore']);//加工中心、门店 要区分
        $res = array();
        $res['list'] = $this->getGoodsList();
        $res['type'] = $this->getTypeList($isstore);
        $res['typelist'] = $this->getGoodsByType($isstore);
        $res['baglist'] = $this->getBagList();
        $res['vendorlist'] = $this->getVendorList();
        return $res;
    }
    //获取订单列表
    public function getOrderList($arr){
        $perpage = intval($arr['perpage'])?intval($arr['perpage']):10;//默认分页10
        $page = intval($arr['page'])?intval($arr['page']):1;//页码
        $bagid = parsepoststr($arr['bagid']);
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $gettype = parsepoststr($arr['gettype']);
        $sql = '';
        switch ($gettype){
            case 'caiwu'://财务
                $store_id = parsepoststr($arr['storeid']);
                $chejian_id = parsepoststr($arr['chejianid']);
                $order_date = parsepoststr($arr['order_date']);
                $order_id = parsepoststr($arr['order_id']);
                $order_type = int_val($arr['order_type']);
                $bumen = parsepoststr($arr['bumen']);
                $sql = " where order_type='$order_type'";
                if($bumen=='store') {
                    if($store_id){
                        $sql .= " and store_id='$store_id'";
                    }else{
                        $sql .= " and store_id<>''";
                    }
                }
                if($bumen=='chejian') {
                    if($chejian_id){
                        $sql .= " and chejian_id='$chejian_id'";
                    }else{
                        $sql .= " and chejian_id<>''";
                    }
                }
                if($order_date) $sql .= " and order_date='$order_date'";
                if($order_id) $sql .= " and order_id like '%$order_id%'";
                $sql .=" order by order_list.order_date desc";
                break;
            case 'bufa'://补发退库
                $sql = " where (order_type=7 or order_type=8)";
                if($bagid)  $sql .=' and bagid='.$bagid;
                $sql .= ' order by order_list.senddate desc';
                break;
            case 'chukudan'://出库单
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
                if($chejian_id) $sql = " where order_type =4 and chejian_id = '$chejian_id' order by order_list.adddate desc";
                break;
            case 'cailiaobaosun'://报损
                if($store_id) $sql = " where order_type =5  and store_id = '$store_id' order by order_list.adddate desc";
                if($chejian_id) $sql = " where order_type =5  and chejian_id = '$chejian_id' order by order_list.adddate desc";
                break;
            case 'chenpinbaosun'://报损
                if($store_id) $sql = " where order_type =6  and store_id = '$store_id' order by order_list.adddate desc";
                if($chejian_id) $sql = " where order_type =6  and chejian_id = '$chejian_id' order by order_list.adddate desc";
                break;
            case 'baosun'://报损
                if($store_id) $sql = " where (order_type =6 or order_type=5 ) and store_id = '$store_id' order by order_list.adddate desc,id desc";
                if($chejian_id) $sql = " where (order_type =6 or order_type=5 ) and chejian_id = '$chejian_id' order by order_list.adddate desc,id desc";
                break;
            case 'shenhezg'://审核直供订单
                $sql = " where order_type = 2 and status <>0 order by order_list.adddate desc,id desc";
                break;
            case 'admin'://管理员查看所有
                $sql = " order by id desc";
                break;
        }
        $sql = "select *,CONVERT(varchar(10),adddate,20) as adddate,CONVERT(varchar(10),senddate,20) as senddate,CONVERT(varchar(10),order_date,20) as order_date,CONVERT(varchar(10),recvdate,20) as recvdate,CONVERT(varchar(10),passdate,20) as passdate from order_list  $sql ";
        $res = $this->db->query_page_all($sql,$perpage,$page);
        $total = $this->db->total;
        for($i=0;$i<count($res);$i++){
            unset($v['more']);
        }
        if(!$total) $res = array();
        return array('list'=>$res,'total'=>$total,'perpage'=>$perpage,'page'=>$page);
    }
    //获取订单详情
    public function getOrderInfo($arr){
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
            $stores = $this->db->fetch_all("select store_id,chejian_id from order_list where order_id in (".join(',',$order_ids).") group by store_id,chejian_id");

            $sql = '';
            foreach($stores as $k=>$v){
                if($v['store_id']){
                    $sql .="sum(case when c.store_id='$v[store_id]' then convert(decimal(9,2),order_nums) else 0 end) as '$v[store_id]',";  
                    $sql .="sum(case when c.store_id='$v[store_id]' then convert(decimal(9,2),real_send) else 0 end) as '$v[store_id]_send',";  
                    $stores[$k]['bianhao'] = $v['store_id'];
                    $stores[$k]['name'] = $this->getStorename($v['store_id']);
                }elseif($v['chejian_id']){
                    $sql .="sum(case when c.chejian_id='$v[chejian_id]' then order_nums else 0 end) as '$v[chejian_id]',";  
                    $sql .="sum(case when c.chejian_id='$v[chejian_id]' then real_send else 0 end) as '$v[chejian_id]_send',";  
                    $stores[$k]['bianhao'] = $v['chejian_id'];
                    $stores[$k]['name'] = $this->getChejianname($v['chejian_id']);
                }
            }
            $sql="select bianhao,sum(convert(decimal(9,2),real_send)) as real_send,sum(convert(decimal(9,2),order_nums)) as order_nums,guige,kucun_danwei,baozhuang_danwei,guige,name,$sql b.type_name from order_list_more a
left join goods_type_list b
on (a.bianhao = b.cinvcode and a.isstore = b.isstore)
left join order_list c 
on a.order_id=c.order_id
 where a.order_id in (".join(',',$order_ids).") group by bianhao,guige,kucun_danwei,baozhuang_danwei,name,b.type_name order by b.type_name asc,bianhao asc";

            $list = $this->db->fetch_all($sql);
        }else{//单个出库单
            $sql = "select a.*,b.type_name,c.id as type_index,convert(decimal(9,2),a.real_send) as real_send,convert(decimal(9,2),a.order_nums) as order_nums,convert(decimal(9,2),a.real_recv) as real_recv  from order_list_more a
left join goods_type_list b
on (a.bianhao = b.cinvcode and a.isstore = b.isstore)
left join goods_type c
on b.type_name = c.type_name and b.isstore = c.isstore
where a.order_id='$order_id'
order by b.type_name desc,a.bianhao asc";

            $list = $this->db->fetch_all($sql);
            for($i=0;$i<count($list);$i++){
                if(!$list[$i]['type_index']) $list[$i]['type_index']=999999;
                if($list[$i]['type_index']==999999) $list[$i]['type_name']='临时增加';
            }
            $info = $this->db->fetch_first("select *,CONVERT(varchar(10),adddate,20) as adddate,CONVERT(varchar(10),senddate,20) as senddate,CONVERT(varchar(10),order_date,20) as order_date,CONVERT(varchar(10),recvdate,20) as recvdate,CONVERT(varchar(10),passdate,20) as passdate from order_list where order_id='$order_id'");
            if($info['store_id']){
                $info['order_from'] = $this->getStorename($info['store_id']);
            }elseif($info['chejian_id']){
                $info['order_from'] = $this->getChejianname($info['store_id']);
            }
            $info['send_bumen'] = $this->getBagname($info['bagid']);
        }
        return array('list'=>$list,'info'=>$info,'stores'=>$stores);
    }
    public function getDBOrderlistTotal($arr){
        global $localdb;
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $store_id = parsepoststr($arr['store_id']);
        $date = date('Y-m',strtotime("$year-$month-01"));
        $sql = "select 
sum(b.cost * b.order_nums) as price,
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
    public function getDBOrderlist($arr){
        global $localdb;
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $store_id = parsepoststr($arr['store_id']);
        $date = date('Y-m',strtotime("$year-$month-01"));
        $sql = "select 
b.name,b.guige,b.kucun_danwei,
b.cost,
sum(b.cost * b.order_nums) as price,
sum(b.order_nums) as nums,
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
    public function getOrderlistByMonth($arr){
        global $localdb;
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $field = $store_id?'store_id':'chejian_id';
        $date = date('Y-m',strtotime("$year-$month-01"));
        if($store_id){
            $sql = "select 
b.name,b.guige,b.kucun_danwei,b.cost,
sum(case when a.order_type=1 or a.order_type=2 then b.real_send else 0 end)  as 'jinhuo', --总部和供应商进货数
sum(case when a.order_type=3 and a.storeid='$store_id' then b.order_nums else 0 end)  as 'diaoru', --调入
sum(case when a.order_type=3 and a.store_id='$store_id' then b.order_nums else 0 end)  as 'diaochu', --调出
sum(case when a.order_type=5 or a.order_type=6 then b.order_nums else 0 end) as 'baosun', --报损
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
        }else{
            $sql = "select 
b.name,b.guige,b.kucun_danwei,b.cost,
sum(case when a.order_type=1 or a.order_type=2 then b.real_send else 0 end)  as 'jinhuo', --总部和供应商进货数
sum(case when a.order_type=5 or a.order_type=6 then b.order_nums else 0 end) as 'baosun', --报损
b.bianhao
from order_list a,order_list_more b 
where  
a.chejian_id='$chejian_id'  --所有订单 包括调出订单
and CONVERT(varchar(7),a.order_date,20) ='$date' 
and a.order_id = b.order_id
--and a.status = 0
group by b.bianhao,b.name,b.guige,b.kucun_danwei,b.cost";
        }
        $res = $localdb->fetch_all($sql);
        return array('list'=>$res);
    }

    //修改物品分类排序
    public function changeGoodsOrder($arr){
        $id = parsepoststr($arr['id']);
        $showorder = int_val($arr['showorder']);
        $isstore = int_val($arr['isstore']);
        $this->db->query("update goods_type_list set showorder='$showorder' where cInvCode='$id' and isstore='$isstore'");
        return array('status'=>0);
    }
    
    //移除分类
    public function removeType($arr){
        global $localdb;
        $id = parsepoststr($arr['id']);
        $type = parsepoststr($arr['type']);
        $isstore = int_val($arr['isstore']);
        $sql = "delete from goods_type_list where cInvCode='$id' and isstore='$isstore'";
        $localdb->query($sql);
        return array();
    }
    //添加至分类
    public function addToType($arr){
        $id = parsepoststr($arr['id']);
        $type = parsepoststr($arr['type']);
        $isstore = int_val($arr['isstore']);
        $showorder = $this->db->result_first("select top 1 showorder from goods_type_list order by showorder desc");
        $showorder = $showorder?$showorder+1:1;
        $res = $this->db->fetch_first( "select a.* from goods_type_list a,goods_type b where a.cInvCode='$id' and a.type_name=b.type_name and a.isstore='$isstore' and a.isstore = b.isstore");
        if($res) return array('status'=>1);
        $this->db->query("insert into  goods_type_list (cInvCode,type_name,isstore,showorder) values ('$id','$type','$isstore','$showorder')");
        return array('status'=>0,'showorder'=>$showorder);
    }
    //新增分类
    public function addType($arr){
        $typename = parsepoststr($arr['name']);
        $isstore = int_val($arr['isstore']);
        $sql = "select * from goods_type where type_name='$typename' and isstore='$isstore'";
        $res = $this->db->fetch_first($sql);
        if($res){
            return array('status'=>1);
        }else{
            $sql = "insert into goods_type (type_name,isstore) values ('$typename','$isstore')";
            $res = $this->db->query($sql);
            return array('status'=>0);
        }
    }
    //删除分类
    public function delType($arr){
        $typename = parsepoststr($arr['name']);
        $isstore = int_val($arr['isstore']);
        $sql = "delete from goods_type where type_name='$typename' and isstore='$isstore'";
        $this->db->query($sql);
        $this->db->query("delete from goods_type_list where type_name='$typename' and isstore='$isstore'");
        return array('status'=>0);
    }
    //修改分类名称
    public function editType($arr){
        global $localdb;
        $typename = parsepoststr($arr['name']);
        $newtypename = parsepoststr($arr['newname']);
        $isstore = int_val($arr['isstore']);
        $sql = "select * from goods_type where type_name='$newtypename' and type_name<>'$typename' and isstore='$isstore'";
        $res = $this->db->fetch_first($sql);
        if($res){
            return array('status'=>1);
        }else{
            $sql = "update goods_type set type_name='$newtypename' where type_name='$typename' and isstore='$isstore'";
            $res = $this->db->query($sql);
            $sql = "update goods_type_list set type_name='$newtypename' where type_name='$typename' and isstore='$isstore'";
            $res = $this->db->query($sql);
            return array('status'=>0);
        }
    }
    
    
    //同步订单。订单ID、以那个数据库为主表（t6 or local）。
    private function syncOrder($order_id,$inOut){
        $info = $this->db->fetch_first("select *,CONVERT(varchar(19),adddate,20) as adddate from order_list where order_id='$order_id'");
        $new_order_id = $order_id;
        if($info['order_type']==2){//直供订单需要生成包括入库单、出库单各一次，所以不能直接用order_id对应。在order_id后加01和02区分
            $new_order_id .=$inOut=='in'?'01':'02';
        }
        $t6info = $this->t6db->fetch_first("select id,cwhcode,brdflag,* from rdrecord where ccode='$new_order_id'");
        if(!$t6info) return $this->createT6Order($order_id,$inOut);//没有生成出库单
        $list = $this->db->fetch_all("select real_send,order_nums,bianhao from order_list_more where order_id='$order_id'");
        $t6list = $this->t6db->fetch_all("select iquantity as real_send,cdefine26 as order_nums,cinvcode as bianhao from rdrecords where id='$t6info[ID]'");
        if(count($list)!=count($t6list)){//明细数量不一致，只能删除T6的单据再重新生成
            $this->delT6Order($new_order_id);
            $this->createT6Order($order_id,$inOut);
            return;
        }
        $bagid = $t6info['cwhcode'];
        $id = $t6info['id'];
        for($i=0;$i<count($list);$i++){
            $new = $list[$i];
            $old = $t6list[$i];
            if(array_diff($new,$old)){//不同
                $field = $t6info['brdflag']==1?'fInQuantity':'fOutQuantity';
                $this->t6db->query("update rdrecords set iquantity='$new[real_send]',cdefine26='$new[order_nums]' where id='$id' and cinvcode='$new[bianhao]'");
                $this->t6db->query("update currentstock set $field=$field-$old[real_send]+$new[real_send] where cwhcode='$bagid' and cinvcode='$new[bianhao]'");
            }
        }
    }
    //获取物品列表
    private function getGoodsList(){
        $date = date('Y-m-d',time());
        $sql = "SELECT     t.cInvCode, t.cInvName, t.cInvCCode,isnull(t.cInvStd,'') as cInvStd, ISNULL(s.cComUnitName ,'') AS cInvUnit, ISNULL(t.cInvDefine2, s.cComUnitName) AS iBzUnit, ISNULL(t.cInvDefine3, 1)  AS iBzHsl, ISNULL(t.cInvDefine4, s.cComUnitName) AS iDeUnit, ISNULL(t.cInvDefine5, 1) AS iDeHsl, t.cInvDefine1 AS cInvType, ISNULL(t.iInvNCost, 0)  AS iUnitCost, ISNULL(t.iInvRCost, 0) AS iInvRCost
FROM         Inventory AS t LEFT OUTER JOIN ComputationUnit AS s ON t.cComUnitCode = s.cComunitCode where dedate>'$date' or dedate is null";
        return $this->t6db->fetch_all($sql);//物品列表，缓存一天
    }
    //获取分类列表
    private function getTypeList($isstore){
        return $this->db->fetch_all("select * from goods_type where isstore='$isstore'");
    }
    //获取物品列表，按分类分组
    private function getGoodsByType($isstore){
        $sql = "select * from goods_type_list where isstore='$isstore' order by showorder asc";
        $arr = $this->db->fetch_all($sql);
        $tmparr = array();
        foreach($arr as $k=>$v){
            $tmparr[$v['cInvCode']]=$v;
        }
        return $tmparr;
    }
    //获取供应商列表
    private function getVendorList(){
        return $this->t6db->fetch_all("SELECT  cVenCode as vendorid, cVenName as vendorfullname,cVenAbbName as vendorname, cVenDepart FROM  Vendor WHERE (cVenDepart LIKE '99%')");
    }
    //获取仓库列表
    private function getBagList(){
        return $this->t6db->fetch_all("select cWhCode as bagid,cWhName as bagname from Warehouse where bFreeze=0");    
    }
    //获取仓库名称
    private function getBagName($bagid){
        return $this->db->result_first("select bag_name from bag_list where bag_id='$bagid'");
    }
    //获取车间名称
    private function getChejianName($chejian_id){
        return $this->db->result_first("select chejian_name from chejian_list where chejian_id='$chejian_id'");
    }
    //获取门店名称
    private function getStoreName($store_id){
        return $this->db->result_first("select store_name from store_list where store_id='$store_id'");
    }
    //设置订单状态
    private function setOrderStatus($order_id,$status){
        switch($status){
            case 0:
                $sql = "update order_list set status=0,passdate='".date('Y-m-d',time())."',pass_user_id='$_SESSION[user_id]',pass_user_name='$_SESSION[user_name]' where order_id='$order_id'";break;
            case 2:
                $sql = "update order_list set status=2,senddate='".date('Y-m-d',time())."',send_user_id='$_SESSION[user_id]',send_user_name='$_SESSION[user_name]' where order_id='$order_id'";break;
            case 3:
                $sql = "update order_list set status=3,recvdate='".date('Y-m-d',time())."',recv_user_id='$_SESSION[user_id]',recv_user_name='$_SESSION[user_name]' where order_id='$order_id'";break;
        }
        $this->db->query($sql);
    }
    //插入订单本地明细表
    private function addOrderMore($order_id,$order_type,$status,$isstore,$fatherid,$info){
        $goods = $this->getGoodsInfo($info['cInvCode']);
        $type_name = parsepoststr($info['type_name']);
        $type_index = parsepoststr($info['type_index']);
        $baosun_yuanyin = parsepoststr($info['baosun_yuanyin']);
        if($order_type==3) $real_send = $info['nums'];//调入调出，默认已经发货
        if($order_type==2){//直供订单，默认已经发货和收货，直接跳到审核环节
            $real_send = $info['nums'];
            $real_recv = $info['nums'];
        }
        $this->db->query("insert into order_list_more (order_id,bianhao,name,guige,baozhuang_danwei,baozhuang_hsl,order_nums,kucun_danwei,kucun_hsl,cost,cost_ext,type_name,type_index,classname,real_send,baosun_yuanyin,isstore,fatherid,real_recv) values
            ('$order_id',
            '$goods[cInvCode]',
            '$goods[cInvName]',
            '$goods[cInvStd]',
            '$goods[iBzUnit]',
            '$goods[iBzHsl]',
            convert(money,'$info[nums]'),
            '$goods[cInvUnit]',
            '$goods[iDeHsl]',
            convert(money,'$goods[iUnitCost]'),
            convert(money,'$goods[iInvRCost]'),
            '$type_name',
            '$type_index',
            '$goods[cInvType]',
            '$real_send',
            '$baosun_yuanyin',
            '$isstore',
            '$fatherid',
            '$real_recv'
            )");
    }
    //获取某物品信息
    private function getGoodsInfo($id){
        return $this->t6db->fetch_first("SELECT t.cInvCode, t.cInvName, t.cInvStd, s.cComUnitName AS cInvUnit, ISNULL(t.cInvDefine2, s.cComUnitName) AS iBzUnit, ISNULL(t.cInvDefine3, 1) AS iBzHsl, ISNULL(t.cInvDefine4, s.cComUnitName) AS iDeUnit, ISNULL(t.cInvDefine5, 1) AS iDeHsl, t.cInvDefine1 AS cInvType, ISNULL(t.iInvNCost, 0) AS iUnitCost, ISNULL(t.iInvRCost, 0) AS iInvRCost FROM Inventory AS t LEFT OUTER JOIN ComputationUnit AS s ON t.cComUnitCode = s.cComunitCode where t.cInvCode='$id'");
    }
    //车间是否存在盘点
    private function hasChejianPD($chejian_id,$date){
        return $this->db->result_first("select order_id from order_list where chejian_id='$chejian_id' and order_type=4 and order_date='$date'");
    }
    //门店是否存在盘点订单
    private function hasPD($store_id,$date){
        return $this->db->result_first("select order_id from order_list where store_id='$store_id' and order_type=4 and order_date='$date'");
    }
    //批量修改某个订单明细的某个字段，$list数组格式：bianhao=>value，要修改的字段，订单状态
    private function changeOrderList($order_id,$list,$field,$status){
        foreach($list as $k=>$v){
            if($status==3) {
                $this->db->query( "update order_list_more set $field='$v[nums]',status='$status',chayi_yuanyin='$v[chayi_yuanyin]' where order_id='$order_id' and bianhao='$k'");
            }else{
                $this->db->query("update order_list_more set $field='$v',status='$status' where order_id='$order_id' and bianhao='$k'");
            }
        }
    }
    //获取某个订单
    private function getOrderInfoByID($order_id){
        return $this->db->fetch_first("select * from order_list where order_id='$order_id'");
    }
    //获取某个订单明细
    private function getOrderListInfo($order_id){
        return $this->db->fetch_first("select * from order_list_more where order_id='$order_id'");
    }
    //生成T6数据库中的出入库单
    private function createT6Order($order_id,$inOut){
        $info = $this->db->fetch_first("select *,CONVERT(varchar(19),adddate,20) as adddate from order_list where order_id='$order_id'");
        if(!$info) return;
        $bagid = $info['bagid'];
        $store_id = $info['store_id'];
        $chejian_id = $info['chejian_id'];
        if($chejian_id){
            $depCode = '0104';//加工配送部
        }else{
            $depCode = $this->getT6DepCode($store_id);
        }
        $rows = $this->getOrderMoreRows($order_id);
        $new_order_id = $order_id;
        if($info['order_type']==2){//直供订单需要生成包括入库单、出库单各一次，所以不能直接用order_id对应。在order_id后加01和02区分
            $new_order_id .=$inOut=='in'?'01':'02';
        }
        $tmp = $this->createT6OrderIDandChildID($rows);
        $fatherid = $tmp['fatherid'];
        $childid = $tmp['childid'];
        $this->insertMain($new_order_id,$bagid,$depCode,$fatherid,$info,$inOut);//插入T6订单主表
        $list = $this->db->fetch_all("select * from order_list_more where order_id='$order_id'");
        for($i=0;$i<count($list);$i++){
            $autoid = $i-$rows + $childid;
            $this->insertMore($autoid,$fatherid,$inOut,$list[$i]);//插入T6明细表
            $this->updateBag($bagid,$list[$i]['bianhao'],$inOut,$list[$i]['real_send']);//更新T6的库存
        }
    }
    
    /**
     * 插入到T6订单主表
     *
     * @param mixed $order_id 订单ID
     * @param mixed $bagid 仓库ID
     * @param mixed $depCode 部门编号
     * @param mixed $id 索引ID
     * @param mixed $info 订单详情数组
     * @param mixed $inOut 出库/入库
     *
     */    
    private function insertMain($order_id,$bagid,$depCode,$id,$info,$inOut){
        //入库单对照表
        $bIn = $inOut=='in'?true:false;
        $map = array(
            'biafirst'=>0,//存货期初标志
            'bisstqc'=>0,//库存期初标志
            'vt_id'=>$bIn?27:65,//单据模板号，入库27，出库65
            'bpufirst'=>0,//采购期初标志
            'brdflag'=>$bIn?1:0,//收发标志，入库1，出库0   0
            'cbustype'=>$bIn?'普通采购':'领料',//业务类型，入库 普通采购，出库：领料。加工中心：生产领料  领料
            'ccode'=>$order_id,//收发单据号
            'cdefine16'=>0,
            'cdefine7'=>0,
            'cdepcode'=>$depCode,//部门编码
            'cmaker'=>$info['send_user_name'],//制单人
            'crdcode'=>$bIn?'0101':'0201',//收发类别编码，对应T6数据库rd_style表。加工中心定货为生产出库，金广定货为XX，忘了。入库：0101，出库：0201  0210
            'cvencode'=>$info['vendorid'],//供货商ID，只有入库有这个字段
            'csource'=>'库存',//单据来源 
            'cvouchtype'=>$bIn?'01':'11',//单据类型编码，对应T6数据库vouchtype表。入库01，出库11。金广为：32，即销售出库单  11
            'cwhcode'=>$bagid,//仓库ID
            'ddate'=>$info['order_date'],//单据日期
            'id'=>$id,//主表标识
            'imquantity'=>0,//产量
            'iproorderid'=>0, //生产订单主表标识
            'cdefine3'=>$info['user_name'],//订货人，只有出库有这个字段
            );
        //单独处理部分特殊订单
        if($info['store_id']=='9999'){//金广店，为销售出库单
            $map['cvouchtype'] = '32';
        }
        if($info['store_id']=='9998'){//幼儿园，为销售出库单
            $map['cvouchtype'] = '32';
        }
        if($depCode=='0104'){//加工中心订单
            $map['cbustype']='生产领料';
            $map['crdcode'] ='0210';
        }
        // print_r($map);
        // die();
        if($inOut=='in'){//入库
            unset($map['cdefine3']);
        }else{//出库
            unset($map['cvencode']);
        }
        $sql = $this->getInsertSqlbyArray($map,'rdrecord');
        $this->t6db->query($sql);
    }
    //插入T6明细表
    private function insertMore($autoid,$id,$inOut,$info){
        //明细表对照表
        $list_map = array(
            'autoid'=>$autoid,
            'id'=>$id,
            'ifnum'=>0,
            'ifquantity'=>0,
            'innum'=>0,
            'inquantity'=>0,
            'inum'=>0,
            'iquantity'=>$info['real_send'],
            'iprice'=>$info['real_send']*$info['cost'],
            'isoutnum'=>0,
            'cbvencode'=>'',
            'cdefine26'=>$info['order_nums'],
            'cdefine27'=>0,
            'cinvcode'=>$info['bianhao'],
            'cposition'=>''
            );
        if($inOut=='out'){
            unset($list_map['iprice']);
            unset($list_map['iprice']);
        }
        $sql = $this->getInsertSqlbyArray($list_map,'rdrecords');
        $this->t6db->query($sql);
    }
    //更新仓库库存，传入仓库ID、编号、出库/入库、数量（可为负数）
    private function updateBag($bagid,$bianhao,$inOut,$nums){
        $bhas = $this->t6db->fetch_first("select cinvcode from currentstock where cwhcode='$bagid' and cinvcode='$bianhao'");
        if(!$bhas) $this->t6db->query("Insert Into CurrentStock(cWhcode,cInvCode,cFree1,cFree2,cFree3,cFree4,cFree5,cFree6,cFree7,cFree8,cFree9,cFree10,cBatch,dMDate,iMassDate,dVDate) values ('$bagid','$bianhao','','','','','','','','','','','',Null,'',Null)");
        $field = $inOut=='in'?'fInQuantity':'fOutQuantity';
        $this->t6db->query("update currentstock set $field =$field+$nums where cwhcode='$bagid' and cinvcode='$bianhao'");
    }
    //获取订单明细的行数
    private function getOrderMoreRows($order_id){
        return $this->db->result_first("select max(id)-min(id)+1 from order_list_more where order_id='$order_id'");
    }
    //获取T6中对照的门店编号
    private function getT6DepCode($store_id){
        $cdepcode = $this->t6db->result_first("select cDepcode from Department where cDepMemo='$store_id'");
        return $cdepcode;
    }
    //获取生成的childsid fatherid 返回数组
    private function createT6OrderIDandChildID($rows){
        global $t6db_SP;
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
        $sql = "{call sp_GetId(?,?,?,?,?,?)}";
        $query = sqlsrv_query($t6db_SP->link, $sql, $params);
        if( $query === false )
        {
            echo "Error in executing statement 3.\n";
            die( print_r( sqlsrv_errors(), true));
        }
        sqlsrv_next_result($query);
        return array('fatherid'=>$ifatherid,'childid'=>$ichildid);
    }
    //开启事务回滚
    private function transaction(){
        $this->t6db->transaction();
        $this->db->transaction();    
    }
    //事务是否完成
    private function iscommit(){
        if($this->t6db->error()||$this->db->error()){
            $this->t6db->rollback();
            $this->db->rollback();
            return false;
        }else{
            $this->db->commit();
            $this->t6db->commit();
            return true;
        }
    }
    //删除本地订单
    private function delLocalOrder($order_id){
        $this->db->query("delete from order_list where order_id='$order_id'");
        $this->db->query("delete from order_list_more where order_id='$order_id'");
    }
    //删除T6数据库中订单
    private function delT6Order($order_id){
        $info = $this->t6db->fetch_first("select id,cwhcode,brdflag from rdrecord where ccode='$order_id'");
        if(!$info) return;
        $id = $info['id'];
        $bagid = $info['cwhcode'];
        $list = $this->t6db->fetch_all("select * from rdrecords where id='$id'");//明细数组
        $field = $info['brdflag']==1?'fInQuantity':'fOutQuantity';//brdflag为收发标志，1为入库，0为出库
        for($i=0;$i<count($list);$i++){//修改仓库库存量
            $num = $list[$i]['iQuantity'];
            $bianhao=$list[$i]['cInvCode'];
            $this->t6db->query("update currentstock set $field=$field-$num where cwhcode='$bagid' and cinvcode='$bianhao'");
        }
        $this->t6db->query("delete from rdrecords where id='$id'");
        $this->t6db->query("delete from rdrecord where id='$id'");
    }
    //生成一个全新的orderid
    private function createOrderID($order_type,$depcode,$order_date){
        $head_map = array('ZBXQ','ZGXQ','DB','PD','SCBS','DPBS','BF','TK');//总部需求、直供需求、调拨、盘点、材料报损、成品报损、补发、退库
        $head = $head_map[$order_type-1];
        if(!$head) $head = 'QT';//其他
        return $head.date('Ymd',strtotime($order_date)).$depcode.$this->getOrderLastNum($order_date);
    }
    //根据订单类别生成订单初始状态
    private function getOrderStatusDefault($order_type){
        $status_map = array(1,4,2,0,0,0,0,0);//总部需求、直供需求、调拨、盘点、材料报损、成品报损、补发、退库
        return $status_map[$order_type-1];
    }
    //获取新订单后2位
    private function getOrderLastNum($order_date){
        $res = $this->db->result_first("SELECT top 1 RIGHT(order_id,2) as code from order_list where  CONVERT(varchar(10),order_date,20)='$order_date' order by id desc");
        $res = $res?($res + 1):1;
        return strlen($res)==1?'0'.$res:$res;
    }
    //获得插入的SQL
    private function getInsertSqlbyArray($arr,$table){
        $sql = "insert into $table ";
        $sql1 = '';
        $sql2 = '';
        foreach($arr as $k=>$v){
            $sql1 .=$sql1?",$k":$k;
            $sql2 .=$sql2?",'$v'":"'$v'";
        }
        $sql = $sql . '('.$sql1 .') values ('.$sql2.')';
        return $sql;
    }
}
?>