---
title: VMware cannot install VMware Tools, prompting VMCI, memory driver
subtitle: VMware cannot install VMware Tools, prompting VMCI, memory driver
date: 2021-08-20 12:13:56
toc: true
tags: 
categories: 
    - Default
---

I'm using VMware 16.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/20210820120717730.png)

The image is Windows 7 Ultimate with Service Pack 1 (x64) - DVD (Chinese-Simplified).

Latest version 7601.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/20210820120832952.png)

```
File Name: cn_windows_7_ultimate_with_sp1_x64_dvd_u_677408.iso
SHA1: 2CE0B2DB34D76ED3F697CE148CB7594432405E23
File Size: 3.19GB
Release Date: 2011-05-12
ed2k://|file|cn_windows_7_ultimate_with_sp1_x64_dvd_u_677408.iso|3420557312|B58548681854236C7939003B583A8078|/
```

When installing VMware, I received this prompt.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/211be5072aba99fda55111d2c31fcdf9.png)

According to [https://kb.vmware.com/s/article/78708](https://kb.vmware.com/s/article/78708), it seems to be a signature verification issue.

Download these two updates and install them in the virtual machine.

[Microsoft Update Catalog](https://www.catalog.update.microsoft.com/search.aspx?q=kb4474419)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/20210820121051189.png)

[Microsoft Update Catalog](https://www.catalog.update.microsoft.com/search.aspx?q=4490628)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/20210820121103198.png)

Then connect the CD/DVD drive in VMware.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/20210820121218761.png)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/20210820121232724.png)

You should now be able to complete the installation successfully.
