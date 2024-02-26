---
title: ProxmoxVE启用Ceph Dashboard仪表盘，配置Object Getaway对象网关
subtitle: ProxmoxVE enables the Ceph Dashboard dashboard and configures the Object Getaway object gateway
date: 2023-02-06 18:49:48
toc: true
tags: 
categories: 
    - 默认
---

下篇：[ProxmoxVE配置Ceph Object Gateway对象网关，开启Ceph Object Storage对象存储 ](https://blog.csdn.net/qq_35485875/article/details/128906309)

------

Ceph Dashboard 是一个内置的基于 Web 的 Ceph 管理和监控应用程序，您可以通过它检查和管理集群中的各个方面和资源。它作为Ceph Manager Daemon模块实现。

新的Ceph Dashboard模块为 Ceph Manager 添加了基于 Web 的监控和管理。这个新模块的架构和功能源自openATTIC Ceph 管理和监控工具并受到其启发。开发由SUSE的 openATTIC 团队积极推动，并得到Red Hat和 Ceph 社区成员等公司的支持。

![16936498705351693649870459.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936498705351693649870459.png)

------



# 1. 安装软件包

由于Dashboard和ceph本体是分开分发软件包的，所以需要额外安装

```
apt install ceph-mgr-dashboard -y
```



# 2. 启用Dashboard

```
ceph mgr module enable dashboard
```



# 3. 配置SSL/TLS 支持（可选，建议）

```
ceph dashboard create-self-signed-cert
```



# 4. 重新启动 Ceph 管理器进程

```
ceph mgr module disable dashboard
ceph mgr module enable dashboard
```



# 5. 创建管理员

## 5.1 创建密码文件

```
echo "password" > /tmp/dash.pwd
```



## 5.2 创建用户

> 系统角色列表如下：    
>
> administrator：允许所有安全范围的完全权限。
>
> read-only：允许对除仪表板设置之外的所有安全范围的读取权限。
>
> block-manager：允许对rbd-image、 rbd-mirroring和iscsi范围的完全权限。
>
> rgw-manager：允许对rgw范围的完全权限
>
> cluster-manager：允许对hosts、osd、 monitor、manager和config-opt范围的完全权限。
>
> pool-manager：允许池范围的完全权限。
>
> cephfs-manager：允许对cephfs范围的完全权限。

 最后面那个administrator参数就是上面的角色

```
ceph dashboard ac-user-create <username> -i /tmp/dash.pwd administrator
```



# 6. 查询地址端口

地址

```
ceph config get mgr mgr/dashboard/server_addr
```



端口

```
ceph config get mgr mgr/dashboard/server_port
```



SSL端口

```
ceph config get mgr mgr/dashboard/ssl_server_port
```



您现在可以使用您的（启用 JavaScript 的）Web 浏览器访问仪表板，方法是将其指向任何主机名或 IP 地址以及运行管理器实例的选定 TCP 端口：例如，`http(s)://<$IP>:<$PORT>/`