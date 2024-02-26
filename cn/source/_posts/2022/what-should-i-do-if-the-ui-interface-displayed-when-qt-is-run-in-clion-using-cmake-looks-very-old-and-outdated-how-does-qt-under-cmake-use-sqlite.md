---
title: Qt使用CMake在Clion中运行显示出的UI界面看起来很老，很过时怎么办？CMake下的Qt怎么使用SQLite？
subtitle: What should I do if the UI interface displayed when Qt is run in Clion using CMake looks very old and outdated? How does Qt under CMake use SQLite?
date: 2022-12-24 13:31:16
toc: true
tags: 
categories: 
    - 默认
---


#  一、问题概述

如果使用Clion默认配置编译出来的UI界面看起来很老套，就像是win2000的界面。但是如果使用Qt Creator运行就没有问题，是现代windows的界面

![16936509765371693650975967.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936509765371693650975967.png)

#  二、问题原因

最后经过一番搜索，在stackoverflow上找到了类似的问题。不过我这里提供一个更好的解决方案。

包括SQLite等其他模块会报错无法加载DLL驱动，“QSqlDatabase: QSQLITE driver not loaded”，都会涉及到这个问题，就是 cmake-build-debug 目录下的文件没有拿到Qt中MinGW下的plugins目录

![16936509875381693650987433.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936509875381693650987433.png)

![16936509955371693650995461.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936509955371693650995461.png)

 此时只要把，D:\Qt\Qt5.14.2\5.14.2\mingw73_64\plugins目录下的东西复制到cmake-build-debug下面就可以了

![16936510065371693651005841.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936510065371693651005841.png)

不过这并不能一劳永逸，重新build项目之后还是需要手动配置 

# 三、解决方案

在CMakeLists.txt中的if (WIN32)语句末尾，添加下面两行

```
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
            COMMAND ${CMAKE_COMMAND} -E copy_directory "${QT_INSTALL_PATH}/plugins/" "$<TARGET_FILE_DIR:${PROJECT_NAME}>/")
```

![16936510165371693651016389.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936510165371693651016389.png)

 此时重新build项目再运行的时候会自动检查对应的plugins是否存在