---
title: 服务配置
slug: /docs/tutorials/http/server/configuration
---

## 概述

HTTP 服务配置主要用于对 HTTP 服务主机，端口，证书等进行控制。

## 配置说明

golang 结构体定义：

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

http server主要配置项如下表：

|     名称     |  类型  |                     含义                      | 默认值  | 是否必选 |
| :----------: | :----: | :-------------------------------------------: | :-----: | :------: |
|     Host     | string |                   监听地址                    | 0.0.0.0 |    是    |
|     Port     |  int   |                   监听端口                    |   无    |    是    |
|   CertFile   | string |                 https证书文件                 |   无    |    否    |
|   KeyFile    | string |                 https私钥文件                 |   无    |    否    |
|   Verbose    |  bool  |               是否打印详细日志                |   无    |    否    |
|   MaxConns   |  int   |                  并发请求数                   |  10000  |    是    |
|   MaxBytes   | Int64  |               最大ContentLength               | 1048576 |    是    |
|   Timeout    | int64  |                 超时时间(ms)                  |  3000   |    是    |
| CpuThreshold | int64  | 降载阈值，默认900(90%)，可允许设置范围0到1000 |   900   |    是    |
|  Signature   |  SignatureConf      |                   签名配置                    |         |    否    |
| Middlewares  |  MiddlewaresConf      |                  启用中间件                   |         |    否    |

ServiceConfig 通用配置请参考 <a href="/docs/tutorials/go-zero/configuration/service" target="_blank">《基础服务配置》</a>
MiddlewaresConf 配置可参考 <a href="/docs/tutorials/http/server/middleware" target="_blank">《中间件》</a>
