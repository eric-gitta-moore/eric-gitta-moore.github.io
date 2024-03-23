---
title: word中编号怎么转成普通的字，如何把WORD编号转为普通文本
subtitle: How to convert numbers in word to ordinary words, how to convert WORD numbers to ordinary text
date: 2021-12-16 13:16:15
toc: true
tags: 
categories: 
    - 默认
---

##  记录一下word如何去掉自动编号格式但保留原编号内容的方法：

##   1. 调出word的“开发工具”选项

打开文件->选项->自定义功能区->选中开发工具->确定

![在这里插入图片描述](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/99bda1d4889d88663775466590df1445.png)

 ，

##   2. 编写宏

依次点击：开发工具－宏－在“宏名”框内输入宏名（如：NumToTxt）－单击“创建”按钮，弹出Visual Basic编辑器窗口，窗口内自动出现以下内容
 把下面的这段代码复制下来：
 ActiveDocument.Content.ListFormat.ConvertNumbersToText

粘贴到编辑器窗口内容“End Sub”前面；
 最后点Visual Basic编辑器保存按钮，将宏保存到Normal模板，然后关闭VBA窗口并返回Word。
 编辑器窗口的内容：

![在这里插入图片描述](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/9f9edbfd72bef556c4edaad5727a61a6.png)

##   3. 使用宏

打开你要处理的WORD文档，依次点击：工具－宏－选中NumToTxt这个我们刚刚创建的宏（选中后在“宏名”框内会显示NumToTxt）－运行，自动编号格式就被取消啦。

![在这里插入图片描述](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/9fdc7987e2e65dfb6e60ac862c8a96bf.png)



本文链接：[如何把WORD编号转为普通文本_hevin_hy的博客-CSDN博客_word如何把编号改成普通文本](https://blog.csdn.net/hevin_hy/article/details/107568487)