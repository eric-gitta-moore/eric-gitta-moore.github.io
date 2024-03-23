---
title: How to change the search engine using the address bar search in 360 Browser
subtitle: How to change the search engine using the address bar search in 360 Browser
date: 2021-08-19 14:34:56
toc: true
tags: 
categories: 
    - Default
---

 ![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/20210819142052214.png)

 Like this, if you click the search button below at this moment, it will automatically redirect to 360's search engine.

This has been a frustrating issue for me for a long time. I've endured it, but today, I must address it.

The solution I thought of is to use hosts to redirect this domain name to localhost and then resolve it to our PHP. Inside PHP, we will redirect it to Baidu.

Here are the practical steps:

Download PHPStudy, use PHP7+ Nginx.

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/20210819142355456.png)

 Open phpStudy\PHPTutorial\nginx\conf\vhosts.conf

Enter the following:

```nginx
server {
        listen       80;
        listen       443;
        server_name  www.so.com ;
        root   "E:\PhpstormProjects\one";
        index  index.html index.htm index.php;
        
        

        ssl                  on;
        ssl_certificate      "ssl/et.pem"; # Note that here you can only use relative paths; absolute paths, even if correct, will still produce errors.
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

Then create an index.php in E:\PhpstormProjects\one with the following content:

```php
<?php

header('location: https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&tn=baidu&fenlei=256&oq=dd&rsv_pq=ea431c930002357f&rsv_t=1fe3kF4YRUhLugiJuNRgsrgy%2FUane1loUg%2Bllo7JkiANVk8A%2FjWkRwzseiY&rqlang=cn&rsv_enter=1&rsv_dl=ts_1&rsv_btype=t&inputT=962&rsv_sug3=3&rsv_sug1=3&rsv_sug7=100&rsv_sug2=1&prefixsug=dd&rsp=1&rsv_sug4=1145&wd='.$_GET['q']);
```

Finally, configure your hosts file:

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/20210819143249667.png)

 ![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/20210819143304804.png)

Then set it to start at boot (optional), which means switching to service mode:

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/2021081914343462.png)