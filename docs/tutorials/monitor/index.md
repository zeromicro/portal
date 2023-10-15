---
title: 监控
slug: /docs/tutorials/monitor/index
---

## 健康检查

go-zero 启动的服务（RPC Server 或 HTTP Server）默认集成健康检查，健康检查默认端口为`6470`，默认 Path 为`/healthz`，服务启动后访问健康检查地址会返回`OK`

```shell
curl -i http://127.0.0.1:6470/healthz
HTTP/1.1 200 OK
Date: Thu, 09 Mar 2023 02:34:17 GMT
Content-Length: 2
Content-Type: text/plain; charset=utf-8

OK
```

禁用健康检查配置如下：

```go
srv := rest.MustNewServer(rest.RestConf{
    Port: 8080,
    ServiceConf: service.ServiceConf{
        DevServer: devserver.Config{
            Enabled:       true,
        },
    },
})
```

对应配置开启:

```yaml
Name: user-api
Host: 0.0.0.0
Port: 8002
......

DevServer:
    Enabled: true

```

可以通过配置修改健康检查端口和 Path，比如把健康检查端口和 Path 修改为`8080`和`ping`

```go
srv := rest.MustNewServer(rest.RestConf{
    Port: 8080,
    ServiceConf: service.ServiceConf{
        DevServer: devserver.Config{
            Enabled:       true,
            Port:          8080,
            HealthPath:    "/ping",
        },
    },
})
```

对应配置开启:

```yaml
Name: user-api
Host: 0.0.0.0
Port: 8002
......

DevServer:
    Enabled: true
    Port: 8080
    HealthPath: "/ping"
```

## 日志收集

## 链路追踪

go-zero 中基于[OpenTelemetry](https://opentelemetry.io/docs/)集成了链路追踪，配置如下：

```go
type Config struct {
    Name     string  `json:",optional"`
    Endpoint string  `json:",optional"` // trace信息上报的url
    Sampler  float64 `json:",default=1.0"`  // 采样率
    Batcher  string  `json:",default=jaeger,options=jaeger|zipkin|otlpgrpc|otlphttp"`
}
```

go-zero链路追踪支持(jaeger\zipkin)只需要在配置中添加几行配置就可开启，无需修改任何代码，示例如下：

1）api配置

```yaml
Name: user-api
Host: 0.0.0.0
Port: 8002
Mode: dev
......

#链路追踪
Telemetry:
  Name: user-api
  Endpoint: http://jaeger:14268/api/traces
  Sampler: 1.0
  Batcher: jaeger
```

2）rpc配置

```yaml
Name: user-rpc
ListenOn: 0.0.0.0:9002
Mode: dev

.....

#链路追踪
Telemetry:
  Name: user-rpc
  Endpoint: http://jaeger:14268/api/traces
  Sampler: 1.0
  Batcher: jaeger
```

更多详细示例请参考 [tracing 示例](https://github.com/zeromicro/zero-examples/tree/main/tracing)

## 指标监控

go-zero 中 prometheus 指标默认启动收集，默认端口为`6470`，默认 Path 为`/metrics`，启动服务后访问指标监控地址如下：

```go
$ curl http://127.0.0.1:6470/metrics
# HELP go_gc_duration_seconds A summary of the pause duration of garbage collection cycles.
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 7.3427e-05
go_gc_duration_seconds{quantile="0.25"} 7.3427e-05
go_gc_duration_seconds{quantile="0.5"} 7.3427e-05
go_gc_duration_seconds{quantile="0.75"} 7.3427e-05
go_gc_duration_seconds{quantile="1"} 7.3427e-05
go_gc_duration_seconds_sum 7.3427e-05
go_gc_duration_seconds_count 1
# HELP go_goroutines Number of goroutines that currently exist.
# TYPE go_goroutines gauge
go_goroutines 12
```

通过 EnableMetrics 禁用指标监控，通过 MetricsPath 修改指标监控 Path，如下：

```go
srv := rest.MustNewServer(rest.RestConf{
    Port: 8080,
    ServiceConf: service.ServiceConf{
        DevServer: devserver.Config{
            Enabled:       true,
            Port:          6470,
            MetricsPath:   "/metrics",
            EnableMetrics: false,
        },
    },
})
```

go-zero 默认集成的 prometheus 指标如下：

### RPC Server

|             指标名              |    Label     |             说明              |
| :-----------------------------: | :----------: | :---------------------------: |
| rpc_server_requests_duration_ms |    method    | Histogram，耗时统计单位为毫秒 |
| rpc_server_requests_code_total  | method、code |      Counter，错误码统计      |

### RPC Client

|             指标名              |    Label     |             说明              |
| :-----------------------------: | :----------: | :---------------------------: |
| rpc_client_requests_duration_ms |    method    | Histogram，耗时统计单位为毫秒 |
| rpc_client_requests_code_total  | method、code |      Counter，错误码统计      |

### HTTP Server

|              指标名              |   Label    |             说明              |
| :------------------------------: | :--------: | :---------------------------: |
| http_server_requests_duration_ms |    path    | Histogram，耗时统计单位为毫秒 |
| http_server_requests_code_total  | path、code |      Counter，错误码统计      |

### Mysql

|             指标名              |     Label      |             说明              |
| :-----------------------------: | :------------: | :---------------------------: |
| sql_client_requests_duration_ms |    command     | Histogram，耗时统计单位为毫秒 |
| sql_client_requests_error_total | command、error |       Counter，错误统计       |

### Redis

| 指标名                            | Label          | 说明                          |
| --------------------------------- | -------------- | ----------------------------- |
| redis_client_requests_duration_ms | command        | Histogram，耗时统计单位为毫秒 |
| redis_client_requests_error_total | command、error | Counter，错误统计             |

### 自定义监控指标

在包 `go-zero/core/metric` 下提供了 Histogram、Counter、Gauge 三种 prometheus 指标数据类型，用户可以使用该包下提供的方法自定义业务指标，如使用 Counter 来统计用户访问某一资源的总数，定义如下：

```go
// 定义Counter
userVisitResourceTotal = metric.NewCounterVec(&metric.CounterVecOpts{
    Namespace: "user",
    Subsystem: "visit_resource",
    Name:      "total",
    Help:      "user visit resource count.",
    Labels:    []string{"user_id", "resource_id"},
})

// 用户每次访问资源通过如下方法增加计数
userVisitResourceTotal.Inc("userId", "resourceId")
```
