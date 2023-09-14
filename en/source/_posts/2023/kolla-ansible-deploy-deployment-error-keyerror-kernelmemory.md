---
title: Kolla-Ansible deploy部署报错 KeyError \\‘KernelMemory
subtitle: Kolla-Ansible deploy deployment error KeyError \\‘KernelMemory
date: 2023-02-03 23:51:01
toc: true
tags: 
categories: 
    - 默认
---


#  问题复现

执行部署命令，在 TASK [common : Check common containers] 阶段报错

```
 kolla-ansible -i multinode deploy
```



 报错信息如下

```
The full traceback is:
  File "/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/modules/kolla_docker.py", line 381, in main
  File "/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/module_utils/kolla_docker_worker.py", line 114, in compare_container
    self.check_container_differs() or
  File "/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/module_utils/kolla_docker_worker.py", line 135, in check_container_differs
    self.compare_dimensions(container_info) or
  File "/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/module_utils/kolla_docker_worker.py", line 330, in compare_dimensions
    elif current_dimensions[key2]:
failed: [control01] (item={'key': 'cron', 'value': {'container_name': 'cron', 'group': 'cron', 'enabled': True, 'image': 'quay.nju.edu.cn/openstack.kolla/ubuntu-source-cron:yoga', 'environment': {'DUMMY_ENVIRONMENT': 'kolla_useless_env', 'KOLLA_LOGROTATE_SCHEDULE': 'daily'}, 'volumes': ['/etc/kolla/cron/:/var/lib/kolla/config_files/:ro', '/etc/localtime:/etc/localtime:ro', '/etc/timezone:/etc/timezone:ro', 'kolla_logs:/var/log/kolla/'], 'dimensions': {}}}) => {
    "ansible_loop_var": "item",
    "changed": true,
    "invocation": {
        "module_args": {
            "action": "compare_container",
            "api_version": "auto",
            "auth_email": null,
            "auth_password": null,
            "auth_registry": "quay.nju.edu.cn",
            "auth_username": null,
            "cap_add": [],
            "cgroupns_mode": null,
            "client_timeout": 120,
            "command": null,
            "detach": true,
            "dimensions": {},
            "environment": {
                "DUMMY_ENVIRONMENT": "kolla_useless_env",
                "KOLLA_CONFIG_STRATEGY": "COPY_ALWAYS",
                "KOLLA_LOGROTATE_SCHEDULE": "daily"
            },
            "graceful_timeout": 10,
            "healthcheck": null,
            "ignore_missing": false,
            "image": "quay.nju.edu.cn/openstack.kolla/ubuntu-source-cron:yoga",
            "labels": {},
            "name": "cron",
            "privileged": false,
            "remove_on_exit": true,
            "restart_policy": "unless-stopped",
            "restart_retries": 10,
            "security_opt": [],
            "state": "running",
            "tls_cacert": null,
            "tls_cert": null,
            "tls_key": null,
            "tls_verify": false,
            "tmpfs": null,
            "tty": false,
            "volumes": [
                "/etc/kolla/cron/:/var/lib/kolla/config_files/:ro",
                "/etc/localtime:/etc/localtime:ro",
                "/etc/timezone:/etc/timezone:ro",
                "kolla_logs:/var/log/kolla/"
            ],
            "volumes_from": null
        }
    },
    "item": {
        "key": "cron",
        "value": {
            "container_name": "cron",
            "dimensions": {},
            "enabled": true,
            "environment": {
                "DUMMY_ENVIRONMENT": "kolla_useless_env",
                "KOLLA_LOGROTATE_SCHEDULE": "daily"
            },
            "group": "cron",
            "image": "quay.nju.edu.cn/openstack.kolla/ubuntu-source-cron:yoga",
            "volumes": [
                "/etc/kolla/cron/:/var/lib/kolla/config_files/:ro",
                "/etc/localtime:/etc/localtime:ro",
                "/etc/timezone:/etc/timezone:ro",
                "kolla_logs:/var/log/kolla/"
            ]
        }
    },
    "msg": "'Traceback (most recent call last):\\n  File \"/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/modules/kolla_docker.py\", line 381, in main\\n  File \"/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/module_utils/kolla_docker_worker.py\", line 114, in compare_container\\n    self.check_container_differs() or\\n  File \"/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/module_utils/kolla_docker_worker.py\", line 135, in check_container_differs\\n    self.compare_dimensions(container_info) or\\n  File \"/tmp/ansible_kolla_docker_payload_d27r44yb/ansible_kolla_docker_payload.zip/ansible/module_utils/kolla_docker_worker.py\", line 330, in compare_dimensions\\n    elif current_dimensions[key2]:\\nKeyError: \\'KernelMemory\\'\\n'"
}

PLAY RECAP ***************************************************************************************************************************************************************************************************************************
control01                  : ok=17   changed=0    unreachable=0    failed=1    skipped=1    rescued=0    ignored=0   
localhost                  : ok=4    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   

Command failed ansible-playbook -e @/etc/kolla/globals.yml  -e @/etc/kolla/passwords.yml -e CONFIG_DIR=/etc/kolla  -e kolla_action=deploy /path/to/venv/share/kolla-ansible/ansible/site.yml  --verbose --verbose --verbose --verbose --inventory multinode
```



# 问题分析

查看docker版本：docker version

```
(venv) root@ubuntu:~# docker version
Client: Docker Engine - Community
 Version:           23.0.0
 API version:       1.42
 Go version:        go1.19.5
 Git commit:        e92dd87
 Built:             Wed Feb  1 17:47:51 2023
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          23.0.0
  API version:      1.42 (minimum version 1.12)
  Go version:       go1.19.5
  Git commit:       d7573ab
  Built:            Wed Feb  1 17:47:51 2023
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.6.16
  GitCommit:        31aa4358a36870b21a992d3ad2bef29e1d693bec
 runc:
  Version:          1.1.4
  GitCommit:        v1.1.4-0-g5fd4c4d
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0
```



如果你的版本也是23.0.0及以上，那么需要更新kolla-ansible版本，或者降低docker版本

> Do not support dimensions:kernel_memory on Docker API 1.42
>
> It is deprecated in 20.10 and removed in 23.0 (and 23.0 is out) [1], [2].
>
> [1]: https://docs.docker.com/engine/deprecated/#kernel-memory-limit
> [2]: https://docs.docker.com/engine/api/version-history/#v142-api-changes
>
> 出处：
>
> [Do not support dimensions:kernel_memory on Docker API 1.42 · openstack/kolla-ansible@f253f99 · GitHub](https://github.com/openstack/kolla-ansible/commit/f253f99c1216705cc52e65f6229f8ae42bfda178)