---
title: How does Clion write C and C++ in one project
subtitle: How does Clion write C and C++ in one project
date: 2022-06-09 23:25:15
toc: true
tags: 
categories: 
    - Default
---

If you encounter the error `CMake Error: CMake can not determine linker language for target:` while writing C++ or C code in a C or C++ project, follow these steps to resolve it:

Solution:
Modify the `CMakeLists.txt` file located in the root directory of your project.

```markdown
cmake_minimum_required(VERSION 3.22)
project(Algorithm C)

set(CMAKE_C_STANDARD 11)
```

Remove the `C` after `project(Algorithm C)` so it looks like this (if it's a C++ project, replace `C` with `CXX`):

```markdown
project(Algorithm)
```

If you want to specify a C++ or C language standard, you can add the following lines:
- For C++11 standard: `set(CMAKE_CXX_STANDARD 11)`
- For C11 standard: `set(CMAKE_C_STANDARD 11)`

To run a single file separately, you can use the `C/C++ Single File Execution` plugin.