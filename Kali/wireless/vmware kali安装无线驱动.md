## vmware kali安装usb wlan无线驱动

Kali安装无线网卡驱动的核心在以下2点：

1. 安装Kali头文件
2. 安装无线网卡驱动

### 1.  vmware设置共享USB无线网卡

​	**1. 在虚拟机中显示所有USB输入设备**

​		 在虚拟机设置中USB控制器中勾选“显示所有USB设备”

​		 ![https://raw.githubusercontent.com/shadow-horse/Learning-resource/master/Kali/wireless/img/vm1.png](https://raw.githubusercontent.com/shadow-horse/Learning-resource/master/Kali/wireless/img/vm1.png)

​	**2. 启动虚拟机后在可移动设备中kali连接usb无线设备**

​		在 虚拟机 => 可移动设备 选择usb无线设备，连接至kali虚拟机中

### 2. 安装Kali头文件

首先更新Kali源：   

`sudo apt-get update`

`sudo apt-get -y dist-upgrade`

安装kali头文件：

`apt install linux-headers-$(uname -r)`

在安装头文件时如果遇见错误，如头文件资源不存在，则可以通过上述命令更新后重启系统

### 3. 安装驱动文件

通过`ifconfig`检查wlan0是否存在，如果存在则无需安装无线网卡驱动；  

查看USB无线网卡信息：  

`apt install usbutils`

`lsusb`

通常USB无线网卡显示的芯片信息不定存在名称中，如：  

	root@kali:~# lsusb
	Bus 001 Device 002: ID 0bda:c811 Realtek Semiconductor Corp. 802.11ac NIC
	Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
	Bus 002 Device 003: ID 0e0f:0002 VMware, Inc. Virtual USB Hub
	Bus 002 Device 002: ID 0e0f:0003 VMware, Inc. Virtual Mouse
	Bus 002 Device 001: ID 1d6b:0001 Linux Foundation 1.1 root hub
但是有的就一目了然，如下面USB ID信息0bda:8812对应的芯片信息为RTL8812AU：   

	root@NanoPi-NEO2:~*# lsusb* 
	Bus 008 Device 001: ID 1d6b:0001 Linux Foundation 1.1 root hub 
	Bus 005 Device 004: ID 0bda:8812 Realtek Semiconductor Corp. RTL8812AU 802.11a/b/g/n/ac WLAN Adapter
对于无法直接获取芯片型号信息的，可以通过usb id查询获取：  

[USB ID Database](https://the-sz.com/products/usbid/index.php)

查询到后，可通过芯片型号信息在官网或Google查询是否有对应的Linux驱动

### 4. 编译安装驱动

安装编译驱动，选择的是rtl8821CU，将代码下载本地进行运行安装

https://github.com/brektrou/rtl8821CU 

```
sudo apt update
sudo apt install build-essential git dkms
git clone https://github.com/brektrou/rtl8821CU.git
cd rtl8821CU
chmod +x dkms-install.sh
sudo ./dkms-install.sh
```

在build过程中遇见问题，需要查看详细的log日志，里面会提示详细的错误，例如在安装时就因缺少`bc`命令： 

`apt-get install bc`

解决完依赖问题，重新build  

载入编译的USB无线网卡模块，无线网卡即可工作：

`sudo modprobe 8821cu`

通过`iwconfig`检查无线网卡状态

















