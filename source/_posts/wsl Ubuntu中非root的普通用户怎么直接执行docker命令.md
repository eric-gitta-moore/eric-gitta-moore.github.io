---
title: WSL Ubuntu 中非 root 的普通用户怎么直接执行 Docker 命令
subtitle: How can non-root ordinary users directly execute Docker commands in WSL Ubuntu?
date: 2023-09-01 23:19:01
toc: true
---



docker需要root权限，如果希望非root用户直接使用docker命令，而不是使用sudo，可以选择将该用户加入到docker用户组。

`sudo groupadd docker`：添加到groupadd用户组（已经有docker用户组，所以可以不用再新增docker用户组）

`sudo gpasswd -a $USER docker`：添加当前用户到docker组

`newgrp docker`：更新docker用户组