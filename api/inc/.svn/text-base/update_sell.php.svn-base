<?php
function getLastUpdate(){
    global $msdb;
    global $localdb;
    $now = date('Y-m-d',time());
    $res = $msdb->fetch_first("select top 1 CONVERT(varchar(10),dt_operdate ,111) as year from cyhq_u_orderdish 
    where dt_operdate<'$now' order by dt_operdate desc");//����֮ǰ�����
    $newday = date('Y-m-d',strtotime($res['year']));//������Ҫ��ɱ��������
    $res = $localdb->fetch_first("select top 1 CONVERT(varchar(10),report_date ,111) as year from hehegu_report_sell where isnull(adddate,0) <>0 order by report_date desc");//���߻�չ���¼��ʱ����¼��adddate�����Բ���Ӱ����󱨱�����
    if(!$res){
        $res=$msdb->fetch_first("select top 1 CONVERT(varchar(10),dt_operdate ,111) as year from cyhq_u_orderdish 
    where dt_operdate<'$now' order by dt_operdate asc");//
    }
    $reportday = date('Y-m-d',strtotime($res['year']));//��������ɱ��������
    return array(
        'newday'=>$newday,
        'reportday'=>$reportday
    );
}
function updateReport($arr){
    global $msdb;
    global $localdb;
    $now = date('Y-m-d',time());
    $res = $msdb->fetch_first("select top 1 CONVERT(varchar(10),dt_operdate ,111) as year from cyhq_u_orderdish 
    where dt_operdate<'$now' order by dt_operdate desc");//����֮ǰ�����
    $newday = date('Y-m-d',strtotime($res['year']));//������Ҫ��ɱ��������
    $res = $localdb->fetch_first("select top 1 CONVERT(varchar(10),report_date ,111) as year from hehegu_report_sell order by report_date desc");
    if(!$res){
        $res=$msdb->fetch_first("select top 1 CONVERT(varchar(10),dt_operdate ,111) as year from cyhq_u_orderdish 
    where dt_operdate<'$now' order by dt_operdate asc");//
    }
    $reportday = date('Y-m-d',strtotime($res['year']));//��������ɱ��������
    if($reportday !=$newday){
        $sell = new cls_update_sell;
        $sell->update($reportday,$newday);//
    }
    return array('status'=>0);
}
//����ĳ������
function updateReportByDay($arr){
    $day = parsepoststr($arr['day']);
    $sell = new cls_update_sell;
    $sell->update_by_day($day);
    return array('status'=>0);
}

//����������ݱ�����


class cls_update_sell{
    //������ʼ���ڣ���������
    function update($start,$end){
        global $msdb;
        /*�����ۣ���ͣ���ͣ���ͣ�   ok
        ���ͣ�  ???????
        �ײͣ�����  ok
        �����ײͣ�������ͣ�������Żݣ������Ź���  ok
        Ʒ����ͣ�Ʒ�ַ�Ʒ��Ʒ�ָ�Ʒ��Ʒ����Ʒ��   ok
        �ֽ𣬴�ֵ�����п���    ok
        ���������������Ųͣ�������չ��  ???????
        Ӧ��cost��ʵ��realcost���ۿ���discount��    ok
        �������adddate���������report_date���ֵ�ID ch_branchno
        */
        $startday = strtotime($start);
        $end = strtotime($end);
        for($i=$startday;$i<=$end;$i = $i + 24*3600){
            $this->update_by_day(date("Y-m-d",$i));
        }
    }
    function update_by_day($day){
        global $msdb;
        global $localdb;
        $sql = "select 
        grouping(a.ch_branchno) as istotal,
sum(case when a.ch_presentflag='N' then ((num_num - num_back) * num_price + num_price_add) * a.int_discount/100 else 0 end)  as total,
sum(case when a.ch_presentflag='N' and CONVERT(varchar(12) , a.dt_operdate, 114 ) < '10:00:00' then ((num_num - num_back) * num_price + num_price_add) *a.int_discount/100 else 0 end) as zaocan,
sum(case when a.ch_presentflag='N' and CONVERT(varchar(12) , a.dt_operdate, 114 ) < '15:30:00' and CONVERT(varchar(12) , a.dt_operdate, 114 ) >= '10:00:00' then 
	((num_num - num_back) * num_price + num_price_add) *a.int_discount/100 else 0 end) as wucan,
sum(case when a.ch_presentflag='N' and CONVERT(varchar(12) , a.dt_operdate, 114 ) >= '15:30:00' then ((num_num - num_back) * num_price + num_price_add) *a.int_discount/100 else 0  end) as wancan,
sum(case  when b.ch_suitflag='Y' and f.dishnums>2 then (num_num-num_back)*num_price else 0  end) as taocan,

sum(case when b.ch_seriesno =06 then (num_num - num_back) * num_price + num_price_add else 0  end) as cuxiao,
sum(case WHEN   b.ch_typeno=61  then (num_num - num_back) * num_price + num_price_add else 0  end) as cuxiao_changgui,
sum(case WHEN  b.ch_typeno=64  then (num_num - num_back) * num_price + num_price_add else 0  end) as cuxiao_wucan,
sum(case WHEN   b.ch_typeno=65   then (num_num - num_back) * num_price + num_price_add else 0  end) as cuxiao_tuangou,
sum(case WHEN  b.ch_suitflag='Y' AND b.ch_seriesno=06 and f.dishnums>2  then (num_num - num_back) * num_price + num_price_add else 0  end) as cuxiao_taocan,

cast(sum(case when b.ch_seriesno='05' then (num_num - num_back) * num_price + num_price_add else 0  end) as numeric(11,2)) as type_zaocan,
cast(sum(case when b.ch_seriesno='01' then (num_num - num_back) * num_price + num_price_add else 0  end) as numeric(11,2)) as type_fanpin,
cast(sum(case when b.ch_seriesno='04' then (num_num - num_back) * num_price + num_price_add else 0  end) as numeric(11,2)) as type_yinpin,
cast(sum(case when b.ch_seriesno='03' then (num_num - num_back) * num_price + num_price_add else 0  end) as numeric(11,2)) as type_fupin,

'discount' = sum(((num_num - num_back) * num_price + num_price_add) * (100 - int_discount) * 0.01), 
sum(case when
	b.ch_dishno = '11008' then 0
	when b.ch_dishno ='13007' then 0
	when b.ch_typeno='13' then (a.num_num- a.num_back) * -1
	when b.ch_typeno='23' then -(a.num_num- a.num_back)
	when b.ch_typeno='11' or b.ch_typeno='21' then (a.num_num-a.num_back)   
	else 0 end) as keliuliang,
a.ch_branchno
from 
cybr_bt_dish b,
cyhq_u_orderdish a,
cyhq_u_checkout_master d,
(
select (select count(*) from cybr_bt_dish_suit where ch_suitno=g.ch_dishno) as dishnums,ch_dishno
from cybr_bt_dish g
) f
where 
d.dt_operdate > '$day 00:00:00'
and d.dt_operdate < '$day 23:59:59'
and a.ch_dishno = b.ch_dishno
and a.ch_branchno = d.ch_branchno
and a.ch_payno = d.ch_payno
and f.ch_dishno = b.ch_dishno
group by a.ch_branchno with rollup
having sum(num_num - num_back) <> 0
order by a.ch_branchno asc";
        $res = $msdb->fetch_all($sql);//ȡ�����
        $sql = "select 
grouping(c.ch_branchno) as istotal,
cast(sum(case when c.ch_paymodeno='00' then num_realamount else 0  end) as numeric(11,2)) as xianjin,
cast(sum(case when c.ch_paymodeno='02' then num_realamount else 0  end) as numeric(11,2)) as chuzhi,
cast(sum(case when c.ch_paymodeno='03' or c.ch_paymodeno='04' then num_realamount else 0  end) as numeric(11,2)) as yinhangka,
c.ch_branchno
from cyhq_u_checkout_detail c
where 
c.dt_operdate >= '$day 00:00:00'
and c.dt_operdate <= '$day 23:59:59'
and c.ch_paymodeno <> 'XX'
and c.ch_paymodeno <> 'YY'
and c.ch_paymodeno <> 'ZZ'
group by c.ch_branchno with rollup
order by c.ch_branchno asc";


        $paymode_arr = $msdb->fetch_all($sql);//������ѯ��֧����ʽ�鿴�ܶ�
        foreach($res as $k=>$v){
            $cost = $v['total']+$v['discount'];
            //֧����ʽ���
            $arr = $this->getPayMode($day,$v['ch_branchno']);
            $v['xianjin'] = $arr['xianjin'];
            $v['chuzhi'] = $arr['chuzhi'];
            $v['yinhangka'] = $arr['yinhangka'];
            //���� �Ų� ��ʳ
            
            $arr =  $this->getWaisong($day,$v['ch_branchno']);
            $v['waisong'] = $arr['waimai']?$arr['waimai']:0;
            $v['ch_waimai'] = $arr['waimai']?$arr['waimai']:0;
            $v['ch_tuan'] = $arr['tuancan']?$arr['tuancan']:0;
            $v['ch_tangshi'] = $v['total'] - $v['ch_waimai'];
            $v['ch_tangshi'] = $v['ch_tangshi'] ? $v['ch_tangshi']:0;
            $v['ch_huizhan'] = 0;
            
            
            if(!$v[ch_branchno]) $v[ch_branchno]='';
            $discount = $total / $cost;
            $sql = "
                total='$v[total]',
                zaocan='$v[zaocan]',
                wucan='$v[wucan]',
                wancan='$v[wancan]',
                taocan='$v[taocan]',
                cuxiao='$v[cuxiao]',
                cuxiao_changgui='$v[cuxiao_changgui]',
                cuxiao_wucan='$v[cuxiao_wucan]',
                cuxiao_tuangou='$v[cuxiao_tuangou]',
                cuxiao_taocan='$v[cuxiao_taocan]',
                type_zaocan='$v[type_zaocan]',
                type_fanpin='$v[type_fanpin]',
                type_yinpin='$v[type_yinpin]',
                type_fupin='$v[type_fupin]',
                xianjin='$v[xianjin]',
                chuzhi='$v[chuzhi]',
                waisong='$v[waisong]',
                ch_waimai='$v[ch_waimai]',
                ch_tuan='$v[ch_tuan]',
                ch_tangshi='$v[ch_tangshi]',
                ch_huizhan='$v[ch_huizhan]',
                cost='$cost',
                discount='$discount',
                report_date ='$day',
                ch_branchno = '$v[ch_branchno]',
                istotal = '$v[istotal]',
                keliuliang = '$v[keliuliang]',
                adddate = '".date("Y-m-d H:i:s",time())."'
            ";
            $has = $localdb->fetch_first("select * from hehegu_report_sell where report_date='$day' and ch_branchno='$v[ch_branchno]'");
            $sql = "update hehegu_report_sell set $sql where report_date='$day' and ch_branchno='$v[ch_branchno]'";
            if(!$has){
                $localdb->query("insert into hehegu_report_sell (report_date,ch_branchno,istotal) values ('$day','$v[ch_branchno]','$v[istotal]')");
            }
            $localdb->query($sql);
        }
    }
    //��ȡĳ��ĳ���������
    function getWaisong($day,$store_id){
        global $msdb;
        if($store_id) $sql = "and a.ch_branchno = '$store_id'";
        $sql = "select
sum(a.num_cost) as waimai,
sum(case when num_cost>1000 then a.num_cost else 0 end) as tuancan
from cyhq_u_togo a
where 
a.dt_operdate>'$day 00:00:00'
and a.dt_operdate <'$day 23:59:59'
and a.ch_payflag='Y'
$sql
";
        $res = $msdb->fetch_first($sql);
        return $res;
    
    }
    function getPayMode($day,$store_id){
        global $msdb;
        if($store_id) $sql = "and c.ch_branchno = '$store_id'";
        $sql = "select 
cast(sum(case when c.ch_paymodeno='00' then num_realamount else 0  end) as numeric(11,2)) as xianjin,
cast(sum(case when c.ch_paymodeno='02' then num_realamount else 0  end) as numeric(11,2)) as chuzhi,
cast(sum(case when c.ch_paymodeno='03' or c.ch_paymodeno='04' then num_realamount else 0  end) as numeric(11,2)) as yinhangka
from cyhq_u_checkout_detail c
where 
c.dt_operdate > '$day 00:00:00'
and c.dt_operdate < '$day 23:59:59'
$sql
";
        $arr = $msdb->fetch_first($sql);
        return $arr;
    
    }
}

?>