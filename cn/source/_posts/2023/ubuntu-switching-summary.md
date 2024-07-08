---
title: Ubuntu 换源总结
subtitle: Ubuntu switching summary
date: 2023-9-24 10:21:54
toc: true
tags: 
categories: 
    - 默认
---

## apt
```sh
sudo sed -i.bak 's/archive.ubuntu.com/mirrors.cernet.edu.cn/g' /etc/apt/sources.list
sudo sed -i 's/security.ubuntu.com/mirrors.cernet.edu.cn/g' /etc/apt/sources.list
sudo apt update
```

## pacman
ref: https://mirrors.tuna.tsinghua.edu.cn/help/msys2/

```sh
sed -i "s#https\?://mirror.msys2.org/#https://mirrors.tuna.tsinghua.edu.cn/msys2/#g" /etc/pacman.d/mirrorlist*
```

## pdm
```sh
pdm config pypi.url https://mirrors.cernet.edu.cn/pypi/web/simple
```

## pip
```sh
pip config set global.index-url https://mirrors.cernet.edu.cn/pypi/web/simple
```

## conda
```sh
cat <<'EOF' > ~/.condarc
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.cernet.edu.cn/anaconda/pkgs/main
  - https://mirrors.cernet.edu.cn/anaconda/pkgs/r
  - https://mirrors.cernet.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.cernet.edu.cn/anaconda/cloud
  pytorch: https://mirrors.cernet.edu.cn/anaconda/cloud
  nvidia: https://mirrors.sustech.edu.cn/anaconda-extra/cloud
EOF

conda clean -i
```

## npm
```sh
npm config set registry https://repo.nju.edu.cn/repository/npm/
yarn config set registry https://repo.nju.edu.cn/repository/npm/
pnpm config set registry https://repo.nju.edu.cn/repository/npm/
```

## Reference
- https://mirror.nju.edu.cn/