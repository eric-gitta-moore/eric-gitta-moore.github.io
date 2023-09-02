---
title: VMware NSX-T网络不稳定，ssh自动断开，iperf3测速没有速度
subtitle: The VMware NSX-T network is unstable, ssh automatically disconnects, and the iperf3 speed test has no speed.
date: 2023-02-12 20:17:42
toc: true
---

#  问题现象：

笔记本直连交换机，对服务器进行iperf3测试，结果发现带宽只有50Kbits/S，只有第一次能发出流量，后面直接就是0bits/S

![16936371165341693637116260.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936371165341693637116260.png)

# 问题分析：

nsx的overlay和vlan传输区域接口都是使用的1700MTU

如果流量要跑在大二层，都是使用1700MTU进行传输，但是我的上行链路VDS交换机只有1500MTU

![16936371285401693637127647.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936371285401693637127647.png)

# 解决方法：

### 第一步

将主机的NSX交换机MTU修改为1700

![16936371395401693637139013.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936371395401693637139013.png)


### 第二步

修改物理交换机MTU

> 我这里使用的嵌套环境，所以直接改母鸡的esxi标准交换机
>
> 因为我的主板是螃蟹网卡，所以只能用6.7的vmkernel螃蟹网卡驱动，在esxi7及以上都砍掉了vmkernel驱动，只用用native模式驱动网卡，所以才迟迟没有人写出esxi7的螃蟹网卡驱动 

![16936371515391693637151261.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936371515391693637151261.png)


# 修复验证

可以看到已经恢复到了正常带宽，而且ssh也不掉了，sftp传输也不会卡在那儿半天不动 

![16936371825391693637182343.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936371825391693637182343.png)