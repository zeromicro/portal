---
title: goctl env
slug: /docs/tutorials/cli/env
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

goctl env can quickly detect goctl dependency. If your environment is missing a goctl dependency, goctl env will give it a reminder and you can of course install missing dependencies via the goctl env install command.

## goctl env directive

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

### goctl env check directive

The goctl env check instructions are ready to quickly detect goctl dependency. If your environment is missing goctl, goctl env check gives a reminder accordingly.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                                  |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| i                                                    | boolean                                             | NO                                             | false                                              | Install Dependencies                                                                                                        |
| force                                                | boolean                                             | NO                                             | false                                              | Silent Installing components. If false, each component will eject the installation confirmation option before installing it |
| verbose                                              | boolean                                             | NO                                             | false                                              | Export execution log                                                                                                        |

**Example**：

Example 1： detect goctl dependencies

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

Example 2： detect goctl dependencies and install missing dependencies

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

### goctl env install directive

The goctl env install command has the same function as goctl env checkk --install.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                                  |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| force                                                | boolean                                             | NO                                             | false                                              | Silent Installing components. If false, each component will eject the installation confirmation option before installing it |
| verbose                                              | boolean                                             | NO                                             | false                                              | Export execution log                                                                                                        |