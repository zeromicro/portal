---
title: Delay Queue
slug: /docs/tasks/queue/delay-queue
---

## Overview

Delay queue is a special queue whose elements can only be consumed after the specified delay has arrived.Delayed queue implementation usually relies on a scheduled task, which regularly scan elements in the queue, move expired elements to another queue, from which consumers consume.

In go-zero we use <a href="https://github.com/zeromicro/go-queue" target="_blank">go-queue</a> to achieve delay queue

## Task Targets

- Learn about the basic usage of go-queue
- Learn how to use the delay queue in go-zero

## Preparing

- Install <a href="https://beanstalkd.github.io/download.html" target="_blank">beanstalkd</a>

## Producer

dq Producer is simple and needs only beanstalkd addresses, tube can create a producer object.

```go
type Beanstalk struct {
  Endpoint string // beanstalkd server address
  Tube     string // tube name
}

NewProducer(beanstalks []Beanstalk) Producer
```

### Code Example

```go
package main

import (
    "fmt"
    "strconv"
    "time"

    "github.com/zeromicro/go-queue/dq"
)

func main() {
    producer := dq.NewProducer([]dq.Beanstalk{
        {
            Endpoint: "localhost:11300",
            Tube:     "tube",
        },
        {
            Endpoint: "localhost:11301",
            Tube:     "tube",
        },
    })

    _, err := producer.Delay([]byte("hello"), time.Second*5)
    if err != nil {
        fmt.Println(err)
    }

    _, err = producer.At([]byte("hello"), time.Now().Add(time.Second*10))
    if err != nil {
        fmt.Println(err)
    }
}

```

## Consumer

### Configure Introduction

```go
type DqConf struct {
  Beanstalks []Beanstalk
  Redis      redis.RedisConf
}

type Beanstalk struct {
  Endpoint string // beanstalkd server address
  Tube     string // tube name
}
```

| <img width={100} />Params | <img width={100} />DataType | <img width={100} />Required? | <img width={100} />Default value | <img width={100} />Note                |
| ------------------------------------------ | -------------------------------------------- | --------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| Beanstalks                                 | []Beanstalk                                  | YES                                           |                                                   | beanstalkd configuration                                |
| Redis                                      | RedisConf                                    | YES                                           |                                                   | redis configuration, reference<a href="/docs/tutorials/go-zero/configuration/redis" target="_blank">Redis configuration</a> |

**Beanstalk**

| <img width={100} />Params | <img width={100} />DataType | <img width={100} />Required? | <img width={100} />Default value | <img width={100} />Note |
| ------------------------------------------ | -------------------------------------------- | --------------------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| Endpoint                                   | string                                       | YES                                           |                                                   | beanstalkd address                       |
| Tube                                       | string                                       | YES                                           |                                                   | tube name                                |

### Sample

```go
package main

import (
    "fmt"

    "github.com/zeromicro/go-queue/dq"
    "github.com/zeromicro/go-zero/core/stores/redis"
)

func main() {
    consumer := dq.NewConsumer(dq.DqConf{
        Beanstalks: []dq.Beanstalk{
            {
                Endpoint: "localhost:11300",
                Tube:     "tube",
            },
            {
                Endpoint: "localhost:11301",
                Tube:     "tube",
            },
        },
        Redis: redis.RedisConf{
            Host: "localhost:6379",
            Type: redis.NodeType,
        },
    })
    consumer.Consume(func(body []byte) {
        fmt.Println(string(body))
    })
}
```

## References

1. <a href="https://github.com/beanstalkd/go-beanstalk" target="_blank">go-beanstalk:</a>
1. <a href="https://beanstalkd.github.io/" target="_blank">Beanstalkd</a>
