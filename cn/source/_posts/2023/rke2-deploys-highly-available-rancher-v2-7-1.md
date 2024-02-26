---
title: RKE2部署高可用Rancher v2.7.1
subtitle: RKE2 deploys highly available Rancher v2.7.1
date: 2023-02-13 21:33:35
toc: true
categories: 
    - 默认
---


## 先决条件
- 注意修改主机名，不要有冲突


## 配置负载均衡器和健康检查

我这里使用的是VMware NSX-T负载均衡

> 这里有个坑，80端口的响应代码，需要把307,308,303标记为健康的状态码

![16936369265351693636925856.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936369265351693636925856.png)

## 第一个server节点安装

> 官方文档的描述感觉对于新手来说太不友好了，建议以下链接都看一下。Rancher新老文档都建议看一下，不然刚刚入门很蒙。
>
> RKE2快速开始：https://docs.rke2.io/zh/install/quickstart
>
> RKE2高可用：https://docs.rke2.io/zh/install/ha
>
> RKE2离线安装：https://docs.rke2.io/zh/install/airgap
>
> RKE2卸载：https://docs.rke2.io/zh/install/linux_uninstall
>
>
> Rancher Helm CLI快速入门：https://ranchermanager.docs.rancher.com/zh/getting-started/quick-start-guides/deploy-rancher-manager/helm-cli
>
> Rancher 离线Helm安装：https://ranchermanager.docs.rancher.com/zh/getting-started/installation-and-upgrade/other-installation-methods/air-gapped-helm-cli-install/install-rancher-ha
>
> 老版Rancher文档 离线安装：https://docs.rancher.cn/docs/rancher2/installation/other-installation-methods/air-gap/install-rancher/_index
>
> 老版Rancher文档 如何在国内使用 Rancher：https://docs.rancher.cn/docs/rancher2/best-practices/use-in-china/_index/

```bash
# 卸载
/usr/local/bin/rke2-uninstall.sh

# 配置文件，load_balancer_addr 负载均衡ip或者第一台serverip
load_balancer_addr=172.16.10.241

mkdir -p /etc/rancher/rke2 && echo "
tls-san:
  - ${load_balancer_addr}
system-default-registry: \"docker.nju.edu.cn\"
" > /etc/rancher/rke2/config.yaml

# 检查配置
cat /etc/rancher/rke2/config.yaml

# 指定版本安装
curl -sfL https://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn INSTALL_RKE2_VERSION=v1.22.17+rke2r1 sh -
# 安装最新stable版本
# curl -sfL https://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn sh -
systemctl enable rke2-server.service && systemctl start rke2-server.service

# 查看日志
# journalctl -u rke2-server -f

```

## 实用程序注册到PATH

> kubeconfig默认的server地址是127.0.0.1
> 
> 在最小集群安装完成之后需要修改为负载均衡地址

```bash
echo 'export PATH=$PATH:/var/lib/rancher/rke2/bin;' >> ~/.bashrc && source ~/.bashrc
mkdir -p ~/.kube && rm -f ~/.kube/config && ln -s /etc/rancher/rke2/rke2.yaml ~/.kube/config
```

### 等待所有pod运行
```
root@rke1:~# watch -n 1 kubectl get pods -A

Every 1.0s: kubectl get pods -A                                                                                                                                                                             rke1: Thu Mar 16 21:22:08 2023

NAMESPACE     NAME                                                   READY   STATUS      RESTARTS   AGE
kube-system   cloud-controller-manager-rke1                          1/1     Running     0          33m
kube-system   etcd-rke1                                              1/1     Running     0          33m
kube-system   helm-install-rke2-canal-mscjh                          0/1     Completed   0          34m
kube-system   helm-install-rke2-coredns-qrmgn                        0/1     Completed   0          34m
kube-system   helm-install-rke2-ingress-nginx-ddt95                  0/1     Completed   0          34m
kube-system   helm-install-rke2-metrics-server-6cm27                 0/1     Completed   0          34m
kube-system   kube-apiserver-rke1                                    1/1     Running     0          33m
kube-system   kube-controller-manager-rke1                           1/1     Running     0          33m
kube-system   kube-proxy-rke1                                        1/1     Running     0          33m
kube-system   kube-scheduler-rke1                                    1/1     Running     0          33m
kube-system   rke2-canal-f56nc                                       2/2     Running     0          32m
kube-system   rke2-coredns-rke2-coredns-69844654d9-lsvw6             1/1     Running     0          32m
kube-system   rke2-coredns-rke2-coredns-autoscaler-95d984597-p9r6k   1/1     Running     0          32m
kube-system   rke2-ingress-nginx-controller-4ddx9                    1/1     Running     0          29m
kube-system   rke2-metrics-server-765b64878b-jtq2v                   1/1     Running     0          30m

```

### 注册令牌，接下来要用
```shell
cat /var/lib/rancher/rke2/server/node-token
```

## 其他server节点安装

```bash
# 配置文件，load_balancer_addr 负载均衡ip或者第一台serverip
load_balancer_addr=172.16.10.241 node_token=xxxxxxxx

mkdir -p /etc/rancher/rke2 && echo "
server: https://${load_balancer_addr}:9345
token: ${node_token}
tls-san:
  - ${load_balancer_addr}
system-default-registry: \"docker.nju.edu.cn\"
" > /etc/rancher/rke2/config.yaml

# 检查配置
cat /etc/rancher/rke2/config.yaml

# 安装
curl -sfL https://rancher-mirror.rancher.cn/rke2/install.sh | INSTALL_RKE2_MIRROR=cn INSTALL_RKE2_VERSION=v1.22.17+rke2r1 sh -
systemctl enable rke2-server.service && systemctl start rke2-server.service
```

## 实用程序注册到PATH

```bash
echo 'export PATH=$PATH:/var/lib/rancher/rke2/bin;' >> ~/.bashrc && source ~/.bashrc
mkdir -p ~/.kube && rm -f ~/.kube/config && ln -s /etc/rancher/rke2/rke2.yaml ~/.kube/config
```

这里使用kubectl可能会反应很慢，需要修改kubeconfig中server的地址为负载均衡地址

```shell
load_balancer_addr=rancher2.ent.top
sed -i.bak "s/127.0.0.1:6443/${load_balancer_addr}:6443/" /etc/rancher/rke2/rke2.yaml
```

## 安装helm

```bash
# 下载 helm 并上传 https://github.com/helm/helm/releases
rm -rf linux-amd64/helm && tar -zxvf helm-v3.10.3-linux-amd64.tar.gz && mv linux-amd64/helm /usr/local/bin/helm && helm version
```

## 安装Cert-Manager

```bash
# 可以下载过来然后在 kubectl apply -f cert-manager.crds.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.7.1/cert-manager.crds.yaml

helm repo add jetstack https://charts.jetstack.io && helm repo update

helm install cert-manager jetstack/cert-manager \
--set image.repository=quay.nju.edu.cn/jetstack/cert-manager-controller \
--set webhook.image.repository=quay.nju.edu.cn/jetstack/cert-manager-webhook \
--set cainjector.image.repository=quay.nju.edu.cn/jetstack/cert-manager-cainjector \
--set startupapicheck.image.repository=quay.nju.edu.cn/jetstack/cert-manager-ctl \
--namespace cert-manager \
--create-namespace \
--version v1.7.1

```



## 安装Rancher

> 这里也有个坑，不能安装离线安装文档中加
>  `--set certmanager.version=<CERTMANAGER_VERSION>` 参数，会报错如下
> `unable to build kubernetes objects from release manifest: resource mapping not found for name: "rancher" namespace: "" `

```bash
helm repo add rancher-latest https://rancher-mirror.rancher.cn/server-charts/latest

kubectl create namespace cattle-system

# rancher域名，要么解析dns，要么加入自己电脑hosts
rancher_domain=rancher01.ent.top
helm install rancher rancher-latest/rancher \
--namespace cattle-system \
--set hostname=${rancher_domain} \
--set rancherImage=docker.nju.edu.cn/rancher/rancher \
--set systemDefaultRegistry=docker.nju.edu.cn
```


## 安装完成
密码看提示
`$(kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}')`
或者直接用链接（其实就是跳过输入上面随机密码的阶段，直接到下一步设置admin密码）
`echo https://rancher01.ent.top/dashboard/?setup=$(kubectl get secret --namespace cattle-system bootstrap-secret -o go-template='{{.data.bootstrapPassword|base64decode}}')`

![16936369605351693636960184.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936369605351693636960184.png)

![16936369695351693636969075.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936369695351693636969075.png)

![16936369815351693636980799.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/16936369815351693636980799.png)