---
title: 路由前缀
slug: /docs/tutorials/api/route/prefix
---

## 概述

在 go-zero 中，我们通过 api 语言来声明 HTTP 服务，然后通过 goctl 生成 HTTP 服务代码，在之前我们系统性的介绍了 <a href="/docs/tutorials" target="_blank">API 规范</a>。

在 HTTP 服务开发中，路由前缀需求是非常常见的，比如我们通过路由来区分版本，或者通过路由来区分不同的服务，这些都是非常常见的需求。

## 路由前缀

假设我们有一个用户服务，我们需要通过路由来区分不同的版本，我们可以通过 api 语言来声明路由前缀：

```
https://example.com/v1/users
https://example.com/v2/users
```

在上文路由中，我们通过版本 `v1` 和 `v2` 来区分了 `/users` 路由，我们可以通过 api 语言来声明路由前缀：

```go
syntax = "v1"

type UserV1 {
    Name string `json:"name"`
}

type UserV2 {
    Name string `json:"name"`
}

@server(
    prefix: /v1
)
service user-api {
    @handler usersv1
    get /users returns ([]UserV1)
}

@server(
    prefix: /v2
)
service user-api {
    @handler usersv2
    get /users returns ([]UserV2)
}
```

在上文中，我们通过在 `@server` 中来通过 `prefix` 关键字声明了路由前缀，然后通过 `@handler` 来声明了路由处理函数，这样我们就可以通过路由前缀来区分不同的版本了。

下面简单看一下生成的路由代码：

```go
func RegisterHandlers(server *rest.Server, serverCtx *svc.ServiceContext) {
    server.AddRoutes(
        []rest.Route{
            {
                Method:  http.MethodGet,
                Path:    "/users",
                Handler: usersv1Handler(serverCtx),
            },
        },
        rest.WithPrefix("/v1"),
    )

    server.AddRoutes(
        []rest.Route{
            {
                Method:  http.MethodGet,
                Path:    "/users",
                Handler: usersv2Handler(serverCtx),
            },
        },
        rest.WithPrefix("/v2"),
    )
}
```

在上文中，我们可以看到，我们声明的 `prefix` 其实在生成代码后通过 `rest.WithPrefix` 来声明了路由前缀，这样我们就可以通过路由前缀来区分不同的版本了。
