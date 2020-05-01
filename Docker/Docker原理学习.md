# Docker原理学习

Docker学习材料：  [https://yeasy.gitbooks.io/docker_practice/](https://  yeasy.gitbooks.io/docker_practice/ "Docker — 从入门到实践")  

Dockerhub：[https://hub.docker.com/_/ubuntu?tab=tags](https://hub.docker.com/_/ubuntu?tab=tags "DockerHub")   

加速器：  
[https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors "阿里云加速器")   

[https://www.daocloud.io/mirror](https://www.daocloud.io/mirror "DaoCloud加速器")


## Docker简介   

### 什么是Docker  

Docker 使用 Google 公司推出的 Go 语言 进行开发实现，基于 Linux 内核的 cgroup(linux内核功能，限制、控制与分离一个进程的资源，如CPU、内容、磁盘、输入输出等)，namespace（linux内核功能，内核资源区分，同组资源和进程具有相同的命名空间），以及 OverlayFS 类的 Union FS 等技术，对进程进行封装隔离，属于 操作系统层面的虚拟化技术。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。    

Docker联合文件系统Union File System，它是实现Docker镜像的技术基础，是一种轻量级的高性能分层文件系统，支持将文件系统中的修改进行提交和层层叠加，这个特性使得镜像可以通过分层实现和继承。同时支持将不同目录挂载到同一个虚拟文件系统下。  

联合文件系统， 简单来说就是“支持将不同目录挂载到同一个虚拟文件系统下的文件系统”, AUFS支持为每一个成员目录设定只读(Rreadonly)、读写(Readwrite)和写(Whiteout-able)权限。   
当Docker在利用镜像启动一个容器时，Docker镜像将分配文件系统，并且股灾一个新的可读可写的层给容器，容器会在这个文件系统中创建，并且这个可读可写的层被添加到镜像。   
想要从一个Image启动一个Container，Docker会先逐次加载其父Image直到Base Image，用户的进程运行在Writeable的文件系统层中。所有父Image中的数据信息以及ID、网络和LXC管理的资源限制、具体container的配置等，构成一个Docker概念上的Container。