---
title: 华硕笔记本全硬盘恢复原厂状态 实机操作，MYASUS IN WINRE恢复，ASUS RECOVERY恢复
subtitle: ASUS notebook full hard disk recovery to the original factory state real machine operation, MYASUS IN WINRE recovery, ASUS RECOVERY recovery
date: 2021-12-12 15:47:45
toc: true
tags: 
categories: 
    - 默认
---

 本教程的前提的在之前就备份了原厂的RECOVERY分区，RESTORE分区，MYASUS分区

如果这些分区都没有的话那就只能找同型号笔记本的朋友要一份了，或者去售后，告诉他这三个分区都要恢复。一般售后为了节约硬盘空间，不会给你恢复restore分区，这个分区有将近20G。

我机器撒天选2 i7-11800H，3060，32G，512GB，型号FX506HM，

> 附上我的msinfo32，链接：https://yunling.lanzouo.com/iJEO5xj1tgd 

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/31aee62d00ec4844bf1b76c1e237f9aa.png)

这篇教程先说全格式化怎么做，下次有空再说免格式化怎么弄。下面开始。

首先首先你的先做给优盘或者移动硬盘做一个PE。网上做PE启动盘的教程很多，这里就不再累述。我用的优启通的PE，感觉东西比WEPE多一点。

一、先插U盘（我这里插的是移动硬盘），然后开机或者重启一直不断的按F2，进入bios

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/2ce6bf9931e248378cb00151035f922c.jpg)

 二、按F8进入PE

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/dbe67173bf55410b8dcd0362dcd56b57.jpg)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/769cd95973dc4efe9069680f285baa5c.jpg)



![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/e172f3a3eea642e2ae2234619c4da337.jpg) 

三、分区，分成出厂那个样子

我备份了出厂的分区表，按照这个来分就好了

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/08e3c070967f4b61adbb5813eec6c9b2.jpg)



本地磁盘D这个就忽略吧合并到os里面去。这个本地磁盘D是我机器到手之后没几天用win自带的磁盘管理工具分的，我不喜欢C盘那么大。

①先分一个区出来

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/e7e11d2ca8834470979b16000ddcad42.jpg) 

然后把这个OS调整一下，缩小为200G，因为后面不知道还要用多少。

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/7511ad1b11a94b58a8e0079add049be8.jpg) 

然后我们依次把RECOVERY、restore、MYASUS建立出来

RECOVERY分区是1000MB

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/00627725fd194e4d9bcae5c8d9c17720.jpg)

RESTORE分区是19.5GB也就是19968MB

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/3af4087c2c6148b9a39d2b1268c5b2ad.jpg)

MYASUS是200MB 

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/dafa293bf5294ab9afb4b05bb0e48fa8.jpg) 

保存更改，然后把多出的还给OS分区

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/36b45205c70e4c119e596e07b16086e7.jpg) ![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/76740c9d4dad4f2e96b99cc1d7693e4b.jpg) 



四、恢复各个分区的备份

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/7b952aea8a3748049b081b9acafca71f.jpg)![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/6315dbc6ac1249e2a136504769f62033.jpg)

 用diskgenius恢复RECOVERY、RESTORE、MYASUS

然后打开dism++，左上角 文件-释放镜像，这一步恢复出厂系统

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/e9045a768b0f45e795d61c9cc756a224.jpg)

 然后现在还是无法开机的，接下来我们重建引导。

回到diskgenius，我们将esp分区指定一个驱动器号，os分区也指定一个驱动器号。

（右键某个分区，找到指定驱动器号就可以找到这个功能了 ）

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/b486d0c1e63c4d2081f5be1dd89f9faf.jpg)

按win+r输入cmd

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/d5879ab87e1544f9a97cb91818e09b49.jpg)



输入

```
bcdboot d:\windows /s c: /f UEFI /l zh-cn
```

 这里d:\windows中的d要看你那边os分区指定的驱动器号

/s c:也是，看你那边esp分区指定的驱动器号

五、还有点开机前的收尾工作

然后之前有一步忘记说了。就在这里做是一样的。

**右键esp分区，设置卷标。设置为SYSTEM**

 右键RECOVERY分区，更改分区参数，

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/0640ca85d6c94b1fa42a49edc1fee88b.jpg)

文件系统类型改为Microsoft recovery partition其它的不用动

还有RESTORE分区和MYASUS分区也这样操作一下，修改文件系统类型

六、重启进入系统配置winre

 重启，不断的按f2

进入bios把启动顺序改一下，

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/3a301e079bcf422a8a001663fb1eb6fd.jpg)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/a0c40faec38945de9b53f74cfb815a77.jpg)

然后按f10保存并退出，这时候主板会断电一下，这时候把优盘赶紧把下来（不拔问题也不大咯） 

 七、配置当前系统的winre

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/029602c7a48448858b05c9cf6b42c9d3.jpg)

开机又是这个东西

一顿操作之后总算进来了，按win+s输入cmd以管理员身份运行

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/5f29599968824e44a7809a854bb00b6d.png)输入

```
reagnetc /info
```

 ![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/636e88b582af4fb0985b324a24d26b5b.jpg)

果然很正常的出现了disabled

然后修改一下显示隐藏文件和显示拓展名

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/052e1079000e44faa31e3111f5cdd802.png)

接下来给winre指定镜像路径，在刚刚打开的命令提示符里面 照着我这样输入

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/613ce2a05f8b4711aca0812b77f7d548.jpg)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/2ddf4c0be2b445b983d012a8e646543f.jpg)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/4e9d23cb716f4e0e9a17e754c1469c83.jpg)

这样就把recovery分区挂载上了

进入recovery分区所在盘，找到winre，按shift键的同时按下鼠标右键复制为路径

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16b9fff2a8294fee93e388b0f4a7261b.jpg) 

接下来我们另外再用管理员权限打开一个小黑窗

输入

```
reagentc /setreimage /path 刚刚复制的路径
```

 ![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/3a60a583ab8443c3bcf2643431ec402b.jpg)

 然后修改winre配置文件

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/1d654611eff242cd8acf714c68b8bda1.jpg)



把c:\windows\system32\recovery下面的reagentxml删了，从c:\recovery里面的reagentold.xml复制过去，并改名为ReAgent.xml 

下面就是启用winre咯

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/9e1d5300104c4f75999d21e920c5155d.jpg)

在命令行里面输入

```ruby
reagentc /enable
```

 不出意外的话这里会稍微停顿一下再出来操作成功的提示

然后我们可以输入

```
reagentc /info
```

 看一下是否成功启用了

别急别急，这里才只是进行到三分之二

还有一步，写入MYASUS in winre的入口

把这个文件复制到桌面

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/e95634d43475492597360d1cb5af1d9e.jpg)

按住shift键的同时按下鼠标右键，复制路径

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/770fb2d4e7c847f7921bba10f6d4faa6.jpg)

然后在命令行里面输入

```
reagentc /setbootshelllink /configfile 刚刚复制的路径
```


 到这里为止，现在用的这个系统的MYASUS in winre就已经配置好了

我们可以按住shift不放，点击重启，就会出现这个蓝色的界面，然后点击疑难解答就会出现这个界面

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/e5a85df5fac141629d4e72bea6412e92.jpg)

 八、配置asus.sum里面的winre

 点击这个向左的小箭头

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/e8ed571a7e0047f986410f6ecf902ca9.png)

然后选择继续使用win10，这里应该会重启一下，我们不断的按f2进入bios，然后进入pe

打开cmd，

 然后找个地方，比如OS所在的那个盘，我这是D盘

创建目录，输入命令

```
md d:\mount
```

把asus.sum挂载到这个目录下面

 输入命令挂载

```
dism /mount-image /imagefile:你的asus.sum路径 /index:1 /MountDir:d:\mount
```

 ![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/0c52f66dc8384253bfd289bb69120af0.jpg)

接下来将刚刚我们系统弄好的ReAgent.xml复制这个镜像里面对应的位置去

也就是os所在驱动器下面的Windows\System32\Recovery\ReAgent.xml复制到d:\mount\Windows\System32\Recovery\ReAgent.xml

复制完成之后就成了，然后我们输入命令取消挂载并保存修改

```
dism /Unmount-image /MountDir:d:\mount /commit
```



 这样我们修改好镜像了。把这个镜像去替换RESTORE分区里面的（我这里是修改的我移动硬盘里面那一个镜像副本，要是你们直接改的是RESTORE分区里面那个就不用替换了）

至此，修改全部完成。并且用asus recovery重置系统之后，MYASUS in winre的入口也是存在的

后面的话可以看也可以不看了

九、重启系统进入MYASUS in winre，并用傲梅全盘备份（这里的傲梅pe版要事先下载好，傲梅国内版的网站里面有提供傲梅轻松备份PE版本）

重启的时候记得拔掉优盘，开机的时候不断按f12进入winre

选择MYASUS in winre

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/612ef3aad0454fada0b7eb5d8129b2ff.jpg)

选择asus recovery

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/cf8a257638c74639a99b3095ab2312ed.jpg)

重置 

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/a94a198f08904916a63ddc35f33fa65c.jpg)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/a17bf8f869a94bd9b87c48e8cbea669c.jpg)

ok搞定，应该会自动重启，这时候要快点操作，插上优盘，重启的时候不断按f2进入bios，然后f8进入pe，

进去之后第一件事情删除刚刚asus recovery产生的日志文件

在RESTORE分区下面和asus.sum一起的。删掉那两个log（其实这里可以直接用dism++恢复备份的，我那时候是为了测试一下这个asus recovery是不是能用的才这样） 

之后就可以打开傲梅备份备份全硬盘了

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/8a3e46d919544421a6ff33a29c18fed3.jpg)

![img](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/e44f59cb7f8242018447a44f77bc0de0.jpg)

至此教程全部结束

> 参考：
>
> https://tieba.baidu.com/p/7221452991
>
> http://www.360doc.com/content/20/1010/01/70092632_939674035.shtml

> 资料：
>
> 分区表：[分区表.zip - 蓝奏云](https://yunling.lanzouo.com/ib7Nuxiyo7g)
>
> MYASUS镜像：[MYASUS.zip - 蓝奏云](https://yunling.lanzouo.com/iXrLLxiyqqh)
>
> RECOVERY镜像和RESTORE太大了一个1G一个15G，我慢慢传吧

2022年1月4日 18:07:39

> 链接:https://caiyun.139.com/m/i?005Cj0oBCE8As
>  提取码:bHT7
>  复制内容打开和彩云PC客户端，操作更方便哦

```
文件: F:\RESTORE.pmf
大小: 16377489237 字节
修改时间: 2021年11月14日, 星期日, 下午 02:55:20
MD5: 144AABC2C5817C1D9CA646DF8DE056BB
SHA1: 2F2958CAF3EF7E1BC969D90A39E5EC8980364F02
CRC32: E589B078

文件: F:\RESTORE.zip.001
大小: 4290772992 字节
修改时间: 2022年1月4日, 星期二, 上午 11:21:06
MD5: E0EE12C4D0F650925E8538DCD74B50FA
SHA1: 7DB386D82D0688C79A65D145CFB2218E8A41C735
CRC32: 6CD0640A

文件: F:\RESTORE.zip.002
大小: 4290772992 字节
修改时间: 2022年1月4日, 星期二, 上午 11:20:54
MD5: 5F458E9AA9F174B5D6A7C908993EB52C
SHA1: 8E38F93D96268FC08F1030B0CE9ED86367914509
CRC32: 2123172B

文件: F:\RESTORE.zip.003
大小: 4290772992 字节
修改时间: 2022年1月4日, 星期二, 上午 11:21:01
MD5: 1FB65C6625F7C0100816091821D39FE5
SHA1: AF296F9BB6DCCF5A3903FAF518CF8E2CEA8DCFB7
CRC32: 330ECE6C

文件: F:\RESTORE.zip.004
大小: 3505170533 字节
修改时间: 2022年1月4日, 星期二, 上午 11:21:06
MD5: 17352CBAEA4C2FE9CF5C101AAF08D676
SHA1: 8F95C0E2F6768552B08CCBC9E09310B4D2F69CA6
CRC32: 28DBF528

文件: L:\systemBackup\part_backup\MYASUS.pmf
大小: 34321259 字节
修改时间: 2021年11月14日, 星期日, 下午 02:52:21
MD5: 174C93AB86F1ABD548C546B4EBEACE9B
SHA1: 9E1B89A177107E113C720D876221E71C9B530C4A
CRC32: FE4B0F8E

文件: L:\systemBackup\part_backup\RECOVERY.pmf
大小: 935400245 字节
修改时间: 2021年11月14日, 星期日, 下午 02:56:32
MD5: 8B43561CED145FC39366A03F56371385
SHA1: AF27CDA6C66CAC4A854C9D51D63BE53BB0EA4163
CRC32: C0C3F6F6
```

