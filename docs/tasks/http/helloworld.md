---
title: Hello World
slug: /docs/tasks/http/hello-world
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本节将演示如何使用 go-zero 创建一个简单的 HTTP 服务。

## 示例

<Tabs>

<TabItem value="etc/helloworld.yaml" label="etc/helloworld.yaml" default>

```yaml
Name: HelloWorld.api
Host: 127.0.0.1
Port: 8080
```

</TabItem>

<TabItem value="main.go" label="main.go" default>

```go
func main() {
	var restConf rest.RestConf
	conf.MustLoad("etc/helloworld.yaml", &restConf)
	s, err := rest.NewServer(restConf)
	if err != nil {
		log.Fatal(err)
		return
	}

	s.AddRoute(rest.Route{ // 添加路由
		Method: http.MethodGet,
		Path:   "/hello/world",
		Handler: func(writer http.ResponseWriter, request *http.Request) { // 处理函数
			httpx.OkJson(writer, "Hello World!")
		},
	})

	defer s.Stop()
	s.Start() // 启动服务
}
```

</TabItem>

</Tabs>

rest 服务配置可参考 <a href="/docs/tutorials/http/server/configuration" target="_blank"> HTTP 服务配置</a>

除了通过上述方式启动一个简单的 HTTP 服务外，还可以

1. 通过 goctl 快速创建一个 HTTP 服务: 具体可参考 <a href="/docs/tutorials/cli/api#new" target="_blank"> goctl api new </a>
2. 通过 goctl 快速创建并启动一个 HTTP 服务，具体可参考 <a href="/docs/tutorials/cli/quickstart#使用示例" target="_blank"> goctl quickstart </a>

## 参考文献

- <a href="/docs/tutorials/cli/overview" target="_blank"> 《goctl 指令概览》 </a>
- <a href="/docs/tutorials/http/server/configuration" target="_blank"> 《HTTP 服务配置》</a>
