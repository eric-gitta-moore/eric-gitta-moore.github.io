---
title: How can I sign multiple numbers with one device on Chaoxing Xuedu Tong? How to remove the ten-second limit for QR code check-in?
subtitle: How can I sign multiple numbers with one device on Chaoxing Xuedu Tong? How to remove the ten-second limit for QR code check-in?
date: 2022-06-03 23:06:36
toc: true
tags: 
categories: 
    - Default
---

> Here's a solution from the GitHub project https://github.com/james-curtis/chaoxing-sign-app.

## Introduction

Let's start with a brief introduction to this app. It not only supports regular check-ins but also photo check-ins (you can choose a photo), gesture check-ins (no need to know specific gestures), location-based check-ins (choose any location), QR code check-ins (ignoring the ten-second rule), and sign-in code check-ins (no need to know the sign-in code). It also supports multiple account check-ins and removes the Chaoxing restriction of one device per account. Here are some demo screenshots:

![16936529099921693652909036.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936529099921693652909036.png)

![16936529199911693652919179.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936529199911693652919179.png)

## Location-based Check-in Method

Let's briefly explain the method for location-based check-ins:

1. Click on the "My" tab.

![16936529279921693652927367.png](https://raw.githubusercontent.com/james-curtis/blog-img/img/img/16936529279921693652927367.png)

2. Click on "Add Account" or the "Login/Re-login" button at the bottom of the main page.
3. After logging in, switch back to the "Activities" tab and select the corresponding course. If you can't find the course, go back to the "Courses" tab, find the course you want, and click on the course title or course avatar to navigate to the activity page.
4. You should now see all the sign-in activities for that course. If you don't see any sign-in activities with blue icons, try pulling down to refresh, and it will retrieve the latest courses (Note: sign-in activities in self-created group chats cannot be retrieved here, but we will mention group chat sign-ins later).
5. Click on the title of the sign-in activity or the image of the sign-in activity to proceed with the check-in.
6. A window for selecting your location will appear at this point.
7. If the location signal is weak, the location may initially be stuck around Tiananmen Square for a brief moment. Please be patient; it will resolve in about ten seconds.
8. Manually drag the red pin to the location where you need to check in.
9. Click the "Finish" button in the upper right corner to complete the check-in.
10. The check-in result will be displayed on the page.

## About Automatic Check-ins and Group Chat Check-ins

#### About Automatic Check-ins
1. Since this is an app, when executing scheduled tasks in the background, it is easy for the system to kill it if it doesn't have high system permissions.
2. Furthermore, location-based check-ins, photo check-ins, and QR code check-ins all require manual intervention. Therefore, I feel that fully automatic check-ins are not very necessary.
3. However, there is a need for automatic check-ins in this regard, so considering developing this on the server-side might be a better option, but it would also raise the usage threshold.

#### About Group Chat Check-ins
1. As of the time of writing, the latest version of Study in China is encrypted.
2. From libcheck, you can see that Study in China's group chats use the Easemob IM SDK.
3. Decompiling and reverse engineering after removing DEX is complicated and challenging due to the complexity of the contents.
4. Therefore, starting from the older version of Study in China, specifically version `v2.0.1` released on April 11, 2017, which is not encrypted and has functional group chat capabilities. So, I decided to start with that version. Progress related to this is published on GitHub. Currently, it's just a *big pie* being drawn.

(Note: Some terms and references have been retained in the translation for context.)