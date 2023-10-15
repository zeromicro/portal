---
title: gRPC gateway
slug: /docs/tutorials/gateway/grpc
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

With the prevalence of the microservice architecture, the gRPC framework is widely used as a high-performance, cross-language remote process call (RPC).However, gRPC does not apply to all application scenarios.For example, when the client does not support a gRPC protocol or needs to expose the gRPC service to a web application, a way to convert the RESTful API to a gRPC.The gRPC gateway should therefore be created.

## Implementation in gRPC brokered go-Zero

The gRPC gateway in go-Zero is a HTTP server that converts RESTful API into a gRPC request and converts gRPC response to RESTful API.The process is as follows:：

1. Resolves the definition of a gRPC service from proto file.
2. Resolve HTTP mapping rules for gRPC services from the configuration file.
3. Generate HTTP processor for gRPC services based on the definition of a gRPC service and HTTP mapping rules.
4. Start HTTP server, handle HTTP requests.
5. Convert HTTP request to a gRPC request.
6. Convert gRPC response to HTTP response.
7. Return HTTP response.

Details can be consulted <a href="https://github.com/zeromicro/go-zero/tree/master/gateway" target="_blank">gateway</a>.

## Configure Introduction

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

| <img width={100} />Name | Note                       | DataType   | Required? | Sample                             |
| ---------------------------------------- | -------------------------- | ---------- | --------- | ---------------------------------- |
| RestConf                                 | rest Service Configuration | RestConf   | YES       | Reference<a href="/docs/tutorials/go-zero/configuration/service" target="_blank">Basic Service Configuration</a> |
| Upstreams                                | gRPC Service Configuration | []Upstream | YES       |                                    |
| Timeout                                  | Timeout time               | duration   | NO        | `5s`                               |

### Upstream

| <img width={100} />Name | Note                                                 | DataType       | Required? | Sample                             |
| ---------------------------------------- | ---------------------------------------------------- | -------------- | --------- | ---------------------------------- |
| Name                                     | Service Name                                         | string         | NO        | `demo1-gateway`                    |
| Grpc                                     | gRPC Service Configuration                           | RpcClientConf  | YES       | Reference<a href="/docs/tutorials/grpc/server/configuration/service" target="_blank">RPC configuration</a> |
| ProtoSets                                | proto file list                                      | []string       | NO        | `["hello.pb"]`                     |
| Mappings                                 | Route mapping, do not fill by default all grpc paths | []RouteMapping | NO        |                                    |

### RouteMapping

| <img width={100} />Name | Note         | DataType | Required? | Sample             |
| ---------------------------------------- | ------------ | -------- | --------- | ------------------ |
| Method                                   | HTTP methods | string   | YES       | `get`              |
| Path                                     | HTTP Path    | string   | YES       | `/ping`            |
| RpcPath                                  | gRPC Path    | string   | YES       | `hello.Hello/Ping` |

## Examples

In go-zero, there are two ways to use gRPC gateways: protoDescriptor and grpcReflection.

<Tabs>
<TabItem value="protoDescriptor" label="protoDescriptor" default>

protoDescriptor method requires proto to be a pb file via protoc and then reference the pb file to rest-grpc rule in gateway.

:::tip
go-zero sdk version v1.5.0 gateway configuration will cause configuration conflicts, please avoid this version, the current example is using v1.4.4 version
:::  

1. We create a new project, demo1, and a new hello.proto file in demo1, as follows:

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

2. Create the `gateway` directory in the `demo1` directory, and then execute the following command in the `demo1` directory to generate the protoDescriptor:

```bash
protoc --descriptor_set_out=gateway/hello.pb hello.proto
```

3. Generate the grpc service code by executing the following command in the `demo1` directory:

```bash
goctl rpc protoc hello.proto --go_out=server --go-grpc_out=server --zrpc_out=server
```

Populate the logic for the `Ping` method in `demo1/server/internal/logic/pinglogic.go` with the following code:

```go
func (l *PingLogic) Ping(in *hello.Request) (*hello.Response, error) {
    return &hello.Response{
        Msg: "pong",
    }, nil
}
```

4. Modify the configuration file `demo1/server/etc/hello.yaml` to read as follows:

```yaml
Name: hello.rpc
ListenOn: 0.0.0.0:8080
```

5. Go to the `demo1/gateway` directory, create the directory `etc`, and add the configuration file `gateway.yaml`, as follows:

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

6. Go to the `demo1/gateway` directory and create a new `gateway.go` file with the following contents:

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

7. Open two separate terminals to start the grpc server service and the gateway service, and then visit `http://localhost:8888/ping`:

```bash
# Go to the demo1/server directory and start the grpc service
$ go run hello.go
Starting rpc server at 0.0.0.0:8080...
```

```bash
# Go to the demo1/gateway directory and start the gateway service
$ go run gateway.go
```

```bash
# Open a new terminal and access the gateway service
$ curl http://localhost:8888/ping
{"msg":"pong"}%
```

</TabItem>

<TabItem value="grpcReflection" label="grpcReflection" default>

The grpcReflection method is similar to the protoDescriptor method. Unlike the grpcReflection method does not require proto to be produced as a pb file through protoc but takes proto from the grpc server directly and then quotes the proto file for rest-grpc rule in gateway.

1. We create a new project, demo2, and a new hello.proto file in demo2, as follows:

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

2. Create a `gateway` directory under the `demo2` directory for backup

3. Generate the grpc service code by executing the following command in the `demo2` directory:

```bash
goctl rpc protoc hello.proto --go_out=server --go-grpc_out=server --zrpc_out=server
```

Populate the logic for the `Ping` method in `demo2/server/internal/logic/pinglogic.go` with the following code:

```go
func (l *PingLogic) Ping(in *hello.Request) (*hello.Response, error) {
    return &hello.Response{
        Msg: "pong",
    }, nil
}
```

Modify the configuration file `demo2/server/etc/hello.yaml` as follows:

```yaml {3}
Name: hello.rpc
ListenOn: 0.0.0.0:8080
Mode: dev
```

:::tip
Since the grpc reflection mode is currently only supported by the `dev` and `test` environments, you need to set `Mode` to `dev` or `test` here.
:::  

4. Go to the `demo2/gateway` directory, create the directory `etc`, and add the configuration file `gateway.yaml`, as follows:

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

5. Go to the `demo2/gateway` directory and create a new `gateway.go` file with the following contents:

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

6. Open two separate terminals to start the grpc server service and the gateway service, and then visit `http://localhost:8888/ping`:

```bash
# Go to the demo1/server directory and start the grpc service
$ go run hello.go
Starting rpc server at 0.0.0.0:8080...
```

```bash
# Go to the demo1/gateway directory and start the gateway service
$ go run gateway.go
```

```bash
# Open a new terminal and access the gateway service
$ curl http://localhost:8888/ping
{"msg":"pong"}%
```

</TabItem>
</Tabs>

## References

- <a href="https://github.com/zeromicro/go-zero/tree/master/gateway" target="_blank">go-zero • gateway</a>
- <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">go-zero Basic Service Configuration</a>
- <a href="/docs/tutorials/grpc/server/configuration/service" target="_blank">go-zero • grpc configuration</a>
