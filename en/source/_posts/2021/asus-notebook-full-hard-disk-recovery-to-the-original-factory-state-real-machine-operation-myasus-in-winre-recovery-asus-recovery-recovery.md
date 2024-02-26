---
title: ASUS notebook full hard disk recovery to the original factory state real machine operation, MYASUS IN WINRE recovery, ASUS RECOVERY recovery
subtitle: ASUS notebook full hard disk recovery to the original factory state real machine operation, MYASUS IN WINRE recovery, ASUS RECOVERY recovery
date: 2021-12-12 15:47:45
toc: true
tags: 
categories: 
    - Default
---

Prerequisites for this tutorial: You should have previously backed up the original factory RECOVERY partition, RESTORE partition, and MYASUS partition.

If you don't have these partitions, you'll need to either get a copy from a friend with the same laptop model or contact customer support and request restoration of these three partitions. Typically, customer support may skip restoring the restore partition to save disk space, which is nearly 20GB.

My machine is ASUS TUF Gaming A17 with i7-11800H, RTX 3060, 32GB RAM, and 512GB SSD, model FX506HM.

> Here's my msinfo32: [Link](https://yunling.lanzouo.com/iJEO5xj1tgd)

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/31aee62d00ec4844bf1b76c1e237f9aa.png)

This tutorial will first explain how to perform a full format, and I'll cover how to do it without formatting next time. Let's get started.

First, prepare a bootable USB drive or external hard drive with a PE (Preinstallation Environment). There are many tutorials online on creating a PE bootable drive; I won't go into details here. I used "优启通" for creating my PE, as I found it more feature-rich than "WEPE."

1. Insert the USB drive (or external hard drive), then boot or restart your computer and repeatedly press F2 to enter the BIOS.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/2ce6bf9931e248378cb00151035f922c.jpg)

2. Press F8 to enter the PE environment.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/dbe67173bf55410b8dcd0362dcd56b57.jpg)

3. Partition your drive to match the factory configuration.

I have backed up the factory partition table, so you can follow it for partitioning.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/08e3c070967f4b61adbb5813eec6c9b2.jpg)

You can ignore the "Local Disk D" and merge it into the OS. I created this local disk D shortly after getting my machine using Windows' built-in disk management tool because I prefer not to have such a large C drive.

① Start by creating a partition.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/e7e11d2ca8834470979b16000ddcad42.jpg)

Then adjust the OS partition to shrink it to 200GB because we don't know how much space we'll need later.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/7511ad1b11a94b58a8e0079add049be8.jpg)

Next, create the RECOVERY, RESTORE, and MYASUS partitions.

- RECOVERY partition is 1000MB.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/00627725fd194e4d9bcae5c8d9c17720.jpg)

- RESTORE partition is 19.5GB (approximately 19968MB).

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/3af4087c2c6148b9a39d2b1268c5b2ad.jpg)

- MYASUS partition is 200MB.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/dafa293bf5294ab9afb4b05bb0e48fa8.jpg)

Save the changes and allocate the remaining space back to the OS partition.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/36b45205c70e4c119e596e07b16086e7.jpg)

4. Restore backups for each partition.

Use DiskGenius to restore the RECOVERY, RESTORE, and MYASUS partitions.

Then open DISM++, go to "File" > "Release Image," and this step will restore the factory system.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/e9045a768b0f45e795d61c9cc756a224.jpg)

At this point, your computer may not be able to boot. Next, we will rebuild the bootloader.

Go back to DiskGenius and assign a drive letter to the ESP partition and the OS partition.

(Right-click on a partition, and you will find the option to assign a drive letter.)

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/b486d0c1e63c4d2081f5be1dd89f9faf.jpg)

Type "cmd" into the Run dialog (Win+R).

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/d5879ab87e1544f9a97cb91818e09b49.jpg)

Enter the following command:

```
bcdboot d:\windows /s c: /f UEFI /l zh-cn
```

Here, "d:\windows" should match the drive letter assigned to your OS partition, and "c:" should match the drive letter assigned to your ESP partition.

5. Some finishing touches before booting up.

I forgot to mention a step earlier, but you can do it here.

- Right-click on the ESP partition and set the label to "SYSTEM."

- Right-click on the RECOVERY partition and change the partition parameters.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/0640ca85d6c94b1fa42a49edc1fee88b.jpg)

Change the file system type to "Microsoft recovery partition," and leave the other settings unchanged.

Repeat the same operation for the RESTORE and MYASUS partitions, modifying their file system types.

6. Restart to configure WinRE for the current system.

Restart your computer and continuously press F2 to enter the BIOS.

Adjust the boot order in BIOS.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/3a301e079bcf422a8a001663fb1eb6fd.jpg)

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/a0c40faec38945de9b53f74cfb815a77.jpg)

Save and exit by pressing F10. Your motherboard may power off briefly at this point; you can remove the USB drive quickly (it's not necessary to unplug it).

7. Configure WinRE for the current system.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/029602c7a48448858b05c9cf6b42c9d3.jpg)

After restarting, you'll see this screen.

After performing some operations, you should be able to enter. Open "cmd" as an administrator:

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/5f29599968824e44a7809a854bb00b6d.png)

Enter the command:

```
reagentc /info
```

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/636e88b582af4fb0985b324a24d26b5b.jpg)

You should see "disabled," indicating that it's normal.

Then, modify your file explorer settings to show hidden files and file extensions:

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/052e1079000e44faa31e3111f5cdd802.png)

Next, specify the image path for WinRE. In the command prompt, enter:

```
reagentc /setreimage /path [the path you copied earlier]
```

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/613ce2a05f8b4711aca0812b77f7d548.jpg)

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/2ddf4c0be2b445b983d012a8e646543f.jpg)

Now, WinRE is configured for your current system. You can enable it by entering:

```
reagentc /enable
```

If everything goes well, you'll see a brief pause followed by a successful operation message. You can verify the status with:

```
reagentc /info
```

Don't worry; we're almost there. There's one more step to write the MYASUS entry into WinRE.

Copy this file to your desktop:

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/e95634d43475492597360d1cb5af1d9e.jpg)

While holding Shift, right-click to copy the file path:

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/770fb2d4e7c847f7921bba10f6d4faa6.jpg)

Now, in the command prompt, enter:

```
reagentc /setbootshelllink /configfile [the path you copied earlier]
```

With this, you've configured MYASUS in WinRE. Now, when you restart your system and enter WinRE, you'll find the MYASUS entry.

8. Configure WinRE in asus.sum.

Click the left-pointing arrow:

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/e8ed571a7e0047f986410f6ecf902ca9.png)

Choose "Continue with Windows 10." Your computer will probably restart; enter BIOS by pressing F2 and then enter PE.

Open cmd, navigate to the drive where your OS is located (e.g., D drive), and create a directory:

```
md d:\mount
```

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/0c52f66dc8384253bfd289bb69120af0.jpg)

Mount asus.sum to this directory with the following command:

```
dism /mount-image /imagefile:[your asus.sum path] /index:1 /MountDir:d:\mount
```

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/0c52f66dc8384253bfd289bb69120af0.jpg)

Next, copy the ReAgent.xml you configured for your current system into the corresponding location in this mounted image. The path should be like this: d:\mount\Windows\System32\Recovery\ReAgent.xml.

After copying, unmount and save the changes with this command:

```
dism /Unmount-image /MountDir:d:\mount /commit
```

Now, you've modified the image. Replace the RESTORE partition's image with this one (I used a copy of the image on my external hard drive; if you modified the image directly in the RESTORE partition, you don't need to replace it).

That's it! The modifications are complete. After resetting your system with ASUS recovery, the MYASUS entry in WinRE should be present.

The rest of the steps are optional and involve configuring backups using a third-party tool.

9. Restart your system and enter MYASUS in WinRE, then use AoMei Backupper to back up your entire hard drive.

Make sure to remove the USB drive when restarting and press F12 to enter WinRE.

Select MYASUS in WinRE.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/612ef3aad0454fada0b7eb5d8129b2ff.jpg)

Choose ASUS recovery.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/cf8a257638c74639a99b3095ab2312ed.jpg)

Reset your system.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/a94a198f08904916a63ddc35f33fa65c.jpg)

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/a17bf8f869a94bd9b87c48e8cbea669c.jpg)

Your system should automatically restart, and at this point, quickly insert your USB drive. While restarting, continuously press F2 to enter BIOS, and then press F8 to enter PE.

Once in PE, delete the logs generated by ASUS recovery in the RESTORE partition. These logs are located alongside asus.sum. Delete the two log files (you can also use DISM++ to restore from backups; I deleted them for testing ASUS recovery).

Now, you can use AoMei Backupper to back up your entire hard drive.

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/8a3e46d919544421a6ff33a29c18fed3.jpg)

![Image](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/e44f59cb7f8242018447a44f77bc0de0.jpg)

That concludes the tutorial.

> References:
>
> https://tieba.baidu.com/p/7221452991
>
> http://www.360doc.com/content/20/1010/01/70092632_939674035.shtml

> Materials:
>
> Partition Table: [Partition Table.zip - Lanzou Cloud](https://yunling.lanzouo.com/ib7Nuxiyo7g)
>
> MYASUS Image: [MYASUS.zip - Lanzou Cloud](https://yunling.lanzouo.com/iXrLLxiyqqh)
>
> The RECOVERY image and RESTORE are too large, one is 1G, and the other is 15G. I will upload them slowly.

January 4, 2022, 18:07:39

> Link: https://caiyun.139.com/m/i?005Cj0oBCE8As
>  Extraction Code: bHT7
>  Copy the content, open it with the Caiyun PC client for easier operation.

```
File: F:\RESTORE.pmf
Size: 16,377,489,237 bytes
Modified: November 14, 2021, Sunday, 02:55:20 PM
MD5: 144AABC2C5817C1D9CA646DF8DE056BB
SHA1: 2F2958CAF3EF7E1BC969D90A39E5EC8980364F02
CRC32: E589B078

File: F:\RESTORE.zip.001
Size: 4,290,772,992 bytes
Modified: January 4, 2022, Tuesday, 11:21:06 AM
MD5: E0EE12C4D0F650925E8538DCD74B50FA
SHA1: 7DB386D82D0688C79A65D145CFB2218E8A41C735
CRC32: 6CD0640A

File: F:\RESTORE.zip.002
Size: 4,290,772,992 bytes
Modified: January 4, 2022, Tuesday, 11:20:54 AM
MD5: 5F458E9AA9F174B5D6A7C908993EB52C
SHA1: 8E38F93D96268FC08F1030B0CE9ED86367914509
CRC32: 2123172B

File: F:\RESTORE.zip.003
Size: 4,290,772,992 bytes
Modified: January 4, 2022, Tuesday, 11:21:01 AM
MD5: 1FB65C6625F7C0100816091821D39FE5
SHA1: AF296F9BB6DCCF5A3903FAF518CF8E2CEA8DCFB7
CRC32: 330ECE6C

File: F:\RESTORE.zip.004
Size: 3,505,170,533 bytes
Modified: January 4, 2022, Tuesday, 11:21:06 AM
MD5: 17352CBAEA4C2FE9CF5C101AAF08D676
SHA1: 8F95C0E2F6768552B08CCBC9E09310B4D2F69CA6
CRC32: 28DBF528

File: L:\systemBackup\part_backup\MYASUS.pmf
Size: 34,321,259 bytes
Modified: November 14, 2021, Sunday, 02:52:21 PM
MD5: 174C93AB86F1ABD548C546B4EBEACE9B
SHA1: 9E1B89A177107E113C720D876221E71C9B530C4A
CRC32: FE4B0F8E

File: L:\systemBackup\part_backup\RECOVERY.pmf
Size: 935,400,245 bytes
Modified: November 14, 2021, Sunday, 02:56:32 PM
MD5: 8B43561CED145FC39366A03F56371385
SHA1: AF27CDA6C66CAC4A854C9D51D63BE53BB0EA4163
CRC32: C0C3F6F6
```