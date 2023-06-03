---
title: Service Connection
slug: /docs/tutorials/grpc/client/conn
---

## Overview

This paper describes how to use the gRPC framework for the development of GRPC Client.

## Sample

**Preparation**

We run `goctl rpc new greet` to generate a rpc server service.

```bash
# Create a demo directory, Enter the demo directory
$ mkdir demo && cd demo
# Generate a gret service
$ goctl rpc new greet
# Create a new main. o File to create a client for a greet service
$ touch main.go
```

:::tip
The following configuration details are referenced <a href="/docs/tutorials/grpc/client/configuration" target="_blank">service configuration</a>

goctl rpc usage reference <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc</a>
:::

## Direct

There are two modes of continuous connectivity, one for a single service and one for a continual service cluster.

### Address resolve mode

In main.go file the following code

```go
func main() {
    conn := zrpc.MustNewClient(zrpc.RpcClientConf{
        Target: "dns:///127.0.0.1:8080",
    })
    client := greet.NewGreetClient(conn.Conn())
    resp, err := client.Ping(context.Background(), &greet.Request{})
    if err != nil {
        log.Println(err)
        return
    }
    log.Println(resp)
}
```

### Multi-node direct connection mode

In main.go file the following code

```go
func main() {
    conn := zrpc.MustNewClient(zrpc.RpcClientConf{
        Endpoints: []string{"127.0.0.1:8080","127.0.0.2:8080"},// 直连集群时，只需要给 Endpoints 配置 rpc server的地址即可
    })
    client := greet.NewGreetClient(conn.Conn())
    resp, err := client.Ping(context.Background(), &greet.Request{})
    if err != nil {
        log.Println(err)
        return
    }
    log.Println(resp)
}
```

## etcd service discovery

In main.go file the following code

```go
func main() {
    conn := zrpc.MustNewClient(zrpc.RpcClientConf{
        Etcd: discov.EtcdConf{// When discovering via the etcd service, you only need to configure Etcd
            Hosts:              []string{"127.0.0.1:2379"},
            Key:                "greet.rpc",
            User:               "",// When etcd opens acl, it is filled in, so it is not deleted here for the sake of demonstration, and can be ignored if acl is not opened for actual use.
            Pass:               "",// When etcd opens acl, it is filled in, so it is not deleted here for the sake of demonstration, and can be ignored if acl is not opened for actual use.
            CertFile:           "",// When etcd opens acl, it is filled in, so it is not deleted here for the sake of demonstration, and can be ignored if acl is not opened for actual use.
            CertKeyFile:        "",// When etcd opens acl, it is filled in, so it is not deleted here for the sake of demonstration, and can be ignored if acl is not opened for actual use.
            CACertFile:         "",// When etcd opens acl, it is filled in, so it is not deleted here for the sake of demonstration, and can be ignored if acl is not opened for actual use.
            InsecureSkipVerify: false,// When etcd opens acl, it is filled in, so it is not deleted here for the sake of demonstration, and can be ignored if acl is not opened for actual use.
        },
    })
    client := greet.NewGreetClient(conn.Conn())
    resp, err := client.Ping(context.Background(), &greet.Request{})
    if err != nil {
        log.Println(err)
        return
    }
    log.Println(resp)
}
```

## Native Support

If you do not want to initialize using a go-zero repc client, zrpc also supports grpc.ClientConn, you can use grpc.ClientConn directly.

```go
func main() {
    conn,err:=grpc.Dial("127.0.0.1:8080",grpc.WithBlock(), grpc.WithTransportCredentials(insecure.NewCredentials()))
    if err!=nil{
        log.Println(err)
        return
    }
    client := greet.NewGreetClient(conn)
    resp, err := client.Ping(context.Background(), &greet.Request{})
    if err != nil {
        log.Println(err)
        return
    }
    log.Println(resp)
}
```

## Other Service Discoveries

In addition to a go-zero built-in ecd as a service, the community also provides support for the discovery of services such as nacos, consul, etc. More Services found components <a href="https://github.com/zeromicro/zero-contrib/tree/main/zrpc/registry" target="_blank">for details</a>
