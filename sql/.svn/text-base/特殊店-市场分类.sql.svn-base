/*特殊店*/
declare @beginDate datetime
declare @endDate datetime
set @beginDate = '2013-01-1'
set @endDate = '2013-01-30'

select 
store_name,
(select market_type from store_list where store_id = sl.store_id) as market,
(select sum(total) from hehegu_report_sell where report_date between @beginDate and @endDate and  ch_branchno = sl.store_id) as total,
(select sum(cost) from hehegu_report_sell where report_date between @beginDate and @endDate and  ch_branchno = sl.store_id) as wanshu,
(select sum(gongshi) from gongshi where work_date between @beginDate and @endDate and  store_id = sl.store_id) as gongshi
from store_list as sl 