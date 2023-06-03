---
title: Route Prefix
slug: /docs/tutorials/api/route/prefix
---

## Overview

In go-zero, we declared HTTP service via api language, and then generated HTTP service code via goctl, after our systematic introduction to <a href="/docs/tutorials" target="_blank">API norm</a>.

Routing prefix demand is very common in HTTP service development, for example, we differentiate versions by routing, or different services by routing, which are very common.

## Route Prefix

Assuming that we have a user service, we need to route out different versions, we can use api language to state the route prefix：

```
https://example.com/v1/users
https://example.com/v2/users
```

In the above routes, we have distinguished the route by `v1` and `v2` by distinguishing between `/users` through api languages we can state the route prefix：

```go {12,20}
syntax = "v1"

type UserV1 {
    Name string `json:"name"`
}

type UserV2 {
    Name string `json:"name"`
}

@server (
    prefix: /v1
)
service user-api {
    @handler usersv1
    get /users returns ([]UserV1)
}

@server (
    prefix: /v2
)
service user-api {
    @handler usersv2
    get /users returns ([]UserV2)
}


```

In the above, we have stated the routing processing function by `server` via `prefix` keywords and then by `@handler` so that we can distinguish different versions by routing prefix.

Below look briefly at the generated routing code：

```go {10,21}
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

In the above, we can see that the `prefix` that we have declared is actually generating the code by `rest.WithPrefix` to declare the route prefix so that we can distinguish different versions by routing prefix.
