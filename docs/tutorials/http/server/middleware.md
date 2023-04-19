---
title: 中间件
slug: /docs/tutorials/http/server/middleware
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

微服务中间件是指用于支持微服务架构的软件组件，它们提供了一些基本的功能和服务，以便微服务之间进行通信、协作和管理，在 go-zero 中内置了如下中间件：

- 鉴权管理中间件 AuthorizeHandler
- 熔断中间件 BreakerHandler
- 内容安全中间件 ContentSecurityHandler
- 解密中间件 CryptionHandler
- 压缩管理中间件 GunzipHandler
- 日志中间件 LogHandler
- ContentLength 管理中间件 MaxBytesHandler
- 限流中间件 MaxConnsHandler
- 指标统计中间件 MetricHandler
- 普罗米修斯指标中间件 PrometheusHandler
- panic 恢复中间件 RecoverHandler
- 负载监控中间件 SheddingHandler
- 超时中间件 TimeoutHandler
- 链路追踪中间件 TraceHandler

以上中间件默认启用，你也可以控制启用其中部分中间件。

## 中间件配置

```go
type MiddlewaresConf struct {
    Trace      bool `json:",default=true"`
    Log        bool `json:",default=true"`
    Prometheus bool `json:",default=true"`
    MaxConns   bool `json:",default=true"`
    Breaker    bool `json:",default=true"`
    Shedding   bool `json:",default=true"`
    Timeout    bool `json:",default=true"`
    Recover    bool `json:",default=true"`
    Metrics    bool `json:",default=true"`
    MaxBytes   bool `json:",default=true"`
    Gunzip     bool `json:",default=true"`
}
```

| 配置项     | 说明                              | 默认值 |
| ---------- | --------------------------------- | ------ |
| Trace      | 是否启用链路追踪中间件            | true   |
| Log        | 是否启用日志中间件                | true   |
| Prometheus | 是否启用普罗米修斯指标中间件      | true   |
| MaxConns   | 是否启用限流中间件                | true   |
| Breaker    | 是否启用熔断中间件                | true   |
| Shedding   | 是否启用负载监控中间件            | true   |
| Timeout    | 是否启用超时中间件                | true   |
| Recover    | 是否启用 panic 恢复中间件         | true   |
| Metrics    | 是否启用指标统计中间件            | true   |
| MaxBytes   | 是否启用 ContentLength 管理中间件 | true   |
| Gunzip     | 是否启用压缩管理中间件            | true   |

例如，在 Hello World 程序中想禁用指标收集，可以做如下配置：

<Tabs>

<TabItem value="etc/config.yaml" label="etc/config.yaml" default>

```yaml
Name: HelloWorld.api
Host: 127.0.0.1
Port: 8080
Middlewares:
  Metrics: false
```

</TabItem>

<TabItem value="main.go" label="main.go" default>

```go
func main() {
    var restConf rest.RestConf
    conf.MustLoad("etc/config.yaml", &restConf)
    srv := rest.MustNewServer(restConf)
    defer srv.Stop()
    ...
}
```

</TabItem>
</Tabs>

## 重点中间件介绍

### TraceHandler

框架默认集成了 Opentelemetry 来标准化链路追踪。如果想把追踪信息上报到 jaeger，还是以 hello world 程序为例，可以做如下配置：

<Tabs>

<TabItem value="etc/config.yaml" label="etc/config.yaml" default>

```yaml
Name: HelloWorld.api
Host: 127.0.0.1
Port: 8080
Middlewares:
  Metrics: true
Telemetry:
  Name: hello
  Endpoint: http://127.0.0.1:14268/api/traces
  Batcher: jaeger
  Sampler: 1.0
```

</TabItem>

<TabItem value="main.go" label="main.go" default>

```go
var restConf rest.RestConf
conf.MustLoad("etc/config.yaml", &restConf)
srv := rest.MustNewServer(restConf)
```

</TabItem>

</Tabs>

再次请求 `http://127.0.0.1:8080/hello`，打开jaeger页面即可查看链路请求信息，默认会携带`http.host`、`http.medhod`、`http.route`、`http.status_code`等属性

### LogHandler

默认每次 http 请求都会输出对应的请求日志，格式如下：

```json
{
  "@timestamp": "2023-03-05T21:53:44.244+08:00",
  "caller": "handler/loghandler.go:160",
  "content": "[HTTP] 200 - GET /hello - 127.0.0.1:51499 - Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  "duration": "0.0ms",
  "level": "info"
}
```

可以通过配置来禁用 Log 中间件，默认启用

<Tabs>

<TabItem value="etc/config.yaml" label="etc/config.yaml" default>

```yaml
Name: HelloWorld.api
Host: 127.0.0.1
Port: 8080
Middlewares:
  Log: false
```

</TabItem>

<TabItem value="main.go" label="main.go" default>

```go
var restConf rest.RestConf
conf.MustLoad("etc/config.yaml", &restConf)
srv := rest.MustNewServer(restConf)
```

</TabItem>

</Tabs>

### PrometheusHandler

http server 默认集成了 prometheus 指标监控，指标分别如下：

请求耗时指标类型为 Histogram，默认 Label 有 path，buckets 定义分别为 5, 10, 25, 50, 100, 250, 500, 1000

```
http_server_requests_duration_ms
```

错误统计指标类型为 Counter，默认 Label 有 path、code

```
http_server_requests_code_total
```

可以通过配置来禁用 Prometheus 中间件，默认启用

<Tabs>

<TabItem value="etc/config.yaml" label="etc/config.yaml" default>

```yaml
Name: HelloWorld.api
Host: 127.0.0.1
Port: 8080
Middlewares:
  Prometheus: false
```

</TabItem>

<TabItem value="main.go" label="main.go" default>


```go
var restConf rest.RestConf
conf.MustLoad("etc/config.yaml", &restConf)
srv := rest.MustNewServer(restConf)
```

</TabItem>

</Tabs>

### MaxConnsHandler

用于限制 http 最大并发请求数，当并发请求数超过设置的值（默认为 10000），当超过设置值会返回 http.StatusServiceUnavailable 状态码

禁用方式同上

## 自定义中间件

使用Use方法应用自定义中间件

```go
server := rest.MustNewServer(rest.RestConf{})
defer server.Stop()

server.Use(middleware)

// 自定义的中间件
func middleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("X-Middleware", "static-middleware")
		next(w, r)
	}
}
```