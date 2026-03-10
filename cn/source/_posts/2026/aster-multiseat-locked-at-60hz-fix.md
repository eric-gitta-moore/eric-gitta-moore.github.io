---
title: Aster Multiseat 启用之后屏幕刷新率锁定在默认 60hz 无法更改，CRU 强制修改默认首选刷新率
subtitle: Aster Multiseat Locked at 60Hz Fix (Using CRU)
date: 2026-03-10 11:20:37
toc: true
tags: 
categories: 
    - 默认
---

## 背景

一台机器多台键鼠显示器，几个人共用一台电脑，一拖二/一拖多

> aster 电脑一拖二 试了一下aster 能同时开 Photoshop ... http://xhslink.com/o/VpT4Q4aW6U 
> 复制后打开【小红书】查看笔记！


![图片来自于小红书](./aster-multiseat-locked-at-60hz-fix/微信图片_20260310112627_98_2.avif)


## 问题

用这个 aster 的问题在于，一旦开启 aster 在它重启电脑之后，第二屏用户就变成了默认 60hz 的刷新率还没法在 Windows 设置里面调整（点了没效果）

也没法在 Nvidia Control 里面设置（都是灰色的按钮）


## 解决办法

> 方案来源: https://www.forum.ibik.ru/viewtopic.php?f=1&t=35284
>
> 原帖译文: 这个问题可能与 Windows 处理不同刷新率的多显示器的方式有关。请尝试在 NVIDIA/AMD 控制面板中手动设置刷新率，而不是在 Windows 显示设置中进行设置。此外，请确保您的显卡驱动程序已更新至最新版本。如果问题仍然存在，请考虑使用分辨率调整工具（例如 CRU，即 Custom Resolution Utility ）强制将刷新率调整到您所需的水平。 


软件: [Custom Resolution Utility](https://www.monitortests.com/forum/Thread-Custom-Resolution-Utility-CRU)


对于 300hz 的，得把 detailed resolutions 默认的第一个改成 300hz+interlaced。我这里改完后就是 2560x1440i@300hz

如果是 144hz 直接 add 添加一个 参数默认 改刷新率 144 然后挪到第一个就行，其他都可以不要动。改完后就是 1920x1080p@144hz

> i 是 interlaced 交错扫描，一帧分两次（奇行 + 偶行）显示
> 
> p 是 progressive 逐行扫描，一帧完整画面一次显示

如果要折腾也行，reset-all.exe 重置一下就和没事一样。

（不知道这个 interlaced 交错扫描还会不会有什么负面影响，其实对比逐行扫描的 EDID 肉眼没看出来区别）

![设置和效果](./aster-multiseat-locked-at-60hz-fix/微信图片_20260310112625_97_2.avif)


## 其他问题

1. 同时开两个 Steam

可以，第二屏设置一个单独的用户就可以了。可以共享一个 Steam 二进制程序，也可以再安装一个 steam 到 steam2 路径，和原本错开就行

2. 同时开启两个三角洲

可以，但问题是只能一个 wegame 一个 steam。或者一个国服官方启动器 一个 steam/wegame，反正就是不能两个一样的平台启动。

感觉是启动器里面代码限制了。因为跑第二个 steam 三角洲的时候，症状是启动器的 UI 显示不出来，但是任务管理器里面是可以看到进程的。

3. 刷新率复原

运行 CRU 下面的 reset-all.exe 重启就行。

另外， CRU 那个 restart64.exe/restart.exe 好像没啥用，我这里用了就是黑屏。还是重启电脑来应用配置比较好使。


4. 4K 高刷怎么办(>144hz)

对于 CRU 里面第一栏的 `detailed resolutions`，其实是 EDID 限制，EDID 时序的像素时钟上限是 655.35 MHz。

就算开了 interlaced 交错扫描也会超过 655MHz 的 pixel color。这个暂时还不知道怎么解。不过设置 144hz 刷新率是可以的。

> 作者提到: DisplayID 与 EDID 的唯一区别在于它不局限于 4095x4095 或 655.35 MHz 像素时钟，并且 DisplayID 2.0 支持像素时钟精度达到小数点后三位。
> 
> 来源: https://www.monitortests.com/forum/Thread-Custom-Resolution-Utility-CRU?page=863


另外，使用 aster 的时候还有个情况是主屏可以正常修改刷新率。那有可能把 4K 高刷屏放到主屏上，第二屏换其他的分辨率和刷新率没那么高的就行

5. 继续深入 EDID 数据格式

[Wikipedia EDID 1.4 data format](https://en.wikipedia.org/wiki/Extended_Display_Identification_Data)

pixel clock 值的上限来源于 [EDID Detailed Timing](https://en.wikipedia.org/wiki/Extended_Display_Identification_Data#Detailed_Timing_Descriptor) 数据结构带来的，

头两个字节就是 pixel clock 最大值是 65535，

所以 `65535 × 10 kHz = 655350 kHz = 655.35 MHz` 限制就来了

