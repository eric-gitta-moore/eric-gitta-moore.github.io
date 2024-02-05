---
title: 10 行实现简单 Promise
subtitle: 10 lines implement a simple Promise
date: 2024-2-5 21:37:20
toc: true
tags: 
categories: 
    - 默认
---

```js
class MyPromise {
    constructor(fn) {
        fn(value=>this.cb?.(value))
    }
    then(fn) {
        return new MyPromise(res=>this.cb = val=>{
            const thenCb = fn(val)
            thenCb instanceof MyPromise ? thenCb.then(res) : res(thenCb)
        })
    }
}

new MyPromise((resolve)=>{
    setTimeout(()=>{
        resolve(1)
    }, 1000)
}
).then((res)=>{
    console.log(res)
    return new MyPromise((resolve)=>{
        setTimeout(()=>{
            resolve(2)
        }, 1000)
    })
}
).then(res=>{
    console.log(res)
})
```