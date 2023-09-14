---
title: OpenStack生产环境应该部署哪些组件，OpenStack选型实践
subtitle: Which components should be deployed in OpenStack production environment, OpenStack selection practice
date: 2023-02-10 17:42:28
toc: true
categories: 
    - 默认
---

官网虽然有示例配置，但仅仅是示例而已，并不是最佳实践。

可以看到有四种：计算入门套件、容器优化、网络应用、大数据 

其实下面的有些组件，很多部署OpenStack的企业也没有使用。而且许多边缘组件使用人数很少，使用频率低，也更新并不勤快

![16936374995351693637498609.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936374995351693637498609.png)

![16936375115361693637510839.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375115361693637510839.png)

分析一下2019-2021年，各个组件在生产环境的使用比例。

进入用户调查

![16936375205351693637520181.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375205351693637520181.png)

查看Deployments调查部分中在生产环境使用的项目

![16936375325341693637531650.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375325341693637531650.png)

可以看到大部分组件的比例都低于10%，2022数据经过整理得到如下图

![16936375445351693637544073.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375445351693637544073.png)

2021数据

![16936375625401693637562007.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375625401693637562007.png)

2020数据

![16936375745401693637574397.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375745401693637574397.png)


2019数据

![16936375835401693637583273.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375835401693637583273.png)


2018数据

![16936375915351693637591124.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936375915351693637591124.png)


我暂且认为

- 生产比例小于等于10%的均不要部署在自己生产环境上
- 生产比例小于等于15%的可以经过考虑、测试后部署在生产环境上
- 生产比例大于等于20%可以部署在生产环境

我认为中小企业至少要部署以下组件（当然场景优先）

OpenStack Core ( glance, keystone, neutron, nova, heat, horizon )、cinder、octavia

推荐部署以下组件

designate、swift、manila、ironic

可选部署以下组件（按需）

barbican、rally、ceilometer

![16936376025391693637602214.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936376025391693637602214.png)

部署操作系统：Ubuntu Server。从2018以来Ubuntu的占比就超过了centos 

![16936376145341693637613536.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936376145341693637613536.png)