---
title: goctl rpc
slug: /docs/tutorials/cli/rpc
---

## 概述

goctl rpc 是 goctl 中的核心模块之一，其可以通过 .proto 文件一键快速生成一个 rpc 服务，如果仅仅是启动一个 go-zero 的 rpc 演示项目， 你甚至都不用编码，就可以完成一个 rpc 服务开发及正常运行。在传统的 rpc 项目中，我们要创建各级目录，编写结构体， 定义路由，添加 logic 文件，这一系列操作，如果按照一条协议的业务需求计算，整个编码下来大概需要 5 ～ 6 分钟才能真正进入业务逻辑的编写， 这还不考虑编写过程中可能产生的各种错误，而随着服务的增多，随着协议的增多，这部分准备工作的时间将成正比上升， 而 goctl rpc 则可以完全替代你去做这一部分工作，不管你的协议要定多少个，最终来说，只需要花费 10 秒不到即可完成。

## goctl rpc 指令

```bash
$ goctl rpc --help
Generate rpc code

Usage:
  goctl rpc [flags]
  goctl rpc [command]

Available Commands:
  new         Generate rpc demo service
  protoc      Generate grpc code
  template    Generate proto template

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -h, --help            help for rpc
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --o string        Output a sample proto file
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        	The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure


Use "goctl rpc [command] --help" for more information about a command.
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明           |
| --------------------------- | --------------------------- | --------------------------- | ------------------------- | ------------------------------------- |
| branch                      | string                      | NO                          | 空字符串                  | 模板仓库分支，配合 --remote 使用      |
| home                        | string                      | NO                          | `~/.goctl`                | 模板仓库本地路径，优先级高于 --remote |
| o                           | string                      | NO                          | 空字符串                  | 输出 api 文件                         |
| remote                      | string                      | NO                          | 空字符串                  | 模板仓库远程路径                      |

示例：生成 proto 文件

```bash
$ goctl rpc --o greet.proto
```

### goctl rpc new

快速生成一个 rpc 服务，其接收一个终端参数来指定服务名称。

```bash
$ goctl rpc new --help
Generate rpc demo service

Usage:
  goctl rpc new [flags]

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -h, --help            help for new
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --idea            Whether the command execution environment is from idea plugin.
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        	The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --style string    The file naming format, see [https://github.com/zeromicro/go-zero/tree/master/tools/goctl/config/readme.md] (default "gozero")
  -v, --verbose         Enable log output
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明                                                               |
| --------------------------- | --------------------------- | --------------------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| branch                      | string                      | NO                          | 空字符串                  | 模板仓库分支，配合 --remote 使用                                                          |
| home                        | string                      | NO                          | `~/.goctl`                | 模板仓库本地路径，优先级高于 --remote                                                     |
| idea                        | bool                        | NO                          | false                     | 仅 idea 插件用，终端请忽略此字段                                                          |
| remote                      | string                      | NO                          | 空字符串                  | 模板仓库远程路径                                                                          |
| style                       | string                      | NO                          | gozero                    | 文件命名风格，详情可参考 <a href="/docs/tutorials/cli/style" target="_blank">文件风格</a> |

示例：

```bahs
$ goctl rpc new greet
```

### goctl rpc protoc

根据 protobufer 文件生成 rpc 服务。

```bash
$ goctl rpc protoc --help
Generate grpc code

Usage:
  goctl rpc protoc [flags]

      --branch string     The branch of the remote repo, it does work with --remote
  -c, --client            Whether to generate rpc client (default true)
  -h, --help              help for protoc
      --home string       The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher
 priority
  -m, --multiple          Generated in multiple rpc service mode
      --remote string     The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher
 priority
                          The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure     
      --style string      The file naming format, see [https://github.com/zeromicro/go-zero/blob/master/tools/goctl/config/readme.md]
  -v, --verbose           Enable log output
      --zrpc_out string   The zrpc output directory
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型     | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明                                                   |
|-------------------------|-----------------------------| --------------------------- |------------------------|---------------------------------------------------------------------------|
| branch                  | string                      | NO                          | 空字符串                   | 模板仓库分支，配合 --remote 使用                                                     |
| home                    | string                      | NO                          | `~/.goctl`             | 模板仓库本地路径，优先级高于 --remote                                                   |
| client                  | bool                        | NO                          | true                   | 是否生成客户端代码                                                                 |
| multiple                | bool                        | NO                          | false                  | 是否生成多个 rpc 服务                                                             |
| remote                  | string                      | NO                          | 空字符串                   | 模板仓库远程路径                                                                  |
| style                   | string                      | NO                          | gozero                 | 文件命名风格，详情可参考 <a href="/docs/tutorials/cli/style" target="_blank">文件风格</a> |
| zrpc_out                | string                      | NO                          | 空字符串                   | 输出目录                                                                      |

除了上述参数外，还有支持 protoc 指令的原生参数，详情可参考 <a href="https://developers.google.com/protocol-buffers/docs/reference/go-generated#invocation" target="_blank"> Go Generated Code Guide</a>。

示例：

```bash
# 单个 rpc 服务生成示例指令
$ goctl rpc protoc greet.proto --go_out=./pb --go-grpc_out=./pb --zrpc_out=. --client=true 
# 多个 rpc 服务生成示例指令
$ goctl rpc protoc greet.proto --go_out=./pb --go-grpc_out=./pb --zrpc_out=. --client=true -m
```

:::tip
多个 rpc 服务生成示例（rpc 分组）生成效果可参考 <a href="/docs/tutorials/proto/services/group" target="_blank">服务分组</a>
:::

:::tip 小技能
goctl rpc protoc 指令比较长，参数很多，其实在理解 protoc 用法的前提下，你可以将指令理解成是如下的形式：

goctl rpc ${protoc 用法} --zrpc_out=${output directory}，比如指令 `goctl rpc protoc greet.proto --go_out=./pb --go-grpc_out=./pb --zrpc_out=.`，其中
`protoc greet.proto --go_out=./pb --go-grpc_out=./pb` 完全是 protoc 指令的用法，而 `--zrpc_out=.` 则是 goctl rpc protoc 指令的的参数。
:::

:::caution 注意
goctl rpc protoc 指令生成 rpc 服务对 proto 有一些事项须知：

1. proto 文件中如果有 `import` 语句，goctl 不会对 import 的 proto 文件进行处理，需要自行手动处理。
2. rpc service 中的请求体和响应体必须是当前 proto 文件中的 message，不能是 import 的 proto 文件中的 message。

:::

### goctl rpc template

快速生成一个 proto 模板文件，其接收一个 proto 文件名称参数。

:::caution 注意
该指令已经废弃，推荐使用 `goctl rpc -o` 指令。
:::

```bash
$ goctl rpc template --help
Generate proto template

Usage:
  goctl rpc template [flags]

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -h, --help            help for template
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --o string        Output a sample proto file
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        	The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 | <img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明           |
| --------------------------- | --------------------------- | --------------------------- | ------------------------- | ------------------------------------- |
| branch                      | string                      | NO                          | 空字符串                  | 模板仓库分支，配合 --remote 使用      |
| home                        | string                      | NO                          | `~/.goctl`                | 模板仓库本地路径，优先级高于 --remote |
| o                           | string                      | NO                          | 空字符串                  | 输出文件路径                          |
| remote                      | string                      | NO                          | 空字符串                  | 模板仓库远程路径                      |

示例：

```bash
$ goctl rpc template -o greet.proto
```

## 参考文献

- <a href="/docs/tutorials/cli/style" target="_blank">《文件风格》</a>
- <a href="/docs/tutorials/proto/services/group" target="_blank">《服务分组》</a>
- <a href="https://developers.google.com/protocol-buffers/docs/reference/go-generated#invocation" target="_blank"> 《Go Generated Code Guide》</a>
- <a href="https://protobuf.dev/overview/" target="_blank"> 《Protocol Buffers Documentation》</a>
