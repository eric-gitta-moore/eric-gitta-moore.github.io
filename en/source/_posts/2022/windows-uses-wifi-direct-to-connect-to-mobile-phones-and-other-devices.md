---
title: Windows uses WiFi-direct to connect to mobile phones and other devices
subtitle: Windows uses WiFi-direct to connect to mobile phones and other devices
date: 2022-03-09 00:03:56
toc: true
tags: 
categories: 
    - Default
---

Translation of the provided Markdown text into English:

---

I searched online for a while, and they all tell you to download Visual Studio and then load the "Wi-Fi Direct sample" project to debug and run it. Microsoft provides an example here, but it's not packaged. So, I'll directly package it for you.

```
https://docs.microsoft.com/en-us/windows/iot-core/connect-your-device/setupwifidirect
https://github.com/Microsoft/Windows-universal-samples/tree/main/Samples/WiFiDirect
```

Here's the link to my packaged version:

```
https://yunling.lanzout.com/isiNb01788pa
```

> To reach the word count, you don't need to read this.
>
> WiFi Direct is supported on Windows 10 IoT Core devices when using a USB WiFi adapter that is WiFi Direct enabled. To ensure WiFi Direct is enabled, make sure the following requirements are met:
>
> - The hardware of the USB WiFi adapter must support WiFi Direct.
> - The corresponding driver for the USB WiFi adapter must support WiFi Direct.
>
> WiFi Direct provides a solution for establishing device-to-device connections using WiFi without the need for a wireless access point (wireless AP) to set up the connection. To see what you can do with WiFiDirect, check out the UWP API provided in the Windows.Devices.WiFiDirect namespace.
>
> Supported Adapters
> For a list of WiFi adapters tested on Windows 10 IoT Core, you can refer to the supported hardware page.
>
> Basic WiFi Direct Example
> You can easily test WiFi Direct functionality using the WiFi Direct UWP sample. We'll use the C# version and run the example on two devices.
>
> Setting up Two Devices
> - Run MinnowBoardMax (MBM) with Windows 10 IoT Core (see instructions here) with a CanaKit WiFi adapter.
> - Connect a monitor, keyboard, and mouse to MBM.
> - Run the latest Windows 10 Anniversary Update on a Windows 10 computer (or laptop) with WiFi Direct support (e.g., Microsoft Surface).
> - Install Visual Studio 2017 on the Windows 10 computer.
> - Clone or download the WiFi Direct UWP sample (here's the GitHub repository's root directory).
> - Load the C# version of the WiFi Direct UWP sample in Visual Studio 2017.
> - Run the sample on both devices.
>
> Building the Sample and Deploying/Running It on MBM:
> - Set the "Solution Platform" combo box to "x86".
> - Select "Remote Machine" from the "Run" dropdown list.
> - Start the sample on MBM without debugging (press Ctrl-F5 or select "Start without Debugging" from the "Debug" menu).
> - You should see the WiFi Direct sample running on the monitor connected to MBM.
>
> Building the Sample and Deploying/Running It on the Windows 10 Computer:
> - Set the "Solution Platform" combo box to "x86".
> - Select "Local" from the "Run" dropdown list.
> - Start the sample (press F5 or Ctrl-F5).
> - You should see the WiFi Direct sample running on the Windows 10 computer.

---

Usage Instructions:

1. Install the certificate.

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/fbcf9e8fd26e4fcf8c6eeb53aa379751.png)

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/941f29f3e0d3428e89bc60962ee66af1.png)

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/c0547c790b554a8a998a9bf415cf0383.png)

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/b613d304b85445e4bd14cf400a0e705a.png)

2. Install .msixbundle.

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/d49cccc7a5d14fe8be3cf2cf238a073a.png)

3. Enjoy!

![img](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/0ce46f9f23364b92bb1384bf9a4c717f.png)
