## Android App反编译练习

### 破解付费服务

1. apktool d jisuanguanjia.apk 
2. 在反编译目录中，查找strings.xml  
	find . -name "strings.xml" 一般位于res文件夹下
3. 在strings.xml中查找关键字，例如该处的“您尚未获取授权”，找到id为authorize_failed
4. 附近关键字发现“授权成功”字样，获取id为authorize_success，然后我们就可以去找处使用该id的关键代码  
5. 