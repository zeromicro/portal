---
title: goctl rpc
slug: /docs/tutorials/cli/rpc
---

## Overview

goctl rpc is one of the core modules in goctl, which can quickly generate a rpc service with .proto file, and you can complete a rpc service development and work properly if you only start a rpc demonstration project for go-zero without even encoding.In the traditional rpc project, we create directories at all levels, prepare structures, define routes, add logical files, a series of operations that take approximately 5 to 6 minutes down to actually enter business logic writing if the entire code is calculated according to the business requirements of a deal, without taking into account the errors that may arise in the preparation process, which will increase positively as the number of protocols grow, and goctl rpc will completely replace you to do this part, regardless of how many of your agreements are, and eventually, just 10 seconds to complete.

## goctl rpc directive

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Template repository branch, with --remote usage            |
| home                                                 | string                                              | NO                                             | `~/.goctl`                                         | Template repository local path higher than --remote        |
| o                                                    | string                                              | NO                                             | Empty string                                       | Output api file                                            |
| remote                                               | string                                              | NO                                             | Empty string                                       | Template repository remote path                            |

Example：generates proto file

```bash
$ goctl rpc --o greet.proto
```

### goctl rpc new

Quickly generate a rpc service that receives a terminal parameter to specify the service name.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Template repository branch, with --remote usage            |
| home                                                 | string                                              | NO                                             | `~/.goctl`                                         | Template repository local path higher than --remote        |
| idea                                                 | bool                                                | NO                                             | false                                              | Use this field only for plugins, please ignore this field  |
| remote                                               | string                                              | NO                                             | Empty string                                       | Template repository remote path                            |
| style                                                | string                                              | NO                                             | gozero                                             | Filename style, reference <a href="/docs/tutorials/cli/style" target="_blank">file style</a>         |

Example:

```bahs
$ goctl rpc new greet
```

### goctl rpc protoc

Generate rpc service based on protobefer file.

```bash
$ goctl rpc protoc --help
Generate grpc code

Usage:
  goctl rpc protoc [flags]

Examples:
goctl rpc protoc xx.proto --go_out=./pb --go-grpc_out=./pb --zrpc_out=.

Flags:
      --branch string     The branch of the remote repo, it does work with --remote
  -h, --help              help for protoc
      --home string       The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
  -m, --multiple          Generated in multiple rpc service mode
      --remote string     The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                            The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --style string      The file naming format, see [https://github.com/zeromicro/go-zero/tree/master/tools/goctl/config/readme.md] (default "gozero")
  -v, --verbose           Enable log output
      --zrpc_out string   The zrpc output directory
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Template repository branch, with --remote usage            |
| home                                                 | string                                              | NO                                             | `~/.goctl`                                         | Template repository local path higher than --remote        |
| multiple                                             | bool                                                | NO                                             | false                                              | Whether to generate multiple rpc services                  |
| remote                                               | string                                              | NO                                             | Empty string                                       | Template repository remote path                            |
| style                                                | string                                              | NO                                             | gozero                                             | Filename style, reference <a href="/docs/tutorials/cli/style" target="_blank">file style</a>         |
| zrpc_out                                             | string                                              | NO                                             | Empty string                                       | Output directory                                           |

In addition to the above parameters, there are native arguments that support the protoc directive. See <a href="https://developers.google.com/protocol-buffers/docs/reference/go-generated#invocation" target="_blank"> Go Generated Code Guide</a> for details.

Example:

```bash
# generate rpc code without group
$ goctl rpc protoc greet.proto --go_out=./pb --go-grpc_out=./pb --zrpc_out=.
# generate rpc code with group
$ goctl rpc protoc greet.proto --go_out=./pb --go-grpc_out=./pb --zrpc_out=. -m
```

:::tip
multiple rpc services generate examples (rpc group) with reference <a href="/docs/tutorials/proto/services/group" target="_blank">service group</a>
:::

::tip Small skills  
goctl rpc protoc directives are longer and many parameters are well understood to mean the following form：

goctl rpc ${protoc usage} --zrpc_out=${output directory}, e.g. directive `goctl rpc protoc greet.proto --go_out=./pb --go-grpc_out=./pb --zrpc_out=.`, of which `protoc greet.proto --go_out=./pb --go-grpc_out=./pb` is entirely the usage of protoc directives, but `--zrpc_out=.` is the parameter of the goctl rpc protoc directive.
:::

::caution Note  
goctl rpc protoc protoc generated rpc service with some information about proto：

1. Proto file will not process import proto file and will need to process it manually if there are `import` statements.
2. The requester and response body in rpc service must be the message in the current proto file, not the message in the import file.

:::

### goctl rpc template

Quickly generate a proto template file that receives a proto file name parameter.

::caution takes note of  
the directive has been deprecated, and recommends using `goctl rpc -o`.
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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Template repository branch, with --remote usage            |
| home                                                 | string                                              | NO                                             | `~/.goctl`                                         | Template repository local path higher than --remote        |
| o                                                    | string                                              | NO                                             | Empty string                                       | Output File Path                                           |
| remote                                               | string                                              | NO                                             | Empty string                                       | Template repository remote path                            |

Example:

```bash
$ goctl rpc template -o greet.proto
```

## References

- <a href="/docs/tutorials/cli/style" target="_blank">File Style</a>
- <a href="/docs/tutorials/proto/services/group" target="_blank">Services group</a>
- <a href="https://developers.google.com/protocol-buffers/docs/reference/go-generated#invocation" target="_blank"> Go Generated Code Guide</a>
- <a href="https://protobuf.dev/overview/" target="_blank"> Protocol Buffers Documentation</a>
