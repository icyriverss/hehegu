<?php

class cls_chengben {

    protected $db;
    protected $t6db;
    protected $msdb;

    public function __construct() {
        global $localdb;
        global $t6db;
        global $msdb;
        $this->db = $localdb;
        $this->t6db = $t6db;
        $this->msdb = $msdb;
    }

    //获取食材列表
    private function getGoodsList() {
        $date = date('Y-m-d', time());
        $sql = "SELECT     t.cInvCode, t.cInvName, t.cInvCCode,isnull(t.cInvStd,'') as cInvStd, ISNULL(s.cComUnitName ,'') AS cInvUnit, ISNULL(t.cInvDefine2, s.cComUnitName) AS iBzUnit, ISNULL(t.cInvDefine3, 1)  AS iBzHsl, ISNULL(t.cInvDefine4, s.cComUnitName) AS iDeUnit, ISNULL(t.cInvDefine5, 1) AS iDeHsl, t.cInvDefine1 AS cInvType, ISNULL(t.iInvNCost, 0)  AS iUnitCost, ISNULL(t.iInvRCost, 0) AS iInvRCost
FROM         Inventory AS t LEFT OUTER JOIN ComputationUnit AS s ON t.cComUnitCode = s.cComunitCode where left(t.cInvCode,2) in('01','02','03') and (dedate>'$date' or dedate is null) order by t.cInvCode";
        return $this->t6db->fetch_all($sql); //物品列表，缓存一天
    }

    /**
     * 获取某月食材理论单价列表
     * @param type $arr
     */
    public function getMaterialPriceByMonth($arr) {
        $year = parsepoststr($arr['year']);
        $month = int_val($arr['month']);
        $now_date = date('Y-m-d H:i:s', strtotime("$year-$month-1"));
        $goodlist = $this->getGoodsList();
        $sql = "select * from material_month where add_date='" . $now_date . "'";
        $material = $this->db->fetch_all($sql);
        if (empty($material)) {
            return $goodlist;
        }
        $material_list = array();
        foreach ($material as $v) {
            $material_list[$v['stuffcode']] = $v['price'];
        }
        for ($i = 0; $i < count($goodlist); $i++) {
            if (!empty($material_list[$goodlist[$i]['cInvCode']])) {
                $goodlist[$i]['price'] = $material_list[$goodlist[$i]['cInvCode']];
            }
        }
        return $goodlist;
    }

    /**
     * 设置某月食材理论单价
     * @param type $arr
     * @return type
     */
    public function setMaterialMonth($arr) {
        $year = parsepoststr($arr['year']);
        $month = int_val($arr['month']);
        $time = $year . '-' . $month . '-1';
        $now_date = date('Y-m-d', strtotime($time));
        $now_date_2 = date('Y-m-d H:i:s', strtotime($time));
        if ($_POST['leadExcel'] == 1) {
            $data = array();
            try {
                $execl = uploadExcel($_FILES['inputExcel']);
            } catch (Exception $e) {
                return array('status' => 2,'error' => 'EXECL编码异常'); //参数异常
            }
            $temp_execl = $execl[1];
            for ($i = 0; $i < count($temp_execl); $i++) {
                if (strpos($temp_execl[$i],'存货编码') !== FALSE ) {
                    $stuffcode_key = $i;
                }
                if (strpos($temp_execl[$i],'单价') !== FALSE) {
                    $price_key = $i;
                }
            }
            unset($execl[1]); //去掉标题
            if (!empty($execl)) {
                foreach ($execl as $k => $v) {
                    if (str2int($v[$stuffcode_key]) != '' && $v[$price_key] != '') {
                        $data[$k]['stuffcode'] = str2int($v[$stuffcode_key]);
                        $data[$k]['price'] = $v[$price_key];
                    }
                }
            }
        } else {
            $data = $arr['data'];
        }
        if (!is_array($data) || empty($data)) {
            return array('status' => 1, 'error' => '数据参数错误'); //参数异常
        }
        //获取现有数据数组
        $sql = "select * from material_month where add_date='" . $now_date_2 . "'";
        $material = $this->db->fetch_all($sql);
        $material_list = array();
        if (!empty($material)) {
            foreach ($material as $v) {
                $material_list[$v['stuffcode']] = $v['price'];
            }
        }
        foreach ($data as $v) {
            $stuffcode = str2int($v['stuffcode']);
            if (!empty($material_list[$stuffcode]) && $v['price'] != $material_list[$stuffcode]) {
                $sql = "update  material_month set price='" . $v['price'] . "' where stuffcode='" . $stuffcode . "' and add_date='" . $now_date . "'";
            } elseif (empty($material_list[$stuffcode])) {
                $sql = "insert into material_month(stuffcode,price,add_date) values('" . $stuffcode . "','" . $v['price'] . "','" . $now_date . "')";
            }
            $this->db->query($sql);
        }
        return array('status' => 0);
    }

    // 食材月度成本表
    public function getMaterialCostByMonth($arr) {
        // $year = parsepoststr($arr['year']);
        // $month = int_val($arr['month']);

        $startdate = parsepoststr($arr['startdate']);
        $enddate = parsepoststr($arr['enddate']);
        // if($month==12){
        //     $enddate = date('Y-m-d',strtotime("$year-$month-31"));
        // }else{
        //     $enddate = date('Y-m-d',strtotime("$year-".($month+1)."-1")-3600*24);
        // }
        //分店
        $stores = $arr['stores'];
        if ($stores) {
            $queryStore = " and ch_branchno in (" . join(',', $stores) . ") ";
        } else {
            $queryStore = " and ch_branchno =''";
        }

        $sellMaterialList = array(); //理论使用，根据销售数据
        $useMaterialList = array(); //实际使用，根据订货数据
        // 菜品销售数据
        $saleDishList = $this->getSaleList($stores, $startdate, $enddate);
        // 根据菜品销售数据计算材料理论用量
        for ($i = 0; $i < count($saleDishList); $i++) {
            $dish = $saleDishList[$i];
            $stuffList = $this->getChildCost($dish['child_no']); //获取材料组成
            for ($m = 0; $m < count($stuffList); $m++) {
                $stuff = $stuffList[$m];
                $stuff_code = $stuff['stuff_code'];
                $tmp = $sellMaterialList[$stuff_code];
                if (!$tmp) {
                    $tmp = $stuff;
                    $tmp['sell_use'] = 0; // 销售使用
                    $tmp['order_use'] = 0; // 订货使用
                }
                $tmp['sell_use'] = $tmp['sell_use'] + $stuff['nums'] * $dish['real_nums']; //组成数量 * 销售数量
                $sellMaterialList[$stuff_code] = $tmp;
            }
        }
        // 订货数据
        $orderDishList = $this->getRealUseList($stores, $startdate, $enddate);
        // 根据订货情况计算实际消耗量
        foreach ($orderDishList as $key => $v) {
            $tmp = $sellMaterialList[$key];
            if (!$tmp) {
                $tmp = $orderDishList[$key];
                $tmp['sell_use'] = 0; // 销售使用
                $tmp['order_use'] = 0; // 订货使用
            }
            $tmp['order_use'] = $orderDishList[$key]['order_use'] ? $orderDishList[$key]['order_use'] : 0;
            $sellMaterialList[$key] = $tmp;
        }

        foreach ($sellMaterialList as $key => $v) {
            $sellMaterialList[$key]['sell_cost'] = $this->getGoodRealCost($key, $startdate);
            $sellMaterialList[$key]['liangchayi'] = $v['order_use'] - $v['sell_use'];
            $sellMaterialList[$key]['liangchayi_percent'] = number_format($sellMaterialList[$key]['liangchayi'] * 100 / $v['sell_use'], 2);
            $sellMaterialList[$key]['order_cost'] = $sellMaterialList[$key]['sell_cost'] * ( 1 + $sellMaterialList[$key]['liangchayi_percent'] / 100);
            $sellMaterialList[$key]['bianhao'] = $sellMaterialList[$key]['stuff_code'] = $key;

            $sellMaterialList[$key]['sell_use'] = number_format($sellMaterialList[$key]['sell_use'], 2);
            $sellMaterialList[$key]['order_use'] = number_format($sellMaterialList[$key]['order_use'], 2);
            $sellMaterialList[$key]['liangchayi'] = number_format($sellMaterialList[$key]['liangchayi'], 2);
            $sellMaterialList[$key]['sell_cost'] = number_format($sellMaterialList[$key]['sell_cost'], 2);
            $sellMaterialList[$key]['order_cost'] = number_format($sellMaterialList[$key]['order_cost'], 2);
        }
        return $sellMaterialList;
    }

    //获取门店成品月度成本表
    public function getGoodsCostMonth($arr) {
        $year = parsepoststr($arr['year']);
        $month = int_val($arr['month']);
        $store_id = parsepoststr($arr['store_id']);
        $startdate = date('Y-m-d', strtotime("$year-$month-1"));
        $perpage = int_val($arr['perpage']) ? int_val($arr['perpage']) : 10; //默认分页10
        $page = int_val($arr['page']) ? int_val($arr['page']) : 1; //页码

        if ($month == 12) {
            $enddate = date('Y-m-d', strtotime("$year-$month-31"));
        } else {
            $enddate = date('Y-m-d', strtotime("$year-" . ($month + 1) . "-1") - 3600 * 24);
        }

        $uselist = array(); //销售消耗量
        $real_uselist = array(); //实际消耗量
        $res = array();
        $parse_num = array('bianhao', 'name', 'guige', 'kucun_danwei');
        //读取菜品销售数据
        $salelist = $this->getSaleList($store_id, $startdate, $enddate); //销售列表
        //计算材料用量
        for ($i = 0; $i < count($salelist); $i++) {
            $stuff = $this->getChildCost($salelist[$i]['child_no']); //获取材料组成
            $salelist[$i]['stuff'] = $stuff;
            for ($m = 0; $m < count($stuff); $m++) {
                $tmp = $uselist[$stuff[$m]['stuff_code']];
                if (!$tmp)
                    $tmp = array();
                $tmp['real_use'] = $tmp['real_use'] + $stuff[$m]['nums'] * $salelist[$i]['real_nums']; //组成数量 * 销售数量
                $uselist[$stuff[$m]['stuff_code']] = $tmp;
            }
        }
        //实际消耗量
        $real_uselist = $this->getRealUseList($store_id, $startdate, $enddate); //订货
        foreach ($uselist as $key => $v) {
            $uselist[$key]['order_use'] = $real_uselist[$key]['order_use'] ? $real_uselist[$key]['order_use'] : 0;
            $uselist[$key]['real_cost'] = $this->getGoodRealCost($key, $startdate); //月度结余成本
        }
        $res = array();
        foreach ($salelist as $k => $v) {

            if (!$res[$v['ch_dishno']])
                $res[$v['ch_dishno']] = array();
            $tmp = $res[$v['ch_dishno']];
            $tmp['name'] = $v['vch_dishname'];
            $tmp['ch_dishno'] = $v['ch_dishno'];
            $tmp['inum'] = $v['inum'];
            $tmp['price'] = $v['price'];

            $res[$v['ch_dishno']] = $tmp;
            if (!$res[$v['ch_dishno']]['childs'])
                $res[$v['ch_dishno']]['childs'] = array();

            foreach ($v['stuff'] as $x => $y) {
                if (!$res[$v['ch_dishno']]['childs'][$y['stuff_code']])
                    $res[$v['ch_dishno']]['childs'][$y['stuff_code']] = array();
                $tmp = $res[$v['ch_dishno']]['childs'][$y['stuff_code']];
                $tmp1 = $uselist[$y['stuff_code']];
                $tmp['name'] = $y['name'];
                $tmp['kucun_danwei'] = $y['kucun_danwei'];
                $tmp['nums'] = $tmp['nums'] + floor($y['nums'] * 1000000) / 1000000;
                $tmp['cost'] = floor($tmp1['real_cost'] * 100) / 100;
                $tmp['real_cost'] = floor($tmp1['order_use'] * $tmp1['real_cost'] * 100 / $tmp1['real_use']) / 100;
                $tmp['real_price'] = floor($tmp['real_cost'] * $tmp['nums'] * 10000) / 10000;
                $res[$v['ch_dishno']]['childs'][$y['stuff_code']] = $tmp;
                $res[$v['ch_dishno']]['de_cost'] = $res[$v['ch_dishno']]['de_cost'] + floor($tmp['cost'] * $tmp['nums'] * 100) / 100;
                $res[$v['ch_dishno']]['real_cost'] = $res[$v['ch_dishno']]['real_cost'] + floor($tmp['real_cost'] * $tmp['nums'] * 100) / 100;
            }
        }



        return array('list' => $res, 'total' => $total, 'perpage' => $perpage, 'page' => $page);
    }

    //获取成品的原始成本
    public function getCPCost($arr) {
        $perpage = int_val($arr['perpage']) ? int_val($arr['perpage']) : 10; //默认分页10
        $page = int_val($arr['page']) ? int_val($arr['page']) : 1; //页码
        $name = parsepoststr($arr['name']); //成品名称
        $bianhao = parsepoststr($arr['bianhao']); //成品编号
        $store_id = parsepoststr($arr['store_id']);

        $sql = "select 
vch_dishname as name,num_price1,ch_dishno,case when b.num_price>0 then b.num_price else a.num_price1 end as num_price,ch_suitflag
from cybr_bt_dish a left join
(select ch_dishno as id,num_price1 as num_price from cyhq_bt_dish_special where ch_branchno='$store_id' group by ch_dishno,num_price1) b on a.ch_dishno = b.id";

        //$cplist = $this->msdb->fetch_all($sql,$perpage,$page);
        $cplist = $this->msdb->query_page_all($sql, $perpage, $page);
        $total = $this->msdb->total;
        foreach ($cplist as $k => $v) {
            if ($v['ch_suitflag'] == 'Y') {//套餐
                $tmp = $this->getTCDish($v['ch_dishno']);
                $cost = array();
                $price = 0;
                for ($i = 0; $i < count($tmp); $i++) {
                    $cost[$tmp[$i]['ch_dishno']] = $tmp[$i];
                    $cost[$tmp[$i]['ch_dishno']]['child'] = $this->getChildCost($tmp[$i]['ch_dishno']);
                    $price = $price + $this->sumChildCost($cost[$tmp[$i]['ch_dishno']]['child']);
                }
                $cplist[$k]['child'] = $cost;
                $cplist[$k]['cost'] = $price;
            } else {
                $cplist[$k]['child'] = $this->getChildCost($v['ch_dishno']);
                $cplist[$k]['cost'] = $this->sumChildCost($cplist[$k]['child']);
            }
        }
        return array('list' => $cplist, 'total' => $total, 'perpage' => $perpage, 'page' => $page);
    }

    //获取所有的材料的成本之和
    private function sumChildCost($cost) {
        $price = 0;
        foreach ($cost as $k => $v) {
            $price = $price + $v['nums'] * $v['cost'];
        }
        return floor($price * 100) / 100;
    }

    //获取单品的组成和成本
    private function getChildCost($dishno) {
        $sql = "select cpscode as stuff_code,iPSQuantity / tdQtyD AS nums,isnull(convert(decimal(9,2),iPSQuantity * b.iInvRCost / tdQtyD),0) as price,b.cinvname as name,isnull(b.cinvstd,'') as guige,isnull(b.iInvRCost,0) as cost,c.cComUnitName AS kucun_danwei
from ProductStructures a 
left join inventory b on a.cpscode = b.cinvcode
left join ComputationUnit c on b.cComUnitCode = c.cComUnitCode
 where cpspcode='$dishno'";
        return $this->t6db->fetch_all($sql);
    }

    //获取套餐中的单品
    private function getTCDish($dishno) {
        return $this->msdb->fetch_all("select  b.vch_dishname as name,b.ch_dishno,a.num_num from cybr_bt_dish_suit a left join cybr_bt_dish b on a.ch_dishno=b.ch_dishno where a.ch_suitno='$dishno'");
    }

    //计算食材实际成本
    public function getGoodsCost($arr) {
        $startdate = parsepoststr($arr['startday']);
        $enddate = parsepoststr($arr['endday']);
        $store_id = parsepoststr($arr['store_id']);


        $uselist = array(); //销售消耗量
        $real_uselist = array(); //实际消耗量
        $res = array();
        $parse_num = array('bianhao', 'name', 'guige', 'kucun_danwei');

        //读取菜品销售数据
        $salelist = $this->getSaleList($store_id, $startdate, $enddate); //销售列表
        //计算材料用量
        for ($i = 0; $i < count($salelist); $i++) {
            $stuff = $this->getDPStuff($salelist[$i]['child_no']); //获取材料组成
            for ($m = 0; $m < count($stuff); $m++) {
                $tmp = $uselist[$stuff[$m]['stuff_code']];
                if (!$tmp)
                    $tmp = array();
                $tmp['real_use'] = $tmp['real_use'] + $stuff[$m]['nums'] * $salelist[$i]['real_nums']; //组成数量 * 销售数量
                $uselist[$stuff[$m]['stuff_code']] = $tmp;
            }
        }

        //实际消耗量
        $real_uselist = $this->getRealUseList($store_id, $startdate, $enddate); //订货
        foreach ($real_uselist as $key => $value) {
            $tmp = $real_uselist[$key];
            $tmp['real_use'] = $uselist[$key] ? $uselist[$key]['real_use'] : 0;
            $tmp['liangchayi'] = $tmp['order_use'] - $tmp['real_use'];
            $tmp['pianchae'] = $tmp['liangchayi'] * $tmp['cost'];
            $tmp['pianchalv'] = floor(abs($tmp['liangchayi']) * 10000 / $tmp['real_use']) / 100;

            $tmp['liangchayi_nbs'] = $tmp['liangchayi'] + $tmp['baosun'];
            $tmp['pianchae_nbs'] = $tmp['liangchayi_nbs'] * $tmp['cost'];
            $tmp['pianchalv_nbs'] = floor(abs($tmp['liangchayi_nbs']) * 10000 / $tmp['real_use']) / 100;
            $tmp['cost'] = $this->getGoodRealCost($tmp['bianhao'], $startdate);
            foreach ($tmp as $k => $v) {
                if (!in_array($k, $parse_num))
                    $tmp[$k] = floor($v * 100) / 100;
            }
            $real_uselist[$key] = $tmp;
        }
        return array('list' => $real_uselist);
    }

    //获取材料结存单价
    private function getGoodRealCost($bianhao, $date) {
        $sql = "select iincost as cost from ia_subsidiary where cinvcode='$bianhao'  and (dvoudate<'$date' or dkeepdate<'$date') and iincost>0 order by dvoudate desc,dkeepdate desc";
        return $this->t6db->result_first($sql);
    }

    //从订货和盘点数据中获取门店实际消耗量
    private function getRealUseList($store_id, $startdate, $enddate) {
        if (is_array($store_id)) {
            $queryStore = " b.store_id in (" . join(',', $store_id) . ")";
        } else {
            $queryStore = " b.store_id = '$store_id'";
        }
        $sql = "
select 
qichu,
(dinghuo+bufa-tuiku+zhigong) as jinhuo,--实际订货数
diaochu,diaoru,(cailiaobaosun+chengpinbaosun) as baosun,pandian,
(dinghuo+bufa+zhigong-tuiku+diaoru-diaochu-cailiaobaosun-chengpinbaosun+qichu-pandian) as order_use,--实际使用数
bianhao,name,guige,kucun_danwei,cost
from
(
select 
isnull(sum(case when b.order_date='$startdate' and b.order_type=4 and " . $queryStore . " then order_nums end),0) as qichu,
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=1 and " . $queryStore . " then real_send end),0) as dinghuo,
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=2 and " . $queryStore . " then order_nums end),0) as zhigong,
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=3 and " . $queryStore . " then order_nums end),0) as diaochu,
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=3 and " . $queryStore . " then order_nums end),0) as diaoru,
isnull(sum(case when b.order_date='$enddate' and b.order_type=4 and " . $queryStore . " then order_nums end),0) as pandian,--最后一天的盘点数
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=5 and " . $queryStore . " then order_nums end),0) as cailiaobaosun,
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=6 and " . $queryStore . " then order_nums end),0) as chengpinbaosun,
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=7 and " . $queryStore . " then order_nums end),0) as bufa,
isnull(sum(case when b.order_date<>'$startdate' and b.order_type=8 and " . $queryStore . " then order_nums end),0) as tuiku,
bianhao,name,guige,kucun_danwei,cost
from order_list_more a
left join order_list b on a.order_id=b.order_id
where
" . $queryStore . "
and b.order_date >=DATEADD(day,-1,'$startdate')--需要前一天的盘点数据作为期初
and b.order_date <='$enddate'
group by bianhao,name,guige,kucun_danwei,cost)  s";

        $uselist = $this->db->fetch_all($sql);
        $arr = array();
        for ($i = 0; $i < count($uselist); $i++) {
            $arr[$uselist[$i]['bianhao']] = $uselist[$i];
        }
        return $arr;
    }

    //获取单品的材料组成数组
    private function getDPStuff($ch_dishno) {
        $sql = "select cpscode as stuff_code,iPSQuantity / tdQtyD AS nums  from ProductStructures where cpspcode='$ch_dishno'";
        return $this->t6db->fetch_all($sql);
    }

    //获取单品的材料组成数组。参数：数组
    private function getDPStuffByArray($arr_dishnos) {
        $sql = "select cpscode as stuff_code,iPSQuantity / tdQtyD AS nums,b.cinvname  from ProductStructures a left join inventory b on a.cpscode = b.cinvcode where cpspcode in '" . join($ch_dishno, ",") . "'";
        return $this->t6db->fetch_all($sql);
    }

    //获取门店的菜品销售数据
    private function getSaleList($store_id, $startdate, $enddate) {
        if (is_array($store_id)) {
            $queryStore = " and a.ch_branchno in (" . join(',', $store_id) . ") ";
        } else {
            $queryStore = " and a.ch_branchno ='$store_id' ";
        }

        $sql = "
select 
    sum(a.num_num-a.num_back) as inum,
    sum((a.num_num-a.num_back) * a.num_price) as price,
    case when b.ch_suitflag='N' then a.ch_dishno else d.ch_dishno end as child_no,
    sum(case when b.ch_suitflag='N' then a.num_num-a.num_back else (a.num_num-a.num_back)*d.num_num end)  as real_nums,
    a.ch_dishno,b.vch_dishname,b.ch_suitflag
from cyhq_u_orderdish a 
    left join cybr_bt_dish b on a.ch_dishno = b.ch_dishno
    inner join cyhq_u_checkout_master c on a.ch_branchno = c.ch_branchno and a.ch_payno = c.ch_payno and c.ch_state='Y'
    full outer join cybr_bt_dish_suit d on b.ch_dishno = d.ch_suitno
where a.dt_operdate > '$startdate 00:00:00' and a.dt_operdate < '$enddate 23:59:59' and a.ch_suitflag <>'Y' $queryStore 
group by d.ch_dishno,d.num_num,a.ch_dishno,b.vch_dishname,b.ch_suitflag
order by a.ch_dishno";

        $salelist = $this->msdb->fetch_all($sql); //销售列表

        return $salelist;
    }

}

?>
