/*收入*/

declare @beginDate datetime
declare @endDate datetime
declare @store_id varchar(50)
set @beginDate = '2013-01-1'
set @endDate = '2013-01-31'
set @store_id = '0201'

select sum(zaocan) as zaocan,sum(wucan) as wucan, sum(wancan) as wancan, sum(waisong) as waisong from hehegu_report_sell where report_date between @beginDate and @endDate and ch_branchno in (@store_id);