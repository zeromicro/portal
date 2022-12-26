---
title: 从 Goland 创建
slug: /docs/tasks/create/project/from/goland
---

## 概述

我们在完成 Golang 安装后，可以正式进入 golang 开发了，目前比较主流的两款编辑器是 Goland 和 VSCode，本文将介绍如何使用 Goland 创建一个 golang 项目。

Goland 下载请参考 [Goland 官网](https://www.jetbrains.com/go/)。

:::note 温馨提示
当前文档演示的 Goland 版本为 `GoLand 2022.1.4`，如果你的 Goland 版本不一致，可能会有所差异。
:::


## 创建项目

打开 Goland，点击 `New Project`，选择 `Go`，填写项目名称，点击 `Create` 创建工程。

![create from goland](../../resource/tasks/create/create-from-goland.png)


![create from goland](../../resource/tasks/create/create-from-goland-main.png)
<center> 从 Goland 创建 Golang 工程</center>

## 新建 main.go

在工程名称 `helloworld` 上右键，选择 `New`，选择 `Go File`，输入文件名称 `main`，回车。

![create from goland](../../resource/tasks/create/create-main-from-goland.png)


![create from goland](../../resource/tasks/create/create-main-from-goland2.png)
<center> 创建 main.go 文件</center>

在 `main.go` 中输入以下代码：

```go
package main

import "fmt"

func main() {
	fmt.Println("hello world!")
}

```

![create from goland](../../resource/tasks/create/create-main-from-goland3.png)
<center> 创建 main.go 文件</center>

## 运行程序

在 Goland 中，有多种方法可以启动程序：

1. 在 `main.go` 文件上右键，选择 `Run go build main.go`，即可运行程序。
![run in goland](../../resource/tasks/create/run-in-goland1.png)
![run in goland](../../resource/tasks/create/run-result-in-goland1.png)
<center>从下文菜单运行 Go 程序</center>

1. 在 `main.go` 文件内容面板中，找到第 5 行代码 `func main() {` 左边的三角符号，点击运行即可。
![run in goland](../../resource/tasks/create/run-in-goland2.png)
![run in goland](../../resource/tasks/create/run-result-in-goland2.png)
<center>从启动按钮运行 Go 程序</center>

1. 在 `main.go` 文件上右键，选择 `Open In`，然后选择 `Terminal`，即可打开终端，然后输入如下指令运行即可。

    ```bash
    $ go run main.go
    ```
    ![run in goland](../../resource/tasks/create/run-in-goland3.png)
    ![run in goland](../../resource/tasks/create/run-result-in-goland3.png)
    <center>从终端运行 Go 程序</center>
