---
title: 消息队列
slug: /docs/tasks/queue/message-queue
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

消息队列是一种应用程序间通信的方式，它可以实现异步通信，提高系统的可用性和可扩展性。在 go-zero 中，我们使用了 <a href="https://github.com/zeromicro/go-queue" target="_blank">go-queue</a>

## 任务目标

- 了解 go-queue 的基本使用
- 了解如何在 go-zero 中使用消息队列

## 生产者

go-queue 生产者很简单，只需要 kafka 地址，topic 即可创建一个 Pusher 对象。

```go
NewPusher(addrs []string, topic string, opts ...PushOption)
```

### 代码示例

```go
pusher := kq.NewPusher([]string{
    "127.0.0.1:19092",
    "127.0.0.1:19093",
    "127.0.0.1:19094",
}, "test")

if err:=pusher.Push("foo");err!=nil{
    log.Fatal(err)
}
```

## 消费者

### 配置介绍

kq 的配置结构体声明如下：

```go
type KqConf struct {
 service.ServiceConf
 Brokers     []string
 Group       string
 Topic       string
 Offset      string `json:",options=first|last,default=last"`
 Conns       int    `json:",default=1"`
 Consumers   int    `json:",default=8"`
 Processors  int    `json:",default=8"`
 MinBytes    int    `json:",default=10240"`    // 10K
 MaxBytes    int    `json:",default=10485760"` // 10M
 Username    string `json:",optional"`
 Password    string `json:",optional"`
 ForceCommit bool   `json:",default=true"`
}
```

service.ServiceConf 请参考 <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">基础服务配置</a>

| <img width={100}/>参数 | <img width={100}/>类型 | <img width={100}/>是否必填 | <img width={100}/>默认值 | <img width={100}/>说明 |
| --- | --- | --- | --- | --- |
| Brokers | []string | 是 |  | kafka 集群地址 |
| Group | string | 是 |  | 消费者组 |
| Topic | string | 是 |  | 消息主题 |
| Offset | string | 否 | last | 消费者消费的起始位置，可选值为 first 和 last |
| Conns | int | 否 | 1 | 连接数 |
| Consumers | int | 否 | 8 | 消费者数 |
| Processors | int | 否 | 8 | 消息处理器数 |
| MinBytes | int | 否 | 10240 | 消息最小字节数 |
| MaxBytes | int | 否 | 10485760 | 消息最大字节数 |
| Username | string | 否 |  | 用户名 |
| Password | string | 否 |  | 密码 |
| ForceCommit | bool | 否 | true | 是否强制提交 |

### 代码示例

<Tabs>

<TabItem value="config.yaml" label="config.yaml" default>

```yaml
Name: kq
Brokers:
- 127.0.0.1:19092
- 127.0.0.1:19093
- 127.0.0.1:19094
Group: foo
Topic: test
Offset: first
Consumers: 1

```

</TabItem>

<TabItem value="main.go" label="main.go" default>

```go
package main

import (
 "fmt"

 "github.com/zeromicro/go-queue/kq"
 "github.com/zeromicro/go-zero/core/conf"
)

func main() {
 var c kq.KqConf
 conf.MustLoad("config.yaml", &c)

 q := kq.MustNewQueue(c, kq.WithHandle(func(k, v string) error {
  fmt.Printf("=> %s\n", v)
  return nil
 }))
 defer q.Stop()
 q.Start()
}
```

</TabItem>
</Tabs>
