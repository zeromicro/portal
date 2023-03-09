---
title: 错误处理
slug: /docs/tutorials/http/server/error
---

## 概述

错误处理这里并非指 error 堆栈处理，错误管理等，而是指 HTTP 的错误处理，即以统一的数据格式响应。

## 使用示例

我们这里以常见的 code-msg 格式为例子来演示一下，响应格式如下：

- 业务处理失败

```json
{
  "code": 1001,
  "msg": "参数错误"
}
```

- 业务处理成功

```json
{
  "code": 0,
  "msg": "success",
  "data":{
    ...
  }
}
```
```json
{
  "code": 0,
  "msg": "success",
  "data":[...]
}
```

在 go-zero 中并没有内置这样的响应规范，但开发者可以通过自定义的方式来实现，这里我们以自定义的方式来实现。

1. 自定义一个错误类型

```go
package errorx

const defaultCode = 1001

type CodeError struct {
    Code int    `json:"code"`
    Msg  string `json:"msg"`
}

type CodeErrorResponse struct {
    Code int    `json:"code"`
    Msg  string `json:"msg"`
}

func NewCodeError(code int, msg string) error {
    return &CodeError{Code: code, Msg: msg}
}

func NewDefaultError(msg string) error {
    return NewCodeError(defaultCode, msg)
}

func (e *CodeError) Error() string {
    return e.Msg
}

func (e *CodeError) Data() *CodeErrorResponse {
    return &CodeErrorResponse{
        Code: e.Code,
        Msg:  e.Msg,
    }
}

```

2. 使用自定义错误

```go
func main() {
	srv := rest.MustNewServer(rest.RestConf{
		Port: 8080,
	})
	srv.AddRoute(rest.Route{
		Method:  http.MethodGet,
		Path:    "/hello",
		Handler: handle,
	}, rest.WithJwt("abc123"))
	defer srv.Stop()
    // httpx.SetErrorHandler 仅在调用了 httpx.Error 处理响应时才有效。
	httpx.SetErrorHandler(func(err error) (int, any) {
		switch e := err.(type) {
		case *CodeError:
			return http.StatusOK, e.Data()
		default:
			return http.StatusInternalServerError, nil
		}
	})
	srv.Start()
}

func handle(w http.ResponseWriter, r *http.Request) {
	// 模拟参数错误
	httpx.Error(w, NewDefaultError("参数错误"))
}

const defaultCode = 1001

type CodeError struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

type CodeErrorResponse struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
}

func NewCodeError(code int, msg string) error {
	return &CodeError{Code: code, Msg: msg}
}

func NewDefaultError(msg string) error {
	return NewCodeError(defaultCode, msg)
}

func (e *CodeError) Error() string {
	return e.Msg
}

func (e *CodeError) Data() *CodeErrorResponse {
	return &CodeErrorResponse{
		Code: e.Code,
		Msg:  e.Msg,
	}
}
```
