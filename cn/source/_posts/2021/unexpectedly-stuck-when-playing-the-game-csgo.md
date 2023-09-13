---
title: 打游戏csgo的时候莫名其妙卡一下
subtitle: Unexpectedly stuck when playing the game csgo
date: 2023-02-07 18:16:02
toc: true
tags: 
categories: 
    - 默认
---

 经过长期观察发现如下情况

我是天选2 3060
 也是csgo突然卡一下，有时候声音也一起同时卡一下，半秒的样子

这篇文章适用于开启了核显和独显的，并且是核显直连。

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/1884ca57d7871a4763c5f6b9b5b69d6e.png)

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/39cc4fef70f173164bfc7ab9ff9a7741.png)

 之前一直在找，看了好多解决方案，都不行，换驱动，Xbox，游戏模式，游戏设置，启用Windows设备上的缓存，csgo控制台命令等等等，都不行。今天用微星小飞机监控又看了下，发现显存一直在跳

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/b15c37b0d3b36c2f15d07d4fc474f948.png)

查了下百度，发现有网友说是显卡没有工作。我怀疑是游戏跑起来太简单了，独显在摸鱼。就果断把刷新率限制解除了。结果还是卡得。然后把显示器分辨率也调高了，调成了144hz。

把csgo和系统放在用一块硬盘上，csgo设置的刷新率别太低，至少要让显存动起来，别让显卡摸鱼了。开显示器最高刷新率，csgo的帧数可以低于显示器最高刷新率

xbox game ba，r游戏模式其实是可以开的，没影响。csgo设置很重要。要么全屏。或者全屏窗口，然后帧数不要锁在显示器刷新率，可以先试一下不要锁帧数，fps_max 999，然后再锁显示器刷新率的两倍。反正我的电脑如果开全屏窗口锁显示器刷新率144的话就会突然莫名其妙卡一下

还有就是在英伟达控制面板设置一下

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/eb805776b462470ea200dcfc7f86b4c9.png)

 ![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/744eb2e706b941d1abddc6d772f6b95e.png)

之后应该就没有问题了 