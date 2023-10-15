---
title: go-zero 安装
sidebar_label: go-zero 安装
slug: /docs/tasks/installation/go-zero
---

## 概述

在 Golang 中，我们推荐使用 `go module` 来管理。

在 Golang 安装时，建议设置了 `GOPROXY`，详情可参考 <a href="/docs/tasks" target="_blank">golang 安装</a>

## 安装

```bash
mkdir <project name> && cd <project name> # project name 为具体值
go mod init <module name> # module name 为具体值
go get -u github.com/zeromicro/go-zero@latest
```

## 常见问题

### 1. 设置了 GOROXY 后，依赖还是拉不下来？

确认 `GO111MODULE` 是否开启

```shell
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
```
