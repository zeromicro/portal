---
title: 服务注册
slug: /docs/tutorials/grpc/server/register
---
## 概述

微服务注册是指在微服务架构中，将每个微服务的网络位置信息注册到一个中心化的服务注册表中，以便其他微服务可以通过服务发现机制找到并与之通信。服务注册表通常是一个分布式系统，可以跨多个数据中心和云提供商。

在微服务架构中，每个微服务都是相对独立的，它们可以部署在不同的服务器上，运行在不同的容器中，使用不同的编程语言和框架，因此需要一种机制来管理它们之间的通信。服务注册表提供了一种简单而有效的方法，使得每个微服务都可以被其他微服务轻松找到和访问。

服务注册表通常包括以下信息：

微服务名称：每个微服务都有一个唯一的名称，以便其他微服务可以引用它。
微服务的网络位置信息：包括 IP 地址和端口号等信息，以便其他微服务可以连接到它。
微服务的元数据：包括版本号、可用性、负载等信息，以便其他微服务可以根据这些信息做出决策。
常见的服务注册中心包括：

- Netflix Eureka：Netflix 开源的服务注册中心，支持高可用和负载均衡等功能。
- Consul：由 HashiCorp 开发的服务注册中心，提供服务发现、健康检查、KV 存储等功能。
- ZooKeeper：由 Apache 开发的分布式协调服务，提供服务注册和服务发现功能。
- Etcd：由 CoreOS 开发的分布式键值存储系统，提供服务注册和服务发现功能。

## go-zero服务注册

在 go-zero 中提供了直连和 etcd 作为注册中心的方式，直连方式不需要额外的服务注册中心，而 etcd 方式需要额外的服务注册中心。
响应配置请参考 <a href="/docs/tutorials/grpc/server/configuration" target="_blank"> 服务配置 </a>

### 直连

直连方式RPC Server的配置如下：

```yaml
Name: helloworld.rpc
ListenOn: 127.0.0.1:8080
```

直连方式RPC Client主需要配置Endpoints既可，配置如下：

```yaml
Endpoints:
  - 127.0.0.1:8080
```

### Etcd

Etcd方式RPC Server配置如下：

```yaml
Name: helloworld.rpc
ListenOn: 127.0.0.1:8080
Etcd:
  Hosts:
  - 127.0.0.1:2379
  Key: helloworld.rpc

```

## 其他服务注册

除了 zrpc 内置的 ectd 作为服务注册组件外，社区还提供了对 nacos,consul 等的服注册支持，详情可参考 <a href="https://github.com/zeromicro/zero-contrib/tree/main/zrpc/registry" target="_blank">更多服务注册组件</a>