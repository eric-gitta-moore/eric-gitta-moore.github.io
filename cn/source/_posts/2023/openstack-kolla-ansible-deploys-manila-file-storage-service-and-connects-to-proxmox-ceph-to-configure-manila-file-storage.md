---
title: OpenStack Kolla-Ansible部署Manila文件存储服务，对接Proxmox Ceph配置Manila文件存储
subtitle: OpenStack Kolla-Ansible deploys Manila file storage service and connects to Proxmox Ceph to configure Manila file storage
date: 2023-02-07 16:38:59
toc: true
tags: 
categories: 
    - 默认
---

 书接上回 [OpenStack Kolla-Ansible部署Octavia负载均衡服务](https://blog.csdn.net/qq_35485875/article/details/128916441)

本章我们继续来完成OpenStack示例配置组件之Container Optimized中的Octavia负载均衡服务，OpenStack Kolla-Ansible部署Octavia负载均衡服务

> Manila 是 OpenStack 共享文件系统服务，用于将共享文件系统作为服务提供。马尼拉的一些目标是/拥有：
>
> - **基于组件的架构**：快速添加新行为
> - **高可用**：扩展到非常严重的工作负载
> - **容错**：隔离进程避免级联故障
> - **可恢复**：故障应该易于诊断、调试和纠正
> - **开放标准**：成为社区驱动的 api 的参考实现

![16936488665401693648866003.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936488665401693648866003.png)

------



# 1. 配置kolla

在部署机，globals.yml

```
enable_manila: "yes"
enable_manila_backend_cephfs_native: "yes"
```



# 2. 添加ceph身份信息

在Proxmox shell

```
ceph auth get-or-create client.manila mgr 'allow rw' mon 'allow r'
```



# 3. 配置Ceph 密钥环

将 Ceph 密钥环复制到 /etc/kolla/config/manila/ceph.client.manila.keyring

注意ip是部署机的，没有文件夹的话先创建

```
ssh 10.10.1.80 "sudo mkdir -p /etc/kolla/config/manila"
ceph auth get-or-create client.manila | ssh 10.10.1.80 sudo tee /etc/kolla/config/manila/ceph.client.manila.keyring
```



# 4. 复制ceph.conf

由于glance已经有ceph.conf，所以可以直接软连接

> 更多请参阅：[OpenStack Kolla-Ansible部署Glance镜像服务对接Ceph，Proxmox_JamesCurtis的博客-CSDN博客](https://blog.csdn.net/qq_35485875/article/details/128899909) 

```
ln -s /etc/kolla/config/glance/ceph.conf /etc/kolla/config/manila/ceph.conf
```



# 5. 重新部署

```
kolla-ansible -i ./multinode deploy
```



# 6. 验证

## 6.1 命令行

安装cli客户端 

```
pip install python-manilaclient
```



列出共享

```
manila list
```

