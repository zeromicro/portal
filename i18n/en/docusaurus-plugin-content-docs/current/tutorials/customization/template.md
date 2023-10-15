---
title: Template customization
slug: /docs/tutorials/customization/template
---

## Overview

goctl code generation is go based on template to implement data drive. While currently goctl code generation meets some of the code successes, the template custom can enrich code generation.

Template instructions can be consulted <a href="/docs/tutorials/cli/template" target="_blank">goctl template</a>

## Sample

## Scenes

Implementing unified body response, following：

```json
{
  "code": 0,
  "msg": "OK",
  "data": {} // ①
}
```

① Actual Response Data

:::tip
`go-zero`generated code not handled
:::

### Preparation

我们提前在 `module` 为 `greet` 的工程下的 `response` 包中写一个 `Response` 方法，目录树类似如下：

```text
greet
├── response
│   └── response.go
└── xxx...
```

Code:

```go
package response

import (
    "net/http"

    "github.com/zeromicro/go-zero/rest/httpx"
)

type Body struct {
    Code int         `json:"code"`
    Msg  string      `json:"msg"`
    Data interface{} `json:"data,omitempty"`
}

func Response(w http.ResponseWriter, resp interface{}, err error) {
    var body Body
    if err != nil {
        body.Code = -1
        body.Msg = err.Error()
    } else {
        body.Msg = "OK"
        body.Data = resp
    }
    httpx.OkJson(w, body)
}
```

### Edit `handler` template

```shell
$ vim ~/.goctl/${goctl_version}/api/handler.tpl
```

Replace the template with the following

```go
package handler

import (
    "net/http"
    "greet/response"// ①
    {{.ImportPackages}}
)

func {{.HandlerName}}(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        {{if .HasRequest}}var req types.{{.RequestType}}
        if err := httpx.Parse(r, &req); err != nil {
            httpx.Error(w, err)
            return
        }{{end}}

        l := logic.New{{.LogicType}}(r.Context(), svcCtx)
        {{if .HasResp}}resp, {{end}}err := l.{{.Call}}({{if .HasRequest}}&req{{end}})
        {{if .HasResp}}response.Response(w, resp, err){{else}}response.Response(w, nil, err){{end}}//②

    }
}
```

①  Replace with your real`response`package name, information

② Custom Template Content

::tip 1. If you don't have`~/.goctl/${goctl版本号}/api/handler.tpl`file you can initialize the template initialization command`goctl template format in`initialize
:
:::

### Compare the template before and after

- Modify before

```go
func GreetHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req types.Request
        if err := httpx.Parse(r, &req); err != nil {
            httpx.Error(w, err)
            return
        }

        l := logic.NewGreetLogic(r.Context(), svcCtx)
        resp, err := l.Greet(&req)
        // 以下内容将被自定义模板替换
        if err != nil {
            httpx.Error(w, err)
        } else {
            httpx.OkJson(w, resp)
        }
    }
}
```

- Modified

```go
func GreetHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req types.Request
        if err := httpx.Parse(r, &req); err != nil {
            httpx.Error(w, err)
            return
        }

        l := logic.NewGreetLogic(r.Context(), svcCtx)
        resp, err := l.Greet(&req)
        response.Response(w, resp, err)
    }
}
```

### Modify response body comparison before and after template

- Modify before

```json
{
  "message": "Hello go-zero!"
}
```

- Modified

```json
{
  "code": 0,
  "msg": "OK",
  "data": {
    "message": "Hello go-zero!"
  }
}
```

## Template Custom Rules

1. Modify within valid data range provided by goctl, i.e. external variables are not supported
2. Adding template file is not supported
3. Variable changes not supported

## References

- <a href="/docs/tutorials/cli/template" target="_blank">goctl template</a>
- <a href="https://golang.org/pkg/text/template/" target="_blank">text/template</a>
