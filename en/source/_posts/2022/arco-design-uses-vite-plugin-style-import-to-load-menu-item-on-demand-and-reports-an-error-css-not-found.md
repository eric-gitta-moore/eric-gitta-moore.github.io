---
title: arco design uses vite-plugin-style-import to load menu-item on demand and reports an error css not found
subtitle: arco design uses vite-plugin-style-import to load menu-item on demand and reports an error css not found
date: 2022-08-05 20:21:47
toc: true
tags: 
categories: 
    - Default
---

According to the official arco design tutorial:

> Manually import components on demand

Solution:

Modify the official website example as follows, the exclude array contains the names of components without CSS. If you are not sure about the component names, you can print them in the `resolveStyle` function using `console.log`.

```javascript
createStyleImportPlugin({
      libs: [
        {
          libraryName: '@arco-design/web-vue',
          esModule: true,
          resolveStyle: (name) => {
            const exclude = ['menu-item']
            if (exclude.includes(name)) return ''
            // css
            return `@arco-design/web-vue/es/${name}/style/css.js`
          },
        },
      ],
    }),
```


Error message:

```
 [vite] Internal server error: Failed to resolve import "D:/Programing/WebstormProjects/cow-Low-code/node_modules/@arco-design/web-vue/es/menu-item/style/css.js" from "src\views\HomeView.vue". Does the file exist?
```

![16936515375371693651537473.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936515375371693651537473.png)