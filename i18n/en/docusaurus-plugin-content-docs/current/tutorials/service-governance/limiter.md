---
title: Limiter (concurrent control)
slug: /docs/tutorials/service/governance/limiter
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Restricted fluids are a service governance capability that is used to limit the combined use of services to protect their stability.Only the use of restricted fluids for rest,grpc services is described in this subdocument, without a limited flow algorithm.

Limit flow is typically single-node flows, cluster limit flow (average amount of limit flow value for cluster nodes, its essence or single nodal flow), distributive stream.

The current presentation is a single-node flow that is more appropriate than a single-point flow.

## Preparation

1. Create a go mod project

```shell
$ mkdir -p ~/workspace/demo && cd ~/workspace/demo
$ go mod init demo
```

## rest service

### Limit Configuration

```go
RestConf struct {
    ...
    MaxConns int    `json:",default=10000"` // 最大并发连接数，默认值为 10000 qps
    ... 
}
```

### Sample

We use a demo to describe the use of the lower limit streamer.


1. Create new directory `demo` project `rest-limit-demo`

```shell
$ cd ~/workspace/demo
$ mkdir rest-limit-demo && cd rest-limit-demo
```

2. Create a `limit.api` file, copy the following to the file

```go title="limit.api"
syntax = "v1"

service limit {
    @handler ping
    get /ping
}
```

3. Generate rest code

```shell
$ cd ~/workspace/demo/rest-limit-demo
$ goctl api go -api limit.api -dir .
```

4. View directory structure

```shell
$ tree
.
├── etc
│   └── limit.yaml
├── internal
│   ├── config
│   │   └── config.go
│   ├── handler
│   │   ├── pinghandler.go
│   │   └── routes.go
│   ├── logic
│   │   └── pinglogic.go
│   ├── svc
│   │   └── servicecontext.go
│   └── types
│       └── types.go
├── limit.api
└── limit.go
```

We modify the configuration, limit qps to 100, and then add a logic of blocking logic.

1. Edit configuation

Change `to <code> maxConns ` in ` ~/workspace/demo/etc/limit.yaml` to 100

2. Add Logic Code

Add a blocking logic to`~/workspace/demo/rest-limit-demo/internal/logic/pinglogic.go` 中的 `Ping`

Final code content below

<Tabs>
<TabItem value="limit.yaml" label="limit.yaml" default>

```yaml title="limit.yaml"
Name: limit
Host: 0.0.0.0
Port: 8888
MaxConns: 100
```

</TabItem>

<TabItem value="pinglogic.go" label="pinglogic.go" default>

```go
package logic

import (
    "context"
    "time"

    "github.com/zeromicro/go-zero/core/logx"

    "demo/rest-limit-demo/internal/svc"
)

type PingLogic struct {
    logx.Logger
    ctx    context.Context
    svcCtx *svc.ServiceContext
}

func NewPingLogic(ctx context.Context, svcCtx *svc.ServiceContext) *PingLogic {
    return &PingLogic{
        Logger: logx.WithContext(ctx),
        ctx:    ctx,
        svcCtx: svcCtx,
    }
}

func (l *PingLogic) Ping() error {
    time.Sleep(50 * time.Millisecond)
    return nil
}

```

</TabItem>
</Tabs>

Let's run this easiest rest service first. We use the <a href="https://github.com/rakyll/hey" target="_blank">hey</a> tool to simply pressure interface.

Start service

```shell
$ cd ~/workspace/demo/rest-limit-demo
$ go run limit.go
```

Separate terminal pressure

```shell
# 我们用 hey 工具来进行压测，压测 90 个并发，执行 1 秒
$ hey -z 1s -c 90 -q 1 'http://localhost:8888/ping'

Summary:
  Total:    1.1084 secs
  Slowest:  0.1066 secs
  Fastest:  0.0607 secs
  Average:  0.0890 secs
  Requests/sec: 81.1980


Response time histogram:
  0.061 [1] |■
  0.065 [2] |■■■
  0.070 [8] |■■■■■■■■■■■
  0.074 [13]    |■■■■■■■■■■■■■■■■■
  0.079 [5] |■■■■■■■
  0.084 [0] |
  0.088 [0] |
  0.093 [2] |■■■
  0.097 [23]    |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.102 [30]    |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.107 [6] |■■■■■■■■


Latency distribution:
  10% in 0.0682 secs
  25% in 0.0742 secs
  50% in 0.0961 secs
  75% in 0.0983 secs
  90% in 0.0996 secs
  95% in 0.1039 secs
  0% in 0.0000 secs

Details (average, fastest, slowest):
  DNS+dialup:   0.0054 secs, 0.0607 secs, 0.1066 secs
  DNS-lookup:   0.0000 secs, 0.0000 secs, 0.0000 secs
  req write:    0.0002 secs, 0.0000 secs, 0.0011 secs
  resp wait:    0.0832 secs, 0.0576 secs, 0.0942 secs
  resp read:    0.0001 secs, 0.0000 secs, 0.0012 secs

Status code distribution:
  [200] 90 responses
```

In terms of pressure measurements, 90 requests have been successful, and we have stepped up and count to see what will happen.

```shell
# 我们用 hey 工具来进行压测，压测 110 个并发，执行 1 秒
$ hey -z 1s -c 110 -q 1 'http://127.0.0.1:8888/ping'

Summary:
  Total:    1.0833 secs
  Slowest:  0.0756 secs
  Fastest:  0.0107 secs
  Average:  0.0644 secs
  Requests/sec: 101.5403


Response time histogram:
  0.011 [1] |■
  0.017 [9] |■■■■■■■
  0.024 [0] |
  0.030 [0] |
  0.037 [0] |
  0.043 [0] |
  0.050 [0] |
  0.056 [0] |
  0.063 [2] |■■
  0.069 [45]    |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.076 [53]    |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


Latency distribution:
  10% in 0.0612 secs
  25% in 0.0665 secs
  50% in 0.0690 secs
  75% in 0.0726 secs
  90% in 0.0737 secs
  95% in 0.0740 secs
  99% in 0.0756 secs

Details (average, fastest, slowest):
  DNS+dialup:   0.0040 secs, 0.0107 secs, 0.0756 secs
  DNS-lookup:   0.0000 secs, 0.0000 secs, 0.0000 secs
  req write:    0.0001 secs, 0.0000 secs, 0.0025 secs
  resp wait:    0.0602 secs, 0.0064 secs, 0.0741 secs
  resp read:    0.0000 secs, 0.0000 secs, 0.0001 secs

Status code distribution:
  [200] 100 responses
  [503] 10 responses
```

Based on pressure measurements, our services can only support 100 combinations, and more than 100 concurrent requests will be restricted to return to the 503 status code. Flow limitation-related errors also appear in the service's logs at:

```shell
{"@timestamp":"2023-02-09T18:41:55.500+08:00","caller":"internal/log.go:62","content":"(/ping - 127.0.0.1:64163) concurrent connections over 100, rejected with code 503","level":"error","span":"08fa61d49b694e63","trace":"622b2287f32ff2d45f4dfce3eec8e62c"}
```

## gRPC service

grpc is an Intranet service that does not provide services externally but only for other services in-house, so we do not need to limit the flow of services by default.

If you really want to limit the flow, this can be done by grpc intermediaries, for example below.

We use one of the simplest grpc server to show.

1. Create new directory `demo` project `grpc-limit-demo`

```shell
$ cd ~/workspace/demo
$ mkdir grpc-limit-demo && cd grpc-limit-demo
```

2. Create a `limit.proto` file, copy the following to the file

```protobuf title="limit.proto"
syntax = "proto3";

package proto;

option  go_package = "./proto";

message PingReq{}
message PingResp{}

service limit{
  rpc Ping(PingReq) returns (PingResp);
}
```

3. Generate grpc code

```shell
$ cd ~/workspace/demo/grpc-limit-demo
$ goctl rpc protoc limit.proto --go_out=.  --go-grpc_out=.  --zrpc_out=.
```

4. View Directory
```
$ tree
.
├── etc
│   └── limit.yaml
├── internal
│   ├── config
│   │   └── config.go
│   ├── logic
│   │   └── pinglogic.go
│   ├── server
│   │   └── limitserver.go
│   └── svc
│       └── servicecontext.go
├── limit
│   └── limit.go
├── limit.go
├── limit.proto
└── proto
    ├── limit.pb.go
    └── limit_grpc.pb.go

8 directories, 10 files
```

We have implemented `~/workspace/demo/grpc-limit-demo/internal/logic/limitlogic.go` 中实现 `Ping` below：

```go title="imitlogic.go"
package logic

import (
    "context"
    "time"

    "demo/grpc-limit-demo/internal/svc"
    "demo/grpc-limit-demo/proto"

    "github.com/zeromicro/go-zero/core/logx"
)

type PingLogic struct {
    ctx    context.Context
    svcCtx *svc.ServiceContext
    logx.Logger
}

func NewPingLogic(ctx context.Context, svcCtx *svc.ServiceContext) *PingLogic {
    return &PingLogic{
        ctx:    ctx,
        svcCtx: svcCtx,
        Logger: logx.WithContext(ctx),
    }
}

func (l *PingLogic) Ping(in *proto.PingReq) (*proto.PingResp, error) {
    time.Sleep(50*time.Millisecond)

    return &proto.PingResp{}, nil
}

```

5. Add middleware in `~/workspace/demo/grpc-limit-demo/limit.go` ：

```go title="limit.go" {42-57}
package main

import (
    "context"
    "flag"
    "fmt"
    "net/http"

    "github.com/zeromicro/go-zero/core/logx"
    "github.com/zeromicro/go-zero/core/syncx"
    "google.golang.org/grpc/codes"
    "google.golang.org/grpc/status"

    "demo/grpc-limit-demo/internal/config"
    "demo/grpc-limit-demo/internal/server"
    "demo/grpc-limit-demo/internal/svc"
    "demo/grpc-limit-demo/proto"

    "github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/core/service"
    "github.com/zeromicro/go-zero/zrpc"
    "google.golang.org/grpc"
    "google.golang.org/grpc/reflection"
)

var configFile = flag.String("f", "etc/limit.yaml", "the config file")

func main() {
    flag.Parse()

    var c config.Config
    conf.MustLoad(*configFile, &c)
    ctx := svc.NewServiceContext(c)

    s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {
        proto.RegisterLimitServer(grpcServer, server.NewLimitServer(ctx))

        if c.Mode == service.DevMode || c.Mode == service.TestMode {
            reflection.Register(grpcServer)
        }
    })
    var n = 100
    l := syncx.NewLimit(n)
    s.AddUnaryInterceptors(func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (resp interface{}, err error) {
        if l.TryBorrow() {
            defer func() {
                if err := l.Return(); err != nil {
                    logx.Error(err)
                }
            }()
            return handler(ctx, req)
        } else {
            logx.Errorf("concurrent connections over %d, rejected with code %d",
                n, http.StatusServiceUnavailable)
            return nil, status.Error(codes.Unavailable, "concurrent connections over limit")
        }
    })
    defer s.Stop()

    fmt.Printf("Starting rpc server at %s...\n", c.ListenOn)
    s.Start()
}

}

```

We will generate profiles `~/workspace/demo/grpc-limit-demo/etc/limit.yaml` to delete the etcd configuration in the file and start grpc server using direct connections.

```yaml title="limit.yaml"
Name: limit.rpc
ListenOn: 0.0.0.0:8080

```

Start service

```shell
$ cd ~/workspace/demo/grpc-limit-demo
$ go run limit.go
```

Now that the grpc server is available, we use <a href="https://github.com/bojand/ghz" target="_blank">ghz</a> to pressure it.

```shell
$ cd ~/workspace/demo/grpc-limit-demo
# 压测 90 qps，共请求 110 次
$ ghz --insecure --proto=limit.proto --call=proto.limit.Ping -d '{}' -c 90 -n 110  127.0.0.1:8080 

Summary:
  Count:        110
  Total:        108.94 ms
  Slowest:      60.51 ms
  Fastest:      50.24 ms
  Average:      55.73 ms
  Requests/sec: 1009.75

Response time histogram:
  50.240 [1]  |∎∎
  51.266 [14] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  52.293 [9]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  53.320 [3]  |∎∎∎∎∎∎
  54.347 [9]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  55.374 [5]  |∎∎∎∎∎∎∎∎∎∎
  56.401 [9]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  57.427 [20] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  58.454 [19] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  59.481 [14] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  60.508 [7]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎

Latency distribution:
  10 % in 50.88 ms 
  25 % in 53.40 ms 
  50 % in 56.81 ms 
  75 % in 57.96 ms 
  90 % in 58.93 ms 
  95 % in 59.52 ms 
  99 % in 60.26 ms 

Status code distribution:
  [OK]   110 responses
```
All requests can be seen to be successful, and we come back to 110 qps.

```shell
$ cd ~/workspace/demo/grpc-limit-demo
# 压测 110 qps，共请求 110 次
$ ghz --insecure --proto=limit.proto --call=proto.limit.Ping -d '{}' -c 110 -n 110  127.0.0.1:8080

Summary:
  Count:        110
  Total:        68.35 ms
  Slowest:      67.53 ms
  Fastest:      58.76 ms
  Average:      58.03 ms
  Requests/sec: 1609.33

Response time histogram:
  58.763 [1]  |∎∎
  59.640 [7]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  60.517 [12] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  61.394 [7]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  62.272 [10] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  63.149 [15] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  64.026 [14] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  64.903 [19] |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  65.780 [9]  |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎
  66.657 [3]  |∎∎∎∎∎∎
  67.534 [3]  |∎∎∎∎∎∎

Latency distribution:
  10 % in 59.81 ms 
  25 % in 60.96 ms 
  50 % in 62.96 ms 
  75 % in 64.52 ms 
  90 % in 65.29 ms 
  95 % in 66.09 ms 
  99 % in 67.03 ms 

Status code distribution:
  [Unavailable]   10 responses    
  [OK]            100 responses   

Error distribution:
  [10]   rpc error: code = Unavailable desc = concurrent connections over limit 
```

It can be seen, when the concurrent output exceeds 100, returns  `rpc error: code = Unavailable desc = concurrent connections over limit`.


## References

1. <a href="https://github.com/rakyll/hey" target="_blank">Lightweight Pressure Tool hey</a>
1. <a href="https://github.com/bojand/ghz" target="_blank">grpc Pressure ghz</a>