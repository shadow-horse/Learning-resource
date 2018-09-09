## 实战练习破解计算器

### 1.初始环境

1. 在Mac上安装海马模拟器，用于调试运行APK。
2. 下载计算管家V3.4版本  

### 2.反编译、脱壳APK
1. 使用apktool工具，反编译apk，获取到smali源代码：apktool d *.apk 
2. 反编译后，发现该APK是被加固过的，因为smali下面就一个类名：com.qihoo.util.StubApplication，360加固
### 3.360脱壳
1. 加固的常规套路：把源代码程序通过加密操作然后隐藏到一个地方，隐藏的地方通常为assets目录、libs目录、自己的dex文件中
2. 这里的壳Application在attachBaseContext中做了一些初始化操作，一般将assets目录中的so文件拷贝到程序的沙盒目录:/data/data/xxx/files/...；然后再用system.load加载
3. 反编译apk，出现错误：Could not write to (../apktool/framework)，using /var/folders/gj/jy9gl3xj4bz928mvgqvc2kq80000gn/T/ instead...
  
  在提示目录建立文件夹，并chmod 777  

4. 