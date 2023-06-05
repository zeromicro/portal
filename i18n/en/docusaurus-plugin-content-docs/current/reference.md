---
title: Full example of API definition
sidebar_label: Full Example of API Defining
slug: /docs/reference
---

## api Example

Show only the full writing and syntax description of api files below. See the api specification by reference to [API norms](/docs/tutorials)

```go
syntax = "v1"

info (
    title:   "api 文件完整示例写法"
    desc:    "演示如何编写 api 文件"
    author:  "keson.an"
    date:    "2022 年 12 月 26 日"
    version: "v1"
)

type UpdateReq {
    Arg1 string `json:"arg1"`
}

type ListItem {
    Value1 string `json:"value1"`
}

type LoginReq {
    Username string `json:"username"`
    Password string `json:"password"`
}

type LoginResp {
    Name string `json:"name"`
}

type FormExampleReq {
    Name string `form:"name"`
}

type PathExampleReq {
    // path 标签修饰的 id 必须与请求路由中的片段对应，如
    // id 在 service 语法块的请求路径上一定会有 :id 对应，见下文。
    ID string `path:"id"`
}

type PathExampleResp {
    Name string `json:"name"`
}

@server (
    jwt:        Auth // 对当前 Foo 语法块下的所有路由，开启 jwt 认证，不需要则请删除此行
    prefix:     /v1 // 对当前 Foo 语法块下的所有路由，新增 /v1 路由前缀，不需要则请删除此行
    group:      g1 // 对当前 Foo 语法块下的所有路由，路由归并到 g1 目录下，不需要则请删除此行
    timeout:    3s // 对当前 Foo 语法块下的所有路由进行超时配置，不需要则请删除此行
    middleware: AuthInterceptor // 对当前 Foo 语法块下的所有路由添加中间件，不需要则请删除此行
    maxBytes:   1024 // 对当前 Foo 语法块下的所有路由添加请求体大小控制，单位为 byte,goctl 版本 >= 1.5.0 才支持
)
service Foo {
    // 定义没有请求体和响应体的接口，如 ping
    @handler ping
    get /ping

    // 定义只有请求体的接口，如更新信息
    @handler update
    post /update (UpdateReq)

    // 定义只有响应体的结构，如获取全部信息列表
    @handler list
    get /list returns ([]ListItem)

    // 定义有结构体和响应体的接口，如登录
    @handler login
    post /login (LoginReq) returns (LoginResp)

    // 定义表单请求
    @handler formExample
    post /form/example (FormExampleReq)

    // 定义 path 参数
    @handler pathExample
    get /path/example/:id (PathExampleReq) returns (PathExampleResp)
}


```
