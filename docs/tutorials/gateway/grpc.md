---
title: gRPC gateway
slug: /docs/tutorials/gateway/grpc
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

随着微服务架构的流行，gRPC 作为一种高性能、跨语言的远程过程调用（RPC）框架被广泛应用。但是，gRPC 并不适用于所有应用场景。例如，当客户端不支持 gRPC 协议时，或者需要将 gRPC 服务暴露给 Web 应用程序时，需要一种将 RESTful API 转换为 gRPC 的方式。因此，gRPC 网关应运而生。

## gRPC 网关在 go-zero 中的实现

go-zero 中的 gRPC 网关是一个 HTTP 服务器，它将 RESTful API 转换为 gRPC 请求，然后将 gRPC 响应转换为 RESTful API。大致流程如下：

1. 从 proto 文件中解析出 gRPC 服务的定义。
2. 从 配置文件中解析出 gRPC 服务的 HTTP 映射规则。
3. 根据 gRPC 服务的定义和 HTTP 映射规则，生成 gRPC 服务的 HTTP 处理器。
4. 启动 HTTP 服务器，处理 HTTP 请求。
5. 将 HTTP 请求转换为 gRPC 请求。
6. 将 gRPC 响应转换为 HTTP 响应。
7. 返回 HTTP 响应。

详细代码可参考 <a href="https://github.com/zeromicro/go-zero/tree/master/gateway" target="_blank">gateway</a>。

## 配置介绍

```go
type (
	GatewayConf struct {
		rest.RestConf
		Upstreams []Upstream
		Timeout   time.Duration `json:",default=5s"`
	}

	RouteMapping struct {
		Method string
		Path string
		RpcPath string
	}

	Upstream struct {
		Name string `json:",optional"`
		Grpc zrpc.RpcClientConf
		ProtoSets []string `json:",optional"`
		Mappings []RouteMapping `json:",optional"`
	}
)
```

### GatewayConf

| <img width={100}/>名称 | 说明 | 类型 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- |
| RestConf | rest 服务配置 | RestConf | 是 | 参考<a href="/docs/tutorials/go-zero/configuration/service" target="_blank">基础服务配置</a> |
| Upstreams | gRPC 服务配置 | []Upstream | 是 | |
| Timeout |  超时时间 | duration | 否 | `5s` |

### Upstream

| <img width={100}/>名称 | 说明 | 类型 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- |
| Name | 服务名称 | string | 否 | `demo1-gateway` |
| Grpc | gRPC 服务配置 | RpcClientConf | 是 | 参考<a href="/docs/tutorials/grpc/server/configuration/service" target="_blank">RPC 配置</a> |
| ProtoSets | proto 文件列表 | []string | 否 | `["hello.pb"]` |
| Mappings | 路由映射,不填则默认映射所有 grpc 路径 | []RouteMapping | 否 | |

### RouteMapping

| <img width={100}/>名称 | 说明 | 类型 | 是否必填 | 示例 |
| --- | --- | --- | --- | --- |
| Method | HTTP 方法 | string | 是 | `get` |
| Path | HTTP 路径 | string | 是 | `/ping` |
| RpcPath | gRPC 路径 | string | 是 | `hello.Hello/Ping` |

## 使用示例

在 go-zero 中，有两种方式使用 gRPC 网关: protoDescriptor 和 grpcReflection。

<Tabs>
<TabItem value="protoDescriptor" label="protoDescriptor" default>

protoDescriptor 方式需要通过 protoc 将 proto 生成为 pb 文件，然后在 gateway 中去引用该 pb 文件做 rest-grpc 的规则映射。

1. 我们新建一个工程 demo1, 在 demo1 中新建一个 hello.proto 文件，如下：

```protobuf
syntax = "proto3";

package hello;

option go_package = "./hello";

message Request {
}

message Response {
  string msg = 1;
}

service Hello {
  rpc Ping(Request) returns(Response);
}
```

2. 在 `demo1` 目录下创建 `gateway` 目录，然后在 `demo1` 目录执行如下指令生成 protoDescriptor：

```bash
$ protoc --descriptor_set_out=gateway/hello.pb hello.proto
```

3. 在 `demo1` 目录下执行如下指令生成 grpc 服务代码：

```bash
$ goctl rpc protoc hello.proto --go_out=server --go-grpc_out=server --zrpc_out=server
```

为 `demo1/server/internal/logic/pinglogic.go` 中的 `Ping` 方法填充逻辑，代码如下：

```go
func (l *PingLogic) Ping(in *hello.Request) (*hello.Response, error) {
	return &hello.Response{
		Msg: "pong",
	}, nil
}
```

4. 进入 `demo1/gateway` 目录，创建目录 `etc`，然后添加配置文件 `gateway.yaml`，如下：

```yaml
Name: demo1-gateway
Host: localhost
Port: 8888
Upstreams:
  - Grpc:
      Target: 0.0.0.0:8080
    # protoset mode
    ProtoSets:
      - hello.pb
    # Mappings can also be written in proto options
    Mappings:
      - Method: get
        Path: /ping
        RpcPath: hello.Hello/Ping
```

5. 进入 `demo1/gateway` 目录， 新建 `gateway.go` 文件，内容如下：

```go
package main

import (
	"flag"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/gateway"
)

var configFile = flag.String("f", "etc/gateway.yaml", "config file")

func main() {
	flag.Parse()

	var c gateway.GatewayConf
	conf.MustLoad(*configFile, &c)
	gw := gateway.MustNewServer(c)
	defer gw.Stop()
	gw.Start()
}

```

6. 分别开两个终端启动 grpc server 服务和 gateway 服务，然后访问 `http://localhost:8888/ping`：

```bash
# 进入 demo1/server 目录下，启动 grpc 服务
$ go run hello.go
Starting rpc server at 0.0.0.0:8080...
```

```bash
# 进入 demo1/gateway 目录下，启动 gateway 服务
$ go run gateway.go
```

```bash
# 新开一个终端，访问 gateway 服务
$ curl http://localhost:8888/ping
{"msg":"pong"}%
```

</TabItem>


<TabItem value="grpcReflection" label="grpcReflection" default>

grpcReflection 方式和 protoDescriptor 方式类似，不同的是，grpcReflection 方式不需要通过 protoc 将 proto 生成为 pb 文件，而是通过 grpc 的反射机制，直接从 grpc server 中获取 proto 文件，然后在 gateway 中去引用该 proto 文件做 rest-grpc 的规则映射。

1. 我们新建一个工程 demo2, 在 demo2 中新建一个 hello.proto 文件，如下：

```protobuf
syntax = "proto3";

package hello;

option go_package = "./hello";

message Request {
}

message Response {
  string msg = 1;
}

service Hello {
  rpc Ping(Request) returns(Response);
}
```

2. 在 `demo2` 目录下创建 `gateway` 目录备用


3. 在 `demo2` 目录下执行如下指令生成 grpc 服务代码：

```bash
$ goctl rpc protoc hello.proto --go_out=server --go-grpc_out=server --zrpc_out=server
```

为 `demo2/server/internal/logic/pinglogic.go` 中的 `Ping` 方法填充逻辑，代码如下：

```go
func (l *PingLogic) Ping(in *hello.Request) (*hello.Response, error) {
	return &hello.Response{
		Msg: "pong",
	}, nil
}
```

将配置文件 `demo2/server/etc/hello.yaml` 中添加如下配置：

```yaml {3}
Name: hello.rpc
ListenOn: 0.0.0.0:8080
Mode: dev
```

:::tip
因为目前 grpc 反射模式只有 `dev` 和 `test` 环境支持，所以这里需要将 `Mode` 设置为 `dev` 或者 `test`。
:::

4. 进入 `demo2/gateway` 目录，创建目录 `etc`，然后添加配置文件 `gateway.yaml`，如下：

```yaml
Name: demo1-gateway
Host: localhost
Port: 8888
Upstreams:
  - Grpc:
      Target: 0.0.0.0:8080
    # Mappings can also be written in proto options
    Mappings:
      - Method: get
        Path: /ping
        RpcPath: hello.Hello/Ping
```

5. 进入 `demo2/gateway` 目录， 新建 `gateway.go` 文件，内容如下：

```go
package main

import (
	"flag"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/gateway"
)

var configFile = flag.String("f", "etc/gateway.yaml", "config file")

func main() {
	flag.Parse()

	var c gateway.GatewayConf
	conf.MustLoad(*configFile, &c)
	gw := gateway.MustNewServer(c)
	defer gw.Stop()
	gw.Start()
}

```

6. 分别开两个终端启动 grpc server 服务和 gateway 服务，然后访问 `http://localhost:8888/ping`：

```bash
# 进入 demo1/server 目录下，启动 grpc 服务
$ go run hello.go
Starting rpc server at 0.0.0.0:8080...
```

```bash
# 进入 demo1/gateway 目录下，启动 gateway 服务
$ go run gateway.go
```

```bash
# 新开一个终端，访问 gateway 服务
$ curl http://localhost:8888/ping
{"msg":"pong"}%
```

</TabItem>
</Tabs>

## 参考文献

- <a href="https://github.com/zeromicro/go-zero/tree/master/gateway" target="_blank">《go-zero • gateway》</a>
- <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">《go-zero • 基础服务配置》</a>
- <a href="/docs/tutorials/grpc/server/configuration/service" target="_blank">《go-zero • grpc 配置》</a>