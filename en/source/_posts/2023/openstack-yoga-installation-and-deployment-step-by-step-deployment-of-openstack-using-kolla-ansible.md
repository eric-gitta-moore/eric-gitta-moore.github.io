---
title: OpenStack Yoga安装部署，手把手使用kolla-ansible部署OpenStack
subtitle: OpenStack Yoga installation and deployment, step-by-step deployment of OpenStack using kolla-ansible
date: 2023-02-10 18:25:01
toc: true
tags: 
categories: 
    - 默认
---

> 基本上是按照官网文档快速入门进行安装，不过还有很多地方需要换源。重点在换源这块。如果说你的网关有魔法，那就不用看这篇文章了，直接复制官网命令安装。

# 目标 

部署OpenStack官方提供的Simple Configuration示例配置中的Web Application和Container Optimized两个组件配置清单。

其中包括

- Web Application：Cinder（块存储）、Glance（镜像服务）、Keystone（身份认证）、Horizon（仪表盘）、Neutron（网络服务）、Nova（计算服务）、Trove（数据库服务）、Swift（对象存储）、Ceilometer（数据收集）、Heat（编排服务）
- Container Optimized（增量）：Kuryr（容器网络集成）、Barbican（密钥服务）、Designate（DNS服务）、Manila（文件存储）、Octavia（负载均衡器）、Placement（资源监控）

更多OpenStack landscape景观图可以参考官方或者 [OPENSTACK LANDSCAPE云原生景观 | OpenStack地图_JamesCurtis的博客-CSDN博客](https://blog.csdn.net/qq_35485875/article/details/128894934)

#  支持的操作系统

注意：不再支持 CentOS 7 作为主机操作系统。Train 版本同时支持 CentOS 7 和 8，并提供了迁移路径。有关迁移到 CentOS 8 的信息，请参阅Kolla Ansible Train 文档。

yoga版本支持以下操作系统：

- CentOS Stream 8
- Debian Bullseye (11)
- openEuler 20.03 LTS SP2
- RHEL 8 (deprecated)
- Rocky Linux 8
- Ubuntu Focal (20.04)

我这里使用的是Ubuntu 22.04 LTS（mini安装）

下面开始安装

# 1. 安装系统依赖

## 1.1. 更新软件包索引

```
sudo apt update
```



## 1.2. 安装python依赖

```
sudo apt install git python3-dev libffi-dev gcc libssl-dev
```



# 2. 安装python-venv虚拟环境依赖

## 2.1 安装python3-venv

```
sudo apt install python3-venv
```



## 2.2 创建虚拟环境并激活它

```
mkdir /path && mkdir /path/to # 也可以自定路径
python3 -m venv /path/to/venv
source /path/to/venv/bin/activate
```



## 2.3 确保安装了最新版本的pip

```
python -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --upgrade pip
```



##  2.4 pypi换源

```
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```



## 2.5 安装Ansible

```
pip install 'ansible>=4,<6'
```



# 3. 安装Kolla-Ansible

## 3.1 kolla

```
# pip install git+https://opendev.org/openstack/kolla-ansible@stable/yoga
# 上面是原版命令，建议使用jihulab.com克隆一份
pip install git+https://jihulab.com/james-curtis/kolla-ansible@stable/yoga
```



## 3.2 创建文件夹/etc/kolla

```
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla
```



## 3.3 复制 globals.yml 和 passwords.yml 到 /etc/kolla

```
# 如果你使用了自定义路径，记得替换/path/to
cp -r /path/to/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
```



## 3.4 复制清单文件

```
cp /path/to/venv/share/kolla-ansible/ansible/inventory/* .
```



# 4. 安装Ansible Galaxy依赖

## 4.1 换源

找到 /path/to/venv/share/kolla-ansible/requirements.yml 

内容如下

```
---
collections:
  - name: https://opendev.org/openstack/ansible-collection-kolla
    type: git
    version: stable/yoga
```



修改这个git仓库地址，如果镜像拉不下，建议去拉github的OpenStack镜像

修改成如下

```
---
collections:
  - name: https://jihulab.com/james-curtis/ansible-collection-kolla
    type: git
    version: stable/yoga
```



## 4.2 安装Kolla-Ansible-Collections依赖

```
kolla-ansible install-deps
```



## 4.3 docker换源 && 指定docker版本到20.10.*

> 这里不换源是可以的。但是截止docker 23.0.0发布时间之后再来使用kolla-ansible，首次安装没问题，后续如果要添加删除组件的话就会报错。原因是docker删除了容器的 `KernelMemory` 属性，但是kolla需要读取，导致数组下标不存在报错
>
> 请参阅：[Kolla-Ansible deploy部署报错 KeyError: \\‘KernelMemory_JamesCurtis的博客-CSDN博客](https://blog.csdn.net/qq_35485875/article/details/128877591)



```
sed -i.bak 's/https:\/\/download\.docker\.com/https:\/\/mirrors\.tuna\.tsinghua\.edu\.cn\/docker-ce/g'   /root/.ansible/collections/ansible_collections/openstack/kolla/roles/baremetal/defaults/main.yml
sed  -i.bak  's/_package: "docker-ce"/_package: "docker-ce=5:20.10*"/g'   /root/.ansible/collections/ansible_collections/openstack/kolla/roles/baremetal/defaults/main.yml
```



## 4.4 配置Ansible

```
mkdir /etc/ansible 
echo "[defaults]
host_key_checking=False
pipelining=True
forks=100" > /etc/ansible/ansible.cfg
```



# 5. 准备初始化配置

如果单机部署，你也可以跳过此步骤，然后使用 all-in-one 清单，后续如果再增加机器可以切换回到 multinode 清单，只需要注意修改好机器主机名就行。

> 对于all-in-one虚拟环境中的场景，将以下内容添加到all-in-one清单的最开头
>
> ```
> localhost ansible_python_interpreter=python
> ```
>
> 

## 5.1 修改配置文件

> 我这里使用3+1机器演示，
>
> 1 x 部署机：10.10.1.80/24
>
> 节点01：10.10.1.81/24 control01
>
> 节点02：10.10.1.82/24 control02
>
> 节点03：10.10.1.83/24 control03

这里仅仅展示 [baremetal:children] 节点之前的配置文件，切勿照搬！！！ 

```
# These initial groups are the only groups required to be modified. The
# additional groups are for more control of the environment.
[control]
# These hostname must be resolvable from your deployment host
control01  hostname=control01 ansible_user=root ansible_password=1
control02  hostname=control02 ansible_user=root ansible_password=1
control03  hostname=control03 ansible_user=root ansible_password=1
 
# The above can also be specified as follows:
# control[01:03]     ansible_user=kolla
 
# The network nodes are where your l3-agent and loadbalancers will run
# This can be the same as a host in the control group
# [network]
# network01
# network02
 
# when you specify group_name:children, it will use contents of group specified.
[network:children]
control
 
 
# [compute]
# compute01
[compute:children]
control
 
[monitoring:children]
control
# [monitoring]
# control01   ansible_user=root ansible_password=1 ansible_become=true
# monitoring01
 
# When compute nodes and control nodes use different interfaces,
# you need to comment out "api_interface" and other interfaces from the globals.yml
# and specify like below:
#compute01 neutron_external_interface=eth0 api_interface=em1 storage_interface=em1 tunnel_interface=em1
 
# [storage]
# storage01
[storage:children]
control
 
[deployment]
deploy       ansible_connection=local
 
# 下接[baremetal:children]
```



## 5.2 修改hosts

如果使用 all-in-one 清单，这一步也可以跳过

编辑/etc/hosts文件，注意替换成自己的机器的内网ip

> 只需要修改部署机。后续使用bootstrap-server命令之后会同步到所有节点

```
# 这里是deploy机器上的文件
127.0.0.1 localhost
10.10.1.80 deploy
10.10.1.81 control01
10.10.1.82 control02
10.10.1.83 control03
```



## 5.3 安装 sshpass

```
apt install sshpass -y
```



## 5.4 配置ssh密钥对

```
ssh-keygen
```



一路回车

```
ssh-copy-id 10.10.1.81
# 注意替换自己的内网ip
```



输入yes同意指纹，然后输入密码。就可以了

```
# 看下如下提示就是成功了
root@10.10.1.81's password: 

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh '10.10.1.81'"
and check to make sure that only the key(s) you wanted were added.
```



## 5.5 检查清单配置是否正确

```
ansible -i multinode all -m ping
```



返回下面结果就是成功

```
(venv) root@ubuntu:~# ansible -i multinode all -m ping
[WARNING]: Invalid characters were found in group names but not replaced, use -vvvv to see details
localhost | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
control01 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```



# 6. 生成密码

```
kolla-genpwd
```



# 7. 配置globals.yml

先安装一下vim

```
apt install vim -y
```



编辑

```
vim /etc/kolla/globals.yml
```



 先不要进入编辑模式，输入下面，显示行号

```
:set number
```



## 7.1 修改基础镜像发行版

默认是centos，要修改为debian。默认的centos有一些镜像不存在

```
sed -i.bak 's/#kolla_base_distro: "centos"/kolla_base_distro: "debian"/' /etc/kolla/globals.yml
```



## 7.2 编辑网络接口

这里，vim的基本使用不在赘述

**搜索第一个网口接口**，并修改为对应配置（可以通过 ip a 查看接口名字）

>  设置的第一个接口是“ Network_interface”。这是多个管理类型网络的默认接口。

```
network_interface: "eth0"
```



**搜索并设置第二个接口**

> 所需的第二个接口专用于Neutron外部（或公共）网络，可以是vlan或flat，这取决于网络的创建方式。此接口应处于活动状态，没有IP地址。否则，实例将无法访问外部网络。

 这里说人话，就是第二个接口需要给他一个空闲的网口

```
neutron_external_interface: "eth1"
```



**搜索并设置浮动ip**

> 接下来，我们需要为管理流量提供浮动IP。该IP将由keepalive管理，以提供高可用性，并且应设置为在连接到我们网络接口的管理网络中不使用的地址。

这里说人话就是，浮动ip不要和network_interface中的地址冲突（一般是DHCP），比如说network_interface所在DHCP范围是10.1.1.100-10.1.1.200。那么浮动ip就不建议在这个范围内,而应该选择如10.1.1.201

```
kolla_internal_vip_address: "10.1.0.250"
```



编辑完成，按下Esc，再输入

```
:wq
```



保存退出

# 8. 部署

## 8.1 docker quay.io换源

```
sed -i.bak 's/#docker_registry:/docker_registry: quay.nju.edu.cn/g' /etc/kolla/globals.yml
```



## 8.2 引导服务器

```
kolla-ansible -i ./multinode bootstrap-servers
```



完成后检查docker版本，确定在20.10.xx。不然后面所有使用kolla-ansible的改动都会报错KernelMemory

确保Server: Docker Engine版本在20.10.xx就行

```
(venv) root@ubuntu:~# docker version
Client: Docker Engine - Community
 Version:           23.0.0
 API version:       1.41 (downgraded from 1.42)
 Go version:        go1.19.5
 Git commit:        e92dd87
 Built:             Wed Feb  1 17:47:51 2023
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          20.10.23
  API version:      1.41 (minimum version 1.12)
  Go version:       go1.18.10
  Git commit:       6051f14
  Built:            Thu Jan 19 17:42:57 2023
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.16
  GitCommit:        31aa4358a36870b21a992d3ad2bef29e1d693bec
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```





## 8.3 对主机进行部署前检查

```
kolla-ansible -i ./multinode prechecks -vvv
```



## 8.4 最后进行实际的 OpenStack 部署

```
kolla-ansible -i ./multinode deploy -vvv
```



当本脚本完成时，OpenStack 应该启动、运行并正常运行！

```
PLAY RECAP ******************************************************************************************************************************************************************
control01                  : ok=308  changed=218  unreachable=0    failed=0    skipped=169  rescued=0    ignored=1   
localhost                  : ok=4    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
```



访问浮动ip地址就是前台页面，如果显示证书错误，那意思就是密码错误

![16936507065351693650705770.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936507065351693650705770.png)

账号为admin

查看密码：

> 也可以在post-deploy命令执行之后，去这个文件里面看/etc/kolla/admin-openrc.sh

```
cat /etc/kolla/passwords.yml |grep keystone_admin_password
```

![16936507155351693650715007.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936507155351693650715007.png)

# 9. 使用 OpenStack 

## 9.1 安装 OpenStack CLI 客户端

官方命令（网络能通的可以试试）

```
pip install python-openstackclient -c https://releases.openstack.org/constraints/upper/yoga
```



如果文件获取不了建议，打开这个链接，之后会跳转到
 https://opendev.org/openstack/requirements/raw/branch/stable/yoga/upper-constraints.txt
 再去github的OpenStack镜像，即 github.com/openstack/requirements
 然后克隆这个仓库到jihulab.com

记得选择对应的分支

![16936507355351693650735288.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936507355351693650735288.png)

 ，接着找到对应的文件



![16936507435351693650743477.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936507435351693650743477.png)

打开原始文件，得到下面链接

```
https://jihulab.com/james-curtis/requirements/-/raw/stable/yoga/upper-constraints.txt
```



替换官方命令，并执行

```
pip install python-openstackclient -c https://jihulab.com/james-curtis/requirements/-/raw/stable/yoga/upper-constraints.txt
```



## 9.2 OpenStack 需要一个 openrc 文件

其中设置了管理员用户的凭据。要生成此文件

```
kolla-ansible post-deploy
. /etc/kolla/admin-openrc.sh
```



> .(点)+(空格)+可执行文件 == source+(空格)+可执行文件

接下来就可以使用OpenStack CLI了



------

至此OpenStack安装完成

------

后续：

- OpenStack使用Skyline Dashboard面板替换默认Horizon面板
- OpenStack增加节点或者减少节点，横向拓展节点
- ProxmoxVE+Ceph+OpenStack HCI超融合平台搭建，配置Bcache加速Ceph SDS