<?php
//123123123
class cls_level{
    function addLevel($arr){
        $name = parsepoststr($arr['name']);
        if(!$arr['power']||!$name) return array('status'=>2);
        $power = json_encode($arr['power']);
        global $localdb;
        $res = $localdb->fetch_first("select * from user_level where level_name='$name'");
        if($res) return array('status'=>1);
        $localdb->query("insert into user_level (level_name,power) values ('$name','$power')");
        return array('status'=>0);
    }
    function delLevel($arr){
        $name = parsepoststr($arr['name']);
        global $localdb;
        $res = $localdb->fetch_first("select * from user_list where level_name='$name'");
        if($res) return array('status'=>1);
        $localdb->query("delete user_level where level_name='$name'");
        return array('status'=>0);
    }
    function editLevel($arr){
        $name = parsepoststr($arr['name']);
        $newname = parsepoststr($arr['newname']);
        if(!$arr['power']||!$name||!$newname) return array('status'=>2);
        $power = json_encode($arr['power']);
        global $localdb;
        $res = $localdb->fetch_first("select * from user_level where level_name='$newname' and level_name <> '$name'");
        if($res) return array('status'=>1);
        $localdb->query("update user_level set level_name='$newname',power='$power' where level_name='$name'");
        $localdb->query("update user_list set level_name='$newname' where level_name='$name'");//用户列表的分组也必须更新
        return array('status'=>0);
    }
    function getLevelList($arr){
        global $localdb;
        $perpage = intval($arr['perpage'])?intval($arr['perpage']):10;//默认分页10
        $page = intval($arr['page'])?intval($arr['page']):1;//页码
        $sql = "select * from user_level order by id desc";
        $res = $localdb->query_page_all($sql,$perpage,$page);
        $total = $localdb->total;
        //for($i=0;$i<count($res);$i++){
        //    $res[$i]['power'] = json_decode($res[$i]['power'],true);
        //}
        return array('list'=>$res,'total'=>$total,'perpage'=>$perpage,'page'=>$page);
    }
    function getLevelInfo($arr){
        global $localdb;
        $level_name = parsepoststr($arr['level_name']);
        $res=$localdb->fetch_first("select * from user_level where level_name='$level_name'");
        $res['power'] = json_decode($res['power'],true);
        return $res;
    }
}
?>