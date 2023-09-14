---
title: cloud-init image.qcow2 image import and start Proxmox VE virtual machine
subtitle: cloud-init image.qcow2 image import and start Proxmox VE virtual machine
date: 2022-05-28 01:58:03
toc: true
tags: 
categories: 
    - Default
---

![16936530179911693653017662.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936530179911693653017662.png)

# cloud images下载地址 

> 本文大纲参考下文并加入了自己的实践：[proxmox cloud-init镜像模板下载（centos、ubuntu、debian）-Prokvm云管系统-XMBILLION-prokvm交流社区proxmox cloud-init镜像模板下载（centos、ubuntu、debian）![img](https://csdnimg.cn/release/blog_editor_html/release2.3.6/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=N7T8)https://bbs.xmbillion.com/thread-18.htm](https://bbs.xmbillion.com/thread-18.htm)
>
> 
>  centos：
>  http://cloud.centos.org/centos/
>
> ubuntu:
>  http://cloud-images.ubuntu.com/releases/
>
> debian:
>  https://cloud.debian.org/images/cloud/OpenStack/
>
> fedora:
>  https://alt.fedoraproject.org/cloud/
>
> rehat7：
>  https://access.redhat.com/downloads/content/69/ver=/rhel---7/x86_64/product-downloads
>
> opensuse：
>  https://software.opensuse.org/distributions/leap#JeOS-ports

# 关于centos的版本说明：

> 原文：[新闻|CentOS Linux 7 发布滚动构建版CentOS上周五宣布，CentOS Linux 的滚动构建版正式发布！这次发布包括了用于安装介质的CentOS Linux 7 的 ISO和通用的云镜像两种版本。 CentOS Linux 滚动构建版包括了从初始发布时到快照发布之间推送到 mirror.centos.org的所有更新。这些更新包括了 CentOS Linux 的安全更新、错误修复、功能增强以及常规更新。使用这个版本安装的机器将包括之前所有已经发布的更新，和使用 yum 更新的没有什么不同。所有的 rpm/yum 库仍旧存储在 mirror.centos.org上，位置和内容都没有变化。 我们将在每个月底前发布一个滚动更新版本。每个发布版本的![img](https://csdnimg.cn/release/blog_editor_html/release2.3.6/ckeditor/plugins/CsdnLink/icons/icon-default.png?t=N7T8)https://linux.cn/article-4394-1.html](https://linux.cn/article-4394-1.html)
>
> 文件： CentOS-7-x86_64-GenericCloud-20141129_01.qcow2
>  描述：这是一个基准镜像。
>
> 
>
> 
>
> 文件： CentOS-7-x86_64-GenericCloud-20141129_01.qcow2c
>  描述：和上面的镜像内容一样，但是通过qemu qcow2 内部压缩设置运行，适合于开发和测试，它的 I/O 性能较低，所以不适合在产品环境中使用。
>
> 
>
> 文件： CentOS-7-x86_64-GenericCloud-20141129_01.qcow2.xz
>  描述：这是一个标准的 qcow2 文件，通过 xz 压缩工具运行，适合于产品环境中使用。
>
> 
>
> 文件： CentOS-7-x86_64-GenericCloud-20141129_01.raw
>  描述： 这是一个原始格式的文件，没有使用 qcow2 镜像格式。它可以用“qemu-img convert”转换成其它的格式。

# 第一步：下载cloud镜像

# 第二步：导入cloud镜像到pve

这里导入的位置自己随便存一个找得到就行了哈。我是存在了/var/lib/vz/images

# 第三步：创建虚拟机

1.常规

![16936530389901693653038585.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936530389901693653038585.png)

2. 操作系统

这里不需要硬盘

![16936530489901693653048509.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936530489901693653048509.png)

3.系统

注意勾选qemu代理

![16936530579901693653057056.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936530579901693653057056.png)

4.磁盘

磁盘这里也可以不用动，待会会删除掉

![16936530789901693653078906.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936530789901693653078906.png)

5.CPU，默认

![16936530929911693653092777.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936530929911693653092777.png)

6.内存。由于是制作模板所以我改成1024

![16936531029951693653102123.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531029951693653102123.png)


7.网络。默认

![16936531109931693653110485.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531109931693653110485.png)

8.确认。完成创建

![16936531239951693653123848.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531239951693653123848.png)

## 修改硬件

 1.分离并删除硬盘

![16936531349901693653134701.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531349901693653134701.png)

2.删除CD/DVD驱动器

![16936531469921693653146623.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531469921693653146623.png)


3.添加Cloud-init设备 

![16936531579941693653157099.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531579941693653157099.png)

![16936531669901693653166526.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531669901693653166526.png)

> 那篇文章里面说还要添加USB设备和串口设备不知道是干嘛的。官方文档也是说要添加串口设备，并且显示器也要改成串口。我实测好像不太行 。可能是我操作有问题吧。恳请大佬指点迷津

#  第四步：为vm导入cloud镜像

执行如下命令

```
qm importdisk 105 /var/lib/vz/images/CentOS-7-x86_64-GenericCloud-1907.qcow2 local-lvm --format=qcow2
```



其中

105指的是刚刚创建的那台机器id，如图所示

![16936531749901693653174398.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531749901693653174398.png)

 /var/lib/vz/images/CentOS-7-x86_64-GenericCloud-1907.qcow2是我上传的镜像位置

local-lvm是我的这里是我的存储节点，如图所示

![16936531969901693653196513.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936531969901693653196513.png)

 --format=qcow2表示以qcow2格式导入，如果镜像后缀本来就是qcow2后缀就没必要用这个选项。我这里懒得删了，一样的

导入成功



回到面板去看一下有一块未使用磁盘，双击并启用他

![16936532099941693653209439.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532099941693653209439.png)

![16936532189931693653218099.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532189931693653218099.png)



![16936532279901693653227208.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532279901693653227208.png)


#  第五步：设置引导顺序

勾选刚刚启用的那一块硬盘。网络引导就取消吧没有用了

![16936532389901693653238304.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532389901693653238304.png)

#  第六步：配置cloudinit

刚刚打开的时候是这样的

![16936532459901693653245247.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532459901693653245247.png)

> 特别注意：
>
> 用户那一项是必填的 

用户：root

密码：自行设置，我这里设置为111111

DNS域：即DNS1 ，这里我设置为223.5.5.5

DNS服务器：即DNS2，这里我设置为223.6.6.6

IP配置：这里我设置为DHCP

配置完成如下

![16936532539911693653253522.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532539911693653253522.png)

> 其中cloudinit会使vm的名字作为主机名

#  第七步：开机试试

![16936532689911693653268088.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532689911693653268088.png)

成功了

# 第八步：启用root登录

vi /etc/ssh/sshd_config
 修改PermitRootLogin yes
 修改PasswordAuthentication yes

# 第九步：将vm克隆成模板

关机，然后右键机器点击转换成模板

![16936532819921693653281915.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936532819921693653281915.png)

然后就可以链接或完整克隆