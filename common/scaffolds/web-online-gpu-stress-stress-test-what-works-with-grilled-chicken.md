---
title: web在线gpu stress压力测试烤鸡是什么原理
subtitle: web Online gpu stress Stress Test What works with Grilled chicken
date: 
toc: true
tags: 
categories: 
    - 默认
---

## 前言
最近天气越来越冷了，就想给 mac 烤机一下来暖暖腿，但是又不想下压力测试工具，就想着有没有能够跨平台的烤鸡方法。

记得之前还有用浏览器挖矿的，索性就搜了一下 `web cpu gpu stress`，没想到还真有，还不少。不过效果都比较差，唯一一个效果拉满的是 `https://mprep.info/gpu/`，但是也仅限于 Windows 平台，比较完美的实现了双烤，

![16965165614991696516560765.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16965165614991696516560765.png)

在 macOS 14 下仅仅能实现 50%左右的 CPU 负载

不过挺好奇的，为什么只有这一家能够实现比较完美的双烤，让我们扒扒他的实现

## 实现

打开控制台，在点击压力测试按钮的时候发现加载了几个 worker

![16965168514981696516850855.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16965168514981696516850855.png)

**CPU部分**：

`https://mprep.info/assets/js/stress-cpu-worker.js`

没啥好说的，纯粹的js运算

> 如果这里换成 wsm 会不会对性能压榨的更多呢

```js
!function() {
    for (; ; ) {
        let t = 5458700 * Math.random() % 54687 * (6847648 * Math.random() % 68648) - 98468 * Math.random() % 513684;
        t = t / 769864 * 6541,
        t = Math.exp(t),
        t = Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(t))))))
    }
}();
```

**GPU部分**：

`https://mprep.info/assets/js/stress-gpu-worker.js`

这里就比较有意思了

```js
importScripts("/assets/js/gpu-browser.min.js"),
onmessage = function() {
    let t = new GPUX({
        mode: "gpu"
    }).createKernel(function() {
        let t = 0;
        for (let e = 0; e < this.constants.size; e++)
            t = (t += this.thread.x % 5466587 * (this.thread.x % 6847648) - this.thread.x % 51374684) / (this.thread.x % 9769864) * 6541,
            t = Math.exp(t),
            t = Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(t))))));
        return t
    }).setOptimizeFloatMemory(!0).setImmutable(!0).setConstants({
        size: 1e4
    }).setLoopMaxIterations(1e4).setOutput([1e6]);
    for (t(),
    postMessage("FinishedCompiling"); ; )
        t()
}
;
```

找到这个 `gpu-browser.min.js`，看看是啥

![16965170325071696517032336.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16965170325071696517032336.png)

原来是使用了 `gpu.js`，这个第三方库

看都看到这里了，不妨继续看一看 `gpu.js` 的具体实现

## gpu.js 实现




