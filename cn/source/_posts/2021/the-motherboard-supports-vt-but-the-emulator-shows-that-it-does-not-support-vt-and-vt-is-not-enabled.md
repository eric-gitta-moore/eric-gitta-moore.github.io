---
title: 主板支持vt但是模拟器显示不支持vt也没有开启vt
subtitle: The motherboard supports vt but the emulator shows that it does not support vt and vt is not enabled.
date: 2021-08-19 10:13:13
toc: true
tags: 
categories: 
    - 默认
---

实测去“启用或关闭windows功能”里面，关闭如下东西就OK了，能够和VMware共存

“Hyper-V”、“Windows 沙盒”、”Windows 虚拟机监控平台“、”虚拟机平台“

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/20210819101236284.png)