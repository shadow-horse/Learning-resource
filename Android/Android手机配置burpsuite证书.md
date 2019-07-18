## Android手机配置burpsuite证书操作 

### 1. 说明

从Android Q版本开始，已经不能通过用户导入burpsuite证书拦截App的请求，应用App的请求默认不再信任用户安装的证书，除非另有说明，否则默认只信任系统证书。   

### 2. 安装系统级证书 

在手机上查看系统证书： Settings -> Security -> Trusted Credentials  

1. 将手机root，但是目前大部分手机很难root  
2. 导出burpsuite证书，以DER格式导出证书  
3. 转换证书格式，将der格式转换为pem格式：   

		openssl x509 -inform DER -in cacert.der -out cacert.pem

4. Android 的受信任 CA 以特殊格式存储在 / system/etc/security/cacerts，需要将pem格式的证书保存为hash命名方式，以0结尾  

		openssl x509 -inform PEM -subject_hash_old -in cacert.pem |head -1  
		>9a5ba575
		mv cacert.pem 9a5ba575.0

5. 将证书复制到设备，并修改权限

		adb remount 
		adb push 9a5ba575.0 /system/etc/security/cacerts/  
		adb reboot 
6. 重启设备，WIFI设置代理即可访问  


### 3. 修改并重新打包APK

1. 在源码res目录下新建xml目录，增加network_security_config.xml文件 

	工程名/app/src/main/res/xml/network_security_config.xml  
 	network_security_config.xml文件内容为：  

		<network-security-config>
		<base-config cleartextTrafficPermitted="true">

		<trust-anchors>
		<certificates src="system" overridePins="true" />
		<certificates src="user" overridePins="true" />
		</trust-anchors>

		</base-config>

		</network-security-config>

 说明：certificates说明的src="system"表示信任系统的CA证书，src="user"表示信任用户导入的CA证书
		
 
2. 修改项目的AndroidManifest.xml文件，在application中增加android:networkSecurityConfig="@xml/network_security_config"

		<?xml version="1.0" encoding="utf-8"?>
		<manifest ... >
		<application android:networkSecurityConfig="@xml/network_security_config"
		... >
		...
		</application>
		</manifest>

	说明：android:networkSecurityConfig的值指向的就是上一步创建的xml文件
 

3. 重新打包APK，导入CA证书