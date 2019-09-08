## 点击劫持 ClickJacking
### 1.漏洞简介
点击劫持是一种视觉上的欺骗手段，攻击者可以利用一个透明的、不可见的iframe，覆盖在一个网页上面，然后利用社工，诱导用户在该页面上进行操作，可以是点击、复制、粘贴等操作，从而在用户不知情的情况对目标网站进行操作，从而达到攻击。   


### 2. 漏洞示意图  
最初点击劫持发现时，是通过设置透明度为0的iframe，嵌套被攻击的网站，用户在访问恶意网站时完全无感知，但是随着浏览器安全策略的提升，进制透明度为0的iframe嵌套，此处攻击变得更加鸡肋。  

![](https://github.com/shadow-horse/Learning-resource/blob/master/WebSecurity/clickjacking/img/clickdemo.png)


### 3. JSON接口泄露泄露敏感信息

在近期的实际工作中，发现存在一种对接口的敏感信息窃取利用，利用接口没有做referer验证、没有做同源加载策略，攻击者构造一个社工页面，比如：获取口令码，提交进行抽奖等，在iframe中嵌入json的接口，用户在按照攻击的操作进行复制粘贴，将敏感的信息泄露给攻击者。 
攻击代码参见：stealinfo.html  
![](https://github.com/shadow-horse/Learning-resource/blob/master/WebSecurity/clickjacking/img/stealinfo.png)


### 4. 防御策略

设置X-FRAME-OPTIONS头，一般设置为sameorigin既能满足业务需求，也能保证安全性。  

另外严格校验referer等请求来源头，也可以有效防止接口敏感信息泄露问题。  

