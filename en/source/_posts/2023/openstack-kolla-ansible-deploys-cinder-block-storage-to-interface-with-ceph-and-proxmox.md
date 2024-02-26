---
title: OpenStack Kolla-Ansible部署Cinder块存储 对接Ceph，Proxmox
subtitle: OpenStack Kolla-Ansible deploys Cinder block storage to interface with Ceph and Proxmox
date: 2023-02-06 16:01:14
toc: true
tags: 
categories: 
    - 默认
---

 书接上回 [OpenStack Kolla-Ansible部署Glance镜像服务对接Ceph，Proxmox](https://blog.csdn.net/qq_35485875/article/details/128899909)

本章我们继续来完成OpenStack示例配置组件之Web Application中的Cinder块存储服务，OpenStack中的Cinder块存储对接Ceph

![16936501215371693650120968.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936501215371693650120968.png)

![16936501345371693650134249.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936501345371693650134249.png)

![16936501465361693650145937.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936501465361693650145937.png)

------

# 1. 启用 Cinder Ceph 后端

在部署机找到 **/etc/kolla/globals.yml**，并设置

```
enable_cinder: "yes"
cinder_backend_ceph: "yes"
```



# 2. 复制Ceph 配置文件

添加文件/etc/kolla/config/cinder/ceph.conf

内容和/etc/kolla/config/glance/ceph.conf 内容一样，可以使用软连接

```
mkdir -p /etc/kolla/config/cinder && ln -s /etc/kolla/config/glance/ceph.conf /etc/kolla/config/cinder/ceph.conf
```



# 3. 复制Ceph keyring文件

一共有三个

- /etc/kolla/config/cinder/cinder-volume/<ceph_cinder_keyring>
- /etc/kolla/config/cinder/cinder-backup/<ceph_cinder_keyring>
- /etc/kolla/config/cinder/cinder-backup/<ceph_cinder_backup_keyring>

在部署机创建目录

```
mkdir -p /etc/kolla/config/cinder/cinder-volume
mkdir -p /etc/kolla/config/cinder/cinder-backup
```



回到proxmox shell，注意这个10.10.1.80是部署机的ip

```
ceph auth get-or-create client.cinder | ssh 10.10.1.80 sudo tee /etc/kolla/config/cinder/cinder-volume/ceph.client.cinder.keyring
ceph auth get-or-create client.cinder | ssh 10.10.1.80 sudo tee /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder.keyring
ceph auth get-or-create client.cinder-backup | ssh 10.10.1.80 sudo tee /etc/kolla/config/cinder/cinder-backup/ceph.client.cinder-backup.keyring
```



> cinder-backup需要两个密钥环来访问卷和备份池。

# 4. 配置Nova允许访问Cinder卷 

> Ceph RBD 可用作 Nova 实例临时磁盘的存储后端。这避免了对计算节点上实例的本地存储的要求。它提高了迁移性能，因为不需要在管理程序之间复制实例的临时磁盘。

## 4.1 启用 Nova Ceph 后端 

在部署机找到 **/etc/kolla/globals.yml**，并设置

```
nova_backend_ceph: "yes"
```



## 4.2 配置 Ceph 身份验证详细信息

在部署机找到 **/etc/kolla/globals.yml**，并设置

```
ceph_nova_user: "cinder"
```



## 4.3 Ceph 配置文件复制

这里直接软连接glance的ceph.conf就行，所有的ceph.conf都可以是一样

```
mkdir -p /etc/kolla/config/nova/ && ln -s /etc/kolla/config/glance/ceph.conf /etc/kolla/config/nova/ceph.conf
```



## 4.4 Ceph 密钥环文件复制

 回到proxmox shell，注意这个10.10.1.80是部署机的ip

```
ceph auth get-or-create client.cinder | ssh 10.10.1.80 sudo tee /etc/kolla/config/nova/ceph.client.cinder.keyring
```



# 5. 重新部署

回到部署机

```
kolla-ansible -i ./multinode deploy
```



# 6. 验证结果

## 6.1. 验证docker

在任意存储节点 

```
root@control01:~# docker ps | grep cinder
92905efa4637   quay.nju.edu.cn/openstack.kolla/ubuntu-source-cinder-backup:yoga               "dumb-init --single-…"   5 minutes ago   Up 5 minutes (healthy)              cinder_backup
1168528d13a7   quay.nju.edu.cn/openstack.kolla/ubuntu-source-cinder-volume:yoga               "dumb-init --single-…"   5 minutes ago   Up 5 minutes (healthy)              cinder_volume
2a8bbbeb6d1a   quay.nju.edu.cn/openstack.kolla/ubuntu-source-cinder-scheduler:yoga            "dumb-init --single-…"   6 minutes ago   Up 6 minutes (healthy)              cinder_scheduler
39bda6a9fc42   quay.nju.edu.cn/openstack.kolla/ubuntu-source-cinder-api:yoga                  "dumb-init --single-…"   6 minutes ago   Up 6 minutes (healthy)              cinder_api
root@control01:~# 
```



## 6.2 创建卷

回到Horizon，可以看到在 项目 中会多出一个卷。.

![16936501665351693650166117.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936501665351693650166117.png)

这里随便新建一个任意大小的卷，能创建成功就没问题。

![16936501745361693650174022.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936501745361693650174022.png)

回到proxmox看下存储池里面有没有这个卷，注意卷的ID

```
root@pve1:~# rbd ls -p volumes
volume-3c9ccc53-ae51-4000-a85a-47cb9249dd10
```

