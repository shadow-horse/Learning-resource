## Xposed开发插件环境配置

### 1.VirtualXposed

VirtualXposed 是基于VirtualApp 和 epic 在非ROOT环境下运行Xposed模块的实现。允许在非Root得环境下使用Xposed框架，实现对函数的Hook。安装VirtualXposed后，里面已经默认安装了Xposed Installer，无需额外安装。  

Download: https://github.com/android-hacker/VirtualXposed   
参考：https://xposed.appkg.com/2799.html   


### 2.依赖配置

1. 系统环境配置NDK  
	Xposed插件开发中，经常会用到NDK进行.so模块的编写，所以建议配置NDK环境；  
	Download: https://developer.android.google.cn/ndk/downloads/  
	下载后将其解压到相应目录下面，然后配置环境变量，路径中避免使用中文和空格，配置完成后,在CMD中执行ndk-build，执行成功则意味着环境配置成功。
2. AndroidStudio Project中配置NDK	  
	File -> Project Structure 中添加Android NDK location:  
	 <img src="https://github.com/shadow-horse/Learning-resource/blob/master/practice/media/ndk_201809201209.png" />  
	
3. 配置Xposed api
   在新建的Android工程中，需要导入Xposed api，即api-82-source.jar和api-82.jar放入libs中。  
   Download: https://bintray.com/rovo89/de.robv.android.xposed/api  
    <img src="https://github.com/shadow-horse/Learning-resource/blob/master/practice/media/xposed_api_import_201809201223.jpg" />  
   在工程中导入Jar包时，网上有说将app\build.gradle中的dependencies选项：implementation换成provided，对此原因未验证，provided即将被compileOnly所代替，到时候直接使用compileOnly即可。  
   <img src="https://github.com/shadow-horse/Learning-resource/blob/master/practice/media/xposed_api_impored_201009201229.png" />  
   
4. 创建Android工程  
	1. 如果需要
5.    
   
参考链接：https://zhuanlan.zhihu.com/p/35003478  

