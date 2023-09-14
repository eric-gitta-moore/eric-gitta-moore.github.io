---
title: Xbox game files are backed up, how can I stop downloading them again?
subtitle: Xbox game files are backed up, how can I stop downloading them again?
date: 2022-01-01 14:19:21
toc: true
tags: 
categories: 
    - Default
---

# Installing Horizon 5 on Xbox without Redownloading

Today, I finally found a method after trying for a long time. Since I reinstalled my Xbox previously, I once downloaded Horizon 5 directly, and it installed instantly. I thought I should be able to install it directly using the copied files. Today, I'm going to give it a try and avoid redownloading. It's just a hundred-megabit broadband.

The same process works for other games.

1. Open Xbox and start downloading Horizon 5. Pause all downloads once it begins to download at a good speed.

2. Locate the download directory, which is usually either "C:\Program Files\WindowsApps\MSIXVC" or "C:\WindowsApps\MSIXVC."

3. Delete everything inside it. (In my case, there's only one game, so make sure to check if you have other games before deleting. In my case, Horizon has a total of four files.)

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/0f496d6f4ebf4ef5b2d4a5005d71d8e5.png)

4. Then copy your backup files into this directory.

5. Return to Xbox, click "Resume All," and after a while, Horizon 5 will be installed directly.

You can see that this app consists of one main file, which is mounted as a folder. The other three files are probably related to download progress or similar. I tried copying only the largest file, but it didn't work; it still required downloading from the beginning.

![img](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/eaad09ef7ccc49b2a2bc511de52cde0e.png)