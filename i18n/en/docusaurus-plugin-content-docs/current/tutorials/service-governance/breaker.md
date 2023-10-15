---
title: Breaker
slug: /docs/tutorials/service/governance/breaker
---

## Overview

Breakers are also called smelters as a protective mechanism to protect services in service calls from too many requests.When an exception arises for a service in the service call link, the breaker rejects the service call request, thereby protecting other services in the service call link from being suppressed.

More prominent smelter algorithms are Hystrix and Sentinel, all of which determine the availability of services by the success rate and response time for statistical service calls.

go-zero has built-in the melting breaker component <a href="https://github.com/zeromicro/go-zero/blob/master/core/breaker/breaker.go#L29" target="_blank">breaker.Breaker</a> using a sliding window in go-zero, currently using 10 s as a window, with 40 barrels in a single window, and whether the data collected within the window is smelted using the google algorithre algorithm algorithm, refer to <https://landing.google.com/sre/sre-book/chapters/handling-overload/#eq2101>.

## Usage

In breaker.Breaker', `Do`, `Do Acceptable`, `DoWithFallback`, `DoithFallbackAceptable` Each of the four methods corresponds to different scenarios. And developers can call these methods directly through the breaker, or create a breaker instance that can be called either directly, and by name as a unique key to get/create a breaker instance.

### Do

Do methods are default to judge if services are available by error rate, do not support indicator customization, and do not support error callbacks.

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

DoWithAcceptable table supports custom collection indicators, allows for autonomous control of what is acceptable and what needs to be added to the smelting indicator collection window.

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

DoWithFallback defaults to use error rates to judge if the service is available, does not support indicator customization, but supports melting backslides.

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

DoWithFallbackAcceptable supports collection indicator customization and melting backback.

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

The above method is to fetch/create a breaker instance with the same name as the smelter that belongs to a smelter control. If a customized breaker configuration is required, you can create a breaker instance through the NewBreaker method, where you can precisely control whether the situation is relaxed or refused.

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

## Used in HTTP & gRPC

In go-zero, the developer does not need to smelt the request individually. This function is integrated into the framework, so the developer does not need to relate.

HTTP uses request method + routing as a statistical dimension using HTTP status code 500 as a wrong collection indicator, reference <a href="https://github.com/zeromicro/go-zero/blob/master/rest/handler/breakerhandler.go" target="_blank">breakerhandler.go</a>

The gRPC client uses the rpc method as the statistical dimension using the rpc method error code `codes.DeadlineExeed`, `codes.internal`, `codes. Available from`, `codes.DataLoss`, `codes.Unimplemented` as error collection indicator, refer to <a href="https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/clientinterceptors/breakerinterceptor.go" target="_blank">breakerinterceptor.go</a>

gRPC server is used as a statistical dimension by rpc method, using grpc error as a wrong collection indicator, reference <a href="https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/serverinterceptors/breakerinterceptor.go" target="_blank">breakerinterceptor.go</a>

## References

- <a href="https://landing.google.com/sre/sre-book/chapters/handling-overload/#eq2101" target="_blank">Google SRE • Client request selection probability.</a>
- <a href="https://github.com/zeromicro/go-zero/blob/master/core/breaker/breaker.go" target="_blank">go-zero • breaker</a>
