---
title: OpenStack Kolla-Ansible部署Glance镜像服务对接Ceph，Proxmox
subtitle: OpenStack Kolla-Ansible deploys Glance image service to connect with Ceph and Proxmox
date: 2023-02-06 15:18:56
toc: true
tags: 
categories: 
    - 默认
---

 书接上回 [OpenStack Yoga安装部署，手把手使用kolla-ansible部署OpenStack](https://blog.csdn.net/qq_35485875/article/details/128868634)

本章我们继续来，OpenStack中的Glance镜像服务对接Ceph

![16936502745351693650274372.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936502745351693650274372.png)

------



# 1. 启用 Glance Ceph 后端

在部署机上找到 /etc/kolla/globals.yml

讲 glance_backend_ceph 修改为 yes

```
glance_backend_ceph: "yes"
```



# 2. 创建存储池

进入proxmox shell

 创建Cinder和Glance所需的存储池

> 存储池名字不要改！！！除非你知道如何修改其他参数

```
ceph osd pool create volumes
ceph osd pool create images
ceph osd pool create backups
ceph osd pool create vms
```



新创建的池必须在使用前进行初始化。使用该rbd工具初始化池：

```
rbd pool init volumes
rbd pool init images
rbd pool init backups
rbd pool init vms
```



# 3. 配置 OPENSTACK CEPH 客户端

只要使用了ceph客户端就需要ceph.conf。这里需要在每个需要使用到ceph客户端的节点创建一个ceph.conf

找到proxmox ceph中的配置文件

在gui中的 “数据中心->节点->Ceph->配置->左上角的配置” 这里就是ceph.conf，对应于文件系统中的 "/etc/ceph/ceph.conf"

![16936502865351693650285724.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936502865351693650285724.png)

在部署机的 **/etc/kolla/config/glance/ceph.conf** 中粘贴这个文件（没有这个文件的话创建一个）

最后只保留 [global] 节点，其他的都删了。注意取消缩进

![16936503145351693650314515.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936503145351693650314515.png)

# 4. 创建glance cinder ceph账户

```
ceph auth get-or-create client.glance mon 'profile rbd' osd 'profile rbd pool=images' mgr 'profile rbd pool=images'
ceph auth get-or-create client.cinder mon 'profile rbd' osd 'profile rbd pool=volumes, profile rbd pool=vms, profile rbd-read-only pool=images' mgr 'profile rbd pool=volumes, profile rbd pool=vms'
ceph auth get-or-create client.cinder-backup mon 'profile rbd' osd 'profile rbd pool=backups' mgr 'profile rbd pool=backups'
```



# 5. 复制keyring

将 Ceph keyring复制到 **/etc/kolla/config/glance/ceph.client.glance.keyring**，注意10.10.1.80是部署机

```
ceph auth get-or-create client.glance | ssh 10.10.1.80 sudo tee /etc/kolla/config/glance/ceph.client.glance.keyring
```



# 6. 重新部署

在部署机

```
kolla-ansible -i ./multinode deploy
```



# 7. 验证

## 7.1 上传镜像

下载一个cirros-0.6.1-x86_64-disk.img镜像测试（很小20M）

![16936503265361693650326517.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936503265361693650326517.png)

 看到是运行中，那就大差不差已经成功了

![16936503425391693650342492.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936503425391693650342492.png)

## 7.2 验证存储池文件列表

回到proxmox shell中，输入

```
rbd ls -p images
```



显示如下，再对比一下上图的id，是一致的，说明成功了

```
root@pve1:~# rbd ls -p images
255dd8a4-c442-4d09-a1a1-878466424253
```

