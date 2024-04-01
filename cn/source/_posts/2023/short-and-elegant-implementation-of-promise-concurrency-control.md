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
    return fn => new Promise(res => {
        task.push(async () => (active++, res(await fn()), active--, task.pop()?.()));
        active < concurrent && task.pop()?.();
    });
}

const limit = pLimit(2);
const fetchSome = size => fetch(`https://speed.cloudflare.com/__down?bytes=${size}`)
const input = [
	limit(() => (console.log(3), fetchSome(1024 * 1024 * 3))),
	limit(() => (console.log(8), fetchSome(1024 * 1024 * 8))),
	limit(() => (console.log(1), fetchSome(1024 * 1024 * 1))),
	limit(() => (console.log(0.1), fetchSome(1024 * 1024 * 0.1))),
	limit(() => (console.log(2), fetchSome(1024 * 1024 * 2))),
	limit(() => (console.log(10), fetchSome(1024 * 1024 * 10))),
];

// Only one promise is run at once
const result = await Promise.all(input);
console.log(result);
```