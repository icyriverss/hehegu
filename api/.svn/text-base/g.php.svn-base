<?php
error_reporting(0);
session_start();
set_time_limit(0);
require_once 'inc/config.php';
require_once 'inc/store.php';
require_once 'inc/sell.php';
require_once 'inc/update_sell.php';

require_once 'inc/cls_personnel.php';

$personnel = new cls_personnel;

$res = $personnel->getPersonelWage($_GET);

//echo json_encode($res);die();
print_r($res);die();
echo json_encode(array('request'=>$res));
exit();
?>