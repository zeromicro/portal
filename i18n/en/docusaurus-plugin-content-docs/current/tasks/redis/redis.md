---
title: Redis Connections
sidebar_label: Redis Connections
slug: /docs/tasks/redis/redis-conn
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This section focuses on the case of redis creating a single node.

## Preparing

1. <a href="/docs/tasks" target="_blank">Complete golang installation</a>
2. Prepare for yourself a redis server, for example we use 127.0.0.1:6379.

## redis configuration description

<a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/conf.go#L16" target="_blank">RedisConf</a> related introduction.

```go
RedisConf struct {
    Host string
    Type string `json:",default=node,options=node|cluster"`
    Pass string `json:",optional"`
    Tls  bool   `json:",optional"`
}

Host: redis service address :port, if redis cluster is ip1:port1,ip2:port2,ip3:port3. .(redis is not supported)
Type: node single nodes redis, cluster reced
Pass: password
Tls: Turn on tls:
```

Initialize redis configuration, we recommend loading using conf.MustLoad for configurations, reference[configuration profiles](/docs/tasks/static/configuration)
```go
conf := redis.RedisConf{
    Host: "127.0.0.1:6379",
    Type: "node",
    Pass: "123456",
    Tls:  false,
}
```

## Create redis instance

Create a redis link using <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/conf.go#L16" target="_blank">MustNewRedis</a>.

```golang
conf := redis.RedisConf{
    Host: "127.0.0.1:6379",
    Type: "node",
    Pass: "123456",
    Tls:  false,
}

rds := redis.MustNewRedis(conf)
```

This way we have finished creating an instance of rds.

## redis Usage

String values are associated to key and extracted from redis.

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


## Full examples below

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
