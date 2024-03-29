# 网络劫持分析

网络劫持是一种相对比较普遍、容易发生的一种攻击行为。中国的网络环境相对复杂，除了电信、联通、移动是比较大的网路接入商外，此外还包含长城宽带、教育网、科技网、广电等不少于20多家的小运营商。而且各省之间独立运营，导致网络出现跨网、跨运营商的情况特别多，大量跨网络的流量，在运营商之间会产生一笔很大的结算费用。故会采取DNS强制解析或302跳转等劫持方式，将引导用户流量到缓存服务器。  

运营商有时候会为了卖广告或其他经济利益，通过买卖用户的流量挣钱，劫持用户的访问，目前运营商比较常见的作恶方式分为：DNS劫持、HTTP劫持。  

随着移动端的迅猛发展，“网络劫持”也日益猖獗，不断扩大自己的“地盘“，各种刷弹窗的小广告像狗皮膏药一样黏贴在手机屏幕上。  


## 1.DNS劫持
### 1.DNS劫持描述

DNS劫持是通过劫持DNS服务器，通过某些手段取得某些域名的解析记录控制权，进而修改此域名的解析结果，导致对该域名的访问由原IP地址转入到修改后的指定IP，其结果就是对特性的网址不能访问或访问的是假网址，从而实现窃取资料或者破坏原有正常服务的目的。DNS劫持通过篡改DNS服务器上的数据返回给用户一个错误的查询结果来实现的。  

DNS劫持症状：在某些地区的用户成功连接宽带后，首次打开任何页面都指向ISP提供的“电信页面”。  

域名的层级结构如下：  
	
	主机名.次级域名.顶级域名.根域名

DNS的分级查询是从根域名开始，一次查询每一级的NS记录，知道查询到最终的IP地址，大致过程如下：  
	
	从"根域名服务器"查到"顶级域名服务器"的NS记录和A记录（IP地址）  
	从"顶级域名服务器"查到"次级域名服务器"的NS记录和A记录（IP地址）  
	从"次级域名服务器"查出"主机名"的IP地址  

<img src="https://github.com/shadow-horse/Learning-resource/blob/master/WebSecurity/internet_hijacking/dns_parse.png"/>     

### 2.危害
域名欺骗导流，将用户的请求导向第三网站，一般这种网站都充斥着广告或者黄反暴等内容，主要为了广告或者软件捆绑盈利。     
钓鱼(phishing)。钓鱼也是将用户导向到第三方网站，但是和导流不同的是，这类劫持主要是为了获取用户的用户名及密码等非常重要的资料。比如银行帐户、支付宝帐户密码等内容。所以钓鱼网站常见于金融、购物类网站。  
### 3.HttpDNS解析  

HTTPDNS 利用 HTTP 协议与 DNS 服务器交互，代替了传统的基于 UDP 协议的 DNS 交互，绕开了运营商的 Local DNS，有效防止了域名劫持，提高域名解析效率。另外，由于 DNS 服务器端获取的是真实客户端 IP 而非 Local DNS 的 IP，能够精确定位客户端地理位置、运营商信息，从而有效改进调度精确性。  
<img src="https://github.com/shadow-horse/Learning-resource/blob/master/WebSecurity/internet_hijacking/httpdns_parse.png" />  

HttpDns 主要解决的问题:  

1. Local DNS 劫持：由于 HttpDns 是通过 IP 直接请求 HTTP 获取服务器 A 记录地址，不存在向本地运营商询问 domain 解析过程，所以从根本避免了劫持问题。

2. 平均访问延迟下降：由于是 IP 直接访问省掉了一次 domain 解析过程，通过智能算法排序后找到最快节点进行访问。

3. 用户连接失败率下降：通过算法降低以往失败率过高的服务器排序，通过时间近期访问过的数据提高服务器排序，通过历史访问成功记录提高服务器排序。  

HttpDNS原理步骤：  

	A、客户端直接访问HttpDNS接口，获取业务在域名配置管理系统上配置的访问延迟最优的IP。    
	B、客户端向获取到的IP后就向直接往此IP发送业务协议请求。以Http请求为例，通过在header中指定host字段，向HttpDNS返回的IP发送标准的Http请求即可。

HttpDNS域名解析适用于移动APP域名解析，以及C/S结构的应用，因为采用HttpDNS解析域名，需要客户端支持对网络层面的修改。  

[移动应用场景](https://cloud.tencent.com/document/product/379/3520)  

[特殊场景-H5页面](https://cloud.tencent.com/document/product/379/6473)  

## 2.HTTP劫持
### 1.HTTP劫持描述
http劫持是在使用者与其目的网络服务所建立的数据通道中，监视特定数据信息，提示当满足设定条件时，就会在正常的数据流中插入精心设计的网络数据报文，目的是让用户端程序解析“错误”的数据，并在使用者界面展示宣传性广告或直接显示某网站的内容。  

HTTP劫持主要的类型是：iframe嵌入和js嵌入为主，http劫持出现的频率多变，针对不同的ip也会不同（也许断网之后重新连接，劫持就消失），一定程度造成错误的假象，用户可能会忽视该问题，由于劫持过程非常快，只是经过某个ip后就快速的跳转，用户如果不注意地址栏的变化，根本不会注意到该问题的出现，其常见的现象为针对大量流量网站加小尾巴。    
![](https://github.com/shadow-horse/Learning-resource/blob/master/WebSecurity/internet_hijacking/http_inject_wxample.png)

### 2.劫持原理与方式

1. 通用的服务器，只要实现路由器或者七层代理的功能，能够接收和转发数据包就能实现劫持。  
2. 使用七层（HTTP）代理/反向代理实现劫持，能够查看和修改任意的http内容，七层代理性能要求低，劫持策略非常灵活，但是有一个问题就是会修改用户的源IP，容易暴露劫持者的位置。  
3. 大部分劫持都是在网络层（IP层）使用类似netfilter机制修改数据包的形式实现的劫持。该劫持的技术实现难度高，性能要求高。野蛮的方式就是提前给用户返回劫持的数据包，丢弃正常的流量，容易引起用户投诉。  

### 2.Http劫持防御

#### 1.使用JS缓解HTTP劫持风险
HTTP内容劫持一般都以插入广告盈利为目的，在劫持上尽量较少对原有网站的影响，以免用户投诉。  
使用Javascript实现前端http劫持防御，主要通过检测响应页面是否有劫持的特性方式来实现：  
	1. 页面被嵌入 iframe 中，重定向 iframe  
	2. 使用白名单放行正常 iframe 嵌套  
	3. 更改 URL 参数绕过运营商标记  
	4. 内联事件及内联脚本拦截  
	5. 重写 setAttribute 与 document.write  

JavaScript编写的组建，用于前端防御部分HTTP劫持与XSS：https://github.com/chokcoco/httphijack  
（该防御适用于无法采用Https协议，且客户端为浏览器）
#### 2.CSP策略防御运营商劫持 
内容安全策略（CSP）是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括XSS和数据注入等攻击，无论是数据窃取、网站内容污染还是散发恶意软件。
CSP是服务端设置的响应头：Content-Security-Policy:  

	<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
CSP详解：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP  
CSP的防护策略主要是对加载的src进行限制，并限制unsafe-inline的js代码，从而阻断http劫持中插入的js代码或内容。  

（CSP是通过限制来源的方式进行防御，要求目标网站不能有太多的外链，否则设置比较麻烦，另外CSP依赖浏览器的支持，目前大部分浏览器均支持该响应头，不支持CSP策略的浏览器无法达到防御效果，但是不影响访问，CSP是向后兼容的响应头，该防御策略适用于浏览器端访问）  
示例：https://0x0d.im/archives/anti-internet-traffic-hijacking-by-csp.html  

#### 3.HTTPS防御http劫持

https协议是基于SSL的http协议，ssl依靠证书验证服务端，并为浏览器和服务端建立安全的加密通道。浏览器或客户端在建立https链接时，会验证证书的合法性。浏览器默认保存了权威证书服务商的根证书，通过证书链的方式，验证证书的签名信息，以及颁发机构、证书过期时间等信息，并不会对域名和证书的对应关系做校验。Android系统默认也保存了权威根证书，在webview加载https协议时，也会进行类似的校验。   
![](https://github.com/shadow-horse/Learning-resource/blob/master/WebSecurity/internet_hijacking/https_interactive.png) 

会话建立详细可参考：https://www.cnblogs.com/huanxiyun/articles/6554085.html  

**HTTPS防止劫持存在一个问题，就是在HTTPS建立的过程中进行劫持，例如我们常见的Burpsuite代理，如果证书链的根证书发生泄漏，攻击者利用根证书签发中间劫持证书，则浏览器校验会通过**  
  

## 3.HTTPS劫持  

https本来就是预防劫持的，但是也有个别情况。  
1. 伪造证书，通过病毒或者其它方式将伪造证书的根证书安装在用户系统中。  
2. 代理也有客户的证书与私钥，或者客户端与代理认证的时候不校验合法性，即可通过代理来与我们服务端进行数据交互。  

在Android移动应用中，出现问题比较多个一个问题是“客户端未做证书校验”，其实说的便是上述这种风险，可以被劫持抓包分析。  

#### 1. https劫持描述 

**攻击方式一：SSLSniff**攻击者在网关截获SSL会话，替换PKey，欺骗客户端。  

	1. attacker截获客户端的say hello，把pub_attacker_key返还给客户端，取得客户端信任，使得客户端和attacker建立安全连接  
	2. attacker冒充客户端向服务端发送say hello，与服务端建立安全的连接 

**攻击方式二：SSLStrip**欺骗强制客户端和attacker建立http连接，监听明文数据。

	1. 客户端向服务端发起http请求  
	2. 中间人MITM监听客户端与服务器的http数据
	3. 服务器返回响应，attacker将其中的https连接，替换成http连接，例如Llocation:https://替换成location:http://，并保存 
	4. attacker将修改后的HTTP数据发送客户端
	5. 客户端向服务端发起HTTP连接请求
	6. attacker解析客户端的http连接请求，与保存的文件比较，如果已经修改过协议，则将替换成原来的https协议，发送服务端 
	7. attacker与服务端保持https连接 
	8. attacker与客户端保持http连接 
	9. 此时服务器默认认为https是安全的，但是客户端使用的确实http，针对这种攻击，建议设置HSTS响应头 

#### 2. https劫持防御

1. 针对web端，无法做强制证书校验，但是可以通过设置HSTS，避免SSLStrip攻击。  
2. 针对Android客户端，可以做证书的绑定校验，HttpsURLConnection、OKHttp3.0、webview的实现，可参考：https://www.cnblogs.com/alisecurity/p/5939336.html  


## 其它劫持场景

### 1.URL劫持
1.跳转劫持，将用户 URL重定向到非目标网站。如果直接劫持用户的目标网站太过明显，因为如果用户无法访问目标站点的话，会引起大量投诉最终会导致劫持败露。所以这类劫持一般都会针对中间页面劫持，并且会增加一些过滤条件。比如用户访问目标网站后，如果点击目标网站链接，就有可能被302跳转给劫持。比较典型的就是搜索结果页面.  
2.修改URL参数，比如在URL里添加流量渠道标识或者页面参数。  
(该劫持可归属于HTTP劫持的一种特殊形式) 
### 2.硬件设备劫持 

家中购买的路由器，如果设备厂商想做手脚的话，同样可以被利用，厂商篡改网站响应报文，增加厂商定制的劫持内容；  
用户连接不安全的WIFI热点时，也存在被劫持的可能性。  
（该劫持依赖设备后门，一般也是http劫持居多）

