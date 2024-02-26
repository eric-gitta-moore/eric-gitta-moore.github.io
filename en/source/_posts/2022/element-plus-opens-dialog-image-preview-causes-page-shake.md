---
title: element-plus opens Dialog, image preview causes page shake
subtitle: element-plus opens Dialog, image preview causes page shake
date: 2022-07-20 14:48:18
toc: true
tags: 
categories: 
    - Default
---

#### Solution
Use the `el-scrollbar` component instead of the browser's scrollbar on the `body` element. Wrap all pages with this component within the `RouterView`.

![16936523905371693652389843.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936523905371693652389843.png)

#### Shaking Issue:
![16936525975351fb2326de60440c09eaa21600c0e57c2.gif](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936525975351fb2326de60440c09eaa21600c0e57c2.gif)

However, I noticed that there was no shaking in the Element Plus official documentation preview. So, I inspected it with F12 to see how they implemented it.

![16936526155351693652614788.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526155351693652614788.png)

You can see that the Element website uses the [scrollbar](https://element-plus.org/zh-CN/component/scrollbar.html) component. So, I decided to use this component too in `App.vue`.

![16936526315401693652631105.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526315401693652631105.png)

However, I still encountered issues. After some investigation, I realized that you also need to set the height to make the outer element's height fixed. As long as the inner height is greater than the outer height, the `el-scrollbar` will generate a scrollbar. But be careful not to make the outer element's height exceed 100vh. For example, setting it to 120vh will result in two scrollbars because the scrollbar component only hides the scrollbar of the container it contains, not the scrollbar generated on the body.

![16936526425361693652641724.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526425361693652641724.png)

On the Element website, they set `height: 100vh` for `el-scrollbar__wrap`.

![16936526555351693652655027.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526555351693652655027.png)

For simplicity, I set `el-scrollbar` to 100vh because the `el-scrollbar__wrap` below inherits the parent's height with `height: 100%`, resulting in the same effect.

![16936526665351693652665672.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936526665351693652665672.png)

#### Fixed Effect
![16936527025354a69219b0f5c4c51b620182afd1b84b4.gif](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936527025354a69219b0f5c4c51b620182afd1b84b4.gif)

If both the browser scrollbar and the scrollbar component appear, the possible reason is that you haven't removed the margin from the body.

![16936527279931693652727088.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936527279931693652727088.png)

To remove all margins from elements in `index.html`, you can use the following CSS:

```css
* {
	margin: 0;
	padding: 0;
}
```