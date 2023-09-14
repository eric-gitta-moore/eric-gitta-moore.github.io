---
title: rke2集群安装完成之后使用kubectl反应很慢
subtitle: After the rke2 cluster is installed, kubectl responds very slowly
date: 2023-03-17 12:21:19
toc: true
categories: 
    - 默认
---

从头开始检查

# 检查kubectl请求
```shell
root@rke2-3:~# kubectl get nodes -v 9
I0317 12:03:12.948874   50681 loader.go:372] Config loaded from file:  /root/.kube/config
I0317 12:03:12.966771   50681 round_trippers.go:435] curl -v -XGET  -H "User-Agent: kubectl/v1.22.17+rke2r1 (linux/amd64) kubernetes/a7736ea" -H "Accept: application/json, */*" 'https://127.0.0.1:6443/apis/metrics.k8s.io/v1beta1?timeout=32s'
I0317 12:03:17.976244   50681 round_trippers.go:454] GET https://127.0.0.1:6443/apis/metrics.k8s.io/v1beta1?timeout=32s 503 Service Unavailable in 5009 milliseconds
I0317 12:03:17.976302   50681 round_trippers.go:460] Response Headers:
I0317 12:03:17.976310   50681 round_trippers.go:463]     Date: Fri, 17 Mar 2023 04:03:17 GMT
I0317 12:03:17.976314   50681 round_trippers.go:463]     Audit-Id: 6161f664-ef9b-4c43-bc8a-7a9bc4aadc4d
I0317 12:03:17.976318   50681 round_trippers.go:463]     Cache-Control: no-cache, private
I0317 12:03:17.976322   50681 round_trippers.go:463]     Content-Type: text/plain; charset=utf-8
I0317 12:03:17.976326   50681 round_trippers.go:463]     X-Content-Type-Options: nosniff
I0317 12:03:17.976330   50681 round_trippers.go:463]     X-Kubernetes-Pf-Flowschema-Uid: 18ac6688-4bae-4287-bb86-d3e59b300a3b
I0317 12:03:17.976334   50681 round_trippers.go:463]     X-Kubernetes-Pf-Prioritylevel-Uid: 8030cae1-7f3d-431a-90c4-09f0ba76b7aa
I0317 12:03:17.976338   50681 round_trippers.go:463]     Content-Length: 68
I0317 12:03:17.979957   50681 request.go:1197] Response Body: error trying to reach service: dial tcp 10.42.0.3:8443: i/o timeout
I0317 12:03:17.983359   50681 request.go:1388] body was not decodable (unable to check for Status): yaml: mapping values are not allowed in this context
I0317 12:03:17.983405   50681 cached_discovery.go:78] skipped caching discovery info due to the server is currently unable to handle the request
I0317 12:03:17.984416   50681 round_trippers.go:435] curl -v -XGET  -H "Accept: application/json, */*" -H "User-Agent: kubectl/v1.22.17+rke2r1 (linux/amd64) kubernetes/a7736ea" 'https://127.0.0.1:6443/apis/metrics.k8s.io/v1beta1?timeout=32s'
```
发现超时在这一个请求 `https://127.0.0.1:6443/apis/metrics.k8s.io/v1beta1?timeout=32s 503 Service Unavailable in 5009 milliseconds`

# 检查.kube/config
```shell
root@rke2-1:~/.kube# cat config 
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: xxx
    server: https://127.0.0.1:6443
  name: default
contexts:
- context:
    cluster: default
    user: default
  name: default
current-context: default
kind: Config
preferences: {}
users:
- name: default
  user:
    client-certificate-data: xxx
    client-key-data: xxx
```
在除了第一个server节点上运行kubectl都很卡，检查kubectl的配置文件，发现请求的server是127.0.0.1

于是修改为负载均衡ip或者域名即可解决问题

```shell
load_balancer_addr=rancher2.ent.top
sed -i.bak "s/127.0.0.1:6443/${load_balancer_addr}:6443/" /etc/rancher/rke2/rke2.yaml
```