
## 破解APP加密传输的数据

### 1. 介绍

现在的很多APP在传输时都采用了自己的加密方式，对传输的报文进行了二次加密，例如AES、变种的Base64、hash签名等。在渗透时，如果无法破解出数据，则无法进行深入的渗透测试。  

### 2. 反编译APP

1. apktool d game.apk 反编译


### 参考链接

1. NDK .so Android调用JNI时，.so中函数申明涉及的package name和class name要一致： https://blog.csdn.net/fanenqian/article/details/77989238 
2. Android Studio调用.so时，需要和原有.so调用的app，编译的SDK和目标SDK一致，否则会导致loadlibrary失败：https://blog.csdn.net/Jeff_YaoJie/article/details/78664823
3. Android Studio调用.so：https://www.jianshu.com/p/27de58017a71
4. Android NDK端native方法动态JNI反射的so文件签名校验：https://www.52pojie.cn/thread-574215-1-1.html
5. 指令与HEX机器码：http://armconverter.com/hextoarm/conversions.php?p=99 
6. 在线查询HEX机器码:http://armconverter.com/hextoarm/ 