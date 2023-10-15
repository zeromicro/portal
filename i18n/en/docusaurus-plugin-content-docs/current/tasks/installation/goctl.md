---
title: goctl installation
sidebar_label: goctl installation
slug: /docs/tasks/installation/goctl
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DocsCard from '@components/global/DocsCard';
import DocsCards from '@components/global/DocsCards';

## Overview

goctl is a go-zero's built-in handcuffle that is a major lever to increase development efficiency, generating code, document, deploying k8s yaml, dockerfile, etc.

## Golang Direct

::note  
This installation method is used for `Golang`, no operating system is required.
:::

### 1.1 View go version

```bash
go version
```

### 1.2. go [get, install]

- If the go version is before `1.16`, use the following command to install：

  ```bash
  GO111MODULE=on go get -u github.com/zeromicro/go-zero/tools/goctl@latest
  ```

- If the go version is `1.16` and later, use the following command to install：

  ```bash
  GO111MODULE=on go install github.com/zeromicro/go-zero/tools/goctl@latest
  ```

### 1.3. Validation

Open the terminal input below to verify the installation successfully：

```bash
goctl --version
```

## Manual Installation

### 2.1 Downloads

<DocsCards>

<DocsCard
header="Microsoft Windows"
href="https://github.com/zeromicro/go-zero/releases/download/tools%2Fgoctl%2Fv1.4.5/goctl-v1.4.5-windows-amd64.zip">

<p>Windows Intel x86-64 bit processor</p>
<a>goctl-v1.4.3-windows-amd64.zip（14.7MB）</a>
</DocsCard>

<DocsCard
header="Microsoft Windows"
href="https://github.com/zeromicro/go-zero/releases/download/tools%2Fgoctl%2Fv1.4.5/goctl-v1.4.5-windows-386.zip">

<p>Windows Intel x86-32 bit processor</p>
<a>goctl-v1.4.3-windows-386.zip（14MB）</a>
</DocsCard>

<DocsCard
header="Apple macOS（ARM64）"
href="https://github.com/zeromicro/go-zero/releases/download/tools%2Fgoctl%2Fv1.4.5/goctl-v1.4.5-darwin-arm64.tar.gz">

<p>Support macOS Apple 64-bit processor</p>
<a>goctl-v1.4.3-darwin-arm64.tar.gz（14.5MB）</a>
</DocsCard>

<DocsCard
header="Apple macOS（x86-64）"
href="https://github.com/zeromicro/go-zero/releases/download/tools%2Fgoctl%2Fv1.4.5/goctl-v1.4.5-darwin-amd64.tar.gz">

<p>Support macOS 64-bit processor</p>
<a>goctl-v1.4.3-darwin-amd64.tar.gz（14.7MB）</a>
</DocsCard>

<DocsCard
header="Linux"
href="https://github.com/zeromicro/go-zero/releases/download/tools%2Fgoctl%2Fv1.4.3/goctl-v1.4.3-linux-amd64.tar.gz">

<p>Support Linux 64 bit processor</p>
<a>goctl-v1.4.3-linux-amd64.tar.gz（14.8MB）</a>
</DocsCard>

<DocsCard
header="Linux"
href="https://github.com/zeromicro/go-zero/releases/download/tools%2Fgoctl%2Fv1.4.3/goctl-v1.4.3-linux-386.tar.gz">

<p>Support Linux 32 bit processor</p>
<a>goctl-v1.4.3-linux-386.tar.gz（13.9MB）</a>
</DocsCard>

</DocsCards>

###

Other versions and operating systems can [to go to Github](https://github.com/zeromicro/go-zero/releases) to choose.

### 2.2 Installation

Extract downloads and move them to `$GOBIN` directory, see `$GOBIN` directory：

```bash
go env GOPATH
```

`GOBIN` is `$GOPATH/bin`, if you `$GOPATH` do not `$PATH` you need to add it to `$PATH`.

### 2.3. Validation

Once installed, you can perform the following instructions to verify whether you have installed successfully：

```bash
goctl --version
```

## Docker Installation

### 3.1 pull & run

<Tabs>

<TabItem value="amd64" label="amd64架构" default>

```bash
docker pull kevinwan/goctl
docker run --rm -it -v `pwd`:/app kevinwan/goctl goctl --help
```

</TabItem>

<TabItem value="arm64" label="arm64(M1)架构" default>

```bash
docker pull kevinwan/goctl:latest-arm64
docker run --rm -it -v `pwd`:/app kevinwan/goctl:latest-arm64 goctl --help
```

</TabItem>

</Tabs>

### 3.2 Validation

Open the terminal input with the following instructions to verify the installation successfully：

<Tabs>

<TabItem value="amd64" label="amd64架构" default>

```bash
docker run --rm -it -v `pwd`:/app kevinwan/goctl:latest goctl --version
```

</TabItem>

<TabItem value="arm64" label="arm64(M1)架构" default>

```bash
docker run --rm -it -v `pwd`:/app kevinwan/goctl:latest-arm64 goctl --version
```

</TabItem>

</Tabs>
