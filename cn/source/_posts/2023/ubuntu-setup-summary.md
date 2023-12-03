---
title: Ubuntu Setup 总结
subtitle: Ubuntu Setup summary
date: 2023-9-24 10:37:57
toc: true
tags: 
categories: 
    - 默认
---

> 以下内容只针对于 Ubuntu/Debian，推荐使用 Ubuntu Jammy 或者 Ubuntu Focal

1. [换源](/2023/ubuntu-switching-summary/)
2. [zsh & powerlevel10k](/2023/zsh-install-powerlevel10k-install-the-p10k-plug-in/)
2. [语言包 & 搜狗输入法](/2023/sogou-input-method-chinese-pinyin-is-installed-in-wsl/)
4. cpp: run `sudo apt install build-essential -y`
5. [miniconda & cuda & pytorch](/2023/miniconda-cuda-pytorch/)
6. nvm & node
Reference:
- https://github.com/nvm-sh/nvm#installing-and-updating

```sh
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
```
7. java & jenv
Reference:
- https://mirror.nju.edu.cn/mirrorz-help/Adoptium/
- https://github.com/jenv/jenv#1-getting-started

```sh
# java
sudo apt-get update && sudo apt-get install -y wget apt-transport-https
sudo mkdir /etc/apt/keyrings/
sudo wget -O /etc/apt/keyrings/adoptium.asc https://packages.adoptium.net/artifactory/api/gpg/key/public
echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://mirrors.tuna.tsinghua.edu.cn/Adoptium/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
sudo apt-get update
sudo apt-get install temurin-8-jdk temurin-11-jdk temurin-17-jdk

# jenv
git clone https://github.com/jenv/jenv.git ~/.jenv
# Shell: bash
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.bash_profile
echo 'eval "$(jenv init -)"' >> ~/.bash_profile
# Shell: zsh
echo 'export PATH="$HOME/.jenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(jenv init -)"' >> ~/.zshrc

# 重启 shell & 添加 java 版本
dirname $(dirname $(readlink -f $(which java)))
jenv add "$(dirname $(dirname $(readlink -f $(which java))))"

jenv versions

jenv global 11
```
8、PHP & phpenv
Reference:
- https://github.com/phpbrew/phpbrew/blob/master/README.cn.md
- https://blog.csdn.net/Annlix/article/details/119759752
- https://github.com/phpbrew/phpbrew/wiki/Variant-Dependencies
```
# phpenv Requirement
sudo apt-get install \
  build-essential \
  libbz2-dev \
  libreadline-dev \
  libsqlite3-dev \
  libcurl4-gnutls-dev \
  libzip-dev \
  libssl-dev \
  libxml2-dev \
  libxslt-dev \
  libonig-dev \
  php7.4-cli \
  php7.4-bz2 \
  php7.4-xml \
  pkg-config

# install phpenv
curl -L -O https://github.com/phpbrew/phpbrew/releases/latest/download/phpbrew.phar
chmod +x phpbrew.phar
sudo mv phpbrew.phar /usr/local/bin/phpbrew
phpbrew init
echo "[[ -e ~/.phpbrew/bashrc ]] && source ~/.phpbrew/bashrc" >> ~/.zshrc
source ~/.phpbrew/bashrc

phpbrew update

# Requirement for phpbrew everything variant，reference：https://blog.csdn.net/Annlix/article/details/119759752
sudo apt install libsystemd-dev libacl1-dev libapparmor-dev valgrind libdmalloc-dev systemtap-sdt-dev krb5-multidev libkrb5-dev libssl-dev libsqlite3-dev libbz2-dev libcurl4-openssl-dev libenchant-2-dev libgmp-dev libc-client2007e-dev libldap2-dev libsasl2-dev libonig-dev unixodbc-dev libpspell-dev libedit-dev libsnmp-dev libsodium-dev libargon2-dev libtidy-dev libzip-dev libwebp-dev
# gd
sudo apt-get install libjpeg8-dev libpng-dev libfreetype6-dev
# pgsql
sudo apt install libpq-dev

# build php
phpbrew install -j $(nproc) 7.3 +default +dbs +mb
```