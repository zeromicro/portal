---
title: Logs
sidebar_label: go-zero log
slug: /docs/tutorials/go-zero/log/overview
---

## Overview

go-zero provides a powerful log package, **logx** and **logc** can be used by users for log printing.

## logx and logc

The difference between these two packages, logc is a packing of logx, and we can use the context to print logs. The following code is equivalent,

```go
logx.WithContext(ctx).Info("hello world")
logc.Info(ctx, "hello world")
```

## Basic Use of Logs

We offer various shortcuts for printing logs.The following is

```go
    ctx := context.Background()

    logc.Info(ctx, "info message")
    logc.Errorf(ctx, "error message: %d", 123)
    logc.Debugw(ctx, "info filed", logc.Field("key", "value"))
    logc.Slowv(ctx, "object")
```

For more information see [logc](https://github.com/zeromicro/go-zero/blob/master/core/logc/logs.go) and [logx](https://github.com/zeromicro/go-zero/blob/master/core/logx/logs.go)

## Logging initialization and associated configuration

We provide rich log setup capability, which can be configured by configuration. For details see [log configuration](/docs/tutorials/go-zero/configuration/log)

We can initialize through the following modalities.

```go
logx.MustSetup(logx.LogConf{})
```

## Redirect Log Output

In go-zero we can redirect the output of the log, to do so as follows.

```go
func SetWriter(w Writer)
```

Specific use such as：

```go
logx.SetWriter(logx.NewWriter(os.Stdout))
```

We redirect the log to stdout, and of course can encapsulate the respective output paths.

## The level of log entry.

go-zero has two ways to set level, one set by configuration, see[log configuration](/docs/tutorials/go-zero/configuration/log)

There is another setting via **logx.SetLevel()** The supported log level is as follows.

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

This method is a secure thread and can be implemented by adjusting log levels during the business execution.

## Log closed

Since log printing is asynchronous, we need to close the log when the program exits, otherwise there may be a loss of the log.

```go
logc.Close()
```

Commentary, we have already closed the log in zrpc,reset

## Reset Log

In some special business processes, if we set the writer to reset the writer and can use the following method.

```go
logx.Reset()
```

In this way, all logs will be turned into default output mode and you can initialize your log again if needed.

## Log caller settings

The number of lines that the go-zero will print the current log by default.When we encapsulate some methods, we need to know the last call level, using **logx.CixCallerSkip(1)** to set the level of the caller, for example:

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

As above we can print exec locations. Such access to encapsulation methods is particularly effective.

## Log File Split

go-zero in file output mode supports split between two files by day and by size. For more information see[Rotation](/docs/tutorials/go-zero/configuration/log)

Under DateSplit mode, go-zero will be backed up by access .log, error.log, stat.log, slow.log and create new log files for log printing. The number of logs will also be judged and will be removed from the old configuration file if more than KeepDays settings.

In size split mode, go-zero will record the size of the current log file, more than MaxSize will split the log.
