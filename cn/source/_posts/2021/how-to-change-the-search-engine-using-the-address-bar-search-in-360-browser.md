---
title: 360浏览器用地址栏搜索怎么更改搜索引擎
subtitle: How to change the search engine using the address bar search in 360 Browser
date: 2021-08-19 14:34:56
toc: true
tags: 
categories: 
    - 默认
---


 ![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/20210819142052214.png)

 就像这样，如果这时候点击下面的搜索，那么就会自动跳转到360的搜索引擎。

如此坑，困扰我好久了，我都忍了，今天非搞它一下不可。

我想到的办法是用hosts把这个域名重定向到本地，再解析到咱们的php，到php里面重定向到百度

方法有了下面实操

下载phpstudy，采用php7+nginx

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/20210819142355456.png)





 打开phpStudy\PHPTutorial\nginx\conf\vhosts.conf

输入下面

```
server {
        listen       80;
        listen       443;
        server_name  www.so.com ;
        root   "E:\PhpstormProjects\one";
		index  index.html index.htm index.php;
		
		

        ssl                  on;
        ssl_certificate      "ssl/et.pem";#注意这里只能用相对路径，绝对路径就算是对的也会报错
        ssl_certificate_key  "ssl/et.key";

        ssl_session_timeout  5m;
        ssl_protocols  SSLv2 SSLv3 TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_prefer_server_ciphers   on;
		
		
		
        location ~ \.php(.*)$ {
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_split_path_info  ^((?U).+\.php)(/?.+)$;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            fastcgi_param  PATH_INFO  $fastcgi_path_info;
            fastcgi_param  PATH_TRANSLATED  $document_root$fastcgi_path_info;
            include        fastcgi_params;
        }
		
		location / {
			if (!-e $request_filename){
				rewrite  ^(.*)$  /index.php?s=$1  last;   break;
			}
		}
}
```



然后创建一个index.php到E:\PhpstormProjects\one

内容为

```php
<?php

header('location: https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&tn=baidu&fenlei=256&oq=dd&rsv_pq=ea431c930002357f&rsv_t=1fe3kF4YRUhLugiJuNRgsrgy%2FUane1loUg%2Bllo7JkiANVk8A%2FjWkRwzseiY&rqlang=cn&rsv_enter=1&rsv_dl=ts_1&rsv_btype=t&inputT=962&rsv_sug3=3&rsv_sug1=3&rsv_sug7=100&rsv_sug2=1&prefixsug=dd&rsp=1&rsv_sug4=1145&wd='.$_GET['q']);
```



最后再设置下hosts

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/20210819143249667.png)

 ![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/20210819143304804.png)



 然后设置开机启动（不设置也可以）

也就是改成服务模式

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/2021081914343462.png)