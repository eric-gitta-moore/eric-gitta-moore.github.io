---
title: When nvm-windows switches node version, it prompts exit status 1 The system cannot find the path specified.
subtitle: When nvm-windows switches node version, it prompts exit status 1 The system cannot find the path specified.
date: 2022-04-01 16:53:03
toc: true
tags: 
categories: 
    - Default
---

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/85e161a177b14afa9db0fa69c5d15509.png)

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

Solution:

The reason is that the directory selected during installation does not exist. So we need to manually establish an NVM here to provide a soft connection

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/2cdb465df81044a99da3f5504e7c4eaa.png)