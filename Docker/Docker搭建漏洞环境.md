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
 		ENV DEBIAN_FRONTEND=noninteractive  //设置非交互式

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

### 1. Docker-compose简介

我们知道通过Dockerfile模板文件可以快速的构建一个单独的容器，但是在实际应用中经常需要多个容器配合完成某项任务，例如Web项目，除了web服务容器本身外，往往还需要再加上数据库服务容器，甚至还包括负载均衡器等。   

Compose恰好满足了这样的需求，它允许用户通过一个单独的docker-compose.yml模板文件来定义一组相关联的应用容器为一个项目。  

Compose中有2个重要的概念：  
	
	1. 服务（services）：一个应用的容器，实际上可以包含若干个运行相同镜像的容器示例 
	2. 项目（project）：由一组关联的应用容器组成一个完成的业务单元， compose默认管理对象是项目，通过子命令对项目中的一组容器进行便捷的生命管理

 
### 2. docker-compose常用命令

	docker-compose [-f=<arg>...] [options] [COMMAND] [ARGS...]
	docker-compose help [COMMAND] 
	
对compose而言，大部分命令的对象既可以是项目本身，也可以指定为项目中的服务或容器，如果没有特别说明，命令的对象将是项目，意味着项目中的所有服务都会受到影响。  

命令选项：  

- -f, --file FILE指定使用的compose模板文件，默认docker-compose.yml  
- -p, --project-name NAME指定项目名称，默认将所在目录作为项目名
- --x-networking 使用Docker的可插拔网络后端特性  
- --x-network-driver DRIVER指定网络后端的驱动，默认bridge
- --version 输出更多调试信息
- -v, --version打印版本退出

1. build   

		docker-compose build  //重新构建服务
2. config
	
		docker-compose config  //验证文件格式是否正确
3. down 

		docker-compose down   //此命令将停止up命令所启动的容器，并移除网络
4. exec 

		docker-compose exec   //进入指定容器
5. images
	
		docker-compose images  //列出compose文件中的镜像
6. ps 

		docker-compose ps    //列出项目中目前的所有容器
7. pull

		docker-compose pull  //拉去服务依赖的镜像
		
8. restart | start | stop

		docker-compose restart //重启项目中的服务
		docker-compose start  //启动已经存在的服务
		docker-compose stop  //停止已经运行的服务
		
9. rm 

		docker-compose rm -f   //删除停止状态的服务容器，优先通过docker-compose stop命令停止容器
		
10. run 

		docker-compose run ubuntu ping docker.com  //在指定服务上执行一个命令
11. up

		docker-compose up //该命令强大，自动完成构建镜像，创建服务，启动服务，并关联相关容器一系列内容，默认启动都在前台，需要使用-d指定后台运行  
		
### 3. Compose模板文件
模板文件是使用Compose的核心，涉及的指令关键字比较多，大部分指令根docker run相关参数的含义类似。  

	version: '2'
	services:
  		#定义的服务
  		#单个服务的名称
  		db:    
  			#使用的镜像                      
    		image: mariadb:10.1   
    		#设置镜像的环境变量，可通过dockerhub查询镜像的环境变量    
    		environment:
      			MYSQL_ROOT_PASSWORD: "root"
      			MYSQL_DATABASE: "app"
      			MYSQL_USER: "app"
      			MYSQL_PASSWORD: "123123"
    		#数据卷挂在的路径设置，支持设置宿主机路径或者数据卷名称，一级访问模式，以下为数据卷名称示例
    		volumes:
      			- db:/var/lib/mysql
  	   	php:
  	   		#指定构建Docker镜像
    		build:
      		context: ./services/php
      		dockerfile: Dockerfile
    		volumes:
      			- ./app:/mnt/app
  	  	web:
    		image: nginx:1.11.1
    		ports:
      			- "8080:80"
    		depends_on:
      			- php
    		volumes_from:
      			- php
    		volumes:
      			- ./services/web/config:/etc/nginx/conf.d
  		phpmyadmin:
    		image: phpmyadmin/phpmyadmin
    		ports:
      			- "8081:80"
    		environment:
      			PMA_HOST: "db"
      			PMA_USER: "root"
      			PMA_PASSWORD: "root"
	volumes:
  		db:
    		driver: local


**volumes详解：**   
Docker默认的数据读写发生在容器的存储层，当容器被删除时其上的数据将会丢失，应当尽量保证容器存储层不发生写操作。Volumes（数据卷）是可供一个或多个容器使用的位于宿主机上的特殊目录，拥有以下特性：  
1. 数据卷可以在容器间共享和重用  
2. 对数据卷的写操作不会有任何影响
3. 数据卷会默认存在

	1. docker volume ps  //查看数据卷 
	2. docker volume inspect VOLUMENAME  //查看具体信息
	
### 4. DVWA环境搭建
基础环境采用公共服务，如果配置在各个项目中，则会单独启动各个服务，浪费资源。  

1. 搭建公共MySQL数据库：docker-compose.yml     
	
		version: '2'

		services:
  		#公共开放mysql数据库，供所有项目使用
  		mysql:
    		image: mariadb:10.1
    		environment:
      			MYSQL_ROOT_PASSWORD: "root!@#
      			MYSQL_DATABASE: "mysql"
      			MYSQL_USER: "mysql"
      			MYSQL_PASSWORD: "mysqlpwd"
    		ports:
      			- "3306:3306"
    		volumes:
      			- db:/var/lib/mysql

		volumes:
  			db:
    		driver: local


2. 搭建公共Apache+php环境：docker-compose.yml
	
	
	
3. 


	


		

