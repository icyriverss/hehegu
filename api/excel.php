<?
include 'inc/config.php';
$str=$_POST['array'];
if($str){
	$str = urldecode($str);
    if(ini_get("magic_quotes_gpc")=="1")
    {
        $str=stripslashes($str);
    }
	$array=json_decode($str,true);
	saveasexcel($array['table'],$array['title'].".xls",$array['title']);
}
?>