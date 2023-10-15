---
title: golang installation
slug: /docs/tasks
---

import DocsCard from '@components/global/DocsCard';
import DocsCards from '@components/global/DocsCards';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Go is a static force type, compiled, co-generated, and programming language with garbage recovery features developed by Google, with Robert Glaismo, Rob Peark and Ken Thompson started designing Go in September 2007, followed by Ian Lance Taylor and Russ Cox joining the project.Go is based on the Inferno operating system.Go was officially launched in November 2009 as an open source project to support Linux, macOS, Windows and other operating systems.

The Go syntax is close to C language, but the statement of variables is different.Go supports garbage recovery features.The parallel computing model for Go is based on the communication sequencing process (CSP) of Easy Hor, and other languages using similar models include Occam and Limbo, which also features in the model such as the transmission of the channel.A parallel construct, such as goroutine and channel, can build a thread, pipe and so on.Open plugin plugin support in version 1.8, which means that some functions can now be loaded dynamically from Go.

In comparison with C++, Go does not include functions such as enumeration, unusual handling, inheritance, generic (added to go.18), assertions, false functions, etc. but adds language level support for slice (Slice) types, co-flowing, piping, garbage recovery, interfaces etc.There is a negative attitude towards the existence of assertions and a defence to the fact that they do not provide a type of inheritance.

Go Website below：

- Google Supported Open Source Language
- Easy to learn, very well suited to team
- Built-in and powerful standard libraries
- Large ecosystems of partners, communities and tools

## 1. Downloads

:::note NOTE
Here we take the `1.19` version as an example, and it is **not recommended** to install a specific version. Developers can choose according to their needs. For more versions, go to [Go to Golang](https://go.dev/dl/) to choose by yourself.
:::

<DocsCards>

<DocsCard
header="Microsoft Windows"
href="https://go.dev/dl/go1.19.4.windows-amd64.msi">
<p>Supported Windows 7 and beyond, Intel 64-bit processor</p>
<a>go1.19.4.windows-amd64.msi（135MB）</a>
</DocsCard>

<DocsCard
header="Apple macOS（ARM64）"
href="https://go.dev/dl/go1.19.4.darwin-arm64.pkg">
<p>Support macOS 11 and later, Apple 64 bit processor</p>
<a>go1.19.4.darwin-arm64.pkg（139MB）</a>
</DocsCard>

<DocsCard
header="Apple macOS（x86-64）"
href="https://go.dev/dl/go1.19.4.darwin-amd64.pkg">
<p>Supported macOS 10.13 and later, 64 bit processor</p>
<a>go1.19.4.darwin-amd64.pkg（145MB）</a>
</DocsCard>

<DocsCard
header="Linux"
href="https://go.dev/dl/go1.19.4.linux-amd64.tar.gz">
<p>Support Linux 2.6.32 and later, Intel 64-bit processor</p>
<a>go1.19.4.linux-amd64.tar.gz（142MB）</a>
</DocsCard>

</DocsCards>

###

Other versions and operating systems can [to go to the official network](https://go.dev/dl/) to choose.

## 2. Installation

<Tabs>
<TabItem value="linux" label="Linux" default>

1. Delete the `/usr/local/go` folder (if available) to remove any previous Go installation and then compress the just downloaded archive to `/usr/local`, Create a new Go directory in `/usr/local/go`：

```bash
$ rm -rf /usr/local/go && tar -C /usr/local -xzf go1.19.4.linux-amd64.tar.gz
```

::NOTE
You may need to be root or run command via sudo
Do not extract the archive to the existing `/usr/local/go` directory.It is well known that this will cause damage to the Go installation.
:::

2. Add `/usr/local/go/bin` to the `PATH` environment.You can perform this action by adding the following lines to `$HOME/.profile` or `/etc/profile` (for the installation of the system scale)：

```bash
$ export PATH=$PATH:/usr/local/go/bin
```

:::note
changes to the configuration file may not be applied until you log in the next computer.To apply changes immediately, simply run shell commands directly or execute them from configuration files using commands such as `source $HOME/.profile`.
:::

3. Open the terminal and type the following command to verify that you are installed：

```bash
$ go version
```

4 . Make sure that the directive has printed the installed version of Go.

</TabItem>

<TabItem value="mac" label="Mac" default>

1. Open your downloaded package file and install Go as prompted.The package installed Go distribution to `/usr/local/go`.The package should put the `/usr/local/go/bin` directory into your `PATH` environment variable.You may need to restart all open terminal sessions for changes to take effect.

:::  2. Open the terminal and type the following command to verify that you are installed

```bash
$ go version
```

3 . Make sure that the directive has printed the installed version of Go.

</TabItem>

<TabItem value="windows" label="Windows" default>

1. Open your downloaded MSI file and install Go as prompted.By default, the installer will install Go to the `Program Files` or ``Program Files (x86)` directory.You can change your location as needed.After installation, you will need to close and reopen all open commands so that changes to the environment made by the installer are reflected in the command prompt.

2. Make sure you have installed Go.

- In Windows, click the "Start" menu.
- Type cmd, then press Enter in the menu search box.
- In the command reminder window, type the following command：

  ```bash
  $ go version
  ```

3. Make sure that the directive has printed the installed version of Go.

</TabItem>
</Tabs>

## 3. Configuration

### 3.1 GO111MODULE ON

After go 1.11, it is recommended that the `GO111MODULE` value be set to `on`in order to avoid unnecessary errors in the follow-up pull dependency.

```bash
$ go env -w GO111MODULE=on
```

### 3.2 Configure Proxy

```bash
$ go env -w GOPROXY=https://goproxy.cn,direct
```

### 3.3 View configuration

```bash
$ go env GO111MODULE
on
$ go env GOPROXY
https://goproxy.cn,direct
```

## References

- <a href="https://zh.wikipedia.org/zh-cn/Go" tagret="_blank">Wikipedia - Go</a>
