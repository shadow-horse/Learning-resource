# 网络劫持分析

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



### 2.HttpDNS解析  

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

	

