---
title: Vite uses monaco-editor Chinese, how does vue react set monaco-editor Chinese
subtitle: Vite uses monaco-editor Chinese, how does vue react set monaco-editor Chinese
date: 2022-08-15 23:45:31
toc: true
tags: 
categories: 
    - Default
---

We can use this plugin for localization, `vite-plugin-monaco-editor-nls`.

However, when I used it, I didn't succeed in localizing it, as I found that this package is already quite old.

So, I fixed it myself and submitted a pull request to the author.

![16936513475351693651346745.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936513475351693651346745.png)

# Usage

```
pnpm add -D vite-plugin-monaco-editor-nls
```

Then, install the language pack. Since the plugin's bundled language pack is quite old, you'll need to install the latest official language pack.

But the official language pack does not provide an npm package. So, you can only install it via a GitHub repository link.

```
pnpm add -D git+https://github.com/microsoft/vscode-loc.git
```

> I have only successfully installed this package once. Later attempts all failed. I tried various proxies, but I couldn't download it. In the end, I had no choice but to transfer it. I cloned it using GitLab (I have to say, Gitee is really tricky, it doesn't allow cloning without public access).

```
pnpm add -D git+https://jihulab.com/eric-gitta-moore/vscode-loc
```

Then, configure your `vite.config.ts` file, and you're good to go.

```typescript
import reactRefresh from '@vitejs/plugin-react-refresh';
import { resolve } from 'path';
import { defineConfig } from 'vite';
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
        /** Vite version should be greater than or equal to 2.3.0 */
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
