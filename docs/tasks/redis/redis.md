---
title: Redis 连接
sidebar_label: Redis 连接
slug: /docs/tasks/redis/redis-conn
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本章节主要介绍创建单节点的 redis 实例。

## 准备条件

1. <a href="/docs/tasks" target="_blank">完成 golang 安装</a>
2. 自行准备一个 redis server，我们以 127.0.0.1:6379 为例。

## redis 配置说明

<a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/conf.go#L16" target="_blank">RedisConf</a> 相关介绍。

```go
RedisConf struct {
 Host string
 Type string `json:",default=node,options=node|cluster"`
 Pass string `json:",optional"`
 Tls  bool   `json:",optional"`
}

Host: redis 服务地址 ip:port, 如果是 redis cluster 则为 ip1:port1,ip2:port2,ip3:port3...(暂不支持redis sentinel)
Type: node 单节点 redis，cluster redis 集群
Pass: 密码
Tls: 是否开启tls
```

初始化 redis 配置, 当然我们推荐使用 conf.MustLoad 进行配置的加载，可参考[配置文件](/docs/tasks/static/configuration)

```go
conf := redis.RedisConf{
    Host: "127.0.0.1:6379",
    Type: "node",
    Pass: "123456",
    Tls:  false,
}
```

## 创建 redis 实例

使用 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/conf.go#L16" target="_blank">MustNewRedis</a> 创建一个redis 链接。

```golang
conf := redis.RedisConf{
 Host: "127.0.0.1:6379",
 Type: "node",
 Pass: "123456",
 Tls:  false,
}

rds := redis.MustNewRedis(conf)
```

这样我们就完成了 rds 的实例创建。

## redis 使用

字符串值 value 关联到 key， 并从 redis 取出对应的值。

```go
    ctx := context.Background()
 err := rds.SetCtx(ctx, "key", "hello world")
 if err != nil {
  logc.Error(ctx, err)
 }

 v, err := rds.GetCtx(ctx, "key")
 if err != nil {
  logc.Error(ctx, err)
 }
 fmt.Println(v)
```

## 完整的实例如下

```go
package main

import (
 "context"
 "fmt"
 "time"

 "github.com/zeromicro/go-zero/core/logc"
 "github.com/zeromicro/go-zero/core/stores/redis"
)

func main() {
 conf := redis.RedisConf{
  Host:        "127.0.0.1:6379",
  Type:        "node",
  Pass:        "",
  Tls:         false,
  NonBlock:    false,
  PingTimeout: time.Second,
 }
 rds := redis.MustNewRedis(conf)
 ctx := context.Background()
 err := rds.SetCtx(ctx, "key", "hello world")
 if err != nil {
  logc.Error(ctx, err)
 }

 v, err := rds.GetCtx(ctx, "key")
 if err != nil {
  logc.Error(ctx, err)
 }
 fmt.Println(v)
}

```
