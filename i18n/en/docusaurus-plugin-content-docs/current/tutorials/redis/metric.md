---
title: Redis Monitor
sidebar_label: Redis Monitor
slug: /docs/tutorials/redis/metric
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview
This section highlights the relevance of monitoring through redis.

## Description
Redis has two internal metrics to monitor related metric.<a href="/docs/tutorials/monitor/index" target="_blank">More component monitoring messages</a>

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/metrics.go#L8" target="_blank">RedisConf</a> related introduction.
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

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/redis/metrics.go#L16" target="_blank">metricReqErr</a>: Useful monitoring of redis commands.
```golang
    metricReqErr = metric.NewCounterVec(&metric.CounterVecOpts{
        Namespace: namespace,
        Subsystem: "requests",
        Name:      "error_total",
        Help:      "redis client requests error count.",
        Labels:    []string{"command", "error"},
    })
```