---
title: cloud-init image.qcow2 image import and start Proxmox VE virtual machine
subtitle: cloud-init image.qcow2 image import and start Proxmox VE virtual machine
date: 2022-05-28 01:58:03
toc: true
tags: 
categories: 
    - Default
---

![16936530179911693653017662.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936530179911693653017662.png)

# Download Links for Cloud Images

> This article outlines the download links for cloud images. It also includes practical insights derived from the following source: [Proxmox Cloud-Init Image Templates Download (CentOS, Ubuntu, Debian) - Prokvm Cloud Management System - XMBILLION Prokvm Community](https://bbs.xmbillion.com/thread-18.htm)

> CentOS:
> 
> http://cloud.centos.org/centos/

> Ubuntu:
> 
> http://cloud-images.ubuntu.com/releases/

> Debian:
> 
> https://cloud.debian.org/images/cloud/OpenStack/

> Fedora:
> 
> https://alt.fedoraproject.org/cloud/

> Red Hat 7:
> 
> https://access.redhat.com/downloads/content/69/ver=/rhel---7/x86_64/product-downloads

> openSUSE:
> 
> https://software.opensuse.org/distributions/leap#JeOS-ports

# Information About CentOS Versions:

> Original Source: [News | CentOS Linux 7 Rolling Build Released - CentOS announced the official release of the CentOS Linux 7 rolling build last Friday! This release includes two versions of CentOS Linux 7: ISOs for installation media and generic cloud images. The CentOS Linux 7 rolling build includes all updates pushed to mirror.centos.org between the initial release and snapshot release. These updates encompass security updates, bug fixes, feature enhancements, and general updates for CentOS Linux. Machines installed using this version will include all previously released updates and will not differ from those updated using yum. All RPM/yum repositories remain stored on mirror.centos.org with no change in location or content. A rolling update version will be released by the end of each month.](https://linux.cn/article-4394-1.html)

> File: CentOS-7-x86_64-GenericCloud-20141129_01.qcow2
> 
> Description: This is a baseline image.

> File: CentOS-7-x86_64-GenericCloud-20141129_01.qcow2c
> 
> Description: Same content as the above image but compressed internally using qemu qcow2, suitable for development and testing with lower I/O performance, not recommended for production environments.

> File: CentOS-7-x86_64-GenericCloud-20141129_01.qcow2.xz
> 
> Description: A standard qcow2 file compressed with xz, suitable for production environments.

> File: CentOS-7-x86_64-GenericCloud-20141129_01.raw
> 
> Description: This is a raw format file, not in qcow2 image format. It can be converted to other formats using "qemu-img convert."

# Step One: Download Cloud Images

# Step Two: Import Cloud Images into PVE

You can choose any location for importing; it should be easily accessible. I saved mine in /var/lib/vz/images.

# Step Three: Create a Virtual Machine

1. General

![16936530389901693653038585.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936530389901693653038585.png)

2. Operating System

No need for a hard drive here.

![16936530489901693653048509.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936530489901693653048509.png)

3. System

Make sure to check "qemu agent."

![16936530579901693653057056.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936530579901693653057056.png)

4. Disks

You can leave the disk settings as they are; we'll remove them later.

![16936530789901693653078906.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936530789901693653078906.png)

5. CPU (default)

![16936530929911693653092777.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936530929911693653092777.png)

6. Memory

I changed it to 1024 since I'm creating a template.

![16936531029951693653102123.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936531029951693653102123.png)

7. Network (default)

![16936531109931693653110485.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936531109931693653110485.png)

8. Confirm and finish the creation.

![16936531239951693653123848.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936531239951693653123848.png)

## Modify Hardware

1. Detach and delete the hard drive.

![16936531349901693653134701.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936531349901693653134701.png)

2. Delete the CD/DVD drive.

![16936531469921693653146623.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936531469921693653146623.png)

3. Add a Cloud-init device.

![16936531579941693653157099.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936531579941693653157099.png)

![16936531669901693653166526.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936531669901693653166526.png)

> The article mentions adding USB and serial devices, but I'm not sure what they are used for. The official documentation also suggests adding a serial device and changing the monitor to serial, but in my testing, it didn't seem necessary. Maybe I made a mistake in my operation. I would appreciate guidance from experts.

# Step Four: Import Cloud Image for VM

Execute the following command:

```bash
qm importdisk 105 /var/lib/vz/images/CentOS-7-x86_64-GenericCloud-1907.qcow2 local-lvm --format=qcow2
```

Where:

- `105` refers to the ID of the machine you just created, as shown in the image.
- `/var/lib/vz/images/CentOS-7-x86_64-GenericCloud-1907.qcow2` is the path to the uploaded image.
- `local-lvm` is your storage node, as shown in the image.
- `--format=qcow2` indicates importing in qcow2 format. If the image already has a qcow2 extension, this option is not necessary. I left it for consistency.

The import should be successful.

Go back to the panel and check for an unused disk, double-click on it, and enable it.

![16936532099941693653209439.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936532099941693653209439.png)

![16936532189931693653218099.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936532189931693653218099.png)

![16936532279901693653227208.png](https://raw.githubusercontent.com/eric-gitta-moore/blog-img/img

/img/16936532279901693653227208.png)

# Step Five: Set Boot Order

Select the disk you just enabled and remove the network boot option.

![16936532389901693653238304.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936532389901693653238304.png)

# Step Six: Configure Cloud-init

When you first open it, it should look like this:

![16936532459901693653245247.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936532459901693653245247.png)

> Special Note:
>
> The "User" field is mandatory.

User: root

Password: Set it as desired; I set mine to 111111.

DNS Domain: DNS1, here I set it to 223.5.5.5.

DNS Server: DNS2, here I set it to 223.6.6.6.

IP Configuration: Here I set it to DHCP.

The configuration should look like this:

![16936532539911693653253522.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936532539911693653253522.png)

> Cloud-init will use the VM's name as the hostname.

# Step Seven: Boot and Test

![16936532689911693653268088.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936532689911693653268088.png)

Success!

# Step Eight: Enable Root Login

Edit the `/etc/ssh/sshd_config` file and modify `PermitRootLogin` to "yes" and `PasswordAuthentication` to "yes."

# Step Nine: Clone the VM to Create a Template

Shutdown the VM and then right-click on it and select "Convert to Template."

![16936532819921693653281915.png](https://raw.githubusercontent.com/eric-gitta-moore/eric-gitta-moore.github.io/main/static/images/16936532819921693653281915.png)

Now, you can link to or fully clone the template.