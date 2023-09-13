---
title: 替换linux的文泉驿正黑fonts-wqy-zenhei字体 替换linux默认中文字体
subtitle: Replace the linux Wenquanyi Zhenghei fonts-wqy-zenhei font and replace the linux default Chinese font
date: 2023-08-01 22:03:46
toc: true
categories: 
    - 默认
---

WSL 怎么替换 linux 的文泉驿正黑 fonts-wqy-zenhei 字体
WSL 怎么替换 linux 默认中文字体

在 wsl 中默认是没有 gnome 界面或者 xface 的，但是我需要使用 wsl 开发 electron 或者使用 chrome 浏览器。这个时候系统就会调用默认的系统字体了。

我使用的是 debian12，如果默认没有安装其他字体的话，浏览器看中文页面就是方框乱码。这时候我们可以安装文泉驿正黑中文字体来解决这个问题。

但是这个字体也太 nm 丑了吧。就想把微软雅黑或者苹方放进来。百度谷歌教程都翻烂了，几乎没找到替换文泉驿正黑字体 或者在命令行下替换默认字体 或者修改文字优先级的教程。于是把 chat 老师也问烂了，终于找到了答案，那就是使用这个文件 `/etc/fonts/local.conf`，居然 debian 官网连这个文件的说明都没有，只有对 `fonts.conf` 的说明。不过 arch linux 官方对 `local.conf` 这个文件有说明，但是没有这个 xml 定义的说明。

# 手动安装字体

手动安装字体，所有ttf、ttc或者otf等格式的字体都可以用这种方式。

找到 `/usr/share/fonts` 目录，新建一个文件夹，比如说 `/usr/share/fonts/custom` 这样我知道这一块的字体是我自己添加的。

然后把微软雅黑或者苹方字体拷贝进去。苹方字体建议使用 `19.0d4e2` 这个版本的字体。

> 19.0d4e2 版本的苹方可以直接被 Windows 识别，估计是华康在导出文件的时候忘了设置什么东西。

# 修改字体优先级
1. 打开终端，并使用文本编辑器（例如 nano 或 vim）创建一个新的 Fontconfig 配置文件：

```bash
sudo nano /etc/fonts/local.conf
```

2. 在新建的配置文件中添加以下内容，将微软雅黑字体的优先级设置为较高：
```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  <description>Set preferable fonts for non-Latin</description>
	<alias>
		<family>serif</family>
		<prefer>
			<family>Microsoft YaHei UI</family><!-- han (zh-cn) -->
		</prefer>
	</alias>
	<alias>
		<family>sans-serif</family>
		<prefer>
			<family>Microsoft YaHei UI</family><!-- han (zh-cn) -->
		</prefer>
	</alias>
	<alias>
		<family>monospace</family>
		<prefer>
			<family>Microsoft YaHei UI</family><!-- han (zh-cn) -->
		</prefer>
	</alias>
	<alias>
		<family>system-ui</family>
		<prefer>
			<family>Microsoft YaHei UI</family><!-- han (zh-cn) -->
		</prefer>
	</alias>

</fontconfig>
```

问题来了，我怎么知道这个配置文件是这样写的。我也不知道，我只是复制了 `/etc/fonts/fonts.conf` 然后把 `prefer` 中的字段都删完，只留一个，然后全部都替换成 `Microsoft YaHei UI`

保存退出
# 刷新缓存
在终端中执行以下命令以更新字体缓存：
```bash
sudo fc-cache -f -v
```

# 效果

![16936350960641693635095476.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936350960641693635095476.png)