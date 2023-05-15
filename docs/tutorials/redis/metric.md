---
title: Redis 监控 
sidebar_label: Redis 监控 
slug: /docs/tutorials/redis/metric
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述
本章节主要介绍通过 redis 监控相关。

## 说明
redis 内置两个两个监控相关的 metric。<a href="/docs/tutorials/monitor/index" target="_blank">更多组件监控信息</a>。

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/metrics.go#L8" target="_blank">metricReqDur</a>: 用于对 redis 命令操作的耗时监控。
```golang
    metricReqDur = metric.NewHistogramVec(&metric.HistogramVecOpts{
		Namespace: namespace,
		Subsystem: "requests",
		Name:      "duration_ms",
		Help:      "redis client requests duration(ms).",
		Labels:    []string{"command"},
		Buckets:   []float64{5, 10, 25, 50, 100, 250, 500, 1000, 2500},
	})
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/metrics.go#L16" target="_blank">metricReqErr</a>: 用于对 redis 命令操作的错误监控。
```golang
    metricReqErr = metric.NewCounterVec(&metric.CounterVecOpts{
		Namespace: namespace,
		Subsystem: "requests",
		Name:      "error_total",
		Help:      "redis client requests error count.",
		Labels:    []string{"command", "error"},
	})
```