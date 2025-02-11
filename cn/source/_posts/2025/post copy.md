---
title: cloudflare r2 s3api 被拦截 提示 CORS 跨域
subtitle: cloudflare r2 s3api CORS blocked
date: 2025-02-11 19:54:47
toc: true
tags: 
    - Cloudflare
    - R2
    - CORS
categories: 
    - 技术分享
---

## 问题描述

在使用 Cloudflare R2 存储服务时，当我们通过网页端（浏览器）访问或上传文件时，经常会遇到 CORS（跨源资源共享）的问题。具体表现为：

1. 通过浏览器访问 R2 中的文件时，控制台报错：
```
Access to XMLHttpRequest at 'https://<account-id>.r2.cloudflarestorage.com/bucket-name/file.jpg' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

2. 使用前端上传文件到 R2 时，预检请求（OPTIONS）失败：
```
Failed to load resource: net::ERR_FAILED
Access to fetch at 'https://<account-id>.r2.cloudflarestorage.com/bucket-name' from origin 'https://your-website.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check.
```

## 原因分析

这个问题的根本原因在于浏览器的同源策略（Same-Origin Policy）安全限制。当网页应用需要访问不同域名下的资源时，需要目标服务器明确允许跨域访问。

在大多数 S3 兼容的服务商（如 AWS S3、阿里云 OSS 等）中，都提供了在控制台配置 CORS 规则的功能。但是 Cloudflare R2 在其 Dashboard 后台界面中并没有提供这样的配置界面。

不过好在在（2022年9月27日）的版本中，R2 开放了对 PutBucketCors 等 BucketCors 操作的支持。这意味着我们现在可以将 AWS S3 的相同 CORS 规则应用于 R2 存储桶。

## 解决方案

### 1. 使用 AWS CLI 配置

这是最简单直接的方式。首先创建一个 cors.json 文件，内容如下：

```json
{
    "CORSRules": [
        {
            "AllowedOrigins": ["*"],
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "MaxAgeSeconds": 3000
        }
    ]
}
```

然后使用 AWS CLI 命令设置 CORS 规则：

```bash
aws s3api put-bucket-cors \
    --endpoint-url https://<account-id>.r2.cloudflarestorage.com \
    --bucket your-bucket-name \
    --cors-configuration file://cors.json \
    --access-key-id your-access-key-id \
    --secret-access-key your-secret-access-key
```

注意这里设置成功是没有任何输出的，如有需要可以开启 `--debug` 选项查看详细信息。

### 2. 使用 AWS SDK for JavaScript

如果你更倾向于使用代码方式配置，可以使用 AWS SDK：

```javascript
const { S3Client, PutBucketCorsCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
    endpoint: "https://<account-id>.r2.cloudflarestorage.com",
    region: "auto",
    credentials: {
        accessKeyId: "your-access-key-id",
        secretAccessKey: "your-secret-access-key"
    }
});

const corsParams = {
    Bucket: "your-bucket-name",
    CORSConfiguration: {
        CORSRules: [
            {
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                AllowedOrigins: ["*"],
                MaxAgeSeconds: 3000
            }
        ]
    }
};

async function setCORS() {
    try {
        const command = new PutBucketCorsCommand(corsParams);
        const response = await client.send(command);
        console.log("CORS configuration successful:", response);
    } catch (error) {
        console.error("Error setting CORS:", error);
    }
}

setCORS();
```

### 3. 使用 Postman 发送请求

你也可以直接通过 Postman 发送 PUT 请求来配置 CORS：

1. 设置请求方法为 PUT
2. URL 设置为：`https://<account-id>.r2.cloudflarestorage.com/your-bucket-name?cors`
3. 添加认证信息（AWS Signature）
4. 请求体使用上面的 CORS 配置 JSON 对应转成 XML
```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedHeader>Content-Type</AllowedHeader>
        <AllowedHeader>Content-Length</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

## 注意事项

1. 在生产环境中，建议将 `AllowedOrigins` 设置为具体的域名，而不是 `*`
2. `AllowedMethods` 建议只开放必要的 HTTP 方法
3. 配置完成后可以通过以下命令验证配置是否生效：
```bash
aws s3api get-bucket-cors \
    --endpoint-url https://<account-id>.r2.cloudflarestorage.com \
    --bucket your-bucket-name \
    --access-key-id your-access-key-id \
    --secret-access-key your-secret-access-key
```
4. CORS 配置生效可能需要几分钟时间

## 总结

虽然 Cloudflare R2 目前还没有提供图形化的 CORS 配置界面，但通过 AWS S3 兼容的 API，我们完全可以实现所需的 CORS 配置。选择使用 AWS CLI、SDK 或者 Postman 都可以完成配置，关键是要根据实际需求设置合适的 CORS 规则，确保安全性的同时提供必要的跨域访问支持。

> 最后: 感谢 Claude AI 友情参演，写博客只要写大概内容和大概就行了，效率upup～

## 参考
- [Configuring CORS on Cloudflare R2](https://kian.org.uk/configuring-cors-on-cloudflare-r2/)
- [Pre-signed URLs & CORS on Cloudflare R2](https://mikeesto.medium.com/pre-signed-urls-cors-on-cloudflare-r2-c90d43370dc4)