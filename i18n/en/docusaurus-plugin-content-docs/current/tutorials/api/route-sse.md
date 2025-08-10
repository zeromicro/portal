# SSE (Server-Sent Events) Support in go-zero API

## Overview

go-zero now supports Server-Sent Events (SSE) through the `sse: true` annotation in the `@server` directive. This enables real-time event streaming from the server to clients.

## Usage

### SSE Support

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

## Generated Code

When `sse: true` is specified, goctl generates routes with the `rest.WithSSE()` option:

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

## Implementation Details

The `rest.WithSSE()` option automatically:

1. Sets proper SSE headers (`Content-Type: text/event-stream`, `Cache-Control: no-cache`, etc.)
2. Removes write timeouts to allow long-running connections
3. Enables connection keep-alive

## Notes

- SSE routes should typically use `GET` method
- The connection will remain open until the client disconnects or the handler completes
- SSE works well with JWT authentication and middleware
