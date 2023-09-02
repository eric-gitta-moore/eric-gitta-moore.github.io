---
title: OpenStack Kolla-Ansible部署Zun容器服务，Zun对接Ceph存储Proxmox
subtitle: OpenStack Kolla-Ansible deploys Zun container service, and Zun connects to Ceph storage Proxmox
date: 2023-02-09 19:28:26
toc: true
---

 书接上回 [OpenStack Kolla-Ansible部署Designate域名解析服务DNS服务DNSaas](https://blog.csdn.net/qq_35485875/article/details/128921256)

本章我们继续来完成OpenStack示例配置组件之Container Optimized中的Zun容器服务。OpenStack Kolla-Ansible部署Zun容器服务。

> Zun 是一种 OpenStack 容器服务。它旨在提供一个 OpenStack API，用于在 OpenStack 上配置和管理容器化工作负载。

------

# 1. 设置kolla

在部署机，找到 /etc/kolla/globals.yml 

```
enable_zun: "yes"
enable_kuryr: "yes"
enable_etcd: "yes"
docker_configure_for_zun: "yes"
containerd_configure_for_zun: "yes"
```



另外再添加一行

```
zun_configure_for_cinder_ceph: "yes"
```



## 1.1 复制ceph文件

> 需要cinder先对接ceph

```
mkdir -p /etc/kolla/config/zun/zun-compute
ln -s /etc/kolla/config/cinder/ceph.conf /etc/kolla/config/zun/zun-compute/ceph.conf
ln -s  /etc/kolla/config/cinder/ceph.client.cinder.keyring /etc/kolla/config/zun/zun-compute/ceph.client.cinder.keyring
```





# 2. 重新引导

```
kolla-ansible -i ./multinode bootstrap-servers
```



## 2.1 常见问题 

### 2.1.1 找不到ceph软件包

报错如下

> The repository 'https://mirror.nju.edu.cn/ceph/debian-pacific jammy Release' does not have a Release file

```
TASK [openstack.kolla.baremetal : Enable ceph apt repository] ************************************************************************************************************************************************************************
task path: /root/.ansible/collections/ansible_collections/openstack/kolla/roles/baremetal/tasks/configure-ceph-for-zun.yml:12
Using module file /path/to/venv/lib/python3.10/site-packages/ansible/modules/apt_repository.py
Pipelining is enabled.
<localhost> ESTABLISH LOCAL CONNECTION FOR USER: root
<localhost> EXEC /bin/sh -c 'python && sleep 0'
fatal: [localhost]: FAILED! => {
    "changed": false,
    "invocation": {
        "module_args": {
            "codename": null,
            "filename": "ceph",
            "install_python_apt": true,
            "mode": null,
            "repo": "deb https://mirror.nju.edu.cn/ceph/debian-pacific/ jammy main",
            "state": "present",
            "update_cache": true,
            "update_cache_retries": 5,
            "update_cache_retry_max_delay": 12,
            "validate_certs": true
        }
    },
    "msg": "Failed to update apt cache: E:The repository 'https://mirror.nju.edu.cn/ceph/debian-pacific jammy Release' does not have a Release file., W:Updating from such a repository can't be done securely, and is therefore disabled by default., W:See apt-secure(8) manpage for repository creation and user configuration details., W:https://mirrors.tuna.tsinghua.edu.cn/docker-ce/linux/ubuntu/dists/jammy/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details."
}
```



原因：ceph官方仓库没有jammy版本的软件包，但是Ubuntu官方有ceph-common这个软件包

```
(venv) root@ubuntu:~# apt search ceph-common
Sorting... Done
Full Text Search... Done
ceph-common/jammy-updates 17.2.0-0ubuntu0.22.04.2 amd64
  common utilities to mount and interact with a ceph storage cluster

python3-ceph-common/jammy-updates 17.2.0-0ubuntu0.22.04.2 all
  Python 3 utility libraries for Ceph
```



解决，关闭zun自动配置ceph，

```
zun_configure_for_cinder_ceph = "no"
```



 手动安装ceph-common软件包

```
apt install ceph-common -y
```



# 3. 重新部署

```
kolla-ansible -i ./multinode deploy
```



# 4. 生成凭据文件

```
kolla-ansible -i ./multinode post-deploy
```



# 5. 安装zun cli客户端

```
pip install python-zunclient
```

