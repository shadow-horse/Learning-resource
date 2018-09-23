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
	1. 如果需要开发.so，则按需配置上述NDK的环境，创建Android工程时，选择include C++ support，否则只需要创建普通的Android Empty工程即可：  
	<img src="https://github.com/shadow-horse/Learning-resource/blob/master/practice/media/xposed_android_project_20180923936.png" />
	2. 按照上述2、3步骤配置NDK和导入以来的Jar包
	3. 在AndroidManifest.xml中配置meta-data，使其能被识别加载为xposed的插件  
	<img src="https://github.com/shadow-horse/Learning-resource/blob/master/practice/media/xposed_android_project_201809231125.png" />  
	4. 创建Hook类，该类是Xposed的入口类，用于拦截加载的package，在com.snow.xposed.HookClass包路径下创建MainXposed类实现IXposedHookLoadPackage类接口（见步骤五），然后在src/main目录下创建assets目录，在该目录中创建xposed_init文件，写入上面创建的Xposed的入口类，如下：  
	<img src="https://github.com/shadow-horse/Learning-resource/blob/master/practice/media/xposed_android_project_201809231144.png" />
	5. 编写MainXposed类，实现对加载package的拦截，打印日志 
	
			/**
		 	*  Xposed的入口类
 			*  2018.09.23
 			*/
			package com.snow.xposed.HookClass;
			
			import de.robv.android.xposed.IXposedHookLoadPackage;
			import de.robv.android.xposed.XposedBridge;
			import de.robv.android.xposed.callbacks.XC_LoadPackage;
			public class MainXposed implements IXposedHookLoadPackage{
			
			    public final static String TAG = "MainXposed";
			    @Override
			    public void handleLoadPackage(XC_LoadPackage.LoadPackageParam lpparam) throws Throwable {
			        //Log打印加载的App package
			        XposedBridge.log(TAG+"|"+"LoadPackageName:"+lpparam.packageName);
			    }
			}
	6. 编译生成APK
5.    
   
参考链接：   
	https://zhuanlan.zhihu.com/p/35003478  
	https://jayfeng.com/2017/05/17/Xposed%E5%BC%80%E5%8F%91%E5%AE%9E%E8%B7%B5/  


