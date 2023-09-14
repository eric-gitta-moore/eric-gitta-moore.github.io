---
title: What should I do if the UI interface displayed when Qt is run in Clion using CMake looks very old and outdated? How does Qt under CMake use SQLite?
subtitle: What should I do if the UI interface displayed when Qt is run in Clion using CMake looks very old and outdated? How does Qt under CMake use SQLite?
date: 2022-12-24 13:31:16
toc: true
tags: 
categories: 
    - Default
---


# Section 1: Problem Overview

If you compile the UI interface using the default configuration in CLion, it may appear outdated, resembling the Windows 2000 interface. However, if you run it using Qt Creator, there are no issues, and it looks like a modern Windows interface.

![16936509765371693650975967.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936509765371693650975967.png)

# Section 2: Problem Cause

After some searching, I found a similar issue on StackOverflow. However, I provide a better solution here.

Including other modules like SQLite will result in DLL driver loading errors, such as "QSqlDatabase: QSQLITE driver not loaded." This problem is related to the files in the cmake-build-debug directory not being copied to the plugins directory under MinGW in Qt.

![16936509875381693650987433.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936509875381693650987433.png)

![16936509955371693650995461.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936509955371693650995461.png)

To resolve this, simply copy the contents of D:\Qt\Qt5.14.2\5.14.2\mingw73_64\plugins to the cmake-build-debug directory.

![16936510065371693651005841.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936510065371693651005841.png)

However, this is not a permanent solution, as you will still need to configure it manually after rebuilding the project.

# Section 3: Solution

In the CMakeLists.txt file, at the end of the if (WIN32) statement, add the following two lines:

```
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_directory "${QT_INSTALL_PATH}/plugins/" "$<TARGET_FILE_DIR:${PROJECT_NAME}>/")
```

![16936510165371693651016389.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936510165371693651016389.png)

Now, when you rebuild the project and run it, it will automatically check whether the corresponding plugins exist.