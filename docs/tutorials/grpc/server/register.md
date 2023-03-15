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

关于 etcd 组件作为注册中心说明文档可参考  <a href="https://etcd.io/docs/v3.5/dev-guide/grpc_naming/" target="_blank">《etcd • gRPC naming and discovery》</a>

**准备工作**

事先我们执行如下执行生成一个 proto 文件及其 pb 文件。

```bash
# 创建 demo 服务目录
$ mkdir demo && cd demo
# go mod 初始化
$ go mod init demo
# 生成 greet.proto 文件
$ goctl rpc -o greet.proto
# 生 pb.go 文件
$ protoc greet.proto --go_out=. --go-grpc_out=.
# 创建 client 目录
$ mkdir client && cd client
# 新增 client.go 文件
$ touch client.go
```

```go
func main() {
	s := zrpc.MustNewServer(zrpc.RpcServerConf{
		ServiceConf: service.ServiceConf{
			Name: "greet.rpc", // 服务名称，并非服务发现 key，只是用于标记服务
		},
		Etcd: discov.EtcdConf{
			Hosts:              []string{"127.0.0.1:2379"},// etcd 集群地址
			Key:                "greet.rpc",// 服务注册的 key
			User:               "", // etcd 用户名，仅当 etcd 开启 acl 时使用，这里暴露只是为了说明有这样的能力，如果不使用可删除本行代码。
			Pass:               "", // etcd 密码，仅当 etcd 开启 acl 时使用，这里暴露只是为了说明有这样的能力，如果不使用可删除本行代码。
			CertFile:           "", // etcd 证书，仅当 etcd 开启 acl 时使用，这里暴露只是为了说明有这样的能力，如果不使用可删除本行代码。
			CertKeyFile:        "", // etcd 私钥文件，仅当 etcd 开启 acl 时使用，这里暴露只是为了说明有这样的能力，如果不使用可删除本行代码。
			CACertFile:         "", // etcd CA 证书文件，仅当 etcd 开启 acl 时使用，这里暴露只是为了说明有这样的能力，如果不使用可删除本行代码。
			InsecureSkipVerify: false, // 是否跳过 acl 校验，仅当 etcd 开启 acl 时使用，这里暴露只是为了说明有这样的能力，如果不使用可删除本行代码。
		},
	}, func(server *grpc.Server) {
		greet.RegisterGreetServer(server, &exampleServer{})
	})

	defer s.Stop()
	s.Start()
}

type exampleServer struct {
	greet.UnimplementedGreetServer
}

func (e *exampleServer) Ping(ctx context.Context, request *greet.Request) (*greet.Response, error) {
	// fill your logic here
	return &greet.Response{}, nil
}
```

## 其他服务注册

除了 zrpc 内置的 ectd 作为服务注册组件外，社区还提供了对 nacos,consul
等的服注册支持，详情可参考 <a href="https://github.com/zeromicro/zero-contrib/tree/main/zrpc/registry" target="_blank">
更多服务注册组件</a>

## 参考文献

- <a href="https://etcd.io/docs/v3.5/dev-guide/grpc_naming/" target="_blank">《etcd • gRPC naming and discovery》</a>