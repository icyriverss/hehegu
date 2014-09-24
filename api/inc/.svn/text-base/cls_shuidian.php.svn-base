<?php

/*
  水电表设计思路：
  biao_type：系统预设的各种表，不可修改
  biao_type_id：表类别唯一编号
  biao_name：表类别名称
  istotal：是否总表
  biao_type：水表、电表、气表

  biao_list：所有的表
  biao_id：表的唯一编号
  store_id：门店id

  adddate：添加时间
  chejian_id：车间ID
  bag_id：仓库id

  冗余字段：
  biao_name：表类别名称
  istotal：是否总表
  biao_type：水表、电表、气表
  biao_type_id：哪种类型的表

  biao_price：所有表的价格记录表。该表保存了所有水电表的历史价格记录
  id：
  biao_id：表标号
  price：单价
  beilv：倍率
  startdate：生效日期

  冗余字段：
  biao_name：表类别名称
  biao_type_id：哪种类型的表
  istotal：是否总表
  biao_type：水表、电表、气表

  store_id：
  chejian_id：
  bag_id：

  biao_use：所有表的使用数据
  id：
  biao_id：表编号
  qichu：期初，如录入该值，则当日使用量计算为：zhishu-qichu。门店水电表置零时需要录入该字段
  yucun：预存
  zhishu：指数
  yongliang：今日用量（取今日指数-昨日指数 * 倍率）
  cost：消耗金额
  usedate：录入日期

  冗余字段：
  biao_name：表类别名称
  biao_type_id：哪种类型的表
  istotal：是否总表
  biao_type：水表、电表、气表

  price：单价
  beilv：倍率
 */

class cls_shuidian {

    function getUseData($start,$end,$stores) {
        if ($stores) {
            $store = " and store_id in (" . join(',', $stores) . ") ";
        }
        $sql = "select 
cast(sum(case when biao_type_id=1 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongdian',--总表
cast(sum(case when biao_type_id=3 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'dating',--大厅
cast(sum(case when biao_type_id=2 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'chufang',--厨房
cast(sum(case when biao_type_id=5 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongshui'--用水
from biao_use a
where 
usedate between '$start' and '$end'
$store";
        global $localdb;
        $res = $localdb->fetch_first($sql);
        return $res;
    }

    // 能源消耗趋势
    function getUseQushi($arr){
        //分店
        $stores = $arr['stores'];
        if($stores) {
        
        $store = " and ch_branchno in (".join(',',$stores).") ";
        }else{
            $store = " and ch_branchno =''";
        }

        //计算日期范围
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $start = date('Y-m-d',strtotime("$year-$month-01"));
        $end =getCurrentDay($year,$month);
        
        $fields = array('yongdian','dating','chufang','yongshui');

        $end =getCurrentDay($year,$month);
        //查询本期
        $res = $this->getUseData($start,$end,$stores);
        //查询本期所有数据
        $pres = $this->getUseData($start,$end);
        foreach($fields as $k=>$v){
            $res[$v . '_all']=$pres[$v];
        }
        
        //同期的日期范围
        $arr = getSameDay($year,$month);
        $start = $arr['start'];
        $end = $arr['end'];
        
        //查询同期
        $pres = $this->getUseData($start,$end,$stores);
        //合并同期数据
        foreach($fields as $k=>$v){
            $res['s'.$v]=$pres[$v];
        }
        
        //查询同期总数据
        $pres = $this->getUseData($start,$end);
        //合并同期数据
        foreach($fields as $k=>$v){
            $res['s'.$v . '_all']=$pres[$v];
        }
        
        //上期的日期范围
        $arr = getPreDay($year,$month);
        $start = $arr['start'];
        $end = $arr['end'];
        //查询上期
        $pres = $this->getUseData($start,$end,$stores);
        
        //合并数据
        foreach($fields as $k=>$v){
            $res['p'.$v]=$pres[$v];
        }
        
        
        //查询上期所有店数据
        $pres = $this->getUseData($start,$end);
        
        //合并数据
        foreach($fields as $k=>$v){
            $res['p'.$v . '_all']=$pres[$v];
        }
        return $res;
    }

    function getUseTotal($arr) {
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $date = date('Y-m', strtotime("$year-$month"));
        $stores = $arr['stores'];
        if ($stores) {
            $store = " and store_id in (" . join(',', $stores) . ") ";
        }

        $sql = "select 
grouping(store_id) as istotal,
cast(sum(case when biao_type_id=1 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongdian',--总表
cast(sum(case when biao_type_id=3 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'dating_dian',--大厅
cast(sum(case when biao_type_id=2 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'chufang_dian',--厨房
cast(sum(case when biao_type_id=5 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongshui',--用水
cast(sum(b.total) as numeric(11,0)) as 'total',--总输入
store_id
from biao_use a,hehegu_report_sell b 
where 
CONVERT(varchar(7),usedate ,20)='$date'
and a.store_id = b.ch_branchno
and CONVERT(varchar(7),b.report_date ,20)='$date'
and a.usedate = b.report_date
and b.istotal=0
$store
group by a.store_id with rollup
order by istotal desc";
        global $localdb;
        $res = $localdb->fetch_all($sql);
        return $res;
    }

    function getUseMonths($arr) {
        $year = int_val($arr['year']);

        $stores = $arr['store_id'];
        if ($stores) {
            $store = " and store_id in (" . join(',', $stores) . ") ";
        }
        $sql = "select 
CONVERT(varchar(2),usedate ,0) as months,
cast(sum(case when biao_type_id=1 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongdian',--总表
cast(sum(case when biao_type_id=3 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'dating_dian',--大厅
cast(sum(case when biao_type_id=2 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'chufang_dian',--厨房
cast(sum(case when biao_type_id=5 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongshui'--用水
from biao_use a
where 
CONVERT(varchar(4),usedate ,20)='$year'
$store
group by CONVERT(varchar(2),usedate ,0) order by months asc";
        global $localdb;
        $res = $localdb->fetch_all($sql);
        return $res;
    }

    function getUseDays($arr) {
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        $date = date('Y-m', strtotime("$year-$month"));
        $stores = $arr['store_id'];
        if ($stores) {
            $store = " and store_id in (" . join(',', $stores) . ") ";
        }
        $sql = "select 
CONVERT(varchar(2),usedate ,3) as dayss,
cast(sum(case when biao_type_id=1 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongdian',--总表
cast(sum(case when biao_type_id=3 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'dating_dian',--大厅
cast(sum(case when biao_type_id=2 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'chufang_dian',--厨房
cast(sum(case when biao_type_id=5 then (yongliang * beilv) else 0 end) as numeric(11,0)) as 'yongshui'--用水
from biao_use a
where 
CONVERT(varchar(7),usedate ,20)='$date'
$store
group by CONVERT(varchar(2),usedate ,3) order by dayss asc";
        global $localdb;
        $res = $localdb->fetch_all($sql);
        return $res;
    }

    //获取工时数据
    function getWorkTimes($arr) {
        global $localdb;
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        if ($store_id)
            $sql = " a.store_id='$store_id'";
        if ($chejian_id)
            $sql = " a.chejian_id='$chejian_id'";
        if ($bag_id)
            $sql = " a.bag_id='$bag_id'";
        $date = date('Y-m', strtotime("$year-$month"));
        $list = $localdb->fetch_all("select a.*,CONVERT(varchar(2),a.work_date ,3) as dayss,b.true_name from gongshi a left join personnel_list b on a.personnel_id = b.id where convert(varchar(7),a.work_date,20)='$date' and $sql");
        $personnel = $localdb->fetch_all("select a.id,a.true_name from personnel_list a where $sql and a.job_nature>0"); //当前非离职员工
        return array('list' => $list, 'personnel' => $personnel);
    }

    //获取客诉等数据
    function getHuizhanList($arr) {
        $store_id = parsepoststr($arr['store_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $type = $arr['type'];
        if ($type == 'kesu') {
            $field = 'kesu';
        } else {
            $field = 'ch_huizhan';
        }
        $sql = '';
        if ($store_id) {
            $sql = "  ch_branchno='$store_id'";
        }
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        global $localdb;
        $date = date('Y-m', strtotime("$year-$month"));
        $sql = "select $field,CONVERT(varchar(2),report_date ,3) as dayss from hehegu_report_sell where CONVERT(varchar(7),report_date ,20)='$date' and $sql and $field>0";
        $use_info = $localdb->fetch_all($sql); //所有表这个月所有数据
        return array('list' => $use_info);
    }

    //设置工时数据
    function setGongshi($arr) {
        global $localdb;
        $store_id = parsepoststr($arr['store_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $adddate = parsepoststr($arr['adddate']);
        $gongshi = $arr['gongshi'];
        if ((!$chejian_id && !$store_id && !$bag_id) || !$adddate || !$gongshi)
            return array('status' => 1);
        $total = 0;
        if ($store_id)
            $sql = " and store_id='$store_id'";
        if ($chejian_id)
            $sql = " and chejian_id='$chejian_id'";
        if ($bag_id)
            $sql = " and bag_id='$bag_id'";
        $localdb->transaction();
        foreach ($gongshi as $k => $v) {
            $id = $k;
            $work_times = $v['gongshi'];
            $waimai = $v['waimai'];
            $zhiye = $v['zhiye'];
            $bhas = $localdb->fetch_first("select * from gongshi where work_date='$adddate' $sql and personnel_id='$id'");
            if ($bhas) {
                $localdb->query("update gongshi set gongshi='$work_times',waimai='$waimai',zhiye='$zhiye' where work_date='$adddate' $sql and personnel_id='$id'");
            } else {
                $localdb->query("insert into gongshi (personnel_id,store_id,work_date,gongshi,waimai,zhiye,chejian_id,bag_id) values ('$id','$store_id','$adddate','$work_times','$waimai','$zhiye','$chejian_id','$bag_id')");
            }

            $total = $total + $work_times;
        }
        if ($store_id) {//门店需要计算总工时并插入到销售数据汇总表
            $bhas = $localdb->fetch_first("select * from hehegu_report_sell where report_date='$adddate' and ch_branchno='$store_id'");
            if (!$bhas) {
                $localdb->query("insert into hehegu_report_sell (report_date,ch_branchno,istotal) values ('$adddate','$store_id','')");
            }
            $localdb->query("update hehegu_report_sell set gongshi='$total' where  report_date='$adddate' and ch_branchno='$store_id'");
        }
        if ($localdb->error()) {
            $localdb->rollback();
            return array('status' => 2);
        } else {
            $localdb->commit();
            return array('status' => 0);
        }
    }

    //设置某天的数据
    function setHuizhan($arr) {
        $store_id = parsepoststr($arr['store_id']);
        $adddate = parsepoststr($arr['adddate']);
        $huizhan = $arr['huizhan'];
        $gongshi = $arr['gongshi'];
        $kesu = $arr['kesu'];
        if (isset($huizhan)) {
            $field = 'ch_huizhan';
            $value = int_val($huizhan);
        } else {
            $field = 'kesu';
            $value = int_val($kesu);
        }
        if (!$store_id || !$adddate)
            return array('status' => 1);
        global $localdb;
        $res = $localdb->fetch_first("select * from hehegu_report_sell where report_date='$adddate' and ch_branchno='$store_id'");
        if (!$res) {
            $localdb->query("insert into hehegu_report_sell (report_date,ch_branchno,istotal) values ('$adddate','$store_id','')");
        }
        $localdb->query("update hehegu_report_sell set
        $field = '$value'
        where  report_date='$adddate' and ch_branchno='$store_id'");
        return array('status' => 0);
    }

    //获取水电使用数据
    function getUseList($arr) {
        $store_id = parsepoststr($arr['store_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $sql = '';
        if ($store_id) {
            $sql = "  store_id='$store_id'";
        } elseif ($bag_id) {
            $sql = "  bag_id='$bag_id'";
        } elseif ($chejian_id) {
            $sql = "  chejian_id='$chejian_id'";
        }
        $year = int_val($arr['year']);
        $month = int_val($arr['month']);
        global $localdb;
        $date = date('Y-m', strtotime("$year-$month"));
        $biao_info = $localdb->fetch_all("select * from biao_list where $sql "); //获取表列表
        for ($i = 0; $i < count($biao_info); $i++) {//获取每个表最新价格
            $tmparr = $biao_info[$i];
            $tmp = $localdb->fetch_first("select top 1 beilv,price from biao_price where biao_id='$tmparr[biao_id]' order by startdate desc,id desc");
            $biao_info[$i]['beilv'] = $tmp['beilv'];
            $biao_info[$i]['price'] = $tmp['price'];
        }
        $sql = "select *,CONVERT(varchar(10),usedate ,20) as usedate from biao_use where CONVERT(varchar(7),usedate ,20)='$date' and $sql";
        $use_info = $localdb->fetch_all($sql); //所有表这个月所有数据
        return array('biao_list' => $biao_info, 'use_list' => $use_info);
    }

    //添加修改表，表类别以数组传入，客户端表现为多选
    function editBiao($arr) {
        $store_id = parsepoststr($arr['store_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $biao_type_ids = $arr['biao_type_ids'];
        if (!$biao_type_ids)
            return array('status' => 1); //表类型ID错误
        $sql = '';
        if ($store_id) {
            $sql = " and store_id='$store_id'";
        } elseif ($bag_id) {
            $sql = " and bag_id='$bag_id'";
        } elseif ($chejian_id) {
            $sql = " and chejian_id='$chejian_id'";
        }
        if (!$sql)
            return array('status' => 2); //至少指定一个门店、仓库、车间的ID
        global $localdb;
        $localdb->query("delete from biao_list where biao_type_id not in (" . join(',', $biao_type_ids) . ") $sql");
        for ($i = 0; $i < count($biao_type_ids); $i++) {
            $biao_type_id = parsepoststr($biao_type_ids[$i]);
            if (!$biao_type_id)
                return array('status' => 1); //表类型ID错误
            $res = $localdb->fetch_first("select * from biao_list where biao_type_id='$biao_type_id' $sql"); //检测有没有该类型表
            if (!$res) {//没有则新增
                $res = $localdb->fetch_first("select * from biao_type where biao_type_id='$biao_type_id'");
                if (!$res)
                    return array('status' => 3); //没有该类型表
                $localdb->query("insert into biao_list (biao_name,biao_type,biao_type_id,istotal,adddate,store_id,bag_id,chejian_id) values 
                ('$res[biao_name]','$res[biao_type]','$res[biao_type_id]','$res[istotal]','" . date('Y-m-d', time()) . "','$store_id','$bag_id','$chejian_id')");
            }
        }
        return array('status' => 0);
    }

    //修改表的单价、倍率
    function editPrice($arr) {
        $list = $arr['list'];
        if (!$list)
            return array('status' => 1); //数据为空，参数错误
        global $localdb;
        for ($i = 0; $i < count($list); $i++) {
            $tmp = $list[$i];
            $beilv = float_val($tmp['beilv']);
            $price = float_val($tmp['price']);
            $startdate = parsepoststr($tmp['startdate']);
            $biao_id = int_val($tmp['biao_id']);
            if (!$biao_id)
                continue;
            if ($beilv < 1)
                return array('status' => 2); //倍率至少为1
            if ($price <= 0)
                return array('status' => 3); //单价必须大于0
            if (!$startdate)
                return array('status' => 4); //起始日期格式错误
            $biaoinfo = $localdb->fetch_first("select * from biao_list where biao_id='$biao_id'");
            if (!$biaoinfo)
                return array('status' => 5); //不存在该表
            $bchange = $localdb->fetch_first("select top 1 * from biao_price where biao_id ='$biao_id' order by startdate desc");
            if (!$bchange || $bchange['price'] != $price || $bchange['beilv'] != $beilv) {//有修改则插入记录，否则不做任何操作
                $localdb->query("insert into biao_price (biao_id,price,beilv,startdate,biao_name,biao_type_id,istotal,biao_type,store_id,chejian_id,bag_id) values 
                ('$biao_id','$price','$beilv','$startdate','$biaoinfo[biao_name]','$biaoinfo[biao_type_id]','$biaoinfo[istotal]','$biaoinfo[biao_type]','$biaoinfo[store_id]','$biaoinfo[chejian_id]','$biaoinfo[bag_id]')");
            }
        }
        return array('status' => 0);
    }

    //设置某天的指数(同时设置多表)
    function editZhishu($arr) {
        $list = $arr['list'];
        if (!$list)
            return array('status' => 1); //数据为空，参数错误
        $usedate = parsepoststr($arr['usedate']); //录入日期
        global $localdb;
        for ($i = 0; $i < count($list); $i++) {
            $tmp = $list[$i];
            $yucun = float_val($tmp['yucun']);
            $zhishu = float_val($tmp['zhishu']);
            $qichu = float_val($tmp['qichu']);
            $biao_id = int_val($tmp['biao_id']);
            //获取价格生效时间小于录入日期的最后一条记录
            $info = $localdb->fetch_first("select top 1 * from biao_price where biao_id = '$biao_id' and startdate<='$usedate' order by startdate desc,id desc"); //获取最新价格
            if (!$info)
                return array('status' => 3); //未设置表的价格，无法录入
            $bhas = $localdb->fetch_first("select * from biao_use where biao_id='$biao_id' and usedate='$usedate'");
            if ($qichu == 0) {
                $qichu = $localdb->result_first("select top 1 zhishu from biao_use where biao_id='$biao_id' and usedate < '$usedate' order by usedate desc");
            }
            $yongliang = ($zhishu - $qichu) * $info['beilv'];
            $cost = $yongliang * $info['price']; //消费金额
            if ($yongliang < 0)
                return array('status' => 4); //可能是输入错误会导致该结果，即今日指数小于昨日指数
            if ($bhas) {
                $localdb->query("update biao_use set 
                    qichu = '$qichu',
                    yucun = '$yucun',
                    zhishu = '$zhishu',
                    yongliang = '$yongliang',
                    cost = '$cost' where usedate='$usedate' and biao_id='$biao_id'");
            } else {
                $localdb->query("insert into biao_use (biao_id,qichu,yucun,zhishu,yongliang,cost,usedate,biao_name,biao_type_id,biao_type,istotal,price,beilv,store_id,chejian_id,bag_id) values ('$biao_id','$qichu','$yucun','$zhishu','$yongliang','$cost','$usedate','$info[biao_name]','$info[biao_type_id]','$info[biao_type]','$info[istotal]','$info[price]','$info[beilv]','$info[store_id]','$info[chejian_id]','$info[bag_id]')");
            }
            //检测该日后一天的数据，如存在则重新计算之后一天的用量
            $tomorrow = $localdb->fetch_first("select top 1 * from biao_use where usedate>'$usedate' and biao_id='$biao_id' order by usedate asc");

            if ($tomorrow && $tomorrow['qichu'] == 0) {//存在，且没有期初数据
                $qichu = $zhishu; //明天的期初等于今日的指数
                $yongliang = ($tomorrow['zhishu'] - $qichu) * $tomorrow['beilv'];
                $cost = $yongliang * $tomorrow['price'];
                $localdb->query("update biao_use set yongliang='$yongliang',cost='$cost' where id='$tomorrow[id]'");
            }
        }
        return array('status' => 0);
    }

    //获取表类型列表 如果传入部门参数，则同时获取该部门已开启的表
    function getTypeList($arr) {
        global $localdb;
        $biao_type_info = $localdb->fetch_all("select * from biao_type order by biao_type_id asc");
        $store_id = parsepoststr($arr['store_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $sql = '';
        if ($store_id) {
            $sql = " and store_id='$store_id'";
        } elseif ($bag_id) {
            $sql = " and bag_id='$bag_id'";
        } elseif ($chejian_id) {
            $sql = " and chejian_id='$chejian_id'";
        }
        if ($sql) {

            for ($i = 0; $i < count($biao_type_info); $i++) {
                $info = $localdb->fetch_all("select * from biao_list where biao_type_id='" . $biao_type_info[$i]['biao_type_id'] . "' $sql ");
                if ($info) {
                    $biao_type_info[$i]['bhas'] = 1;
                }
            }
        }
        return array('list' => $biao_type_info, 'store_id' => $store_id, 'bag_id' => $bag_id, 'chejian_id' => $chejian_id);
    }

    //获取表和价格列表
    function getBiaoList($arr) {
        $store_id = parsepoststr($arr['store_id']);
        $bag_id = parsepoststr($arr['bag_id']);
        $chejian_id = parsepoststr($arr['chejian_id']);
        $sql = '';
        if ($store_id) {
            $sql = " store_id='$store_id'";
        } elseif ($bag_id) {
            $sql = " bag_id='$bag_id'";
        } elseif ($chejian_id) {
            $sql = " chejian_id='$chejian_id'";
        }
        if (!$sql)
            return array('status' => 1);
        global $localdb;
        $res = $localdb->fetch_all("select * from biao_list where $sql");
        if (!$res)
            return array('status' => 2);
        for ($i = 0; $i < count($res); $i++) {
            $tmp = $localdb->fetch_first("select beilv,price,CONVERT(varchar(10),startdate,20) as startdate from biao_price where biao_id='" . $res[$i]['biao_id'] . "' order by startdate desc,id desc"); //只获取一条最新的价格记录。如多次调整价格，则价格表会产生多个记录且不会清除
            if (!$tmp)
                continue;
            $res[$i]['beilv'] = $tmp['beilv'];
            $res[$i]['price'] = $tmp['price'];
            $res[$i]['startdate'] = $tmp['startdate'];
        }
        return array('list' => $res);
    }

    function addType($arr) {
        $biao_name = parsepoststr($arr['biao_name']);
        $istotal = int_val($arr['istotal']);
        $biao_type = parsepoststr($arr['biao_type']);
        if (!$biao_name || !$biao_type)
            return array('status' => 1);
        global $localdb;
        $res = $localdb->fetch_first("select * from biao_type where istotal=1 and biao_type='$biao_type'");
        if ($res && $istotal > 0)
            return array('status' => 2); //只能拥有一块主表
        $res = $localdb->query("insert into biao_type (biao_name,istotal,biao_type) values ('$biao_name','$istotal','$biao_type')");
        return array('status' => 0);
    }

    function editType($arr) {
        $biao_name = parsepoststr($arr['biao_name']);
        $istotal = int_val($arr['istotal']);
        $biao_type = parsepoststr($arr['biao_type']);
        $biao_type_id = int_val($arr['biao_type_id']);
        if (!$biao_name || !$biao_type || !$biao_type_id)
            return array('status' => 1);
        global $localdb;
        $res = $localdb->fetch_first("select * from biao_type where istotal=1 and biao_type='$biao_type' and biao_type_id<>'$biao_type_id'");
        if ($res && $istotal > 0)
            return array('status' => 2); //只能拥有一块主表
        $res = $localdb->query("update biao_type set biao_name='$biao_name',istotal='$istotal',biao_type='$biao_type' where biao_type_id='$biao_type_id'");
        return array('status' => 0);
    }

    function delType($arr) {
        $biao_type_id = int_val($arr['biao_type_id']);
        global $localdb;
        $localdb->query("delete from biao_type where biao_type_id='$biao_type_od'");
        return array('status' => 0);
    }

}

?>