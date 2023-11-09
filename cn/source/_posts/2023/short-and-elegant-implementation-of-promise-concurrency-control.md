---
title: 短小且优雅的Promise并发控制实现
subtitle: Short and elegant implementation of Promise concurrency control
date: 2023-11-9 22:02:31
toc: true
tags: 
categories: 
    - 默认
---


参考 `p-limit`

```js
function pLimit(concurrent) {
    let task = [], active = 0;
    return (fn) => new Promise(async res => {
        task.push(async () => (active++, res(await fn()), active--, task.pop()?.()));
        // 感觉可以去掉，一样可以同步 cnt++ 和 concurrency
        await Promise.resolve();
        active < concurrent && task.pop()?.();
    });
}
```