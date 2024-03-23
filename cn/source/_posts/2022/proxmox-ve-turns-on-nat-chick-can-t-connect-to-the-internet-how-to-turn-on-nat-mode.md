---
title: proxmox VE开NAT小鸡 无法联网，怎么开NAT模式
subtitle: Proxmox VE turns on NAT chick. Can't connect to the Internet. How to turn on NAT mode?
date: 2022-05-27 14:50:53
toc: true
tags: 
categories: 
    - 默认
---

###  前言

在我自己尝试之前已经网络上搜了一通了，都是清一色的改网卡配置、防火墙、转发。

我寻思着官方的帮助文档不是有直接一键开启NAT模式的嘛，为啥没人发。遂有此文。

如果你需要转发端口到映射到母鸡的ip上那还是去配置文件吧，官方也是这么说的。

下面过程可以跳过，直接看总结。

### 过程

![16936534599901693653459693.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534599901693653459693.png)

![16936534749951693653474606.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534749951693653474606.png)

据文档描述，只能通过CLI或者API调用，那我们先找找有没有CLI和API的文档

点这里跳出去看看

![16936534809901693653480372.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534809901693653480372.png)

通读全文，发现底部这里有个api文档，于是豁然开朗

![16936534949901693653494581.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534949901693653494581.png)

走马观花看一下发现每个api都是http请求和cli写在一起的，那就好办了，直接去抓包看下在web控制台是怎么增加网卡的，然后找到对应的api，就一切就明白了

![16936535029891693653502838.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535029891693653502838.png)

 一切就绪之后，点击添加 

![16936535149901693653514717.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535149901693653514717.png)

霍霍好家伙找到你了，

![16936535269991693653526732.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535269991693653526732.png)

 切换到“标头”选项卡，就能找到api地址了

![16936535359891693653535255.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535359891693653535255.png)

于是去文档里面搜一下“config” 

找到与之对应的path和method

![16936535469961693653546646.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535469961693653546646.png)

这里就是我们要的文档啦

观察一下参数

![16936535539901693653553493.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535539901693653553493.png)

可以明显看到bridge这里是一个可选参数

### 总结

我们只要在ssh里面执行下面这一句就可以了，不指定桥接网卡即可

```bash
pvesh set /nodes/pve/qemu/100/config -net2 virtio,firewall=1
```


 解释：

> pvesh set /nodes/{你的节点名字，默认的节点是pve}/qemu/{你的虚拟机id，默认第一个虚拟机id是100}/config -net{这里是你的第几个网络设备，如果只有一个网络设备的话这里就写1，只要不和原有的设备冲突就好了} virtio,firewall=1



###  QA

Q1：你是怎么知道这个命令后面的参数是这样写的呢？

A：一开始我也不知道怎么打这个命令就乱试了几个发现不行，于是找文档，看了一下里面的例子咋写的才知道是要加一个连接号

![16936535729911693653572220.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535729911693653572220.png)


![16936535829951693653582635.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535829951693653582635.png)

![16936535919951693653591722.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535919951693653591722.png)

 Q2：nat是开好了，但是没网怎么办？

A：在虚拟机里面手动设置一下DNS

Q3：怎么设置端口转发？

A：这个没法设置端口转发，如果需要的话还是得动/etc/network/interfaces和防火墙