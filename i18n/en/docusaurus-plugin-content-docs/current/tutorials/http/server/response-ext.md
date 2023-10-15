---
title: HTTP Extensions
slug: /docs/tutorials/http/server/response/ext
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Currently go-zero provides very strong http ability, but some features are still not go-zero implemented, there is a x repository dedicated to go-zero, where HTTP extensions are supported：

1. Code-data response format support
2. xml response support
3. code-msg error type support

For more information, see https://github.com/zeroicro/x

### code-data uniform response format usage

In many cases, in order to achieve a uniform response format with the front end, we usually encapsulate a layer of business code, msg and business data in the following common format：

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    ...
  }
}
```

There are currently two approaches if this format response is required：
1. Custom response format
2. Use go-zero extension to implement

We show below with a go-zero extension package.

1. Initialize a demo project

```shell
$ mkdir demo && cd demo
$ go mod init demo
```

2.  Create an api file in demo directory `user.api`, add the following

```go
syntax = "v1"

type LoginRequest {
    Username string `json:"username"`
    Password string `json:"password"`
}

type LoginResponse {
    UID int64 `json:"uid"`
    Name string `json:"name"`
}

service user {
    @handler login
    post /user/login (LoginRequest) returns (LoginResponse)
}
```

3. Generate code by goctl

```shell
$ goctl api go --api user.api --dir .
Done.
```

1. Add stock logic, modify `demo/internal/logic/loginlogic.go` file to make its code：

```go
package logic

import (
    "context"

    "demo/internal/svc"
    "demo/internal/types"

    "github.com/zeromicro/go-zero/core/logx"
    "github.com/zeromicro/x/errors"
)

type LoginLogic struct {
    logx.Logger
    ctx    context.Context
    svcCtx *svc.ServiceContext
}

func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
    return &LoginLogic{
        Logger: logx.WithContext(ctx),
        ctx:    ctx,
        svcCtx: svcCtx,
    }
}

func (l *LoginLogic) Login(req *types.LoginRequest) (resp *types.LoginResponse, err error) {
    // mock login
    if req.Username != "go-zero" || req.Password != "123456" {
        return nil, errors.New(1001, "invalid username or password")
    }

    resp = new(types.LoginResponse)
    resp.Name = "go-zero"
    resp.UID = 1
    return resp, nil
}
```

So let's first look at the format of the response before the file `demo/internal/handler/loginhandler.go`：

```shell
$ cd demo
$ go mod tidy
$ go run user.go
# before
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"123456"
}'
{"uid":1,"name":"go-zero"}

# after
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"111111"
}'
code: 1001, msg: invalid username or password
```

4. Next, we modify `demo/internal/handler/loginhandler.go` file, replacing the response method in `loginHandler` with the method in the extension pack

::tip tip tips  
This step can be implemented by modifying templates to prevent every time they are generated, custom templates can be referenced <a href="/docs/tutorials/customization/template" target="_blank">Template Customization</a>
:::

```go
package handler

import (
    "net/http"

    "demo/internal/logic"
    "demo/internal/svc"
    "demo/internal/types"
    "github.com/zeromicro/go-zero/rest/httpx"
    xhttp "github.com/zeromicro/x/http"
)

func loginHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req types.LoginRequest
        if err := httpx.Parse(r, &req); err != nil {
            httpx.ErrorCtx(r.Context(), w, err)
            return
        }

        l := logic.NewLoginLogic(r.Context(), svcCtx)
        resp, err := l.Login(&req)
        if err != nil {
            // code-data response
            xhttp.JsonBaseResponseCtx(r.Context(), w, err)
        } else {
            // code-data response
            xhttp.JsonBaseResponseCtx(r.Context(), w, resp)
        }
    }
}
```

Restart user to request a response format：

```shell
$ go run user.go
# no error case
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"123456"
}'
{"code":0,"msg":"ok","data":{"uid":1,"name":"go-zero"}}

# error case
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"111111"
}'
{"code":1001,"msg":"invalid username or password"}
```

### xml response support

Further to the above, we will change the response from `demo/internal/handler/loginhandler.go` to `x http.xhttp.OkXml` or `OkXmlCtx` if the same code-data response format is required, exchange `x http. mlBaseResponse` or `x http.XmlBaseResponseCtx` For example, we revised the following code： as an example: `x http.XmlBaseResponseCtx`

```go
package handler

import (
    "net/http"

    "demo/internal/logic"
    "demo/internal/svc"
    "demo/internal/types"
    "github.com/zeromicro/go-zero/rest/httpx"
    xhttp "github.com/zeromicro/x/http"
)

func loginHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req types.LoginRequest
        if err := httpx.Parse(r, &req); err != nil {
            httpx.ErrorCtx(r.Context(), w, err)
            return
        }

        l := logic.NewLoginLogic(r.Context(), svcCtx)
        resp, err := l.Login(&req)
        if err != nil {
            //xhttp.XmlBaseResponse(w,err)
            xhttp.XmlBaseResponseCtx(r.Context(),w,err)
        } else {
            //xhttp.XmlBaseResponse(w,resp)
            xhttp.XmlBaseResponseCtx(r.Context(),w,resp)
        }
    }
}


```

We rerun user program to see the response format：

```shell
$ go run user.go
# no error
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"123456"
}'
<xml version="1.0" encoding="UTF-8"><code>0</code><msg>ok</msg><data><UID>1</UID><Name>go-zero</Name></data></xml>

# error case
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"111111"
}'
<xml version="1.0" encoding="UTF-8"><code>1001</code><msg>invalid username or password</msg></xml>
```

## References

-  <a href="/docs/tutorials/cli/overview" target="_blank">Use goctl code generation tool</a>
- https://github.com/zeromicro/x
- <a href="/docs/tutorials/customization/template" target="_blank">Template customization</a>
