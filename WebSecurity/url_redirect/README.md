## URL跳转绕过技巧总结 


### URL跳转的危害

URL跳转漏洞可导致用户跳转至钓鱼网站，内网访问内部资源等危害。  

参考:https://landgrey.me/open-redirect-bypass/ 

### 1. 利用问好绕过 

http://www.aaa.com/acb?Url=http://test.com?login.aaa.com 那么，它其实是会跳转到这个test.com域名下，这个域名是我想要跳转的任意域名，而后面的它自身域名一定要带上，不带上就无法辅助用问号?这个特性来跳转到指定域名了，而跳转后，问号和问号后面的内容会变为这样：http://www.test.com/?login.aaa.com  

### 2. 利用#符号绕过

http://eval.com.cn#shop1.vivo.com.cn/my/order 

### 3. 利用@符号绕过

如果你用这方法在火狐里进行跳转，会有弹窗提示，在其它游览器则没有。

如：<a href=”http://www.aaa.com/acb?Url=http://login.aaa.com@test.com“”>http://www.aaa.com/acb?Url=http://login.aaa.com@test.com 后面的test.com就是要跳转到的域名，前面的域名都是用来辅助以绕过限制的。


### 4. 利用xip.io绕过

http://www.baidu.com.47.104.218.243.xip.io 


### 5. 协议一致性 

当程序员跳转时可能对协议没有限制，可以利用其它的协议，如http、https、ftp等，如果协议有限制，则需要采用允许的协议进行攻击。  

### 6. 域名字符串检测欺骗

检测开头：   
https://www.landgrey.me/redirect.php?url=http://www.landgrey.me.www.evil.com/untrust.html    

直接在合法域名后面添加钓鱼域名  

检测结尾：  
https://www.landgrey.me/redirect.php?url=http://www.evil.com/www.landgrey.me   



