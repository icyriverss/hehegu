

/*---------同期同店------------*/
declare @beginDate datetime
declare @endDate datetime
set @beginDate = '2012-07-1'
set @endDate = '2013-01-30'


SELECT  b.store_name as '店名',sum(a.keliuliang) as '碗数',sum(a.total) as '总数' from hehegu_report_sell as a 
INNER JOIN
(SELECT * from store_list ) as b
on a.ch_branchno = b.store_id
where b.startdate between DATEADD(Year, -1, @beginDate) and DATEADD(Year, -1, @endDate)
GROUP BY b.store_name





/*---------2------------*/
select store_list.store_id, sum(gongshi.gongshi) FROM gongshi,store_list where gongshi.store_id=store_list.store_id
GROUP BY store_list.store_id
