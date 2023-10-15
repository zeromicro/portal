---
title: goctl env
slug: /docs/tutorials/cli/env
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

goctl env 可以快速检测 goctl 的依赖环境，如果你的环境中缺少了 goctl 的依赖环境，goctl env 会给出相应的提示，当然，你可以可以通过 goctl env install 命令来安装缺失的依赖环境。

## goctl env 指令

```bash
$ goctl env --help
Check or edit goctl environment

Usage:
  goctl env [flags]
  goctl env [command]

Available Commands:
  check       Detect goctl env and dependency tools
  install     Goctl env installation

Flags:
  -f, --force           Silent installation of non-existent dependencies
  -h, --help            help for env
  -v, --verbose         Enable log output
  -w, --write strings   Edit goctl environment


Use "goctl env [command] --help" for more information about a command.
```

### goctl env check 指令

goctl env check 指令用于快速检测 goctl 的依赖环境是否准备好，如果你的环境中缺少了 goctl 的依赖环境，goctl env check 会给出相应的提示。

```bash
$ goctl env check --help
Detect goctl env and dependency tools

Usage:
  goctl env check [flags]

Flags:
  -h, --help      help for check
  -i, --install   Install dependencies if not found


Global Flags:
  -f, --force     Silent installation of non-existent dependencies
  -v, --verbose   Enable log output
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 |<img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| i | boolean | NO | false | 安装依赖组件 |
| force | boolean | NO | false | 静默安装组件，如果false，则安装每个组件前会弹出安装确认选项 |
| verbose | boolean | NO | false |  是否输出执行日志 |

**示例示例**：

示例 1： 检测 goctl 依赖环境

<Tabs>

<TabItem value="ready" label="goctl 环境依赖已经安装" default>

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

</TabItem>

<TabItem value="no ready" label="goctl 环境依赖未安装" default>

```bash
$ goctl env check --verbose
[goctl-env]: preparing to check env

[goctl-env]: looking up "protoc"
[goctl-env]: "protoc" is not found in PATH

[goctl-env]: looking up "protoc-gen-go"
[goctl-env]: "protoc-gen-go" is not found in PATH

[goctl-env]: looking up "protoc-gen-go-grpc"
[goctl-env]: "protoc-gen-go-grpc" is not found in PATH

[goctl-env]: check env finish, some dependencies is not found in PATH, you can execute
command 'goctl env check --install' to install it, for details, please execute command
'goctl env check --help'
```

</TabItem>
</Tabs>

示例 2： 检测 goctl 依赖环境并安装缺失的依赖环境

<Tabs>

<TabItem value=" force" label="不静默安装" default>

```bash
$ goctl env check --verbose --install
[goctl-env]: preparing to check env

[goctl-env]: looking up "protoc"
[goctl-env]: "protoc" is not found in PATH
[goctl-env]: do you want to install "protoc" [y: YES, n: No]
y
[goctl-env]: preparing to install "protoc"
[goctl-env]: "protoc" is already installed in "/Users/keson/go/bin/protoc"

[goctl-env]: looking up "protoc-gen-go"
[goctl-env]: "protoc-gen-go" is not found in PATH
[goctl-env]: do you want to install "protoc-gen-go" [y: YES, n: No]
y
[goctl-env]: preparing to install "protoc-gen-go"
"protoc-gen-go" installed from cache
[goctl-env]: "protoc-gen-go" is already installed in "/Users/keson/go/bin/protoc-gen-go"

[goctl-env]: looking up "protoc-gen-go-grpc"
[goctl-env]: "protoc-gen-go-grpc" is not found in PATH
[goctl-env]: do you want to install "protoc-gen-go-grpc" [y: YES, n: No]
y
[goctl-env]: preparing to install "protoc-gen-go-grpc"
"protoc-gen-go-grpc" installed from cache
[goctl-env]: "protoc-gen-go-grpc" is already installed in "/Users/keson/go/bin/protoc-gen-go-grpc"

[goctl-env]: congratulations! your goctl environment is ready!
```

</TabItem>

<TabItem value="check" label="静默安装" default>

```bash
$ goctl env check --verbose --install --force
[goctl-env]: preparing to check env

[goctl-env]: looking up "protoc"
[goctl-env]: "protoc" is not found in PATH
[goctl-env]: preparing to install "protoc"
"protoc" installed from cache
[goctl-env]: "protoc" is already installed in "/Users/keson/go/bin/protoc"

[goctl-env]: looking up "protoc-gen-go"
[goctl-env]: "protoc-gen-go" is not found in PATH
[goctl-env]: preparing to install "protoc-gen-go"
"protoc-gen-go" installed from cache
[goctl-env]: "protoc-gen-go" is already installed in "/Users/keson/go/bin/protoc-gen-go"

[goctl-env]: looking up "protoc-gen-go-grpc"
[goctl-env]: "protoc-gen-go-grpc" is not found in PATH
[goctl-env]: preparing to install "protoc-gen-go-grpc"
"protoc-gen-go-grpc" installed from cache
[goctl-env]: "protoc-gen-go-grpc" is already installed in "/Users/keson/go/bin/protoc-gen-go-grpc"

[goctl-env]: congratulations! your goctl environment is ready!
```

</TabItem>
</Tabs>

### goctl env install 指令

goctl env install 指令其实和 goctl env check --install 的功能是一样的。

```bash
$ goctl env install --help
Goctl env installation

Usage:
  goctl env install [flags]

Flags:
  -h, --help   help for install


Global Flags:
  -f, --force     Silent installation of non-existent dependencies
  -v, --verbose   Enable log output
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 |<img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| force | boolean | NO | false | 静默安装组件，如果false，则安装每个组件前会弹出安装确认选项 |
| verbose | boolean | NO | false |  是否输出执行日志 |
