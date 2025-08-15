---
title: Server-Sent Events (SSE)
slug: /docs/tutorials/http/server/sse
---

import { Image } from '@arco-design/web-react';

在现代 Web 开发中，实时数据推送是一个常见需求。比如，股票价格更新或聊天消息通知。Server-Sent Events (SSE) 是一种基于 HTTP 的轻量级技术，特别适合服务器主动向客户端推送更新的场景。今天，我们将结合 **go-zero**，带你一步步实现一个简单的 SSE 服务，并附上完整代码和运行步骤。

## 什么是 SSE？

SSE（Server-Sent Events）是 HTML5 提供的一种技术，允许服务器通过持久化的 HTTP 连接向客户端单向推送事件。相比 WebSocket，SSE 更轻量，支持简单的实时更新场景，且基于标准 HTTP 协议，开箱即用。

SSE 的核心特点：
- **单向通信**：服务器主动推送，客户端被动接收。
- **简单协议**：基于 `text/event-stream` 格式，易于实现。
- **自动重连**：浏览器内置重连机制，断开后可自动尝试恢复。

接下来，我们用 go-zero 实现一个 SSE 服务，功能是每秒向客户端推送当前服务器时间。

## 实现步骤

### 1. 项目初始化

首先，确保你已安装 Go 并引入 go-zero 依赖：

```bash
go get -u github.com/zeromicro/go-zero
```

创建一个项目目录，结构如下：

```
sse-demo/
├── main.go         # 主程序
└── static/
    └── index.html  # 前端页面
```

### 2. 编写服务端代码

我们将使用 go-zero 的 REST 服务，同时集成 SSE 和静态文件服务。完整代码如下：

```go
package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/rest"
)

type SseHandler struct {
	clients map[chan string]bool
}

func NewSseHandler() *SseHandler {
	return &SseHandler{
		clients: make(map[chan string]bool),
	}
}

// Serve 处理 SSE 连接
func (h *SseHandler) Serve(w http.ResponseWriter, r *http.Request) {
	// 设置 SSE 必需的 HTTP 头
	// for versions > v1.8.1, no need to add 3 lines below
	w.Header().Add("Content-Type", "text/event-stream")
	w.Header().Add("Cache-Control", "no-cache")
	w.Header().Add("Connection", "keep-alive")

	// 为每个客户端创建一个 channel
	clientChan := make(chan string)
	h.clients[clientChan] = true

	// 客户端断开时清理
	defer func() {
		delete(h.clients, clientChan)
		close(clientChan)
	}()

	// 持续监听并推送事件
	for {
		select {
		case msg := <-clientChan:
			// 发送事件数据
			fmt.Fprintf(w, "data: %s\n\n", msg)
			w.(http.Flusher).Flush()
		case <-r.Context().Done():
			// 客户端断开连接
			return
		}
	}
}

// SimulateEvents 模拟周期性事件
func (h *SseHandler) SimulateEvents() {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for range ticker.C {
		message := fmt.Sprintf("Server time: %s", time.Now().Format(time.RFC3339))
		// 广播给所有客户端
		for clientChan := range h.clients {
			select {
			case clientChan <- message:
			default:
				// 跳过阻塞的 channel
			}
		}
	}
}

func main() {
	// 创建 go-zero REST 服务，集成静态文件服务
	server := rest.MustNewServer(rest.RestConf{
		Host: "0.0.0.0",
		Port: 8080,
	}, rest.WithFileServer("/static", http.Dir("static")))
	defer server.Stop()

	// 初始化 SSE 处理
	sseHandler := NewSseHandler()

	// 注册 SSE 路由
	// for go-zero versions <= v1.8.1
	server.AddRoute(rest.Route{
		Method:  http.MethodGet,
		Path:    "/sse",
		Handler: sseHandler.Serve,
	}, rest.WithTimeout(0))

	// for go-zero versions > v1.8.1
	server.AddRoute(rest.Route{
		Method:  http.MethodGet,
		Path:    "/sse",
		Handler: sseHandler.Serve,
	}, rest.WithSSE())
	
	// 在单独的 goroutine 中模拟事件
	go sseHandler.SimulateEvents()

	logx.Info("Server starting on :8080")
	server.Start()
}
```

#### 代码解析

- **SseHandler 结构**：
    - 使用 `map[chan string]bool` 维护所有客户端的 channel，方便广播消息。
    - `NewSseHandler` 初始化这个 map。

- **Serve 方法**：
    - 设置 SSE 必需的 HTTP 头：`Content-Type: text/event-stream`、`Cache-Control: no-cache` 和 `Connection: keep-alive`。
    - 为每个连接创建一个 channel，存储到 `clients` 中。
    - 使用 `select` 监听 channel 消息或客户端断开信号（通过 `r.Context().Done()`）。
    - 收到消息时，格式化为 SSE 协议（`data: 消息\n\n`），并通过 `Flush()` 立即推送。

- **SimulateEvents 方法**：
    - 使用 `time.Ticker` 每秒生成一个事件（当前时间）。
    - 遍历 `clients`，将消息广播给所有连接的客户端。
    - 使用非阻塞发送（`select` + `default`），避免某个客户端阻塞影响整体。

- **main 函数**：
    - 使用 `rest.MustNewServer` 创建服务，监听 `8080` 端口。
    - 通过 `rest.WithFileServer` 配置静态文件服务，映射 `/static` 到本地 `static` 目录。
    - 注册 `/sse` 路由，绑定 `SseHandler.Serve`，并禁用超时，确保长连接不会被超时机制中断，如果是在 `api` 文件中定义 `SSE` 路由，需要加上 `timeout: 0s`。
    - 在 goroutine 中启动事件模拟。

### 3. 编写前端代码

在 `static/index.html` 中编写简单的客户端代码：

```html
<!DOCTYPE html>
<html>
<head>
    <title>SSE 示例</title>
</head>
<body>
    <h1>Server-Sent Events 演示</h1>
    <div id="events"></div>

    <script>
        const eventList = document.getElementById('events');
        // 连接到同一服务器的 SSE 端点
        const source = new EventSource('/sse');

        source.onmessage = function(event) {
            const newElement = document.createElement("p");
            newElement.textContent = event.data;
            eventList.appendChild(newElement);
        };

        source.onerror = function() {
            console.log("发生错误");
        };
    </script>
</body>
</html>
```

#### 前端解析

- 使用 `EventSource` 连接到 `/sse` 端点。
- `onmessage` 回调接收服务器推送的数据，动态添加到页面。
- `onerror` 处理连接错误（例如服务器关闭）。

### 4. 运行和测试

1. **保存文件**：确保 `main.go` 和 `static/index.html` 在正确的位置。
2. **启动服务**：
   ```bash
   go run main.go
   ```
3. **访问页面**：打开浏览器，输入 `http://localhost:8080/static/index.html`。
4. **效果**：页面每秒显示一条新的服务器时间。

## 关键技术点

### SSE 协议
SSE 使用简单的文本格式推送事件：
```
data: 消息内容\n\n
```
可以用 `event:` 指定事件类型，`id:` 设置事件 ID，`retry:` 配置重连时间。例如：
```
event: update\ndata: Hello\nid: 1\n\n
```

### go-zero 的优势
- **路由简洁**：`AddRoute` 轻松绑定 handler。
- **静态服务**：`WithFileServer` 一行代码搞定静态文件托管。
- **高性能**：go-zero 内置的并发优化，确保多客户端连接稳定。

### 注意事项
- **CORS**：当前代码中，HTML 和 SSE 同源，无需 CORS。如果前端部署在其他域名，需添加 `w.Header().Add("Access-Control-Allow-Origin", "*")`。
- **客户端管理**：使用 `defer` 清理断开连接的客户端，避免内存泄漏。
- **非阻塞广播**：`select` + `default` 确保某个客户端阻塞不会影响其他客户端。

## 扩展思路

- **自定义事件**：在 `SimulateEvents` 中添加不同类型的事件，客户端用 `source.addEventListener` 监听。
- **认证**：在 `Serve` 中检查请求头或参数，实现权限控制。
- **更多数据**：推送 JSON 格式数据，客户端解析后渲染复杂 UI。

## sse 代码生成

### 示例

在 goctl 1.9.0-alpha 版本，已经内置了 sse 示例代码生成，如下为 sse 代码生成步骤。

1. 在 api 文件中声明接口，接口必须要包含返回体，否则代码生成会报错，类似

```plaintext
syntax error: sse-demo.api 20:7 missing response type 
```

2. 在 @server 注解中声明 `sse: true`，下列为 api 示例，文件名为 sse-demo.api

```go 
syntax = "v1"

type (
	SseReq {
		Body string `json:"body"`
	}
	SseResp {
		Msg string `json:"msg"`
	}
)

@server (
	sse: true
)
service sse {
	@handler sse
	post /sse/with/req (SseReq) returns (SseResp)

	@handler sseresp
	post /sse/without/resp returns (*SseResp)
}
```

3. 生成 api go 代码，就会得到一个支持 sse 的 http 服务。

```bash
goctl api go --api sse-demo.api --dir .
```

### 模板说明

sse 的 handler 和 logic 模板与普通的 http 接口服务的 handler 模板存在不同，sse 的 handler 的模板中是一个以 `chan` 来传递事件的 channel，而不是直接返回一个响应体。

如下声明了相似路由 声明了 sse 和没有声明 sse 的 handler、logic 区别

**handler diff**

<Image
src={require('../../../resource/tutorials/http/sse_http_handler_diff.png').default}
alt='goctl'
/>

**logic diff**

<Image
src={require('../../../resource/tutorials/http/sse_http_logic_diff.png').default}
alt='goctl'
/>

## 总结

通过 go-zero，我们轻松实现了一个 SSE 服务，展示了服务器如何实时推送数据给客户端。代码简洁、功能完整，非常适合学习和扩展。无论是实时监控、通知系统还是简单的数据流应用，SSE 配合 go-zero 都是一个优雅的选择。
