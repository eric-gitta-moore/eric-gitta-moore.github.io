---
title: npm ERR! code ERR_INVALID_URL, npm err installation error
subtitle: npm ERR! code ERR_INVALID_URL, npm err installation error
date: 2021-09-07 22:39:01
toc: true
tags: 
categories: 
    - Default
---

```
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm i
npm ERR! code ERR_INVALID_URL
npm ERR! Invalid URL

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\TianhaoLTD\AppData\Local\npm-cache\_logs\2021-09-07T14_35_31_016Z-debug.log
```

After checking, it was found that the proxy settings were incorrect and a protocol header needs to be added

```
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config get proxy
127.0.0.1:10809
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config delete proxy
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config delete https-proxy
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config set  proxy http://127.0.0.1:10809
(nodeenv) PS E:\WebstormProjects\node-onebot-1.3-final-2> npm config set  https-proxy http://127.0.0.1:10809
```