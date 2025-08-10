# go-zero API 中的 SSE（服务器推送事件）支持

## 概述

go-zero 现已通过 `@server` 指令中的 `sse: true` 注解支持服务器推送事件（Server-Sent Events, SSE）。这使得服务器可以向客户端进行实时事件流传输。

## 使用方法

### SSE 支持

```api
syntax = "v1"

type EventMessage {
    Type string `json:"type"`
    Data string `json:"data"`
}

@server (
    sse: true
    prefix: /api/v1
)
service EventApi {
    @handler StreamEvents
    get /events returns (EventMessage)
}
```

## 生成的代码

当指定 `sse: true` 时，goctl 会生成带有 `rest.WithSSE()` 选项的路由：

```go
server.AddRoutes(
    []rest.Route{
        {
            Method:  http.MethodGet,
            Path:    "/events",
            Handler: StreamEventsHandler(serverCtx),
        },
    },
    rest.WithPrefix("/api/v1"),
    rest.WithSSE(),
)
```

## 实现细节

`rest.WithSSE()` 选项会自动：

1. 设置适当的 SSE 头部（`Content-Type: text/event-stream`，`Cache-Control: no-cache` 等）
2. 移除写入超时以允许长时间运行的连接
3. 启用连接保持活动

## 注意事项

- SSE 路由通常应使用 `GET` 方法
- 连接将保持打开状态，直到客户端断开连接或处理程序完成
- SSE 可与 JWT 认证和中间件良好配合使用