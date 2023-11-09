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
function pLimit(concurrency) {
    let task = [], cnt = 0;
    return (fn) => new Promise(async resolve => {
        task.push(async () => {
            cnt++, resolve(await fn()), cnt--;
            task.length > 0 && task.pop()();
        });
        await Promise.resolve();
        cnt < concurrency && task.pop()?.();
    });
}
```