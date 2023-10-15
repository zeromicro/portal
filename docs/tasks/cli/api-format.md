---
title: api 文件格式化
slug: /docs/tasks/cli/api-format
---

## 概述

在 api 文件编写完之后，我们的 api 内容参差不齐，就有如下内容：

```go
syntax= "v1"

info(
key1:value1
key2:value2
longkey:longvalue
)

type Foo {
  Bar string
    Baz int
}
```

这样的 api 文件不利于阅读，我们可以使用 `goctl api format` 命令对 api 文件进行格式化。

## 任务目标

1. 熟悉 goctl api format 命令的使用
1. 了解 goctl api format 命令的功能

## 准备条件

1. <a href="/docs/tasks/installation/goctl" target="_blank">完成 goctl 安装</a>

## 格式化 api 文件

1. 创建 api 文件，将如下内容拷贝到 `demo.api` 文件中：

    ```go
    syntax = "v1"

    type User {
        Id int64 `json:"id"`
        Name string `json:"name"`
        Age int `json:"age"`
        Description string `json:"description"`
    }

    type Student {
        Id int64 `json:"id"`
        No int64 `json:"no"`
        Name string `json:"name"`
        Age int `json:"age"`
        Description string `json:"description"`
    }

    service User {
        @handler ping
        get /ping
    }
    ```

1. 创建工作空间和目录

    ```bash
    mkdir -p ~/workspace/api/format
    ```

1. 将上文中的 `demo.api` 文件拷贝到 `~/workspace/api/format` 目录下

1. 格式化 api 文件

    ```bash
    cd ~/workspace/api/format
    goctl api format --dir demo.api
    ```

1. 查看格式化后的 api 文件

    ```bash
    syntax = "v1"

    type User {
        Id          int64  `json:"id"`
        Name        string `json:"name"`
        Age         int    `json:"age"`
        Description string `json:"description"`
    }

    type Student {
        Id          int64  `json:"id"`
        No          int64  `json:"no"`
        Name        string `json:"name"`
        Age         int    `json:"age"`
        Description string `json:"description"`
    }

    service User {
        @handler ping
        get /ping
    }
    ```
