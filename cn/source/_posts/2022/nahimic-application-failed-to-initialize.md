---
title: Nahimic应用程序初始化失败
subtitle: Nahimic application failed to initialize
date: 2022-07-25 20:25:17
toc: true
tags: 
categories: 
    - 默认
---


![16936520965351693652095528.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936520965351693652095528.png)


故障显示如上：

![16936521305381693652129574.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521305381693652129574.png)

联想服务那边找到 “Realtek Audio driver 声卡驱动”

下载之后打开，不用安装直接解压就好了

![16936521385351693652138042.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521385351693652138042.png)

找到解压目录下面的

“Source\Thirdparty\Nahamic_831w”

在我这里我的完整路径是

“C:\Drivers\Realtek Audio Driver\20222507.19325299\Source\Thirdparty\Nahamic_831w”

![16936521465351693652145762.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521465351693652145762.png)

 运行一下这个修复程序

“Lenovo-NahimicRestoreTool-APO4-SWCv4.5.0.0-EXTv1.1.7.0.exe”

运行完成之后会提示重启，选择不重启。

此时可以正常打开Nahimic并使用，且有效果。但是重启之后又出现故障了

这个时候看一下Nahimic的服务启动了没有

打开任务管理器，切换到服务选项卡，按一下键盘的N会自动跳到N开头的服务上面，找到“NahimicService”

发现并没有启动服务

![16936521565351693652155665.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521565351693652155665.png)

 那么就找到原因了。现在右键这个服务，选择打开服务

![16936521665351693652165846.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521665351693652165846.png)

在弹出的窗口中找到同名的服务 

![16936521765351693652176279.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521765351693652176279.png)

 把原本的禁用改成“自动(延迟启动)”

![16936521845391693652183779.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521845391693652183779.png)

 然后再右键点击启动就完成了

![16936521995341693652199139.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936521995341693652199139.png)

此时重启电脑也是一样可以用的 