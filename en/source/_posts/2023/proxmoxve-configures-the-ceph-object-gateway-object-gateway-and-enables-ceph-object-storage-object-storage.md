---
title: ProxmoxVE配置Ceph Object Gateway对象网关，开启Ceph Object Storage对象存储
subtitle: ProxmoxVE configures the Ceph Object Gateway object gateway and enables Ceph Object Storage object storage
date: 2023-02-06 18:51:55
toc: true
tags: 
categories: 
    - 默认
---

 上篇：[ProxmoxVE启用Ceph Dashboard仪表盘，配置Object Getaway对象网关](https://blog.csdn.net/qq_35485875/article/details/128906403)

------

> Ceph 对象网关是建立在 librados. 它在应用程序和 Ceph 存储集群之间提供了一个 RESTful 网关。Ceph 对象存储支持两种接口：
>
> 1. S3 兼容：通过与 Amazon S3 RESTful API 的大部分子集兼容的接口提供对象存储功能。
> 2. Swift 兼容：通过与 OpenStack Swift API 的大部分子集兼容的接口提供对象存储功能。

![16936499775391693649977331.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936499775391693649977331.png)

![16936499915351693649990576.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936499915351693649990576.png)

![16936500045381693650003669.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936500045381693650003669.png)

------

Proxmox Virtualization Environment (VE) 是一个出色的虚拟化平台。它具有许多其他企业平台所没有的强大功能。这些功能之一是 Ceph 支持，包括在 Proxmox 节点本身上运行 Ceph 的能力。除了将 Ceph 用于我的 VM 和容器之外，我还想利用 Ceph 对象网关为我的网站获取 S3 兼容存储。

我的 Proxmox 环境由 3 个节点组成：pve1、pve2和pve3，我想在所有三个节点上运行网关以实现高可用性（我在这些节点前面运行 HAProxy 以实现 SSL 终止、HA 和负载平衡）。

我从节点运行了以下命令pve1，但它可以从任何节点完成。

首先，我创建了密钥环来存储密钥：

```
root@pve1:~# ceph-authtool --create-keyring /etc/ceph/ceph.client.radosgw.keyring
```



 接下来，我生成了密钥并将它们添加到密钥环中：（如果只有一台机器只要执行一条即可，需要自己注意修改）

```
root@pve1:~# ceph-authtool /etc/ceph/ceph.client.radosgw.keyring -n client.radosgw.pve1 --gen-key
root@pve1:~# ceph-authtool /etc/ceph/ceph.client.radosgw.keyring -n client.radosgw.pve2 --gen-key
root@pve1:~# ceph-authtool /etc/ceph/ceph.client.radosgw.keyring -n client.radosgw.pve3 --gen-key
```



然后我添加了适当的功能：

```
root@pve1:~# ceph-authtool -n client.radosgw.pve1 --cap osd 'allow rwx' --cap mon 'allow rwx' /etc/ceph/ceph.client.radosgw.keyring
root@pve1:~# ceph-authtool -n client.radosgw.pve2 --cap osd 'allow rwx' --cap mon 'allow rwx' /etc/ceph/ceph.client.radosgw.keyring
root@pve1:~# ceph-authtool -n client.radosgw.pve3 --cap osd 'allow rwx' --cap mon 'allow rwx' /etc/ceph/ceph.client.radosgw.keyring
```



最后，我将密钥添加到集群：

```
root@pve1:~# ceph -k /etc/ceph/ceph.client.admin.keyring auth add client.radosgw.pve1 -i /etc/ceph/ceph.client.radosgw.keyring
root@pve1:~# ceph -k /etc/ceph/ceph.client.admin.keyring auth add client.radosgw.pve2 -i /etc/ceph/ceph.client.radosgw.keyring
root@pve1:~# ceph -k /etc/ceph/ceph.client.admin.keyring auth add client.radosgw.pve3 -i /etc/ceph/ceph.client.radosgw.keyring
```



将密钥环复制到/etc/pve/priv

```
root@pve1:~# cp /etc/ceph/ceph.client.radosgw.keyring /etc/pve/priv
```



将以下行添加到/etc/ceph/ceph.conf：

如果没有解析dns，那就删掉 rgw_dns_name

```
[client.radosgw.pve1]
        host = pve1
        keyring = /etc/pve/priv/ceph.client.radosgw.keyring
        rgw_dns_name = s3.example.net

[client.radosgw.pve2]
        host = pve2
        keyring = /etc/pve/priv/ceph.client.radosgw.keyring
        rgw_dns_name = s3.example.net

[client.radosgw.pve3]
        host = pve3
        keyring = /etc/pve/priv/ceph.client.radosgw.keyring
        rgw_dns_name = s3.example.net
```



此时是时候登录每个节点并添加适当的包了：

```
root@pve1:~# apt install radosgw
```



 然后启动它：

```
root@pve1:~# service radosgw start
```



开机自启

```
root@pve1:~# systemctl enable radosgw 
```



如果一切顺利，RADOSGW 将为您创建一些默认池（见下文），您应该能够访问端口 7480 上的任何节点（例如http://pve1.example.net:7480）并且您应该看到是这样的：

```
<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <Owner>
        <ID>anonymous</ID>
        <DisplayName/>
    </Owner>
    <Buckets/>
</ListAllMyBucketsResult>
```



如果没有，您可以按照您的日志进行故障排除：

```
tail -f /var/log/ceph/ceph-client.radosgw.pve1.log
```



现在你可以设置你的第一个用户：

```
root@pve1:~# radosgw-admin user create --uid=testuser --display-name="Test User" --email=test.user@example.net
```

