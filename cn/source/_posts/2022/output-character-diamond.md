---
title: 输出字符菱形
subtitle: output character diamond
date: 2022-01-28 17:03:58
toc: true
tags: 
categories: 
    - 默认
---

>  编程输入字符X，输出由字符X构成的以下样式的字符图形。
>
> ### 输入样例:
>
> ```
> *
> ```
>
> 
>
> ### 输出样例:
>
> ```
>    *
>   ***
>  *****
> *******
>  *****
>   ***
>    *
> ```
>
> 
>
> ### 输入样例:
>
> ```
> A
> ```
>
> 
>
> ### 输出样例:
>
> ```
>    A
>   AAA
>  AAAAA
> AAAAAAA
>  AAAAA
>   AAA
>    A
> ```
>
> 

突然想到一个比较方便的

最中间那一竖条先不看，看左边空白，从上至下

分别是

3个空白

2个空白

1个空白

0个空白

1个空白

2个空白

3个空白

相应的A也就是3-n个

```cpp
#include <cstdio>
#include "vector"
#include "iostream"
#include "map"
#include "algorithm"
#include "math.h"

using namespace std;

int main() {
//    freopen("../i.txt", "r", stdin);
    char e;
    cin >> e;
    for (int i = 0; i < 7; ++i) {
        if (i!=0)
            cout << endl;
        for (int j = 0; j < abs(3 - i); ++j) {
            cout << ' ';
        }
        for (int j = 0; j < (3 - abs(3 - i)) * 2 + 1; ++j) {
            cout << e;
        }
    }
    return 0;
}
```



 进而想到通用的

> 菱形图案
>
> 请编程输入一个奇数n(n<100)和一个字符c，输出n行由字符c组成的菱形图案。
>
> 输入样例:
>
> ```
> 5 A
> ```
>
> 
>
> 输出样例:
>
> ```
>   A
>  AAA
> AAAAA
>  AAA
>   A
> ```
>
> 
>
> 输入样例:
>
> ```
> 13 ?
> ```
>
> 
>
> 输出样例:
>
> ```
>       ?
>      ???
>     ?????
>    ???????
>   ?????????
>  ???????????
> ?????????????
>  ???????????
>   ?????????
>    ???????
>     ?????
>      ???
>       ?
> ```
>
> 

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/97c2f43a62c24a3fada21a0f25db6c45.png)编辑
 

 假设左边这里叫做halfWidth，则halfWidth=(行数- 1) / 2

那么有

>  最中间那一竖条先不看，看左边空白，从上至下
>
> 分别是
>
> 第0行，abs(halfWidth-0)个空白
>
> 第1行，abs(halfWidth-1)个空白
>
> 第2行，abs(halfWidth-2)个空白
>
> 第3行，abs(halfWidth-3)个空白
>
> 第4行，abs(halfWidth-4)个空白
>
> 第5行，abs(halfWidth-5)个空白
>
> 第6行，abs(halfWidth-6)个空白
>
> 相应的A也就是(halfWidth - abs(halfWidth - 行号)) * 2 + 1个

```cpp
#include <cstdio>
#include "vector"
#include "iostream"
#include "map"
#include "algorithm"
#include "math.h"

using namespace std;

int main() {
//    freopen("../i.txt", "r", stdin);
    char e;
    int line;
    cin >> line;
    cin >> e;
    int halfWidth = (line - 1) / 2;
    for (int i = 0; i < line; ++i) {
        if (i != 0)
            cout << endl;
        for (int j = 0; j < abs(halfWidth - i); ++j) {
            cout << ' ';
        }
        for (int j = 0; j < (halfWidth - abs(halfWidth - i)) * 2 + 1; ++j) {
            cout << e;
        }
    }
    return 0;
}
```

