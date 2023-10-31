---
title: Prometheus 配置
sidebar_label: Prometheus 配置
slug: /docs/tutorials/go-zero/configuration/prometheus
---

## prometheus 配置

[Config](https://github.com/zeromicro/go-zero/blob/master/core/prometheus/config.go) Prometheus 相关配置，我们会在进程中启动启动一个 prometheus 端口。
该配置在 v1.4.3 后已不推荐使用，请使用 https://github.com/zeromicro/go-zero/blob/master/internal/devserver/config.go 替换，详情可参考 <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">基础服务配置</a>

## 参数定义

```go
// A Config is a prometheus config.
type Config struct {
	Host string `json:",optional"`
	Port int    `json:",default=9101"`
	Path string `json:",default=/metrics"`
}

```

| 参数       | 类型              | 默认值 | 说明                                                                |
| ---------- | ----------------- | ------ | ------------------------------------------------------------------- |
| Host | string | | 监听地址 |
| Port | int | 9101 | 监听端口 |
| Path | string | | 监听的路径 |
