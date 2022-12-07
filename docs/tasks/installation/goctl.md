---
title: goctl 安装
sidebar_label: goctl 安装
slug: /docs/tasks/installation/goctl
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

goctl 是 go-zero 的内置开发工具，是提升开发效率的一大利器，可以一键生成代码、文档、部署 k8s yaml、dockerfile 等，所以让我们先来安装 goctl。

<Tabs>
<TabItem value="go" label="Go" default>

```go
# for Go 1.15 and earlier
GO111MODULE=on go get -u github.com/zeromicro/go-zero/tools/goctl@latest

# for Go 1.16 and later
go install github.com/zeromicro/go-zero/tools/goctl@latest
```

</TabItem>

<TabItem value="macOS" label="MacOS" default>

```shell
brew install goctl
```

</TabItem>

<TabItem value="docker" label="Docker" default>

```shell
# docker for amd64 architecture
docker pull kevinwan/goctl
# run goctl like
docker run --rm -it -v `pwd`:/app kevinwan/goctl goctl --help

# docker for arm64 (M1) architecture
docker pull kevinwan/goctl:latest-arm64
# run goctl like
docker run --rm -it -v `pwd`:/app kevinwan/goctl:latest-arm64 goctl --help
```
</TabItem>
</Tabs>

验证安装成功:

```shell
$ goctl --version
goctl version 1.4.2 darwin/amd64
```

```shell
goctl  docker run --rm -it -v `pwd`:/app kevinwan/goctl:latest goctl --version
goctl version 1.4.2 darwin/amd64
```
