---
title: 100 行实现 Promise Aplus
subtitle: 100 lines implement the Promise Aplus
date: 2024-09-05 00:07:07
toc: true
tags: 
categories: 
    - 默认
---

```js
const isFunction = obj => typeof obj === 'function'
  , isObject = obj => !!(obj && typeof obj === 'object')
  , isThenable = obj => (isFunction(obj) || isObject(obj)) && 'then' in obj
  , isPromise = promise => promise instanceof Promise
  , nextTick = queueMicrotask || setTimeout

const PENDING = 'pending', FULFILLED = 'fulfilled', REJECTED = 'rejected'

class Promise {
  result = null
  state = PENDING
  callbacks = []
  constructor(fn) {
    let onFulfilled = value => this.#transition(FULFILLED, value)
    let onRejected = reason => this.#transition(REJECTED, reason)

    let ignore = false
    let resolve = value => ignore || (ignore = true, this.#resolvePromise(value, onFulfilled, onRejected))
    let reject = reason => ignore || (ignore = true, onRejected(reason))

    try {
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      let callback = { onFulfilled, onRejected, resolve, reject }

      if (this.state === PENDING) this.callbacks.push(callback)
      else nextTick(() => handleCallback(callback, this.state, this.result))
    })
  }

  #transition(state, result) {
    this.state = state, this.result = result
    nextTick(() => (this.callbacks.map(e => handleCallback(e, state, result)), this.callbacks.length = 0))
  }

  #resolvePromise(result, resolve, reject) {
    if (result === this) return reject(new TypeError('Can not fufill promise with itself'))

    if (isPromise(result)) return result.then(resolve, reject)

    if (isThenable(result)) {
      try {
        let then = result.then
        if (isFunction(then)) return new Promise(then.bind(result)).then(resolve, reject)
      } catch (error) {
        return reject(error)
      }
    }

    resolve(result)
  }
}

const handleCallback = (callback, state, result) => {
  let { onFulfilled, onRejected, resolve, reject } = callback
  try {
    if (state === FULFILLED)
      isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
    if (state === REJECTED)
      isFunction(onRejected) ? resolve(onRejected(result)) : reject(result)
  } catch (error) {
    reject(error)
  }
}

// =============== done ===============

// 以下非 A+
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

Promise.resolve = value => new Promise(resolve => resolve(value))
Promise.reject = reason => new Promise((_, reject) => reject(reason))

// promises-aplus-tests
const resolved = value => new Promise(resolve => resolve(value))
const rejected = reason => new Promise((_, reject) => reject(reason))

const deferred = () => {
  let promise, resolve, reject
  promise = new Promise(($resolve, $reject) => {
    resolve = $resolve
    reject = $reject
  })
  return { promise, resolve, reject }
}

module.exports = { resolved, rejected, deferred }
```

testCase:

```js
pnpx promises-aplus-tests index.js
```

