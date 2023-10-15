---
title: Redis 锁 
sidebar_label: Redis 锁 
slug: /docs/tutorials/redis/redis-lock
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本章节主要介绍通过 redis 组件，创建分布式锁的使用。

## 准备条件

1. <a href="/docs/tasks" target="_blank">完成 golang 安装</a>
2. 启动 redis 服务
3. <a href="/docs/tasks/redis/redis-conn" target="_blank">完成 redis 连接创建</a>

## 说明

1. 随机版本号，防止过期误释放。
2. 可重入，自动续约。

## 方法说明

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/redislock.go#L46" target="_blank">NewRedisLock</a>

```golang
函数签名: 
    NewRedisLock func(store *Redis, key string) *RedisLock 
说明: 
    1. 删除单条记录，同时会清理 key 缓存
    2. 默认过期时间 1500 ms
入参:
    1. store: redis 实例
    2. key: key
返回值:
    1. *RedisLock: redis locker 实例
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/redislock.go#L104" target="_blank">SetExpire</a>

```golang
函数签名: 
    SetExpire func(seconds int)
说明: 
    1. 设置过期时间
入参:
    1. seconds: 过期时间，单位 秒
```

3. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/redislock.go#L55" target="_blank">Acquire</a>

```golang
函数签名: 
    Acquire func() (bool, error)
说明: 
    1. 获取锁
返回值:
    1. bool: 是否拿到锁
    2. error: 操作error
```

4. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/redislock.go#L60" target="_blank">AcquireCtx</a>

```golang
函数签名: 
    AcquireCtx func(ctx context.Context) (bool, error)
说明: 
    1. 获取锁
入参:
    1. ctx: context
返回值:
    1. bool: 是否拿到锁
    2. error: 操作error
```

5. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/redislock.go#L83" target="_blank">Release</a>

```golang
函数签名: 
    Release func() (bool, error)
说明: 
    1. 释放锁
返回值:
    1. bool: 锁是否被主动释放
    2. error: 操作error
```

6. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/redislock.go#L89" target="_blank">ReleaseCtx</a>

```golang
函数签名: 
    ReleaseCtx func(ctx context.Context) (bool, error)
说明: 
    1. 释放锁
入参:
    1. ctx: context
返回值:
    1. bool: 锁是否被主动释放
    2. error: 操作error
```

## 使用 demo

```go
{
    conf := RedisConf{
  Host: "127.0.0.1:55000",
  Type: "node",
  Pass: "123456",
  Tls:  false,
 }

 rds := MustNewRedis(conf)

 lock := NewRedisLock(rds, "test")

     // 设置过期时间
 lock.SetExpire(10)

    // 尝试获取锁
 acquire, err := lock.Acquire()

 switch {
 case err != nil:
  // deal err
 case acquire:
  // 获取到锁
  defer lock.Release() // 释放锁
  // 业务逻辑
  
 case !acquire:
  // 没有拿到锁 wait?
 }
}
```
