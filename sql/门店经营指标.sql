/*门店经营指标*/
declare @startDate datetime
declare @endDate datetime
declare @store_id varchar(50)
set @startDate = '2013-08-01'
set @endDate = '2013-08-31'

select 
store_name,
(select sum(total) from hehegu_report_sell where report_date between @startDate and @endDate and ch_branchno = sl.store_id) as shouru,
(select sum(yongliang) from biao_use where biao_type_id = 2 and usedate between @startDate and @endDate and store_id = sl.store_id) as chufang,
(select sum(yongliang) from biao_use where biao_type_id = 3 and usedate between @startDate and @endDate and store_id = sl.store_id) as dating
from store_list as sl