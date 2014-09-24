/*门店能耗百元耗电统计表*/
declare @searchDate datetime
declare @store_id varchar(50)
set @searchDate = '2013-01-2'
set @store_id = '0201'

--(cast(year(@searchDate) as VARCHAR(50)) + '-' + cast(month(@searchDate) as VARCHAR(50)) + '-01') 获取本月1日

select 
store_name,
(select sum(total) from hehegu_report_sell where report_date = @searchDate and ch_branchno = sl.store_id) as shouru,
(select sum(yongliang) from biao_use where biao_type_id = 2 and usedate = @searchDate and store_id = sl.store_id) as chufang,
(select sum(yongliang) from biao_use where biao_type_id = 3 and usedate = @searchDate and store_id = sl.store_id) as dating,
(select sum(total) from hehegu_report_sell where report_date between (cast(year(@searchDate) as VARCHAR(50)) + '-' + cast(month(@searchDate) as VARCHAR(50)) + '-01') and @searchDate and ch_branchno = sl.store_id) as yueshouru,
(select sum(yongliang) from biao_use where biao_type_id = 2 and usedate between (cast(year(@searchDate) as VARCHAR(50)) + '-' + cast(month(@searchDate) as VARCHAR(50)) + '-01') and @searchDate and store_id = sl.store_id) as yuechufang,
(select sum(yongliang) from biao_use where biao_type_id = 3 and usedate between (cast(year(@searchDate) as VARCHAR(50)) + '-' + cast(month(@searchDate) as VARCHAR(50)) + '-01') and @searchDate and store_id = sl.store_id) as yuedating
from store_list as sl where sl.store_id in (@store_id)