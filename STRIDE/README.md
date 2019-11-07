## STRIDE威胁建模 
威胁建模是一个不断循环的动态模型，随着时间的推移不断变更，以适应新的威胁与攻击，并且能够适应应用程序，适应业务变更而不断完善与更改的自然发展过程。   

### 1. STRIDE威胁建模简史
STRIDE威胁建模是由微软提出的一种威胁建模方法，2004年微软公司就已经从流程管理、技术措施、人员组织和考量指标四个方面清晰的定义了威胁建模能力。  
![](https://github.com/shadow-horse/Learning-resource/blob/master/STRIDE/img/timeline.png)

威胁建模是一套方法理论以及工程实践，通常会使用威胁建模工具协助完成整个分析过程。  

### 2. STRIDE威胁类型 

STRIDE威胁模型将威胁类型划分为6种：  

- Spoofing(仿冒)  
- Tampering（篡改）  
- Repudiation(抵赖)
- Information Disclosure（信息泄露）  
- Denial of Service（拒绝服务）  
- Elevation of Privilege（权限提升）  
![](https://github.com/shadow-horse/Learning-resource/blob/master/STRIDE/img/stride.png)

		1. 身份假冒，即伪装成某对象或某人。例如，我们通过伪造别人的 ID 进行操作。
		2. 篡改，即未经授权修改数据或者代码。例如，我通过网络抓包或者某种途径修改某个请求包，而服务端没有进行进一步的防范措施，使得我篡改的请求包提交成功。
		3. 抵赖，即拒绝执行他人无法证实也无法反对的行为而产生抵赖。例如，我攻击了某个产品，他们并不知道是我做的，没有证据证明是我做的，我就可以进行抵赖，换句话说，我可以死不承认。
		4. 信息泄露，即将信息暴露给未授权用户。例如，我通过某种途径获取未经加密的敏感信息，例如用户密码。
		5. 拒绝服务，即拒绝或降低有效用户的服务级别。例如，我通过拒绝服务攻击，使得其他正常用户无法使用产品的相关服务功能。
		6. 特权提升，即通过非授权方式获得更高权限。例如，我试图用管理员的权限进行业务操作。

这六种威胁几乎涵盖了目前绝大部分安全问题。威胁建模的成果跟工作者自身的安全知识能力有很大关系，有攻防经验的人比较容易判断威胁的来源和利用场景。有些风险的利用场景是很少或者利用条件比较苛刻，不能一味地强调风险消减措施否则会变得有点纸上谈兵的味道。  

	很多安全从业者所接受的安全认知往往是进入一家企业后，看过一些应用安全开发安全标准的文档或要求，里面描述了访问控制、输入验证、编码过滤、输出编码、认证鉴权、加密、日志记录等各种要求，久而久之就变成了一种惯性思维，动不动就很多场景要做加密、鉴权，实际上之所以这么做是因为在系统设计的某个环节存在STRIDE中的一种或几种风险，所以在那个设计点上加入对应的安全措施，并不是在所有的地方都要套用全部或千篇一律的安全措施，否则就会变成另外一种结果：“过度的安全设计”；  

### 3. 威胁建模流程
STRIDE威胁建模的一般流程如下：  

1. 绘制数据流图
2. 识别威胁
3. 提出缓解措施
4. 安全验证 

#### 3.1 数据流图
数据流图（Data Flow Diagrams）包含外部实体（External Entity）、处理过程（Process）、数据流（Data Flow）、数据存储（Data Store）。   

	1. 数据流表示通过网络连接、命名管道、消息队列、RPC 通道等进行通信的过程。
	2. 数据存储表示文本、文件、关系型数据库、非结构化数据，本地或远程的存储。
	3. 处理过程指的是运行的，对外部实体提供服务的程序。
	4. 外部实体指请求发起方，获取服务的一方；

安全人员要和系统架构师及设计人员沟通，了解设计详情并画出数据流图，然后标注信息边界（Trust Boundary），针对简单的Web应用的数据流图示例如下：  
![](https://github.com/shadow-horse/Learning-resource/blob/master/STRIDE/img/dataflow.png)

思考：如何正确的划分信任边界？看信任域？以Android app为例？  

#### 3.2 识别威胁
STRIDE已经明确了每个数据流图元素具有的不同威胁，其中外部实体只有仿冒（S）、抵赖（R）威胁，数据流只有篡改（T）、信息泄露（I）、拒绝服务（D）威胁，处理过程有所有六种（STRIDE）威胁，存储过程有篡改（T）、信息泄露（I）、拒绝服务（D）威胁，但如果是日志类型存储则还有抵赖（R）威胁。具体可以对照如下表格进行威胁识别:  
![](https://github.com/shadow-horse/Learning-resource/blob/master/STRIDE/img/thread.png)

#### 3.3 缓解措施
根据不同的数据流图元素及威胁，相应的缓解措施也不相同，如本文示例中所述，针对外部实体的仿冒，其缓解措施简单来说就是对用户身份进行认证。但是对于Web应用来说，缓解仿冒威胁不仅仅需要较强的认证机制，还需要防止恶意攻击者用暴力破解、弱口令、凭证盗取等绕过认证的手段伪造用户的威胁，那么针对web登录缓解仿冒威胁的措施，详细如下：  
	
	1. 对用户进行帐号认证，密码认证或证书等身份认证；
	2. 密码登录增加验证码机制，增加失败次数锁定机制，防止暴力破解
	3. 用户密码做弱口令检查，密码强度满足一定的安全要求，如必须含有字母、数字、特殊字符，长度不小于8位
	4. 用户凭证SESSION必须设置http only属性，防止XSS盗取Cookie
	5. 用户超时注销机制，在用户30min中内无操作时，自动注销登录 
	6. 防护会话固定漏洞
	
针对每一种威胁，在不同业务场景下，它的消减措施是不一样的，在实际操作中要结合威胁库或威胁列表充分考虑安全风险点，如OWASP公布的漏洞Top 10。  

微软针对常用的威胁给出了常用的标准缓解措施，针对缓解措施要安全的实施技术方案。  
![](https://github.com/shadow-horse/Learning-resource/blob/master/STRIDE/img/solution.png)

#### 3.4 安全验证

要确认缓解措施是否能够真正缓解潜在威胁，同时验证数据流图是否符合设计，代码实现是否符合预期设计，所有的威胁是否都有相应的缓解措施。最后将威胁建模报告留存档案，作为后续迭代开发、增量开发时威胁建模的参考依据。  

#### 4. The Web Application Security Consortium (WASC)的威胁列表

<table width="100%">
<tbody>
<tr>
<td width="97"><strong>威胁项</strong></td>
<td width="455"><strong>描述</strong></td>
</tr>
<tr>
<td width="97">功能滥用</td>
<td width="455">一种使用 Web 站点的自身特性和功能来对访问控制机制进行消耗、欺骗或规避的攻击方法。</td>
</tr>
<tr>
<td width="97">蛮力攻击</td>
<td width="455">猜测个人的用户名、密码、信用卡号或密钥所使用的自动化反复试验过程。</td>
</tr>
<tr>
<td width="97">缓冲区溢出</td>
<td width="455">通过覆盖内存中超过所分配缓冲区大小的部分的数据来修改应用程序流的攻击。</td>
</tr>
<tr>
<td width="97">内容电子欺骗</td>
<td width="455">一种用于诱使用户相信 Web 站点上出现的特定内容合法而不是来自外部源的攻击方法。</td>
</tr>
<tr>
<td width="97">凭证/会话预测</td>
<td width="455">一种通过推断或猜测用于识别特定会话或用户的唯一值来盗取或仿冒 Web 站点用户的方法。</td>
</tr>
<tr>
<td width="97">跨站点脚本编制</td>
<td width="455">一种强制 Web 站点回传攻击者提供的可执行代码（装入到用户浏览器中）的攻击方法。</td>
</tr>
<tr>
<td width="97">跨站点请求伪造</td>
<td width="455">一种涉及强制受害者在目标不知情或无意愿的情况下向其发送 HTTP 请求，以便以受害者身份执行操作的攻击。</td>
</tr>
<tr>
<td width="97">拒绝服务</td>
<td width="455">一种旨在阻止 Web 站点为正常用户活动提供服务的攻击方法。</td>
</tr>
<tr>
<td width="97">指纹</td>
<td width="455">攻击者的最常用方法是首先占用目标的 Web 范围，然后枚举尽可能多的信息。通过此信息，攻击者可以制定将有效利用目标主机所使用的软件类型/版本中的漏洞的准确攻击方案。</td>
</tr>
<tr>
<td width="97">格式字符串</td>
<td width="455">通过使用字符串格式化库功能访问其他内存空间来修改应用程序流的攻击。</td>
</tr>
<tr>
<td width="97">HTTP 响应走私</td>
<td width="455">一种通过期望（或允许）来自服务器的单个响应的中间 HTTP 设备将来自该服务器的 2 个 HTTP 响应“走私”到客户机的方法。</td>
</tr>
<tr>
<td width="97">HTTP 响应分割</td>
<td width="455">HTTP 响应分割的实质是攻击者能够发送会强制 Web 服务器形成输出流的单个 HTTP 请求，然后该输出流由目标解释为两个而不是一个 HTTP 响应。</td>
</tr>
<tr>
<td width="97">HTTP 请求走私</td>
<td width="455">一种滥用两台 HTTP 设备之间的非 RFC 兼容 HTTP 请求的解析差异来“通过”第一台设备将请求走私到第二台设备的攻击方法。</td>
</tr>
<tr>
<td width="97">HTTP 请求分割</td>
<td width="455">HTTP 请求分割是一种实现强制浏览器发送任意 HTTP 请求，从而施加 XSS 和毒害浏览器缓存的攻击。</td>
</tr>
<tr>
<td width="97">整数溢出</td>
<td width="455">当算术运算（如乘法或加法）的结果超过用于存储该运算的整数类型的最大大小时发生的情况。</td>
</tr>
<tr>
<td width="97">LDAP 注入</td>
<td width="455">一种用于对通过用户提供的输入来构建 LDAP 语句的 Web 站点加以利用的攻击方法。</td>
</tr>
<tr>
<td width="97">邮件命令注入</td>
<td width="455">一种用于对通过用户提供的未适当清理的输入来构造 IMAP/SMTP 语句的邮件服务器和 Web 邮件应用程序加以利用的攻击方法。</td>
</tr>
<tr>
<td width="97">空字节注入</td>
<td width="455">一种用于通过将 URL 编码的空字节字符添加到用户提供的数据来绕过 Web 基础结构中的清理检查过滤器的主动攻击方法。</td>
</tr>
<tr>
<td width="97">操作系统命令</td>
<td width="455">一种用于通过操纵应用程序输入来执行操作系统命令，从而对 Web 站点加以利用的攻击方法。</td>
</tr>
<tr>
<td width="97">路径遍历</td>
<td width="455">这是一种强制对可能驻留在 Web 文档根目录外的文件、目录和命令进行访问的方法。</td>
</tr>
<tr>
<td width="97">可预测的资源位置 (Predictable Resource Location)</td>
<td width="455">一种用于通过做出有根据的猜测来显露所隐藏 Web 站点内容和功能的攻击方法。</td>
</tr>
<tr>
<td width="97">远程文件包含</td>
<td width="455">一种用于利用 Web 应用程序中的“动态文件包含”机制骗取应用程序包含具有恶意代码的远程文件的攻击方法。</td>
</tr>
<tr>
<td width="97">路由迂回</td>
<td width="455">一种可以注入或“劫持”中介以将敏感信息路由到外部位置的“中间人”攻击。</td>
</tr>
<tr>
<td width="97">会话定置</td>
<td width="455">将用户的会话标识强制变为显式值的一种攻击方法。在用户的会话标识定置后，攻击者会等待其登录。一旦用户进行登录，攻击者就会使用预定义的会话标识值来夺取其在线身份。</td>
</tr>
<tr>
<td width="97">弱密码恢复验证</td>
<td width="455">当 Web 站点允许攻击者非法获取、更改或恢复其他用户的密码时发生。</td>
</tr>
<tr>
<td width="97">SOAP 数组滥用</td>
<td width="455">一种期望数组可以是 XML DoS 攻击目标的 Web Service，方法是强制 SOAP 服务器在机器内存中构建巨大的数组，从而因内存预分配而在机器上施加 DoS 条件。</td>
</tr>
<tr>
<td width="97">SSI 注入</td>
<td width="455">一种服务器端利用技术，攻击者通过它可以将代码发送到 Web 应用程序中，Web 服务器稍后将在本地执行此代码。</td>
</tr>
<tr>
<td width="97">SQL 注入</td>
<td width="455">一种用于对通过用户提供的输入来构建 SQL 语句的 Web 站点加以利用的攻击方法。</td>
</tr>
<tr>
<td width="97">URL 重定向器滥用</td>
<td width="455">URL 重定向器表示 Web 站点采用的将入局请求转发到备用资源的常见功能，并且可在钓鱼攻击中使用。</td>
</tr>
<tr>
<td width="97">XPath 注入</td>
<td width="455">一种用于对通过用户提供的输入来构建 XPath 查询的 Web 站点加以利用的攻击方法。</td>
</tr>
<tr>
<td width="97">XML 属性爆发</td>
<td width="455">一种针对 XML 解析器的拒绝服务攻击。</td>
</tr>
<tr>
<td width="97">XML 外部实体</td>
<td width="455">此方法利用 XML 的功能在处理时动态构建文档。XML 消息可以显式或者通过指向数据存在的 URI 来提供数据。在此攻击方法中，外部实体可以将实体值替换为恶意数据或备用引荐，或者可能危害服务器/XML 应用程序有权访问的数据的安全性。</td>
</tr>
<tr>
<td width="97">XML 实体扩展</td>
<td width="455">此方法对 XML DTD 中允许创建可在文档各处使用的定制宏（称为实体）的功能加以利用。通过以递归方式定义文档顶部的定制实体集，攻击者可以淹没尝试强制实体几乎无限迭代这些递归定义来完全解析实体的解析器。</td>
</tr>
<tr>
<td width="97">XML 注入</td>
<td width="455">一种用于操纵或破坏 XML 应用程序或服务的逻辑的攻击方法。将非意图 XML 内容和/或结构注入到 XML 消息中会变更应用程序的意图逻辑。此外，XML 注入还可导致将恶意内容插入到产生的消息/文档中。</td>
</tr>
<tr>
<td width="97">XQuery 注入</td>
<td width="455">XQuery 注入是针对 XML XQuery 语言的经典 SQL 注入攻击的变体。XQuery 注入使用传递到 XQuery 命令的未适当验证的数据。</td>
</tr>
</tbody>
</table>

### 5. Web应用安全测试常见威胁列表
<table width="100%">
<tbody>
<tr>
<td width="104"><strong>分类</strong></td>
<td colspan="2" width="449"><strong>威胁项</strong></td>
</tr>
<tr>
<td rowspan="2" width="104">信息探测</td>
<td width="208">错误代码利用</td>
<td width="241">错误页面信息利用</td>
</tr>
<tr>
<td width="208">robots、爬虫攻击</td>
<td width="241">&nbsp;</td>
</tr>
<tr>
<td rowspan="7" width="104">配置攻击</td>
<td width="208">FTP匿名访问</td>
<td width="241">第三方不可控脚本/URL利用</td>
</tr>
<tr>
<td width="208">中间件配置攻击</td>
<td width="241">过时的、用于备份的以及未被引用的文件利用</td>
</tr>
<tr>
<td width="208">默认页面检测</td>
<td width="241">Flash跨域访问</td>
</tr>
<tr>
<td width="208">默认管理后台探测</td>
<td width="241">SSL/TLS攻击</td>
</tr>
<tr>
<td width="208">管理后台默认口令攻击/默认后台弱口令攻击</td>
<td width="241">数据库监听攻击</td>
</tr>
<tr>
<td width="208">不安全的HTTP方法攻击</td>
<td width="241">文件扩展名处理攻击</td>
</tr>
<tr>
<td width="208">第三方开源插件探测</td>
<td width="241">密码规则检查</td>
</tr>
<tr>
<td rowspan="9" width="104">认证攻击</td>
<td width="208">弱口令攻击</td>
<td width="241">密码修改逻辑攻击</td>
</tr>
<tr>
<td width="208">弱锁定机制恶意利用</td>
<td width="241">密码重置逻辑攻击</td>
</tr>
<tr>
<td width="208">短信炸弹</td>
<td width="241">SSO认证攻击</td>
</tr>
<tr>
<td width="208">垃圾邮件攻击</td>
<td width="241">加密信道证书传输</td>
</tr>
<tr>
<td width="208">认证绕过</td>
<td width="241">用户枚举攻击</td>
</tr>
<tr>
<td width="208">暴力破解</td>
<td width="241">用户账户猜测（遍历）</td>
</tr>
<tr>
<td width="208">竞争条件攻击/竞态条件攻击</td>
<td width="241">格式化字符串攻击</td>
</tr>
<tr>
<td width="208">图形验证码攻击</td>
<td width="241">图灵攻击</td>
</tr>
<tr>
<td width="208">短信验证码攻击</td>
<td width="241">多因素身份验证攻击</td>
</tr>
<tr>
<td rowspan="4" width="104">权限攻击</td>
<td width="208">目录浏览攻击</td>
<td width="241">业务接口恶意调用</td>
</tr>
<tr>
<td width="208">目录遍历攻击</td>
<td width="241">业务逻辑攻击</td>
</tr>
<tr>
<td width="208">越权查看</td>
<td width="241">后门利用</td>
</tr>
<tr>
<td width="208">越权操作</td>
<td width="241">权限提升</td>
</tr>
<tr>
<td rowspan="5" width="104">会话攻击</td>
<td width="208">Cookie属性利用</td>
<td width="241">会话超时缺陷利用</td>
</tr>
<tr>
<td width="208">Cookie伪造</td>
<td width="241">会话及浏览器缓存利用</td>
</tr>
<tr>
<td width="208">Cookie敏感信息获取</td>
<td width="241">冒用身份登录</td>
</tr>
<tr>
<td width="208">会话变量截获</td>
<td width="241">跨站请求伪造（CSRF)攻击</td>
</tr>
<tr>
<td width="208">会话固定攻击</td>
<td width="241">&nbsp;</td>
</tr>
<tr>
<td rowspan="13" width="104">数据验证攻击</td>
<td width="208">HTTP参数污染攻击/不安全的直接对象引用</td>
<td width="241">SSI注入攻击</td>
</tr>
<tr>
<td width="208">HTTP响应拆分攻击/缓存污染攻击</td>
<td width="241">IMAP/SMTP注入攻击</td>
</tr>
<tr>
<td width="208">Flash跨站脚本攻击</td>
<td width="241">代码注入攻击</td>
</tr>
<tr>
<td width="208">反射型XSS攻击</td>
<td width="241">命令执行注入</td>
</tr>
<tr>
<td width="208">存储型XSS攻击</td>
<td width="241">命令执行攻击</td>
</tr>
<tr>
<td width="208">DOM型XSS攻击</td>
<td width="241">缓冲区溢出（栈溢出、堆溢出）</td>
</tr>
<tr>
<td width="208">URL跳转攻击（未验证的URL跳转）</td>
<td width="241">交易数据合法型校验攻击</td>
</tr>
<tr>
<td width="208">LDAP注入攻击</td>
<td width="241">交易数据篡改攻击</td>
</tr>
<tr>
<td width="208">SQL注入攻击</td>
<td width="241">交易数据重放攻击</td>
</tr>
<tr>
<td width="208">XML实体注入攻击</td>
<td width="241">字符串格式溢出攻击</td>
</tr>
<tr>
<td width="208">XPATH注入攻击</td>
<td width="241">孵育攻击</td>
</tr>
<tr>
<td width="208">框架注入攻击</td>
<td width="241">文件包含攻击</td>
</tr>
<tr>
<td width="208">ORM注入攻击</td>
<td width="241">任意文件上传攻击</td>
</tr>
<tr>
<td width="104">逻辑攻击</td>
<td width="208">本地验证逻辑绕过</td>
<td width="241">任意文件下载</td>
</tr>
<tr>
<td rowspan="4" width="104">拒绝服务攻击</td>
<td width="208">SQL通配符攻击</td>
<td width="241">thc ssl dos攻击</td>
</tr>
<tr>
<td width="208">分配用户指定对象攻击</td>
<td width="241">Apache HTTP Server畸形头字段攻击</td>
</tr>
<tr>
<td width="208">释放资源失败攻击</td>
<td width="241">存储过多会话数据</td>
</tr>
<tr>
<td width="208">NTP服务monlist拒绝服务攻击</td>
<td width="241">&nbsp;</td>
</tr>
<tr>
<td width="104">AJAX攻击</td>
<td width="208">Ajax攻击</td>
<td width="241">&nbsp;</td>
</tr>
<tr>
<td rowspan="2" width="104">服务框架攻击</td>
<td width="208">WSDL攻击</td>
<td width="241">XML内容级别攻击</td>
</tr>
<tr>
<td width="208">XML结构攻击</td>
<td width="241">HTTP获取参数/REST攻击</td>
</tr>
</tbody>
</table>
###参考

http://blog.nsfocus.net/threat-modeling/    
https://www.cnblogs.com/Detector/p/8978133.html  
http://blog.nsfocus.net/threat-modeling/  