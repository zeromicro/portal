---
title: Log Usage
slug: /docs/tasks/log/log
---

## Overview
logc and logx are go-Zero log libraries, and we can easily implement log printing.


## Task Targets
1. Learn about the use of the **github.com/zeroicro/go-zero/core/logc** package.

## Simple Log Printing

```go
logc.Info(context.Background(), "hello world")
// {"@timestamp":"2023-04-22T20:35:42.681+08:00","caller":"inherit/main.go:40","content":"hello world","level":"info"}
```

We use logc to print info directly, in which logc, you need to do it, and we will print out information like traceID in ctx.

## Output Log to File

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

This way we can see **logs** folders below the current path and all of our log files in. You can also use **cfg.Path = "/tmp/logs"** to modify the path of the log.

## Additional information in the log

```go
logc.Infow(context.Background(), "hello world", logc.Field("key", "value"))
// {"@timestamp":"2023-04-22T20:48:12.516+08:00","caller":"inherit/main.go:11","content":"hello world","key":"value","level":"info"}
```

We can extend our log using logc.Filed.

## Custom key on log
We can bring some default keys and values on all logs, such as：we want to keep routing information on all api links. We can inject the information into ctx, so the next method will automatically take kv information when printed. Example:

```go
ctx := logx.ContextWithFields(context.Background(), logx.Field("path", "/user/info"))

logc.Infow(ctx, "hello world")
logc.Error(ctx, "error log")
// {"@timestamp":"2023-04-22T20:53:00.593+08:00","caller":"inherit/main.go:13","content":"hello world","level":"info","path":"/user/info"}
// {"@timestamp":"2023-04-22T20:53:00.593+08:00","caller":"inherit/main.go:14","content":"error log","level":"error","path":"/user/info"}
```
