---
title: 基础服务配置
sidebar_label: 基础服务配置
slug: /docs/tutorials/go-zero/configuration/service
---

## service 概述

[ServiceConf](https://github.com/zeromicro/go-zero/blob/master/core/service/serviceconf.go) 这个配置是用来表示我们一个独立服务的配置。他被我们的 rest，zrpc 等引用，当然我们也可以自己简单定义自己的服务。

例如：

```go
package main

import (
    "github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/core/service"
    "github.com/zeromicro/go-zero/zrpc"
)

type JobConfig struct {
    service.ServiceConf
    UserRpc zrpc.RpcClientConf
}

func main() {
    var c JobConfig
    conf.MustLoad("config.yaml", &c)

    c.MustSetUp()
    // do your job
}

```

如上，我们定义了一个 JobConfig，并且在启动的时候初始设置 **MustSetup**，这样我们就可以启动了一个服务 service，里面自动集成了 Metrics，Prometheus，Trace，DevServer，Log 等能力。

## 参数定义

ServiceConf 配置定义如下:

```go
// A ServiceConf is a service config.
type ServiceConf struct {
    Name       string
    Log        logx.LogConf
    Mode       string `json:",default=pro,options=dev|test|rt|pre|pro"`
    MetricsUrl string `json:",optional"`
    // Deprecated: please use DevServer
    Prometheus prometheus.Config `json:",optional"`
    Telemetry  trace.Config      `json:",optional"`
    DevServer  devserver.Config  `json:",optional"`
}
```

| 参数       | 类型              | 默认值 | 说明                                                                                     | 枚举值 |
| - | - | - |- | - |
| Name       | string            | -      | 定义服务的名称，会出现在 log 和 tracer 中                                                            |
| Log        | logx.LogConf      | -      | 参考 [log](/docs/tutorials/go-zero/configuration/log)                                    |
| Mode       | string            | pro    | 服务的环境，目前我们预定义了 dev。在dev 环境我们会开启反射 | dev,test,rt,pre, pro |
| MetricsUrl | string            | 空     | 打点上报，我们会将一些 metrics 上报到对应的地址，如果为空，则不上报                                                 |
| Prometheus | prometheus.Config | -      | 参考 [Prometheus.md](/docs/tutorials/monitor/index#%E6%8C%87%E6%A0%87%E7%9B%91%E6%8E%A7) |
| Telemetry  | trace.Config      | -      | 参考 [trace.md](/docs/tutorials/monitor/index#链路追踪)                                                                        |
| DevServer  | devserver.Config  | -      | go-zero 版本 `v1.4.3` 及以上支持                                                                                       |
