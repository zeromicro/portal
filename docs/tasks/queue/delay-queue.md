---
title: 延时队列
slug: /docs/tasks/queue/delay-queue
---

## 概述

延时队列是一种特殊的队列，它的元素只有在指定的延时时间到达之后才能被消费。延时队列的实现通常依赖于定时任务，定时任务会定期扫描队列中的元素，将到期的元素移动到另一个队列中，消费者从这个队列中消费元素。

在 go-zero 中我们使用 <a href="https://github.com/zeromicro/go-queue" target="_blank">go-queue</a> 来实现延时队列。

## 任务目标

- 了解 go-queue 的基本使用
- 了解如何在 go-zero 中使用延时队列

## 准备条件

- 安装 <a href="https://beanstalkd.github.io/download.html" target="_blank">beanstalkd</a>

## 生产者

dq 生产者很简单，只需要 beanstalkd 地址，tube 即可创建一个 Producer 对象。

```go
type Beanstalk struct {
  Endpoint string // beanstalkd 地址
  Tube     string // tube 名称
}

NewProducer(beanstalks []Beanstalk) Producer
```

### 代码示例

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

	// 延迟 5s 后处理
	_, err := producer.Delay([]byte("hello"), time.Second*5)
	if err != nil {
		fmt.Println(err)
	}

	// 在指定时间点处理
	_, err = producer.At([]byte("hello"), time.Now().Add(time.Second*10))
	if err != nil {
		fmt.Println(err)
	}
}

```

## 消费者

### 配置介绍

```go
type DqConf struct {
  Beanstalks []Beanstalk
  Redis      redis.RedisConf
}

type Beanstalk struct {
  Endpoint string // beanstalkd 地址
  Tube     string // tube 名称
}
```

| <img width={100}/>参数 | <img width={100}/>类型 | <img width={100}/>是否必填 | <img width={100}/>默认值 | <img width={100}/>说明 |
| --- | --- | --- | --- | --- |
| Beanstalks | []Beanstalk | 是 |  | beanstalkd 配置 |
| Redis | RedisConf | 是 |  | redis 配置，详情参考<a href="http://localhost:3000/docs/tutorials/go-zero/configuration/redis" target="_blank">Redis 配置</a> |

**Beanstalk**

| <img width={100}/>参数 | <img width={100}/>类型 | <img width={100}/>是否必填 | <img width={100}/>默认值 | <img width={100}/>说明 |
| --- | --- | --- | --- | --- |
| Endpoint | string | 是 |  | beanstalkd 地址 |
| Tube | string | 是 |  | tube 名称 |

### 示例

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

## 参考文献

1. <a href="https://github.com/beanstalkd/go-beanstalk" target="_blank">《go-beanstalk》</a>
1. <a href="https://beanstalkd.github.io/" target="_blank">《beanstalkd》</a>