---
title: OpenStack Kolla-Ansible部署Swift文件存储 对接Ceph RadosGW，Proxmox
subtitle: OpenStack Kolla-Ansible deploys Swift file storage and interfaces with Ceph RadosGW and Proxmox
date: 2023-02-07 11:41:14
toc: true
tags: 
categories: 
    - 默认
---

 书接上回 [OpenStack Kolla-Ansible部署Cinder块存储 对接Ceph，Proxmox](https://blog.csdn.net/qq_35485875/article/details/128901696)

本章我们继续来完成OpenStack示例配置组件之Web Application中的Swift文件存储，OpenStack中的Swift文件存储对接Ceph RadosGW

> 实际上应该是ceph RadosGW对接OpenStack Keystone身份认证
>
> 因为RadosGW提供了和Swift兼容的API，所有二者api是一样的，直接做个负载均衡到RadosGW就成了一个swift接口 

------

# 1. 前言 

ceph官方latest文档已经很落后了，搞得整了好久才弄明白。要知道ceph.conf配置中的键如果是空格形式的（形如“rgw keystone api version”），这种是ceph octopus版本最后一次出现，在pacific版本改为下划线形式。

并且网上教程包括官网教程重点都在以Keystone V2版本api为例说明，没有V3接口版本的例子。

> 求证：
>
> octopus版本的ceph.conf例子：[Common Settings — Ceph Documentation](https://docs.ceph.com/en/octopus/rados/configuration/common/#example-ceph-conf)
>
> pacific版本的ceph.conf例子：[Common Settings — Ceph Documentation](https://docs.ceph.com/en/pacific/rados/configuration/common/#example-ceph-conf)
>
> 发行索引：[Ceph Releases (index) — Ceph Documentation](https://docs.ceph.com/en/latest/releases/)

 **重点：**

如果使用kolla-ansible部署RadosGW兼容的Swift，不要去找那种“手动部署RadosGW对接Swift”的教程，因为kolla-ansible已经为你准备好了OpenStack这边的一切配置。所有有关OpenStack这边的操作都不要做！！！

> RadosGW兼容的Swift：实际上没有部署Swift，可以理解为把原本Swift的api重定向到了RadosGW。而RadosGW有着和Swift一样的api。

# 2. Ceph配置 

RadosGW安装配置这里不再赘述，请参阅：[ProxmoxVE配置Ceph Object Gateway对象网关，开启Ceph Object Storage对象存储_JamesCurtis的博客-CSDN博客](https://blog.csdn.net/qq_35485875/article/details/128906309)

## 2.1 检查Ceph.conf 

做完之后你的ceph.conf应该大致如下：

> 建议取消所有缩进

```
[global]
auth_client_required = cephx
auth_cluster_required = cephx
auth_service_required = cephx
cluster_network = 10.10.11.1/24
fsid = 59063611-9b12-4807-bf9d-ecfa60480d94
mon_allow_pool_delete = true
mon_host = 10.10.1.51
ms_bind_ipv4 = true
ms_bind_ipv6 = false
osd_pool_default_min_size = 2
osd_pool_default_size = 2
public_network = 10.10.1.51/24

[client]
keyring = /etc/pve/priv/$cluster.$name.keyring

[client.radosgw.pve1]
host = pve1
keyring = /etc/pve/priv/ceph.client.radosgw.keyring

[mds]
keyring = /var/lib/ceph/mds/ceph-$id/keyring

[mds.pve1]
host = pve1
mds standby for name = pve

[mon.pve1]
public_addr = 10.10.1.51
```



## 2.2 对接Keystone

这里需要先安装一个cli client工具。进入部署机，激活python虚拟环境，source admin授权文件，安装

> 至于文档怎么找，入口在哪里，请参阅：https://blog.csdn.net/qq_35485875/article/details/128915192

```
# 激活python环境
root@ttt:~# . /path/to/venv/bin/activate
# 激活admin授权文件（后面用到）
(venv) root@ttt:~# . /etc/kolla/admin-openrc.sh
# 安装客户端
(venv) root@ttt:~# pip install python-swiftclient
```



验证安装

```
(venv) root@ttt:~# swift --help
```



# 2.3 获取Auth Token

```
(venv) root@ttt:~# swift auth
export OS_STORAGE_URL=http://10.10.1.250:6780/swift/v1
export OS_AUTH_TOKEN=gAAAAABj4cEubXFK1PLGUicIMKMft6TiWitNcGhzHJxS2CWbetUEYIHbCJMx3v_iLQ142ZgjQ9KvtwLwoDrP-_RctuP45O9FTVr1dAVWrEKZngXpxX2uRVSELz7FP27vmZqtN0
```



> 刚兴趣的可以再试试下面两个命令：
>
> swift auth -v
>
> swift auth --debug 

把OS_AUTH_TOKEN记录下来，回到Proxmox shell

```
echo "gAAAAABj4cID5BqJhJcRPfAJniQ-eqt66praFVJ2ZwSGUMd6QgdUplNUJlih-AGOzYw5t5HOWHiCsTGsMfU2uJpBwbXsC_2Y8hpqSwqqICth8xfLtnivPcKaT__K9CNASb92REHMECmQI" > /etc/ceph/keystone_admin_token
```



## 2.4 配置RadosGW

在Proxmox节点中。打开ceph.conf，在[client.radosgw.pve1]节点下新增：

> 文档推荐：
>
> 1. kolla-ansible官网(比较难懂)：[External Ceph — kolla-ansible 14.7.1.dev18 documentation](https://docs.openstack.org/kolla-ansible/yoga/reference/storage/external-ceph-guide.html#radosgw) 
> 2. Ceph官网：[Integrating with OpenStack Keystone — Ceph Documentation](https://docs.ceph.com/en/quincy/radosgw/keystone/)
>
> [radosgw – rados REST gateway — Ceph Documentation](https://docs.ceph.com/en/quincy/man/8/radosgw/)
>
> [Ceph Object Gateway Config Reference — Ceph Documentation](https://docs.ceph.com/en/quincy/radosgw/config-ref/)
>
> 3. SUSE官网（中文）：https://documentation.suse.com/zh-cn/ses/7/html/ses-all/cha-ceph-gw.html#ogw-keystone
>
> https://documentation.suse.com/zh-cn/ses/7/html/ses-all/cha-ceph-configuration.html#config-ogw

```
# common
rgw_keystone_url = 10.10.1.250:5000
rgw_keystone_api_version = 3
# rgw_keystone_verify_ssl = false

# v3
rgw_keystone_admin_domain = Default
rgw_keystone_admin_project = admin
rgw_keystone_admin_token = gAAAAABj4bqH7oqC7X45z41YGsrBR5U5RfMbHylk6nlk2ZquW58h0

# other
# rgw_s3_auth_use_keystone = true
# rgw_swift_account_in_url = true
```



完成后，整个ceph.conf看起来如下

```
[global]
auth_client_required = cephx
auth_cluster_required = cephx
auth_service_required = cephx
cluster_network = 10.10.11.1/24
fsid = 59063611-9b12-4807-bf9d-ecfa60480d94
mon_allow_pool_delete = true
mon_host = 10.10.1.51
ms_bind_ipv4 = true
ms_bind_ipv6 = false
osd_pool_default_min_size = 2
osd_pool_default_size = 2
public_network = 10.10.1.51/24

[client]
keyring = /etc/pve/priv/$cluster.$name.keyring

[client.radosgw.pve1]
host = pve1
keyring = /etc/pve/priv/ceph.client.radosgw.keyring

# common
rgw_keystone_url = 10.10.1.250:5000
rgw_keystone_api_version = 3
# rgw_keystone_verify_ssl = false

# v3
rgw_keystone_admin_domain = Default
rgw_keystone_admin_project = admin
rgw_keystone_admin_token = gAAAAABj4bqH7oqC7X45z41YGs

# other
# rgw_s3_auth_use_keystone = true
# rgw_swift_account_in_url = true

[mds]
keyring = /var/lib/ceph/mds/ceph-$id/keyring

[mds.pve1]
host = pve1
mds standby for name = pve

[mon.pve1]
public_addr = 10.10.1.51
```



 上传保存，重启RadosGW

```
root@pve1:~# systemctl restart radosgw
```



# 3. kolla配置

## 3.1 启用 Ceph RadosGW 集成

在部署机，global.yml

```
enable_ceph_rgw: true
```



## 3.2 添加rgw主机

在enable_ceph_rgw: "yes"下面一行，增加

```
ceph_rgw_hosts:
  - host: rgw01
    ip: 10.10.1.51
    port: 7480
```



host是名字随意，不需要解析dns，但是一定要填写ip

端口7480，是RadosGW默认端口，可以在RadosGW文档中查询到rgw_frontends属性

# 4. 重新部署

```
kolla-ansible -i ./multinode deploy
```



# 5. 验证

## 5.1 验证负载均衡

> haproxy报告查看：https://blog.csdn.net/qq_35485875/article/details/128915789 

radosgw_back都是绿色就行

![16936493045351693649304108.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936493045351693649304108.png)

# 5.2 验证客户端

回到部署机，输入 swift stat

```
(venv) root@ttt:~# swift stat
                                    Account: v1
                                 Containers: 0
                                    Objects: 0
                                      Bytes: 0
   Containers in policy "default-placement": 0
      Objects in policy "default-placement": 0
        Bytes in policy "default-placement": 0
Objects in policy "default-placement-bytes": 0
  Bytes in policy "default-placement-bytes": 0
                                X-Timestamp: 1675740884.45155
                X-Account-Bytes-Used-Actual: 0
                                 X-Trans-Id: tx000008f5efad48bd19d87-0063e1c6d4-96a42-default
                     X-Openstack-Request-Id: tx000008f5efad48bd19d87-0063e1c6d4-96a42-default
                              Accept-Ranges: bytes
                               Content-Type: text/plain; charset=utf-8
(venv) root@ttt:~# 
```



# 5.3 验证Horizon

重新登录Horizon，项目->对象存储->容器

随便创建一个

![16936493265351693649325696.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936493265351693649325696.png)

创建成功

![16936493485401693649348161.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936493485401693649348161.png)

上传文件，再下载，没问题

![16936493665351693649365784.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936493665351693649365784.png)