---
title: Chrome browser and firefox browser specify the export network card for Internet access How to configure dual network card for Internet access
subtitle: Chrome browser and firefox browser specify the export network card for Internet access How to configure dual network card for Internet access
date: 2022-10-22 21:12:14
toc: true
tags: 
categories: 
    - Default
---

Background: Forcing an Application to Use a Specific Network Interface

I am using multiple network interfaces (LAN and wireless), and I've noticed that there is a method (using Windows metrics) to change the order of preferred interfaces. How can I work with a wired network (securely), check emails, etc., while using a wireless VLAN to access other resources?

To the point, you will need the following tools: ForceBindIP-Gui and ForceBindIP.

You can download ForceBindIP-Gui from here: [mhasanjb/ForceBindIP-Gui: A GUI For ForceBindIP (github.com)](https://github.com/mhasanjb/ForceBindIP-Gui)

Instructions:

1. Chrome Browser

According to the readme, it seems that this method only works with older versions of Chrome. The latest Chrome versions are all 100+.

2. Firefox Browser

For Firefox, you need to set the preference `about:config?filter=browser.launcherProcess.enabled` to false; otherwise, ForceBindIP will attach to the launcher rather than the actual program.

![16936512345391693651233887.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936512345391693651233887.png)

Select the outbound network card and specify the program, then click "Run Application."

![16936512455351693651245225.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936512455351693651245225.png)

Effect:

![16936512565411693651256481.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936512565411693651256481.png)

![16936512665391693651266038.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936512665391693651266038.png)
