---
title: Hello World
slug: /docs/tasks/http/hello-world
---

TODO: 从静态配置文件加载

## 概述

本节将演示如何使用 go-zero 创建一个简单的 HTTP 服务。

## 示例

```go
func main() {
    s, err := rest.NewServer(rest.RestConf{
        ServiceConf: service.ServiceConf{// 服务基础配置
            Name: "HelloWorld.api",
        },
        Host: "127.0.0.1",// 服务监听地址
        Port: 8080,// 服务监听端口
    })
    if err != nil {
        log.Fatal(err)
        return
    }

    s.AddRoute(rest.Route{// 添加路由
        Method: http.MethodGet,
        Path:   "/hello/world",
        Handler: func(writer http.ResponseWriter, request *http.Request) {// 处理函数
            httpx.OkJson(writer, "Hello World!")
        },
    })

    defer s.Stop()
    s.Start()// 启动服务
}
```

rest 服务配置可参考 <a href="/docs/tutorials/http/server/configuration" target="_blank"> HTTP 服务配置</a>

除了通过上述方式启动一个简单的 HTTP 服务外，还可以

1. 通过 goctl 快速创建一个 HTTP 服务: 具体可参考 <a href="/docs/tutorials/cli/api#new" target="_blank"> goctl api new </a>
2. 通过 goctl 快速创建并启动一个 HTTP 服务，具体可参考 <a href="/docs/tutorials/cli/quickstart#使用示例" target="_blank"> goctl quickstart </a>

## 参考文献

- <a href="/docs/tutorials/cli/overview" target="_blank"> 《goctl 指令概览》 </a>