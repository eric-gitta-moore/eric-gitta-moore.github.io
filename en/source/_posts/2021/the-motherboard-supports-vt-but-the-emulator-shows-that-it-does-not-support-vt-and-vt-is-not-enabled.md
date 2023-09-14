---
title: The motherboard supports vt but the emulator shows that it does not support vt and vt is not enabled.
subtitle: The motherboard supports vt but the emulator shows that it does not support vt and vt is not enabled.
date: 2021-08-19 10:13:13
toc: true
tags: 
categories: 
    - Default
---

In practical tests, it has been found that disabling the following items within "Turn Windows features on or off" allows it to coexist with VMware:

- "Hyper-V"
- "Windows Sandbox"
- "Windows Virtual Machine Platform"
- "Virtual Machine Platform"

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/20210819101236284.png)