---
title: WSL 中安装搜狗输入法 中文拼音
subtitle: Sogou input method Chinese pinyin is installed in WSL
date: 2023-9-23 21:17:56
toc: true
tags: 
categories: 
    - 默认
---


## 配置语言包
```sh
sudo locale-gen en_US.UTF-8 zh_CN.UTF-8

cat <<'EOF' | sudo tee -a /etc/profile

export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8:zh_CN.UTF-8
EOF

echo 'source /etc/profile' >> ~/.zshrc
```

## 配置字体
添加 Windows 字体，并设置微软雅黑字体优先级
```sh
cat <<'EOF' | sudo tee /etc/fonts/local.conf
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd">
<fontconfig>
  	<dir>/mnt/c/Windows/Fonts</dir>
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

EOF

sudo apt install fontconfig
sudo fc-cache -f -v
```

## 配置 fcitx
```sh
sudo apt install fcitx

cat <<'EOF' | sudo tee -a /etc/profile

export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
export DefaultIMModule=fcitx
fcitx-autostart &>/dev/null
EOF
```

## 配置搜狗输入法
下载搜狗输入法
```sh
wget  -O /tmp/so.deb 搜狗输入法下载地址

sudo apt install /tmp/so.deb
```

下载依赖
```sh
sudo apt install libqt5qml5 libqt5quick5 libqt5quickwidgets5 qml-module-qtquick2

sudo apt install libgsettings-qt1
```

## 启用输入法
重启 wsl，然后
```sh
fcitx-config-gtk3
```

![1](https://shurufa.sogou.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhelp15.c14aafcd.png&w=1080&q=75)

![2](https://shurufa.sogou.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhelp16.e32b0f4a.png&w=1080&q=75)

## 试用
```sh
sudo apt install gedit
gedit
```
ctrl + space 切换输入法，这里和 Windows 的冲突了，记得关掉 Windows 的，也最好换掉 WSL 的输入法切换，因为这个快捷键和 idea 的自动补全快捷键冲突了

## 测试微软雅黑是否生效
```sh
wget https://github.com/oldj/SwitchHosts/releases/download/v4.1.2/SwitchHosts_linux_x86_64_4.1.2.6086.AppImage -O /tmp/switch.AppImage
sudo chmod +x /tmp/switch.AppImage
/tmp/switch.AppImage
```
打开切换中文，打开开发者工具，切换到 `computed style` 观察使用的字体是否为微软雅黑

## 参考资料
- https://monkeywie.cn/2021/09/26/wsl2-gui-idea-config/
- https://shurufa.sogou.com/linux/guide--