## STRIDE威胁建模 
威胁建模是一个不断循环的动态模型，随着时间的推移不断变更，以适应新的威胁与攻击，并且能够适应应用程序，适应业务变更而不断完善与更改的自然发展过程。   

### 1. STRIDE威胁建模简史
STRIDE威胁建模是由微软提出的一种威胁建模方法，2004年微软公司就已经从流程管理、技术措施、人员组织和考量指标四个方面清晰的定义了威胁建模能力。  
![](https://github.com/shadow-horse/Learning-resource/blob/master/STRIDE/img/timeline.png)

威胁建模是一套方法理论以及工程实践，通常会使用威胁建模工具协助完成整个分析过程。  

### 2. STRIDE威胁类型 

STRIDE威胁模型将威胁类型划分为6种：  

- Spoofing(仿冒)  
- Tampering（篡改）  
- Repudiation(抵赖)
- Information Disclosure（信息泄露）  
- Denial of Service（拒绝服务）  
- Elevation of Privilege（权限提升）  
![](https://github.com/shadow-horse/Learning-resource/blob/master/STRIDE/img/stride.png)

这六种威胁几乎涵盖了目前绝大部分安全问题。威胁建模的成果跟工作者自身的安全知识能力有很大关系，有攻防经验的人比较容易判断威胁的来源和利用场景。有些风险的利用场景是很少或者利用条件比较苛刻，不能一味地强调风险消减措施否则会变得有点纸上谈兵的味道。  

	很多安全从业者所接受的安全认知往往是进入一家企业后，看过一些应用安全开发安全标准的文档或要求，里面描述了访问控制、输入验证、编码过滤、输出编码、认证鉴权、加密、日志记录等各种要求，久而久之就变成了一种惯性思维，动不动就很多场景要做加密、鉴权，实际上之所以这么做是因为在系统设计的某个环节存在STRIDE中的一种或几种风险，所以在那个设计点上加入对应的安全措施，并不是在所有的地方都要套用全部或千篇一律的安全措施，否则就会变成另外一种结果：“过度的安全设计”；  

###参考

http://blog.nsfocus.net/threat-modeling/  