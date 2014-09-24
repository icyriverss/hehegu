<?php

require_once 'inc/db_class.php';
require_once 'inc/mssql.php';
require_once 'inc/func.php';
define('Y_DBHOST', 'localhost');//mysql 地址
define('Y_DBUSER', 'root');//mysql账户名
define('Y_DBPW', 'sa');//mysql连接密码
define('Y_DBNAME', 'hehegu_report');
define('Y_DBCHARSET', 'utf8');
define('SHOW_SQL_ERROR', 1);//是否显示SQL错误

//思讯系统数据库配置
$db_sixun=array(//思讯系统数据库配置,实际部署时用此配置
    'server'=>'10.128.1.100',//服务器地址
    'user'=>'sa',//用户名
    'pass'=>'HHGsx_10!',//密码
    'dbname'=>'issfoodv5',//数据库名称
    'CharacterSet'=>'UTF-8'//编码,不用修改
);
//T6数据库配置
$db_t6=array(//思讯系统数据库配置,实际部署时用此配置
    'server'=>'10.128.1.10',//服务器地址
    'user'=>'hhg_report',//用户名
    'pass'=>'hhg_report!@#',//密码
    'dbname'=>'UFDATA_001_2014',//数据库名称
    'CharacterSet'=>'UTF-8'//编码,不用修改
);
//本地数据库配置
$db_local=array(//思讯系统数据库配置,实际部署时用此配置
    'server'=>'10.128.1.11',//服务器地址
    'user'=>'sa',//用户名
    'pass'=>'sa',//密码
    'dbname'=>'hehegu_report',//数据库名称
    'CharacterSet'=>'UTF-8'//编码,不用修改
);




//本地测试数据库配置，发布时请修改上面的配置。
$db_sixun_test=array(
    'server'=>'192.168.1.200',//服务器地址
    'user'=>'sa',//用户名
    'pass'=>'sa',//密码
    'dbname'=>'hehegu_sixun',//数据库名称
    'CharacterSet'=>'UTF-8'//编码,不用修改
);
$db_t6_test = array(
    'server'=>'192.168.1.200',//服务器地址
    'user'=>'sa',//用户名
    'pass'=>'sa',//密码
    'dbname'=>'UFDATA_001_2013',//数据库名称
    'CharacterSet'=>'UTF-8'//编码,不用修改
);
$db_local_test = array(
    'server'=>'192.168.1.200',//服务器地址
    'user'=>'sa',//用户名
    'pass'=>'sa',//密码
    'dbname'=>'hehegu_report',//数据库名称
    'CharacterSet'=>'UTF-8'//编码,不用修改
);

define('Y_COOKIEPATH', '/');
define('Y_COOKIEDOMAIN', '');
define('Y_CHARSET', 'utf8');
define('Y_Ahthor',"YinG");
define('Y_AuthorEmail',"33098184@qq.com");
define('UPLOAD_EXT','jpg,gif,png,doc,docx');
define('UPLOAD_SAVE_PATH','upload/');//后面加/
define('UPLOAD_MAX_SIZE',202400);//单位kb
define('SITENAME','和合谷报表系统');
$dbcharset = 'utf8';
$db = new db_class;
$db->connect(Y_DBHOST, Y_DBUSER, Y_DBPW, Y_DBNAME, '', true, $dbcharset);
//思讯数据库连接
$msdb = new mssql_class;

if($_SERVER['HTTP_HOST']=='hhg.a.com' || $_SERVER['HTTP_HOST']=='hhg.x.com' || $_SERVER['HTTP_HOST']=='hhg.icyriver.info' || $_SERVER['HTTP_HOST']=='hhg.a.com'){
    $db_sixun = $db_sixun_test;//使用测试数据库
    $db_t6 = $db_t6_test;//使用测试数据库
    $db_local = $db_local_test;//使用测试数据库
}

$msdb->connect($db_sixun['server'],$db_sixun['user'],$db_sixun['pass'],$db_sixun['dbname'],$db_sixun['CharacterSet']);
//t6数据库连接
$t6db = new mssql_class;

$t6db->connect($db_t6['server'],$db_t6['user'],$db_t6['pass'],$db_t6['dbname'],$db_t6['CharacterSet']);

//GET SP ID

$t6db_SP = new mssql_class;

$t6db_SP->connect($db_t6['server'],$db_t6['user'],$db_t6['pass'],$db_t6['dbname'],$db_t6['CharacterSet']);

//本地数据库连接
$localdb = new mssql_class;

$localdb->connect($db_local['server'],$db_local['user'],$db_local['pass'],$db_local['dbname'],$db_local['CharacterSet']);
$db = $localdb;
date_default_timezone_set('PRC');
?>