---
title: Proxmox VE turns on NAT chick. Can't connect to the Internet. How to turn on NAT mode?
subtitle: Proxmox VE turns on NAT chick. Can't connect to the Internet. How to turn on NAT mode?
date: 2022-05-27 14:50:53
toc: true
tags: 
categories: 
    - Default
---

### Preface

Before I attempted this myself, I searched online extensively, and all I found were instructions for changing network card configurations, firewall settings, and port forwarding.

I wondered why no one had shared a guide on how to enable NAT mode with just a single click, as it should be in the official documentation. So, here's my contribution.

If you need to forward ports and map them to the host machine's IP, it's best to configure the files, as recommended by the official documentation.

You can skip the detailed process below and jump straight to the summary.

### Process

![16936534599901693653459693.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534599901693653459693.png)

![16936534749951693653474606.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534749951693653474606.png)

According to the documentation, this can only be done through CLI or API calls. So, let's start by looking for CLI and API documentation.

Click here to check it out.

![16936534809901693653480372.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534809901693653480372.png)

After reading through the entire document, I found an API documentation section at the bottom, which was a revelation.

![16936534949901693653494581.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936534949901693653494581.png)

Taking a quick look, I realized that each API was accompanied by both an HTTP request and a CLI command. That made things easier. I decided to capture network traffic and see how adding a network card worked in the web console. Then, I could find the corresponding API and everything would become clear.

![16936535029891693653502838.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535029891693653502838.png)

With everything set up, click on "Add."

![16936535149901693653514717.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535149901693653514717.png)

Voilà, I found it!

![16936535269991693653526732.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535269991693653526732.png)

Switch to the "Headers" tab to find the API address.

![16936535359891693653535255.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535359891693653535255.png)

Now, search the documentation for "config" to find the corresponding path and method.

![16936535469961693653546646.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535469961693653546646.png)

Here's the documentation we need.

Take a look at the parameters.

![16936535539901693653553493.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535539901693653553493.png)

You can clearly see that "bridge" is an optional parameter.

### Summary

All you need to do is execute the following command in SSH, without specifying the bridge network card:

```bash
pvesh set /nodes/pve/qemu/100/config -net2 virtio,firewall=1
```

Explanation:

> pvesh set /nodes/{your node name, default node is pve}/qemu/{your virtual machine ID, default first virtual machine ID is 100}/config -net{here is the number of your network device, if you only have one network device, put 1 here, just make sure it doesn't conflict with existing devices} virtio,firewall=1

### QA

Q1: How did you figure out that the command parameters should be written this way?

A: At first, I didn't know how to format the command, so I tried several variations without success. Then, I consulted the documentation and found examples that showed the correct format with a hyphen.

![16936535729911693653572220.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535729911693653572220.png)

![16936535829951693653582635.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535829951693653582635.png)

![16936535919951693653591722.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936535919951693653591722.png)

Q2: NAT is enabled, but there's no internet connection. What should I do?

A: You can manually set the DNS in the virtual machine.

Q3: How can I set up port forwarding?

A: Unfortunately, port forwarding cannot be set up using this method. If you need to do port forwarding, you'll have to work with the /etc/network/interfaces file and the firewall.