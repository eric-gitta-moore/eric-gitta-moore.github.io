---
title: Unexpectedly stuck when playing the game csgo
subtitle: Unexpectedly stuck when playing the game csgo
date: 2023-02-07 18:16:02
toc: true
tags: 
categories: 
    - Default
---

After long-term observation, the following situations have been discovered:

I have an RTX 3060, and I also experience occasional lag in CSGO, sometimes accompanied by a brief sound freeze, lasting about half a second.

This article is applicable to systems that have both integrated graphics (Intel HD Graphics) and a dedicated GPU (Nvidia RTX 3060), and the integrated graphics are directly connected.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/1884ca57d7871a4763c5f6b9b5b69d6e.png)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/39cc4fef70f173164bfc7ab9ff9a7741.png)

I had been searching for a solution for a while, trying many fixes such as updating drivers, using Xbox, adjusting game mode settings, enabling Windows device cache, CSGO console commands, and more, but none of them worked. Today, I monitored it with MSI Afterburner and noticed that the video memory was constantly spiking.

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/b15c37b0d3b36c2f15d07d4fc474f948.png)

I searched on Baidu and found that some users suggested the graphics card was not working properly. I suspected that the game was too easy for my GPU, so it wasn't working at full capacity. I decided to remove the frame rate limit. However, the problem persisted. Then, I increased the monitor resolution to 144Hz.

I placed CSGO and the operating system on the same hard drive. Make sure the CSGO refresh rate setting isn't too low; you should at least get the video memory moving to prevent the graphics card from idling. Use the highest monitor refresh rate, and the CSGO frame rate can be lower than the monitor's maximum refresh rate.

Xbox Game Bar and Game Mode can be enabled without issues. CSGO settings are crucial. It should either be in fullscreen or fullscreen windowed mode. Don't lock the frame rate to the monitor refresh rate; you can try unlocking it first with "fps_max 999" and then locking it to double the monitor's refresh rate. On my computer, if I lock the frame rate to 144 in fullscreen windowed mode, it randomly lags for some reason.

Also, make some adjustments in the Nvidia Control Panel:

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/eb805776b462470ea200dcfc7f86b4c9.png)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/744eb2e706b941d1abddc6d772f6b95e.png)

After these adjustments, the issue should be resolved.
