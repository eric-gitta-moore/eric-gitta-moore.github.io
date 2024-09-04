---
title: 另一种范式的 p-limit 实现 ｜ 字节面试题
subtitle: Another paradigm, p-limit, implements | byte interview questions
date: another-paradigm-p-limit-implements-byte-interview-questions
toc: true
tags: 
categories: 
    - 默认
---

题干：

般浏览器会限制并发请求数，微信小程序之前也限制过最多请求不超过 10 个。

现在，让我们来实现一下这个功能。

【问题描述】

实现这样一个函数 scheduler，函数入参为并发最大次数

如下最终输出顺序：2、3、1、4

一开始，1、2 两个任务进入队列

500ms 时，2 完成，输出 2，任务 3 进队

800ms 时，3 完成，输出 3，任务 4 进队

1000ms 时，1 完成，输出 1

1200ms 时，4 完成，输出 4


```js
const request1 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1)
        }, 1000)
    })

const request2 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2)
        }, 500)
    })
const request3 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(3)
        }, 300)
    })
const request4 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(4)
        }, 400)
    })

const addRequest = scheduler(2);
addRequest(request1).then(res => {
    console.log(res);
});
addRequest(request2).then(res => {
    console.log(res);
});
addRequest(request3).then(res => {
    console.log(res);
});
addRequest(request4).then(res => {
    console.log(res);
});

function scheduler(concurrent) {
    // todo
}
```

实现

```js

function withResolvers() {
    let promise, resolve, reject
    promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    })
    return {promise, resolve, reject}
}

function scheduler(concurrent) {
    let queue = []
    let cnt = 0;

    function process() {
        if(cnt >= concurrent) return;
        cnt++;
        const {request, promise, resolve, reject} = queue.shift() || {}
        if(!request) return;
        request().then(val => {
            resolve(val)
            cnt--;
            process()
        })
    }

    return (request) => {
        const {promise, resolve, reject} = withResolvers()
        queue.push({request, promise, resolve, reject})
        process()
        return promise
    }
}
```