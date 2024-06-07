---
title: macOS 安装 node-sass + conda python2.7
subtitle: macOS install node-sass + conda python2.7
date: 2024-06-07 16:50:13
toc: true
tags: 
categories: 
    - 默认
---

## 背景
个别前端项目有使用 node-sass 依赖

最开始尝试使用 node 16，但是发现无法编译 node-sass

于是尝试修改为同年份的 sass，发现个别语法不兼容

之后手动编译了 node 14 arm 版本，而且 node-sass 依赖 python2，需要配合 conda python2.7 才安装上来的

但是 mac Apple Silicon Chip 又是 arm 架构，当时 python 2.7 早就 EOL 了

## 坑点
主要坑点在于 conda python2.7 的安装

目前 conda 已经把 python2 的源剔除了，直接 `conda create -n py2 python==2.7` 会报错说找不到

而且 Apple Silicon Chip 发布在 python 2.7 EOL 之后

如下所示：
```shell
PackagesNotFoundError: The following packages are not available from current channels:

  - python=2.7

Current channels:

  - https://conda.anaconda.org/conda-forge/osx-arm64
  - https://conda.anaconda.org/conda-forge/noarch

 To search for alternate channels that may provide the conda package you're
 looking for, navigate to

    https://anaconda.org

and use the search bar at the top of the page.
```

## 解决方法
```shell
CONDA_SUBDIR=osx-64 conda create -n py27 python=2.7  # include other packages here
# ensure that future package installs in this env stick to 'osx-64'
conda activate py27
```


## 参考
- https://stackoverflow.com/questions/67380286/anaconda-channel-for-installing-python-2-7
- https://www.cnblogs.com/suanec/p/15684862.html