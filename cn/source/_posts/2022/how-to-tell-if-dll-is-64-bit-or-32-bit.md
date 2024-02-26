---
title: 如何判断dll是64位，还是32位
subtitle: How to tell if dll is 64 bit or 32 bit
date: 2022-01-09 20:44:02
toc: true
tags: 
categories: 
    - 默认
---

>  感觉这个方法最好用

PE文件头里有个machine字段指定CPU类型，如果是0x8664就是64位程序，0x14c 表示Intel 386或后继处理器及其兼容处理器
 可以用c32asm工具导入dll文件查看
 这个是x86的：

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/2d9188566c684db497cb4d7489f047ff.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)编辑

这个是x64的

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/5606fe864e7e4b9aaa26da0faba554fb.png)![点击并拖拽以移动](data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==)编辑

 出处

```
https://bbs.pediy.com/thread-200189-1.htm#1369197
```
