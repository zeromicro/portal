---
title: Message queue
slug: /docs/tutorials/message-queue/kafka
---

## go-queue 之 kq（kafka）

Message queues are essential for large microservice systems, mainly to address peaks, reduce coupling between services and asynchronous capabilities.

go-queue 在 segmentio/kafka-go 这个包基础上，使用 go-zero 进行了上层统一封装，让开发人员更容易上手，将更多时间聚焦在开发业务上。https://github.com/zeromicro/go-queue

### 1.1 Config

```go
type KqConf struct {
   service.ServiceConf
   Brokers    []string
   Group      string
   Topic      string
   Offset     string `json:",options=first|last,default=last"`
   Conns      int    `json:",default=1"`
   Consumers  int    `json:",default=8"`
   Processors int    `json:",default=8"`
   MinBytes   int    `json:",default=10240"`    // 10K
   MaxBytes   int    `json:",default=10485760"` // 10M
   Username   string `json:",optional"`
   Password   string `json:",optional"`
}
```

- Brokers: kafka multiple Broker nodes

- Group：Consumer Group

- Topic: The subscribed topic

- Offset：if the new topic kafka has no offset information or the current offset is invalid (history data is deleted), you need to specify whether to consume from scratch (`first`) or from end(`last`)

- Conns: A kafka queue counterpart can correspond to multiple consumers, Connecs to the number of kafka queue and can be initialized multiple kafka queue, only one by default

- Consumers: go-queue internal is a channel in which multiple goroutine obtains information from kafka into the writing process that controls the number of goroutine here (⚠️ not the amount of concentrates on real consumption)

- Processors: When multiple goroutine among Consumers pulled kafka messages to channels within the process, we write the true consumption message into our own logic, using this parameter to control the amount of congeners currently consumed by the go-queue.

- MinBytes: the minimum number of bytes returned at a time, if this number is not enough.

- MaxBytes: the maximum number of bytes returned at a time. If the first message exceeds this limit, it will continue to pull the guaranteed consumer running. So it is not an absolute configuration, the message size also needs to be covered by the broker's`message.max.bytes`limit, and the top`max.message.bytes`

- Username: kafka account

- Password：kafka password

### 1.2 Use go-queue Producer Pusher in go-Zero

First pull go-queue dependencies in the project

```shell
$ go get github.com/zeromicro/go-queue@latest
```

Add current kafka configuration information to the etc/xxx.yaml configuration file

```yaml
Name: mq
Host: 0.0.0.0
Port: 8888

......

KqPusherConf:
  Brokers:
    - 127.0.0.1:9092
  Topic: payment-success
```

Define configuration of go mapping in config.go under internal/config

```go
type Config struct {
    ......
    KqPusherConf struct {
        Brokers []string
        Topic   string
    }
}
```

Initialize a kq client in svc/serviceContext.go

```go
type ServiceContext struct {
    Config         config.Config
  .....
    KqPusherClient *kq.Pusher
}

func NewServiceContext(c config.Config) *ServiceContext {
    return &ServiceContext{
        Config:         c,
    .....
        KqPusherClient: kq.NewPusher(c.KqPusherConf.Brokers, c.KqPusherConf.Topic),
    }
}
```

Write business logic in logic, using kq client of go-queue to send messages to kafka

```go
.......
func (l *PusherLogic) Pusher() error {

  //......业务逻辑....

    data := "zhangSan"
    if err := l.svcCtx.KqPusherClient.Push(data); err != nil {
        logx.Errorf("KqPusherClient Push Error , err :%v", err)
    }

    return nil
}
```

Also, when we initialize a kq client in svc/serviceContext.go we can pass some optional parameters, kq.NewPusher is a third argument that supports passages

- chunkSize : Due to efficiency problems, kq customers are mass submissions and bulk messages reach this size before they are submitted to kafka.
- flushInterval: How often is flushInterva is submitted.This interval will be submitted to kafka even if the chunkSize is not reached

### 1.3 Use go-queue consumer consumer in go-zero

First pull go-queue dependencies in project

```shell
$ go get github.com/zeromicro/go-queue@latest
```

Add current kafka configuration information to the etc/xxx.yaml configuration file

```yaml
Name: mq
Host: 0.0.0.0
Port: 8888

#kq
KqConsumerConf:
  Name: kqConsumer
  Brokers:
    - 127.0.1:9092
  Group: kqConsumer
  Topic: payment-success
  Offset: first
  Consumers: 8
  Processors: 8
```

Define configuration of go mapping in config.go under internal/config

```go
package config

import (
    "github.com/zeromicro/go-queue/kq"
    "github.com/zeromicro/go-zero/rest"
)

type Config struct {
    rest.RestConf
    .......
    KqConsumerConf kq.KqConf
}
```

Create a mqs folder under internal

Create a new paymentSuccess Consumer paymentSuccess.gounder the mqs folder

```go
package mqs

import (
    "context"
    "github.com/zeromicro/go-zero/core/logx"
    "zerodocgo/internal/svc"
)

type PaymentSuccess struct {
    ctx    context.Context
    svcCtx *svc.ServiceContext
}

func NewPaymentSuccess(ctx context.Context, svcCtx *svc.ServiceContext) *PaymentSuccess {
    return &PaymentSuccess{
        ctx:    ctx,
        svcCtx: svcCtx,
    }
}

func (l *PaymentSuccess) Consume(key, val string) error {
    logx.Infof("PaymentSuccess key :%s , val :%s", key, val)
    return nil
}
```

Create a new file mqs.go under the mqs folder to listen to multiple consumers, mqs.go

```go
package mqs

import (
    "context"
    "zerodocgo/internal/config"
    "zerodocgo/internal/svc"

    "github.com/zeromicro/go-queue/kq"
    "github.com/zeromicro/go-zero/core/service"
)

func Consumers(c config.Config, ctx context.Context, svcContext *svc.ServiceContext) []service.Service {

    return []service.Service{
        //Listening for changes in consumption flow status
        kq.MustNewQueue(c.KqConsumerConf, NewPaymentSuccess(ctx, svcContext)),
        //.....
    }

}
```

Start consumption waiting for consumption in main.go

```go
package main

import (
    "context"
    "flag"
    "github.com/zeromicro/go-zero/core/service"
    "zerodocgo/internal/mqs"
    "zerodocgo/internal/svc"

    "github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/rest"
    "zerodocgo/internal/config"
)

var configFile = flag.String("f", "etc/mq.yaml", "the config file")

func main() {
    flag.Parse()

    var c config.Config
    conf.MustLoad(*configFile, &c)

    server := rest.MustNewServer(c.RestConf)
    defer server.Stop()

    svcCtx := svc.NewServiceContext(c)
    ctx := context.Background()
    serviceGroup := service.NewServiceGroup()
    defer serviceGroup.Stop()

    for _, mq := range mqs.Consumers(ctx, svcCtx) {
        serviceGroup.Add(mq)
    }

    serviceGroup.Start()
}
```

Of course, point arguments in consumer are optional when initializing kq.MustNewQueue in mqs.go

- commitInterval: Commit to kafka broker interval, default is 1s
- queueCapacity：kafka internal queue length
- maxWait：Max time to wait for new data when fetches data from kafka bulks.
- metrics：report consumption time per message, default will initialize internally, and usually no need to specify
