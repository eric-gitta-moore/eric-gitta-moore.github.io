---
title: How to tell if dll is 64 bit or 32 bit
subtitle: How to tell if dll is 64 bit or 32 bit
date: 2022-01-09 20:44:02
toc: true
tags: 
categories: 
    - Default
---

> This method seems to be the most effective.

In the PE file header, there is a "machine" field that specifies the CPU type. If it is 0x8664, it indicates a 64-bit program, and if it is 0x14c, it represents Intel 386 or later processors and their compatible processors. You can use the c32asm tool to import DLL files and view them.

This is for x86:

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/2d9188566c684db497cb4d7489f047ff.png)

This is for x64:

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/5606fe864e7e4b9aaa26da0faba554fb.png)

Source:

```
https://bbs.pediy.com/thread-200189-1.htm#1369197
```