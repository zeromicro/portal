---
title: HTTP 扩展
slug: /docs/tutorials/http/server/response/ext
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

目前 go-zero 提供非常强大的 http能力，但有部分功能仍未在 go-zero 实现，在 zeromicro 下有一个 x 仓库专门用于对 go-zero 的扩展，其中 HTTP
的扩展支持了：

1. code-data 响应格式支持
2. xml 响应支持
3. code-msg error 类型支持

详情可参考 https://github.com/zeromicro/x

### code-data 统一响应格式用法

在很多情况下，为了和前端达成统一的响应格式，我们通常会封装一层业务 code，msg 及业务数据，常见格式如下：

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    ...
  }
}
```

目前如果需要实现这种格式响应，有2种做法：

1. 自定义响应格式
2. 使用 go-zero 扩展包来实现

下文我们以 go-zero 的扩展包来演示一下。

1. 初始化一个 demo 工程

```shell
$ mkdir demo && cd demo
$ go mod init demo
```

2. 在 demo 目录下创建一个 api 文件 `user.api`，添加如下内容

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

3. 通过 goctl 生成代码

```shell
$ goctl api go --api user.api --dir .
Done.
```

1. 添加 mock 逻辑，修改 `demo/internal/logic/loginlogic.go` 文件，使其代码变为：

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
    // 模拟登录逻辑
	if req.Username != "go-zero" || req.Password != "123456" {
		return nil, errors.New(1001, "用户名或密码错误")
	}

	resp = new(types.LoginResponse)
	resp.Name = "go-zero"
	resp.UID = 1
	return resp, nil
}
```

至此，我们先来看一下没有修改 `demo/internal/handler/loginhandler.go` 文件前的响应格式：

```shell
$ cd demo
$ go mod tidy
$ go run user.go
# 正常业务逻辑响应格式演示
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"123456"
}'
{"uid":1,"name":"go-zero"}

# 错误逻辑响应格式演示
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"111111"
}'
code: 1001, msg: 用户名或密码错误
```

4. 接着上面步骤，我们修改一下 `demo/internal/handler/loginhandler.go` 文件，将 `loginHandler` 中的响应方法替换成扩展包中的方法

:::tip 温馨提示
这一步，为了防止每次代码生成都要更改，可以通过修改模板来实现，自定义模板用法可参考 <a href="/docs/tutorials/customization/template" target="_blank">《模板定制化》</a>
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
		    // code-data 响应格式
			xhttp.JsonBaseResponseCtx(r.Context(), w, err)
		} else {
		    // code-data 响应格式
			xhttp.JsonBaseResponseCtx(r.Context(), w, resp)
		}
	}
}
```

重新运行 user 程序，再来请求查看一下响应格式：

```shell
$ go run user.go
# 正常业务逻辑响应格式演示
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"123456"
}'
{"code":0,"msg":"ok","data":{"uid":1,"name":"go-zero"}}

# 错误逻辑响应格式演示
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"111111"
}'
{"code":1001,"msg":"用户名或密码错误"}
```

### xml 响应格式支持

继上文，我们将 `demo/internal/handler/loginhandler.go` 文件中的响应改成 `xhttp.OkXml` 或者 `OkXmlCtx` 即可，如果需要使用同一个的 code-data 响应格式，可替换成
`xhttp.XmlBaseResponse` 或者 `xhttp.XmlBaseResponseCtx` 格式，我们以 `xhttp.XmlBaseResponseCtx` 为例子，修改后代码如下：

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

我们重新运行 user 程序，查看一下响应格式：

```shell
$ go run user.go
# 正常业务逻辑响应格式演示
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"123456"
}'
<xml version="1.0" encoding="UTF-8"><code>0</code><msg>ok</msg><data><UID>1</UID><Name>go-zero</Name></data></xml>

# 错误逻辑响应格式演示
curl --location '127.0.0.1:8888/user/login' \
--header 'Content-Type: application/json' \
--data '{
    "username":"go-zero",
    "password":"111111"
}'
<xml version="1.0" encoding="UTF-8"><code>1001</code><msg>用户名或密码错误</msg></xml>
```

## 参考文献

- <a href="/docs/tutorials/cli/overview" target="_blank">《goctl 代码生成工具使用》</a>
- https://github.com/zeromicro/x
- <a href="/docs/tutorials/customization/template" target="_blank">《模板定制化》</a>
