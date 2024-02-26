---
title: Solution to the failure of memcached installation on Pagoda Panel
subtitle: Solution to the failure of memcached installation on Pagoda Panel
date: 2018-02-23 23:17:32
toc: true
tags: 
categories: 
    - Default

---

Problem Description:
This post discusses the installation failure of memcached 1.5 on Linux panels. [Link to the forum post](https://www.bt.cn/bbs/forum.php?mod=viewthread&tid=11080&extra=)

> Both compiling and installing are the same. Cloud Lock and Alibaba Cloud Shield are both turned off. There is no security software, and SELinux is not enabled. Below is the log after a quick installation (compilation installation).

- /bin/mkdir -p '/usr/local/libmemcached/include/libmemcached'
- /usr/bin/install -c -m 644 libmemcached/memcached.h libmemcached/memcached.hpp libmemcached/util.h '/usr/local/libmemcached/include/libmemcached'
- /bin/mkdir -p '/usr/local/libmemcached/lib/pkgconfig'
- /usr/bin/install -c -m 644 support/libmemcached.pc '/usr/local/libmemcached/lib/pkgconfig'
- make[2]: Leaving directory `/root/libmemcached-1.0.18'

Reinstalled many times.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/d4efd20a5a074f32abf04190647dc2d9.png)

Solution:
Disable all functions of Cloud Lock.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/76d1a8c0aee09071e12bba486c4d7f84.png)

Enter the following command on the remote client to stop Cloud Lock:

- service yunsuo stop

On the Baota panel homepage, click on Process Management.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/2b001aa4a8a6faaf0739e461d44a4989.png)

Terminate all processes with "yunsuo" and "aliyun" in their names.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/3f4187e62da8ffb19b6f0c4cef235bf7.png)

You can now proceed with the installation.

Original Article:
Solution to the Failed Installation of Memcached on Baota Panel
http://www.xhkj5.com/forum.php?mod=viewthread&tid=10528&fromuid=1
(Source: Xunhuan Network)
