---
title: Monitoring
slug: /docs/tutorials/monitor/index
---

## Health Check

Default integrated health check for go-zero enabled service (RPC Server or HTTP Server). The default health check port is`6470`default Path is`/healthz`and access to health check address will return on service startup`OK`

```shell
curl -i http://127.0.0.1:6470/healthz
HTTP/1.1 200 OK
Date: Thu, 09 Mar 2023 02:34:17 GMT
Content-Length: 2
Content-Type: text/plain; charset=utf-8

OK
```

Disable health check configuration below：

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

Configuration turned on:
```yaml
Name: user-api
Host: 0.0.0.0
Port: 8002
......

DevServer:
    Enabled: true

```


You can modify your health check ports and Path by configuring to `8080` and `ping`

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

Configuration turned on:
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


## Log collection

## Link Tracking

go-zero integrated link tracking based on[OpenTelemetry](https://opentelemetry.io/docs/)configured below：

```go
type Config struct {
    Name     string  `json:",optional"`
    Endpoint string  `json:",optional"` // trace信息上报的url
    Sampler  float64 `json:",default=1.0"`  // 采样率
    Batcher  string  `json:",default=jaeger,options=jaeger|zipkin|otlpgrpc|otlphttp"`
}
```


go-zero link tracking support (Jaeger\zipkin) can only be enabled by adding a few lines to the configuration. No code needs to be modified. Example：

1）api配置

```yaml
Name: user-api
Host: 0.0.0.0
Port: 8002
Mode: dev
......

Telemetry:
  Name: user-api
  Endpoint: http://jaeger:14268/api/traces
  Sampler: 1.0
  Batcher: jaeger
```

2) rpc configuration

```yaml
Name: user-rpc
ListenOn: 0.0.0.0:9002
Mode: dev

.....

Telemetry:
  Name: user-rpc
  Endpoint: http://jaeger:14268/api/traces
  Sampler: 1.0
  Batcher: jaeger
```


For more examples, refer to [tracing Examples](https://github.com/zeromicro/zero-examples/tree/main/tracing)

## Merics monitoring

The prometheus indicator in go-zero will be collected by default, with the default port `6470` and the default Path will be `/metrics`, after starting the service indicator monitoring address below：

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

Monitor Path with EnableMetrics disabled; change the indicator by MetricsPath below：

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

Prometheus indicators for go-zero default integration are below：

### RPC Server

|             Metric name             |    Label    |                       Description                       |
|:-----------------------------------:|:-----------:|:-------------------------------------------------------:|
| rpc_server_requests_duration_ms |   method    | Histogram, time-consuming statistical unit milliseconds |
| rpc_server_requests_code_total  | method、code |             Counter, Error Code Statistics              |

### RPC Client

|             Metric name             |    Label    |                       Description                       |
|:-----------------------------------:|:-----------:|:-------------------------------------------------------:|
| rpc_client_requests_duration_ms |   method    | Histogram, time-consuming statistical unit milliseconds |
| rpc_client_requests_code_total  | method、code |             Counter, Error Code Statistics              |

### HTTP Server

|             Metric name              |   Label   |                       Description                       |
|:------------------------------------:|:---------:|:-------------------------------------------------------:|
| http_server_requests_duration_ms |   path    | Histogram, time-consuming statistical unit milliseconds |
| http_server_requests_code_total  | path、code |             Counter, Error Code Statistics              |

### Mysql

|             Metric name             |     Label     |                       Description                       |
|:-----------------------------------:|:-------------:|:-------------------------------------------------------:|
| sql_client_requests_duration_ms |    command    | Histogram, time-consuming statistical unit milliseconds |
| sql_client_requests_error_total | command、error |             Counter, Error Code Statistics              |

### Redis

| Metric name                           | Label         | Description                                             |
| ------------------------------------- | ------------- | ------------------------------------------------------- |
| redis_client_requests_duration_ms | command       | Histogram, time-consuming statistical unit milliseconds |
| redis_client_requests_error_total | command、error | Counter, Error Code Statistics                          |

### Custom monitoring metrics

In the package `go-zero/core/metric` the type of data for the Histograms, Counter, Gauge adequate prometheus indicator is available. Users can customize business indicators using the method provided under this package, such as using Counters to measure the total number of users accessing a resource, defined below：

```go
userVisitResourceTotal = metric.NewCounterVec(&metric.CounterVecOpts{
    Namespace: "user",
    Subsystem: "visit_resource",
    Name:      "total",
    Help:      "user visit resource count.",
    Labels:    []string{"user_id", "resource_id"},
})

userVisitResourceTotal.Inc("userId", "resourceId")
```
