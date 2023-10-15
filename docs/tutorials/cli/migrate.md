---
title: goctl migrate
slug: /docs/tutorials/cli/migrate
---

## 概述

goctl migrate 用于 go-zero 从 `tal-tech` 组织迁移到 `zeromicro` 组织。

## goctl migrate 指令

```bash
goctl migrate --help
Migrate is a transition command to help users migrate their projects from tal-tech to zeromicro version

Usage:
  goctl migrate [flags]

Flags:
  -h, --help             help for migrate
  -v, --verbose          Verbose enables extra logging
      --version string   The target release version of github.com/zeromicro/go-zero to migrate (default "v1.3.0")
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| verbose | boolean | NO | false | 是否输出日志 |
| version | string | NO | `v1.3.0` | 从 `tal-tech` 迁移到 `zeromicro` 组织后的目标版本，默认是 `v1.3.0` |

go-zero 的 zeromicro 组织下的 release 版本列表请 <a href="https://github.com/zeromicro/go-zero/releases" target="_blank">点击这里</a> 查看
