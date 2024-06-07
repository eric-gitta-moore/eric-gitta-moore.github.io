---
title: macOS Apple Silicon 源码构建 node14
subtitle: macOS Apple Silicon source code builds node14
date: 2024-06-07 16:30:00
toc: true
tags: 
categories: 
    - 默认
---

## 背景
有时项目很多依赖比较老，安装时候需要现场构建，对 node 版本比较敏感。

虽然可以通过 `arch -x86_64 nvm install 14` 来安装 x86 架构的 node 版本，但是性能肯定是需要打折扣的（主要是看着不舒服٩(•̤̀ᵕ•̤́๑)ᵒᵏᵎᵎᵎᵎ）

## 安装过程
> 直接用 `nvm install -s 14` 可以源码安装但是会有 cpp 的报错，
> 究其具体原因大概是因为 arm 和 x86 enum 枚举的长度限制不一导致的
> 这个需要我们用参数忽略掉 `-Wno-enum-constexpr-conversion`
> 但是 nvm 并没有给我们提供修改的能力。所以我们本次直接拉 git source code 构建

```shell
# cpp 构建环境自行安装这里不再赘述，不过应该以前就有意无意中安装过，可以在下面执行的时候碰到了报错再说
> git clone https://github.com/nodejs/node.git
> cd node
> git checkout v14.21.3
> mkdir ~/.nvm/versions/node/v14.21.3
```

然后需要修改一下文件 `vim common.gypi` ，大概是这个位置 https://github.com/nodejs/node/blob/v14.21.3/common.gypi#L498

```diff
      ['OS=="mac"', {
        'defines': ['_DARWIN_USE_64_BIT_INODE=1'],
        'xcode_settings': {
          'ALWAYS_SEARCH_USER_PATHS': 'NO',
          'GCC_CW_ASM_SYNTAX': 'NO',                # No -fasm-blocks
          'GCC_DYNAMIC_NO_PIC': 'NO',               # No -mdynamic-no-pic
                                                    # (Equivalent to -fPIC)
          'GCC_ENABLE_CPP_EXCEPTIONS': 'NO',        # -fno-exceptions
          'GCC_ENABLE_CPP_RTTI': 'NO',              # -fno-rtti
          'GCC_ENABLE_PASCAL_STRINGS': 'NO',        # No -mpascal-strings
          'PREBINDING': 'NO',                       # No -Wl,-prebind
          'MACOSX_DEPLOYMENT_TARGET': '10.13',      # -mmacosx-version-min=10.13
          'USE_HEADERMAP': 'NO',
          'OTHER_CFLAGS': [
            '-fno-strict-aliasing',
          ],
          'WARNING_CFLAGS': [
            '-Wall',
            '-Wendif-labels',
            '-W',
            '-Wno-unused-parameter',
+            '-Wno-enum-constexpr-conversion',
          ],
        },
```

然后继续 make & install 就 ok

```shell
> ./configure --prefix=`realpth ~/.nvm/versions/node/v14.21.3`
> make -j `sysctl hw.logicalcpu`
> make install
> nvm use 14
```

最后检查一下版本和架构
```shell
❯ file `which node`
/Users/admin/.nvm/versions/node/v14.21.3/bin/node: Mach-O 64-bit executable arm64
```

coding !

## 参考
- https://github.com/nodejs/node/issues/52230#issuecomment-2024353730
- https://github.com/nvm-sh/nvm/issues/2218#issuecomment-902697494