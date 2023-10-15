---
title: protoc installation
slug: /docs/tasks/installation/protoc
---

import DocsCard from '@components/global/DocsCard';
import DocsCards from '@components/global/DocsCards';

## Overview

<a href="https://protobuf.dev/" target="_blank">protoc</a> is a tool to generate code based on proto files that generate code in multiple languages such as C++, Java, Python, Go, PHP, etc. while gRPC code generation depends on <a href="https://github.com/golang/protobuf/tree/master/protoc-gen-go" target="_blank">protocol-gen-go</a>,<a href="https://pkg.go.dev/google.golang.org/grpc/cmd/protoc-gen-go-grpc" target="_blank">protocol-gen-go-grpc</a> plugin for gRPC code generation in Go language.

## 1. one-click Installation (recommended)

You can install with `goctl` one click installation `protocol`,`protocol-gen-go`,`protocol-gen-go-grpc` related components, you can execute the following command：

```bash
$ goctl env check --install --verbose --force
```

For more information about `goctl env` instructions, refer to <a href="/docs/tutorials/cli/env" target="_blank">goctl env</a>

## 2. Manual installation

### 2.1 Downloads

:::note NOTE
Here we take the `21.11` version as an example, and it is **not recommended** to install a specific version. Developers can choose according to their needs. For more versions, go to [Go to Github](https://github.com/protocolbuffers/protobuf/releases) to choose by yourself.
:::

<DocsCards>

<DocsCard
header="Microsoft Windows"
href="https://github.com/protocolbuffers/protobuf/releases/download/v21.11/protoc-21.11-win64.zip">
    <p>Windows Intel x86-64 bit processor</p>
    <a>protoc-21.11-win64.zip（2.17MB）</a>
</DocsCard>

<DocsCard
header="Microsoft Windows"
href="https://github.com/protocolbuffers/protobuf/releases/download/v21.11/protoc-21.11-win32.zip">
    <p>Windows Intel x86-32 bit processor</p>
    <a>protoc-21.11-win32.zip（2.2MB）</a>
</DocsCard>

<DocsCard
header="Apple macOS（ARM64）"
href="https://github.com/protocolbuffers/protobuf/releases/download/v21.11/protoc-21.11-osx-aarch_64.zip">
    <p>Support macOS Apple 64-bit processor</p>
    <a>protoc-21.11-osx-aarch_64.zip（1.3MB）</a>
</DocsCard>

<DocsCard
header="Apple macOS（x86-64）"
href="https://github.com/protocolbuffers/protobuf/releases/download/v21.11/protoc-21.11-osx-x86_64.zip">
    <p>Support macOS 64-bit processor</p>
    <a>protoc-21.11-osx-x86_64.zip（1.42MB）</a>
</DocsCard>

<DocsCard
header="Linux"
href="https://github.com/protocolbuffers/protobuf/releases/download/v21.11/protoc-21.11-linux-x86_64.zip">
    <p>Support Linux 64 bit processor</p>
    <a>protoc-21.11-linux-x86_64.zip（1.51MB）</a>
</DocsCard>

<DocsCard
header="Linux"
href="https://github.com/protocolbuffers/protobuf/releases/download/v21.11/protoc-21.11-linux-x86_32.zip">
    <p>Support Linux 32 bit processor</p>
    <a>protoc-21.11-linux-x86_32.zip（1.61MB）</a>
</DocsCard>

</DocsCards>

Other versions and operating systems can [to go to Github](https://github.com/protocolbuffers/protobuf/releases) to choose.

### 2.2 Installation

Extract downloads and move them to `$GOBIN` directory, see `$GOBIN` directory：

```bash
$ go env GOPATH
```

`GOBIN` is `$GOPATH/bin`, if you `$GOPATH` do not `$PATH` you need to add it to `$PATH`.

## 3. Validation

Once installed, you can perform the following instructions to verify whether you have installed successfully：

```bash
$ goctl env check --verbose
[goctl-env]: preparing to check env

[goctl-env]: looking up "protoc"
[goctl-env]: "protoc" is installed

[goctl-env]: looking up "protoc-gen-go"
[goctl-env]: "protoc-gen-go" is installed

[goctl-env]: looking up "protoc-gen-go-grpc"
[goctl-env]: "protoc-gen-go-grpc" is installed

[goctl-env]: congratulations! your goctl environment is ready!
```
