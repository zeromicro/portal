---
title: Delay Queue
slug: /docs/tutorials/delay-queue/beanstalkd
---

## Overview

With regard to extended tasks, there are many scenarios in which the return of stocks is automatically closed without payment after 20 minutes.

<a href="https://github.com/zeromicro/go-queue" target="_blank"> go-queue </a> implements the time queue dq, in addition to providing kafka message queue kq.The bottom layer of the go-queue is used for the <a href="https://beanstalkd.github.io/" target="_blank">beanstalkd</a>.

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

- Beantalks: multiple Beanstalk node configurations

- Redis：redis configuration, mainly using Setnx here

### pusher using dq in go-zero

First pull go-queue dependencies in the project

```shell
$ go get github.com/zeromicro/go-queue@latest
```

Add current dq configuration information to the etc/xxx.yaml configuration file

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

Define configuration of go mapping in config.go under internal/config

```go
type Config struct {
    ......
    DqConf struct {
        Brokers []string
        Topic   string
    }
}
```

Initialize a penchant dq client in svc/serviceContext.go

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

Write business logic in logic, using go-queue dq client to send messages to beanstalk

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

### Use dq consumer consumer in go-zero

First pull go-queue dependencies in the project

```shell
$ go get github.com/zeromicro/go-queue@latest
```

Add current kafka configuration information to the etc/xxx.yaml configuration file

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

Define configuration of go mapping in config.go under internal/config

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

Initialize consumer dq client in svc/serviceContext.go

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

Write in the end, the beanstalk is not reliant on redis, but go-queue is the better we want to prevent repeated consumption in a short period of time, using redis Setnx to allow us to filter spent messages within a short period of time

## References
1. <a href="https://beanstalkd.github.io/" target="_blank">Beanstalkd Introduction and Installation</a>