---
title: goctl api
slug: /docs/tutorials/cli/api
---

## Overview

goctl api is one of the core modules in goctl, which can quickly generate an api service with the .api file first key. If only an api demonstration project is started, you can complete an api service development and run it without even encoding.In the traditional api project, we will create directories at all levels, write structures, define routes, add logical files, a series of operations that will take between 5 and 6 minutes if the entire coding is calculated in accordance with the business requirements of a protocol to actually enter the preparation of the business log. This does not take into account any errors that may arise in the preparation process, which, as the number of services increases, will take a positive step up as the protocol increases, and goctl api will completely replace you to do this part, regardless of how many of your agreements are, and eventually, only 10 seconds to complete it.

## goctl api directive

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Template repository branch, with --remote usage            |
| home                                                 | string                                              | NO                                             | `~/.goctl`                                         | Template repository local path higher than --remote        |
| o                                                    | string                                              | NO                                             | Empty string                                       | Output api file                                            |
| remote                                               | string                                              | NO                                             | Empty string                                       | Template repository remote path                            |

### dart

Generate date code from api file.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| api                                                  | string                                              | YES                                            | Empty string                                       | api file                                                   |
| dir                                                  | string                                              | YES                                            | Empty string                                       | Generate Code Output Directory                             |
| hostname                                             | string                                              | NO                                             | `go-zero.dev`                                      | host 值                                                     |
| legacy                                               | boolean                                             | NO                                             | `false`                                            | Whether or not older versions                              |

### doc

Generate markdown documentation based on api file.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={200} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| dir                                                  | string                                              | YES                                            | Empty string                                       | api file directory                                         |
| o                                                    | string                                              | NO                                             | Current work dir                                   | Document Output Directory                                  |

### format

Api files in recursive formatting directory.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| declare                                              | boolean                                             | NO                                             | `false`                                            | Whether to detect context                                  |
| dir                                                  | string                                              | YES                                            | Empty string                                       | api file directory                                         |
| iu                                                   | -                                                   | -                                              | -                                                  | Unused fields pending removal                              |
| stdin                                                | boolean                                             | NO                                             | `false`                                            | Format api content for terminal input                      |

### go

Generate Go HTTP code from api file.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                        |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| api                                                  | string                                              | YES                                            | Empty string                                       | api file                                                                                                          |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                           |
| dir                                                  | string                                              | NO                                             | Current working directory                          | Generate Code Output Directory                                                                                    |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                     |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a>                                |

### new

Quickly generate Go HTTP service. Developers need to specify service name parameters at the terminal, output directory as the current working directory.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                        |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                           |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                     |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a>                                |

:::note reminder
goctl api new requires a terminal parameter to specify the name of the service to be generated, output directory to the current work directory, e.g. demo service generated instructions below：

```bash
$ goctl api new demo
```

:::

### plugin

The goctl api plugin command is used to generate code with plugins. Developers need to specify plugin names, parameters, etc. at the terminal.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                         |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| api                                                  | string                                              | YES                                            | Empty string                                       | api file                                                                           |
| dir                                                  | string                                              | NO                                             | Current working directory                          | api file                                                                           |
| plugin                                               | string                                              | YES                                            | Empty string                                       | Path to plugin executable, support local and HTML files                            |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a> |

Plugin resource reference <a href="/docs/reference/goctl/plugins" target="_blank"> goctl plugin resource </a>

### ts

Generate TypeScript code from api file.

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                         |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| api                                                  | string                                              | YES                                            | Empty string                                       | api file                                                                           |
| dir                                                  | string                                              | NO                                             | Current working directory                          | api file                                                                           |
| caller                                               | string                                              | NO                                             | `webapi`                                           | web caller，                                                                        |
| plugin                                               | string                                              | YES                                            | Empty string                                       | Path to plugin executable, support local and HTML files                            |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a> |

### validate

Verify that api files meet the specifications.

```bash
goctl api validate --help
Validate api file

Usage:
  goctl api validate [flags]

Flags:
      --api string   Validate target api file
  -h, --help         help for validate
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------- |
| api                                                  | string                                              | YES                                            | Empty string                                       | api file                                                   |
