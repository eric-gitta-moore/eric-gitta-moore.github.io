---
title: When vue3 vite packages monaco-editor, there are many unnecessary language files, and the packaged files are very confusing. How to simplify and optimize vite vue3 using monaco-editor
subtitle: When vue3 vite packages monaco-editor, there are many unnecessary language files, and the packaged files are very confusing. How to simplify and optimize vite vue3 using monaco-editor
date: 2022-08-15 12:28:08
toc: true
tags: 
categories: 
    - Default
---

# Optimization Method

```javascript
import * as monaco from 'monaco-editor';
// or import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// if shipping only a subset of the features & languages is desired

monaco.editor.create(document.getElementById('container'), {
    value: 'console.log("Hello, world")',
    language: 'javascript'
});
```

Simply replace

> import * as Monaco from 'monaco-editor'

with

> import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'

to achieve this.

Method Source: [https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin#:~:text=if%20shipping%20only%20a%20subset%20of%20the%20features%20%26%20languages%20is%20desired](https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin#:~:text=if%20shipping%20only%20a%20subset%20of%20the%20features%20%26%20languages%20is%20desired)

# Reason

> According to the official documentation,
>
> By default, all languages shipped with the monaco-editor will be included.
>
> By default, monaco editor will include all language files

# Before Optimization Result

```
> vite build --config ./config/vite.config.prod.ts

vite v3.0.4 building for production...                                                                                                                                                                                     12:23:56
✓ 160 modules transformed.                                                                                                                                                                                                 12:24:35
✓ 183 modules transformed.                                                                                                                                                                                                 12:24:36
✓ 186 modules transformed.                                                                                                                                                                                                 12:24:41
✓ 187 modules transformed.                                                                                                                                                                                                 12:24:42
✓ 229 modules transformed.                                                                                                                                                                                                 12:24:46
✓ 6391 modules transformed.                                                                                                                                                                                                12:25:13
dist/assets/logo.b4229389.svg              20.28 KiB                                                                                                                                                                       12:25:18
dist/assets/codicon.c99115f8.ttf           69.12 KiB                                                                                                                                                                       12:25:18
dist/assets/editor.worker.55353356.js      166.90 KiB                                                                                                                                                                      12:25:18  
dist/assets/json.worker.2be2570f.js        292.56 KiB                                                                                                                                                                      12:25:18  
dist/assets/html.worker.3376e5b8.js        602.41 KiB                                                                                                                                                                      12:25:18  
dist/assets/css.worker.1bba75ea.js         901.06 KiB                                                                                                                                                                      12:25:18  
dist/assets/ts.worker.9acd5107.js          4777.10 KiB                                                                                                                                                                     12:25:18  
dist/index.html                            0.68 KiB                                                                                                                                                                        12:25:18  
dist/assets/azcli.4c9b6b47.js              1.07 KiB / gzip: 0.45 KiB                                                                                                                                                       12:25:18  
dist/assets/bat.8a420ace.js                2.04 KiB / gzip: 0.98 KiB                                                                                                                                                       12:25:18  
dist/assets/bicep.5032e09b.js              2.72 KiB / gzip: 1.08 KiB                                                                                                                                                       12:25:18  
dist/assets/apex.4a5ec4a4.js               4.10 KiB / gzip: 1.86 KiB                                                                                                                                                       12:25:18  
dist/assets/cameligo.00bc63f8.js           2.37 KiB / gzip: 1.07 KiB                                                                                                                                                       12:25:18  
dist/assets/coffee.54897858.js             3.75 KiB / gzip: 1.41 KiB                                                                                                                                                       12:25:18  
dist/assets/cpp.337468ce.js                5.56 KiB / gzip: 2.20 KiB                                                                                                                                                       12:25:18  
dist/assets/csp.aec2811b.js                1.63 KiB / gzip: 0.65 KiB                                                                                                                                                       12:25:18  
dist/assets/csharp.01a8eaa8.js             4.66 KiB / gzip: 1.82 KiB                                                                                                                                                       12:25:18  
dist/assets/css.4c22ed20.js                4.64 KiB / gzip: 1.48 KiB                                                                                                                                                       12:25:18  
dist/assets/dockerfile.de6a0f2c.js         2.07 KiB / gzip: 0.79 KiB                                                                                                                                                       12:25:18  
dist/assets/abap.6ba285e6.js               14.07 KiB / gzip: 5.34 KiB                                                                                                                                                      12:25:18  
dist/assets/dart.50deccbd.js               4.39 KiB / gzip: 1.73 KiB                                                                                                                                                       12:25:18  
dist/assets/flow9.c44e3f2e.js              2.01 KiB / gzip: 0.96 KiB                                                                                                                                                       12:25:18  
dist/assets/clojure.bc79377e.js            9.66 KiB / gzip: 3.65 KiB                                                                                                                                                       12:25:18  
dist/assets/ecl.19ccc34b.js                5.46 KiB / gzip: 2.33 KiB                                                                                                                                                       12:25:18  
dist/assets/elixir.a6460ae7.js             9.77 KiB / gzip: 2.55 KiB                                                                                                                                                       12:25:18  
dist/assets/fsharp.d9204eef.js             3.15 KiB / gzip: 1.42 KiB                                                                                                                                                       12:25:18  
dist/assets/go.1e1292ae.js                 2.83 KiB / gzip: 1.25 KiB                                                                                                                                                       12:25:18  
dist/assets/graphql.900d9927.js            2.45 KiB / gzip: 1.13 KiB                                                                                                                                                       12:25:18  
dist/assets/handlebars.37474df0.js         6.85 KiB / gzip: 1.69 KiB                                                                                                                                                       12:25:18  
dist/assets/ini.75848fa5.js                1.32 KiB / gzip: 0.66 KiB                                                                                                                                                       12:25:18  
dist/assets/hcl.c0959a07.js                3.75 KiB / gzip: 1.58 KiB                                                                                                                                                       12:25:18  
dist/assets/html.b86df8d8.js               4.96 KiB / gzip: 1.46 KiB                                                                                                                                                       12:25:18  
dist/assets/javascript.cec1b257.js         1.15 KiB / gzip: 0.60 KiB                                                                                                                                                       12:25:18  
dist/assets/java.13c44e5c.js               3.39 KiB / gzip: 1.50 KiB                                                                                                                                                       12:25:18  
dist/assets/freemarker2.23a5c729.js        15.95 KiB / gzip: 4.15 KiB                                                                                                                                                      12:25:18  
dist/assets/typescript.f4b5ff31.js         5.50 KiB / gzip: 2.21 KiB                                                                                                                                                       12:25:18  
dist/assets/kotlin.3399aeb6.js             3.60 KiB / gzip: 1.57 KiB                                                                                                                                                       12:25:18  
dist/assets/lexon.44f813b3.js              2.62 KiB / gzip: 1.04 KiB                                                                                                                                                       12:25:18  
dist/assets/julia.21f68d09.js              7.29 KiB / gzip: 2.69 KiB                                                                                                                                                       12:25:18  
dist/assets/less.b6aad23a.js               4.04 KiB / gzip: 1.52 KiB                                                                                                                                                       12:25:18  
dist/assets/lua.bbdfa9c0.js                2.31 KiB / gzip: 1.04 KiB                                                                                                                                                       12:25:18  
dist/assets/mips.148d2978.js               2.76 KiB / gzip: 1.19 KiB                                                                                                                                                       12:25:18
dist/assets/m3.92f755b1.js                 2.99 KiB / gzip: 1.41 KiB                                                                                                                                                       12:25:18  
dist/assets/markdown.236ff8ef.js           3.94 KiB / gzip: 1.48 KiB                                                                                                                                                       12:25:18  
dist/assets/liquid.c200d198.js             4.10 KiB / gzip: 1.74 KiB                                                                                                                                                       12:25:18  
dist/assets/objective-c.67633c2a.js        2.59 KiB / gzip: 1.17 KiB                                                                                                                                                       12:25:18  
dist/assets/pascaligo.1c7de3c7.js          2.19 KiB / gzip: 1.03 KiB                                                                                                                                                       12:25:18  
dist/assets/msdax.f39564e2.js              5.04 KiB / gzip: 2.05 KiB                                                                                                                                                       12:25:18  
dist/assets/pascal.c9d19959.js             3.17 KiB / gzip: 1.50 KiB                                                                                                                                                       12:25:18  
dist/assets/pla.c3f817e8.js                1.88 KiB / gzip: 0.77 KiB                                                                                                                                                       12:25:18  
dist/assets/perl.140c1c72.js               8.30 KiB / gzip: 3.16 KiB                                                                                                                                                       12:25:18  
dist/assets/php.a9540a84.js                8.08 KiB / gzip: 2.15 KiB                                                                                                                                                       12:25:18  
dist/assets/mysql.fdc04fe1.js              11.23 KiB / gzip: 4.09 KiB                                                                                                                                                      12:25:18  
dist/assets/powershell.d93de61d.js         3.43 KiB / gzip: 1.47 KiB                                                                                                                                                       12:25:18  
dist/assets/pgsql.1a3b46c8.js              13.33 KiB / gzip: 4.50 KiB                                                                                                                                                      12:25:18  
dist/assets/postiats.8064247a.js           7.91 KiB / gzip: 2.49 KiB                                                                                                                                                       12:25:18  
dist/assets/protobuf.0ea0cf3d.js           9.07 KiB / gzip: 2.15 KiB                                                                                                                                                       12:25:18  
dist/assets/python.ae9bd45d.js             3.74 KiB / gzip: 1.66 KiB                                                                                                                                                       12:25:18  
dist/assets/pug.03a3b993.js                4.96 KiB / gzip: 1.74 KiB                                                                                                                                                       12:25:18  
dist/assets/r.1e4576a7.js                  3.30 KiB / gzip: 1.39 KiB                                                                                                                                                       12:25:18  
dist/assets/qsharp.c08b4fea.js             3.10 KiB / gzip: 1.46 KiB                                                                                                                                                       12:25:18  
dist/assets/powerquery.bc98d188.js         16.78 KiB / gzip: 4.88 KiB                                                                                                                                                      12:25:18  
dist/assets/restructuredtext.992abef6.js   4.04 KiB / gzip: 1.46 KiB                                                                                                                                                       12:25:18  
dist/assets/redis.8da5f515.js              3.71 KiB / gzip: 1.58 KiB                                                                                                                                                       12:25:18  
dist/assets/sb.e7ab3b92.js                 2.03 KiB / gzip: 0.94 KiB                                                                                                                                                       12:25:18  
dist/assets/rust.349e1143.js               4.30 KiB / gzip: 1.91 KiB                                                                                                                                                       12:25:18  
dist/assets/razor.12f90da6.js              8.80 KiB / gzip: 2.35 KiB                                                                                                                                                       12:25:18  
dist/assets/scheme.d835dccb.js             1.97 KiB / gzip: 0.93 KiB                                                                                                                                                       12:25:18  
dist/assets/ruby.71d129bb.js               8.54 KiB / gzip: 2.64 KiB                                                                                                                                                       12:25:18  
dist/assets/scala.ef542eb6.js              7.39 KiB / gzip: 2.17 KiB                                                                                                                                                       12:25:18  
dist/assets/shell.4305d323.js              3.24 KiB / gzip: 1.31 KiB                                                                                                                                                       12:25:18  
dist/assets/sophia.69f82176.js             2.94 KiB / gzip: 1.31 KiB                                                                                                                                                       12:25:18  
dist/assets/scss.19caa34f.js               6.50 KiB / gzip: 1.84 KiB                                                                                                                                                       12:25:18  
dist/assets/st.3f9156a8.js                 7.46 KiB / gzip: 2.31 KiB                                                                                                                                                       12:25:18  
dist/assets/sql.5f2f7ebd.js                10.30 KiB / gzip: 3.89 KiB                                                                                                                                                      12:25:18  
dist/assets/swift.575aa114.js              5.29 KiB / gzip: 2.15 KiB                                                                                                                                                       12:25:18  
dist/assets/sparql.1dcfd6e8.js             2.73 KiB / gzip: 1.27 KiB                                                                                                                                                       12:25:18  
dist/assets/tcl.50105b28.js                3.73 KiB / gzip: 1.47 KiB                                                                                                                                                       12:25:18  
dist/assets/redshift.4a60845d.js           11.76 KiB / gzip: 4.35 KiB                                                                                                                                                      12:25:18  
dist/assets/solidity.212cde55.js           18.40 KiB / gzip: 4.48 KiB                                                                                                                                                      12:25:18  
dist/assets/xml.4337ae7f.js                2.59 KiB / gzip: 1.06 KiB                                                                                                                                                       12:25:18  
dist/assets/twig.74745959.js               6.07 KiB / gzip: 1.62 KiB                                                                                                                                                       12:25:18  
dist/assets/systemverilog.a897e382.js      7.67 KiB / gzip: 2.82 KiB                                                                                                                                                       12:25:18  
dist/assets/yaml.7d8c6ae6.js               3.70 KiB / gzip: 1.33 KiB                                                                                                                                                       12:25:18  
dist/assets/vb.42b9f30d.js                 5.90 KiB / gzip: 2.14 KiB                                                                                                                                                       12:25:18  
dist/assets/tsMode.b126b833.js             21.74 KiB / gzip: 6.27 KiB                                                                                                                                                      12:25:18  
dist/assets/htmlMode.75dc5775.js           33.40 KiB / gzip: 8.79 KiB                                                                                                                                                      12:25:18  
dist/assets/cssMode.64adcf2e.js            32.66 KiB / gzip: 8.65 KiB                                                                                                                                                      12:25:18  
dist/assets/jsonMode.1a7b82cd.js           38.76 KiB / gzip: 10.77 KiB                                                                                                                                                     12:25:18  
dist/assets/monaco.d7562f15.css            79.13 KiB / gzip: 13.34 KiB                                                                                                                                                     12:25:18  
dist/assets/index.2d7343dc.js              161.36 KiB / gzip: 54.37 KiB                                                                                                                                                    12:25:18  
dist/assets/index.1da917fa.css             355.96 KiB / gzip: 74.46 KiB                                                                                                                                                    12:25:18  
dist/assets/core.8989ee89.js               539.72 KiB / gzip: 180.41 KiB                                                                                                                                                   12:25:18
dist/assets/monaco.5273bca9.js             2600.87 KiB / gzip: 659.07 KiB                                                                                                                                                  12:25:18
```



You can see that a bunch of languages have been packaged inside, whether they are used or not

![16936514285391693651428183.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936514285391693651428183.png)


# Effect after optimization

```
> vite build --config ./config/vite.config.prod.ts

vite v3.0.4 building for production...                                                                                                                                                                                     12:15:43
✓ 160 modules transformed.                                                                                                                                                                                                 12:16:21
✓ 185 modules transformed.                                                                                                                                                                                                 12:16:23
✓ 186 modules transformed.                                                                                                                                                                                                 12:16:24
✓ 187 modules transformed.                                                                                                                                                                                                 12:16:24
✓ 229 modules transformed.                                                                                                                                                                                                 12:16:33
✓ 6009 modules transformed.                                                                                                                                                                                                12:16:55
dist/assets/logo.b4229389.svg           20.28 KiB                                                                                                                                                                          12:17:04
dist/assets/codicon.c99115f8.ttf        69.12 KiB                                                                                                                                                                          12:17:04
dist/assets/editor.worker.55353356.js   166.90 KiB                                                                                                                                                                         12:17:04  
dist/assets/json.worker.2be2570f.js     292.56 KiB                                                                                                                                                                         12:17:04  
dist/assets/html.worker.3376e5b8.js     602.41 KiB                                                                                                                                                                         12:17:04  
dist/assets/css.worker.1bba75ea.js      901.06 KiB                                                                                                                                                                         12:17:04  
dist/assets/ts.worker.9acd5107.js       4777.10 KiB                                                                                                                                                                        12:17:04  
dist/index.html                         0.68 KiB                                                                                                                                                                           12:17:04  
dist/assets/monaco.16ea583f.css         79.13 KiB / gzip: 13.36 KiB                                                                                                                                                        12:17:04  
dist/assets/index.f40ca15f.js           161.36 KiB / gzip: 54.37 KiB                                                                                                                                                       12:17:04  
dist/assets/index.1da917fa.css          355.96 KiB / gzip: 74.46 KiB                                                                                                                                                       12:17:04  
dist/assets/core.8989ee89.js            539.72 KiB / gzip: 180.41 KiB                                                                                                                                                      12:17:04
dist/assets/monaco.5c75dc57.js          1730.89 KiB / gzip: 440.94 KiB                                                                                                                                                     12:17:04
```



![16936514445371693651443998.png](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/main/static/images/16936514445371693651443998.png)