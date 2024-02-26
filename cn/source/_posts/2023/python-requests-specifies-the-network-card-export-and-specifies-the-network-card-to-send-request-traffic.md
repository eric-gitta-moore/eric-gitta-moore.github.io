---
title: Python requests 指定网卡出口，指定网卡发送请求流量
subtitle: Python requests specifies the network card export and specifies the network card to send request traffic.
date: 2023-02-26 21:55:49
toc: true
categories: 
    - 默认
---

```python
import socket
import requests
from requests_toolbelt.adapters.socket_options import SocketOptionsAdapter


session = requests.Session()
# set interface here
options = [(socket.SOL_SOCKET, socket.SO_BINDTODEVICE, b"eth0")]
for prefix in ('http://', 'https://'):
    session.mount(prefix, SocketOptionsAdapter(socket_options=options))


print(session.get("https://test.ipw.cn/").text)

```

![16936361955351693636194706.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936361955351693636194706.png)