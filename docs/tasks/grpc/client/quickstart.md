---
title: 快速开始
slug:  /docs/tasks/grpc/client/quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本文将介绍如何快速使用 gRPC client 连接 rpc。

## 示例

**准备工作**

事先我们执行如下执行生成一个 proto 文件及其 pb 文件。

```bash
# 创建 demo 服务目录
$ mkdir demo && cd demo
# go mod 初始化
$ go mod init demo
# 生成 greet.proto 文件
$ goctl rpc -o greet.proto
# 生 pb.go 文件
$ protoc greet.proto --go_out=. --go-grpc_out=.
# 创建 client 目录
$ mkdir client && cd client
# 新增配置文件
$ mkdir etc && cd etc
$ touch greet-client.yaml
# 新增 client.go 文件
$ touch client.go
```

参考配置及内容如下

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

:::tip 小技巧
如果你也觉得这样写代码很麻烦，不妨试试 goctl 脚手架代码生成，详情可参考 <a href="/docs/tutorials/cli/rpc" target="_blank"> goctl rpc </a>
:::

更多 gRPC 连接(服务注册、服务发现、集群直连、中间件使用等)可参考 <a href="/docs/tutorials/grpc/client/conn" target="_blank"> rpc 服务连接 </a>

## 参考文献

- <a href="/docs/tutorials/cli/rpc" target="_blank"> 《goctl rpc 代码生成》 </a>
- <a href="/docs/tutorials/grpc/client/configuration" target="_blank"> 《rpc 客户端配置》 </a>
- <a href="/docs/tutorials/grpc/client/conn" target="_blank"> 《rpc 服务连接》 </a>
