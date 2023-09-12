---
title: nvm-windows切换node版本提示exit status 1 The system cannot find the path specified.
subtitle: When nvm-windows switches node version, it prompts exit status 1 The system cannot find the path specified.
date: 2022-04-01 16:53:03
toc: true
tags: 
categories: 
    - 默认
---

#  **nvm-windows切换node版本提示exit status 1: The system cannot find the path specified.**


![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/85e161a177b14afa9db0fa69c5d15509.png)

```bash
D:\Users\th>nvm uninstall 16.14.2
Uninstalling node v16.14.2... done
D:\Users\th>nvm install lts
Downloading node.js version 16.14.2 (64-bit)...
Extracting...
Complete


Installation complete. If you want to use this version, type

nvm use 16.14.2

D:\Users\th>nvm use 16.14.2
exit status 1: The system cannot find the path specified.

D:\Users\th>nvm use 16.14.2
exit status 1: The system cannot find the path specified.

D:\Users\th>nvm use 16.14.2
Now using node v16.14.2 (64-bit)
```


解决方案：

原因是在安装时候选的那个目录不存在。所以这里要手动去建立一下nvm才能给软连接过去

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/2cdb465df81044a99da3f5504e7c4eaa.png)