---
title: 阿里云效devstudio，coding编译运行调试C/C++
subtitle: Aliyun effect devstudio, coding compile and run debugging C/C++
date: 2022-06-07 10:39:19
toc: true
tags: 
categories: 
    - 默认
---

云效devstudio可以选择 `all in one` 或者 `c/c++` 项目，coding必须选择 `all in one`项目才行。
创建项目之后，配置好 `launch.json` 和 `tasks.json` 就可以跑了。

`launch.json`：
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            //这个大括号里是我们的‘调试(Debug)’配置
            "name": "Debug", // 配置名称
            "type": "cppdbg", // 配置类型，cppdbg对应cpptools提供的调试功能；可以认为此处只能是cppdbg
            "request": "launch", // 请求配置类型，可以为launch（启动）或attach（附加）
            "program": "${fileDirname}/${fileBasenameNoExtension}", // 将要进行调试的程序的路径
            "args": [], // 程序调试时传递给程序的命令行参数，这里设为空即可
            "cwd": "${fileDirname}", // 调试程序时的工作目录，此处为源码文件所在目录
            "preLaunchTask": "build" // 调试开始前执行的任务，我们在调试前要编译构建。与tasks.json的label相对应，名字要一样
        }
    ]
}
```
`tasks.json`：
```json
{
    "version": "2.0.0",
    "tasks": [
        { //这个大括号里是‘构建（build）’任务
            "label": "build", //任务名称，可以更改，不过不建议改
            "type": "shell", //任务类型，process是vsc把预定义变量和转义解析后直接全部传给command；shell相当于先打开shell再输入命令，所以args还会经过shell再解析一遍
            "command": "gcc", //编译命令，这里是gcc，编译c++的话换成g++
            "args": [ //方括号里是传给gcc命令的一系列参数，用于实现一些功能
                "${file}", //指定要编译的是当前文件
                "-o", //指定输出文件的路径和名称
                "${fileDirname}/${fileBasenameNoExtension}", //承接上一步的-o，让可执行文件输出到源码文件所在的文件夹下的bin文件夹内，并且让它的名字和源码文件相同
                "-g", //生成和调试有关的信息
                "-Wall", // 开启额外警告
                "-static-libgcc", // 静态链接libgcc
                // "-fexec-charset=GBK", // 生成的程序使用GBK编码，不加这一条会导致Win下输出中文乱码
                "-std=c11" // 语言标准，可根据自己的需要进行修改，写c++要换成c++的语言标准，比如c++11
            ]
        }
    ]
}
```
> 配置文件参考：
> https://www.bilibili.com/read/cv15814739

注意这里阿里云效devstudio跟正常的vscode好像不一样，`"type": "cppdbg"` 会报错，要改成 `"type": "lldb"`
报错：`The debug type is not recognized. Make sure that you have a corresponding debug extension installed and that it is enabled.`

![16936528309911693652830852.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936528309911693652830852.png)

到这里就可以调试了。阿里的使用 `开始执行(不调试)` 好像出不来结果。coding的没有问题，但是得去掉断点才能跑，不然还是会卡断点。

#### 常见问题
1. `launch.json` 报错 `Matches multiple schemas when only one must validate.`
刷新一下浏览器即可
参考：https://blog.csdn.net/oh_futrue/article/details/104771914/
