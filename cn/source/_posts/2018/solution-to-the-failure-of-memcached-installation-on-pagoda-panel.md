---
title: 宝塔面板安装memcached失败的解决办法
subtitle: Solution to the failure of memcached installation on Pagoda Panel
date: 2018-02-23 23:17:32
toc: true
tags: 
categories: 
    - 默认

---


 问题描述：
 这个贴子[memcached1.5安装失败 - Linux面板 - 宝塔面板论坛](https://www.bt.cn/bbs/forum.php?mod=viewthread&tid=11080&extra=)



> 编译安装和极速安装都一样，云锁和阿里云盾都已经关闭，没有任何安全软件，selinux没开。下面是快安装完的日志（编译安装）


- /bin/mkdir -p '/usr/local/libmemcached/include/libmemcached'
- /usr/bin/install -c -m 644 libmemcached/memcached.h libmemcached/memcached.hpp libmemcached/util.h '/usr/local/libmemcached/include/libmemcached'
- /bin/mkdir -p '/usr/local/libmemcached/lib/pkgconfig'
- /usr/bin/install -c -m 644 support/libmemcached.pc '/usr/local/libmemcached/lib/pkgconfig'
- make[2]: Leaving directory `/root/libmemcached-1.0.18'


 [color=rgb(0, 147, 218) !important]复制代码
 重复安装了N多遍

 

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/d4efd20a5a074f32abf04190647dc2d9.png)



解决办法：
关闭云锁所有功能，

 

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/76d1a8c0aee09071e12bba486c4d7f84.png)



在远程客户端输入，停止云锁



- service yunsuo stop


 [color=rgb(0, 147, 218) !important]复制代码
 在宝塔面板首页，点击进程管理

 

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/2b001aa4a8a6faaf0739e461d44a4989.png)



把带有“yunsuo”和“aliyun”字样的进程全部结束



 

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/3f4187e62da8ffb19b6f0c4cef235bf7.png)



然后就可以安装了

本文转载：
宝塔面板安装memcached失败的解决办法
 http://www.xhkj5.com/forum.php?mod=viewthread&tid=10528&fromuid=1
 (出处: 讯幻网)