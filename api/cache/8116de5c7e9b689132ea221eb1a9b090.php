<?php 
            $array=array (
  0 => 
  array (
    '42010  ' => '.00',
    '51009  ' => '.00',
    '51008  ' => '.00',
    '65006  ' => '.00',
    '65005  ' => '.00',
    '65004  ' => '.00',
    'months' => '01',
  ),
  1 => 
  array (
    '42010  ' => '.00',
    '51009  ' => '.00',
    '51008  ' => '.00',
    '65006  ' => '.00',
    '65005  ' => '.00',
    '65004  ' => '.00',
    'months' => '02',
  ),
  2 => 
  array (
    '42010  ' => '.00',
    '51009  ' => '.00',
    '51008  ' => '.00',
    '65006  ' => '.00',
    '65005  ' => '.00',
    '65004  ' => '.00',
    'months' => '03',
  ),
  3 => 
  array (
    '42010  ' => '.00',
    '51009  ' => '.00',
    '51008  ' => '.00',
    '65006  ' => '1094.00',
    '65005  ' => '734.00',
    '65004  ' => '578.00',
    'months' => '04',
  ),
  4 => 
  array (
    '42010  ' => '.00',
    '51009  ' => '.00',
    '51008  ' => '.00',
    '65006  ' => '364.00',
    '65005  ' => '290.00',
    '65004  ' => '209.00',
    'months' => '05',
  ),
  5 => 
  array (
    '42010  ' => '.00',
    '51009  ' => '.00',
    '51008  ' => '42.00',
    '65006  ' => '99.00',
    '65005  ' => '76.00',
    '65004  ' => '63.00',
    'months' => '06',
  ),
  6 => 
  array (
    '42010  ' => '4600.00',
    '51009  ' => '200.00',
    '51008  ' => '64.00',
    '65006  ' => '.00',
    '65005  ' => '.00',
    '65004  ' => '.00',
    'months' => '07',
  ),
);
            $sql = 'select 
    cast(sum(case when ch_dishno=\'42010  \' then (num_num - num_back) else 0 end)as numeric(11,2)) as \'42010  \',cast(sum(case when ch_dishno=\'51009  \' then (num_num - num_back) else 0 end)as numeric(11,2)) as \'51009  \',cast(sum(case when ch_dishno=\'51008  \' then (num_num - num_back) else 0 end)as numeric(11,2)) as \'51008  \',cast(sum(case when ch_dishno=\'65006  \' then (num_num - num_back) else 0 end)as numeric(11,2)) as \'65006  \',cast(sum(case when ch_dishno=\'65005  \' then (num_num - num_back) else 0 end)as numeric(11,2)) as \'65005  \',cast(sum(case when ch_dishno=\'65004  \' then (num_num - num_back) else 0 end)as numeric(11,2)) as \'65004  \',
    CONVERT(varchar(2),dt_operdate ,0) as months
    from cyhq_u_orderdish
    where
    dt_operdate between \'2013-01-01\' and \'2013-12-31\'
     and ch_branchno in (0201,0202,0203,0204,0205,0206,0207,0208,0209) 
    and 2013-10-26=2013-10-26
    group by CONVERT(varchar(2),dt_operdate ,0) with rollup
    having CONVERT(varchar(2),dt_operdate ,0) <> \'\'
    order by months asc';
            ?>