# 模板修改

## 场景
实现统一格式的body响应，格式如下：
```json
{
  "code": 0,
  "msg": "OK",
  "data": {} // ①
}
```

① 实际响应数据

:::tip
`go-zero`生成的代码没有对其进行处理
:::

## 准备工作
我们提前在`module`为`greet`的工程下的`response`包中写一个`Response`方法，目录树类似如下：
```text
greet
├── response
│   └── response.go
└── xxx...
```

代码如下
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

## 修改`handler`模板
```shell
$ vim ~/.goctl/${goctl版本号}/api/handler.tpl
```
将模板替换为以下内容
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

① 替换为你真实的`response`包名，仅供参考

② 自定义模板内容

:::tip
1.如果本地没有`~/.goctl/${goctl版本号}/api/handler.tpl`文件，可以通过模板初始化命令`goctl template init`进行初始化
:::

## 修改模板前后对比
* 修改前
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
* 修改后
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

## 修改模板前后响应体对比

* 修改前
```json
{
    "message": "Hello go-zero!"
}
```

* 修改后
```json
{
    "code": 0,
    "msg": "OK",
    "data": {
        "message": "Hello go-zero!"
    }
}
```

# 总结
本文档仅对http相应为例讲述了自定义模板的流程，除此之外，自定义模板的场景还有：
* model 层添加kmq
* model 层生成待有效期option的model实例
* http自定义相应格式

# 方案二：logic层使用response封装方法统一格式的body响应
可以自定义code和data的返回内容

以用户登录功能模块为例

* user.api
```
syntax = "v1"

// 统一格式的响应
type Response {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data,omitempty"`
}

// 用户登录
type LoginRequest {
    Username string `json:"username"`
    Password string `json:"password"`
}

type LoginResult {
    Id           int64  `json:"id"`
    Username     string `json:"username"`
    AccessToken  string `json:"access_token"`
    AccessExpire int64  `json:"access_expire"`
    RefreshAfter int64  `json:"refresh_after"`
}

// 用户注册
type SignupRequest {
    Username string `json:"username"`
    Password string `json:"password"`
}

type SignupResult {
    Id           int64  `json:"id"`
    Username     string `json:"username"`
    AccessToken  string `json:"access_token"`
    AccessExpire int64  `json:"access_expire"`
    RefreshAfter int64  `json:"refresh_after"`
}

@server(
	group: user
)
service gateway-api {
    @handler LoginHandler
    post /user/login (LoginRequest) returns (Response)

    @handler SignupHandler
    post /user/signup (SignupRequest) returns (Response)
}
```

* response.go 代码修改为
```go
package response

import "datacenter/gateway/internal/types"

// 封装统一格式的body响应，data的类型可以自定义
func Response(code int, msg string, data interface{}) (*types.Response, error) {
	return &types.Response{
		Code: code,
		Msg:  msg,
		Data: data,
	}, nil
}

```

* internal/logic/user/loginlogic.go 代码修改为
```go
package user

import (
	"context"
	"strings"
	"time"

	"datacenter/gateway/common/response"
	"datacenter/gateway/internal/svc"
	"datacenter/gateway/internal/types"
	"datacenter/user/rpc/userclient"

	jwt "github.com/golang-jwt/jwt/v4"
	"github.com/zeromicro/go-zero/core/hash"
	"github.com/zeromicro/go-zero/core/logx"
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

func (l *LoginLogic) Login(req *types.LoginRequest) (resp *types.Response, err error) {
	if len(strings.TrimSpace(req.Username)) == 0 || len(strings.TrimSpace(req.Password)) == 0 {
		return response.Response(2001, "用户名或密码错误", nil)
	}
	// 使用user rpc
	userInfo, err := l.svcCtx.UserRpc.GetUserInfoByUsername(l.ctx, &userclient.UserNameRequest{
		Username: req.Username,
	})
	if err != nil {
		return response.Response(2003, "login调用userRpc错误:"+err.Error(), nil)
		// return nil, err
	}

	// 判断登录密码
	if userInfo.Password != hash.Md5Hex([]byte(req.Password)) {
		return response.Response(2001, "用户名或密码错误", nil)
	}

	// jwt token
	now := time.Now().Unix()
	accessSecret := l.svcCtx.Config.Auth.AccessSecret
	accessExpire := l.svcCtx.Config.Auth.AccessExpire
	jwtToken, err := l.getJwtToken(accessSecret, now, accessExpire, int64(userInfo.Id))
	if err != nil {
		return response.Response(2002, "login获取jwttoken错误:" + err.Error(), nil)
		// return nil, err
	}

	// data类型可以是map
	// return response.Response(200, "ok", map[string]interface{}{
	// 	"id":            userInfo.Id,
	// 	"username":      userInfo.Username,
	// 	"access_token":  jwtToken,
	// 	"access_expire": now + accessExpire,
	// 	"refresh_after": now + accessExpire/2,
	// })

	// data类型可以是结构体
	return response.Response(200, "ok", &types.LoginResult{
		Id:           userInfo.Id,
		Username:     userInfo.Username,
		AccessToken:  jwtToken,
		AccessExpire: now + accessExpire,
		RefreshAfter: now + accessExpire/2,
	})
}

func (l *LoginLogic) getJwtToken(secretKey string, iat, seconds, userId int64) (string, error) {
	claims := make(jwt.MapClaims)
	claims["exp"] = iat + seconds
	claims["iat"] = iat
	claims["userId"] = userId
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims = claims
	return token.SignedString([]byte(secretKey))
}

```

