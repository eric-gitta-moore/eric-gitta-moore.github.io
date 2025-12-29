---
title: Antigravity support please | "One moment, the agent is currently loading... stuck" | how to fix?
subtitle: 
date: 
toc: true
tags: 
categories: 
    - 默认
---

same as https://www.reddit.com/r/google_antigravity/comments/1p0oxvj/antigravity_support_please_one_moment_the_agent/

![](https://imgur.com/a/Z8Y0hU4)

same here. 
Meanwhile, I got the following output under anti-gravity output.

```
2025-12-29 14:28:17.475 [info] 2025/12/29 14:28:17 maxprocs: Leaving GOMAXPROCS=12: CPU quota undefined
2025-12-29 14:28:17.519 [info] I1229 14:28:17.519283 13179 server.go:1167] Starting language server process with pid 13179
2025-12-29 14:28:17.519 [info] I1229 14:28:17.519325 13179 server.go:284] Setting GOMAXPROCS to 4
2025-12-29 14:28:17.521 [info] I1229 14:28:17.521790 13179 server.go:491] Language server will attempt to listen on host 127.0.0.1
2025-12-29 14:28:17.522 [info] I1229 14:28:17.522154 13179 server.go:506] Language server listening on random port at 59302 for HTTPS
2025-12-29 14:28:17.522 [info] I1229 14:28:17.522221 13179 server.go:513] Language server listening on random port at 59303 for HTTP
2025-12-29 14:28:18.831 [info] I1229 14:28:18.831614 13179 server.go:484] Created extension server client at port 59299
2025-12-29 14:28:18.837 [info] W1229 14:28:18.836441 13179 log_context.go:106] Cache(userInfo): Singleflight refresh failed: You are not logged into Antigravity.
2025-12-29 14:28:19.730 [info] W1229 14:28:19.730687 13179 client.go:135] failed to set auth token
2025-12-29 14:28:19.732 [info] W1229 14:28:19.732124 13179 log_context.go:106] Cache(userInfo): Singleflight refresh failed: You are not logged into Antigravity.
2025-12-29 14:28:20.656 [info] E1229 14:28:20.655943 13179 log.go:354] Failed to report language server start to extension server: unavailable: unexpected EOF
2025-12-29 14:28:20.656 [info] I1229 14:28:20.656221 13179 server.go:1496] initialized server successfully
2025-12-29 14:29:17.195 [info] (Antigravity) 2025-12-29 14:29:17.195 [ERROR]: Failed to start language server: Error: Timed out waiting for language server start
2025-12-29 14:29:17.195 [info] (Antigravity) 2025-12-29 14:29:17.195 [ERROR]: LS startLanguageServer error: Timed out waiting for language server start
```

After I tried various methods, I read the log carefully again. Could it be that anti-gravity was unable to communicate with 127.0.0.1? I tried to shut down all proxy software, including tun/tap devices and Proxifier, and then restarted anti-gravity. To my surprise, it worked. The log this time is as follows:

```
2025-12-29 14:30:40.779 [info] 2025/12/29 14:30:40 maxprocs: Leaving GOMAXPROCS=12: CPU quota undefined
2025-12-29 14:30:40.823 [info] I1229 14:30:40.823425 13950 server.go:1167] Starting language server process with pid 13950
2025-12-29 14:30:40.823 [info] I1229 14:30:40.823470 13950 server.go:284] Setting GOMAXPROCS to 4
2025-12-29 14:30:40.826 [info] I1229 14:30:40.826061 13950 server.go:491] Language server will attempt to listen on host 127.0.0.1
2025-12-29 14:30:40.826 [info] I1229 14:30:40.826317 13950 server.go:506] Language server listening on random port at 61280 for HTTPS
2025-12-29 14:30:40.826 [info] I1229 14:30:40.826360 13950 server.go:513] Language server listening on random port at 61281 for HTTP
2025-12-29 14:30:41.156 [info] I1229 14:30:41.156498 13950 server.go:484] Created extension server client at port 61271
2025-12-29 14:30:41.160 [info] W1229 14:30:41.160299 13950 log_context.go:106] Cache(userInfo): Singleflight refresh failed: You are not logged into Antigravity.
2025-12-29 14:30:41.166 [info] W1229 14:30:41.166780 13950 client.go:135] failed to set auth token
2025-12-29 14:30:41.167 [info] W1229 14:30:41.167708 13950 log_context.go:106] Cache(userInfo): Singleflight refresh failed: You are not logged into Antigravity.
2025-12-29 14:30:41.173 [info] (Antigravity) 2025-12-29 14:30:41.173 [INFO]: Language server started
2025-12-29 14:30:41.175 [info] I1229 14:30:41.175677 13950 server.go:1496] initialized server successfully
2025-12-29 14:30:41.205 [info] (Antigravity) 2025-12-29 14:30:41.205 [INFO]: LS lspClient started successfully
2025-12-29 14:30:41.205 [info] 2025/12/29 14:30:41 http: TLS handshake error from 127.0.0.1:61297: EOF
2025-12-29 14:30:41.205 [info] 2025/12/29 14:30:41 http: TLS handshake error from 127.0.0.1:61298: EOF
```

or recheck your proxifier rules

Make sure that the "localhost to direct" rule is placed at the top level.

![](https://imgur.com/AGtXifW)