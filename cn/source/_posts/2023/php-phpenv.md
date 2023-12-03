---
title: PHP & phpenv
subtitle: PHP & phpenv
date: 2023-12-3 14:32:34
toc: true
tags: 
categories: 
    - 默认
---


PHP & phpenv

Reference:
- https://github.com/phpbrew/phpbrew/blob/master/README.cn.md
- https://blog.csdn.net/Annlix/article/details/119759752
- https://github.com/phpbrew/phpbrew/wiki/Variant-Dependencies
- https://getcomposer.org/download/

```shell
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
phpbrew install -j $(nproc) 7.3 +default +dbs +mb +fpm +gd

# phpbrew switch 7.3.xx

# composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('sha384', 'composer-setup.php') === 'e21205b207c3ff031906575712edab6f13eb0b361f2085f1f1237b7126d785e826a450292b6cfd1d64d92e6563bbde02') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"

sudo mv composer.phar /usr/local/bin/composer
```