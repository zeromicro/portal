---
title: 消息队列
slug: /docs/tutorials/message-queue/kafka
---

## go-queue 之 kq（kafka）

消息队列对于大型微服务系统是必不可少的，主要是用来解决削峰、降低服务之间的耦合度以及异步能力。

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

- Brokers: kafka 的多个 Broker 节点

- Group：消费者组

- Topic：订阅的 Topic 主题

- Offset：如果新的 topic kafka 没有对应的 offset 信息,或者当前的 offset 无效了(历史数据被删除),那么需要指定从头(`first`)消费还是从尾(`last`)部消费

- Conns: 一个 kafka queue 对应可对应多个 consumer，Conns 对应 kafka queue 数量，可以同时初始化多个 kafka queue，默认只启动一个

- Consumers : go-queue 内部是起多个 goroutine 从 kafka 中获取信息写入进程内的 channel，这个参数是控制此处的 goroutine 数量（⚠️ 并不是真正消费时的并发 goroutine 数量）

- Processors: 当 Consumers 中的多个 goroutine 将 kafka 消息拉取到进程内部的 channel 后，我们要真正消费消息写入我们自己逻辑，go-queue 内部通过此参数控制当前消费的并发 goroutine 数量

- MinBytes: fetch 一次返回的最小字节数,如果不够这个字节数就等待.

- MaxBytes: fetch 一次返回的最大字节数,如果第一条消息的大小超过了这个限制仍然会继续拉取保证 consumer 的正常运行.因此并不是一个绝对的配置,消息的大小还需要受到 broker 的`message.max.bytes`限制,以及 topic 的`max.message.bytes`的限制

- Username: kafka 的账号

- Password：kafka 的密码

### 1.2 go-zero 中使用 go-queue 生产者 pusher

项目中首先要拉取 go-queue 的依赖

```shell
$ go get github.com/zeromicro/go-queue@latest
```

在 etc/xxx.yaml 配置文件中添加当前的 kafka 配置信息

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

在 internal/config 下的 config.go 中定义 go 映射的配置

```go
type Config struct {
    ......
    KqPusherConf struct {
        Brokers []string
        Topic   string
    }
}
```

在 svc/serviceContext.go 中初始化 pusher 的 kq client

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

在 logic 中写业务逻辑使用 go-queue 的 kq client 发送消息到 kafka

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

另外，我们在 svc/serviceContext.go 中初始化 pusher 的 kq client 时候，我们可以传递一些可选参数，kq.NewPusher 第三个参数是 options，就是支持传递的可选参数

- chunkSize : 由于效率问题，kq client 是批量提交，批量消息体达到此大小才会提交给 kafka。
- flushInterval：间隔多久提交一次。即使未达到 chunkSize 但是达到了这个间隔时间也会向 kafka 提交

### 1.3 go-zero 中使用 go-queue 消费者 consumer

项目中首先要拉取 go-queue 的依赖

```shell
$ go get github.com/zeromicro/go-queue@latest
```

在 etc/xxx.yaml 配置文件中添加当前的 kafka 配置信息

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

在 internal/config 下的 config.go 中定义 go 映射的配置

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

在 internal 下新建一个 mqs 文件夹

在 mqs 文件夹下新建一个 paymentSuccess 消费者 paymentSuccess.go

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

在 mqs 文件夹下新建一个文件 mqs.go 用来监听多个消费者,mqs.go 代码如下

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

在 main.go 中启动 consumers 等待消费

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

    for _, mq := range mqs.Consumers(c,ctx, svcCtx) {
        serviceGroup.Add(mq)
    }

    serviceGroup.Start()
}
```

当然，consumer 中在 mqs.go 中 kq.MustNewQueue 初始化时候点个参数也是可选参数

- commitInterval : 提交给 kafka broker 间隔时间，默认是 1s
- queueCapacity：kafka 内部队列长度
- maxWait：从 kafka 批量获取数据时，等待新数据到来的最大时间。
- metrics：上报消费每个消息消费时间，默认会内部初始化，一般也不需要指定
