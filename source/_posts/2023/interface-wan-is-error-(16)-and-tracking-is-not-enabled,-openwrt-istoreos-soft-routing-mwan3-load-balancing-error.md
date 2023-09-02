---
title: interface wan is error (16) and tracking is not enabled，openwrt iStoreOS软路由mwan3负载均衡报错
subtitle: interface wan is error (16) and tracking is not enabled, openwrt iStoreOS soft routing mwan3 load balancing error
date: 2023-02-26 21:17:30
toc: true
categories: 
    - 默认
---

#  问题现象

进入 状态-负载均衡-详细信息

在Interface status下面显示，只有一个接口是在线状态

```
Interface status:
 interface wan is error (16) and tracking is not enabled
 interface wan1 is error (16) and tracking is not enabled
 interface wan2 is error (16) and tracking is not enabled
 interface wan3 is error (16) and tracking is not enabled
 interface wan4 is online 00h:00m:00s, uptime 01h:59m:08s and tracking is not enabled
```


![16936366885391693636687849.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936366885391693636687849.png)

# 故障原因

各个接口的跃点数不能一致，默认创建接口之后跃点数是0

![16936367075351693636706779.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936367075351693636706779.png)

# 解决方法

在 网络-接口-WAN-高级设置-使用网关跃点数，这里手动把各个接口设置成不一样的即可 

![16936367195391693636718808.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936367195391693636718808.png)

# 效果检验

```
Interface status:
 interface wan is online 00h:00m:00s, uptime 02h:02m:20s and tracking is not enabled
 interface wan1 is online 00h:00m:00s, uptime 02h:01m:54s and tracking is not enabled
 interface wan2 is online 00h:00m:00s, uptime 02h:01m:54s and tracking is not enabled
 interface wan3 is online 00h:00m:00s, uptime 02h:01m:54s and tracking is not enabled
 interface wan4 is online 00h:00m:00s, uptime 02h:01m:54s and tracking is not enabled
```


![16936367395351693636738707.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936367395351693636738707.png)