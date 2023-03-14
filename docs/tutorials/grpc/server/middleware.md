---
title: 中间件
slug: /docs/tutorials/grpc/server/middleware
---

## 概述

gRPC中间件是指在gRPC框架中用于增强其功能和性能的插件，可以帮助我们简化服务端和客户端的开发，实现一些常见的功能，如认证、监控、日志记录、限流、熔断等。

## go-zero中间件

和 gRPC 一样，zRPC 的中间件也是沿用 gRPC 的中间件机制，因此，我们可以直接使用 gRPC 的中间件，也可以使用 go-zero 的中间件。
gRPC 中间件有 2 种类型，分别是 Unary(grpc.UnaryServerInterceptor) 和 Stream(grpc.StreamServerInterceptor)。

### 中间件使用

#### 内置中间件

zRPC 内置了非常丰富的中间件，详情可查看<a href="https://github.com/zeromicro/go-zero/tree/master/zrpc/internal/serverinterceptors" target="_blank">serverinterceptors</a>

- 鉴权中间件：StreamAuthorizeInterceptor|UnaryAuthorizeInterceptor
- 熔断中间件：StreamBreakerInterceptor|UnaryBreakerInterceptor
- 指标统计中间件： UnaryPrometheusInterceptor
- 异常捕获中间件：StreamRecoverInterceptor|UnaryRecoverInterceptor
- 服务降载中间件：UnarySheddingInterceptor
- 时长统计中间件：UnaryStatInterceptor
- 超时控制中间件：UnaryTimeoutInterceptor
- 链路追踪中间件：StreamTraceInterceptor|UnaryTraceInterceptor

在以上内置中间件中，链路追踪中间件、指标统计中间件、时长统计中间件、异常捕获中间件、熔断中间件可以通过配置来开启或关闭，其他中间件默认开启。
具体配置可参考<a href="/docs/tutorials/grpc/server/configuration" target="_blank">服务配置</a>

#### 自定义中间件

以下代码是基于 `goctl rpc new greet` 生成的代码改造的，灰色底纹区域为自定义中间件代码，

```go {15,16,21-28}
var configFile = flag.String("f", "etc/greet.yaml", "the config file")

func main() {
    flag.Parse()

    var c config.Config
    conf.MustLoad(*configFile, &c)
    ctx := svc.NewServiceContext(c)

    s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {
        greet.RegisterGreetServer(grpcServer, server.NewGreetServer(ctx))
    })
    defer s.Stop()

    s.AddUnaryInterceptors(exampleUnaryInterceptor)
    s.AddStreamInterceptors(exampleStreamInterceptor)
    fmt.Printf("Starting rpc server at %s...\n", c.ListenOn)
    s.Start()
}

func exampleUnaryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
    // TODO: fill your logic here
    return handler(ctx, req)
}
func exampleStreamInterceptor(srv interface{}, ss grpc.ServerStream, info *grpc.StreamServerInfo, handler grpc.StreamHandler) error {
    // TODO: fill your logic here
    return handler(srv, ss)
}

```
