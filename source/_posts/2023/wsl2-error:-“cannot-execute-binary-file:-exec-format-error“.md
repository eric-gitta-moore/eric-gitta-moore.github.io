---
title: WSL2 Error: “cannot execute binary file: Exec format error“
subtitle: WSL2 Error: “cannot execute binary file: Exec format error“
date: 2023-08-02 00:31:37
toc: true
categories: 
    - 默认
---

# 症状
使用非Ubuntu发行版wsl，且开启了systemd，在wsl中运行windows程序报错

```zsh
❯ code
/mnt/c/Users/mystic/AppData/Local/Programs/Microsoft VS Code/bin/code: 61: /mnt/c/Users/mystic/AppData/Local/Programs/Microsoft VS Code/Code.exe: Exec format error
❯ explorer.exe .
zsh: exec format error: explorer.exe
```

# 解决

```zsh
sudo sh -c 'echo :WSLInterop:M::MZ::/init:PF > /usr/lib/binfmt.d/WSLInterop.conf'
sudo systemctl unmask systemd-binfmt.service
sudo systemctl restart systemd-binfmt
sudo systemctl mask systemd-binfmt.service
```

