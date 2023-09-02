---
title: educoder头歌强制显示右侧目录按钮，方便查看测试代码，便于怎么在本地自测头歌代码？
subtitle: The educoder Touge is forced to display the directory button on the right, which is convenient for viewing the test code, and how to test the Touge code locally?
date: 2023-04-30 14:07:06
toc: true
categories: 
    - 默认
---

# 效果如下

![16936355635371693635562880.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936355635371693635562880.png)

# 操作步骤
1. F12打开控制台
![16936355855361693635584793.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936355855361693635584793.png)

2. ctrl+shift+f全局搜索 `_ref2.code_hidden`
![16936355945351693635594504.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936355945351693635594504.png)

3. 在左侧找到 `覆盖` 按钮，`选择替代文件夹`，并允许权限
![16936356145391693635614527.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936356145391693635614527.png)

4. 在编辑框内右键，选择`保存以备替代`
![16936356255361693635625063.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936356255361693635625063.png)

5. 把 `code_hidden` 的值修改为 `false`，然后按下 `ctrl+s` 保存
![16936356355351693635634766.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936356355351693635634766.png)

6. 保持控制台不关闭，刷新页面，enjoying。接下来就可以直接根据测试代码在本地自测了

# 方法思路
我是怎么找到这个方法的呢，且听我慢慢道来。
1. 首先的找到一个不显示文件夹按钮的页面和一个可以正常显示文件夹按钮的页面
2. 打开控制台，定位到文件夹按钮这个元素
![16936356495351693635649038.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936356495351693635649038.png)

3. 发现有个明显的图标名字，这是一个很明显的特征，代码里面肯定会有写。于是全局搜索一下，看看这块代码附件的上下文怎么写的（只要看js就好）
![16936356645411693635664482.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936356645411693635664482.png)

4. 解码一下9528行的Unicode，结果是`显示目录`，说明这一块就是渲染代码
![16936356765401693635676223.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936356765401693635676223.png)

```js
code_hidden ? null : /*#__PURE__*/(0,jsx_runtime.jsx)("a", {
          title: "\u663E\u793A\u76EE\u5F55",
          onClick: onShowDir,
          children: /*#__PURE__*/(0,jsx_runtime.jsx)("i", {
            className: "iconfont icon-wenjian "
          })
        })
```
从代码中可以看得出，这个按钮是否显示取决于 `code_hidden` 变量的值

5. 向上搜索 `code_hidden ` 
发现变量是在这里定义的，只要把这里写死为`true`就好了
```js
/* harmony default export */ function action_bar(_ref2) {
  var loading = _ref2.loading,
    lastedUpdateTime = _ref2.lastedUpdateTime,
    moveY = _ref2.moveY,
    code_hidden = _ref2.code_hidden,
    hide_code = _ref2.hide_code,
    gameStatus = _ref2.gameStatus,
    isEditPath = _ref2.isEditPath,
    isNotice = _ref2.isNotice,
```
![16936356935391693635693364.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936356935391693635693364.png)
