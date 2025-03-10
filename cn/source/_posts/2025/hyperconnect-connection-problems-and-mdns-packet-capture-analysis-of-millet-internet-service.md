---
title: "小米互联服务 HyperConnect 连接问题及 mDNS 抓包分析"
subtitle: "HyperConnect connection problems and mDNS packet capture analysis of millet Internet service"
date: 2025-03-10 22:06:52
toc: true
tags: 
  - 小米
  - 妙享
  - mDNS
  - 网络
  - Wireshark
  - macOS
categories: 
  - 技术研究
  - 网络调试
---

书接上回，[mac 连接小米手机大家试过吗](https://www.v2ex.com/t/1109608)

> 如题，mac 上面安装了小米互联服务，想试一下传说中的可以在 mac 上投屏并且控制手机的“妙享桌面”，但是一直没办法找到手机，连同一 wifi 试了，mac 连小米的热点也试了，一直是“当前暂无设备”，但是上面的“文件互传”是好的，小米手机的系统和相关软件都升级过了，mac 也是 15.3 的最新系统，有大佬能指点一下吗？

我感觉公司屏蔽了 udp 多播，想看看具体是不是。顺便看下能不能搞个诱骗器之类的强制走单播连接

找到了一些端倪，

wireshark 抓包显示，过滤所有组播 ip `ip.dst >= 224.0.0.0 and ip.dst <= 239.255.255.255`

```log
Standard query response 0x0000 PTR, cache flush Android.local PTR, cache flush Android.local A, cache flush 192.168.136.46 AAAA, cache flush fe80::30b8:51ff:fe17:4903 NSEC, cache flush 46.136.168.192.in-addr.arpa NSEC, cache flush 3.0.9.4.7.1.E.F.F.F.1.5.8.B.0.3.0.0.0.0.0.0.0.0.0.0.0.0.0.8.E.F.ip6.arpa NSEC, cache flush Android.local
Standard query 0x0000 PTR _mi-connect._udp.local, "QU" question
Standard query 0x0000 PTR _lyra-mdns._udp.local, "QU" question
```

里面好像可以看到三个 mDNS 的类型，`_mi-connect._udp.local`、`_lyra-mdns._udp.local`、`Android.local`

然后直接用 macOS 自带的命令查了一下  `dns-sd -B _lyra-mdns._udp local` 只有 `_lyra-mdns` 这个有数据

```log
❯ dns-sd -B _lyra-mdns._udp local
Browsing for _lyra-mdns._udp.local
DATE: ---Mon 10 Mar 2025---
21:40:02.665  ...STARTING...
Timestamp     A/R    Flags  if Domain               Service Type         Instance Name
21:40:06.193  Add        2  17 local.               _lyra-mdns._udp.     3F2E52BE
21:41:11.105  Rmv        0  17 local.               _lyra-mdns._udp.     3F2E52BE
```

然后继续看下它广播了什么东西 `dns-sd -L "3F2E52BE" _lyra-mdns._udp local.`

```log
❯ dns-sd -L "3F2E52BE" _lyra-mdns._udp local.
Lookup 3F2E52BE._lyra-mdns._udp.local.
DATE: ---Mon 10 Mar 2025---
21:42:45.657  ...STARTING...
21:42:47.422  3F2E52BE._lyra-mdns._udp.local. can be reached at 3F2E52BE.local.:5353 (interface 17)
 AppData=AkEBPy5Svug7AAIBDwoDAYNPAQEgAhlNYXR0aGV3IFBlcmV655qEUmVkbWkgSzUwIwAjAr+Q MediumType=64 DebugInfo=\{msg:hello,\ ifname:ap0,\ v4:192.\$\)+.\$\&\).46,\ v6:fe80::\&#\<+:\(\$@@:@\?\$\*:4903\}
```

这里 ip 是打了掩码的，不过最后 46 确实是我的手机 `192.\$\)+.\$\&\).46`

解开 `AppData` 的 base64，`echo xxx | base64 -d | xxd`，显示

```
00000000: 0241 013f 2e52 bee8 3b00 0201 0f0a 0301  .A.?.R..;.......
00000010: 834f 0101 2002 194d 6174 7468 6577 2050  .O.. ..Matthew P
00000020: 6572 657a e79a 8452 6564 6d69 204b 3530  erez...Redmi K50
00000030: 2300 2302 bf90                           #.#...
```

可以看到确实是我的手机，估计前后缀除了定界符，还有一些小米自己的私有信息

用 `dns-sd -G v4v6 3F2E52BE.local.` 就可以查到具体 ip 了

```log
❯ dns-sd -G v4v6 3F2E52BE.local.
DATE: ---Mon 10 Mar 2025---
21:44:03.917  ...STARTING...
Timestamp     A/R  Flags         IF  Hostname                               Address                                      TTL
21:44:06.260  Add  3             17  3F2E52BE.local.                        192.168.136.46                               120
```

然后 Google了一下，在 eu 小米论坛找到了这个 [日志](https://xiaomi.eu/community/attachments/log_fuxi_v816-0-23-12-4-dev-txt.50276/)

里面也有一行提到了

```log
12-12 03:16:46.265 10471 25415 W lyra-mdns-core: query _lyra-mdns._udp.local[0C] timeout!
```

--- 

我在想，能不能伪造这个东西，搞个 mDNS 诱骗器之类的，向 loopback 发这个 mDNS 广播，让小米互联、Xcode debug remote 之类的 app 发现这个设备，然后解析出具体 ip，剩下的流程走单播，这样就能通了

---

python 代码如下
```py
#!/usr/bin/env python3

from zeroconf import ServiceBrowser, Zeroconf
import time
import socket
from typing import List, Dict, Optional

class MDNSListener:
    def __init__(self):
        self.services: Dict[str, Dict] = {}

    def remove_service(self, zeroconf: Zeroconf, type_: str, name: str) -> None:
        print(f"服务被移除: {name}")
        if name in self.services:
            del self.services[name]

    def add_service(self, zeroconf: Zeroconf, type_: str, name: str) -> None:
        info = zeroconf.get_service_info(type_, name)
        if info:
            addresses = [socket.inet_ntoa(addr) for addr in info.addresses]
            self.services[name] = {
                'name': name,
                'type': type_,
                'addresses': addresses,
                'port': info.port,
                'server': info.server,
                'properties': info.properties
            }
            print(f"发现新服务: {name}")
            print(f"  地址: {', '.join(addresses)}")
            print(f"  端口: {info.port}")
            print(f"  服务器: {info.server}")

    def update_service(self, zeroconf: Zeroconf, type_: str, name: str) -> None:
        print(f"服务更新: {name}")
        self.add_service(zeroconf, type_, name)

def discover_services(duration: int = 5) -> Dict[str, Dict]:
    """发现本地网络中的所有mDNS服务"""
    zeroconf = Zeroconf()
    listener = MDNSListener()
    
    # 常见的服务类型
    service_types = [
        # "_http._tcp.local.",
        # "_https._tcp.local.",
        # "_workstation._tcp.local.",
        # "_printer._tcp.local.",
        # "_ipp._tcp.local.",
        # "_airplay._tcp.local.",
        # "_spotify-connect._tcp.local.",
        # "_googlecast._tcp.local.",
        # "_googlecast._tcp.local.",
        "_mi-connect._udp.local.",
        "_lyra-mdns._udp.local.",
    ]
    
    browsers = [ServiceBrowser(zeroconf, service_type, listener) 
               for service_type in service_types]
    
    try:
        print(f"正在扫描mDNS服务，持续{duration}秒...")
        time.sleep(duration)
    finally:
        zeroconf.close()
    
    return listener.services

def query_service_details(service_name: str, service_type: str) -> Optional[Dict]:
    """查询特定服务的详细信息"""
    zeroconf = Zeroconf()
    try:
        info = zeroconf.get_service_info(service_type, service_name)
        if info:
            addresses = [socket.inet_ntoa(addr) for addr in info.addresses]
            return {
                'name': service_name,
                'type': service_type,
                'addresses': addresses,
                'port': info.port,
                'server': info.server,
                'properties': {k.decode(): v.decode() if isinstance(v, bytes) else v 
                             for k, v in info.properties.items()}
            }
    finally:
        zeroconf.close()
    return None

def main():
    # 1. 发现所有服务
    print("开始扫描本地网络中的mDNS服务...")
    services = discover_services(10)  # 扫描10秒
    
    # 2. 显示所有发现的服务
    print("\n发现的所有服务:")
    for name, service in services.items():
        print(f"\n服务名称: {name}")
        print(f"服务类型: {service['type']}")
        print(f"IP地址: {', '.join(service['addresses'])}")
        print(f"端口: {service['port']}")
        print(f"服务器: {service['server']}")
    
    # 3. 如果发现了服务，查询第一个服务的详细信息
    if services:
        first_service = next(iter(services.items()))
        name, service = first_service
        print(f"\n获取服务 '{name}' 的详细信息:")
        details = query_service_details(name, service['type'])
        if details:
            print("详细信息:")
            print(f"属性: {details['properties']}")
        else:
            print("无法获取详细信息")
    else:
        print("\n未发现任何服务")

if __name__ == "__main__":
    main()
```

响应结果

```bash
❯ python mdns_discovery.py
开始扫描本地网络中的 mDNS 服务...
正在扫描 mDNS 服务，持续 10 秒...
发现新服务: 3F2E52BE._lyra-mdns._udp.local.
地址: 192.168.136.46
端口: 5353
服务器: 3F2E52BE.local.
服务更新: 3F2E52BE._lyra-mdns._udp.local.
发现新服务: 3F2E52BE._lyra-mdns._udp.local.
地址: 192.168.136.46
端口: 5353
服务器: 3F2E52BE.local.

发现的所有服务:

服务名称: 3F2E52BE._lyra-mdns._udp.local.
服务类型: _lyra-mdns._udp.local.
IP 地址: 192.168.136.46
端口: 5353
服务器: 3F2E52BE.local.

获取服务 '3F2E52BE._lyra-mdns._udp.local.' 的详细信息:
详细信息:
属性: {'AppData': 'AkEBPy5Svug7AAIBDwoDAYNPAQEgAhlNYXR0aGV3IFBlcmV655qEUmVkbWkgSzUwIwAjAr+Q', 'MediumType': '64', 'DebugInfo': '{msg:reply, ifname:ap0, v4:192.$)+.$&).46, v6:fe80::&#<+:($@@:@?$*:4903}'}

```
