---
title: 调试开关
slug: /docs/tutorials/grpc/server/debug
---

## 概述

gRPC 服务端可以通过一些工具来进行调试，比如 <a href="https://github.com/fullstorydev/grpcurl" target="_blank">grpcurl</a>、<a href="https://github.com/fullstorydev/grpcui" target="_blank">grpcui</a> 等，目前 zRPC 可以通过静态配置来开启调试功能。

## 开启 zRPC 调试开关

和 gRPC 使用方法一下，zRPC 也是通过 `reflection.Register(grpcServer)` 来开启调试功能，如果你是通过 goctl 生成  rpc 服务代码，goctl 会自动帮你添加这一行代码，以下是 goctl 生成的代码示例参考(黑色区域部分为开始 grpc 调试代码部分)，我们建议调试开关仅在 `dev` 和 `test` 环境下开启。

```go {13-15}
var configFile = flag.String("f", "etc/greet.yaml", "the config file")

func main() {
    flag.Parse()

    var c config.Config
    conf.MustLoad(*configFile, &c)
    ctx := svc.NewServiceContext(c)

    s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {
        greet.RegisterGreetServer(grpcServer, server.NewGreetServer(ctx))

        if c.Mode == service.DevMode || c.Mode == service.TestMode {
            reflection.Register(grpcServer)
        }
    })
    defer s.Stop()

    fmt.Printf("Starting rpc server at %s...\n", c.ListenOn)
    s.Start()
}
```


## 参考文件

- <a href="https://github.com/fullstorydev/grpcurl" target="_blank">《grpcurl》</a>
- <a href="https://github.com/fullstorydev/grpcui" target="_blank">《grpcui》</a>