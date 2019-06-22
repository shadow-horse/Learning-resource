## 重定向漏洞分析及防御实施  

网站接受用户输入的链接，跳转一个攻击者控制的网站，可能导致跳转过去的用户被精心设置的钓鱼页面骗走自己的个人信息或登录口令等。  


### 1. 漏洞发生的常见场景

URL重定向漏洞出现的场景比较多，通常出现在以下几点地方：   

 1. 用户登录、单点登录处，登录成功会进行跳转  
 2. 业务功能需要，拼接用户提交参数进行跳转  

URL重定向白盒审计参数名：  
 
 redirect
 redirect_to
 redirect_url
 redirecturl
 url
 jump
 jumpto
 jump_to
 target
 link
 linkto
 domain 
 forward
 fwd
 ......

URL重定向涉及的服务端代码：  
 
 Java:   
 response.sendRedirect
 request.getRequestDispatcher(url).forward(request, response);
 
 PHP:
 header("Location: " . $redirect_url);
   
 .NET
 Response.Redirect(redirect_url);
 
 Django:
 HttpResponseRedirect()

### 2. 漏洞导致的原因  

1. 跳转URL地址参数由外部传入，获取到参数后直接进行了使用  
2. 判断逻辑不严谨，正则或判断方法太简单被绕过  
3. 原始语言提供的函数，解析URL存在绕过漏洞  
4. 浏览器对标准URL协议解析处理的差异，或对某些特殊字符绕过 

### 3. 绕过技巧 
#### 1. 利用问好绕过 

http://www.aaa.com/acb?Url=http://test.com?login.aaa.com 那么，它其实是会跳转到这个test.com域名下，这个域名是我想要跳转的任意域名，而后面的它自身域名一定要带上，不带上就无法辅助用问号?这个特性来跳转到指定域名了，而跳转后，问号和问号后面的内容会变为这样：http://www.test.com/?login.aaa.com  

####  2. 利用#符号绕过

http://eval.com.cn#shop1.test.com.cn/my/order 

####  3. 利用@符号绕过

如果你用这方法在火狐里进行跳转，会有弹窗提示，在其它游览器则没有。

如：<a href=”http://www.aaa.com/acb?Url=http://login.aaa.com@test.com“”>http://www.aaa.com/acb?Url=http://login.aaa.com@test.com 后面的test.com就是要跳转到的域名，前面的域名都是用来辅助以绕过限制的。

#### 4. 利用畸形字符绕过正则  

1）添加“/” 或编码  
 
 https://landgrey.me/%2Fevil%252Ecom
 https://landgrey.me//evil.com

2）通过“\.”绕过  

 https://landgrey.me/redirect.php?url=http://www.evil.com\.landgrey.me
 
####  5. 利用xip.io绕过

利用http://xip.io解析，访问http://域名+地址+xip.ip，将解析到对应地址。   

 http://www.baidu.com.47.104.218.243.xip.io 


####  6. 协议一致性 

当程序员跳转时可能对协议没有限制，可以利用其它的协议，如http、https、ftp等，如果协议有限制，则需要采用允许的协议进行攻击。  

####  7. 域名字符串检测欺骗

检测开头：   
https://www.landgrey.me/redirect.php?url=http://www.landgrey.me.www.evil.com/untrust.html    

直接在合法域名后面添加钓鱼域名  

检测结尾：  
https://www.landgrey.me/redirect.php?url=http://www.evil.com/www.landgrey.me   

####  8. 含带检测域名的恶意域名  

例如跳转检测 test.com.cn 后缀的域名，则通过注册恶意的域名 evaltest.com.cn进行绕过钓鱼攻击  
https://passport.test.com.cn/v3/web/login/authorize?client_id=3&redirect_uri=http%3A%2F%2Fevaltest.com.cn    

#### 9. 推荐fuzz



### 4. 修复方案（按需求采用以下的方案）

1. 避免URL跳转和重定向，对于固定的跳转链接或域名，跳转时直接采用固定值（固定域名）  
2. 如果无法避免参数或地址来自请求，则需要对跳转的URL进行有效验证（推荐通过参数映射的方式）
3. 对于URL跳转时，提示用户即将跳转的，请用户确认点击 


举例：test网站在进行账号登录后，要跳转至原登录页面，此时需要保证的是跳转的必须是test域名下的网站。   

**存在问题的案例**
在实际中，很多开发者会使用正则的方式校验跳转的域名是不是.test.com.cn，我来看一下某个网站的实现：   

1. 先判断待跳转的URL是不是以http|https|www.开头，在正则前先进行了URL decode.    

 return /^(http:|https:|www\.)/.test(decodeURIComponent(t)) 

2. 抽取域名，进行域名判断 
 
 var e = /^(?:(\w+):\/\/)?(?:(\w+):?(\w+)?@)?([^:\/\?#]+)(?::(\d+))?(\/[^\?#]+)?(?:\?([^#]+))?(?:#(\w+))?/.exec(t)[4];

 return /\.test\.com(\.cn)?$/.test(e) ? !0 : !1

上面在第二步，获取的域名为http://www.baidu.com\.test.com.cn，则最后也验证通过，但是浏览器解析是会跳到百度的。  


**修复示例**

只允许.test域名下的URL进行跳转，则在写正则时，需要把可操控的空间写死，例如明确https|http协议，并且域名必须以test.com或test.com.cn结尾，前面必须是\W+. ，而后面必须是?或/  。

在实现的时候，我们不要用正则匹配这个URL是不是合法，而是通过明确的规则去抽取正确的URL，获取到URL，然后访问获取的URL，而不是校验URL合法后，直接跳转这个URL。 对于任何不合法的请求，直接设置默认值。   

 function getValidUrl(url){
        //URL去除两头的空格
        //默认已经URL解码
        url = url.trim();
        //进行判断
        var re = /^(http:|https:)(\/\/)((\w)+(\.))+(test\.com)(\.cn)?(((\?)|(\/))(.)*|$)/.exec(url);
        if(re == null){
                console.log("校验失败");
                url = "https://dev.test.com.cn";
        }else{
                url = re[0];
                console.log("校验成功");
        }
        return url;
 }

 http://47.104.218.243/url/index.html?redirect=https%3A%2F%2Fwww.test.com.cn

最有效的方法，还是从请求参数URL获取有效的值，然后按照既有的规则去拼接生成URL。   

### 参考链接

https://landgrey.me/open-redirect-bypass/  
https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.md
