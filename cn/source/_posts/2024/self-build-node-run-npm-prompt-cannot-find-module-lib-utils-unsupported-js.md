---
title: 自构建 node 运行 npm 提示 Cannot find module '../lib/utils/unsupported.js'
subtitle: Self-build node Run npm prompt Cannot find module '.. /lib/utils/unsupported.js'
date: 2024-06-07 15:47:42
toc: true
tags: 
categories: 
    - 默认
---

## 背景
在 macOS 上自行构建的 arm 版本 node 14，并 copy 到 ~/.nvm/versions/node/v14.999.999 中

## 故障现场
```shell
❯ npm i -g yarn
internal/modules/cjs/loader.js:934
  throw err;
  ^

Error: Cannot find module '../lib/utils/unsupported.js'
Require stack:
- /Users/admin/.nvm/versions/node/v14.999.999/bin/npm
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:931:15)
    at Function.Module._load (internal/modules/cjs/loader.js:774:27)
    at Module.require (internal/modules/cjs/loader.js:1003:19)
    at require (internal/modules/cjs/helpers.js:107:18)
    at /Users/admin/.nvm/versions/node/v14.999.999/bin/npm:19:21
    at Object.<anonymous> (/Users/admin/.nvm/versions/node/v14.999.999/bin/npm:155:3)
    at Module._compile (internal/modules/cjs/loader.js:1114:14)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1143:10)
    at Module.load (internal/modules/cjs/loader.js:979:32)
    at Function.Module._load (internal/modules/cjs/loader.js:819:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ '/Users/admin/.nvm/versions/node/v14.999.999/bin/npm' ]
}
```

## 解决方法
重新指定 `make --prefix=` 到 `~/.nvm/versions/node/v14.999.999` 目录，再 `make install` 即可

## 故障原因
copy 到 .nvm 目录的过程中丢失了软连接，导致 node 寻找依赖的逻辑不符合预期

```shell
[~/.nvm/versions/node/v14.999.999/bin]❯ l
total 136352
drwxr-xr-x  8 admin  staff   256B Jun  5 15:24 .
drwxr-xr-x  6 admin  staff   192B Jun  5 15:25 ..
-rwxr-xr-x  1 admin  staff   600K Jun  5 15:24 corepack
-rwxr-xr-x  1 admin  staff    66M Jun  5 15:24 node
-rwxr-xr-x  1 admin  staff   4.6K Jun  5 15:24 npm
-rwxr-xr-x  1 admin  staff   177B Jun  5 15:24 npx
-rwxr-xr-x  1 admin  staff   8.1K Jun  5 15:24 tnpm
-rwxr-xr-x  1 admin  staff   309B Jun  5 15:24 tnpx
```

这个目录正确的应该如下
```shell
[~/workspace/prebuild-node/v14.21.3/bin]❯ l
total 135096
drwxr-xr-x  8 admin  staff   256B Jun  5 11:23 .
drwxr-xr-x  6 admin  staff   192B Jun  5 11:01 ..
lrwxr-xr-x  1 admin  staff    45B Jun  5 11:01 corepack -> ../lib/node_modules/corepack/dist/corepack.js
-rwxr-xr-x  1 admin  staff    66M Jun  5 11:01 node
lrwxr-xr-x  1 admin  staff    38B Jun  5 11:01 npm -> ../lib/node_modules/npm/bin/npm-cli.js
lrwxr-xr-x  1 admin  staff    38B Jun  5 11:01 npx -> ../lib/node_modules/npm/bin/npx-cli.js
lrwxr-xr-x  1 admin  staff    36B Jun  5 11:23 tnpm -> ../lib/node_modules/tnpm/bin/tnpm.js
lrwxr-xr-x  1 admin  staff    36B Jun  5 11:23 tnpx -> ../lib/node_modules/tnpm/bin/tnpx.js
```

node 是通过 realpath 真实路径寻找依赖的，而不是软链接的路径

<!-- 例如：以 npm 这个命令为例子（版本 v14.21.3） -->

具体报错代码
```js
  1 #!/usr/bin/env node
  2 ;(function () { // wrapper in case we're in module_context mode
  3   // windows: running "npm blah" in this folder will invoke WSH, not node.
  4   /* global WScript */
  5   if (typeof WScript !== 'undefined') {
  6     WScript.echo(
  7       'npm does not work when run\n' +
  8         'with the Windows Scripting Host\n\n' +
  9         "'cd' to a different directory,\n" +
 10         "or type 'npm.cmd <args>',\n" +
 11         "or type 'node npm <args>'."
 12     )
 13     WScript.quit(1)
 14     return
 15   }
 16 
 17   process.title = 'npm'
 18 
 19   var unsupported = require('../lib/utils/unsupported.js')  // <<--------------
 20   unsupported.checkForBrokenNode()
```

## 依赖查找原理
下面以寻找某个依赖 `yargs` 为例说明

文件结构
```shell
[~/.nvm/versions/node/v14.999.999]❯ tree -L 5
.
├── bin
│   ├── corepack
│   ├── node
│   ├── npm
│   ├── npx
├── include
│   └── node
├── lib
│   ├── dtrace
│   └── node_modules
│       ├── corepack
│       ├── npm
│       │   ├── AUTHORS
│       │   ├── CHANGELOG.md
│       │   ├── CONTRIBUTING.md
│       │   ├── LICENSE
│       │   ├── Makefile
│       │   ├── README.md
│       │   ├── bin
│       │   ├── changelogs
│       │   ├── configure
│       │   ├── docs
│       │   ├── lib
│       │   ├── make.bat
│       │   ├── man
│       │   ├── node_modules
│       │   │   ├── xtend
│       │   │   ├── y18n
│       │   │   ├── yallist
│       │   │   ├── yargs # <<<---------- 这里是需要找到的目标
│       │   │   └── yargs-parser
│       │   ├── package.json
│       │   ├── scripts
│       │   └── tap-snapshots
└── share
    ├── doc
    ├── man
    └── systemtap
```

查找步骤：

1. 寻找依赖 `../lib/utils/unsupported.js`

1. 寻找依赖 `yargs`
2. 确定文件当前执行文件路径 `/User/admin/.nvm/versions/node/v14.999.999/bin/npm`
3. 确定真实路径 `realpath /User/admin/.nvm/versions/node/v14.999.999/bin/npm`（这里是 shell 命令）
4. 迭代寻找 `node_modules`
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999/bin/npm)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999/bin)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions/node)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User)/node_modules`（这里是 shell 命令）
    - 没找到
  - **报错**：`Error: Cannot find module '../lib/utils/unsupported.js'`


---
所以说这个软链接是罪魁祸首

如果有软链接的话，目录结构如下
```shell
[~/.nvm/versions/node/v14.999.999]❯ tree -L 5
.
├── bin
│   ├── corepack -> ../lib/node_modules/corepack/dist/corepack.js
│   ├── node
│   ├── npm -> ../lib/node_modules/npm/bin/npm-cli.js
│   ├── npx -> ../lib/node_modules/npm/bin/npx-cli.js
├── include
│   └── node
├── lib
│   ├── dtrace
│   └── node_modules
│       ├── corepack
│       ├── npm
│       │   ├── AUTHORS
│       │   ├── CHANGELOG.md
│       │   ├── CONTRIBUTING.md
│       │   ├── LICENSE
│       │   ├── Makefile
│       │   ├── README.md
│       │   ├── bin
│       │   ├── changelogs
│       │   ├── configure
│       │   ├── docs
│       │   ├── lib
│       │   ├── make.bat
│       │   ├── man
│       │   ├── node_modules
│       │   │   ├── xtend
│       │   │   ├── y18n
│       │   │   ├── yallist
│       │   │   ├── yargs # <<<---------- 这里是需要找到的目标
│       │   │   └── yargs-parser
│       │   ├── package.json
│       │   ├── scripts
│       │   └── tap-snapshots
└── share
    ├── doc
    ├── man
    └── systemtap
```

查找步骤：

1. 寻找依赖 `yargs`
2. 确定文件当前执行文件路径 `/User/admin/.nvm/versions/node/v14.999.999/bin/npm`
3. 确定真实路径 `realpath /User/admin/.nvm/versions/node/v14.999.999/bin/npm`（这里是 shell 命令）
  - 得到真实路径 `/User/admin/.nvm/versions/node/v14.999.999/lib/node_modules/npm/bin/npm-cli.js`
4. 迭代寻找 `node_modules`
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999/lib/node_modules/npm/bin/npm-cli.js)/node_modules`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999/lib/node_modules/npm/bin)/node_modules`（这里是 shell 命令）
    - **找到了**：`/User/admin/.nvm/versions/node/v14.999.999/lib/node_modules/npm/node_modules`
    - 继续找 `yargs` 包：`/User/admin/.nvm/versions/node/v14.999.999/lib/node_modules/npm/node_modules/yargs/package.json`
    - **这里就已经 ok 了，后续是 node 执行的其他流程


## 回顾问题
其实这里出问题的只是 `require('../lib/utils/unsupported.js')` 是一个相对路径的文件，查找会比上面更加简单一些


查找步骤：

1. 寻找依赖 `../lib/utils/unsupported.js`
2. 确定文件当前执行文件路径 `/User/admin/.nvm/versions/node/v14.999.999/bin/npm`
3. 确定真实路径 `realpath /User/admin/.nvm/versions/node/v14.999.999/bin/npm`（这里是 shell 命令）
4. 迭代寻找 `../lib/utils/unsupported.js`
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999/bin/npm)/../lib/utils/unsupported.js`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999/bin)/../lib/utils/unsupported.js`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions/node/v14.999.999)/../lib/utils/unsupported.js`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions/node)/../lib/utils/unsupported.js`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm/versions)/../lib/utils/unsupported.js`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin/.nvm)/../lib/utils/unsupported.js`（这里是 shell 命令）
    - 没找到
  - 执行 `$(dirname /User/admin)/../lib/utils/unsupported.js`（这里是 shell 命令）
    - 没找到
  - **报错**：`Error: Cannot find module '../lib/utils/unsupported.js'`

## 总结
一句话，依赖查找用的是真实路径。

这也是为什么有时候调试项目的依赖的源码时候会莫名其妙报错，或者出现两个 react 版本的问题