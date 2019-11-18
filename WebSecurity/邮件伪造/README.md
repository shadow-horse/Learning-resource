## 邮件伪造漏洞验证及修复  

### 1. 检测邮件服务器的TXT配置

http://doma.pucha.net/?t=1574043842，如果没有配置SPF策略或配置有误，则存在邮件伪造的风险。  

 	txt google-site-verification=sSLZaeuKyfnd_HXjlpyA5JVLOH1D1YCxNDzw0jg0F9Y   
 	txt v=spf1 include:spf.163.com -all    
 
 
 
### 2. 发送伪造的邮件  

https://emkei.cz/?reCAPTCHAv2  

在该网站，可尝试发送伪造的恶意邮件  



### 3. 邮件伪造说明 

邮箱伪造技术可被用来开展钓鱼攻击，即伪造管理员、公司主管等角色的邮箱发送邮件，获取信任，使对方打开带有附件的木马文件或者回复想要获取的敏感资料等，在APT攻击中常用的手段之一，结合office、falsh、系统漏洞，进行水坑攻击。    

SMTP协议不需要身份认证，邮件伪造也是利用这个特性来实现伪造任意发件人，SMTP邮件传输的三个阶段：  
1. 建立SMTP连接  （通过TCP三次握手进行通讯）
2. 数据传输      （伪造发生的阶段）
3. 连接关闭  

 	Helo /Ehlo ：表示与服务器内处理邮件的进程开始通话"介绍自己"

 	Mail from：邮件信息的来源地址，也就是要伪造的地址 

 	Rcpt to：邮件接收者/受害者

 	Data ：邮件的具体内容/可以添加附件等

 	Quit  ：退出邮件

此处不再赘述，参考网上分析： https://cloud.tencent.com/developer/news/320159 

### 4. SPF策略防护邮件伪造攻击

SPF 的原理是这样的，伪造这虽然能伪造你的域名，但是却不能控制你的域名的DNS解析记录。因为只有拥有域名账户权限，才能更改解析记录。你的域名解析到的ip是1.1.1.1，而伪造者的ip是2.2.2.2。如果能做一个声明，告诉邮件接收者，我的域名发的邮件ip都是1.1.1.1，其他的都是假的，可以抛弃掉，那么就可以杜绝邮件伪造了。   

1. 登录你的域名提供商的管理页面，设置域名解析IP： 

  		二级域名：空或@   
  		txt记录值为：v=spf1 ip4:1.1.1.1 -all
 
  		v=spf1      #版本号声明；
  		ip4:x.x.x.x #指定ip地址；
  		-all        #对其余的标记为无效(FAIL)
  
2. 如果设置变化的IP，或扩增多个IP，可以参考如下：  
 
  		二级域名：空或@
  		txt记录值为：v=spf1 include:spf1.a.com include:spf2.a.com -all
  
  		再设置一个spf1.a.com的txt解析记录，内容为：
  		二级域名：spf1
  		txt记录值为：v=spf1 ip4:1.1.1.0/24 ip4:1.2.3.4 -all
  	其中include的意思是使用其后的地址的SPF记录。而ip4:1.1.1.0/24则是使用一个段。设置spf2.a.com与此类似。这样就可以使用更多的地址作为合法地址。也可以include多层，但常见的一般最多三层已经够用，最后一层要指定到具体的ip或域名。   

3. all符号说明

关于剩余检查项all前面的“-”符号，参见下表：   

 	"+"  Pass（通过）
	"-"  Fail（拒绝）
	"~"  Soft Fail（软拒绝）
 	"?"  Neutral（中立）
建议使用“-all”来拒绝陌生地址的邮件。当使用“~all”时，一般会将邮件标记为垃圾邮件。但是由于有时人们还是会翻查垃圾邮件（甚至有时官方都会建议去检查垃圾邮件），因此这样处理并不安全。所以如无特殊需求，建议使用“-all”来拒绝。

禁用所有邮件服务：

 	v=spf1 -all

参考链接（中文）：http://www.renfei.org/blog/introduction-to-spf.html

### 5. swaks SMTP瑞士军刀 
使用swaks可以绕过SPF策略   

#### 1. swaks简介 

Swaks是一个功能强大，灵活，可编写脚本，面向事务的SMTP测试工具，由John Jetmore编写和维护。  

目前Swaks托管在私有svn存储库中。官方项目页面是http://jetmore.org/john/code/swaks/，kali系统自带。    


#### 2. 伪造邮件攻击

1. 测试邮箱的联通性，返回250OK，说明该邮件存在，会收到一封测试邮件
 
  		swaks --to test@example.com   

2. 伪造邮件发送

	进行邮件伪造攻击，首先需要自行搭建或创建一个SMTP邮件服务器（www.smtp2go.com下注册一个免费的发送的邮箱服务器的账号）  


  	./swaks --to backli×@163.com --from wenqi×@gmail.com --body helloworld --header "Subject: hello" --server mail.smtp2go.com   -p 2525 -au 用户名   -ap  密码

3. swaks --help