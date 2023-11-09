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
    let queue = [], activeCount = 0;
    return (fn) => new Promise(async resolve => {
        queue.push(async () => {
            activeCount++;
            resolve(await fn());
            activeCount--;
            queue.size > 0 && queue.pop()();
        });
        await Promise.resolve();
        activeCount < concurrency && queue.pop()?.();
    });
}
```