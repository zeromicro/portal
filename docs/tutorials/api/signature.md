---
title: 签名开关
slug: /docs/tutorials/api/signature
---

## 概述

在 go-zero 中，我们通过 api 语言来声明 HTTP 服务，然后通过 goctl 生成 HTTP 服务代码，在之前我们系统性的介绍了 <a href="/docs/tutorials" target="_blank">API 规范</a>。

在 go-zero 中，已经内置了签名功能，我们可以通过 api 语言来开启签名功能，然后通过 goctl 生成签名代码，这样我们就可以在 HTTP 服务中使用签名功能了。

## 签名开关

在 api 语言中，我们可以通过 `signature` 关键字来开启签名功能，假设我们有一个 signdemo 服务，我们有一个接口如下：

```
https://example.com/sign/demo
```

其对应的 api 语言如下：

```go {13}
syntax = "v1"

type (
	SignDemoReq {
		Msg string `json:"msg"`
	}
	SignDemoResp {
		Msg string `json:"msg"`
	}
)

@server (
	signature: true // 通过 signature 关键字开启签名功能
)
service sign-api {
	@handler SignDemo
	post /sign/demo (SignDemoReq) returns (SignDemoResp)
}


```

我们来看一下生成的路由代码，完整代码点击 <a href={require('/docs/resource/tutorials/api/signdemo.zip').default} target="_blank">这里下载</a>

```go {10}
func RegisterHandlers(server *rest.Server, serverCtx *svc.ServiceContext) {
    server.AddRoutes(
        []rest.Route{
            {
                Method:  http.MethodPost,
                Path:    "/sign/demo",
                Handler: SignDemoHandler(serverCtx),
            },
        },
        rest.WithSignature(serverCtx.Config.Signature),
    )
}
```

可以看到，我们通过 `rest.WithSignature` 来开启签名功能，这样我们就可以在 HTTP 服务中使用签名功能了。
