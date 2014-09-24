<?php
class cls_yusuan{
    protected $db;
    protected $t6db;
    public function __construct(){
        global $localdb;
        global $t6db;
        $this->db = $localdb;
        $this->t6db = $t6db;
    }
    function editItem($arr){
        $code = $arr['code'];
        $newcode = $arr['newcode'];
        $name = $arr['name'];
        $kemu = $arr['kemu'];
        $isitem = int_val($arr['isitem']);
        if(!$code || !$name || !$newcode ) return array('status'=>1);
        $bhas = $this->db->fetch_first("select * from yusuan_items where code='$code' and isitem='$isitem'");
        if(!$bhas) return array('status'=>2);
        $bhas = $this->db->fetch_first("select * from yusuan_items where code='$newcode' and isitem='$isitem'");
        if($newcode !=$code && $bhas) return array('status'=>3);
        $this->db->query("update yusuan_items set code='$newcode',name='$name',kemu='$kemu' where code='$code' and isitem='$isitem'");
        $this->db->query("update yusuan_items set parentcode='$newcode' where parentcode='$code' and isitem='$isitem'");
        return array('status'=>0);
    }
    function getItemList($arr){
        $res = $this->db->fetch_all("select * from yusuan_items order by code asc");
        return array('list'=>$res);
    }
    //删除
    function delItem($arr){
        $code = parsepoststr($arr['code']);
        $this->db->query("delete from yusuan_items where code='$code' or parentcode='$code'");
        return array('status'=>0);
    }
    //新增
    function addItem($arr){
        $code = parsepoststr($arr['code']);
        $name = parsepoststr($arr['name']);
        $parentcode = parsepoststr($arr['parentcode']);
        $kemu = parsepoststr($arr['kemu']);
        $isitem = int_val($arr['isitem']);
        if(!$code || !$name ) return array('status'=>1);
        $res = $this->db->result_first("select * from yusuan_items where code='$code' and isitem='$isitem'");
        if($res) return array('status'=>2);
        if($parentcode ){
            $res = $this->db->result_first("select * from yusuan_items where code='$parentcode' and isitem='$isitem'");
            if(!$res) return array('status'=>3);
        }
        $this->db->query("insert into yusuan_items (code,name,parentcode,isitem,kemu) values ('$code','$name','$parentcode','$isitem','$kemu')");
        return array('status'=>0);
    }
    //获取预算列表
    function getPlanList($arr){
        //所有部门
        $departname = parsepoststr($arr['department']);
        $prop = '业务部门';
        $tmp = $this->t6db->fetch_all("select cdepname as deptname from departname where cdepprop='$prop'");
        $departments = array();
        for($i=0;$i<count($tmp);$i++){
            array_push($departments,$tmp[$i]['deptname']);
        }
        if(!$departname) $departname = $departments[0];
        $data = $this->t6db->fetch_all("select * from cw_deptplan where deptname='$departname'");
        $res = $this->db->fetch_all("select * from yusuan_items order by code asc");
        return array('departments'=>$departments,'department'=>$departname,'data'=>$data,'list'=>$res);
    }
    //获取预算执行情况
    function getPlanDo($arr){
        $departname = parsepoststr($arr['department']);
        $month = int_val($arr['month']);
        $prop = '业务部门';
        $tmp = $this->t6db->fetch_all("select cdepname as deptname from departname where cdepprop='$prop'");
        $departments = array();
        for($i=0;$i<count($tmp);$i++){
            array_push($departments,$tmp[$i]['deptname']);
        }
        if(!$departname) $departname = $departments[0];
        $sql = 'M' . $month;
        $data = $this->t6db->fetch_all("select $sql as month,YearAlarm,AccountName,DeptName,AccountCode,DeptID from cw_deptplan where deptname='$departname'");
        $res = $this->db->fetch_all("select * from yusuan_items order by code asc");
        return array('departments'=>$departments,'department'=>$departname,'data'=>$data,'list'=>$res);
    }
    //编辑计划
    function editPlan($arr){
        $department = parsepoststr($arr['department']);
        $accountname = parsepoststr($arr['accountname']);
        $list = $arr['list'];
        if(!$department || !$accountname || !$list) return array('status'=>1);
        $sql = '';
        foreach($list as $k=>$v){
            if($sql){
                $sql .=",$k='$v'";
            }else{
                $sql .="$k='$v'";
            }
        }
        $bhas = $this->t6db->fetch_first("select * from cw_deptplan where deptname='$department' and accountname='$accountname'");
        if(!$bhas){
            $accountcode = $this->db->result_first("select kemu from yusuan_items where name='$accountname'");
            if(!$accountcode) return array('status'=>2);
            $deptid = $this->t6db->result_first("select * from department where cdepname = '$department'");
            $this->t6db->query("insert into cw_deptplan (bsel,deptid,accountcode,deptname,accountname) values (0,'$deptid','$accountcode','$department','$accountname')");
        }
        $sql = "update cw_deptplan set $sql where deptname='$department' and accountname='$accountname'";
        $this->t6db->query($sql);
        return array('status'=>0);
    }
}
?>