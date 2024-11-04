---
title: 矩阵中合规子矩阵的数量
subtitle: The number of compliance submatrices in the matrix
date: 2024-09-05 21:00:49
toc: true
tags: 
categories: 
    - 默认
---

题干：

给你一个n×n的方阵，第行第j列的元素是r,e,d中的一个。定义一个矩阵权值为这个矩阵出现的r,e,d数量的最小值。

现在有一个值myal,现在想请你计算出，有多少个子方阵的矩阵权值不小于myval。

一个行数与列数相等的矩阵称为方阵。

补充说明

函数第一个参数输入一个大小为n×n(1≤n≤1000)，且仅由r,e,d构成的vector<string>代表矩阵a。

函数第二个参数输入一个整数myval(1≤myval≤10)代表值。

注：该题为核心模式，不需要自己处理输入输出，代码中的类名、方法名、参数名已经指定，请勿修改，直接书写函数返回方法规定的值即可。

输入

["red""red","red"],2

输出1

1

输入

["red", "edr", "dre"],1

输出2

5


code:

> 只过了 20% 超时了
```js
/**
 * 代码中的类名、方法名、参数名已经指定，请勿修改，直接返回方法规定的值即可
 *
 * 返回一个整数，表示答案
 * @param a int整型二维数组
 * @param val int整型
 * @return int整型
 *
 * red
 * red
 * red
 *
 * ["red","edr","dre"],1
 * red
 * edr
 * dre
 */

function matrixCount(a, val) {
    // write code here
    const n = a.length;
    let dp = Array.from({ length: n + 2 }).map(() =>
        Array.from({ length: n + 2 }).fill({ r: 0, e: 0, d: 0 })
    );

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            let char = a[i - 1][j - 1];
            // 重点是中间
            // red
            // edr
            // dre
            //   ^
            // dp[i][j] = dp[i][j-1] + dp[i-1][j] - dp[i-1][j-1]
            let leftItem = dp[i][j - 1],
                topItem = dp[i - 1][j],
                leftTopItem = dp[i - 1][j - 1];
            const get = (e) => leftItem[e] + topItem[e] - leftTopItem[e];
            let item = {
                r: get("r"),
                e: get("e"),
                d: get("d"),
            };
            item[char]++;
            dp[i][j] = item;
        }
    }

    // console.log(dp);
    let ans = 0;

    const getBlankRED = () => ({ r: 0, e: 0, d: 0 });

    const helper = (win) => {
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= n; j++) {
                // console.log(win, i, j);
                if (i - win < 0 || j - win < 0) {
                    // 需要在原始矩阵内
                    continue;
                }
                // if (win >= n && (i !== 1 || j !== 1)) {
                //     // 只能是对角最大的
                //     // console.log(win, i, j);
                //     continue;
                // }
                let target = dp[i][j];
                let leftItem = dp[i][j - win],
                    topItem = dp[i - win][j],
                    leftTopItem = dp[i - win][j - win];
                const get = (e) =>
                    target[e] - leftItem[e] - topItem[e] + leftTopItem[e];
                // console.log(win, i, j, get("r")); // , target, leftItem, topItem, leftTopItem
                let obj = {
                    r: get("r"),
                    e: get("e"),
                    d: get("d"),
                };
                let thisMyval = Math.min(...Object.values(obj));
                if (thisMyval >= val) ans++;
                // console.log(
                //     win,
                //     i,
                //     j,
                //     obj,
                //     thisMyval,
                //     val,
                //     thisMyval >= val,
                //     ans
                // );
            }
        }
    };
    // helper(2);
    // return;/
    for (let matrixWindow = 1; matrixWindow <= n; matrixWindow++) {
        helper(matrixWindow);
    }

    return ans;
}

module.exports = {
    matrixCount: matrixCount,
};
```