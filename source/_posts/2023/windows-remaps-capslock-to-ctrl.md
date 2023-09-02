---
title: Windows 重新映射 CapsLock 大写锁定到 Ctrl
subtitle: Windows remaps CapsLock to Ctrl
date: 2023-9-2 13:16:43
toc: true
categories: 
    - 默认
---

# Windows 重新映射 CapsLock 大写锁定到 Ctrl

本要点中的这些方法适用于我的美国键盘布局。我不确定其他布局。如果出现问题，请恢复您的更改；删除您创建的注册表项（并重新启动）。

强烈推荐 方法5 `ctrl2cap`，因为不会影响 `FastGestures` 的触控板三指滑动

## 方法1.通过 regedit 手动修改

在 `regedit` 中导航到 `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout` 并在名为 `Scancode Map` 中创建一个新的二进制值。

```
00 00 00 00 00 00 00 00 02 00 00 00 1d 00 3a 00 00 00 00 00
```

保存。重启。完毕。

> 参考：
>
> - [Registry: HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout (renenyffenegger.ch)](https://renenyffenegger.ch/notes/Windows/registry/tree/HKEY_LOCAL_MACHINE/System/CurrentControlSet/Control/Keyboard-Layout/index)
>
> - https://superuser.com/a/1264295



```
Windows Registry Editor Version 5.00

; 这一串十六进制数据分为五组，每组四个字节:
;   00,00,00,00,\    header 版本 (固定值 00000000)
;   00,00,00,00,\    header flags (固定值 00000000)
;   04,00,00,00,\    # 该文本描述了一组条目（在此情况下是3个），以及一个空终止符行。
;                    每个条目都由一个2字节的配对组成：要发送的键码和要发送的键盘按键。
;                    每个条目按照“最不重要字节，最重要字节”的顺序排列，例如 0x1234 变为 34,12
;   1d,00,3a,00,\    发送 LEFT CTRL (0x001d) code 当用户按下 CAPS LOCK key (0x003a) 
;   38,00,1d,00,\    发送 LEFT ALT (0x0038) code 当用户按下 LEFT CTRL key (0x001d) 
;   3a,00,38,00,\    发送 CAPS LOCK (0x003a) code 当用户按下 LEFT ALT key (0x0038) 
;   00,00,00,00      NULL 终止符

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
"Scancode Map"=hex:00,00,00,00,\
                   00,00,00,00,\
                   04,00,00,00,\
                   1d,00,3a,00,\
                   38,00,1d,00,\
                   3a,00,38,00,\
                   00,00,00,00
```



## 方法 2. 创建您自己的注册表项文件

创建一个新的 `.reg` 文件并将其命名为有意义的名称，例如 `capstoctrl.reg` 。编辑文件并粘贴以下内容：

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]
"Scancode Map"=hex:00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00
```

保存。运行该文件。重启。完毕。



## 方法 3. 通过 PowerShell（以管理员身份）

以管理员身份打开 PowerShell (Win + X)

```
$hexified = "00,00,00,00,00,00,00,00,02,00,00,00,1d,00,3a,00,00,00,00,00".Split(',') | % { "0x$_"};

$kbLayout = 'HKLM:\System\CurrentControlSet\Control\Keyboard Layout';

New-ItemProperty -Path $kbLayout -Name "Scancode Map" -PropertyType Binary -Value ([byte[]]$hexified);
```

保存。运行该文件。重启。完毕。



## 方法 4. Microsoft PowerToys

尝试一下 PowerToys 不仅可以重新映射大写锁定键，还可以重新映射其他键。 Microsoft PowerToys：自定义 Windows 10 的实用程序。

Microsoft PowerToys：键盘管理器使您能够重新定义键盘上的按键。

![16936313430601693631342489.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936313430601693631342489.png)

> 以上方法都有问题，如果你还使用其他依赖 `ctrl` 的软件可能就会出问题。
>
> 这些软件如果需要监听原始按键，是依旧可以监听到 `caps` 按下。这个时候在 sysinternals 工具箱有一个叫 `ctrl2cap` 的工具



## 方法5. Ctrl2Cap 驱动级修改

> 出处：[Ctrl2cap - Sysinternals | Microsoft Learn](https://learn.microsoft.com/zh-cn/sysinternals/downloads/ctrl2cap)

Ctrl2cap 是一个内核模式设备驱动程序，用于筛选系统的键盘类驱动程序，以便将 caps-lock 字符转换为 control 字符。 像我这样从 UNIX 迁移到 NT 的人习惯于将 control 键置于标准电脑键盘上 caps-lock 键的位置，因此这样的实用工具对于我们的编辑工作至关重要。

**安装**

- 打开管理员 cmd，或者 管理员 powershell
- 从解压缩 Ctrl2cap 文件的目录中运行命令 `Ctrl2cap.exe /install` 以安装 Ctrl2cap。 若要卸载，`ctrl2cap /uninstall`

**Ctrl2cap 的工作原理**

在 NT 4 上，Ctrlcap 实际上相当简单。 它只是将自身附加到键盘类驱动程序，以便捕获键盘读取请求。 对于每个请求，它都会发布一个 I/O 完成回调，此时它会查看返回的扫描代码。 如果它恰好是 caps-lock，则 ctrl2cap 将其更改为left-control。

在 Win2K 上，Ctrl2cap 是一个 WDM 筛选器驱动程序，它在键盘类设备之上的键盘类设备堆栈中分层。 这与 Win2K DDK 的 kbfiltr 示例形成对比，后者将自己分层在 i8042 端口设备和键盘类设备之间。 出于以下几个原因，我选择在键盘类设备上分层：

- 这意味着 Ctrl2cap IRP_MJ_READ 拦截和操作代码在 NT 4 和 Win2K 版本之间共享。
- 我不需要提供 INF 文件，也不需要让用户通过设备管理器来安装 Ctrl2cap - 我只需修改相应的注册表值（键盘类设备的 HKLM\System\CurrentControlSet\Control\Class UpperFilters 值）。

我的方法的缺点是（这是一个优点还是缺点，取决于你的观点）：

- 由于我没有通过设备管理器使用 INF 文件进行安装，因此不会警告用户 Ctrl2cap 驱动程序文件未由 Microsoft 进行数字签名。

在这种情况下，我觉得优点大于缺点。 但是，在为 Ctrl2cap 上的 Win2K 键盘筛选器建模之前，我强烈建议你学习 Win2K DDK 中的 kbfiltr 示例。 Kbfiltr 在键输入序列中的拦截点使 kbfiltr 可以轻松地将击键注入输入流。



## 参考

- [Ctrl2cap - Sysinternals | Microsoft Learn](https://learn.microsoft.com/zh-cn/sysinternals/downloads/ctrl2cap)
- https://superuser.com/a/1389340
- [Remap Caps Lock to Control on Windows 10 (github.com)](https://gist.github.com/joshschmelzle/5e88dabc71014d7427ff01bca3fed33d)

