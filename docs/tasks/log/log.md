---
title: 日志使用
sidebar_label: go-zero 安装
slug: /docs/tasks/log/log
---

## 概述
logc 和 logx 是 go-zero 的日志库，我们可以轻松实现日志的打印的能里。


## 任务目标
1. 了解 **github.com/zeromicro/go-zero/core/logc** 包的使用。

## 简单的日志打印

```go
logc.Info(context.Background(), "hello world")
// {"@timestamp":"2023-04-22T20:35:42.681+08:00","caller":"inherit/main.go:40","content":"hello world","level":"info"}
```

我们直接使用 logc 进行 info 的日志打印，其中 logc，是需要带上 conext 的，我们会将 ctx 中的 traceID 等信息也打印出来。

## 输出日志到文件

```go
package main

import (
	"context"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/logc"
	"github.com/zeromicro/go-zero/core/logx"
)

func main() {
	var cfg logx.LogConf
	_ = conf.FillDefault(&cfg)
	cfg.Mode = "file"

	logc.MustSetup(cfg)
	defer logc.Close()
	logc.Info(context.Background(), "hello world")
}

```

这样我们就可以在当前的路径下面看到 **logs** 文件夹，里面就有我们的所有日志文件。
当然你也可以使用 **cfg.Path = "/tmp/logs"** 修改日志的路径。

## 日志中带上额外信息

```go
logc.Infow(context.Background(), "hello world", logc.Field("key", "value"))
// {"@timestamp":"2023-04-22T20:48:12.516+08:00","caller":"inherit/main.go:11","content":"hello world","key":"value","level":"info"}
```

我们尅通过 logc.Filed 对我们的日志进行扩展。

## 日志带上自定义的key
我们可以在所有的日志上面带上一些默认的 key和value，例如：我们希望在 api 所有链路上面都带上 路由信息，我们可以将信息注入到ctx中，这样后面的方法在打印的时候就会自动带上 kv 信息。
例如：

```go
ctx := logx.ContextWithFields(context.Background(), logx.Field("path", "/user/info"))

logc.Infow(ctx, "hello world")
logc.Error(ctx, "error log")
// {"@timestamp":"2023-04-22T20:53:00.593+08:00","caller":"inherit/main.go:13","content":"hello world","level":"info","path":"/user/info"}
// {"@timestamp":"2023-04-22T20:53:00.593+08:00","caller":"inherit/main.go:14","content":"error log","level":"error","path":"/user/info"}
```
