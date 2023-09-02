---
title: vite使用monaco-editor汉化，vue react怎么设置monaco-editor中文
subtitle: Vite uses monaco-editor Chinese, how does vue react set monaco-editor Chinese
date: 2022-08-15 23:45:31
toc: true
tags: 
categories: 
    - 默认
---

我们可以使用这个插件进行汉化，vite-plugin-monaco-editor-nls

不过在我使用的时候并没有汉化成功，发现这个已经是很老的包了。

于是自己修复了一下pr给作者了

![16936513475351693651346745.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936513475351693651346745.png)

#  使用

```
pnpm add -D vite-plugin-monaco-editor-nls
```



然后安装语言包。由于插件自带的语言包已经很老的，所以要安装官方最新的语言包。

但是官方的语言包并没有提供npm包。所以只能安装github仓库链接了

```
pnpm add -D git+https://github.com/microsoft/vscode-loc.git
```



> 这条命令我只安装成功过一次。后面全部都是失败。配置各种代理，死活下载不过来。最后没办法只能中转一下。用gitlab给clone过来（不得不说码云真的坑，克隆这个仓库不给改公开权限）

```
pnpm add -D git+https://jihulab.com/james-curtis/vscode-loc
```



 然后配置一下vite.config.ts就大功告成了

```
import reactRefresh from '@vitejs/plugin-react-refresh';
import {resolve} from 'path';
import {defineConfig} from 'vite';
import MonacoEditorNlsPlugin, {
    esbuildPluginMonacoEditorNls,
    Languages,
} from 'vite-plugin-monaco-editor-nls';
import Inspect from 'vite-plugin-inspect';

const zh_CN = require('vscode-loc.git/i18n/vscode-language-pack-zh-hans/translations/main.i18n.json')

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    resolve: {
        alias: {
            '@': resolve('./src'),
        },
    },
    build: {
        sourcemap: true,
    },
    optimizeDeps: {
        /** vite 版本需要大于等于2.3.0 */
        esbuildOptions: {
            plugins: [
                esbuildPluginMonacoEditorNls({
                    locale: Languages.zh_hans,
                    /**
                     * The weight of `localedata` is higher than that of `locale`
                     */
                    localeData: zh_CN.contents
                }),
            ],
        },
    },
    plugins: [
        reactRefresh(),
        Inspect(),
        MonacoEditorNlsPlugin({
            locale: Languages.zh_hans,
            /**
             * The weight of `localedata` is higher than that of `locale`
             */
            localeData: zh_CN.contents
        }),
    ],
});
```

