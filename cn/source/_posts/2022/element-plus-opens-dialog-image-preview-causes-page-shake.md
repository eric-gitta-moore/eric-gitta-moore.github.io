---
title: element-plus打开Dialog、图片预览导致页面抖动
subtitle: element-plus opens Dialog, image preview causes page shake
date: 2022-07-20 14:48:18
toc: true
tags: 
categories: 
    - 默认
---

#### 解决方法
使用`el-scollbar`组件替代浏览器在body上的滚动条
在`App.vue`中套上这个组件，所有页面都显示在`RouterView`里面

![16936523905371693652389843.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936523905371693652389843.png)

#### 抖动情况：
![16936525975351fb2326de60440c09eaa21600c0e57c2.gif](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936525975351fb2326de60440c09eaa21600c0e57c2.gif)

但是发现element-plus官方文档里面的预览并没有抖动，于是就f12看了下他们是咋实现的。

![16936526155351693652614788.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526155351693652614788.png)

可以看到这里element官网是使用了[scrollbar](https://element-plus.org/zh-CN/component/scrollbar.html)组件
于是我也去使用这个组件
`App.vue`

![16936526315401693652631105.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526315401693652631105.png)

但是发现问题依旧。经过一番排查，这里还需要设置一下高度，要让外层的元素高度固定。只要内层高度大于外层高度，那么`el-scrollbar`就会产生滚动条。
但是要注意不要让外层元素高度超过100vh，比如设置120vh，这种情况会出现两个滚动条，因为scrollbar组件只是隐藏了 被该组件包含的 容器的滚动条，并不包括在body上产生的滚动条

![16936526425361693652641724.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526425361693652641724.png)

这里el官网的方法是对`el-scrollbar__wrap`设置了`height:100vh`

![16936526555351693652655027.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526555351693652655027.png)

我这里为了简便起见，就把`el-scrollbar`设置成100vh，因为下面的`el-scrollbar__wrap`有个`height:100%`属性会继承父级高度，所以效果和上面一样的
`App.vue`

![16936526665351693652665672.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526665351693652665672.png)


#### 修复效果
![16936527025354a69219b0f5c4c51b620182afd1b84b4.gif](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936527025354a69219b0f5c4c51b620182afd1b84b4.gif)

如果浏览器滚动条和scrollbar组件同时出现的话，可能原因是没有去除body的边距

![16936527279931693652727088.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936527279931693652727088.png)

在`index.html`去除所有元素内外边距就好了
```css
* {
	margin: 0;
	padding: 0;
}
```
