---
title: OpenStack Kolla-Ansible部署Octavia负载均衡服务
subtitle: OpenStack Kolla-Ansible deploys Octavia load balancing service
date: 2023-02-07 15:45:33
toc: true
tags: 
categories: 
    - 默认
---

 书接上回 [OpenStack Kolla-Ansible部署Swift文件存储 对接Ceph RadosGW，Proxmox](https://blog.csdn.net/qq_35485875/article/details/128903360)

本章我们继续来完成OpenStack示例配置组件之Container Optimized中的Octavia负载均衡服务，OpenStack Kolla-Ansible部署Octavia负载均衡服务

![16936490115341693649010827.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936490115341693649010827.png)


> Octavia 以服务的形式提供负载均衡。本指南涵盖了为 Amphora 驱动程序配置 Octavia。有关详细信息，请参阅Octavia 文档。安装指南是一个有用的参考。

------

# 1. 启用 Octavia 

进入部署机，找到 /etc/kolla/globals.yml，并设置

```
enable_octavia: "yes"
```



# 2. 自动生成证书

```
kolla-ansible octavia-certificates
```



证书和密钥将在 /etc/kolla/config/octavia.

# 3. 重新部署

```
kolla-ansible -i ./multinode deploy --tags common,horizon,octavia
```



# 4. 构建Amphora镜像

##  4.1 安装依赖

```
sudo apt -y install debootstrap qemu-utils git kpartx
```



## 4.2 获取 Octavia 源代码

建议用国内git平台镜像一份

```
# 官网命令（不建议）
# git clone https://opendev.org/openstack/octavia -b stable/yoga
# 镜像
git clone https://jihulab.com/eric-gitta-moore/octavia.git -b stable/yoga
```



## 4.3 安装diskimage-builder

```
python3 -m venv dib-venv
source dib-venv/bin/activate
pip install diskimage-builder
```



## 4.4 镜像源

> 下一步需要下载大量文件，需要克隆几个仓库，建议使用jihulab.com。如果网关有魔法可以跳过这一步。

下面是需要设置的部分环境变量 

- DIB_REPOLOCATION_amphora_agent（将安装在映像中的 amphora-agent 代码的位置）

默认值：https ://opendev.org/openstack/octavia

- DIB_REPOLOCATION_octavia_lib（将安装在映像中的 octavia-lib 代码的位置）

默认值：https ://opendev.org/openstack/octavia-lib

- DIB_PYPI_MIRROR_URL
- DIB_REPOLOCATION_upper_constraints（upper-constraints.txt依赖包）

默认值：https://opendev.org/openstack/requirements/raw/branch/master/upper-constraints.txt

- DIB_DISTRIBUTION_MIRROR（所选基本操作系统的镜像 URL）

注意，这个镜像url是给Ubuntu用的，必须是http。推荐使用中国科学技术大学镜像（http）

导出环境变量

```
export DIB_REPOLOCATION_amphora_agent=https://jihulab.com/eric-gitta-moore/octavia.git
export DIB_REPOLOCATION_octavia_lib=https://jihulab.com/eric-gitta-moore/octavia-lib.git
export DIB_DISTRIBUTION_MIRROR=http://mirrors.ustc.edu.cn/ubuntu
export DIB_REPOLOCATION_upper_constraints=https://jihulab.com/eric-gitta-moore/requirements/-/raw/stable/yoga/upper-constraints.txt
export DIB_PYPI_MIRROR_URL=https://pypi.tuna.tsinghua.edu.cn/simple
export DIB_NO_PYPI_PIP=1
```



### 

## 4.5 创建 Amphora 镜像 

```
cd octavia/diskimage-create
./diskimage-create.sh
```



构建成功输出如下

```
2023-02-07 07:17:59.379 | Converting image using qemu-img convert
2023-02-07 07:18:48.341 | Image file /root/octavia/diskimage-create/amphora-x64-haproxy.qcow2 created...
2023-02-07 07:18:48.486 | Build completed successfully
Successfully built the amphora using the stable/zed amphora-agent.
Amphora image size: /root/octavia/diskimage-create/amphora-x64-haproxy.qcow2 380361216
```



 完成后执行，注意切换python虚拟环境

```
kolla-ansible post-deploy
```



### 4.5.1 常见问题 

有可能会碰到依赖版本冲突，整理日志之后如下

```
2023-02-07 05:26:03.331 | ERROR: Cannot install octavia because these package versions have conflicting dependencies.
2023-02-07 05:26:03.332 | 
2023-02-07 05:26:03.332 | The conflict is caused by:
2023-02-07 05:26:03.332 |     keystonemiddleware 9.4.0 depends on oslo.cache>=1.26.0
2023-02-07 05:26:03.332 |     The user requested (constraint) oslo-cache===2.10.1
2023-02-07 05:26:03.332 | 
2023-02-07 05:26:03.332 | To fix this you could try to:
2023-02-07 05:26:03.332 | 1. loosen the range of package versions you've specified
2023-02-07 05:26:03.332 | 2. remove package versions to allow pip attempt to solve the dependency conflict
2023-02-07 05:26:03.332 | 
2023-02-07 05:26:03.332 | ERROR: ResolutionImpossible: for help visit https://pip.pypa.io/en/latest/topics/dependency-resolution/#dealing-with-dependency-conflicts
2023-02-07 05:26:08.775 | Unmount /tmp/dib_build.vAReHkDS/mnt/var/cache/apt/archives
```



或者

```
2023-02-07 06:58:49.465 |      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 119.9/119.9 kB 341.3 kB/s eta 0:00:00
2023-02-07 06:58:52.487 | ERROR: Cannot install octavia==11.0.1.dev16 because these package versions have conflicting dependencies.
2023-02-07 06:58:52.488 | 
2023-02-07 06:58:52.488 | The conflict is caused by:
2023-02-07 06:58:52.488 |     octavia 11.0.1.dev16 depends on octavia-lib>=3.1.0
2023-02-07 06:58:52.488 |     The user requested (constraint) octavia-lib===2.5.0
2023-02-07 06:58:52.488 | 
2023-02-07 06:58:52.488 | To fix this you could try to:
2023-02-07 06:58:52.488 | 1. loosen the range of package versions you've specified
2023-02-07 06:58:52.488 | 2. remove package versions to allow pip attempt to solve the dependency conflict
2023-02-07 06:58:52.488 | 
2023-02-07 06:58:52.488 | ERROR: ResolutionImpossible: for help visit https://pip.pypa.io/en/latest/topics/dependency-resolution/#dealing-with-dependency-conflicts
2023-02-07 06:59:02.344 | Unmount /tmp/dib_build.AUyWgqMg/mnt/var/cache/apt/archives
```



 这个之后需要手动编辑 **upper-constraints.txt** 

先把文件下载过来

```
wget https://jihulab.com/eric-gitta-moore/requirements/-/raw/stable/yoga/upper-constraints.txt -O /tmp/upper-constraints.txt
```



然后编辑 **upper-constraints.txt**

注释冲突的软件包

```
# oslo.cache===2.10.1
# octavia-lib===2.5.0
```



修改环境变量

```
export DIB_REPOLOCATION_upper_constraints=file:///tmp/upper-constraints.txt
```



 重新构建镜像 

# 5. 激活octavia授权

```
. /etc/kolla/octavia-openrc.sh
```



# 6. 在 Glance 中注册镜像

```
openstack image create amphora-x64-haproxy.qcow2 --container-format bare --disk-format qcow2 --private --tag amphora --file /root/octavia/diskimage-create/amphora-x64-haproxy.qcow2 --property hw_architecture='x86_64' --property hw_rng_model=virtio
```



# 7. 验证结果

## 7.1 验证命令行

列出所有负载均衡器

```
openstack loadbalancer list
```



如果出现

```
openstack: 'loadbalancer' is not an openstack command. See 'openstack --help'.
```



安装python-octaviaclient

```
pip install python-octaviaclient
```



没报错就可以了