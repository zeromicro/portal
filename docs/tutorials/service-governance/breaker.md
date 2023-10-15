---
title: 断路器
slug: /docs/tutorials/service/governance/breaker
---

## 概述

断路器又叫熔断器，是一种保护机制，用于保护服务调用链路中的服务不被过多的请求压垮。当服务调用链路中的某个服务出现异常时，断路器会将该服务的调用请求拒绝，从而保护服务调用链路中的其他服务不被压垮。

比较知名的熔断器算法有 Hystrix 和 Sentinel，它们都是通过统计服务调用的成功率和响应时间来判断服务是否可用，从而实现熔断的功能。

go-zero 已经内置了熔断器组件 <a href="https://github.com/zeromicro/go-zero/blob/master/core/breaker/breaker.go#L29" target="_blank">breaker.Breaker</a> ，go-zero 中采用滑动窗口来进行数据采集，目前是以 10s 为一个窗口，单个窗口有40个桶，然后将窗口内采集的数据采用的是 google sre 算法计算是否开启熔断，详情可参考 https://landing.google.com/sre/sre-book/chapters/handling-overload/#eq2101。

## 使用

在 brreaker.Breaker' 中，提供了 `Do`,`DoWithAcceptable`,`DoWithFallback`,`DoWithFallbackAcceptable` 四个方法，分别对应不同的场景。
而开发者可以通过 breaker 直接调用这些方法，或者创建一个 breaker 实例来调用，两种方法均可，直接调用其实本质上也会以 name 作为唯一 key 去获取/创建一个 breaker 实例。

### Do

Do 方法默认按照错误率来判断服务是否可用，不支持指标自定义，也不支持错误回调。

```go
type mockError struct {
	status int
}

func (e mockError) Error() string {
	return fmt.Sprintf("HTTP STATUS: %d", e.status)
}

func main() {
	for i := 0; i < 1000; i++ {
		if err := breaker.Do("test", func() error {
			return mockRequest()
		}); err != nil {
			println(err.Error())
		}
	}
}

func mockRequest() error {
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)
	num := r.Intn(100)
	if num%4 == 0 {
		return nil
	} else if num%5 == 0 {
		return mockError{status: 500}
	}
	return errors.New("dummy")
}
```

### DoWithAcceptable

DoWithAcceptable 支持自定义的采集指标，可以自主控制哪些情况是可以接受，哪些情况是需要加入熔断指标采集窗口的。

```go
type mockError struct {
	status int
}

func (e mockError) Error() string {
	return fmt.Sprintf("HTTP STATUS: %d", e.status)
}

func main() {
	for i := 0; i < 1000; i++ {
		if err := breaker.DoWithAcceptable("test", func() error {
			return mockRequest()
		}, func(err error) bool { // 当 mock 的http 状态码部位500时都会被认为是正常的，否则加入错误窗口
			me, ok := err.(mockError)
			if ok {
				return me.status != 500
			}
			return false
		}); err != nil {
			println(err.Error())
		}
	}
}

func mockRequest() error {
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)
	num := r.Intn(100)
	if num%4 == 0 {
		return nil
	} else if num%5 == 0 {
		return mockError{status: 500}
	}
	return errors.New("dummy")
}
```

### DoWithFallback

DoWithFallback 默认采用错误率来判断服务是否可用，不支持指标自定义，但是支持熔断回调。

```go
package main

import (
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/zeromicro/go-zero/core/breaker"
)

type mockError struct {
	status int
}

func (e mockError) Error() string {
	return fmt.Sprintf("HTTP STATUS: %d", e.status)
}

func main() {
	for i := 0; i < 1000; i++ {
		if err := breaker.DoWithFallback("test", func() error {
			return mockRequest()
		}, func(err error) error {
			// 发生了熔断，这里可以自定义熔断错误转换
			return errors.New("当前服务不可用，请稍后再试")
		}); err != nil {
			println(err.Error())
		}
	}
}

func mockRequest() error {
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)
	num := r.Intn(100)
	if num%4 == 0 {
		return nil
	} else if num%5 == 0 {
		return mockError{status: 500}
	}
	return errors.New("dummy")
}

```

### DoWithFallbackAcceptable

DoWithFallbackAcceptable 支持采集指标自定义，也支持熔断回调。

```go
package main

import (
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/zeromicro/go-zero/core/breaker"
)

type mockError struct {
	status int
}

func (e mockError) Error() string {
	return fmt.Sprintf("HTTP STATUS: %d", e.status)
}

func main() {
	for i := 0; i < 1000; i++ {
		if err := breaker.DoWithFallbackAcceptable("test", func() error {
			return mockRequest()
		}, func(err error) error {
			//发生了熔断，这里可以自定义熔断错误转换
			return errors.New("当前服务不可用，请稍后再试")
		}, func(err error) bool { // 当 mock 的http 状态码部位500时都会被认为是正常的，否则加入错误窗口
			me, ok := err.(mockError)
			if ok {
				return me.status != 500
			}
			return false
		}); err != nil {
			println(err.Error())
		}
	}
}

func mockRequest() error {
	source := rand.NewSource(time.Now().UnixNano())
	r := rand.New(source)
	num := r.Intn(100)
	if num%4 == 0 {
		return nil
	} else if num%5 == 0 {
		return mockError{status: 500}
	}
	return errors.New("dummy")
}

```

以上方法都是通过 name 来获取/创建一个 breaker 实例，即熔断器名称相同的同属于一个熔断器控制，如果需要自定义 breaker 的配置，可以通过 NewBreaker 方法来创建一个 breaker 实例，通过实例你可以精确控制具体情况是放过还是拒绝。

```go
// 熔断器名称是一个可选参数，当不传时，默认采用一个随机值
opt := breaker.WithName("test")
b := breaker.NewBreaker(opt)
// 快捷调用
//b.Do()
//b.DoWithAcceptable()
//b.DoWithFallback()
//b.DoWithFallbackAcceptable()

// 自主控制放行/拒绝 case
// mockRequest := func(status int) error {
//     p, err := b.Allow()
//     if err != nil {
//         return err
//     }
//     if status == 200 {
//         p.Accept()
//     }
//     p.Reject(fmt.Sprintf("HTTP STATUS: %d", status))
//     return nil
// }
// for i := 0; i < 100; i++ {
//     var mockStatus int
//     if i%10 == 0 {
//         mockStatus = 500
//     }
//     if err := mockRequest(mockStatus)(); err != nil {
//         fmt.Println(err)
//     }
// }
```

## HTTP & gRPC 中使用

在 go-zero 中，开发者不需要对请求单独进行熔断处理，该功能已经集成到了框架中，因此开发者无需关系。

HTTP 以请求方法+路由作为统计维度，用 HTTP 状态码 500 作为错误采集指标进行统计，详情可参考 <a href="https://github.com/zeromicro/go-zero/blob/master/rest/handler/breakerhandler.go" target="_blank">breakerhandler.go</a>

gRPC 客户端以 rpc 方法名作为统计维度，用 grpc 的错误码为 `codes.DeadlineExceeded`, `codes.Internal`, `codes.Unavailable`, `codes.DataLoss`, `codes.Unimplemented` 作为错误采集指标进行统计，详情可参考 <a href="https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/clientinterceptors/breakerinterceptor.go" target="_blank">breakerinterceptor.go</a>

gRPC 服务端以 rpc 方法名称作为统计维度，用 grpc 的错误作为错误采集指标进行统计，详情可参考 <a href="https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/serverinterceptors/breakerinterceptor.go" target="_blank">breakerinterceptor.go</a>

## 参考文献

- <a href="https://landing.google.com/sre/sre-book/chapters/handling-overload/#eq2101" target="_blank">《Google SRE • Client request rejection probability》</a>
- <a href="https://github.com/zeromicro/go-zero/blob/master/core/breaker/breaker.go" target="_blank">《go-zero • breaker》</a>
