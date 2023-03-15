---
title: 服务连接
slug: /docs/tutorials/grpc/client/conn
---

## 概述

本文介绍如何使用 zrpc 框架进行 gRPC Client 的开发。

## 示例

**准备工作**

我们执行 `goctl rpc new greet` 生成一个 rpc server 服务。

```bash
# 创建一个 demo 目录，进入 demo 目录
$ mkdir demo && cd demo
# 生成一个 greet 服务
$ goctl rpc new greet
# 新建一个 main.go 文件来创建一个 greet 服务的客户端
$ touch main.go
```

:::tip
以下配置详情请参考 <a href="/docs/tutorials/grpc/client/configuration" target="_blank">服务配置</a>

goctl rpc 指令使用请参考 <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc</a>
:::

## 直连

直连分为两种模式，一种是直连单个服务，一种是直连服务集群。

### 直连单个服务

在 main.go 文件中代码如下

```go
func main() {
    conn := zrpc.MustNewClient(zrpc.RpcClientConf{
        Target: "127.0.0.1:8080",// 单节点直连时，只需要给 Target 配置 rpc server的地址即可
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

### 直连服务集群

在 main.go 文件中代码如下

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

## etcd 服务发现

在 main.go 文件中代码如下

```go
func main() {
    conn := zrpc.MustNewClient(zrpc.RpcClientConf{
        Etcd: discov.EtcdConf{// 通过 etcd 服务发现时，只需要给 Etcd 配置即可
            Hosts:              []string{"127.0.0.1:2379"},
            Key:                "greet.rpc",
            User:               "",// 当 etcd 开启 acl 时才填写，这里为了展示所以没有删除，实际使用如果没有开启 acl 可忽略
            Pass:               "",// 当 etcd 开启 acl 时才填写，这里为了展示所以没有删除，实际使用如果没有开启 acl 可忽略
            CertFile:           "",// 当 etcd 开启 acl 时才填写，这里为了展示所以没有删除，实际使用如果没有开启 acl 可忽略
            CertKeyFile:        "",// 当 etcd 开启 acl 时才填写，这里为了展示所以没有删除，实际使用如果没有开启 acl 可忽略
            CACertFile:         "",// 当 etcd 开启 acl 时才填写，这里为了展示所以没有删除，实际使用如果没有开启 acl 可忽略
            InsecureSkipVerify: false,// 当 etcd 开启 acl 时才填写，这里为了展示所以没有删除，实际使用如果没有开启 acl 可忽略
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

## 原生支持

如果你不想使用 zrpc 的 client 进行初始化，zrpc 也支持 grpc.ClientConn 的原生支持，你可以直接使用 grpc.ClientConn 进行初始化。

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

## 其他服务发现

除了 zrpc 内置的 ectd 作为服务发现外，社区还提供了对 nacos,consul 等的服务发现支持，详情可参考 <a href="https://github.com/zeromicro/zero-contrib/tree/main/zrpc/registry" target="_blank">更多服务发现组件</a>
