---
title: Prometheus Configuration
slug: /docs/tutorials/go-zero/configuration/prometheus
---

## prometheus Configuration

[Config](https://github.com/zeromicro/go-zero/blob/master/core/prometheus/config.go) Prometheus configuration, we will start a prometheus port in the process.

## Definition of parameters

```go
// A Config is a prometheus config.
type Config struct {
    Host string `json:",optional"`
    Port int    `json:",default=9101"`
    Path string `json:",default=/metrics"`
}

```

| Params | DataType | Default value | Note               |
| ------ | -------- | ------------- | ------------------ |
| Host   | string   |               | Listening address  |
| Port   | int      | 9101          | Listening Port     |
| Path   | string   |               | The path to listen |
