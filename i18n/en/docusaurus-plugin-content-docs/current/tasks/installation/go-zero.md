---
title: go-zero installation
sidebar_label: go-zero installation
slug: /docs/tasks/installation/go-zero
---

## Overview

In Golang, we recommend using `go module` to manage.

It is recommended that `GOPROXY`be set up at Golang installation. See <a href="/docs/tasks" target="_blank">golang Installation</a>

## Installation

```bash
$ mkdir <project name> && cd <project name> # project name is specific value
$ go mod init <module name> # module name is specific value
$ github.com/zeromicro/go-zero@latest
```

## FAQ

### 1. After GOROXY is set, dependencies or pull?

Confirm whether `GO111MODULE` is on

```shell
$ go env -w GO111MODULE=on
$ go env -w GOPROXY=https://goproxy.cn,direct
```