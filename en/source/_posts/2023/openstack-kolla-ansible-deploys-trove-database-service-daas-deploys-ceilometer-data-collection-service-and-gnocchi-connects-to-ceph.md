---
title: OpenStack Kolla-Ansible部署Trove数据库服务Daas，部署Ceilometer数据收集服务，Gnocchi对接Ceph
subtitle: OpenStack Kolla-Ansible deploys Trove database service Daas, deploys Ceilometer data collection service, and Gnocchi connects to Ceph
date: 2023-02-07 21:10:48
toc: true
tags: 
categories: 
    - 默认
---

 

书接上回 [OpenStack Kolla-Ansible部署Swift文件存储 对接Ceph RadosGW，Proxmox](https://blog.csdn.net/qq_35485875/article/details/128903360)

本章我们继续来完成OpenStack示例配置组件之Web Application中的Trove数据库服务Daas、eilometer数据收集服务。OpenStack Kolla-Ansible部署Trove数据库服务Daas，部署Ceilometer数据收集服务

> 这两个用kolla-ansible部署非常简单，只需要启用对应配置即可

------

# 1. 配置kolla

在部署机，找到global.yml，启用选项

>  开启ceilometer有前置条件，需要先开启Gnocchi

```
enable_ceilometer: "yes"
enable_ceilometer_ipmi: "yes"
enable_trove: "yes"

enable_gnocchi: "yes"
enable_gnocchi_statsd: "yes"

gnocchi_backend_storage: "ceph"
```


# 2. 配置ceph 

## 2.1 添加存储池

回到Proxmox GUI，创建一个名为gnocchi的存储池，用于保存与资源使用量相关的计量数据 

![16936491315381693649131336.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936491315381693649131336.png)

## 2.2 创建身份

在Proxmox shell 

```
ceph auth get-or-create client.gnocchi mon 'profile rbd' osd 'profile rbd pool=gnocchi' mgr 'profile rbd pool=gnocchi'
```



> Ceph Capabilities能力文档：[User Management — Ceph Documentation](https://docs.ceph.com/en/latest/rados/operations/user-management/#authorization-capabilities) 

## 2.3 复制keyring

 注意：ip是部署机的。文件夹不存在需要先创建

```
ceph auth get-or-create client.gnocchi | ssh 10.10.1.80 sudo tee /etc/kolla/config/gnocchi/ceph.client.gnocchi.keyring
```



## 2.4 复制ceph.conf

直接软链接glance现有的ceph.conf

```
ln -s /etc/kolla/config/glance/ceph.conf /etc/kolla/config/gnocchi/ceph.conf
```



# 3. 检查并重新部署

```
kolla-ansible -i ./multinode prechecks && kolla-ansible -i ./multinode deploy
```



# 4. 完成

![16936491485361693649147609.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936491485361693649147609.png)

------

至此， OpenStack示例配置组件之Web Application（Cinder（块存储）、Glance（镜像服务）、Keystone（身份认证）、Horizon（仪表盘）、Neutron（网络服务）、Nova（计算服务）、Trove（数据库服务）、Swift（对象存储）、Ceilometer（数据收集）、Heat（编排服务））中的所有组件安装完毕

- [OpenStack Yoga安装部署，手把手使用kolla-ansible部署OpenStack](https://blog.csdn.net/qq_35485875/article/details/128868634)
- [OpenStack Kolla-Ansible部署Glance镜像服务对接Ceph，Proxmox](https://blog.csdn.net/qq_35485875/article/details/128899909)
- [OpenStack Kolla-Ansible部署Cinder块存储 对接Ceph，Proxmox](https://blog.csdn.net/qq_35485875/article/details/128901696)
- [OpenStack Kolla-Ansible部署Swift文件存储 对接Ceph RadosGW，Proxmox](https://blog.csdn.net/qq_35485875/article/details/128903360)
- OpenStack Kolla-Ansible部署Trove数据库服务Daas，部署Ceilometer数据收集服务（本文）