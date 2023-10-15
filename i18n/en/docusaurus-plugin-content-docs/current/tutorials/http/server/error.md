---
title: Error processing
slug: /docs/tutorials/http/server/error
---

## Overview

Error processing here does not refer to stack handling, error management, etc. but rather to HTTP error handling.

## Examples

Let's simulate an error in the format `code-msg` when the error is `*errors.CodeMsg`.

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
    // httpx.SetErrorHandler is only valid if httpx.Error is called to handle the response.
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
        // mock parameter error
        httpx.Error(w, errors.New(400, "dummy error"))
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
{"code":400,"msg":"dummy error","data":{}}
```

::tip hint
Here is only a demonstration of the usability of `httpx.SetErrorHandler` , refer to <a href="/docs/tutorials/http/server/response/ext" target="_blank">Unified Response Format</a>
:
:::
