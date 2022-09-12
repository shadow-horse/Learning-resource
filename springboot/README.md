##  Spring boot Web项目  

### 1. 创建普通Maven工程
maven工程采用maven-archetype-quickstart   

### 2. 配置dependency

设置parent：  

   	<parent>
   	<groupId>org.springframework.boot</groupId>
    	<artifactId>spring-boot-starter-parent</artifactId>
    	<version>2.1.6.RELEASE</version>
   	</parent>

web依赖：

 	<dependency>
  	<groupId>org.springframework.boot</groupId>
  	<artifactId>spring-boot-starter-web</artifactId>
 	</dependency>

设置编译打包：

 	<build>
  	<plugins>
   	<plugin>
   		<groupId>org.springframework.boot</groupId>
    	<artifactId>spring-boot-maven-plugin</artifactId>
    	<!-- 指定mainclass -->
    	<configuration>
     	<mainClass>com.snowsec0.springshiro.App</mainClass>
    	</configuration>
    	<executions>
     	<execution>
     	<!-- 把依赖的包打包到生成的jar包中 -->
      	<goals>
       	<goal>repackage</goal>
      	</goals>
     	</execution>
    	</executions>
   	</plugin>
  	</plugins>
  	<defaultGoal>compile</defaultGoal>
 	</build> 

### 3. 设置启动入口

 	import org.springframework.boot.SpringApplication;
 	import org.springframework.boot.autoconfigure.SpringBootApplication;

 	@SpringBootApplication
 	public class App
 	{
     	public static void main( String[] args )
     	{
         	SpringApplication.run(App.class, args);
     	}
 	}

### 4. 设置rest api示例
 
 	import org.springframework.web.bind.annotation.PostMapping;
 	import org.springframework.web.bind.annotation.RequestBody;
 	import org.springframework.web.bind.annotation.RequestMapping;
 	import org.springframework.web.bind.annotation.RestController;

 	@RestController
 	@RequestMapping("hello2")
 	public class HelloController {
        	@RequestMapping("")
        	public String hello() {
               	return "helloworld2";
        	}
       
       	@PostMapping("/hello")
      	public Object login(@RequestBody Map<String,Object> map){
      	System.err.println(map.get("json"));
         	String str = (String) map.get("json");
         	return null;
   	}
 	}

至此简单的spring boot web示例完成   


### 5. 创建资源文件，生成配置文件

在项目src/main目录下创建资源目录：resources，在该目录创建application.yml文件，该文件为系统配置文件：

 	server:
    	port: 8080

### 5. 创建templates目录，创建页面

在引入页面时，在pom中引入thmleaf模板依赖：

 	<!-- thmleaf模板依赖. -->
  	<dependency>
   	<groupId>org.springframework.boot</groupId>
   	<artifactId>spring-boot-starter-thymeleaf</artifactId>
  	</dependency>

resources目录创建templates目录，创建页面：

 	<!—index.html -->
 	<!DOCTYPE html>
 	<html lang="en">
 	<head>
    	<meta charset="UTF-8">
    	<title>welcome</title>
 	</head>
  	<body>
   	欢迎登录网页 <a href=" ">点击退出</a >
  	</body>
 	</html>

在服务端代码通过return "filename"指定页面：

 	@RequestMapping(value = {"/", "/index"}, method = RequestMethod.GET)
    	public String index() {
        	return "index";
    	}

服务代码和页面之间传递参数，通过对象Model进行传递： 

 	@RequestMapping(value = "/login", method = RequestMethod.POST)
    public String loginPost(Model model, String username, String password) {
        if ("admin".equals(username) && "123456".equals(password)) {
            return "index";
        } else {
            model.addAttribute("msg", "登录失败");
            return "login";
        }
    }

 页面使用msg参数：
 	
 	<h5 th:text="'提示消息：'+${msg}"></h5>
 	<form action="login" method="post">
     <p>账号：<input type="text" name="username"/></p >
     <p>密码：<input type="text" name="password"/></p >
     <p><input type="submit" value="登录"/></p >
 	</form>
### 注意坑
#### 1. main类必须存在包名，不能直接放在src/main目录下  

## Shiro框架集成  

### 1.