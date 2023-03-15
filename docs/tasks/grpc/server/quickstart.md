---
title: 快速开始
slug:  /docs/tasks/grpc/server/quickstart
---

## 概述

本文将介绍如何快速开发一个 rpc server 服务。

## 示例

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

zrpc server 服务创建

```go
func main() {
	s := zrpc.MustNewServer(zrpc.RpcServerConf{
		ServiceConf: service.ServiceConf{
			Name: "greet.rpc", // 服务名称，并非服务发现 key，只是用于标记服务
		},
		ListenOn: "127.0.0.1:8080", // 监听地址
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

:::tip 小技巧
如果你也觉得这样写代码很麻烦，不妨试试 goctl 脚手架代码生成，详情可参考 <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc </a>
:::

更多 zrpc 使用(服务注册、服务发现、中间件使用等)可参考 <a href="/docs/tutorials/grpc/server/register" target="_blank"> rpc 服务注册 </a>

## 参考文献

- <a href="/docs/tutorials/grpc/client/configuration" target="_blank"> rpc 客户端配置 </a>
- <a href="/docs/tutorials/grpc/client/conn" target="_blank"> rpc 服务连接 </a>