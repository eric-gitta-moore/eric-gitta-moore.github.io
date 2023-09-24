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
- https://mirror.nju.edu.cn/Adoptium/
- https://github.com/jenv/jenv#1-getting-started

```sh
# java
sudo apt-get update && sudo apt-get install -y wget apt-transport-https
wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo tee /etc/apt/keyrings/adoptium.asc
echo "deb [signed-by=/etc/apt/keyrings/adoptium.asc] https://mirrors.cernet.edu.cn/Adoptium/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
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

jenv add "$(which java)"
```