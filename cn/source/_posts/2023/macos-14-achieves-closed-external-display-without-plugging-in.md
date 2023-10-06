---
title: macOS 14 不插电实现合盖外接显示器
subtitle: MacOS 14 achieves closed external display without plugging in
date: 2023-10-06 11:52:47
toc: true
tags: 
categories: 
    - 默认
---

mac 默认拔掉电源线后，系统进入休眠，不能正常使用外接显示器。

系统设置中不提供解决方案，直接终端输入如下：

```sh
# 启用拔线不休眠
sudo pmset -a sleep 0
sudo pmset -a hibernatemode 0
sudo pmset -a disablesleep 1
```

```sh
# 还原
sudo pmset -a sleep 1
sudo pmset -a hibernatemode 3
sudo pmset -a disablesleep 0
```