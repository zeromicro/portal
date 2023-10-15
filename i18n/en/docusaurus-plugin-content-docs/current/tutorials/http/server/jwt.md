---
title: JWT Certification
slug: /docs/tutorials/http/server/jwt
---

## Overview

JWT (JSON Web Token) is an open standard (RFC 7519) used to transmit declaratory messages between web applications.It is a lightweight JSON-based authentication and authorization mechanism for the safe transmission of information between clients and servers.

JWT comprises three parts of：headers, payloads, and signatures.

Header usually consists of two parts：token type and the encryption algorithm used.The payload is the main part of the information stored in the token.It includes statements (claims), such as user ID, username, expiry date, etc.Signature is the hash generated using the key after combination of head and payload to verify the authenticity of tokens.

JWT decryption and validation features embedded in go-zero. You can control JWT using optional parameters.

## Examples

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

## JWT Token Generate Example

```go
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

## JWT Auth Failed Custom Handling Return

Define a callback in main.go

```go
func main() {
    ........

    server := rest.MustNewServer(c.RestConf, rest.WithUnauthorizedCallback(func(w http.ResponseWriter, r *http.Request, err error) {
        // do it yourself
    }))

    .......
}

```

:::tip
If the JWT authentication fails, an error similar to the following will occur：

```
HTTP/1.1 401 Unauthorized
Date: Mon, 08 Feb 2023 23:41:57 GMT
Content-Length: 0
```

:::

## JWT Expired Management

The jwt token expired management can be implemented on its own with redis.

## References

- <a href="https://jwt.io/introduction/" target="_blank">JSON Web Token</a>
