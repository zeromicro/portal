---
title: goctl template
slug: /docs/tutorials/cli/template
---

## 概述

模板（Template）是数据驱动生成的基础，所有的代码（rest api、rpc、model、docker、kube）生成都会依赖模板，
默认情况下，模板生成器会选择内存中的模板进行生成，而对于有模板修改需求的开发者来讲，则需要将模板进行落盘，
从而进行模板修改，在下次代码生成时会加载指定路径下的模板进行生成。

## goctl template 指令

```bash
$ goctl template --help
Template operation

Usage:
  goctl template [command]

Available Commands:
  clean       Clean the all cache templates
  init        Initialize the all templates(force update)
  revert      Revert the target template to the latest
  update      Update template of the target category to the latest

Flags:
  -h, --help   help for template


Use "goctl template [command] --help" for more information about a command.
```

### goctl template clean 指令

goctl template clean 用于删除持久化在本地的模板文件。

```bash
$ goctl template clean --help
Clean the all cache templates

Usage:
  goctl template clean [flags]

Flags:
  -h, --help          help for clean
      --home string   The goctl home path of the template
```

### goctl template init 指令

goctl template init 用于初始化模板，会将模板文件存储到本地。

```bash
$ goctl template init --help
Initialize the all templates(force update)

Usage:
  goctl template init [flags]

Flags:
  -h, --help          help for init
      --home string   The goctl home path of the template
```

### goctl template revert 指令

goctl template revert 用于回滚某个分类下的指定的模板文件。

```bash
$ goctl template revert --help
Revert the target template to the latest

Usage:
  goctl template revert [flags]

Flags:
  -c, --category string   The category of template, enum [api,rpc,model,docker,kube]
  -h, --help              help for revert
      --home string       The goctl home path of the template
  -n, --name string       The target file name of template
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 |<img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| category | string | YES | 空字符串 | 模板分类，api\|rpc\|model\|docker\|kube |
| home | string | YES | `${HOME}/.goctl` | 模板存储的文件位置 |
| name | string | YES |  空字符串 | 模板文件名称 |

### goctl template update 指令

goctl template update 用于回滚某个分类下的所有模板文件。

```bash
$ goctl template update --help
Update template of the target category to the latest

Usage:
  goctl template update [flags]

Flags:
  -c, --category string   The category of template, enum [api,rpc,model,docker,kube]
  -h, --help              help for update
      --home string       The goctl home path of the template
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 |<img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| category | string | YES | 空字符串 | 模板分类，api\|rpc\|model\|docker\|kube |
| home | string | YES | `${HOME}/.goctl` | 模板存储的文件位置 |