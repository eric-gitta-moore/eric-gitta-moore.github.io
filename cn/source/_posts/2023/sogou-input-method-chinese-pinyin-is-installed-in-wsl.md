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
```

## 配置字体
```sh
cat <<'EOF' | sudo tee /etc/fonts/local.conf
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
    <dir>/mnt/c/Windows/Fonts</dir>
</fontconfig>
EOF

sudo fc-cache -f -v
```

## 配置 fcitx
```sh
sudo apt install fcitx

# 开机自启动
sudo ln -fs /lib/systemd/system/rc-local.service /etc/systemd/system/rc-local.service
cat <<'EOF' | sudo tee /etc/rc.local
#!/bin/bash
fcitx-autostart &>/dev/null
EOF
```

## 配置搜狗输入法
下载搜狗输入法
```sh
wget 搜狗输入法下载地址 -O /tmp/so.deb

sudo dpkg -i /tmp/so.deb
```

下载依赖
```sh
sudo apt install libqt5qml5 libqt5quick5 libqt5quickwidgets5 qml-module-qtquick2

sudo apt install libgsettings-qt1
```

## 启用输入法
```sh
fcitx-config-gtk3
```

![1](https://shurufa.sogou.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhelp15.c14aafcd.png&w=1080&q=75)

![2](https://shurufa.sogou.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhelp16.e32b0f4a.png&w=1080&q=75)

## 参考资料
- https://monkeywie.cn/2021/09/26/wsl2-gui-idea-config/
- https://shurufa.sogou.com/linux/guide--