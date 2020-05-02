# Docker搭建漏洞环境指导  

基于Docker搭建漏洞验证环境操作指导  

## 1. 创建本地Docker镜像

本次的示例是通过ubuntu基础镜像，安装配置Java环境，并重新打包为本地docker镜像，实现镜像的保存、导入、删除、运行。  

### 1. 安装基础镜像ubuntu  

在创建docker基础镜像时，通常会选择一个基础镜像，在基础镜像上进行修改和配置，增加自己需要的运行环境，重新打包为docker镜像，以后直接使用自行打包的docker镜像。  

 	docker run -it ubuntu 

命令执行完成后，我们会直接进入docker的bash终端，干净的ubuntu中是不存在jdk的，运行以下命令检查：  
 
 	java -version
 
 	bash: java: Command not found

### 2. 进入ubuntu镜像shell安装JDK

 	apt-get install default-jdk   //安装jdk
 
 	java -version   //检查安装的版本
 	whereis java    //获取安装的路径
 
 	JAVA_HOME=/usr/bin/java;export JAVA_HOME  //配置java_home环境变量  
 	echo $JAVA_HOME   //检查环境变量结果
	
 	exit  //退出docker ubuntu shell 容器 

### 3. docker commit 创建本地镜像  

通过docker ps -a 找到ubuntu镜像的唯一ID，在以下命令中替换ID值。  

使用commit命令将容器里的所有修改提交到本地库中，形成以一个全新的镜像，会返回新镜像的完整ID:  

 	docker commit -m "ubuntu jdk" ID vulenv/locubuntu:jdk

 
 1. 完整ID可以通过docker ps -l -q(用于获取最近创建的容器ID)命令得到   
 2. -m：描述我们此次创建image的信息   
 3. --author：用来指定作者  
 4. ID：被修改的基础镜像ID  
 5. vulenv/locubuntu:jdk ：仓库名/镜像名:TAG名

通过docker pimages查看创建的本地镜像：  
 
 	docker images 

### 4. docker save 导出保存本地镜像 

 	docker save -o vulenv-locubuntu-jdk.tar vulenv/locubuntu:jdk  

1. -o：指定保存的镜像的名字，vulenv-locubuntu-jdk.tar  
2. vulenv/locubuntu:jdk ： 要保存的镜像名称  
3. 导出镜像默认在当前目录下

### 4. docker load导入本地镜像  

在该环境下需要先删除已有的镜像：  

 	docker rmi -f ID   //删除已有的镜像   
   
 	docker images     //检查镜像是否删除  


导入本地镜像：  

 	docker load --input vulenv-locubuntu-jdk.tar 

 
 
### 5. docker start 运行镜像  

 	docker start ID 
 	docker exec -it ID  

 	java -version //检查java
 
 	docker run -it vulenv/locubuntu:jdk  //直接进入bash  

## 2. Dockerfile创建镜像  

本示例基于本地镜像vulenv/locubuntu:jdk，创建tomcat-examples漏洞镜像。  

### 1. Dockfile详解  

从`docker commit`创建本地镜像可以了解到，镜像的定制实际上就是定制每一层所添加的配置、文件。我们将每一层的修改、安装、构建、操作命令写入一个脚本，使用这个脚本来构建、定制镜像，那么我们就可以解决无法重复使用、镜像透明性、体积等问题，这个脚本就是Dockfile.  

Dockerfile 是一个文本文件，其内包含了一条条的 指令(Instruction)，每一条指令构建一层，因此每一条指令的内容，就是描述该层应当如何构建。

指令格式：  
 1. 注释和指令注释以井号开头，后面跟上信息  
 2. 指令以大写的指令名开头，后面跟上参数  


 	FROM：指定基础镜像，必须为第一个命令 
  		FROM <IMAGE>
  		FROM <IMAGE>:<TAG>

 	MAINTAINER: 维护者信息，所有者和联系人信息
  		MAINTAINER <NAME> <email>  

 	RUN：构建镜像时执行的命令
  		RUN <command> (shell模式)
  		RUN [ "executable", "param1", "param2" ] (exec模式)
  		RUN yum install httpd && yum install ftp //这样构建减少产生中间层镜像  

 	ADD：将本地文件添加到容器中，tar类型文件会自动解压(网络压缩资源不会被解压)，可以访问网络资源，类似wget

 	COPY：功能类似ADD，但是是不会自动解压文件，也不能访问网络资源

 	CMD：构建容器后调用，也就是在容器启动时才进行调用，提供容器运行的默认指令

 	ENTRYPOINT：格式和RUN指令格式一样，目的和CMD一样，都是指定容器启动程序及参数，ENTRYPOINT在运行时也可以替代，通过 docker run --entrypoing指定，当指定了ENTRYPOINT后，CMD的含义就发生了变化，不再是直接的运行其命令，而是将CMD的内容作为参数传给ENTRYPOINT，实际执行为：
  		<ENTRYPOINT> "<CMD>"  //适合动态给命令添加参数
  
 	VOLUME：用于向容器添加卷，可以提供共享存储等功能  
  		VOLUME /data
	
 	ENV：设置环境变量，以便其它地方引用，规则和shell一致

 	EXPOSE：指定于外界交互的端口，运行该镜像的容器使用的端口，可以是多个，EXPOSE只是声明端口，并不会自动打开，运行时需要-p指令完成端口映射
  		EXPOSR <PORT>

 	WORKDIR：工作目录，类似于cd命令，在该目录下执行 

 	ONBUILD：是一个特殊的指令，它后面跟的是其它指令，比如 RUN, COPY 等，而这些指令，在当前镜像构建时并不会被执行。只有当以当前镜像为基础镜像，去构建下一级镜像的时候才会被执行
 
### 2. 下载原生tomcat  

创建tomcat-examples目录，下载原生Tomcat（linux版本）,解压，重命名为apache-tomcat，放置在tomcat-examples目录下     

### 3. 创建Dockerfile文件

在tomcat-examples目录下，创建Dockerfile文件，其在内容如下： 

 	# 选定基础镜像，此处为本地环境中的vulenv/locubuntu:jdk
 	FROM vulenv/locubuntu:jdk
 	# 设置auther信息  
 	MAINTAINER yuanjunhu/11087568
 	# 切换root用户
 	USER root
 	# 将tomcat容器复制到容器中
 	ADD ./apache-tomcat /opt/apache-tomcat
 	
 	WORKDIR /opt/apache-tomcat
 	# 运行命令，增加sh执行权限
 	RUN cd /opt/apache-tomcat/ && \
     	chmod +x ./bin/*.sh
 	# 默认命令，启动容器即启动tomcat
 	# 此处为了保证持续运行，要求以前台形式运行，不能使用startup.sh
 	# 对于容器而言，其启动程序就是容器应用进程，容器就是为了主进程而存在的，主进程退出，容器就失去了存在的意义，从而退出
 	CMD ["/opt/apache-tomcat/bin/catalina.sh","run"]

 
### 4. 构建镜像  

构建镜像最好在Dockerfile当前目录，否则需要指定Dockerfile具体目录

 	docker build -t tomcat:examples . 

 	[root@orphan-10-101-99-72 tomcat-examples]# docker build -t tomcat:examples .
 	Sending build context to Docker daemon  15.01MB
 	Step 1/7 : FROM vulenv/locubuntu:jdk
   		---> 4ad73720fb65
 	Step 2/7 : MAINTAINER yuanjunhu/11087568
   		---> Running in 7714e911fc3a
 	Removing intermediate container 7714e911fc3a
   		---> b48150f09fa3
 	Step 3/7 : USER root
   		---> Running in f85b8827e3a2
 	Removing intermediate container f85b8827e3a2
   		---> a81aaa47aa95
 	Step 4/7 : ADD ./apache-tomcat /opt/apache-tomcat
   		---> f85ca46c4b4c
 	Step 5/7 : WORKDIR /opt/apache-tomcat
   		---> Running in 6a161190cda2
 	Removing intermediate container 6a161190cda2
   		---> 9f0af6d6a406
 	Step 6/7 : RUN cd /opt/apache-tomcat/ &&     chmod +x ./bin/*.sh
   		---> Running in eac17ff2cfd5
 	Removing intermediate container eac17ff2cfd5
   		---> 5e94bd6d118b
 	Step 7/7 : CMD ["/opt/apache-tomcat/bin/catalina.sh","run"]
   		---> Running in 06d8a7f14f29
 	Removing intermediate container 06d8a7f14f29
   		---> bcbda97e64f5
 	Successfully built bcbda97e64f5
 	Successfully tagged tomcat:examples
 
### 5. 启动镜像  

通过后台启动镜像，docker run -d 

 	[root@orphan-10-101-99-72 tomcat-examples]# docker run -d -p 8088:8080 tomcat:examples
 	194c99120c941fefb5bc9d442bf40439d39f2839eae2242ae1c6d8ece2bd8091
 	[root@orphan-10-101-99-72 tomcat-examples]# docker ps
 	CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
 	194c99120c94        tomcat:examples     "/opt/apache-tomcat/…"   6 seconds ago       Up 5 seconds        0.0.0.0:8088->8080/tcp   clever_mirzakhani

 	//进入docker检查tomcat是否启动
 	[root@orphan-10-101-99-72 tomcat-examples]# docker ps
 	CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              	PORTS                    NAMES
 	194c99120c94        tomcat:examples     "/opt/apache-tomcat/…"   6 seconds ago       Up 5 	seconds        0.0.0.0:8088->8080/tcp   clever_mirzakhani
 	[root@orphan-10-101-99-72 tomcat-examples]# docker exec -it 194c99120c94 /bin/bash
 	root@194c99120c94:/opt/apache-tomcat# ps -ef
 	UID        PID  PPID  C STIME TTY          TIME CMD
 	root         1     0  1 21:11 ?        00:00:07 /usr/bin/java 	-Djava.util.logging.config.file=/opt/apache-tomcat/conf/logging.p
 	root        52     0  0 21:18 pts/0    00:00:00 /bin/bash
 	root        59    52  0 21:18 pts/0    00:00:00 ps -ef

 
### 6. 外网访问

 	http://127.0.0.1:8088/   //在docker启动后，访问存在延迟  


## 3. Docker-Compose管理镜像