---
title: OpenStack Kolla-Ansible部署Designate域名解析服务DNS服务DNSaas
subtitle: OpenStack Kolla-Ansible deploys Designate domain name resolution service DNS service DNSaas
date: 2023-02-07 18:36:53
toc: true
tags: 
categories: 
    - 默认
---

 书接上回 [OpenStack Kolla-Ansible部署Manila文件存储服务，对接Proxmox Ceph配置Manila文件存储](https://blog.csdn.net/qq_35485875/article/details/128920630)

本章我们继续来完成OpenStack示例配置组件之Container Optimized中的Designate域名解析服务，OpenStack Kolla-Ansible部署Designate域名解析服务DNS服务DNSaas

> Designate 是 OpenStack 的多租户 DNSaaS 服务。它提供了一个带有集成 Keystone 身份验证的 REST API。它可以配置为根据 Nova 和 Neutron 操作自动生成记录。Designate 支持多种 DNS 服务器，包括 Bind9 和 PowerDNS 4。

![16936487215361693648721484.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936487215361693648721484.png)


# 1. 启用 Designate 服务

在部署机，找到/etc/kolla/globals.yml

```
enable_designate: "yes"
```



# 2. 配置 Designate 选项

指定服务器的DNS名称记录主机名。

> 随便写

```
designate_ns_record:
  - "ns1.dns.top"
```



## 2.1 重新部署 

```
kolla-ansible -i ./multinode deploy
```



# 3. Neutron 和 Nova 集成

在部署机

## 3.1 安装cli客户端

```
pip3 install python-designateclient
```



## 3.2 为 Neutron 创建默认指定区域

```
(venv) root@ttt:~# openstack zone create --email admin@sample.openstack.org sample.openstack.org.
+----------------+--------------------------------------+
| Field          | Value                                |
+----------------+--------------------------------------+
| action         | CREATE                               |
| attributes     |                                      |
| created_at     | 2023-02-07T09:32:58.000000           |
| description    | None                                 |
| email          | admin@sample.openstack.org           |
| id             | 17a50a3f-3f3d-4051-b9c4-f96a40f613e1 |
| masters        |                                      |
| name           | sample.openstack.org.                |
| pool_id        | 31e5fa58-a51b-4c05-b1e5-b684c8c88371 |
| project_id     | e77c46231954480fb6c3e2de0f23447b     |
| serial         | 1675762378                           |
| status         | PENDING                              |
| transferred_at | None                                 |
| ttl            | 3600                                 |
| type           | PRIMARY                              |
| updated_at     | None                                 |
| version        | 1                                    |
+----------------+--------------------------------------+
```



复制这个id，17a50a3f-3f3d-4051-b9c4-f96a40f613e1 

## 3.3 创建 designate-sink 自定义配置文件夹

```
mkdir -p /etc/kolla/config/designate/
```



## 3.4 附加指定区域 ID

创建文件 /etc/kolla/config/designate/designate-sink.conf

注意替换id

```
[handler:nova_fixed]
zone_id = 17a50a3f-3f3d-4051-b9c4-f96a40f613e1
[handler:neutron_floatingip]
zone_id = 17a50a3f-3f3d-4051-b9c4-f96a40f613e1
```



## 3.5 重新配置

```
kolla-ansible reconfigure -i ./multinode --tags designate,neutron,nova
```



# 4. 验证

## 4.1 列出可用网络

```
openstack network list
```



## 4.2 将域关联到网络

```
openstack network set <NETWORK_ID> --dns-domain sample.openstack.org.
```



## 4.3 启动一个实例

## 4.4 查看 DNS 记录

```
openstack recordset list sample.openstack.org.
```



## 4.5 查询实例DNS