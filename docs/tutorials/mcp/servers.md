---
title: MCP
sidebar_label: MCP Servers
slug: /docs/tutorials/mcp/servers
---

# Model Context Protocol (MCP) 实现

## 概述
该包在 Go 中实现了 Model Context Protocol (MCP) 服务器规范，提供了一个使用 Server-Sent Events (SSE) 在 AI 模型和客户端之间进行实时通信的框架。该实现遵循标准化协议，用于构建具有双向通信能力的 AI 辅助应用程序。

## 核心组件

### Server-Sent Events (SSE) 通信
- **实时通信**：基于 SSE 的强大通信系统，与客户端保持持久连接
- **连接管理**：客户端注册、消息广播和客户端清理机制
- **事件处理**：用于工具、提示和资源变更的事件类型

### JSON-RPC 实现
- **请求处理**：完整的 JSON-RPC 请求处理器，用于处理 MCP 协议方法
- **响应格式化**：根据 JSON-RPC 规范进行适当的响应格式化
- **错误处理**：具有适当错误代码的全面错误处理

### 工具管理
- **工具注册**：用于注册带有处理器的自定义工具的系统
- **工具执行**：执行工具函数的机制，具有适当的超时处理
- **结果处理**：支持各种返回类型（字符串、JSON、图像）的灵活结果处理

### 提示系统
- **提示注册**：用于注册静态和动态提示的系统
- **参数验证**：对必需参数的验证和可选参数的默认值
- **消息生成**：生成格式正确的对话消息的处理器

### 资源管理
- **资源注册**：用于管理和访问外部资源的系统
- **内容交付**：按需向客户端交付资源内容的处理器
- **资源订阅**：客户端订阅资源更新的机制

### 协议特性
- **初始化序列**：通过能力协商进行适当的握手
- **通知处理**：支持标准和客户端特定的通知
- **消息路由**：将请求智能路由到适当处理器

## 技术亮点

### 配置系统
- **灵活配置**：具有合理默认值和自定义选项的配置系统
- **CORS 支持**：针对跨域请求的可配置 CORS 设置
- **服务器信息**：适当的服务器标识和版本控制

### 客户端会话管理
- **会话跟踪**：具有唯一标识符的客户端会话跟踪
- **连接健康**：Ping/pong 机制以维护连接健康
- **初始化状态**：客户端初始化状态跟踪

### 内容处理
- **多格式内容**：支持文本、代码和二进制内容
- **MIME 类型支持**：对各种内容类型的适当 MIME 类型识别
- **受众注释**：针对用户/助手目标的内容受众注释

## 使用方法

### 设置 MCP 服务器

要创建并启动 MCP 服务器：

```go
package main

import (
	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/mcp"
)

func main() {
	// 从 YAML 文件加载配置
	var c mcp.McpConf
	conf.MustLoad("config.yaml", &c)

	// 可选：禁用统计日志
	logx.DisableStat()

	// 创建 MCP 服务器
	server := mcp.NewMcpServer(c)

	// 注册工具、提示和资源（下面的示例）

	// 启动服务器并确保在退出时停止
	defer server.Stop()
	server.Start()
}
```

示例配置文件 (config.yaml)：

```yaml
name: mcp-server
host: localhost
port: 8080
mcp:
  name: my-mcp-server
  messageTimeout: 30s # 工具调用的超时时间
  cors:
    - http://localhost:3000 # 可选的 CORS 配置
```

### 注册工具

工具允许 AI 模型通过 MCP 协议执行自定义代码。

#### 基本工具示例：

```go
// 注册一个简单的回显工具
echoTool := mcp.Tool{
	Name:        "echo",
	Description: "回显用户提供的消息",
	InputSchema: mcp.InputSchema{
		Properties: map[string]any{
			"message": map[string]any{
				"type":        "string",
				"description": "要回显的消息",
			},
			"prefix": map[string]any{
				"type":        "string",
				"description": "可选的前缀，添加到回显消息前",
				"default":     "Echo: ",
			},
		},
		Required: []string{"message"},
	},
	Handler: func(ctx context.Context, params map[string]any) (any, error) {
		var req struct {
			Message string `json:"message"`
			Prefix  string `json:"prefix,optional"`
		}

		if err := mcp.ParseArguments(params, &req); err != nil {
			return nil, fmt.Errorf("failed to parse params: %w", err)
		}

		prefix := "Echo: "
		if len(req.Prefix) > 0 {
			prefix = req.Prefix
		}

		return prefix + req.Message, nil
	},
}

server.RegisterTool(echoTool)
```

#### 具有不同响应类型的工具：

```go
// 返回 JSON 数据的工具
dataTool := mcp.Tool{
	Name:        "data.generate",
	Description: "生成各种格式的示例数据",
	InputSchema: mcp.InputSchema{
		Properties: map[string]any{
			"format": map[string]any{
				"type":        "string",
				"description": "数据格式 (json, text)",
				"enum":        []string{"json", "text"},
			},
		},
	},
	Handler: func(ctx context.Context, params map[string]any) (any, error) {
		var req struct {
			Format string `json:"format"`
		}

		if err := mcp.ParseArguments(params, &req); err != nil {
			return nil, fmt.Errorf("failed to parse params: %w", err)
		}

		if req.Format == "json" {
			// 返回结构化数据
			return map[string]any{
				"items": []map[string]any{
					{"id": 1, "name": "Item 1"},
					{"id": 2, "name": "Item 2"},
				},
				"count": 2,
			}, nil
		}

		// 默认为文本
		return "示例文本数据", nil
	},
}

server.RegisterTool(dataTool)
```

#### 图像生成工具示例：

```go
// 返回图像内容的工具
imageTool := mcp.Tool{
	Name:        "image.generate",
	Description: "生成一个简单的图像",
	InputSchema: mcp.InputSchema{
		Properties: map[string]any{
			"type": map[string]any{
				"type":        "string",
				"description": "要生成的图像类型",
				"default":     "placeholder",
			},
		},
	},
	Handler: func(ctx context.Context, params map[string]any) (any, error) {
		// 直接返回图像内容
		return mcp.ImageContent{
			Data:     "base64EncodedImageData...", // Base64 编码的图像数据
			MimeType: "image/png",
		}, nil
	},
}

server.RegisterTool(imageTool)
```

#### 使用 ToolResult 进行自定义输出：

```go
// 返回自定义 ToolResult 类型的工具
customResultTool := mcp.Tool{
	Name:        "custom.result",
	Description: "返回自定义格式的结果",
	InputSchema: mcp.InputSchema{
		Properties: map[string]any{
			"resultType": map[string]any{
				"type": "string",
				"enum": []string{"text", "image"},
			},
		},
	},
	Handler: func(ctx context.Context, params map[string]any) (any, error) {
		var req struct {
			ResultType string `json:"resultType"`
		}

		if err := mcp.ParseArguments(params, &req); err != nil {
			return nil, fmt.Errorf("failed to parse params: %w", err)
		}

		if req.ResultType == "image" {
			return mcp.ToolResult{
				Type: mcp.ContentTypeImage,
				Content: map[string]any{
					"data":     "base64EncodedImageData...",
					"mimeType": "image/jpeg",
				},
			}, nil
		}

		// 默认为文本
		return mcp.ToolResult{
			Type:    mcp.ContentTypeText,
			Content: "这是来自 ToolResult 的文本结果",
		}, nil
	},
}

server.RegisterTool(customResultTool)
```

### 注册提示

提示是 AI 模型的可重用对话模板。

#### 静态提示示例：

```go
// 注册一个带有占位符的简单静态提示
server.RegisterPrompt(mcp.Prompt{
	Name:        "hello",
	Description: "一个简单的问候提示",
	Arguments: []mcp.PromptArgument{
		{
			Name:        "name",
			Description: "要问候的姓名",
			Required:    false,
		},
	},
	Content: "向 {{name}} 问好，并介绍自己是一个 AI 助手。",
})
```

#### 带有处理器函数的动态提示：

```go
// 注册一个使用处理器函数生成动态内容的提示
server.RegisterPrompt(mcp.Prompt{
	Name:        "dynamic-prompt",
	Description: "使用处理器生成动态内容的提示",
	Arguments: []mcp.PromptArgument{
		{
			Name:        "username",
			Description: "用于个性化问候的用户姓名",
			Required:    true,
		},
		{
			Name:        "topic",
			Description: "专业领域话题",
			Required:    true,
		},
	},
	Handler: func(ctx context.Context, args map[string]string) ([]mcp.PromptMessage, error) {
		var req struct {
			Username string `json:"username"`
			Topic    string `json:"topic"`
		}

		if err := mcp.ParseArguments(args, &req); err != nil {
			return nil, fmt.Errorf("failed to parse args: %w", err)
		}

		// 创建用户消息
		userMessage := mcp.PromptMessage{
			Role: mcp.RoleUser,
			Content: mcp.TextContent{
				Text: fmt.Sprintf("你好，我是 %s，我想了解 %s。", req.Username, req.Topic),
			},
		}

		// 创建带有当前时间的助手响应
		currentTime := time.Now().Format(time.RFC1123)
		assistantMessage := mcp.PromptMessage{
			Role: mcp.RoleAssistant,
			Content: mcp.TextContent{
				Text: fmt.Sprintf("你好 %s！我是一个 AI 助手，我会帮助你学习 %s。当前时间是 %s。",
					req.Username, req.Topic, currentTime),
			},
		}

		// 返回两条消息作为对话
		return []mcp.PromptMessage{userMessage, assistantMessage}, nil
	},
})
```

#### 带有代码示例的多消息提示：

```go
// 注册一个在不同编程语言中提供代码示例的提示
server.RegisterPrompt(mcp.Prompt{
	Name:        "code-example",
	Description: "提供不同编程语言的代码示例",
	Arguments: []mcp.PromptArgument{
		{
			Name:        "language",
			Description: "示例的编程语言",
			Required:    true,
		},
		{
			Name:        "complexity",
			Description: "复杂度级别 (simple, medium, advanced)",
		},
	},
	Handler: func(ctx context.Context, args map[string]string) ([]mcp.PromptMessage, error) {
		var req struct {
			Language   string `json:"language"`
			Complexity string `json:"complexity,optional"`
		}

		if err := mcp.ParseArguments(args, &req); err != nil {
			return nil, fmt.Errorf("failed to parse args: %w", err)
		}

		// 验证语言
		supportedLanguages := map[string]bool{"go": true, "python": true, "javascript": true, "rust": true}
		if !supportedLanguages[req.Language] {
			return nil, fmt.Errorf("unsupported language: %s", req.Language)
		}

		// 根据语言和复杂度生成代码示例
		var codeExample string

		switch req.Language {
		case "go":
			if req.Complexity == "simple" {
				codeExample = `
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}`
			} else {
				codeExample = `
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()
	fmt.Printf("Hello, World! Current time is %s\n", now.Format(time.RFC3339))
}`
			}
		case "python":
			// Python 示例代码
			if req.Complexity == "simple" {
				codeExample = `
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`
			} else {
				codeExample = `
import datetime

def greet(name, include_time=False):
    message = f"Hello, {name}!"
    if include_time:
        message += f" Current time is {datetime.datetime.now().isoformat()}"
    return message

print(greet("World", include_time=True))`
			}
		}

		// 根据 MCP 规范创建消息数组
		messages := []mcp.PromptMessage{
			{
				Role: mcp.RoleAssistant,
				Content: mcp.TextContent{
					Text: fmt.Sprintf("您是一个专门从事 %s 编程的有用编程助手。", req.Language),
				},
			},
			{
				Role: mcp.RoleUser,
				Content: mcp.TextContent{
					Text: fmt.Sprintf("给我展示一个 %s 级别的 %s Hello World 程序示例。", req.Complexity, req.Language),
				},
			},
			{
				Role: mcp.RoleAssistant,
				Content: mcp.TextContent{
					Text: fmt.Sprintf("以下是一个 %s 级别的 %s 示例：\n\n```%s%s\n```\n\n我如何帮助您实现这个？",
						req.Complexity, req.Language, req.Language, codeExample),
				},
			},
		}

		return messages, nil
	},
})
```

### 注册资源

资源提供对外部内容（如文件或生成的数据）的访问。

#### 基本资源示例：

```go
// 注册一个静态资源
server.RegisterResource(mcp.Resource{
	Name:        "example-document",
	URI:         "file:///example/document.txt",
	Description: "一个示例文档",
	MimeType:    "text/plain",
	Handler: func(ctx context.Context) (mcp.ResourceContent, error) {
		return mcp.ResourceContent{
			URI:      "file:///example/document.txt",
			MimeType: "text/plain",
			Text:     "这是示例文档内容。",
		}, nil
	},
})
```

#### 带有代码示例的动态资源：

```go
// 注册一个带有动态处理器的 Go 代码资源
server.RegisterResource(mcp.Resource{
	Name:        "go-example",
	URI:         "file:///project/src/main.go",
	Description: "一个带有多个文件的简单 Go 示例",
	MimeType:    "text/x-go",
	Handler: func(ctx context.Context) (mcp.ResourceContent, error) {
		// 返回包含所有必需字段的 ResourceContent
		return mcp.ResourceContent{
			URI:      "file:///project/src/main.go",
			MimeType: "text/x-go",
			Text:     "package main\n\nimport (\n\t\"fmt\"\n\t\"./greeting\"\n)\n\nfunc main() {\n\tfmt.Println(greeting.Hello(\"world\"))\n}",
		}, nil
	},
})

// 为上述示例注册一个配套文件
server.RegisterResource(mcp.Resource{
	Name:        "go-greeting",
	URI:         "file:///project/src/greeting/greeting.go",
	Description: "Go 示例的问候包",
	MimeType:    "text/x-go",
	Handler: func(ctx context.Context) (mcp.ResourceContent, error) {
		return mcp.ResourceContent{
			URI:      "file:///project/src/greeting/greeting.go",
			MimeType: "text/x-go",
			Text:     "package greeting\n\nfunc Hello(name string) string {\n\treturn \"Hello, \" + name + \"!\"\n}",
		}, nil
	},
})
```

#### 二进制资源示例：

```go
// 注册一个二进制资源（如图像）
server.RegisterResource(mcp.Resource{
	Name:        "example-image",
	URI:         "file:///example/image.png",
	Description: "一个示例图像",
	MimeType:    "image/png",
	Handler: func(ctx context.Context) (mcp.ResourceContent, error) {
		// 从文件读取图像或生成图像
		imageData := "base64EncodedImageData..." // Base64 编码的图像数据

		return mcp.ResourceContent{
			URI:      "file:///example/image.png",
			MimeType: "image/png",
			Blob:     imageData, // 用于二进制数据
		}, nil
	},
})
```

### 在提示中使用资源

您可以在提示响应中嵌入资源，以创建符合 MCP 规范的丰富交互：

```go
// 注册一个嵌入资源的提示
server.RegisterPrompt(mcp.Prompt{
	Name:        "resource-example",
	Description: "嵌入资源的提示",
	Arguments: []mcp.PromptArgument{
		{
			Name:        "file_type",
			Description: "要显示的文件类型 (rust 或 go)",
			Required:    true,
		},
	},
	Handler: func(ctx context.Context, args map[string]string) ([]mcp.PromptMessage, error) {
		var req struct {
			FileType string `json:"file_type"`
		}

		if err := mcp.ParseArguments(args, &req); err != nil {
			return nil, fmt.Errorf("failed to parse args: %w", err)
		}

		var resourceURI, mimeType, fileContent string
		if req.FileType == "rust" {
			resourceURI = "file:///project/src/main.rs"
			mimeType = "text/x-rust"
			fileContent = "fn main() {\n    println!(\"Hello world!\");\n}"
		} else {
			resourceURI = "file:///project/src/main.go"
			mimeType = "text/x-go"
			fileContent = "package main\n\nimport \"fmt\"\n\nfunc main() {\n\tfmt.Println(\"Hello, world!\")\n}"
		}

		// 使用适当的 MCP 格式创建带有嵌入资源的消息
		return []mcp.PromptMessage{
			{
				Role: mcp.RoleUser,
				Content: mcp.TextContent{
					Text: fmt.Sprintf("您能解释这个 %s 代码吗？", req.FileType),
				},
			},
			{
				Role: mcp.RoleAssistant,
				Content: mcp.EmbeddedResource{
					Type: mcp.ContentTypeResource,
					Resource: struct {
						URI      string `json:"uri"`
						MimeType string `json:"mimeType"`
						Text     string `json:"text,omitempty"`
						Blob     string `json:"blob,omitempty"`
					}{
						URI:      resourceURI,
						MimeType: mimeType,
						Text:     fileContent,
					},
				},
			},
			{
				Role: mcp.RoleAssistant,
				Content: mcp.TextContent{
					Text: fmt.Sprintf("上面是一个简单的 %s Hello World 示例。让我解释它是如何工作的。", req.FileType),
				},
			},
		}, nil
	},
})
```

### 多文件资源示例

```go
// 注册一个演示嵌入多个资源文件的提示
server.RegisterPrompt(mcp.Prompt{
	Name:        "go-code-example",
	Description: "正确嵌入多个资源文件的提示",
	Arguments: []mcp.PromptArgument{
		{
			Name:        "format",
			Description: "如何格式化代码显示",
		},
	},
	Handler: func(ctx context.Context, args map[string]string) ([]mcp.PromptMessage, error) {
		var req struct {
			Format string `json:"format,optional"`
		}

		if err := mcp.ParseArguments(args, &req); err != nil {
			return nil, fmt.Errorf("failed to parse args: %w", err)
		}

		// 获取多个文件的 Go 代码
		var mainGoText string = "package main\n\nimport (\n\t\"fmt\"\n\t\"./greeting\"\n)\n\nfunc main() {\n\tfmt.Println(greeting.Hello(\"world\"))\n}"
		var greetingGoText string = "package greeting\n\nfunc Hello(name string) string {\n\treturn \"Hello, \" + name + \"!\"\n}"

		// 按照 MCP 规范创建格式正确的嵌入资源消息
		messages := []mcp.PromptMessage{
			{
				Role: mcp.RoleUser,
				Content: mcp.TextContent{
					Text: "给我展示一个带有正确导入的简单 Go 示例。",
				},
			},
			{
				Role: mcp.RoleAssistant,
				Content: mcp.TextContent{
					Text: "这里是一个简单的 Go 示例项目：",
				},
			},
			{
				Role: mcp.RoleAssistant,
				Content: mcp.EmbeddedResource{
					Type: mcp.ContentTypeResource,
					Resource: struct {
						URI      string `json:"uri"`
						MimeType string `json:"mimeType"`
						Text     string `json:"text,omitempty"`
						Blob     string `json:"blob,omitempty"`
					}{
						URI:      "file:///project/src/main.go",
						MimeType: "text/x-go",
						Text:     mainGoText,
					},
				},
			},
		}

		// 如果需要，添加解释和其他文件
		if req.Format == "with_explanation" {
			messages = append(messages, mcp.PromptMessage{
				Role: mcp.RoleAssistant,
				Content: mcp.TextContent{
					Text: "这个示例演示了一个具有模块化结构的简单 Go 应用程序。main.go 文件从本地的 'greeting' 包导入，该包提供了 Hello 函数。",
				},
			})

			// 也以正确的资源格式显示 greeting.go 文件
			messages = append(messages, mcp.PromptMessage{
				Role: mcp.RoleAssistant,
				Content: mcp.EmbeddedResource{
					Type: mcp.ContentTypeResource,
					Resource: struct {
						URI      string `json:"uri"`
						MimeType string `json:"mimeType"`
						Text     string `json:"text,omitempty"`
						Blob     string `json:"blob,omitempty"`
					}{
						URI:      "file:///project/src/greeting/greeting.go",
						MimeType: "text/x-go",
						Text:     greetingGoText,
					},
				},
			})
		}

		return messages, nil
	},
})
```

### 完整应用示例

以下是演示所有组件的完整示例：

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/mcp"
)

func main() {
	// 加载配置
	var c mcp.McpConf
	if err := conf.Load("config.yaml", &c); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// 设置日志
	logx.DisableStat()

	// 创建 MCP 服务器
	server := mcp.NewMcpServer(c)
	defer server.Stop()

	// 注册一个简单的回显工具
	echoTool := mcp.Tool{
		Name:        "echo",
		Description: "Echoes back the message provided by the user",
		InputSchema: mcp.InputSchema{
			Properties: map[string]any{
				"message": map[string]any{
					"type":        "string",
					"description": "The message to echo back",
				},
				"prefix": map[string]any{
					"type":        "string",
					"description": "Optional prefix to add to the echoed message",
					"default":     "Echo: ",
				},
			},
			Required: []string{"message"},
		},
		Handler: func(ctx context.Context, params map[string]any) (any, error) {
			var req struct {
				Message string `json:"message"`
				Prefix  string `json:"prefix,optional"`
			}

			if err := mcp.ParseArguments(params, &req); err != nil {
				return nil, fmt.Errorf("failed to parse args: %w", err)
			}

			prefix := "Echo: "
			if len(req.Prefix) > 0 {
				prefix = req.Prefix
			}

			return prefix + req.Message, nil
		},
	}
	server.RegisterTool(echoTool)

	// 注册一个静态 prompt
	server.RegisterPrompt(mcp.Prompt{
		Name:        "greeting",
		Description: "A simple greeting prompt",
		Arguments: []mcp.PromptArgument{
			{
				Name:        "name",
				Description: "The name to greet",
				Required:    true,
			},
		},
		Content: "Hello {{name}}! How can I assist you today?",
	})

	// 注册一个动态 prompt
	server.RegisterPrompt(mcp.Prompt{
		Name:        "dynamic-prompt",
		Description: "A prompt that uses a handler to generate dynamic content",
		Arguments: []mcp.PromptArgument{
			{
				Name:        "username",
				Description: "User's name for personalized greeting",
				Required:    true,
			},
			{
				Name:        "topic",
				Description: "Topic of expertise",
				Required:    true,
			},
		},
		Handler: func(ctx context.Context, args map[string]string) ([]mcp.PromptMessage, error) {
			var req struct {
				Username string `json:"username"`
				Topic    string `json:"topic"`
			}

			if err := mcp.ParseArguments(args, &req); err != nil {
				return nil, fmt.Errorf("failed to parse args: %w", err)
			}

			// 创建包含当前时间的消息
			currentTime := time.Now().Format(time.RFC1123)
			return []mcp.PromptMessage{
				{
					Role: mcp.RoleUser,
					Content: mcp.TextContent{
						Text: fmt.Sprintf("Hello, I'm %s and I'd like to learn about %s.", req.Username, req.Topic),
					},
				},
				{
					Role: mcp.RoleAssistant,
					Content: mcp.TextContent{
						Text: fmt.Sprintf("Hello %s! I'm an AI assistant and I'll help you learn about %s. The current time is %s.",
							req.Username, req.Topic, currentTime),
					},
				},
			}, nil
		},
	})

	// 注册一个资源
	server.RegisterResource(mcp.Resource{
		Name:        "example-doc",
		URI:         "file:///example/doc.txt",
		Description: "An example document",
		MimeType:    "text/plain",
		Handler: func(ctx context.Context) (mcp.ResourceContent, error) {
			return mcp.ResourceContent{
				URI:      "file:///example/doc.txt",
				MimeType: "text/plain",
				Text:     "This is the content of the example document.",
			}, nil
		},
	})

	// 启动服务器
	fmt.Printf("Starting MCP server on %s:%d\n", c.Host, c.Port)
	server.Start()
}
```

## 错误处理

MCP 实现提供了全面的错误处理机制：

- 工具执行错误被正确报告给客户端
- 缺失或无效的参数会被检测并使用适当的错误代码报告
- 资源和 prompt 查找失败会得到优雅处理
- 使用 context 为长时间运行的工具执行提供超时处理
- Panic 恢复机制防止服务器崩溃

## 高级功能

- **Annotations**：为内容添加受众和优先级元数据
- **Content Types**：支持文本、图像、音频和其他内容格式
- **Embedded Resources**：直接在 prompt 响应中包含文件资源
- **Context Awareness**：所有处理器都接收 context.Context 以便进行超时和取消支持
- **Progress Tokens**：支持跟踪长时间运行操作的进度
- **可定制超时**：为工具和操作配置执行超时

## 性能考虑

- 工具执行使用可配置的超时运行，防止阻塞
- 高效的客户端跟踪和清理，防止资源泄露
- 使用 mutex 保护共享资源的适当并发处理
- 缓冲消息通道防止客户端消息传递阻塞