---
title: 延时队列 
slug: /docs/tutorials/delay-queue/beanstalkd
---

## 概述

关于延时任务，在很多场景也会被使用到，比如订单 20 分钟后未支付自动关闭归还库存等。

<a href="https://github.com/zeromicro/go-queue" target="_blank"> go-queue </a> 除了提供了 kafka 消息队列 kq 之外，也实现了延时队列 dq。目前 go-queue 的延时队列底层是使用的 <a href="https://beanstalkd.github.io/" target="_blank">beanstalkd</a>。

### Config

```go
type (
    Beanstalk struct {
        Endpoint string
        Tube     string
    }

    DqConf struct {
        Beanstalks []Beanstalk
        Redis      redis.RedisConf
    }
)
```

- Beanstalks: 多个 Beanstalk 节点配置

- Redis：redis 配置，主要在这里面使用 Setnx 去重

### go-zero 中使用 dq 的 pusher

项目中首先要拉取 go-queue 的依赖

```shell
go get github.com/zeromicro/go-queue@latest
```

在 etc/xxx.yaml 配置文件中添加当前的 dq 配置信息

```yaml
Name: dq
Host: 0.0.0.0
Port: 8888

......

DqConf:
  Beanstalks:
    - Endpoint: 127.0.0.1:7771
      Tube: tube1
    - Endpoint: 127.0.0.1:7772
      Tube: tube2
```

在 internal/config 下的 config.go 中定义 go 映射的配置

```go
type Config struct {
    ......
    DqConf struct {
        Brokers []string
        Topic   string
    }
}
```

在 svc/serviceContext.go 中初始化 pusher 的 dq client

```go
type ServiceContext struct {
    Config         config.Config
  .....
    DqPusherClient dq.Producer
}

func NewServiceContext(c config.Config) *ServiceContext {
    return &ServiceContext{
        Config:         c,
    .....
        DqPusherClient: dq.NewProducer(c.DqConf.Beanstalks),
    }
}
```

在 logic 中写业务逻辑使用 go-queue 的 dq client 发送消息到 beanstalk

```go
.......
func (l *PusherLogic) Pusher() error {

  msg := "data"

    // 1、5s后执行
    deplayResp, err := l.svcCtx.DqPusherClient.Delay([]byte(msg), time.Second*5)
    if err != nil {
        logx.Errorf("error from DqPusherClient Delay err : %v", err)
    }
    logx.Infof("resp : %s", deplayResp) // fmt.Sprintf("%s/%s/%d", p.endpoint, p.tube, id)

    // 2、在某个指定时间执行
    atResp, err := l.svcCtx.DqPusherClient.At([]byte(msg), time.Now())
    if err != nil {
        logx.Errorf("error from DqPusherClient Delay err : %v", err)
    }
    logx.Infof("resp : %s", atResp) // fmt.Sprintf("%s/%s/%d", p.endpoint, p.tube, id)

  return nil
}
```

### go-zero 中使用 dq 消费者 consumer

项目中首先要拉取 go-queue 的依赖

```shell
go get github.com/zeromicro/go-queue@latest
```

在 etc/xxx.yaml 配置文件中添加当前的 kafka 配置信息

```yaml
Name: dq
Host: 0.0.0.0
Port: 8889

.....

#dq
DqConf:
  Beanstalks:
    - Endpoint: 127.0.0.1:7771
      Tube: tube1
    - Endpoint: 127.0.0.1:7772
      Tube: tube2
  Redis:
    Host: 127.0.0.1:6379
    Type: node
```

在 internal/config 下的 config.go 中定义 go 映射的配置

```go
package config

import (
    "github.com/zeromicro/go-queue/dq"
    "github.com/zeromicro/go-zero/rest"
)

type Config struct {
    rest.RestConf
    .......
    DqConf dq.DqConf
}
```

在 svc/serviceContext.go 中初始化 consumer 的 dq client

```go
type ServiceContext struct {
    Config         config.Config
  .....
    DqConsumer dq.Consumer
}

func NewServiceContext(c config.Config) *ServiceContext {
    return &ServiceContext{
        Config:         c,
    .....
        DqConsumer: dq.NewConsumer(c.DqConf),
    }
}
```

logic 中消费延时消息

```go
func (l *PusherLogic) Consumer() error {
  l.svcCtx.DqConsumer.Consume(func(body []byte) {
        logx.Infof("consumer job  %s \n", string(body))
    })
}
```

写在最后，本身 beanstalk 不依赖 redis 的，但是 go-queue 为我们想的更周到防止短时间内重复消费，便使用了 redis 的 Setnx 帮我们在短时间内过滤掉消费过的消息

## 参考文献

1. <a href="https://beanstalkd.github.io/" target="_blank">《beanstalkd 介绍及安装》</a>
