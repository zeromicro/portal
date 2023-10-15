---
title: Message queue
slug: /docs/tasks/queue/message-queue
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

The message queue is a way of communicating between applications, enabling asynchronous communication and increasing the availability and scalability of the system.In go-zero, we used <a href="https://github.com/zeromicro/go-queue" target="_blank">go-queue</a>

## Task Targets

- Learn about the basic usage of go-queue
- Learn how to use message queues in go-zero

## Producer

go-queue producers are simple. Only kafka addresses are needed to create a Pusher object.

```go
NewPusher(addrs []string, topic string, opts ...PushOption)
```

### Code Example

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

## Consumer

### Configure Introduction

kq Configuration Structure states the following：

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

service.ServiceConf reference <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">Basic Service Configuration</a>

| <img width={100} />Params | <img width={100} />DataType | <img width={100} />Required? | <img width={100} />Default value | <img width={100} />Note                                  |
| ------------------------------------------ | -------------------------------------------- | --------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------- |
| Brokers                                    | []string                                     | YES                                           |                                                   | kafka cluster address                                                     |
| Group                                      | string                                       | YES                                           |                                                   | Consumer Group                                                            |
| Topic                                      | string                                       | YES                                           |                                                   | Message topic                                                             |
| Offset                                     | string                                       | NO                                            | last                                              | Starting position of consumer consumption, optional values first and last |
| Conns                                      | int                                          | NO                                            | 1                                                 | Number of connections                                                     |
| Consumers                                  | int                                          | NO                                            | 8                                                 | Number of consumers                                                       |
| Processors                                 | int                                          | NO                                            | 8                                                 | Number of Message Processors                                              |
| MinBytes                                   | int                                          | NO                                            | 10240                                             | Minimum number of bytes                                                   |
| MaxBytes                                   | int                                          | NO                                            | 10485760                                          | Maximum number of messages                                                |
| Username                                   | string                                       | NO                                            |                                                   | Username                                                                  |
| Password                                   | string                                       | NO                                            |                                                   | Password                                                                  |
| ForceCommit                                | bool                                         | NO                                            | true                                              | Force Commit or not                                                       |

### Code Example

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
