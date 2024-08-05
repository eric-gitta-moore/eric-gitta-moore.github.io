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
        fn(value => queueMicrotask(() => this.cb?.(value)))
    }
    then(onFulfilled) {
        return new MyPromise(resolve => this.cb = val => {
            const thenCb = onFulfilled(val)
            thenCb instanceof MyPromise ? thenCb.then(resolve) : resolve(thenCb)
        })
    }
}


```

testCase:

```js
const testCase = [
    () => {
        new MyPromise((resolve) => {
            setTimeout(() => {
                resolve(1)
            }, 1000)
        }
        ).then((res) => {
            console.log(res)
            return new MyPromise((resolve) => {
                setTimeout(() => {
                    resolve(2)
                }, 1000)
            })
        }
        ).then(res => {
            console.log(res)
        })
    },
    () => {
        let p = new MyPromise((resolve) => {
            resolve(1)
        }).then((res) => {
            console.log(res)
            return new MyPromise((resolve) => {
                setTimeout(() => {
                    resolve(2)
                }, 150)
            })
        })
        setTimeout(() => {
            p.then(res => {
                console.log(res)
            })
        }, 100);
    }
]

// testCase[0]()
testCase[1]()
```