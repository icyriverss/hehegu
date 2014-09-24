<?php
require_once 'inc/config.php';
$rows = int_val($_GET['rows']);
if($rows){
    echo json_encode(getspid($rows));    
}
function getspid($rows){
    global $t6db;
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
    $query = sqlsrv_query($t6db->link, $sql, $params);
    if( $query === false )
    {
        echo "Error in executing statement 3.\n";
        die( print_r( sqlsrv_errors(), true));
    }
    sqlsrv_next_result($query);
    return array('fatherid'=>$ifatherid,'childid'=>$ichildid);    
}
?>