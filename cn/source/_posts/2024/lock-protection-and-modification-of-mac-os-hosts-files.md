---
title: Mac OS hosts 文件的锁定保护及修改
subtitle: Lock protection and modification of Mac OS hosts files
date: 2024-04-09 21:56:17
toc: true
tags: 
categories: 
    - 默认
---

### 锁死hosts文件
```shell
sudo chflags uchg /etc/hosts
sudo chflags schg /etc/hosts
```

### 解锁hosts文件
```shell
sudo chflags -hv noschg /etc/hosts
```
