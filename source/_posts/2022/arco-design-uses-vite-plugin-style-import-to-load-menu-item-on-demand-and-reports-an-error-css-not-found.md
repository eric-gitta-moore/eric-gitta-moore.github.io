---
title: arco design使用vite-plugin-style-import按需加载menu-item 报错 css未找到
subtitle: arco design uses vite-plugin-style-import to load menu-item on demand and reports an error css not found
date: 2022-08-05 20:21:47
toc: true
tags: 
categories: 
    - 默认
---

 根据官网arco design教程

> 手动导入的方式按需加载组件

解决方案：

将官网示例改成如下，exclude数组是没有css的组件名称。如果不清楚组件名称可以在resolveStyle函数中console.log打印一下

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



报错信息

```
 [vite] Internal server error: Failed to resolve import "D:/Programing/WebstormProjects/cow-Low-code/node_modules/@arco-design/web-vue/es/menu-item/style/css.js" from "src\views\HomeView.vue". Does the file exist?
```



![16936515375371693651537473.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936515375371693651537473.png)