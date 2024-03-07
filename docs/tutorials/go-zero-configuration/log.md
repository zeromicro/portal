---
title: 日志配置
sidebar_label: 日志配置
slug: /docs/tutorials/go-zero/configuration/log
---

## log 概述

[LogConf](https://github.com/zeromicro/go-zero/blob/master/core/logx/config.go#L4) 用于我们 log 相关的配置，**logx.MustSetup**提供了我们日志的基础配置能力，简单使用方式如下：

```go
var c logx.LogConf
logx.MustSetup(c)
logx.Info(context.Background(), "log")
// do your job
```

我们 log 被 serviceConf 引用，他会在服务启动的时候自动初始化完成。

## 参数定义

LogConf 配置定义如下：

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

| 参数                | 类型   | 默认值  | 说明                                        | 枚举值 |
| ------------------- | ------ | ------- |-------------------------------------------| --------- |
| ServiceName         | string |         | 服务名称                                      |
| Mode                | string | console | 日志打印模式，console 控制台                        | file, console |
| Encoding            | string | json    | 日志格式, json 格式 或者 plain 纯文本                | json, plain |
| TimeFormat          | string |         | 日期格式化                                     |
| Path                | string | logs    | 日志在文件输出模式下，日志输出路径                         |
| Level               | string | info    | 日志输出级别                                    | debug,info,error,severe |
| MaxContentLength    | uint32 | 0       | 日志长度限制，打印单个日志的时候会对日志进行裁剪，只有对 content 进行裁剪 |
| Compress            | bool   | false   | 是否压缩日志                                    |
| Stat                | bool   | true    | 是否开启 stat 日志，go-zero 版本大于等于1.5.0才支持       |
| KeepDays            | int    | 0       | 日志保留天数，只有在文件模式才会生效                        |
| StackCooldownMillis | int    | 100     | 堆栈打印冷却时间                                  |
| MaxBackups          | int    | 0       | 文件输出模式，按照大小分割时，最多文件保留个数                   |
| MaxSize             | int    | 0       | 文件输出模式，按照大小分割时，单个文件大小                     |
| Rotation            | string | daily   | 文件分割模式， daily 按日期                         | daily,size |
