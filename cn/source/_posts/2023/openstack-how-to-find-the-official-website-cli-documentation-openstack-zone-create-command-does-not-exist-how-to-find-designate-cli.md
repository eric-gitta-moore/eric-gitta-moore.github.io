---
title: OpenStack怎么找到官网CLI文档，openstack zone create命令不存在，怎么找到Designate CLI
subtitle: OpenStack how to find the official website CLI documentation, openstack zone create command does not exist, how to find Designate CLI
date: 2023-02-07 11:08:17
toc: true
tags: 
categories: 
    - 默认
---

#  1. 进入DOC

![16936497175351693649717024.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936497175351693649717024.png)

##  2. OpenStack Python绑定和客户端的文档

![16936497275351693649727517.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936497275351693649727517.png)

# 3. 找到所需组件的文档

> Unified OpenStack Client：python-openstackclient 的文档，一个统一的 shell 命令结构。 

![16936497375351693649737231.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936497375351693649737231.png)

# 4. 完整文档 

![16936497465351693649746399.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936497465351693649746399.png)

# 5. 安装cli client

> python-designateclient包在 PyPI 上发布，因此可以使用 pip 工具安装，该工具将管理所有 python 依赖项的安装： 

可以发现没有 openstack zone create命令的原因是没有安装这个软件包

```
pip install python-designateclient
```

