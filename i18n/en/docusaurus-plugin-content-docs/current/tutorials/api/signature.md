---
title: Signature switch
slug: /docs/tutorials/api/signature
---

## Overview

In go-zero, we declared HTTP service via api language, and then generated HTTP service code via goctl, after our systematic introduction to <a href="/docs/tutorials" target="_blank">API norm</a>.

In go-zero we already have built-in signature features. We can enable signature by api language and then generate signature code by goctl, so we can use the signature function in the HTTP service.

## Signature switch

In api language, we can start signing up with `signature` keyword, assuming we have a signdemo service, we have an interface below：

```
https://example.com/sign/demo
```

Its api language follows：

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

Let's see the routing code generated, the full code click <a href={require('/docs/resource/tutorials/api/signdemo.zip').default} target="_blank">to download it here</a>

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

It can be seen that we open the signature feature with `res.WithSignature` so we can use the signature feature in the HTTP service.