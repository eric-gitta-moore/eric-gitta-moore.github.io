---
title: VMware 无法安装 VMware Tools， 提示VMCI，内存驱动
subtitle: VMware cannot install VMware Tools, prompting VMCI, memory driver
date: 2021-08-20 12:13:56
toc: true
tags: 
categories: 
    - 默认
---

我是VMware16

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/20210820120717730.png)



镜像为Windows 7 Ultimate with Service Pack 1 (x64) - DVD (Chinese-Simplified)

最新版7601

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/20210820120832952.png) 

```
文件名：cn_windows_7_ultimate_with_sp1_x64_dvd_u_677408.iso
SHA1：2CE0B2DB34D76ED3F697CE148CB7594432405E23
文件大小：3.19GB
发布时间：2011-05-12
ed2k://|file|cn_windows_7_ultimate_with_sp1_x64_dvd_u_677408.iso|3420557312|B58548681854236C7939003B583A8078|/
```



 安装VMware提示这个

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/211be5072aba99fda55111d2c31fcdf9.png)

根据https://kb.vmware.com/s/article/78708所述，应该是无法验证签名？

下载这两个，安装到虚拟机里面就好了

[Microsoft Update Catalog](https://www.catalog.update.microsoft.com/search.aspx?q=kb4474419)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/20210820121051189.png)

[Microsoft Update Catalog](https://www.catalog.update.microsoft.com/search.aspx?q=4490628)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/20210820121103198.png)

然后在VMware连接光驱

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/20210820121218761.png)



![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/20210820121232724.png)



就可以安装成功了 