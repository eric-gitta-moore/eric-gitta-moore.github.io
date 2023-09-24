---
title: miniconda & cuda & pytorch
subtitle: miniconda & cuda & pytorch
date: 2023-9-24 10:37:57
toc: true
tags: 
categories: 
    - 默认
---

## miniconda
Reference：
- https://docs.conda.io/projects/miniconda/en/latest/miniconda-other-installer-links.html
- https://docs.conda.io/projects/miniconda/en/latest/

```sh
mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm -rf ~/miniconda3/miniconda.sh
```

安装后，初始化新安装的 Miniconda。以下命令针对 bash 和 zsh shell 进行初始化：
```sh
~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init zsh
```

## cuda toolkit（可选）
Reference：
- https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/gpu-compute
- https://docs.nvidia.com/cuda/wsl-user-guide/index.html#cuda-support-for-wsl-2
- https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=WSL-Ubuntu&target_version=2.0&target_type=runfile_local

如果需要编译 CUDA 程序那么这一步是必选
```sh
cd /tmp
wget https://developer.download.nvidia.com/compute/cuda/12.2.2/local_installers/cuda_12.2.2_535.104.05_linux.run
sudo sh cuda_12.2.2_535.104.05_linux.run
```

## pdm
Reference:
- https://pdm.fming.dev/latest/#installation

确保 conda 已经激活
```sh
echo 'export PATH=$PATH:$HOME/.local/bin' >> ~/.zshrc
echo 'export PATH=$PATH:$HOME/.local/bin' >> ~/.bashrc

python3 -m pip install --user pipx
pipx install pdm[all]
```

## pytorch
Reference:
- https://pytorch.org/get-started/locally/
- https://pytorch.org/get-started/locally/#windows-verification

```sh
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

## kaggle cli
Reference:
- https://www.kaggle.com/docs/api

```sh
pip install kaggle

# 打开 https://www.kaggle.com/settings
# 下载 kaggle.json，上传到 ~/.kaggle/kaggle.json

chmod 0644 ~/.kaggle/kaggle.json
```