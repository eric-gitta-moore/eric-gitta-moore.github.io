---
title: 2024 年在 Windows/macOS/Linux 启用干净无广告的 Adobe Flash Player 的方法
subtitle: A way to enable clean ad-free Adobe Flash Player on Windows/macOS/Linux in 2024
date: 2024-06-25 00:16:25
toc: true
tags: 
categories: 
    - 默认
---

## 介绍

Adobe 在 2020 年彻底终止了对 Flash Player 的支持, 随后各大主流浏览器（Chrome, Firefox, Safari 等）也开始纷纷移除 Flash Player 的相关代码。目前在这些浏览器的最新版本中，即使你的电脑上安装了 Flash Player 也无法正常使用它。

这对整个互联网行业的发展毫无疑问是一件好事，垃圾就应该滚出历史的舞台，如果说这件事对整个行业而言有什么不好的地方，那可能就是它发生得太晚了。

然而 Flash Player 的缺失也给部分用户带来了不便（比如我这种想要玩经典页游的人），本文将会介绍在三大主流桌面平台 Windows/macOS/Linux 安装纯净版 Flash Player 的方法。

## 现有的解决方案及其不足之处

### 国产浏览器

为了迎合部分用户的需求，一些国产浏览器保留了对 Flash Player 的支持。

但是我要说的是，这些国产浏览器（百度、360、QQ 等），有一个算一个，全都是垃圾。原因如下：

1. 没什么技术上的创新。它们都是基于 [Chromium](https://www.chromium.org/chromium-projects/) 开发的，这是 Google Chrome 的前身，免费开源无广告。如果说它们真的有什么创新，那可能就是在 Chromium 的基础上加了广告和隐私追踪器。
2. 这些浏览器通常会在后台起一个进程，名字一般含有 Safe / Security 之类的字眼，但如果你真以为它们是为了保护你的上网安全那就大错特错了，这些东西的唯一作用就是收集你的隐私数据，然后向你定向推送广告。
3. 内置各种垃圾根证书。这些东西做过的恶太多了，使用它们将会带来极大的安全隐患。
4. 最恶心的一点，你想要访问的网站可能会突然因为各种原因而无法访问（例如当年的 996.ICU）。浏览器只不过是一个工具，它不应该也没有任何资格来干涉用户想要访问什么网站。

我的建议是，不要使用任何国产浏览器。如果你的电脑上安装了什么国产浏览器，你应该立马卸载掉它们，因为即使你不启动它们，第 2 点所提到的那些进程也会在后台自动运行。

你的首选应该是开源浏览器（例如 Firefox, Chromium），其次是国际化的闭源浏览器（例如 Safari, Chrome）。

本文所使用的所有浏览器都是开源浏览器。

### 中国特供版 Flash Player

Flash Player 由美国的 [Adobe](https://www.adobe.com/) 公司开发，由于国内的网络环境比较特殊，时至今日依然有部分网站死守 Flash Player 绝不松手（而你还往往拿它们没办法），于是 Adobe 在 2020 年宣布停止对 Flash Player 的支持后又将它交给了国内的[重橙网络](https://www.izhongcheng.cn/)代理，使其依然能够在大陆地区使用。

然而该公司是业内有名的毒瘤，在代理了 Flash Player 后它所做的事情包括但不限于：

1. 使用各种手段，阻止大陆用户使用国际版 Flash Player, 让大家只能用“中国特供版”
2. 收集你的大量隐私信息，包括但不限于你的 IP 地址、你访问的链接、你电脑上安装的软件等等
3. 根据收集到的信息推送个性化广告，且无法关闭
4. 如果这些信息遭到了泄露，重橙公司无需承担任何责任（明文写在用户协议里）

因此，直接安装中国特供版 Flash Player 是一个极其冒险的行为，不建议除了从事网络空间安全以外的任何人尝试。

### 开源 Flash Player 替代品

Flash Player 目前有两个开源解决方案：

- [Ruffle](https://ruffle.rs/): Rust 写的 Flash Player 替代品，可以正常播放视频，但是完成度还不高，尤其缺乏对 Action Script 3 的支持（也就没法玩游戏）
- [Lightspark](http://lightspark.github.io/)：C/C++ 写的 Flash Player 替代品，同样完成度不高，播放视频足够了，但打游戏还差点意思。

本文将会使用纯净构建的官方版 Flash Player，支持原版 Flash Player 的所有特性，并且没有广告和和中国特供版的各种恶意组件。

## Windows

### 使用低版本 Firefox

虽然最新版的 Chrome 和 Firefox 移除了 Flash Player 的相关代码，但是我们依然可以在较低的版本中使用它。

[archive.org](https://archive.org/) 上面保留了支持 Flash Player 的最后一个版本的 Firefox 和 Chrome，有需要的可以从这里下载：[下载链接](https://archive.org/download/Firefox_Chrome_Adobe_Flash)

下载的版本是便携版，无需安装，解压后双击 “FirefoxPortable.exe” 即可使用。

这个便携版内置了 Flash，所以你也无需安装 Flash Player，直接访问你想访问的网站即可。

### 安装 Flash Player 独立运行组件

某些游戏辅助器可能不会在浏览器里运行，而是会直接使用系统中安装的 Flash Player 独立运行组件，这种情况下你需要安装 Flash Player。

有人在 GitLab 上开发了一个项目 [Clean Flash Player](https://gitlab.com/cleanflash/installer)，它在中国特供版 Flash Player 的基础上进行了魔改，移除了各种限制，删除了和收集隐私与推送广告相关的文件。

有需要的可以从 [Release Page](https://gitlab.com/cleanflash/installer/-/releases) 下载最新版。

### 使用 Waterfox

低版本的 Firefox 虽然能用 Flash，但是由于长期未更新，它也同样存在各种安全漏洞和 Bug。

Waterfox 是一个基于 Firefox 开发的浏览器，和 Firefox 一样免费开源无广告。

Waterfox 有两个版本，Current 和 Classic，Current 基于最新版 Firefox 构建，我个人测试无法使用 Flash Player，另外一个 Classic 基于老版本 Firefox 构建，可以用 Flash Player，并且相比于旧版 Firefox 还修复了很多安全漏洞和 Bug。

首先下载并安装 Waterfox Classic：[官方下载地址](https://classic.waterfox.net/)

Waterfox 没有内置 Flash Player，所以安装完后还需要安装 Flash Player 独立运行组件，参考上一节进行安装。

## macOS

本文在 Apple Silicon 系列芯片的 Mac 上测试通过，理论上 Intel 芯片的 Mac 应该也可行，因为安装的程序都是 X86 架构的。

首先下载并安装 Waterfox Classic：[官方下载地址](https://classic.waterfox.net/)

然后下载 [darktohka/clean-flash-builds](https://github.com/darktohka/clean-flash-builds)，这是一个开源构建的纯净版 Flash Player，下载的时候选最新版 Mac NPAPI 版本。

下载完成之后解压，然后打开访达，按下 Command+Shift+G ，输入 “~/Library/Internet Plug-Ins/” 并回车。

把解压后得到的 “FlashPlayer-10.6.plugin” 和 “flashplayer.xpt” 复制到这个文件夹下。

## Linux

首先安装 Waterfox Classic: [官方下载地址](https://classic.waterfox.net/)

Arch Linux 用户也可以从 AUR 安装：[waterfox-classic-bin](https://aur.archlinux.org/packages/waterfox-classic-bin)

接下来下载 [darktohka/clean-flash-builds](https://github.com/darktohka/clean-flash-builds)，选 Linux 版 64 位 NPAPI：[下载链接](https://github.com/darktohka/clean-flash-builds/releases/tag/v1.7)

把解压后得到的 `libflashplayer.so` 放到 `~/.waterfox/plugins` 目录下。

或者执行以下命令一键安装:

```
$ mkdir -p ~/.waterfox/plugins && wget https://download.fastgit.org/darktohka/clean-flash-builds/releases/download/v1.7/flash_player_patched_npapi_linux.$( (( $(getconf LONG_BIT) == 32 )) && echo "i386" || echo "x86_64").tar.gz -O - | tar -zxf - -C ~/.waterfox/plugins libflashplayer.so
```

## 致谢
- https://www.sainnhe.dev/post/enable-flash-player-in-2022/