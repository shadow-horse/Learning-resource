## XSStrike检测逻辑分析 


### 1. DOM XSS检测逻辑

DOM XSS的检测逻辑比较简单，先通过正则检查是否存通过dom对象获取元素的的操作，例如通过document.url获取url参数，然后在检查是否存在通过dom对象操作页面元素或执行JS的函数调用。 如果同时满足，则认为该页面存在DOM XSS风险。  


1. 获取原始响应内容，通过正则获取script标签内容   
   

  		scripts = re.findall(r'(?i)(?s)< script[^>]*>(.*?)</script>', response)  

2. 设置sinkFound,sourceFound = False, False，检测标记    

  		sinkFound, sourceFound = False, False  

3. 对获取到的script脚本进行循环按行分析  

  		script = script.split('\n')  

4. 按照var变量拆分，获取“跟踪变量”的应用，将引用的变量加入“跟踪变量”的list中进行跟进  

  		parts = line.split('var ')
  		if controlledVariable in part：
   			controlledVariables.add(re.search(r'[a-zA-Z$_][a-zA-Z0-9$_]+', part).group().replace('$', '\$'))
      
5. 对获取脚本（行）进行正则匹配，检查是否存在sources检查点

  		sources = r'''document\.(URL|documentURI|URLUnencoded|baseURI|cookie|referrer)|location\.(href|search|hash|pathname)|window\.name|history\.(pushState|replaceState)(local|session)Storage'' 

  		pattern = re.finditer(sources, newLine)

6. 循环遍历正则获取的结果，如果存在：获取"匹配到的关键字",获取其对应的变量名称，放入“跟踪变量”的list中

  		controlledVariables.add(re.search(r'[a-zA-Z$_][a-zA-Z0-9$_]+', part).group().replace('$', '\$'))

7. 如果存在：设置sourceFound = True 

8. 对获取脚本（行）进行正则匹配：检查是否存在sinks检查点

  		sinks = r'''eval|evaluate|execCommand|assign|navigate|getResponseHeaderopen|showModalDialog|Function|set(Timeout|Interval|Immediate)|execScript|crypto.generateCRMFRequest|ScriptElement\.(src|text|textContent|innerText)|.*?\.onEventName|document\.(write|writeln)|.*?\.innerHTML|Range\.createContextualFragment|(document|window)\.location'''

  		pattern = re.finditer(sinks, newLine)  

9. 循环遍历正则结果：如果存在则设置sinkFound = True 

#### DOM XSS检测总结

### 2. 反射型XSS检测点信息收集  

1. 循环遍历参数，将参数替换为固定的特殊字符串xsschecker发送，获取响应

    

  		for paramName in params.keys():   
         		paramsCopy = copy.deepcopy(params)   
            		if encoding:  
                		paramsCopy[paramName] = encoding(xsschecker)  
            		else:   
                		paramsCopy[paramName] = xsschecker  
            
   		response = requester(url, paramsCopy, headers, GET, delay, timeout)   

2. 对响应送入htmlParser进行检测

3. 检查响应中是否存在xsschecker，返回计数reflections，此处查询包含不仅仅在script标签内的，也包含注释中的

  		reflections = response.count(xsschecker) 

4. 删除<!-- -->注释代码  

   		clean_response = re.sub(r'<!--[.\s\S]*?-->', '', response) 

 		script_checkable = clean_response  

5. 在extractScripts函数中，对净化的响应进行正则匹配，获取script代码片段集合，然后返回存在xsschecker字符串的script代码片段集合

  		def extractScripts(response):   
      		scripts = []   
      		matches = re.findall(r'(?s)<script.*?>(.*?)</script>', response.lower())   
      		for match in matches:   
         		if xsschecker in match:   
             		scripts.append(match)   
      		return scripts

6. 循环对script片段进行处理，通过正则截取以xsschecker开头的代码片段，判断xsschecker是否在引号内，并记录位置信息

  		occurences = re.finditer(r'(%s.*?)$' % xsschecker, script)  
        
  		position_and_context[thisPosition] = 'script'   
  		environment_details[thisPosition] = {}  
        		environment_details[thisPosition]['details'] = {'quote' : ''}

  		for i in range(len(occurence.group())):
            currentChar = occurence.group()[i]
            if currentChar in ('/', '\'', '`', '"') and not escaped(i, occurence.group()):
            	   environment_details[thisPosition]['details']['quote'] = currentChar
            elif currentChar in (')', ']', '}', '}') and not escaped(i, occurence.group()):
                  break
                  
7. 如果script代码中获取的xsschecker数量小于reflections，意味着在html标签中存在xsschecker，则在html中查询该xsschecker对应的属性： attr、value、flag  

		if len(position_and_context) < reflections:
         		attribute_context = re.finditer(r'<[^>]*?(%s)[^>]*?>' % xsschecker, clean_response)
         		for occurence in attribute_context:
             		match = occurence.group(0)
             		thisPosition = occurence.start(1)
             		parts = re.split(r'\s', match)
             		tag = parts[0][1:]
             		for part in parts:
                 		if xsschecker in part:
                     		Type, quote, name, value = '', '', '', ''
                     		if '=' in part:
                         		quote = re.search(r'=([\'`"])?', part).group(1)
                         		name_and_value = part.split('=')[0], '='.join(part.split('=')[1:])
                         		if xsschecker == name_and_value[0]:
                             		Type = 'name'
                         		else:
                             		Type = 'value'
                         		name = name_and_value[0]
                         		value = name_and_value[1].rstrip('>').rstrip(quote).lstrip(quote)
                     		else:
                         		Type = 'flag'
                     		position_and_context[thisPosition] = 'attribute'
                     		environment_details[thisPosition] = {}
                      		environment_details[thisPosition]['details'] = {'tag' : tag, 'type' : Type, 'quote' : quote, 'value' : value, 'name' : name}
    

  		if len(position_and_context) < reflections:
         		html_context = re.finditer(xsschecker, clean_response)
         		for occurence in html_context:
             		thisPosition = occurence.start()
             		if thisPosition not in position_and_context:
                 		position_and_context[occurence.start()] = 'html'
                 		environment_details[thisPosition] = {}
                 		environment_details[thisPosition]['details'] = {}




8. 最后检查标签外和注释中的xsschecker，获取检测的位置信息  


  		if len(position_and_context) < reflections:
         		comment_context = re.finditer(r'<!--[\s\S]*?(%s)[\s\S]*?-->' % xsschecker, response)
         		for occurence in comment_context:
             		thisPosition = occurence.start(1)
             		position_and_context[thisPosition] = 'comment'
             		environment_details[thisPosition] = {}
             		environment_details[thisPosition]['details'] = {}

9. 获取无法利用的输出点，获取对应标签中xsschecker的位置，标记badTag的类型  

  		bad_contexts = re.finditer(r'(?s)(?i)<(style|template|textarea|title|noembed|noscript)>[.\s\S]*(%s)[.\s\S]*</\1>' % xsschecker, response)
     		non_executable_contexts = []
     		for each in bad_contexts:
         		non_executable_contexts.append([each.start(), each.end(), each.group(1)])

10. 返回检查点的信息，包含：位置、context、标签类型、name等信息

  		{171208: {'position': 171208, 'context': 'html', 'details': {'badTag': 'style'}}, 182130: {'position': 182130, 'context': 'html', 'details': {'badTag': ''}}}
  		

### 3. 分析反射型XSS输出点获取逃逸字符

该步骤的目的比较简单，就是根据不同的注入点信息：context类型信息，在xsschecker中添加如不同的探测特殊字符；


1. 在获取到xsschecker的输出点信息occurences后，对输出点进行进一步的分析，在filterChecker函数中

  		efficiencies = filterChecker(
                		url, paramsCopy, headers, GET, delay, occurences, timeout, encoding)

2. filterChecker中第一步根据已经获取注入点的context类型，添加不同的特殊字符作为environment：主要是<、>、'、"、&lt;/scRipT/&gt;、-->、&amp;lt;&amp;gt; 插入xsschecker字符串中，作为探测的一部分；

  		for i in occurences:
         		occurences[i]['score'] = {}
          		context = occurences[i]['context']
         		if context == 'comment':
             		environments.add('-->')
         		elif context == 'script':
             		environments.add(occurences[i]['details']['quote'])
             		environments.add('</scRipT/>')
         		elif context == 'attribute':
             		if occurences[i]['details']['type'] == 'value':
                 		if occurences[i]['details']['name'] == 'srcdoc':  # srcdoc attribute accepts html data with html entity encoding
                     		environments.add('&lt;')  # so let's add the html entity
                     		environments.add('&gt;')  # encoded versions of < and >
             		if occurences[i]['details']['quote']:
                 environments.add(occurences[i]['details']['quote'])

3. 调用checker函数进行新xsschecker的发包探测，记录对应的位置信息

  		efficiencies = checker(
                		url, params, headers, GET, delay, environment, positions, timeout, encoding)

4. checker函数逻辑： 将上述的environment插入payload中，发送请求获取响应  

  		checkString = 'st4r7s' + payload + '3nd'

5. 在响应中查找payload字符串，获取起始位置信息，并记录至reflectedPositions

  		reflectedPositions = []
     		for match in re.finditer('st4r7s', response):
         		reflectedPositions.append(match.start())

6. 对原始的位置信息positions和新的位置信息reflectedPositions做处理，理论上位置信息的个数应该是一样的，但是难免存在测试字符导致响应出错或被过了，导致输出点变少，那么个数就对应不上，此处通过fileHoles函数对2者进行处理

  		filledPositions = fillHoles(positions, reflectedPositions)
  		
7. fillHoles中对positions和reflectedPositions进行处理，理论上原始的位置要小于新位置，当位置信息不相等，则意味着输出点缺少，则补充0，否则保存最新的位置信息

  		def fillHoles(original, new):
     		filler = 0
     		filled = []
     		for x, y in zip(original, new):
         		if int(x) == (y + filler):
             		filled.append(y)
         		else:
             		filled.extend([0, y])
             		filler += (int(x) - y)
     		return filled


8. 获取到位置信息后，通过查找响应中的xsschecker和原始注入的做对比，判断插入的特殊字符是否注入成功，是否存在逃逸，此处是通过fuzz.partial_ratio进行对比，返回相似性的数值，如果完全匹配上则为100

  		for position in filledPositions:
         		allEfficiencies = []
         		try:
             		reflected = response[reflectedPositions[num]
                 		:reflectedPositions[num]+len(checkString)]
             		efficiency = fuzz.partial_ratio(reflected, checkString.lower())          
             		allEfficiencies.append(efficiency)
         		except IndexError:
             		pass
         		if position:
             		reflected = response[position:position+len(checkString)]
             		if encoding:
                 		checkString = encoding(checkString.lower())
             		efficiency = fuzz.partial_ratio(reflected, checkString)         
             		if reflected[:-2] == ('\\%s' % checkString.replace('st4r7s', '').replace('3nd', '')):
                 		efficiency = 90
             		allEfficiencies.append(efficiency)    
             		efficiencies.append(max(allEfficiencies))            
         		else:
             		efficiencies.append(0)
         		num += 1

9. 返回每个payload逃逸的标记数值，和position位置相对应  

  		return list(filter(None, efficiencies)) 

10. 将探测逃逸逃逸字符的值记录至occurences基本信息中，并返回occurences

  		for environment in environments:
        
         		if environment:
             		efficiencies = checker(
                 		url, params, headers, GET, delay, environment, positions, timeout, encoding)
            
             		efficiencies.extend([0] * (len(occurences) - len(efficiencies)))
            
             		for occurence, efficiency in zip(occurences, efficiencies):
                 		occurences[occurence]['score'][environment] = efficiency

11. 最终的形式：  

  		{171208: {'position': 171208, 'context': 'html', 'details': {'badTag': 'style'}, 'score': {'<': 100, '>': 100}}, 182130: {'position': 182130, 'context': 'html', 'details': {'badTag': ''}, 'score': {'<': 100, '>': 100}}}	

### 4. 根据逃逸字符及注入点生成payloads

根据注入点的对象类型context：html、attribute、comment、script，生成不同的payload，此处先不做讲解，后续阐述；

例如生成的payload如下：

 		</styLE><DetaIlS/+/oNTOGGLe+=+(prompt)``%0dx>
 		</sTylE><A%09OnpoInteREntEr%0d=%0dconfirm()%0dx><>v3dm0s
 		<detAilS%0donPoinTERenTER%09=%09confirm()//


### 5. 对payloads进行遍历，验证是否存在反射型XSS

将生成的payload带入checker中，进行检测，获取输出点的检测结果（分值），如果大于等于90则认为存在XSS：  

  		efficiencies = checker(
         		url, paramsCopy, headers, GET, delay, vect, positions, timeout, encoding)
        		if not efficiencies:
         		for i in range(len(occurences)):
             		efficiencies.append(0)
        		bestEfficiency = max(efficiencies)
        		if bestEfficiency >= minEfficiency:
   		result['VerifyInfo'] = {}  


### 反射型 XSS总结  

1. thisPosition的位置记录不准确，存在冲突覆盖的场景  
2. 