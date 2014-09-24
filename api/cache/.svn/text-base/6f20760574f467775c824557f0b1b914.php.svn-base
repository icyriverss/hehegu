<?php 
            $array=array (
  0 => 
  array (
    'vch_dishname' => '菠菜蛋花汤',
    'ch_dishno' => '42010  ',
    'vch_seriesname' => '饮品',
    'ch_seriesno' => '04',
  ),
  1 => 
  array (
    'vch_dishname' => '豆沙包',
    'ch_dishno' => '51009  ',
    'vch_seriesname' => '早餐',
    'ch_seriesno' => '05',
  ),
  2 => 
  array (
    'vch_dishname' => '油条',
    'ch_dishno' => '51008  ',
    'vch_seriesname' => '早餐',
    'ch_seriesno' => '05',
  ),
  3 => 
  array (
    'vch_dishname' => '糯米团购咖喱饭',
    'ch_dishno' => '65006  ',
    'vch_seriesname' => '促销',
    'ch_seriesno' => '06',
  ),
  4 => 
  array (
    'vch_dishname' => '糯米团购东坡饭',
    'ch_dishno' => '65005  ',
    'vch_seriesname' => '促销',
    'ch_seriesno' => '06',
  ),
  5 => 
  array (
    'vch_dishname' => '糯米团购牛肉饭',
    'ch_dishno' => '65004  ',
    'vch_seriesname' => '促销',
    'ch_seriesno' => '06',
  ),
);
            $sql = '
    select vch_dishname,ch_dishno,b.vch_seriesname,a.ch_seriesno
    from cybr_bt_dish a,cybr_bt_dish_series b
    where 
	a.ch_seriesno = b.ch_seriesno
    and CHARINDEX(\'新品\',a.vch_explain)>0
    and dt_build between \'2013-01-01\' and \'2013-12-31\' order by dt_build desc';
            ?>