---
title: Service Configuration
slug: /docs/tutorials/grpc/server/configuration
---

## Overview

The zRPC service configuration is mainly used to control rpc's listener addresses, service registration findings, link tracking, logs, intermediaries, etc.

### Configuration

zRPC Server Configuration Structure states below：

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

| Name          | DataType              | Meaning                                                                                      | Default value | Required? |
| ------------- | --------------------- | -------------------------------------------------------------------------------------------- | ------------- | --------- |
| ServiceConf   | ServiceConf           | Basic Service Configuration                                                                  | None          | YES       |
| ListenOn      | string                | Listening address                                                                            | None          | YES       |
| Etcd          | EtcdConf              | etcd Configuration Item                                                                      | None          | NO        |
| Auth          | bool                  | Auth enabled                                                                                 | None          | NO        |
| Redis         | RedisKeyConf          | rpc authentication, only if Auth is true                                                     | None          | NO        |
| StrictControl | bool                  | _Whether Strict Mode, if an error is Auth failed, otherwise it can be considered successful_ | None          | NO        |
| Timeout       | int64                 | Timeout                                                                                      | 2000ms        | NO        |
| CpuThreshold  | int64                 | Downloading threshold,Default 900(90%),Allow range 0 to 1000                                 | 900           | NO        |
| Health        | bool                  | Enable health check                                                                          | true          | NO        |
| Middlewares   | ServerMiddlewaresConf | Enable Middleware                                                                            | None          | NO        |

ServiceConfig General Configuration please refer to  <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">Basic Service Configuration</a>

#### EtcdConf

EtcdConf is the parameter that needs to be configured when using the etcd to register a service. If you do not need to register a service using the etcd, you can not configure it.

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

| Name        | DataType          | Meaning                                                                               | Default value | Required? |
| ----------- | ----------------- | ------------------------------------------------------------------------------------- | ------------- | --------- |
| Hosts       | String Type Array | etcd cluster address                                                                  | None          | YES       |
| Key         | string            | Defines the unique expression of the service, used for service registration discovery | None          | YES       |
| User        | string            | etcd username                                                                         | None          | NO        |
| Pass        | string            | etcd password                                                                         | None          | NO        |
| CertFile    | tring             | Certificate file                                                                      | None          | NO        |
| CertKeyFile | string            | Private key file                                                                      | None          | NO        |
| CACertFile  | String            | CA Certificate File                                                                   | None          | NO        |

#### RedisKeyConf

RedisKeyConf is the parameter that needs to be configured when you need to use redis to manage rpc authentication. If you do not need rpc authentication, you can not configure it.

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

| Name | DataType | Meaning                  | Default value | Required? |
| ---- | -------- | ------------------------ | ------------- | --------- |
| Host | string   | redis address, host+port | None          | YES       |
| Type | string   | redis type               | node          | NO        |
| Pass | string   | Redis password           | None          | NO        |
| Tls  | bool     | Enable tls               | false         | NO        |
| Key  | string   | redis key                | None          | YES       |

ServerMiddlewaresConf Configuration：

```go
ServerMiddlewaresConf struct {
    Trace      bool `json:",default=true"`
    Recover    bool `json:",default=true"`
    Stat       bool `json:",default=true"`
    Prometheus bool `json:",default=true"`
    Breaker    bool `json:",default=true"`
}
```

| Name       | DataType | Meaning                                                  | Default value | Required? |
| ---------- | -------- | -------------------------------------------------------- | ------------- | --------- |
| Trace      | bool     | Enable link tracking                                     | true          | NO        |
| Recover    | bool     | Whether or not to enable abnormal capture intermediation | true          | NO        |
| Stat       | bool     | Whether to turn on stats intermediate                    | true          | NO        |
| Prometheus | bool     | Enable Prometheus Middleware                             | true          | NO        |
| Breaker    | bool     | Enable breaker intermediate                              | true          | No        |
