---
title: 限流(并发控制)
slug: /docs/tutorials/service/governance/limiter
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

限流器是一种服务治理能力，用于限制服务的并发调用量，以保护服务的稳定性。在本次文档中仅介绍对 rest，grpc 服务的限流器的使用，不介绍限流算法。

限流一般有单节点限流、集群限流（将限流数值对集群节点数求平均值，其本质还是单节点限流）、分布式限流。

本次介绍的是单节点限流，与其说是限流，倒不如说是并发控制更贴切。

## 准备工作

1. 创建一个 go mod 的 demo 工程

```shell
$ mkdir -p ~/workspace/demo && cd ~/workspace/demo
$ go mod init demo
```

## rest 服务

### 限流配置

```go
RestConf struct {
    ...
    MaxConns int    `json:",default=10000"` // 最大并发连接数，默认值为 10000 qps
    ... 
}
```

### 示例

  我们用一个 demo 来介绍一下限流器的使用。

1. 在 `demo` 工程中新建目录 `rest-limit-demo`

    ```shell
    $ cd ~/workspace/demo
    $ mkdir rest-limit-demo && cd rest-limit-demo
    ```

2. 新建一个 `limit.api` 文件，将如下内容拷贝到文件中

    ```go title="limit.api"
    syntax = "v1"

    service limit {
      @handler ping
      get /ping
    }
    ```

3. 生成 rest 代码

    ```shell
    $ cd ~/workspace/demo/rest-limit-demo
    $ goctl api go -api limit.api -dir .
    ```

4. 查看目录结构

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

  我们修改一下配置，将 qps 限制为 100，然后逻辑中加一点阻塞逻辑。

1. 修改配置文件

    将 `~/workspace/demo/rest-limit-demo/etc/limit.yaml` 中的 `maxConns` 修改为 100

2. 添加逻辑代码

  将 `~/workspace/demo/rest-limit-demo/internal/logic/pinglogic.go` 中的 `Ping` 方法添加阻塞逻辑

  最终代码内容如下

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

我们先来运行一下这个最简单的 rest 服务，我们用 <a href="https://github.com/rakyll/hey" target="_blank">hey</a> 工具来简单压测一下接口。

先启动服务

```shell
$ cd ~/workspace/demo/rest-limit-demo
$ go run limit.go
```

单独开个终端压测

```shell
# 我们用 hey 工具来进行压测，压测 90 个并发，执行 1 秒
$ hey -z 1s -c 90 -q 1 'http://localhost:8888/ping'

Summary:
  Total:	1.1084 secs
  Slowest:	0.1066 secs
  Fastest:	0.0607 secs
  Average:	0.0890 secs
  Requests/sec:	81.1980


Response time histogram:
  0.061 [1]	|■
  0.065 [2]	|■■■
  0.070 [8]	|■■■■■■■■■■■
  0.074 [13]	|■■■■■■■■■■■■■■■■■
  0.079 [5]	|■■■■■■■
  0.084 [0]	|
  0.088 [0]	|
  0.093 [2]	|■■■
  0.097 [23]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.102 [30]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.107 [6]	|■■■■■■■■


Latency distribution:
  10% in 0.0682 secs
  25% in 0.0742 secs
  50% in 0.0961 secs
  75% in 0.0983 secs
  90% in 0.0996 secs
  95% in 0.1039 secs
  0% in 0.0000 secs

Details (average, fastest, slowest):
  DNS+dialup:	0.0054 secs, 0.0607 secs, 0.1066 secs
  DNS-lookup:	0.0000 secs, 0.0000 secs, 0.0000 secs
  req write:	0.0002 secs, 0.0000 secs, 0.0011 secs
  resp wait:	0.0832 secs, 0.0576 secs, 0.0942 secs
  resp read:	0.0001 secs, 0.0000 secs, 0.0012 secs

Status code distribution:
  [200]	90 responses
```

从压测结果来看，90 个请求全部成功，我们来加大并发数，看看会发生什么。

```shell
# 我们用 hey 工具来进行压测，压测 110 个并发，执行 1 秒
$ hey -z 1s -c 110 -q 1 'http://127.0.0.1:8888/ping'

Summary:
  Total:	1.0833 secs
  Slowest:	0.0756 secs
  Fastest:	0.0107 secs
  Average:	0.0644 secs
  Requests/sec:	101.5403


Response time histogram:
  0.011 [1]	|■
  0.017 [9]	|■■■■■■■
  0.024 [0]	|
  0.030 [0]	|
  0.037 [0]	|
  0.043 [0]	|
  0.050 [0]	|
  0.056 [0]	|
  0.063 [2]	|■■
  0.069 [45]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  0.076 [53]	|■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


Latency distribution:
  10% in 0.0612 secs
  25% in 0.0665 secs
  50% in 0.0690 secs
  75% in 0.0726 secs
  90% in 0.0737 secs
  95% in 0.0740 secs
  99% in 0.0756 secs

Details (average, fastest, slowest):
  DNS+dialup:	0.0040 secs, 0.0107 secs, 0.0756 secs
  DNS-lookup:	0.0000 secs, 0.0000 secs, 0.0000 secs
  req write:	0.0001 secs, 0.0000 secs, 0.0025 secs
  resp wait:	0.0602 secs, 0.0064 secs, 0.0741 secs
  resp read:	0.0000 secs, 0.0000 secs, 0.0001 secs

Status code distribution:
  [200]	100 responses
  [503]	10 responses
```

从压测结果来看，我们的服务只能支持 100 个并发，超过 100 个并发的请求都会被限流，返回 503 状态码。
在服务的日志中也会出现限流相关的错误：

```shell
{"@timestamp":"2023-02-09T18:41:55.500+08:00","caller":"internal/log.go:62","content":"(/ping - 127.0.0.1:64163) concurrent connections over 100, rejected with code 503","level":"error","span":"08fa61d49b694e63","trace":"622b2287f32ff2d45f4dfce3eec8e62c"}
```

## grpc 服务

grpc 服务属于内网服务，不对外提供服务，只对内部的其他服务提供服务，所以我们默认情况下不需要对其进行限流。

如果真要对其进行限流，可以通过 grpc 中间件来实现，参考示例如下。

我们用一个最简单的 grpc server 服务来演示一下。

1. 在 `demo` 工程中新建目录 `grpc-limit-demo`

    ```shell
    $ cd ~/workspace/demo
    $ mkdir grpc-limit-demo && cd grpc-limit-demo
    ```

2. 新建一个 `limit.proto` 文件，将如下内容拷贝到文件中

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

3. 生成 grpc 代码

    ```shell
    $ cd ~/workspace/demo/grpc-limit-demo
    $ goctl rpc protoc limit.proto --go_out=.  --go-grpc_out=.  --zrpc_out=.
    ```

4. 查看目录

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

    我们在 `~/workspace/demo/grpc-limit-demo/internal/logic/limitlogic.go` 中实现 `Ping` 方法，代码如下：

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

5. 在 `~/workspace/demo/grpc-limit-demo/limit.go` 中添加中间件：

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

我们将生成的配置文件 `~/workspace/demo/grpc-limit-demo/etc/limit.yaml` 文件中的 etcd 配置删除掉，用直连的方式来启动 grpc server。

```yaml title="limit.yaml"
Name: limit.rpc
ListenOn: 0.0.0.0:8080

```

启动服务

```shell
$ cd ~/workspace/demo/grpc-limit-demo
$ go run limit.go
```

现在 grpc server 服务有了，我们用 <a href="https://github.com/bojand/ghz" target="_blank">ghz</a> 来压测一下 。

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

可以看到所有的请求都是成功的，我们再来压测 110 qps。

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

可以看到，当并发量超过 100 时，就会返回 `rpc error: code = Unavailable desc = concurrent connections over limit`。

## 参考文献

1. <a href="https://github.com/rakyll/hey" target="_blank">《轻量级压测工具 hey》</a>
1. <a href="https://github.com/bojand/ghz" target="_blank">《grpc 压测工作 ghz》</a>
