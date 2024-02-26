---
title: windows使用WiFi-direct连接手机等设备
subtitle: Windows uses WiFi-direct to connect to mobile phones and other devices
date: 2022-03-09 00:03:56
toc: true
tags: 
categories: 
    - 默认
---


 在网上搜了蛮久，都是叫你下visual studio然后再加载“Wi-Fi Direct sample”这个实例项目调试运行。微软在这里提供了一个例子，不过没有打包好。我就直接打包一下用了

```
https://docs.microsoft.com/zh-cn/windows/iot-core/connect-your-device/setupwifidirect
https://github.com/Microsoft/Windows-universal-samples/tree/main/Samples/WiFiDirect
```



 我打包好的地址：

```
https://yunling.lanzout.com/isiNb01788pa
```



>  凑字数，不用看
>
>  通过使用已启用 WiFi Direct 的 USB WiFi 适配器，Windows 10 IoT 核心版设备上支持 WiFi Direct。 若要确保 WiFi Direct 已启用，需要确保符合下面两项要求：
>
>  USB WiFi 适配器的硬件需要支持 WiFi Direct，
>  USB WiFi 适配器的相应驱动程序需要支持 WiFi Direct。
>  WiFi Direct 提供一个解决方案来实现 WiFi 设备到设备连接，无需使用无线接入点（无线 AP）来设置连接。 如要查看可使用 WiFiDirect 执行哪些操作，请查看 Windows。Devices.WiFiDirect 命名空间中提供的 UWP API。
>
>  支持的适配器
>  如需已在 Windows 10 IoT 核心版上进行测试的 WiFi 适配器的列表，可查看支持的硬件页面。
>
>  WiFi Direct 的基本示例
>  可使用 WiFi Direct UWP 示例轻松测试 WiFi Direct 功能。 我们将使用 C# 版本并运行两台设备的示例。
>
>  设置两台设备
>  运行 Windows 10 IoT 核心版的 MinnowBoardMax (MBM)（请参阅此处的说明），带有 CanaKit WiFi 适配器
>  将显示器、键盘和鼠标连接到 MBM
>  运行最新的 Windows 10 周年最新的 Windows 10 电脑。 电脑（或笔记本电脑）需要具有 WiFi Direct 支持（例如 Microsoft Surface）
>  在 Windows 10 电脑上安装 Visual Studio 2017
>  克隆或下载 WiFi Direct UWP 示例（此处是 GitHub 存储库的根目录）。
>  在 Visual Studio 2017 中加载 WiFi Direct UWP 示例的 C# 版本
>  在两台设备上运行示例
>  编译示例，在 MBM 上部署/运行它：
>
>  将“解决方案平台”组合框设置为“x86”
>  从“运行”下拉列表中选择“远程计算机”
>  在 MBM 上启动示例但不调试（按 Ctrl-F5，或者从“调试”菜单中选择“启动(不调试)”）
>  应该会看到 WiFi Direct 示例在连接到 MBM 的显示器上运行
>  编译示例，并在 Windows 10 电脑上部署/运行它：
>
>  将“解决方案平台”组合框设置为“x86”
>  从“运行”下拉列表中选择“本地”
>  启动示例（按 F5 或 Ctrl-F5）
>  应该会看到 WiFi Direct 示例在 Windows 10 电脑上运行

------

 使用方法：

一、安装证书

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/fbcf9e8fd26e4fcf8c6eeb53aa379751.png)

 ![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/941f29f3e0d3428e89bc60962ee66af1.png)



![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/c0547c790b554a8a998a9bf415cf0383.png)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/b613d304b85445e4bd14cf400a0e705a.png)

 二、安装.msixbundle

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/d49cccc7a5d14fe8be3cf2cf238a073a.png)

 三、enjoy

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/0ce46f9f23364b92bb1384bf9a4c717f.png)