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
	limit(() => fetchSome(100)),
	limit(() => fetchSome(9)),
	limit(() => fetchSome(66)),
	limit(() => fetchSome(616)),
	limit(() => fetchSome(91)),
	limit(() => fetchSome(11)),
];

// Only one promise is run at once
const result = await Promise.all(input);
console.log(result);
```