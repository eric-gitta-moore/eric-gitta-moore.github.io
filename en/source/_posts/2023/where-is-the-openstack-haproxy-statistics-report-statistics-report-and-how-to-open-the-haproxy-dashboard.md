---
title: OpenStack haproxy Statistics Report统计报告怎么在哪里，haproxy Dashboard怎么打开
subtitle: Where is the OpenStack haproxy Statistics Report statistics report and how to open the haproxy Dashboard?
date: 2023-02-07 11:33:57
toc: true
tags: 
categories: 
    - 默认
---

haproxystats是HAProxy负载均衡器的统计数据收集器，它处理各种统计数据并将它们推送到图形系统（Graphite）。它旨在满足以下要求：

1. 快速且可配置的 HAProxy 统计数据处理
2. HAProxy 在多进程运行时执行聚合（nbproc > 1）
3. 以非常低的间隔（10 秒）提取统计信息
4. 灵活地将统计信息分发到不同的系统（Graphite、kafka）

![16936495295341693649528613.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936495295341693649528613.png)

------

在任意计算节点上，找到

```
/etc/kolla/haproxy/haproxy.cfg
```



就可以看到设置了

```
global
    chroot /var/lib/haproxy
    user haproxy
    group haproxy
    daemon
    log 10.10.1.81:5140 local1
    maxconn 40000
    nbproc 1
    stats socket /var/lib/kolla/haproxy/haproxy.sock group kolla mode 660

defaults
    log global
    option redispatch
    retries 3
    timeout http-request 10s
    timeout http-keep-alive 10s
    timeout queue 1m
    timeout connect 10s
    timeout client 1m
    timeout server 1m
    timeout check 10s
    balance roundrobin
    maxconn 10000

listen stats
   bind 10.10.1.81:1984
   mode http
   stats enable
   stats uri /
   stats refresh 15s
   stats realm Haproxy\ Stats
   stats auth openstack:E9wg1JFttdHVKtHNyAPomDDSYdnNsFKbLwkUh9W1

frontend status
    bind 10.10.1.81:61313
    bind 10.10.1.250:61313
    mode http
    monitor-uri /
```



可以看到listen stats绑定的是10.10.1.81:1984

打开访问就行，用户密码是stats auth那一行