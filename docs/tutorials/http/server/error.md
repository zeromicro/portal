---
title: 错误处理
slug: /docs/tutorials/http/server/error
---

## 概述

错误处理这里并非指 error 堆栈处理，错误管理等，而是指 HTTP 的错误处理。

## 使用示例

我们来模拟当 error 为 `*errors.CodeMsg` 类型时，以 `code-msg` 格式响应错误。

```go
package main

import (
	"go/types"
	"net/http"

	"github.com/zeromicro/go-zero/rest"
	"github.com/zeromicro/go-zero/rest/httpx"
	"github.com/zeromicro/x/errors"
	xhttp "github.com/zeromicro/x/http"
)

func main() {
	srv := rest.MustNewServer(rest.RestConf{
		Port: 8080,
	})
	srv.AddRoute(rest.Route{
		Method:  http.MethodPost,
		Path:    "/hello",
		Handler: handle,
	})
	defer srv.Stop()
	// httpx.SetErrorHandler 仅在调用了 httpx.Error 处理响应时才有效。
	httpx.SetErrorHandler(func(err error) (int, any) {
		switch e := err.(type) {
		case *errors.CodeMsg:
			return http.StatusOK, xhttp.BaseResponse[types.Nil]{
				Code: e.Code,
				Msg:  e.Msg,
			}
		default:
			return http.StatusInternalServerError, nil
		}
	})
	srv.Start()
}

type HelloRequest struct {
	Name string `json:"name"`
}

type HelloResponse struct {
	Msg string `json:"msg"`
}

func handle(w http.ResponseWriter, r *http.Request) {
	var req HelloRequest
	if err := httpx.Parse(r, &req); err != nil {
		httpx.Error(w, err)
		return
	}

	if req.Name == "error" {
		// 模拟参数错误
		httpx.Error(w, errors.New(400, "参数错误"))
		return
	}

	httpx.OkJson(w, HelloResponse{
		Msg: "hello " + req.Name,
	})
}

```

```shell
$ curl --location '127.0.0.1:8080/hello' \
--header 'Content-Type: application/json' \
--data '{
    "name":"go-zero"
}'
{"msg":"hello go-zero"}

$ curl --location '127.0.0.1:8080/hello' \
--header 'Content-Type: application/json' \
--data '{
    "name":"error"
}'
{"code":400,"msg":"参数错误","data":{}}
```

:::tip 温馨提示
这里仅演示 `httpx.SetErrorHandler` 的用法，如需指定 HTTP 统一响应格式请参考 <a href="/docs/tutorials/http/server/response/ext" target="_blank">《统一响应格式》</a>
:::
