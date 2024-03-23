---
title: OpenStack使用Skyline Dashboard面板替换默认Horizon面板
subtitle: OpenStack replaces the default Horizon panel with the Skyline Dashboard panel
date: 2023-02-03 20:31:23
toc: true
tags: 
categories: 
    - 默认
---


 书接上回 [OpenStack Yoga安装使用kolla-ansible](https://blog.csdn.net/qq_35485875/article/details/128868634) 

> 忘记提示了。如果截止发稿今天，使用最新zed版本，在最后一步部署阶段会报错，好像是rabbitMQ重启失败。所以建议使用最新版再退一个版本

------

# 官方文档

[skyline-apiserver/README-zh_CN.md at master - skyline-apiserver - OpenDev: Free Software Needs Free Tools](https://opendev.org/openstack/skyline-apiserver/src/branch/master/kolla/README-zh_CN.md)

# 先决条件 

- 一个至少运行核心组件的 OpenStack 环境, 并能通过 Keystone endpoint 访问 OpenStack 组件
- 一个安装有容器引擎的 (docker 或 podman) 的 Linux 服务器

# 1. 镜像源

找到github中OpenStack对应与openstack/skyline-apiserver的镜像，即

```
# 官方https://opendev.org/openstack/skyline-apiserver
# github 如下
https://github.com/openstack/skyline-apiserver
```



任意找一个国内git平台克隆一份。我这里使用jihulab.com

![16936505705351693650569618.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936505705351693650569618.png)

# 2. 下载skyline.yaml

找到etc/skyline.yaml.sample，这个文件

打开这个文件原始链接，下载到服务器去

![16936505805351693650580144.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936505805351693650580144.png)

得到如下链接

```
https://jihulab.com/eric-gitta-moore/skyline-apiserver/-/raw/master/etc/skyline.yaml.sample
```



 然后输入下面命令，下载到本地

```
mkdir /etc/skyline && wget https://jihulab.com/eric-gitta-moore/skyline-apiserver/-/raw/master/etc/skyline.yaml.sample  -O /etc/skyline/skyline.yaml
```



# 3. 编辑配置skyline.yaml

根据实际的环境修改以下参数

- database_url

 修改为如下，注意：ip是浮动IP，SKYLINE_DBPASS这个是数据库用户密码 可以自定义

```
  database_url: mysql://skyline:SKYLINE_DBPASS@10.10.1.250:3306/skyline
```



- keystone_url

将 127.0.0.1 修改为浮动IP

```
  keystone_url: http://10.10.1.250:35357/v3/
```



- prometheus_endpoint

```
  prometheus_endpoint: http://10.10.1.250:9091
```



- system_user_password

设置你的skyline密码

```
  system_user_password: 'SKYLINE_PASS'
```



# 4. 配置数据库

## 4.1 创建 skyline 数据库

进入docker环境，命令：docker exec -it mariadb bash

```
root@ubuntu:~# docker exec -it mariadb bash
(mariadb)[mysql@ubuntu /]$ 
```



获取mariadb密码

```
cat /etc/kolla/passwords.yml | grep ^database_password
```



连接mariadb，命令：mysql -u root -p

```
(mariadb)[mysql@ubuntu /]$ mysql -u root -p
Enter password: 
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 6407
Server version: 10.6.11-MariaDB-1:10.6.11+maria~ubu2004-log mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> 
```



创建数据库

```
CREATE DATABASE IF NOT EXISTS skyline DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
```



## 4.2 授予对数据库的适当访问权限

SKYLINE_DBPASS是数据库用户密码

```
GRANT ALL PRIVILEGES ON skyline.* TO 'skyline'@'localhost' IDENTIFIED BY 'SKYLINE_DBPASS';
GRANT ALL PRIVILEGES ON skyline.* TO 'skyline'@'%'  IDENTIFIED BY 'SKYLINE_DBPASS';
```



之后推出MariaDB环境，输入exit

再退出docker环境，输入exit

## 5. 创建 skyline 服务凭证

如果没有进入python虚拟环境，先激活

```
source /path/to/venv/bin/activate
```



 然后创建服务凭证

```
(venv) root@ubuntu:~# . /etc/kolla/admin-openrc.sh
(venv) root@ubuntu:~# openstack user create --domain default --password SKYLINE_PASS skyline
+---------------------+----------------------------------+
| Field               | Value                            |
+---------------------+----------------------------------+
| domain_id           | default                          |
| enabled             | True                             |
| id                  | cef488018dd542d9b12a6260f1413194 |
| name                | skyline                          |
| options             | {}                               |
| password_expires_at | None                             |
+---------------------+----------------------------------+
(venv) root@ubuntu:~# openstack role add --project service --user skyline admin
(venv) root@ubuntu:~# 
```



# 6. 运行 skyline_bootstrap 容器进行初始化引导

这里注意使用源

```
# 官网命令
# docker run -d --name skyline_bootstrap -e KOLLA_BOOTSTRAP="" -v /etc/skyline/skyline.yaml:/etc/skyline/skyline.yaml --net=host 99cloud/skyline:latest
```



这里我使用南京大学的docker hub源

```
docker run -d --name skyline_bootstrap -e KOLLA_BOOTSTRAP="" -v /etc/skyline/skyline.yaml:/etc/skyline/skyline.yaml --net=host docker.nju.edu.cn/99cloud/skyline:latest
```



# 7. 初始化引导完成后运行 skyline 服务

 删除引导容器

```
docker rm -f skyline_bootstrap
```



运行 skyline 服务

```
docker run -d --name skyline --restart=always -v /etc/skyline/skyline.yaml:/etc/skyline/skyline.yaml --net=host docker.nju.edu.cn/99cloud/skyline:latest
```



------

完成。

现在你可以访问仪表盘: https://<浮动ip>:9999

![16936505995351693650598690.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936505995351693650598690.png)

![16936506075361693650606920.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936506075361693650606920.png)

![16936506155351693650614565.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936506155351693650614565.png)
