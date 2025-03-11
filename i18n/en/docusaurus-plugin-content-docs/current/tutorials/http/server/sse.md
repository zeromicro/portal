---
title: Server-Sent Events (SSE)
slug: /docs/tutorials/http/server/sse
---

# Building Real-Time Updates with Server-Sent Events (SSE)

In web development, real-time updates are everywhere—think live stock tickers, chat notifications, or server monitoring dashboards. While WebSocket often steals the spotlight for real-time communication, Server-Sent Events (SSE) offers a simpler, HTTP-based alternative for server-to-client streaming. In this article, we’ll explore how to implement SSE using **go-zero**, a high-performance Go framework, complete with a working example you can try yourself.

## Why SSE?

SSE is a lightweight protocol built into HTML5, designed for scenarios where the server needs to push updates to clients over a single, long-lived HTTP connection. Unlike WebSocket’s bidirectional complexity, SSE is unidirectional and leverages standard HTTP, making it easier to set up and debug.

Key benefits:
- **Simplicity**: Uses plain `text/event-stream` over HTTP.
- **Built-in Reconnection**: Browsers automatically retry on disconnects.
- **Lightweight**: Perfect for one-way data flows like notifications or live feeds.

Today, we’ll use go-zero to build an SSE service that streams server timestamps to connected clients every second. Let’s dive in!

## Setting Up the Project

First, ensure you have Go installed (1.16+ recommended). Then, grab the go-zero framework:

```bash
go get -u github.com/zeromicro/go-zero
```

Create a project directory with this structure:

```
sse-demo/
├── main.go          # Server code
└── static/
    └── index.html   # Client HTML
```

## The Server Code

Here’s the complete Go code to power our SSE service:

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
	clients map[chan string]struct{}
}

func NewSseHandler() *SseHandler {
	return &SseHandler{
		clients: make(map[chan string]struct{}),
	}
}

// Serve handles the SSE connection
func (h *SseHandler) Serve(w http.ResponseWriter, r *http.Request) {
	// Set SSE headers
	w.Header().Add("Content-Type", "text/event-stream")
	w.Header().Add("Cache-Control", "no-cache")
	w.Header().Add("Connection", "keep-alive")

	// Register a new client
	clientChan := make(chan string)
	h.clients[clientChan] = struct{}{}

	// Clean up on disconnect
	defer func() {
		delete(h.clients, clientChan)
		close(clientChan)
	}()

	// Stream events
	for {
		select {
		case msg := <-clientChan:
			fmt.Fprintf(w, "data: %s\n\n", msg)
			w.(http.Flusher).Flush()
		case <-r.Context().Done():
			return // Client disconnected
		}
	}
}

// SimulateEvents pushes periodic updates
func (h *SseHandler) SimulateEvents() {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for range ticker.C {
		message := fmt.Sprintf("Server time: %s", time.Now().Format(time.RFC3339))
		for clientChan := range h.clients {
			select {
			case clientChan <- message:
			default: // Skip blocked channels
			}
		}
	}
}

func main() {
	server := rest.MustNewServer(rest.RestConf{
		Host: "0.0.0.0",
		Port: 8080,
	}, rest.WithFileServer("/static", http.Dir("static")))
	defer server.Stop()

	sseHandler := NewSseHandler()

	// Register SSE endpoint with no timeout
	server.AddRoute(rest.Route{
		Method:  http.MethodGet,
		Path:    "/sse",
		Handler: sseHandler.Serve,
	}, rest.WithTimeout(0)) // Critical for long-lived connections

	go sseHandler.SimulateEvents()

	logx.Info("Server starting on :8080")
	server.Start()
}
```

### Breaking It Down

1. **SseHandler**:
    - Uses `map[chan string]struct{}` to track connected clients. The empty struct (`struct{}`) is a zero-byte type, making it more memory-efficient than a `bool` for simple presence tracking.
    - Each client gets its own channel for receiving messages.

2. **Serve Method**:
    - Sets SSE-specific headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`, and `Connection: keep-alive`.
    - Loops indefinitely, sending messages from the client’s channel or exiting when the client disconnects (via `r.Context().Done()`).
    - Uses `Flush()` to push data immediately over the connection.

3. **SimulateEvents**:
    - Runs a ticker to generate a timestamp every second.
    - Broadcasts the message to all clients, skipping blocked channels with a non-blocking `select`.

4. **Main Function**:
    - Sets up a go-zero REST server on port 8080.
    - Uses `rest.WithFileServer` to serve static files (our HTML client) from the `static` folder.
    - Registers the `/sse` endpoint with `rest.WithTimeout(0)`—a crucial detail we’ll explain next.

### The Timeout Twist

SSE relies on a persistent connection, but go-zero’s default request timeout (typically 10 seconds) would cut it off prematurely. By passing `rest.WithTimeout(0)` to `AddRoute`, we disable the timeout, ensuring the connection stays alive as long as needed. Without this, your clients would disconnect unexpectedly—definitely not the real-time experience we want!

## The Client Code

Save this as `static/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>SSE Demo</title>
</head>
<body>
    <h1>Server-Sent Events Demo</h1>
    <div id="events"></div>

    <script>
        const eventList = document.getElementById('events');
        const source = new EventSource('/sse');

        source.onmessage = function(event) {
            const p = document.createElement('p');
            p.textContent = event.data;
            eventList.appendChild(p);
        };

        source.onerror = function() {
            console.log('Connection error');
        };
    </script>
</body>
</html>
```

This simple page:
- Connects to `/sse` using `EventSource`.
- Appends each received message as a paragraph.
- Logs errors if the connection fails.

Since the HTML is served from the same server (`/static`), we avoid CORS issues—no need for extra headers like `Access-Control-Allow-Origin`.

## Running the Demo

1. Save the Go code as `main.go` and the HTML as `static/index.html`.
2. Run the server:
   ```bash
   go run main.go
   ```
3. Open your browser to `http://localhost:8080/static/index.html`.
4. Watch the timestamps roll in every second!

## Tips and Tricks

- **Scaling**: Use a buffered channel or a pub/sub system (like Redis) for high client volumes.
- **Security**: Add authentication (e.g., check headers in `Serve`) if exposing this publicly.
- **Custom Events**: Extend the SSE format with `event: type\ndata: value\n\n` for richer updates.

## Why go-zero?

go-zero shines here with its minimalist routing, built-in static file serving, and performance optimizations. It abstracts away boilerplate while giving you full control over the HTTP layer—perfect for SSE’s quirks like long connections.

## Conclusion

With just a few dozen lines of code, we’ve built a real-time SSE service using go-zero. Whether you’re streaming logs, updates, or metrics, this approach is a lightweight, reliable starting point. Try extending it with your own data—maybe a live CPU monitor or a chat feed—and let me know how it goes in the comments!