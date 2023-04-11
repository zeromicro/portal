---
title:  服务配置
slug: /docs/tutorials/grpc/client/configuration
---

## 概述

本文介绍如何使用 go-zero 框架进行 gRPC Client 的开发。

## 配置

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

| 名称          | 类型                  | 含义                                                            | 默认值 | 是否必选 |
| ------------- | --------------------- | --------------------------------------------------------------- | ------ | -------- |
| Etcd          | EtcdConf              | 服务发现配置，当需要使用 etcd 做服务发现时配置                  | 无     | 否       |
| Endpoints     | string 类型数组       | RPC Server 地址列表，用于直连，当需要直连 rpc server 集群时配置 | 无     | 否       |
| Target        | string                | 目标服务地址，当需要直连单个 rpc server 是配置                  | 无     | 否       |
| App           | string                | rpc 认证的 app 名称，仅当 rpc server 开启认证时配置             | 无     | 否       |
| Token         | string                | rpc 认证的 token，仅当 rpc server 开启认证时配置                | 无     | 否       |
| NonBlock      | bool                  | 是否阻塞模式,当值为 true 时，不会阻塞 rpc 链接                  | false  | 否       |
| Timeout       | int64                 | 超时时间                                                        | 2000ms | 否       |
| KeepaliveTime | Time.Duration         | 保活时间                                                        | 20s    | 否       |
| Middlewares   | ClientMiddlewaresConf | 是否启用中间件                                                  | 无     | 否       |

### EtcdConf

EtcdConf 为服务发现配置，当需要使用 etcd 做服务发现时配置。

| 名称               | 类型            | 含义                  | 默认值   | 是否必选 |
| ------------------ | --------------- | --------------------- | -------- | -------- |
| Hosts              | string 类型数组 | etcd 集群地址         | 无       | 是       |
| Key                | string          | 服务发现 key          | 无       | 是       |
| ID                 | int64           | etcd 租户 id          | 无       | 否       |
| User               | string          | etcd 用户名           | 无       | 否       |
| Pass               | string          | etcd 密码             | 无       | 否       |
| CertFile           | string          | etcd 证书文件         | CertFile | 否       |
| CertKeyFile        | string          | etcd 证书私钥文件     | 无       | 否       |
| CACertFile         | string          | etcd 证书根文件       | CertFile | 否       |
| InsecureSkipVerify | bool            | etcd 是否跳过证书验证 | 无       | 否       |

### ServerMiddlewaresConf

ServerMiddlewaresConf 为中间件配置，当需要控制中间件时配置。

| 名称       | 类型 | 含义                | 默认值 | 是否必选 |
| ---------- | ---- | ------------------- | ------ | -------- |
| Trace      | bool | 是否开启链路追踪    | true   | 否       |
| Recover    | bool | 是否开启异常恢复    | true   | 否       |
| Stat       | bool | 是否开启统计        | true   | 否       |
| Prometheus | bool | 是否开启 prometheus | true   | 否       |
| Breaker    | bool | 是否开启熔断        | true   | 否       |
