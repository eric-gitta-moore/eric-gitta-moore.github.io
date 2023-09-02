---
title: Clion怎么在一个项目中编写C和C++两种语言
subtitle: How does Clion write C and C++ in one project
date: 2022-06-09 23:25:15
toc: true
tags: 
categories: 
    - 默认
---

如果在C或C++项目中编写C++或C会提示 `CMake Error: CMake can not determine linker language for target:` 

解决方案：
修改根目录下面的
`CMakeLists.txt`
```
cmake_minimum_required(VERSION 3.22)
project(Algorithm C)

set(CMAKE_C_STANDARD 11)

```

把其中的 `project(Algorithm C)` 后面那个 `C` 去掉就可以了。(如果是C++项目，这里应该是 `CXX` )
写成这样 `project(Algorithm)` 

然后如果要添加C++或者C语言标准的话
- C++11标准 `set(CMAKE_CXX_STANDARD 11)`
- C11标准 `set(CMAKE_C_STANDARD 11)`

至于单独跑一个文件的话用这个插件就好了 `C/C+​+​ Single File Execution`
