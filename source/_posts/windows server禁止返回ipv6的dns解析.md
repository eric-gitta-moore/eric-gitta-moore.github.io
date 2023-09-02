---
title: windows server禁止返回ipv6的dns解析
subtitle: windows server prohibits returning ipv6 dns resolution
permalink: windows server prohibits returning ipv6 dns resolution
date: 2023-03-16 18:39:13
toc: true
categories: 
    - 默认
---

# 背景

有什么方法可以防止事物在 DNS 服务器上注册它们的 AAAA 记录吗？我已经尝试通过在网络堆栈中取消选中它来关闭 Windows 计算机上的 IPv6，但它们仍然注册 AAAA 记录。问题是，我们的 Exchange 2007 服务器一直在注册 AAAA 记录，而我们的隧道没有为 IPv6 设置。因此，当隧道末端的客户端尝试连接时，它无法连接。我可以 ping 通 IPv6 地址，但我猜这可能是路由器在回复而不是服务器本身。如果我从 DNS 服务器中删除 IPv6 地址并尝试再次连接，它会起作用。



ipv6禁用方法出处 https://community.spiceworks.com/topic/257230-disable-aaaa-records-from-registering-in-server-2008-r2-dns

# 解决方案

如果您想禁用 IPv6，关闭它的“正确”方法是通过注册表禁用它。就是这样：

打开注册表编辑器（运行命令 `regedit` ）
导航到以下键：  `HKEY_LOCAL_MACHINE > System > CurrentControlSet > Services > TCPIP6 > Parameters`
创建一个名为 `DisabledComponents` 的新 DWORD值（区分大小写）
修改 `DisabledComponents` 值并将其设置为 `0xffffffff`（十六进制 - 即 8个 F）。
重新启动 PC 以应用更改。



如果家里没有ipv6最好禁用，如果只是禁用AD域适配器的ipv6没有用的，dns解析也会返回ipv6，不过windows不会去尝试访问解析到的ipv6地址，但并不代表其他系统不会，例如Ubuntu22.04LTS即时没有ipv6默认路由，也有可能会去请求ipv6地址，这个时候表现出来的就是网络卡顿