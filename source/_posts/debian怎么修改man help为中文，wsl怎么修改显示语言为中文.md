---
title: debian 怎么修改 man help 为中文，wsl 怎么修改显示语言为中文
subtitle: How to change man help to Chinese in debian, how to change the display language of wsl to Chinese
date: 2023-08-03 16:47:35
toc: true
---


在Debian 12系统中，要将系统语言和Man帮助手册设置为中文，需要执行以下步骤：

1. 安装中文语言包：
   首先，更新软件包列表并安装中文语言包。打开终端并运行以下命令：

   ```bash
   sudo apt update
   sudo apt install locales
   ```

2. 配置本地化设置：
   安装完成后，使用以下命令重新配置本地化设置，并选择中文语言包：

   ```bash
   sudo dpkg-reconfigure locales
   ```

   在选择界面中，选中`zh_CN.UTF-8`（中文简体）和其他你希望支持的语言设置。然后按空格键选中，使用方向键移动到"OK"并按下回车键。

3. 设置系统默认语言：
   在终端中编辑你的bash配置文件（如`.bashrc`或`.bash_profile`）：

   ```bash
   nano ~/.bashrc
   ```

   在文件末尾添加以下行：

   ```bash
   export LC_ALL=zh_CN.UTF-8
   export LANG=zh_CN.UTF-8
   ```

   按下 `Ctrl+X`，然后输入 `Y` 保存更改并退出编辑器。

4. 使设置生效：
   输入以下命令使配置文件的更改生效：

   ```bash
   source ~/.bashrc
   ```

5. 安装中文Man帮助手册：
   安装中文Man帮助手册的软件包：

   ```bash
   sudo apt update
   sudo apt install manpages-zh
   ```

6. 查看中文Man帮助手册：
   现在，你可以使用`man`命令查看中文的Man帮助手册了。例如，要查看`ls`命令的中文Man帮助手册，可以输入以下命令：

   ```bash
   man ls
   ```

   确保系统和应用程序现在以中文显示，并正确解析和处理中文字符。

---
如果想默认是英文，在需要时候切换到中文的话，可以把设置环境变量的两条语句写到其他文件比如 `.zhcnrc` 在需要使用中文的时候，使用 `source ~/.zhcnrc` 命令即可切换

要判断是否切换成功，可以使用 `locales` 命令查看