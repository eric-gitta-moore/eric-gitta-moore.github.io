---
title: Aliyun effect devstudio, coding compile and run debugging C/C++
subtitle: Aliyun effect devstudio, coding compile and run debugging C/C++
date: 2022-06-07 10:39:19
toc: true
tags: 
categories: 
    - Default
---

You can choose between `all in one` and `c/c++` projects in the YunXiao DevStudio. For coding, you must select the `all in one` project. After creating the project, configure `launch.json` and `tasks.json`, and you'll be able to run it.

`launch.json`:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            // The following section defines our 'Debug' configuration
            "name": "Debug", // Configuration name
            "type": "cppdbg", // Configuration type; cppdbg corresponds to the debugging functionality provided by cpptools; consider only cppdbg here
            "request": "launch", // Requested configuration type; can be launch (start) or attach (attach)
            "program": "${fileDirname}/${fileBasenameNoExtension}", // Path to the program to be debugged
            "args": [], // Command-line arguments to pass to the program during debugging; set to empty here
            "cwd": "${fileDirname}", // Working directory when debugging the program; this is the directory where the source code file is located
            "preLaunchTask": "build" // Task to execute before debugging; we need to compile/build before debugging; matches the label in tasks.json
        }
    ]
}
```
`tasks.json`:
```json
{
    "version": "2.0.0",
    "tasks": [
        { // The following section defines the 'build' task
            "label": "build", // Task name; can be changed, but it's recommended not to
            "type": "shell", // Task type; process sends all predefined variables and escapes directly to the command; shell is like opening a shell and then entering commands, so args will be parsed again through the shell
            "command": "gcc", // Compilation command; here it's gcc, if you're compiling C++, switch to g++
            "args": [ // Within the square brackets are a series of arguments to pass to the gcc command for various functionalities
                "${file}", // Specifies the current file to compile
                "-o", // Specifies the output file's path and name
                "${fileDirname}/${fileBasenameNoExtension}", // Continues from the previous -o, places the executable file in the bin folder within the source code file's directory with the same name as the source code file
                "-g", // Generate debugging information
                "-Wall", // Enable extra warnings
                "-static-libgcc", // Static linking of libgcc
                // "-fexec-charset=GBK", // The generated program uses GBK encoding; not adding this will result in Chinese characters being garbled on Windows
                "-std=c11" // Language standard; you can modify this according to your needs; for C++, change it to the appropriate C++ standard, like c++11
            ]
        }
    ]
}
```

> Configuration file reference:
> https://www.bilibili.com/read/cv15814739

Note that in YunXiao DevStudio, it seems different from regular VSCode, and `"type": "cppdbg"` might result in an error. You should change it to `"type": "lldb"` to resolve the error: "The debug type is not recognized. Make sure that you have a corresponding debug extension installed and that it is enabled."

![16936528309911693652830852.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936528309911693652830852.png)

At this point, you should be able to debug. Using "Start Without Debugging" may not produce the expected result in Aliyun DevStudio. Coding works fine, but you need to remove breakpoints to run it; otherwise, it will still pause at the breakpoints.

#### Common Issues
1. If `launch.json` shows the error `Matches multiple schemas when only one must validate`, try refreshing your browser to resolve it.
   Reference: https://blog.csdn.net/oh_futrue/article/details/104771914/