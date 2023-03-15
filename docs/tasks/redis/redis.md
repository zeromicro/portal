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
2. 启动 redis 服务

## redis 配置说明

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/conf.go#L16" target="_blank">RedisConf</a>

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

## 创建 redis 实例

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/conf.go#L16" target="_blank">MustNewRedis</a>

```golang
函数签名:
    MustNewRedis func(conf RedisConf, opts ...Option) *Redis
说明:
    1. 创建 redis 实例。
    2. 如果配置存在问题或者 redis server 连接失败，会终止执行。
入参:
    1. conf: redis 配置
    2. opts: 创建选项
返回值:
    1. *Redis: redis 实例

示例:
conf := RedisConf{
	Host: "127.0.0.1:6379",
	Type: "node",
	Pass: "123456",
	Tls:  false,
}

rds := MustNewRedis(conf)
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/conf.go#L16" target="_blank">NewRedis</a>

```golang
函数签名:
    NewRedis func(conf RedisConf, opts ...Option) (*Redis, error)
说明:
    1. 创建 redis 实例。
    2. 如果配置存在问题或者 redis server 连接失败，会返回 error。
入参:
    1. conf: redis 配置
    2. opts: 创建选项
返回值:
    1. *Redis: redis 实例
    2. error: 结果

示例:
conf := RedisConf{
	Host: "127.0.0.1:6379",
	Type: "node",
	Pass: "123456",
	Tls:  false,
}

rds, err := NewRedis(conf)
if err != nil {
    // deal error
}
```
