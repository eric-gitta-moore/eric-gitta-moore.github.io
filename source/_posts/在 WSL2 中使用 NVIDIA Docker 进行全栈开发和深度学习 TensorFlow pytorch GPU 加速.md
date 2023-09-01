---
title: 在 WSL2 中使用 NVIDIA Docker 进行全栈开发和深度学习 TensorFlow pytorch GPU 加速
subtitle: Full-stack development and deep learning TensorFlow pytorch GPU acceleration using NVIDIA Docker in WSL2
date: 2023-08-31 11:13:32
toc: true
---


## 0. 背景

### 0.1 起源

- 生产环境都是在 k8d pod 中运行，直接在容器中开发不好嘛？
- 每次换电脑，都要配配配，呸呸呸
- 新电脑只安装日常用的软件不好嘛，环境变量配配配，各种日常软件和开发软件到处拉💩
- 虚拟机呗，怎么调用 GPU 是个问题，hyper-v 好像是可以魔改配置实现，又得改改改。改好了本地能跑了，生产给你报错报错错错错
- 到处拉💩，文件弄乱了怎么办，容器直接销毁重建就完事，分分钟解决。电脑重装再配环境也遭不住

### 0.2. 容器化开发之后

- 宿主机电脑随便换，随便重装。重装之后我只要 `上网` + `wsl --install` + `get docker` + `docker compose up -d` 就完事了
- 换 macOS？没事，`docker compsoe up -d`
- 换 Windows？没事，`docker compose up -d`
- 没电脑？没事，搞台远程机子 `ssh` +  `docker compose up -d`
- 电脑炸了？没事，所有 git 修改都在远端有一份。开发环境换台机子 `docker compose up -d` 继续

### 0.3 不足

- 如果是做 k8s 开发的，估计不行，起本地集群建议用 vagrant。本质上一个容器根本无法解决这个问题
- 如果没有机器不支持 `systemd` 没法搞，比如公司只给提供开发容器环境（只能操作给你的容器），这个情况下目前正在解决，使用 ansible 重写 Dockerfile 里面的脚本，摆脱容器限制。主要区别就是环境安装过程在本地还是在远端

## 1. 前置条件

### 1.1. 安装系统

Windows 10 版本 2004 及更高版本（内部版本 19041 及更高版本）或 Windows 11

**跳过**

### 1.2. 处理好网络环境

安装过程中需要访问国际网络，自行处理好。建议开启 tun 模式

## 2. 准备 WSL

### 2.1. 安装 WSL

在管理员模式下打开 PowerShell 或 Windows 命令提示符

```sh
wsl --install
```

安装完成，重启电脑

### 2.2. 首次打开 WSL

重启完成后，打开 powershell，输入

```sh
wsl
```

此时应该会提示为 Linux 发行版创建“用户名”和“密码”

> 如果这里提示没有安装 Linux 发行版，那么这里可以再次执行 `wsl --install`，会自动安装 Ubuntu 22.04 LTS

### 2.3. 设置 root 密码

```sh
sudo passwd
```

### 2.4. 换源

切换到 root 用户，执行下面命令换源

```sh
cat <<'EOF' > /etc/apt/sources.list
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirror.nju.edu.cn/ubuntu/ jammy main restricted universe multiverse
# deb-src https://mirror.nju.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirror.nju.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src https://mirror.nju.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirror.nju.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src https://mirror.nju.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse

deb https://mirror.nju.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
# deb-src https://mirror.nju.edu.cn/ubuntu/ jammy-security main restricted universe multiverse

# deb http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse
# # deb-src http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirror.nju.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
# # deb-src https://mirror.nju.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
EOF
```

> 出处：南京大学镜像站 -> https://mirror.nju.edu.cn/mirrorz-help/ubuntu/?mirror=NJU

### 2.5.（可选）迁移 WSL 磁盘目录

这里以迁移到 `D:\hyper-v\ubu1\ubu1.vhdx` 为例

### 2.6. 设置默认用户

把 `你的用户名` 替换成你设置的用户名，然后在 WSL 中执行

```sh
sudo echo "[user]\ndefault=你的用户名" >> /etc/wsl.conf
```

比如我的用户名是 `linux`，那么我执行的命令就是 `sudo echo "[user]\ndefault=linux" >> /etc/wsl.conf`

### 2.7. 导出磁盘镜像

在 Windows poweshell 中执行

```sh
wsl --export Ubuntu d:\hyper-v\ubu1\ubu1.vhdx --vhd
```

### 2.8. 删除原系统

```sh
wsl --unregister Ubuntu
```

### 2.9. 导入新系统

```sh
wsl --import-in-place ubu1 d:\hyper-v\ubu1\ubu1.vhdx
```

## 3. 配置 NVIDIA Docker

### 3.1. 安装 Docker

> 参考：docker 官网 和 南京大学镜像 -> https://mirror.nju.edu.cn/mirrorz-help/docker-ce/?mirror=NJU

在 powershell 中输入 `wsl`，进入 WSL 中，执行

首先安装依赖：

```sh
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
```

信任 Docker 的 GPG 公钥并添加仓库：

```sh
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://mirror.nju.edu.cn/docker-ce/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

最后安装 Docker

```sh
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 3.2. 配置普通用户直接使用 Docker 命令

```sh
sudo gpasswd -a $USER docker
newgrp docker
```

### 3.3 安装 NVIDIA 支持

> 参考：微软 WSL 官方文档：https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/gpu-compute

通过运行以下命令为 NVIDIA 容器工具包设置稳定存储库：

```sh
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-docker-keyring.gpg
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-docker-keyring.gpg] https://#g' | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
```

安装 NVIDIA 运行时包和依赖项

```sh
sudo apt-get update
sudo apt-get install -y nvidia-docker2
```

### 3.4 Docker 换源

> 参考：南京大学镜像

修改配置文件

```sh
sudo nano /etc/docker/daemon.json
```

正常走到这一步应该是这样的

![16934842593104adf16cae3f4c17cb676b650e7ab189a.png](https://github.com/james-curtis/blog-img/raw/img/img/16934842593104adf16cae3f4c17cb676b650e7ab189a.png)

<br/>

添加一行

```json
,"registry-mirrors": ["https://docker.nju.edu.cn/"]
```

<br/>

![169348443613133713cbe8c88e63ec50c28abeb2a443e.png](https://github.com/james-curtis/blog-img/raw/img/img/169348443613133713cbe8c88e63ec50c28abeb2a443e.png)

<br/>

按下 `ctrl+o` 再按下 `回车` 保存文件

再按下 `ctrl+x` 退出编辑器

检查一下结果，`cat /etc/docker/daemon.json`

<br/>

![1693484492129119f80574646149e30461fa3f60246fc.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484492129119f80574646149e30461fa3f60246fc.png)

<br/>

重启 Docker

```sh
sudo systemctl restart docker
```

## 4. 拉取 & 运行 Docker 镜像

> 这个全栈开发镜像是我自己构建的
Dockfile 在 GitHub 仓库这里 https://github.com/james-curtis/code-os-debian
包含了
> 
> - zsh
> - ohmyzsh
> - powerlevel10k
> - 中文语言包，gui 下微软雅黑字体支持
> - nodejs、nvm
> - openssh
> - c++
> - wslg 透传到 Windows 母机支持
> - Python、conda、pdm
 temurin 8、11、17 jdk，jenv
 docker cli
 TensorFlow
 pytorch
 cuda 11.8、cudatoolkit

### 4.1. 拉取镜像

由于镜像较大，建议单独拉取

- GPU 支持镜像（9.94 GB）：`jamescurtisfoxmail/code-os:latest-gpu`
- 仅 CPU 支持镜像（2.77 GB）：`jamescurtisfoxmail/code-os:latest`

这里以 GPU 支持镜像为例

```sh
docker pull jamescurtisfoxmail/code-os:latest-gpu
```

### 4.2. 下载 compose 配置

下载 Docker compose 配置

```sh
git clone https://github.com/james-curtis/code-os-debian.git
```

### 4.3. 启动 Docker compose

启动 docker compose

```sh
cd code-os-debian/docker/wsl/
bash run-gpu.sh
```

可以看到已经启动成功了
![1693484526128a07ecfed1340e7d02b919f23da9378c3.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484526128a07ecfed1340e7d02b919f23da9378c3.png)

## 5. 检验成果

先进入 Docker 容器

```sh
source .gpu-envrc
docker compose exec os zsh
```

![1693484539128fb39edd4cc37214c59b3cfd33a419119.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484539128fb39edd4cc37214c59b3cfd33a419119.png)

> 如果字体乱码，应该是没有配置 powerlevel10k 的 `MesloLGS NF` 字体支持。
> 
> 我使用的终端是 `tabby` 全平台支持    
> 
>  ![169348454912865a864d5c148fa2d05c1ef3a0f4cd041.png](https://github.com/james-curtis/blog-img/raw/img/img/169348454912865a864d5c148fa2d05c1ef3a0f4cd041.png)
> 
> 在项目中有这几个字体，复制到 `c:\windows\fonts` 中即可
> 
> ![1693484558129f5fa68a6adf756a7251eddb9cf098e08.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484558129f5fa68a6adf756a7251eddb9cf098e08.png)

### 5.1. 检测 wslg 支持

`xeyes` 会显示一个跟随鼠标的小眼睛

`xclock` 是显示一个时钟

<br/>

![16934845681289dc2fb94f291f99e9c92fb8286d1299e.png](https://github.com/james-curtis/blog-img/raw/img/img/16934845681289dc2fb94f291f99e9c92fb8286d1299e.png)

### 5.2. 检测 NVIDIA 支持

```sh
nvidia-smi
```

![16934845861283b76e4afea48293b2be2659a6259389e.png](https://github.com/james-curtis/blog-img/raw/img/img/16934845861283b76e4afea48293b2be2659a6259389e.png)
我这里显示出了母机的 3060，说明 Docker 已经检测到这张显卡

### 5.3. 检测 TensorFlow支持

#### 5.3.1 TensorFlow CPU

```sh
python3 -c "import tensorflow as tf; print(tf.reduce_sum(tf.random.normal([1000, 1000])))"
```

![1693484594155ce96a3ea90d8dd75ead62cb469ca6561.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484594155ce96a3ea90d8dd75ead62cb469ca6561.png)

打印出了张量

#### 5.3.2 TensorFlow GPU

```sh
python3 -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"
```

![1693484602126dce0e8a22b6a116b0332392835e9010e.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484602126dce0e8a22b6a116b0332392835e9010e.png)

可以看到 TensorFlow 也检测到了显卡

#### 5.3.3 安装 kaggle cli

```sh
pip install kaggle
```

登录 kaggle 下载登录凭据，下载到 `~/.kaggle/kaggle.json`

> 官方教程 https://github.com/Kaggle/kaggle-api#api-credentials

设置权限

```sh
chmod 600 ~/.kaggle/kaggle.json
```

![1693484611126002ed3169310ad3a2442ea36491ac828.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484611126002ed3169310ad3a2442ea36491ac828.png)

#### 5.3.4 检测 TensorFlow GPU 负载支持

这里我们使用 kaggle cli 下载比赛中别人提交的代码进行测试，https://www.kaggle.com/code/hassanamin/tensorflow-mnist-gpu-tutorial

![16934846191270cd4adf205ebd8790e2b4bde76166a2b.png](https://github.com/james-curtis/blog-img/raw/img/img/16934846191270cd4adf205ebd8790e2b4bde76166a2b.png)
复制下载命令

![1693484626126a7990a1e7044a3bb5a2054ec07eb7c8a.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484626126a7990a1e7044a3bb5a2054ec07eb7c8a.png)

**启动 openssh-server**

```sh
sudo service ssh start
```

输入密码 `linux` 

> 默认用户和密码都是 `linux`
> 
> `root` 用户名也是 `linux`

![16934846331264737dece647d08f3fd827674cb12bd7b.png](https://github.com/james-curtis/blog-img/raw/img/img/16934846331264737dece647d08f3fd827674cb12bd7b.png)

**打开 vscode 进行远程连接**
需要先下载远程开发插件 `ms-vscode-remote.vscode-remote-extensionpack`

![16934846411276154d21eb0a904f597d3fcb891ce5345.png](https://github.com/james-curtis/blog-img/raw/img/img/16934846411276154d21eb0a904f597d3fcb891ce5345.png)

点击左下角的蓝标，会弹出命令列表，选择 `Connect to host`

<br/>

![1693484662126f34f5829cb9c8ae47ed3eba65b933212.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484662126f34f5829cb9c8ae47ed3eba65b933212.png)

<br/>

直接连接 `localhost` 即可

<br/>

> 为什么可以直接通过 `localhost` 连接有两个原因
> 
> 1. 微软支持宿主机直接访问 WSL 的监听端口
> 2. docker compose 中设置的 `network` 类型是 `host`，也就是和 WSL 公用一个网络

![1693484685126844afa00df2604630c9f9dc7df47533a.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484685126844afa00df2604630c9f9dc7df47533a.png)

点击右侧的 `Connect` 

![16934846901241578876302c28e81b0e1922330432b6f.png](https://github.com/james-curtis/blog-img/raw/img/img/16934846901241578876302c28e81b0e1922330432b6f.png)
会提示选择平台和输入密码

完成之后即可进行远程开发

**进入刚刚 kaggle 的项目**

这里由于的刚刚我下载的目录是 `/tmp/kaggle/tf` 所以这里我需要打开这个目录

![1693484697124b68c65ea075ddb3ca0f4bae8f94dfaa2.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484697124b68c65ea075ddb3ca0f4bae8f94dfaa2.png)
**安装插件**
需要安装的插件有

- donjayamanne.python-extension-pack
- donjayamanne.python-extension-pack

安装完成之后需要加载窗口

**选择运行环境**
选择 conda Python3.9 作为运行环境
![16934847051258ce5bc169a1945be5f4a05805a73f026.png](https://github.com/james-curtis/blog-img/raw/img/img/16934847051258ce5bc169a1945be5f4a05805a73f026.png)
逐个单元格运行试试效果

可以看到检测到 GPU 了
![1693484713124268cedbf858fe22cf23a9d8a0a0b15c6.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484713124268cedbf858fe22cf23a9d8a0a0b15c6.png)
可以看到成功调用宿主机显卡
![16934847201250b779cecd0e73850fd2689ddf9d169cc.png](https://github.com/james-curtis/blog-img/raw/img/img/16934847201250b779cecd0e73850fd2689ddf9d169cc.png)
不过似乎没有使得显卡满载

### 5.4. 检测 pytorch cuda 支持

在 WSL 中执行

```sh
python3 -c "import torch;print(torch.cuda.is_available());"
```

![169348472712535ea23e934d88048e2c6c8dab35c3aea.png](https://github.com/james-curtis/blog-img/raw/img/img/169348472712535ea23e934d88048e2c6c8dab35c3aea.png)

> 这里我还没有换 vscode 的终端字体，所以乱码了，忽略即可

#### 5.4.1 检测 pytorch GPU 负载支持

对于 pytorch，这里使用 https://www.kaggle.com/code/lyhue1991/pytorch-gpu-examples，作为测试 demo

![1693484734124b153e92b893a5c208c7eb054b3154899.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484734124b153e92b893a5c208c7eb054b3154899.png)

![1693484743125e0d3a43375a635fe2a488d29b8a0c0ea.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484743125e0d3a43375a635fe2a488d29b8a0c0ea.png)

![169348475112489327abd58292ac9fc75036ecd4b132e.png](https://github.com/james-curtis/blog-img/raw/img/img/169348475112489327abd58292ac9fc75036ecd4b132e.png)

![169348476212373dcb403f84c118c1e16e48e6bf352ad.png](https://github.com/james-curtis/blog-img/raw/img/img/169348476212373dcb403f84c118c1e16e48e6bf352ad.png)
可以看到成功调度 GPU

### 6. 检查 nodejs

```sh
node -v
nvm list
```

![16934847731247a5f0ca36fe146f3fa6985adb40d9a4c.png](https://github.com/james-curtis/blog-img/raw/img/img/16934847731247a5f0ca36fe146f3fa6985adb40d9a4c.png)

### 7. 检查 java

```sh
java -version
javac -version
jenv versions
```

![1693484779123aaba208a8173522f6b82e93ac2a64cb9.png](https://github.com/james-curtis/blog-img/raw/img/img/1693484779123aaba208a8173522f6b82e93ac2a64cb9.png)

### 8. 检查 c++

```sh
g++ -v
gcc -v
```

![169348478612341eb734dbd75537dc43fba98abb4c225.png](https://github.com/james-curtis/blog-img/raw/img/img/169348478612341eb734dbd75537dc43fba98abb4c225.png)

### 9. 容器卷

在 Dockerfile 中有写到

```dockerfile
# =========== 配置 容器卷 =============
VOLUME [ "/mnt/workspace", "/mnt/data" ]
```

这两个目录都是持久化的，也就是 docker 容器销毁之后，只有这两个目录下的文件不会清理（重启不影响）

其中 `/mnt/workspace` 是映射到 WSL 中的，IO 性能比较差

`/mnt/data` 是没有映射的容器卷，IO 性能较好，建议项目都放到该目录下

至于 `/home/linux` 用户目录下的文件可以自己创建并映射容器卷

## 6. 参考文档

- https://learn.microsoft.com/zh-cn/windows/wsl/install
- https://docs.docker.com/engine/install/ubuntu/
