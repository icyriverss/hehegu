<?php
/**
 * 出入库数据核对
 *
 */
class cls_t6{
    function valiOrder($order_id){
        global $localdb;
        global $t6db;
        $order = $localdb->fetch_first("select * from order_list where order_id='$order_id'");
        $t6order = $t6db->fetch_all("select biafirst,bisstqc,vt_id,bpufirst,brdflag,cbustype,ccode,cdefine16,cdefine7,cdepcode,cmaker,crdcode,cvencode,csource,cvouchtype,cwhcode,ddate,id,imquantity,iproorderid from rdrecord where ccode ='$order_id'");
        if(count($t6order)>1) return false;
        return true;
    }
    function valiT6order($info){
        global $t6db;
        $t6order = $t6db->fetch_all("select biafirst,bisstqc,vt_id,bpufirst,brdflag,cbustype,ccode,cdefine16,cdefine7,cdepcode,cmaker,crdcode,cvencode,csource,cvouchtype,cwhcode,ddate,id,imquantity,iproorderid from rdrecord where ccode ='$info[order_id]'");
        if($t6order){
            $id = $t6order[0]['id'];
            $more_nums = $t6db->result_first("select count(*) from rdrecords where id='$id'");
        }
        return array('nums'=>count($t6order),'more'=>$more_nums);
    }
    function getOrderMoreNums($order_id){
        global $localdb;
        return $localdb->result_first("select count(*) from order_list_more where order_id='$order_id'");
    }
    function test(){
        global $localdb;
        global $t6db;
        $aaa = 'ZBXQ20130831020715';
        $this->a($aaa);
        $this->b($aaa);
        die();
        
        
        //先取直供订单
        $order_list = $localdb->fetch_all("select * from order_list where status!=1 and order_type=1");
        $str = count($order_list).'个订单，没有插入t6的有：<br>';
        $error_nums = 0;
        for($i=0;$i<count($order_list);$i++){
            $order_id = $order_list[$i]['order_id'];
            $more_nums = $this->getOrderMoreNums($order_id);
            $arr = $this->valiT6order($order_list[$i]);
            $t6nums = $arr['nums'];
            $t6morenums = $arr['more'];
            //if($t6nums==0){
            //    $str .=$order_id.'|'.$this->valiT6order($order_list[$i]).'<br>';
            //}
            if($more_nums !=$t6morenums){
                $error_nums++;
                $str .=$order_id.'|'.$t6nums.'|'.$more_nums.'|'.$t6morenums.'<br>';
            }
        }
        return $error_nums.'<br>'.$str;
    }
    function setOrderOut($order_id){
        //订单出库
        $field_map = array(
            'biafirst'=>0,//存货期初标志
            'bisstqc'=>0,//库存期初标志
            'vt_id'=>65,//单据模板号
            'bpufirst'=>0,//采购期初标志
            'brdflag'=>0,//收发标志
            'cbustype'=>'领料',//业务类型
            'ccode'=>'order_id',//收发单据号
            'cdefine16'=>0,
            'cdefine7'=>0,
            'cdepcode'=>'store_id',//部门编码
            'cmaker'=>'send_user_name',//制单人
            'cdefine3'=>'user_name',//订货人
            'crdcode'=>'0201',//收发类别编码，对应T6数据库rd_style表。加工中心定货为生产出库，金广定货为XX，忘了
            'csource'=>'库存',//单据来源
            'cvouchtype'=>11,//单据类型编码，对应T6数据库vouchtype表
            'cwhcode'=>'bagid',//仓库编码
            'ddate'=>'order_date',//单据日期
            'id'=>'fatherid',//主表标识
            'imquantity'=>0,//产量
            'iproordrid'=>0//生产订单主表标识
        );
    }
    function testTransaction(){
        global $localdb;
        $localdb->transaction()
            ->query("insert into test (name) values ('ddd')");
        $localdb->commit();
        die();
    }
    function a($order_id){
        global $localdb;
        $res = $localdb->fetch_all("select bianhao from order_list_more where order_id='$order_id' order by id asc");    
        print_r($res);
    }
    function b($order_id){
        global $t6db;
        $res = $t6db->fetch_all("select a.cinvcode as bianhao from rdrecords a,rdrecord b where a.id=b.id and b.ccode='$order_id' order by a.autoid asc");    
        print_r($res);
    }
    /**
     * 删除订单
     *
     * @param mixed $order_id This is a description
     * @return mixed This is the return value description
     *
     */    
    public function delOrder($order_id){
        global $localdb;
        global $t6db;
        $info = $localdb->fetch_first("select * from order_list where order_id='$order_id'");
        if(!$info) return false;
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
            return false;    
        }else{
            $localdb->commit();
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
}
?>