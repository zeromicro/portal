---
title: golang 安装
slug: /docs/tasks
---

import DocsCard from '@components/global/DocsCard';
import DocsCards from '@components/global/DocsCards';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

Go 是 Google 开发的一种静态强类型、编译型、并发型，并具有垃圾回收功能的编程语言，其为罗伯特·格瑞史莫、罗勃·派克及肯·汤普逊于 2007 年 9 月开始设计 Go，之后伊恩·兰斯·泰勒（Ian Lance Taylor）、拉斯·考克斯（Russ Cox）加入项目。Go 是基于 Inferno 操作系统所开发的。Go 于 2009 年 11 月正式宣布推出，成为开放源代码项目，支持 Linux、macOS、Windows 等操作系统。

Go 的语法接近 C 语言，但对于变量的声明有所不同。Go 支持垃圾回收功能。Go 的并行计算模型是以东尼·霍尔的通信顺序进程（CSP）为基础，采取类似模型的其他语言包括 Occam 和 Limbo，Go 也具有这个模型的特征，比如通道传输。通过 goroutine 和通道等并行构造可以建造线程池和管道等。在 1.8 版本中开放插件（Plugin）的支持，这意味着现在能从 Go 中动态加载部分函数。

与 C++相比，Go 并不包括如枚举、异常处理、继承、泛型（此功能在 go1.18 中加入）、断言、虚函数等功能，但增加了切片(Slice) 型、并发、管道、垃圾回收、接口等特性的语言级支持。对于断言的存在，则持负面态度，同时也为自己不提供类型继承来辩护。

Go 官网概括如下：

- 谷歌支持的开源编程语言
- 易于学习，非常适合团队
- 内置并发性和强大的标准库
- 合作伙伴、社区和工具的大型生态系统

## 1. 下载

:::note 注意
这里以 `1.19.4` 版本为例子，并 **不推荐** 安装具体版本，开发者可根据需要自行选择，更多版本可前往 [前往官网](https://go.dev/dl/) 自行选择。
:::

<DocsCards>

<DocsCard 
header="Microsoft Windows" 
href="https://go.dev/dl/go1.19.4.windows-amd64.msi" >
<p>支持 Windows 7 及以后，Intel 64 位处理器</p>
<a>go1.19.4.windows-amd64.msi（135MB）</a>
</DocsCard>

<DocsCard 
header="Apple macOS（ARM64）" 
href="https://go.dev/dl/go1.19.4.darwin-arm64.pkg" >
<p>支持 macOS 11 及以后，Apple 64 位处理器</p>
<a>go1.19.4.darwin-arm64.pkg（139MB）</a>
</DocsCard>

<DocsCard 
header="Apple macOS（x86-64）" 
href="https://go.dev/dl/go1.19.4.darwin-amd64.pkg" >
<p>支持 macOS 10.13 及以后，64 位处理器</p>
<a>go1.19.4.darwin-amd64.pkg（145MB）</a>
</DocsCard>

<DocsCard 
header="Linux" 
href="https://go.dev/dl/go1.19.4.linux-amd64.tar.gz" >
<p>支持 Linux 2.6.32 及以后，Intel 64 位处理器</p>
<a>go1.19.4.linux-amd64.tar.gz（142MB）</a>
</DocsCard>

</DocsCards>

###

其他版本及操作系统可 [前往官网](https://go.dev/dl/) 自行选择。

## 2. 安装

<Tabs>
<TabItem value="linux" label="Linux" default>

1. 删除 `/usr/local/go` 文件夹（如果存在）来删除任何以前的 Go 安装，然后将刚刚下载的存档解压缩到 `/usr/local`，在 `/usr/local/go` 中创建一个新的 Go 目录：

```bash
$ rm -rf /usr/local/go && tar -C /usr/local -xzf go1.19.4.linux-amd64.tar.gz
```

:::note 注意
您可能需要以 root 身份或通过 sudo 运行命令
不要将存档解压到现有的 `/usr/local/go` 目录中。众所周知，这会产生损坏的 Go 安装。
:::

2. 将 `/usr/local/go/bin` 添加到 `PATH` 环境变量。您可以通过将以下行添加到 `$HOME/.profile` 或 `/etc/profile`（对于系统范围的安装）来执行此操作：

```bash
$ export PATH=$PATH:/usr/local/go/bin
```

:::note 注意
在您下次登录计算机之前，对配置文件所做的更改可能不会应用。要立即应用更改，只需直接运行 shell 命令或使用诸如 `source $HOME/.profile` 之类的命令从配置文件中执行它们。
:::

3. 打开终端并键入以下命令来验证您是否已安装：

```bash
$ go version
```

4. 确认该指令已经打印了已安装的 Go 版本。

</TabItem>

<TabItem value="mac" label="Mac" default>

1. 打开你下载的包文件，按照提示安装 Go。该软件包将 Go 发行版安装到 `/usr/local/go`。该软件包应将 `/usr/local/go/bin` 目录放入您的 `PATH` 环境变量中。您可能需要重新启动所有打开的终端会话才能使更改生效。

2. 打开终端并键入以下命令来验证您是否已安装：

```bash
$ go version
```

3. 确认该指令已经打印了已安装的 Go 版本。

</TabItem>

<TabItem value="windows" label="Windows" default>

1. 打开您下载的 MSI 文件并按照提示安装 Go。默认情况下，安装程序将安装 Go 到 `Program Files` 或 `Program Files (x86)` 目录。您可以根据需要更改位置。安装后，您需要关闭并重新打开所有打开的命令提示符，以便安装程序对环境所做的更改反映在命令提示符中。

2. 确认您已安装 Go。

- 在 Windows 中，单击“开始”菜单。
- 在菜单的搜索框中，键入 cmd，然后按 Enter 键。
- 在出现的命令提示符窗口中，键入以下命令：

  ```bash
  $ go version
  ```

3. 确认该指令已经打印了已安装的 Go 版本。

</TabItem>
</Tabs>

## 3. 配置

### 3.1 GO111MODULE 开启

在 go 1.11 以后建议将 `GO111MODULE` 值显式设置为 `on`，以免后续拉取依赖出现一些不必要的错误。

```bash
$ go env -w GO111MODULE=on
```

### 3.2 配置 Proxy

```bash
$ go env -w GOPROXY=https://goproxy.cn,direct
```

### 3.3 查看配置

```bash
$ go env GO111MODULE
on
$ go env GOPROXY
https://goproxy.cn,direct
```

## 参考文献

- <a href="https://zh.wikipedia.org/zh-cn/Go" tagret="_blank">《Go•维基百科》</a>
