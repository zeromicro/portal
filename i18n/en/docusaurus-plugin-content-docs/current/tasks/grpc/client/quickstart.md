---
title: Quick Start
slug: /docs/tasks/grpc/client/quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This paper will describe how to quickly use gRPC customers to connect to rpc.

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
$ touch client.go
```

Reference configuration and content

<Tabs>

<TabItem value="etc/greet-client.yaml" label="etc/greet-client.yaml" default>

```yaml
Target: 127.0.0.1:8080
```

</TabItem>

<TabItem value="client.go" label="client.go" default>

```go
func main() {
    var clientConf zrpc.RpcClientConf
    conf.MustLoad("etc/client.yaml", &clientConf)
    conn := zrpc.MustNewClient(clientConf)
    resp, err := client.Ping(context.Background(), &greet.Request{})
    if err != nil {
        log.Fatal(err)
        return
    }

    log.Println(resp)
}
```

</TabItem>

</Tabs>

:::tip small trick
If you also find it troublesome to write the code, please try goctl scroll code generated, refer to <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc </a>
:::

More gRPC connections (service register, service discovery, cluster direct, intermediate use etc.) can be consulted <a href="/docs/tutorials/grpc/client/conn" target="_blank"> rpc service connection </a>

## References

- <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc code generation </a>
- <a href="/docs/tutorials/grpc/client/configuration" target="_blank"> rpc Client Configuration </a>
- <a href="/docs/tutorials/grpc/client/conn" target="_blank"> rpc Service Connection </a>
