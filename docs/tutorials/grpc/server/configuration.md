---
title: 服务配置
slug: /docs/tutorials/grpc/server/configuration
---

## 概述

zRPC 服务配置主要用于控制 rpc 的监听地址、服务注册发现、链路追踪、日志、中间件等。

### 配置

zRPC 服务端配置结构体声明如下：

```go
type RpcServerConf struct {
    service.ServiceConf
    ListenOn      string
    Etcd          discov.EtcdConf    `json:",optional,inherit"`
    Auth          bool               `json:",optional"`
    Redis         redis.RedisKeyConf `json:",optional"`
    StrictControl bool               `json:",optional"`
    // setting 0 means no timeout
    Timeout      int64 `json:",default=2000"`
    CpuThreshold int64 `json:",default=900,range=[0:1000]"`
    // grpc health check switch
    Health      bool `json:",default=true"`
    Middlewares ServerMiddlewaresConf
}
```

#### RpcServerConf

| 名称          | 类型                  | 含义                                                               | 默认值 | 是否必选 |
| ------------- | --------------------- | ------------------------------------------------------------------ | ------ | -------- |
| ServiceConf   | ServiceConf           | 基础服务配置                                                       | 无     | 是       |
| ListenOn      | string                | 监听地址                                                           | 无     | 是       |
| Etcd          | EtcdConf              | etcd 配置项                                                        | 无     | 否       |
| Auth          | bool                  | 是否开启 Auth                                                      | 无     | 否       |
| Redis         | RedisKeyConf          | rpc 认证，仅当 Auth 为 true 生效                                   | 无     | 否       |
| StrictControl | bool                  | _是否 Strict 模式，如果是则遇到错误是 Auth 失败，否则可以认为成功_ | 无     | 否       |
| Timeout       | int64                 | 超时时间                                                           | 2000ms | 否       |
| CpuThreshold  | int64                 | 降载阈值，默认 900(90%)，可允许设置范围 0 到 1000                  | 900    | 否       |
| Health        | bool                  | 是否开启健康检查                                                   | true   | 否       |
| Middlewares   | ServerMiddlewaresConf | 启用中间件                                                         | 无     | 否       |

ServiceConfig 通用配置请参考 <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">基础服务配置</a>

#### EtcdConf

EtcdConf 是当需要使用 etcd 来进行服务注册发现时需要配置的参数，如果不需要用 etcd 进行服务注册发现，可以不配置。

```go
type EtcdConf struct {
    Hosts              []string
    Key                string
    ID                 int64  `json:",optional"`
    User               string `json:",optional"`
    Pass               string `json:",optional"`
    CertFile           string `json:",optional"`
    CertKeyFile        string `json:",optional=CertFile"`
    CACertFile         string `json:",optional=CertFile"`
    InsecureSkipVerify bool   `json:",optional"`
}
```

| 名称        | 类型            | 含义                                 | 默认值 | 是否必选 |
| ----------- | --------------- | ------------------------------------ | ------ | -------- |
| Hosts       | string 类型数组 | etcd 集群地址                        | 无     | 是       |
| Key         | string          | 定义服务的唯一表示，用于服务注册发现 | 无     | 是       |
| User        | string          | etcd 用户                            | 无     | 否       |
| Pass        | string          | etcd 密码                            | 无     | 否       |
| CertFile    | tring           | 证书文件                             | 无     | 否       |
| CertKeyFile | string          | 私钥文件                             | 无     | 否       |
| CACertFile  | String          | CA 证书文件                          | 无     | 否       |

#### RedisKeyConf

RedisKeyConf 是当你需要使用 redis 来管理 rpc 认证时需要配置的参数，如果不需要用 redis 进行 rpc 认证，可以不配置。

```go
type (
    // A RedisConf is a redis config.
    RedisConf struct {
        Host string
        Type string `json:",default=node,options=node|cluster"`
        Pass string `json:",optional"`
        Tls  bool   `json:",optional"`
    }

    // A RedisKeyConf is a redis config with key.
    RedisKeyConf struct {
        RedisConf
        Key string
    }
)
```

| 名称 | 类型   | 含义                  | 默认值 | 是否必选 |
| ---- | ------ | --------------------- | ------ | -------- |
| Host | string | redis 地址，host+port | 无     | 是       |
| Type | string | redis 类型            | node   | 否       |
| Pass | string | redis 密码            | 无     | 否       |
| Tls  | bool   | 是否开启 tls          | false  | 否       |
| Key  | string | redis key             | 无     | 是       |

ServerMiddlewaresConf 中间件配置：

```go
ServerMiddlewaresConf struct {
    Trace      bool `json:",default=true"`
    Recover    bool `json:",default=true"`
    Stat       bool `json:",default=true"`
    Prometheus bool `json:",default=true"`
    Breaker    bool `json:",default=true"`
}
```

| 名称       | 类型 | 含义                       | 默认值 | 是否必选 |
| ---------- | ---- | -------------------------- | ------ | -------- |
| Trace      | bool | 是否开启链路追踪中间件     | true   | 否       |
| Recover    | bool | 是否开启异常捕获中间件     | true   | 否       |
| Stat       | bool | 是否开启统计中间件         | true   | 否       |
| Prometheus | bool | 是否开启 Prometheus 中间件 | true   | 否       |
| Breaker    | bool | 是否开启熔断中间件         | true   | 否       |
