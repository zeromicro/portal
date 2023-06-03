---
title: Log Configuration
sidebar_label: Log Configuration
slug: /docs/tutorials/go-zero/configuration/log
---

## Log Overview

[LogConf](https://github.com/zeromicro/go-zero/blob/master/core/logx/config.go#L4) for our log configuration,**logx.MustSetup**provides the basic configuration capability for our log, using the following simple methods：

```go
var c logc.LogConf
logc.MustSetup(c)

logc.Info(context.Background(), "log")
// do your job
```

Our log is referenced by serviceConf and will be automatically initialized when the service is started.

## Definition of parameters

LogConf configuration definition below：

```go
package logx

// A LogConf is a logging config.
type LogConf struct {
    ServiceName         string `json:",optional"`
    Mode                string `json:",default=console,options=[console,file,volume]"`
    Encoding            string `json:",default=json,options=[json,plain]"`
    TimeFormat          string `json:",optional"`
    Path                string `json:",default=logs"`
    Level               string `json:",default=info,options=[debug,info,error,severe]"`
    MaxContentLength    uint32 `json:",optional"`
    Compress            bool   `json:",optional"`
    Stat                bool   `json:",default=true"` // go-zero 版本 >= 1.5.0 才支持
    KeepDays            int    `json:",optional"`
    StackCooldownMillis int    `json:",default=100"`
    // MaxBackups represents how many backup log files will be kept. 0 means all files will be kept forever.
    // Only take effect when RotationRuleType is `size`.
    // Even thougth `MaxBackups` sets 0, log files will still be removed
    // if the `KeepDays` limitation is reached.
    MaxBackups int `json:",default=0"`
    // MaxSize represents how much space the writing log file takes up. 0 means no limit. The unit is `MB`.
    // Only take effect when RotationRuleType is `size`
    MaxSize int `json:",default=0"`
    // RotationRuleType represents the type of log rotation rule. Default is `daily`.
    // daily: daily rotation.
    // size: size limited rotation.
    Rotation string `json:",default=daily,options=[daily,size]"`
}

```

| Params              | DataType | Default value | Note                                                                                    | Enum Values             |
| ------------------- | -------- | ------------- | --------------------------------------------------------------------------------------- | ----------------------- |
| ServiceName         | string   |               | Service Name                                                                            |                         |
| Mode                | string   | console       | Log Printing Mode, console Console                                                      | file, console           |
| Encoding            | string   | json          | Log format, json format or plain plain text                                             | json, plain             |
| TimeFormat          | string   |               | Date Format                                                                             |                         |
| Path                | string   | logs          | Log output path in file output mode                                                     |                         |
| Level               | string   | info          | Log output level                                                                        | debug,info,error,severe |
| MaxContentLength    | uint32   | 0             | Log length limiting. Logs will be cropped when printing delayed logs, only crop content |                         |
| Compress            | bool     | false         | Whether to compress logs                                                                |                         |
| Stat                | bool     | true          | Whether to disable stat log, go-zero version is greater than 1.5.0                      |                         |
| KeepDays            | int      | 0             | Log number of days left, only in file mode                                              |                         |
| StackCooldownMillis | int      | 100           | Stack print cooldown time                                                               |                         |
| MaxBackups          | int      | 0             | File output mode with maximum number of files remaining when split by size              |                         |
| MaxSize             | int      | 0             | File output mode, single file size when split by size                                   |                         |
| Rotation            | string   | daily         | File split mode, daily by date                                                          | daily,size              |
