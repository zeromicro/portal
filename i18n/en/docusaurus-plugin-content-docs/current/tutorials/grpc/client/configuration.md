---
title: Service Configuration
slug: /docs/tutorials/grpc/client/configuration
---

## Overview

This paper describes how to use the go-Zero framework for gRPC client development.

## Configuration

```go
type RpcClientConf struct {
    Etcd          discov.EtcdConf `json:",optional,inherit"`
    Endpoints     []string        `json:",optional"`
    Target        string          `json:",optional"`
    App           string          `json:",optional"`
    Token         string          `json:",optional"`
    NonBlock      bool            `json:",optional"`
    Timeout       int64           `json:",default=2000"`
    KeepaliveTime time.Duration   `json:",default=20s"`
    Middlewares   ClientMiddlewaresConf
}

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

type ServerMiddlewaresConf struct {
    Trace      bool `json:",default=true"`
    Recover    bool `json:",default=true"`
    Stat       bool `json:",default=true"`
    Prometheus bool `json:",default=true"`
    Breaker    bool `json:",default=true"`
}
```

### RpcClientConf

| Name          | DataType              | Meaning                                                                                          | Default value | Required? |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------ | ------------- | --------- |
| Etcd          | EtcdConf              | Service finds configuration, when using etcd for service discovery                               | None          | NO        |
| Endpoints     | String Type Array     | RPC Server address list, used for direct link, configured when required for a rpc server cluster | None          | NO        |
| Target        | string                | Domain URL solved, please refer to https://github.com/grpc/grpc/blob/master/doc/naming.md        | None          | NO        |
| App           | string                | rpc authenticated app name, only configured when rpserver opens authentication                   | None          | NO        |
| Token         | string                | rpc authenticated token, only configured when rpserver opens authentication                      | None          | NO        |
| NonBlock      | bool                  | Whether to block mode, when true does not block rpc links                                        | false         | NO        |
| Timeout       | int64                 | Timeout time                                                                                     | 2000ms        | NO        |
| KeepaliveTime | Time.Duration         | Keepalive Time                                                                                   | 20s           | NO        |
| Middlewares   | ClientMiddlewaresConf | Enable Middleware                                                                                | None          | NO        |

### EtcdConf

EtcdConf config service discovery when using etcd for service discovery.

| Name               | DataType          | Meaning                                         | Default value | Required? |
| ------------------ | ----------------- | ----------------------------------------------- | ------------- | --------- |
| Hosts              | String Type Array | etcd cluster address                            | None          | YES       |
| Key                | string            | Service discovery key                           | None          | YES       |
| ID                 | int64             | etcd tenant id                                  | None          | NO        |
| User               | string            | etcd username                                   | None          | NO        |
| Pass               | string            | etcd password                                   | None          | NO        |
| CertFile           | string            | etcd certificate file                           | CertFile      | NO        |
| CertKeyFile        | string            | etcd certificate private key file               | None          | NO        |
| CACertFile         | string            | etcd certificate file                           | CertFile      | NO        |
| InsecureSkipVerify | bool              | Whether or not to skip certificate verification | None          | NO        |

### ServerMiddlewaresConf

ServerMidlewaresConf is configured as an intermediary, when control is required.

| Name       | DataType | Meaning                                 | Default value | Required? |
| ---------- | -------- | --------------------------------------- | ------------- | --------- |
| Trace      | bool     | Enable link tracking                    | true          | NO        |
| Recover    | bool     | Whether to enable an exception recovery | true          | NO        |
| Stat       | bool     | Enable stats                            | true          | NO        |
| Prometheus | bool     | Whether prometheus are enabled          | true          | NO        |
| Breaker    | bool     | Whether to turn on smelting             | true          | NO        |
