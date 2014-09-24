<?php 
            $array=array (
);
            $sql = 'select 
    grouping(ch_branchno) as istotal,
    
	cast(sum(case when b.ch_seriesno=\'01\' then (num_num-num_back) else 0 end) as numeric(11,0)) as \'01\',
	cast(sum(case when b.ch_seriesno=\'02\' then (num_num-num_back) else 0 end) as numeric(11,0)) as \'02\',
	cast(sum(case when b.ch_seriesno=\'03\' then (num_num-num_back) else 0 end) as numeric(11,0)) as \'03\',
	cast(sum(case when b.ch_seriesno=\'04\' then (num_num-num_back) else 0 end) as numeric(11,0)) as \'04\',
	cast(sum(case when b.ch_seriesno=\'05\' then (num_num-num_back) else 0 end) as numeric(11,0)) as \'05\',
	cast(sum(case when b.ch_seriesno=\'06\' then (num_num-num_back) else 0 end) as numeric(11,0)) as \'06\',
    ch_branchno
    from cyhq_u_orderdish a,cybr_bt_dish b
    where
    dt_operdate between \'2013-10-01\' and \'2013-10-25\'
     and ch_branchno in (0201,0202,0203,0204,0205,0206,0207,0208,0209) 
    and a.ch_dishno = b.ch_dishno
    group by ch_branchno with rollup
    having sum(num_num - num_back) <> 0
    order by istotal desc';
            ?>