---
title: JWT 认证 
slug: /docs/tutorials/http/server/jwt
---

## 概述

JWT（JSON Web Token）是一种开放标准（RFC 7519），用于在网络应用间传递声明式信息。它是一种基于JSON的轻量级的身份验证和授权机制，用于在客户端和服务器之间安全地传输信息。

JWT由三部分组成：头部（header）、载荷（payload）和签名（signature）。

头部通常由两部分组成：令牌类型和所使用的加密算法。载荷是包含令牌中存储的信息的主要部分。它包括一些声明（claim），例如用户ID、用户名、过期时间等等。签名是将头部和载荷组合后使用密钥生成的哈希值，用于验证令牌的真实性。

go-zero 中内置了 JWT 的解密和验证功能，你可以通过可选参数来控制是否启用 JWT。

## 使用示例

```go {9}
func main() {
	srv := rest.MustNewServer(rest.RestConf{
		Port: 8080,
	})
	srv.AddRoute(rest.Route{
		Method:  http.MethodGet,
		Path:    "/hello",
		Handler: handle,
	}, rest.WithJwt("abc123")/*开启 JWT 功能，并设置 secret 为 abc123 */)
	defer srv.Stop()
	srv.Start()
}

func handle(w http.ResponseWriter, r *http.Request) {
	httpx.OkJson(w, "hello world")
}
```

## JWT Token 生成示例

```go
// @secretKey: JWT 加解密密钥
// @iat: 时间戳
// @seconds: 过期时间，单位秒
// @payload: 数据载体
func getJwtToken(secretKey string, iat, seconds int64,payload string) (string, error) {
  claims := make(jwt.MapClaims)
  claims["exp"] = iat + seconds
  claims["iat"] = iat
  claims["payload"] = payload
  token := jwt.New(jwt.SigningMethodHS256)
  token.Claims = claims
  return token.SignedString([]byte(secretKey))
}
```


## JWT 认证失败自定义处理返回

在main.go中定义一个callback即可
```go
func main() {
	........

	server := rest.MustNewServer(c.RestConf, rest.WithUnauthorizedCallback(func(w http.ResponseWriter, r *http.Request, err error) {
		// 自定义处理返回
	}))

	.......
}

```

:::tip
如果 JWT 鉴权失败会出现如下类似错误：
```
HTTP/1.1 401 Unauthorized
Date: Mon, 08 Feb 2023 23:41:57 GMT
Content-Length: 0
```
:::

## JWT 过期管理
jwt token 过期管理可以自己使用 redis 实现。

## 参考文献

- <a href="https://jwt.io/introduction/" target="_blank">《JSON Web Token》</a>