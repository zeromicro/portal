---
title: api 语法
slug: /docs/tasks/dsl/api
---

## 概述

api 是 go-zero 自研的领域特性语言（下文称 api 语言 或 api 描述语言），旨在实现人性化的基础描述语言，作为生成 HTTP 服务最基本的描述语言。

api 领域特性语言包含语法版本，info 块，结构体声明，服务描述等几大块语法组成，其中结构体和 Golang 结构体 语法几乎一样，只是移出了 `struct` 关键字。

## 快速入门

本次仅以 demo 形式快速介绍 api 文件的写法，更详细的写法示例可参考 <a href="/docs/reference" target="_blank">《API 定义完整示例》</a>，详细 api 语法规范可参考 <a href="/docs/tutorials" target="_blank">《API 规范》</a>。

### 示例 1. 编写最简单的 ping 路由服务

```go
syntax = "v1"

// 定义 HTTP 服务
service foo {
    get /ping
}
```

### 示例 2. 编写一个登录接口 api 文件

```go
syntax = "v1"

type (
    // 定义登录接口的请求体
    LoginReq {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    // 定义登录接口的响应体
    LoginResp {
        Id       int64   `json:"id"`
        Name     string  `json:"name"`
        Token    string  `json:"token"`
        ExpireAt string  `json:"expireAt"`
    }
)

// 定义 HTTP 服务
// 微服务名称为 user，生成的代码目录和配置文件将和 user 值相关
service user {
    // 定义 http.HandleFunc 转换的 go 文件名称及方法
    @handler Login
    // 定义接口
    // 请求方法为 post
    // 路由为 /user/login
    // 请求体为 LoginReq
    // 响应体为 LoginResp，响应体必须有 returns 关键字修饰
    post /user/login (LoginReq) returns (LoginResp)
}
```

### 示例 3. 编写简单的用户服务 api 文件

```go
syntax = "v1"

type (
    // 定义登录接口的 json 请求体
    LoginReq {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    // 定义登录接口的 json 响应体
    LoginResp {
        Id       int64   `json:"id"`
        Name     string  `json:"name"`
        Token    string  `json:"token"`
        ExpireAt string  `json:"expireAt"`
    }
)

type (
    // 定义获取用户信息的 json 请求体
    GetUserInfoReq {
        Id int64 `json:"id"`
    }

    // 定义获取用户信息的 json 响应体
    GetUserInfoResp {
        Id    int64   `json:"id"`
        Name  string  `json:"name"`
        Desc  string  `json:"desc"`
    }

    // 定义更新用户信息的 json 请求体
    UpdateUserInfoReq {
        Id    int64   `json:"id"`
        Name  string  `json:"name"`
        Desc  string  `json:"desc"`
    }
)


// 定义 HTTP 服务

// @server 语法块主要用于控制对 HTTP 服务生成时 meta 信息，目前支持功能有：
// 1. 路由分组
// 2. 中间件声明
// 3. 路由前缀
// 4. 超时配置
// 5. jwt 鉴权开关
// 所有声明仅对当前 service 中的路由有效
@server (
    // 代表当前 service 代码块下的路由生成代码时都会被放到 login 目录下
    group: login

    // 定义路由前缀为 "/v1"
    prefix: "/v1"
)
// 微服务名称为 user，生成的代码目录和配置文件将和 user 值相关
service user {
    // 定义 http.HandleFunc 转换的 go 文件名称及方法，每个接口都会跟一个 handler
    @handler login
    // 定义接口
    // 请求方法为 post
    // 路由为 /user/login
    // 请求体为 LoginReq
    // 响应体为 LoginResp，响应体必须有 returns 关键字修饰
    post /user/login (LoginReq) returns (LoginResp)
}


// @server 语法块主要用于控制对 HTTP 服务生成时 meta 信息，目前支持功能有：
// 1. 路由分组
// 2. 中间件声明
// 3. 路由前缀
// 4. 超时配置
// 5. jwt 鉴权开关
// 所有声明仅对当前 service 中的路由有效
@server (
    // 代表当前 service 代码块下的所有路由均需要 jwt 鉴权
    // goctl 生成代码时会将当前 service 代码块下的接口
    // 信息添加上 jwt 相关代码，Auth 值为 jwt 密钥，过期
    // 等信息配置的 golang 结构体名称
    jwt: Auth

    // 代表当前 service 代码块下的路由生成代码时都会被放到 user 目录下
    group: user

        // 定义路由前缀为 "/v1"
    prefix: "/v1"
)
// 注意，定义多个 service 代码块时，服务名称必须一致，因此这里的服务名称必须
// 和上文的 service 名称一样，为 user 服务。
service user {
    // 定义 http.HandleFunc 转换的 go 文件名称及方法，每个接口都会跟一个 handler
    @handler getUserInfo
    // 定义接口
    // 请求方法为 post
    // 路由为 /user/info
    // 请求体为 GetUserInfoReq
    // 响应体为 GetUserInfoResp，响应体必须有 returns 关键字修饰
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)

    // 定义 http.HandleFunc 转换的 go 文件名称及方法，每个接口都会跟一个 handler
    @handler updateUserInfo

    // 定义接口
    // 请求方法为 post
    // 路由为 /user/info/update
    // 请求体为 UpdateUserInfoReq
    // 由于不需要响应体，因此可以忽略不写
    post /user/info/update (UpdateUserInfoReq)
}
```

### 示例 4. 编写带有中间件的 api 服务

```go
syntax = "v1"

type GetUserInfoReq {
    Id int64 `json:"id"`
}

type GetUserInfoResp {
    Id    int64   `json:"id"`
    Name  string  `json:"name"`
    Desc  string  `json:"desc"`
}

// @server 语法块主要用于控制对 HTTP 服务生成时 meta 信息，目前支持功能有：
// 1. 路由分组
// 2. 中间件声明
// 3. 路由前缀
// 4. 超时配置
// 5. jwt 鉴权开关
// 所有声明仅对当前 service 中的路由有效
@server (
    // 定义一个鉴权控制的中间件
    middleware: AuthInterceptor
)
// 定义一个名称为 user 的服务
service user {
    // 定义 http.HandleFunc 转换的 go 文件名称及方法，每个接口都会跟一个 handler
    @handler getUserInfo
    // 定义接口
    // 请求方法为 post
    // 路由为 /user/info
    // 请求体为 GetUserInfoReq
     // 响应体为 GetUserInfoResp，响应体必须有 returns 关键字修饰
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)
}
```

### 示例 5. 编写带有超时配置的 api 服务

```go
syntax = "v1"

type GetUserInfoReq {
    Id int64 `json:"id"`
}

type GetUserInfoResp {
    Id    int64   `json:"id"`
    Name  string  `json:"name"`
    Desc  string  `json:"desc"`
}

// @server 语法块主要用于控制对 HTTP 服务生成时 meta 信息，目前支持功能有：
// 1. 路由分组
// 2. 中间件声明
// 3. 路由前缀
// 4. 超时配置
// 5. jwt 鉴权开关
// 所有声明仅对当前 service 中的路由有效
@server (
    // 定义一个超时时长为 3 秒的超时配置
    timeout: 3s
)
// 定义一个名称为 user 的服务
service user {
    // 定义 http.HandleFunc 转换的 go 文件名称及方法，每个接口都会跟一个 handler
    @handler getUserInfo
    // 定义接口
    // 请求方法为 post
    // 路由为 /user/info
    // 请求体为 GetUserInfoReq
     // 响应体为 GetUserInfoResp，响应体必须有 returns 关键字修饰
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)
}
```

## 参考文献

- <a href="/docs/reference" target="_blank">《API 定义完整示例》</a>
- <a href="/docs/tutorials" target="_blank">《API 规范》</a>
