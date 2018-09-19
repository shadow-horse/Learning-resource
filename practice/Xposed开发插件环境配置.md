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
	1. File -> Project Structure 中添加Android NDK location:  
	 
	2. 
3. 配置Xposed api





参考链接：https://zhuanlan.zhihu.com/p/35003478  

