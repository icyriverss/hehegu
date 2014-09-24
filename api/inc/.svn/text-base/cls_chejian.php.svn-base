<?php
class cls_chejian{
    function add($arr){
        $chejian_name = parsepoststr($arr['chejian_name']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        if(!$chejian_name || !$chejian_id) return array('status'=>1);
        global $localdb;
        $res = $localdb->fetch_first("select * from chejian_list where chejian_name='$chejian_name' or chejian_id='$chejian_id'");
        if($res) return array('status'=>2);
        $localdb->query("insert into chejian_list (chejian_id,chejian_name) values ('$chejian_id','$chejian_name')");
        return array('status'=>0);
    }
    function edit($arr){
        $chejian_name = parsepoststr($arr['chejian_name']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $id = intval($arr['id']);
        if(!$chejian_name || !$chejian_id) return array('status'=>1);
        global $localdb;
        $res = $localdb->fetch_first("select * from chejian_list where (chejian_name='$chejian_name' or chejian_id='$chejian_id') and id <> '$id'");
        if($res) return array('status'=>2);
        $localdb->query("update chejian_list set chejian_id='$chejian_id',chejian_name='$chejian_name' where id='$id'");
        return array('status'=>0);
    }
    function del($arr){
        $id = intval($arr['id']);
        global $localdb;
        $localdb->query("delete from chejian_list where id='$id'");
        return array('status'=>0);
    }
    function getList($arr){
        global $localdb;
        $perpage = intval($arr['perpage'])?intval($arr['perpage']):10;//Ä¬ÈÏ·ÖÒ³10
        $page = intval($arr['page'])?intval($arr['page']):1;//Ò³Âë
        $sql = "select * from chejian_list order by id desc";
        $res = $localdb->query_page_all($sql,$perpage,$page);
        return array('list'=>$res,'total'=>$localdb->total,'perpage'=>$perpage,'page'=>$page);
    }
    
    function getInfo($arr){
        global $localdb;
        $id = intval($arr['id']);
        return $localdb->fetch_first("select * from chejian_list where id='$id'");
    }
}
?>