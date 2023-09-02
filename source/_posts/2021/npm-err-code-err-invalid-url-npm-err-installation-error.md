---
title: npm ERR! code ERR_INVALID_URL,npm err安装报错
subtitle: npm ERR! code ERR_INVALID_URL, npm err installation error
date: 2021-09-07 22:39:01
toc: true
tags: 
categories: 
    - 默认
---

 

```
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm i
npm ERR! code ERR_INVALID_URL
npm ERR! Invalid URL

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\TianhaoLTD\AppData\Local\npm-cache\_logs\2021-09-07T14_35_31_016Z-debug.log
```


查了一下发现是代理设置错误了，需要添加协议头

```
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config get proxy
127.0.0.1:10809
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config delete proxy
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config delete https-proxy
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config set  proxy http://127.0.0.1:10809
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config set  https-proxy http://127.0.0.1:10809
```