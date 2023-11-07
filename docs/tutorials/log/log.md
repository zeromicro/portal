---
title: 日志
sidebar_label: go-zero 日志
slug: /docs/tutorials/go-zero/log/overview
---

## 概述

go-zero 提供了一个强大的日志包， **logx** 和 **logc** 可以供用户进行日志打印。

## logx 与 logc

这2个包的区别，logc 是对 logx 的封装，我们可以带上 context 进行日志打印。
如下的代码是等效的，

```go
logx.WithContext(ctx).Info("hello world")
logc.Info(ctx, "hello world")
```

## 日志的基本使用

我们提供各种快捷方式供打印日志。如下

```go
	ctx := context.Background()

	logc.Info(ctx, "info message")
	logc.Errorf(ctx, "error message: %d", 123)
	logc.Debugw(ctx, "info filed", logc.Field("key", "value"))
	logc.Slowv(ctx, "object")
```

详情见 [logc](https://github.com/zeromicro/go-zero/blob/master/core/logc/logs.go) 和 [logx](https://github.com/zeromicro/go-zero/blob/master/core/logx/logs.go)

## 日志的初始化与相关的配置

我们提供丰富的日志设置的能力，可以通过配置进行设置，详情见 [日志配置](/docs/tutorials/go-zero/configuration/log)

我们可以通过 如下的方式进行初始化。

```go
logx.MustSetup(logx.LogConf{})
```

## 重定向日志输出

在 go-zero 我们可以重定向日志的输出，
通过如下的方式进行

```go
func SetWriter(w Writer)
```

具体使用例如：

```go
logx.SetWriter(logx.NewWriter(os.Stdout))
```

我们将日志重定向 stdout, 当然也可以封装各自的输出路径。

## 日志级别

go-zero 有2种方式可以设置 level，一种通过配置进行设置，详情见[日志配置](/docs/tutorials/go-zero/configuration/log)

还有一种通过 **logx.SetLevel()** 进行设置。
支持的日志级别如下。

```go
const (
	// DebugLevel logs everything
	DebugLevel uint32 = iota
	// InfoLevel does not include debugs
	InfoLevel
	// ErrorLevel includes errors, slows, stacks
	ErrorLevel
	// SevereLevel only log severe messages
	SevereLevel
)
```

本方法是线程安全的，可以在业务执行的过程中，通过调整日志级别。

## 日志关闭

因为日志打印是异步操作，所以在程序退出的时候，我们需要 close 日志，否则可能会出现日志丢失的情况。

```go
logc.Close()
```

备注，我们在 zrpc，rest 已经操作了日志的关闭.

## 重置日志

在一些特殊的业务流程中，如果我们设置 writer 之后，需要重置 writer，可以使用如下方式进行重置。

```go
logx.Reset()
```

这样，所有的日志将会变成默认的输出模式，如果需要，可以再次自行初始化日志。

## 日志 caller 设置

目前 go-zero 默认会打印当前日志打印的行数。但是我们封装一些方法的时候需要知道上次的调用层次，可以使用 **logx.WithCallerSkip(1)** 设置 caller 的层次。例如：

```go
package main

import (
	"github.com/zeromicro/go-zero/core/logx"
)

func main() {
	exec()
}

func exec() error {
	logx.WithCallerSkip(1).Info("exec info") // {"@timestamp":"2023-04-23T17:30:09.962+08:00","caller":"inherit/main.go:8","content":"exec info","level":"info"}
	return nil
}
```

如上我们可以打印 exec 的位置。。这种对封装方法获取调用特别有效。

## 日志文件分割

go-zero在文件输出模式下面，支持2种文件的分割模式 按照天 和 按照大小进行分割， 详情见[Rotation](/docs/tutorials/go-zero/configuration/log)

在 日期分割模式下面，go-zero 将会每天晚上0点，将 access.log, error.log, stat.log, slow.log 进行备份，并且创建新的日志文件进行日志打印。
同时会判断日志个数，如果超过 KeepDays 的设置，将会移出历史的旧的配置文件。

在 大小分割模式下面，go-zero 将会记录当前日志文件的大小，超过 MaxSize 将会分割日志。
