---
title: goctl api
slug: /docs/tutorials/cli/api
---

## 概述

goctl api 是 goctl 中的核心模块之一，其可以通过 .api 文件一键快速生成一个 api 服务，如果仅仅是启动一个 go-zero 的 api 演示项目， 你甚至都不用编码，就可以完成一个 api 服务开发及正常运行。在传统的 api 项目中，我们要创建各级目录，编写结构体， 定义路由，添加 logic 文件，这一系列操作，如果按照一条协议的业务需求计算，整个编码下来大概需要 5 ～ 6 分钟才能真正进入业务逻辑的编写， 这还不考虑编写过程中可能产生的各种错误，而随着服务的增多，随着协议的增多，这部分准备工作的时间将成正比上升， 而 goctl api 则可以完全替代你去做这一部分工作，不管你的协议要定多少个，最终来说，只需要花费 10 秒不到即可完成。

## goctl api 指令

```bash
$ goctl api --help
Generate api related files

Usage:
  goctl api [flags]
  goctl api [command]

Available Commands:
  dart        Generate dart files for provided api in api file
  doc         Generate doc files
  format      Format api files
  go          Generate go files for provided api in api file
  kt          Generate kotlin code for provided api file
  new         Fast create api service
  plugin      Custom file generator
  ts          Generate ts files for provided api in api file
  validate    Validate api file

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -h, --help            help for api
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --o string        Output a sample api file
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure


Use "goctl api [command] --help" for more information about a command.
```

### dart

根据 api 文件生成 dart 代码。

```bash
$ goctl api dart --help
Generate dart files for provided api in api file

Usage:
  goctl api dart [flags]

Flags:
      --api string        The api file
      --dir string        The target dir
  -h, --help              help for dart
      --hostname string   hostname of the server
      --legacy            Legacy generator for flutter v1
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 |<img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| api | string | YES | 空字符串 | api 文件 |
| dir | string | YES | 空字符串 | 生成代码输出目录 |
| hostname | string | NO | `go-zero.dev` | host 值 |
| legacy | boolean | NO | `false` | 是否旧版本 |

### doc

根据 api 文件生成 markdown 文档。

```bash
$ goctl api doc --help
Generate doc files

Usage:
  goctl api doc [flags]

Flags:
      --dir string   The target dir
  -h, --help         help for doc
      --o string     The output markdown directory
```
| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={200}/> 参数说明 |
| --- | --- | --- | --- | --- |
| dir | string | YES | 空字符串 | api 文件所在目录 |
| o | string | NO | 当前 work dir | 文档输出目录 |

### format

递归格式化目录下的 api 文件。

```bash
$ goctl api format --help
Format api files

Usage:
  goctl api format [flags]

Flags:
      --declare      Use to skip check api types already declare
      --dir string   The format target dir
  -h, --help         help for format
      --iu           Ignore update
      --stdin        Use stdin to input api doc content, press "ctrl + d" to send EOF
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| declare | boolean | NO | `false` | 是否检测上下文 |
| dir | string | YES | 空字符串 | api 所在目录 |
| iu | - | - | - | 未使用字段，待移出 |
| stdin | boolean | NO | `false` | 是否格式化终端输入的 api 内容 |

### go

根据 api 文件生成 Go HTTP 代码。

```bash
$ goctl api go --help
Generate go files for provided api in api file

Usage:
  goctl api go [flags]

Flags:
      --api string      The api file
      --branch string   The branch of the remote repo, it does work with --remote
      --dir string      The target dir
  -h, --help            help for go
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --style string    The file naming format, see [https://github.com/zeromicro/go-zero/blob/master/tools/goctl/config/readme.md] (default "gozero")
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| api | string | YES |  空字符串 | api 文件路径 |
| branch | string | NO | 空字符串 | 远程模板所在 git 分支名称，仅当 `remote` 有值时使用 |
| dir | string | NO | 当前工作目录 | 代码输出目录 |
| home | string | NO | `${HOME}/.goctl` | 本地模板文件目录 |
| remote | string | NO | 空字符串 | 远程模板所在 git 仓库地址，当此字段传值时，优先级高于 `home` 字段值 |
| style | string | NO | `gozero` | 输出文件和目录的命名风格格式化符号，详情见<a href="/docs/tutorials/cli/style" target="_blank"> 文件风格</a> |

### new

快速生成 Go HTTP 服务，开发者需要在终端指定服务名称参数，输出目录为当前工作目录。

```bash
$ goctl api new --help
Fast create api service

Usage:
  goctl api new [flags]

Examples:
goctl api new [options] service-name

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -h, --help            help for new
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        	The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --style string    The file naming format, see [https://github.com/zeromicro/go-zero/blob/master/tools/goctl/config/readme.md] (default "gozero")
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| branch | string | NO | 空字符串 | 远程模板所在 git 分支名称，仅当 `remote` 有值时使用 |
| home | string | NO | `${HOME}/.goctl` | 本地模板文件目录 |
| remote | string | NO | 空字符串 | 远程模板所在 git 仓库地址，当此字段传值时，优先级高于 `home` 字段值 |
| style | string | NO | `gozero` | 输出文件和目录的命名风格格式化符号，详情见<a href="/docs/tutorials/cli/style" target="_blank"> 文件风格</a> |

:::note 温馨提示
goctl api new 需要一个终端参数来指定需要生成的服务名称，输出目录为当前工作目录，如 demo 服务生成的指令示例如下：

```bash
$ goctl api new demo
```

:::

### plugin

goctl api plugin 命令用于引用插件生成代码，开发者需要在终端指定插件名称、参数等信息。

```bash
$ goctl api plugin --help
Custom file generator

Usage:
  goctl api plugin [flags]

Flags:
      --api string      The api file
      --dir string      The target dir
  -h, --help            help for plugin
  -p, --plugin string   The plugin file
      --style string    The file naming format, see [https://github.com/zeromicro/go-zero/tree/master/tools/goctl/config/readme.md]
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| api | string | YES | 空字符串 | api 文件路径 |
| dir | string | NO | 当前工作目录 | api 文件路径 |
| plugin | string | YES | 空字符串 | 插件可执行文件所在路径，支持本地和 http 文件 |
| style | string | NO | `gozero` | 输出文件和目录的命名风格格式化符号，详情见<a href="/docs/tutorials/cli/style" target="_blank"> 文件风格</a> |

### ts

根据 api 文件生成 TypeScript 代码。

```bash
$ goctl api ts --help
Generate ts files for provided api in api file

Usage:
  goctl api ts [flags]

Flags:
      --api string      The api file
      --caller string   The web api caller
      --dir string      The target dir
  -h, --help            help for ts
      --unwrap          Unwrap the webapi caller for import
      --webapi string   The web api file path
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| api | string | YES | 空字符串 | api 文件路径 |
| dir | string | NO | 当前工作目录 | api 文件路径 |
| caller | string | NO | `webapi` |  web caller， |
| plugin | string | YES | 空字符串 | 插件可执行文件所在路径，支持本地和 http 文件 |
| style | string | NO | `gozero` | 输出文件和目录的命名风格格式化符号，详情见<a href="/docs/tutorials/cli/style" target="_blank"> 文件风格</a> |

### validate

校验 api 文件是否符合规范。

```bash
goctl api validate --help
Validate api file

Usage:
  goctl api validate [flags]

Flags:
      --api string   Validate target api file
  -h, --help         help for validate
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| api | string | YES | 空字符串 | api 文件路径 |
