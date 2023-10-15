---
title: Quick Start
slug: /docs/tasks/grpc/server/quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This paper will describe how to quickly develop a rpc server

## Sample

**Preparation**

We do the following execution to generate a proto file and pb file.

```bash
# Create demo service directory
$ mkdir demo && cd demo
# go mod initializing
$ go mod init demo
# Generate greet. roto file
$ goctl rpc -o greet.proto
# pun pb.go file
$ protoc greet.proto --go_out=. --go-grpc_out=.
# Create client directory
$ mkdir client && cd client
# Add profile
$ mkdir etc && cd etc
$ touch gret-client. aml
# Add client.go file
$ touch server.go
```

yaml configuration content and server.go code below

<Tabs>

<TabItem value="etc/greet-server.yaml" label="etc/greet-server.yaml" default>

```yaml
Name: greet.rpc
ListenOn: 127.0.0.1:8080
```

</TabItem>

<TabItem value="server.go" label="server.go" default>

```go
func main() {
    func main() {
    var serverConf zrpc.RpcServerConf
    conf.MustLoad("etc/greet-server.yaml", &serverConf)
    s := zrpc.MustNewServer(serverConf, func(server *grpc.Server) {
        greet.RegisterGreetServer(server, &exampleServer{})
    })

    defer s.Stop()
    s.Start()
}
}

type exampleServer struct {
    greet.UnimplementedGreetServer
}

func (e *exampleServer) Ping(ctx context.Context, request *greet.Request) (*greet.Response, error) {
    // fill your logic here
    return &greet.Response{}, nil
}
```

</TabItem>

</Tabs>

:::tip small trick
If you also find it troublesome to write the code, please try goctl scroll code generated, refer to <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc </a>
:::

More gRPC usage (service register, service discovery, intermediate use etc.) can be consulted <a href="/docs/tutorials/grpc/server/register" target="_blank"> rpc service registration </a>

## References

- <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc code generation </a>
- <a href="/docs/tutorials/grpc/client/configuration" target="_blank"> rpc Client Configuration </a>
- <a href="/docs/tutorials/grpc/client/conn" target="_blank"> rpc Service Connection </a>
