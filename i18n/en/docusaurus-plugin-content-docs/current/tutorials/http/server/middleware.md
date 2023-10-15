---
title: Middleware
slug: /docs/tutorials/http/server/middleware
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Microservice middleware are software components used to support microservice architecture, they provide some basic functions and services for communication, collaboration and management between microservices, the following middleware is built in go-zero：

- AuthorizeHandler
- BreakerHandler
- ContentSecurityHandler
- CryptionHandler
- GunzipHandler
- LogHandler
- MaxBytesHandler
- MaxConnsHandler
- MetricHandler
- PrometheusHandler
- RecoverHandler
- SheddingHandler
- TimeoutHandler
- TraceHandler

The above intermediate is enabled by default. You can also control some of the intermediaries.

## Middleware Configuration

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

| Configuration Item | Note                                           | Default value |
| ------------------ | ---------------------------------------------- | ------------- |
| Trace              | Enable link tracking                           | true          |
| Log                | Enable Log Middleware                          | true          |
| Prometheus         | Whether to enable Prometheus middleware        | true          |
| MaxConns           | Enable Limit Middleware                        | true          |
| Breaker            | Enable breaker middleware                      | true          |
| Shedding           | Enable Load Monitor Middleware                 | true          |
| Timeout            | Enable Timeout Middleware                      | true          |
| Recover            | Enable Panic Recovery Middleware               | true          |
| Metrics            | Enable metrics middleware                      | true          |
| MaxBytes           | Enable ContentLength Administration Middleware | true          |
| Gunzip             | Enable compression management intermediate     | true          |

For example, if you want to disable indicator collection in the Hello World program, you can configure it as follows：

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

## Focus Middleware Introduction

### TraceHandler

The framework integrates Opentelemetry by default to standardize link tracking.If you want to report the trace information to jaeger, or take the hello world program as an example, you can do the following:

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

Re-request `http:///127.0.0.1:8080/hello`to view link request information by opening the jaeger page and by default`http.host`、`http.method`、`http.route`、`http.status_code`and more.

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

Can disable log middleware by configuring it, enabled by default

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

Requested time-consuming indicator type is Histogram, default label has path,buckets defined as 5, 10, 25, 50, 100, 250, 500, 1000

```
http_server_requests_duration_ms
```

Error statistics indicator type is counter, default label has paths, code

```
http_server_requests_code_total
```

Prometheus Middleware can be disabled by configuration, enabled by default

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

Use to limit the maximum number of requests sent by http:// when the number of concurrent requests exceeds the set value (default is 10,000), when exceeding the setting value returns http.StatusServiceUnav's status code

Disable is same with above

## Custom Middleware

Use Use method to apply custom middleware

```go
server := rest.MustNewServer(rest.RestConf{})
defer server.Stop()

server.Use(middleware)

func middleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Add("X-Middleware", "static-middleware")
        next(w, r)
    }
}
```