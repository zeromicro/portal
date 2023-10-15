---
title: 请求参数
slug: /docs/tutorials/http/server/request-body
---

## 概述

在 go-zero 中，支持通过 `http.Request` 的 `Body` 字段获取请求参数，同时支持通过 `http.Request` 的 `Form` 字段获取请求参数，
其中 `Body` 只接受 `application/json` 格式的请求参数，`Form` 只接受 `application/x-www-form-urlencoded` 格式的请求参数，
除此之外，go-zero 还支持 path 参数和请求头参数的获取，他们都是通过 `httpx.Parse` 方法将数据解析到结构体中。

## 参数用法

### Form 表单请求参数

对于表单请求参数，go-zero 支持通过 `form` tag 来定义参数的名称，其支持 Content-Type 为 `application/x-www-form-urlencoded` 的请求参数，也支持
Get 方法的 query 参数，其写法是在结构体的 tag 中加上 `form` 关键字，在 tag 中的写法是一个 k-v 结构，key 是固定值 `form`，value 是对应 query 的 key 值。

```go
type Request struct {
    Name    string  `form:"name"` // 必填参数
    Age     int     `form:"age,optional"` // optional定义非必填参数
}


var req Request
err := httpx.Parse(r, &req) // 解析参数
```

### Json 请求参数

对于 Json 参数请求，其接受来自 Post 请求方法 Content-Type 为 `application/json` 的请求参数，其写法是在结构体的 tag 中加上 `json` 关键字，
在 tag 中写法是一个 k-v 结构，key 是固定值 `json`，value 是对应 json 的 key 值。

```go
type Request struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

var req Request
err := httpx.Parse(r, &req) // 解析参数
```

### Path 请求参数

对于 Path 参数请求，其支持在路径上定义参数，其写法是在结构体的 tag 中加上 `path` 关键字，用于获取特定的路径参数，其是一个 k-v格式，
key 为固定值 `path`，value 为路径参数的变量。

```go
type Request struct {
    Name string `path:"name"`
}

// Path定义
rest.Route{
    Method:  http.MethodGet,
    Path:    "/user/:name",
    Handler: handle,
}

var req Request
err := httpx.Parse(r, &req) // 解析参数
```

### Header 参数获取

header 参数获取，其写法是在结构体的 tag 中加上 `header` 关键字，用于获取特定的请求头的值，其是一个 k-v格式，
key 为固定值 `header`，value 为请求头的 key 值。

```go
type Request struct {
 Authorization string `header:"authorization"`
}

var req Request
err := httpx.Parse(r, &req) // 解析参数
```

## 参数校验

### 参数可选

在 go-zero 中，参数可选是通过在结构体的tag 中通过 `optional` 关键字来实现的，如果参数不是必填的，可以在参数后面加上 `optional` 关键字，否则就认为是必填参数

```go
type Request struct {
    Age int `form:"age, optional"`
}

var req Request
err := httpx.Parse(r, &req) // 解析参数
```

:::tip

对于必填参数，如果没有传递参数，会返回如下类似错误。

```
field age is not set
```

:::

### 参数区间定义

go-zero 提供了参数区间的定义，可以通过 `range` 关键字来定义参数的区间，其写法是在结构体的 tag 中加上 `range` 关键字，其写法格式为 `range=$range_expression`。

```go
type Request struct {
    Age int `form:"age,range=[18:35)"`
}

var req Request
err := httpx.Parse(r, &req) // 解析参数
```

关于参数区间的详细说明请参考 api 语法 <a href="/docs/tutorials/api/parameter" target="_blank">参数规则</a>

### 参数枚举值

go-zero 提供了参数枚举值的定义，可以通过 `options` 关键字来定义参数的枚举值，其写法是在结构体的 tag 中加上 `options` 关键字，其写法格式为 `options=$option_expression`。枚举值以英文逗号分割，例如 `options=18|19`，其含义表示为仅接受 18 和 19 两个值，除此外都是非法值。

```go
type Request struct {
    Age int `form:"age,options=18|19"`
}

var req Request
err := httpx.Parse(r, &req) // 解析参数
```

### 参数默认值

go-zero 提供了参数默认值的定义，可以通过 `default` 关键字来定义参数的默认值，其写法是在结构体的 tag 中加上 `default` 关键字，其写法格式为 `default=$default_value`，其功能是可选参数的扩充，可选参数默认值为零值。

```go
type Request struct {
    Age int `form:"age,default=18"`
}

var req Request
err := httpx.Parse(r, &req) // 解析参数
```

## 参考文献

- <a href="/docs/tutorials/api/parameter" target="_blank">《api | HTTP 请求参数规则》</a>
