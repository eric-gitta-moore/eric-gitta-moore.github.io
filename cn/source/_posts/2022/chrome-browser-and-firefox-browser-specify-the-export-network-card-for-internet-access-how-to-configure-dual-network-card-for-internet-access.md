---
title: chrome浏览器 firefox浏览器指定出口网卡进行上网 双网卡上网怎么配置
subtitle: Chrome browser and firefox browser specify the export network card for Internet access How to configure dual network card for Internet access
date: 2022-10-22 21:12:14
toc: true
tags: 
categories: 
    - 默认
---

背景：强制应用程序使用特定的网络接口

我正在使用多个网络接口（LAN 和无线），并且我注意到有一种方法(windows下的跃点数)可以更改首选接口的顺序。我如何使用有线网络（安全地）工作、检查电子邮件等，并使用无线 VLAN 访问其他东西？

开门见山，需要用到的工具有ForceBindIP-Gui和ForceBindIP

其中ForceBindIP-Gui的下载地址在这里：[mhasanjb/ForceBindIP-Gui: A GUI For ForceBindIP (github.com)](https://github.com/mhasanjb/ForceBindIP-Gui)

使用方法：

1. chrome浏览器

这个根据readme的说明，好像只有老版本才能用了，现在最新的chrome版本都100+

2. firefox浏览器

Firefox 需要将 about:config?filter=browser.launcherProcess.enabled 首选项设置为 false，否则 ForceBindIP 会附加到启动器而不是实际程序。

![16936512345391693651233887.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936512345391693651233887.png)

选择出口网卡和指定程序，点击run application即可

![16936512455351693651245225.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936512455351693651245225.png)

 效果

![16936512565411693651256481.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936512565411693651256481.png)

![16936512665391693651266038.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936512665391693651266038.png)
