---
title: Service Configuration
slug: /docs/tutorials/http/server/configuration
---

## Overview

HTTP server configuration is primarily used to control HTTP server hosts, ports, certificates, etc.

## Configuration Description

golang Structure Definition：

```go
RestConf struct {
        service.ServiceConf
        Host     string `json:",default=0.0.0.0"`
        Port     int
        CertFile string `json:",optional"`
        KeyFile  string `json:",optional"`
        Verbose  bool   `json:",optional"`
        MaxConns int    `json:",default=10000"`
        MaxBytes int64  `json:",default=1048576"`
        // milliseconds
        Timeout      int64         `json:",default=3000"`
        CpuThreshold int64         `json:",default=900,range=[0:1000]"`
        Signature    SignatureConf `json:",optional"`
        Middlewares MiddlewaresConf
    }
```

HTTP server primary configuration entry is set out below table：

|     Name     |    DataType     |                           Meaning                            | Default value | Required? |
|:------------:|:---------------:|:------------------------------------------------------------:|:-------------:|:---------:|
|     Host     |     string      |                      Listening address                       |    0.0.0.0    |    YES    |
|     Port     |       int       |                        Listening Port                        |     None      |    YES    |
|   CertFile   |     string      |                    https Certificate File                    |     None      |    NO     |
|   KeyFile    |     string      |                    https Certificate File                    |     None      |    NO     |
|   Verbose    |      bool       |                     Print detailed logs                      |     None      |    NO     |
|   MaxConns   |       int       |                Number of concurrent requests                 |     10000     |    YES    |
|   MaxBytes   |      Int64      |                    Maximum ContentLength                     |    1048576    |    YES    |
|   Timeout    |      int64      |                         Timeout (ms)                         |     3000      |    YES    |
| CpuThreshold |      int64      | Downloading threshold,Default 900(90%),Allow range 0 to 1000 |      900      |    YES    |
|  Signature   |  SignatureConf  |                   Signature Configuration                    |               |    NO     |
| Middlewares  | MiddlewaresConf |                      Enable Middleware                       |               |    NO     |

ServiceConfig General Configuration refer to <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">Basic Service Configuration</a>
MidslewaresConf Configuration Reference <a href="/docs/tutorials/http/server/middleware" target="_blank">Middleware</a>

