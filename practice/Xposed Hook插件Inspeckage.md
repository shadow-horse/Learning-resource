## Xposed Hook插件Inspeckage

在前面一篇已经介绍了Xposed的开发环境配置，在进行Xposed插件开发前，我们要清楚利用Xposed框架实现什么样的功能诉求？  
通常在APK的渗透测试时，我们比较关心的是APP的安全防护，如Root检测、签名实现、加解密实现以及核心业务对客户端数据的篡改等。此时，我们需要通过结合Androidkiller反编译源码分析，以及动态调用，找到关键实现，然后再对关键实现进行Hook调试。  

### 1. Inspeckage插件
