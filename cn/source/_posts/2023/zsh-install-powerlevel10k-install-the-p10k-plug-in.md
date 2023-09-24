---
title: zsh 安装 powerlevel10k 安装 p10k 插件
subtitle: zsh Install powerlevel10k Install the p10k plug-in
date: 2023-9-24 10:14:10
toc: true
tags: 
categories: 
    - 默认
---

## Install

```sh
# zsh
sudo apt install zsh
chsh -s $(which zsh)

# ohmyzsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# p10k
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
sed -i 's#robbyrussell#powerlevel10k/powerlevel10k#' ~/.zshrc

# plugin
sed -i 's/plugins=(git)//' ~/.zshrc
cat <<'EOF' | tee -a ~/.zshrc
plugins=(
  git
  command-not-found
  colored-man-pages
  vi-mode
  zsh-autosuggestions
  zsh-syntax-highlighting
)
EOF

git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# z.lua
sudo apt install -y lua5.2
git clone https://github.com/skywind3000/z.lua.git ~/.z.lua
echo 'eval "$(lua ~/.z.lua/z.lua  --init zsh once enhanced)"' >> ~/.zshrc

# 重启 zsh 并配置 p10k
exec zsh
```

## Reference
- https://ohmyz.sh/#install
- https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH