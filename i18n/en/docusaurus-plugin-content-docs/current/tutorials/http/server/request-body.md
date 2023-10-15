---
title: Request Parameters
slug: /docs/tutorials/http/server/request-body
---

## Overview

In go-zero，it can get request parameters from `http.Request`，which is the smae way to get `Form` from `http.Request`， where `Body` only accepts request parameters in `application/json` format, and `Form` only accepts request parameters in `application/x-www-form-urlencoded` format. In addition to that, go-zero also supports path parameters and request header parameters fetching, both of which are parsed into structures via the `httpx.Parse` method.

## Parameter Usage

### Form request parameters

For form request parameters, go-nero supports defining the name of the parameter by `form` tag, which supports Content-Type for `application/x-www-form-urlencoded` , Query arguments that support the Get method, written to add `form` keywords to the tag of the architecture, The writing in tag is a k-v structure, key is a fixed value `form`, value is a key value for query.

```go
type Request struct {
    Name    string  `form:"name"` // required
    Age     int     `form:"age,optional"` // optional
}


var req Request
err := httpx.Parse(r, &req) 
```

### Json Request Parameters

对于 Json 参数请求，其接受来自 Post 请求方法 Content-Type 为 `application/json` 的请求参数，其写法是在结构体的 tag 中加上 `json` 关键字， 在 tag 中写法是一个 k-v 结构，key 是固定值 `json`，value 是对应 json 的 key 值。

```go
type Request struct {
    Name string `json:"name"`
    Age  int    `json:"age"`
}

var req Request
err := httpx.Parse(r, &req)
```

### Path Request Parameters

For the Path parameter request, it supports the definition of parameters on the path by adding `path` keywords to the tag of the architecture, used to get a particular path parameter, a k-v format, key is a fixed value `path`, value is a path argument.

```go
type Request struct {
    Name string `path:"name"`
}

// Path definitions
rest.Route{
    Method:  http.MethodGet,
    Path:    "/user/:name",
    Handler: handle,
}

var req Request
err := httpx.Parse(r, &req) 
```

### Header parameters get

Header parameter gets, written to add `header` keywords to the tag of the architecture, which is a k-v format, key is a fixed value `header`, value is the key value of the request header.

```go
type Request struct {
    Authorization string `header:"authorization"`
}

var req Request
err := httpx.Parse(r, &req)
```

## Parameter Validation

### Parameter optional

In go-zero, the parameter is optional via `optional` keywords in a structural tag. If the parameter is not required you can add `optional` keywords after the parameter otherwise it is considered required

```go
type Request struct {
    Age int `form:"age, optional"`
}

var req Request
err := httpx.Parse(r, &req) 
```

:::tip

For required parameters, if no pass is made, the following error will be returned.

```
field age is not set
```

:::

### Parameter range definition

go-zero provides the definition of parameter intervals, which can be defined with the `range` keyword，It is written by adding the `range` keyword to the tag of the structure，It is written in the format `range=$range_expression`.

```go
type Request struct {
    Age int `form:"age,range=[18:35)"`
}

var req Request
err := httpx.Parse(r, &req) 
```

See api syntax for more details on parameter intervals <a href="/docs/tutorials/api/parameter" target="_blank">parameter rules</a>

### Parameter enumeration value

go-Zero provides a definition of parameter enumeration values, which can be defined by `options` keywords by adding `options to a structure's tag` keyword in the format `options=$option_expression`.The enumeration is divided by comma in English, e.g. `options=18,19`meaning that only 18 and 19 values are accepted, but also illegal.

```go
type Request struct {
    Age int `form:"age,options=18|19"`
}

var req Request
err := httpx.Parse(r, &req)
```

### Default value for parameters

go-zero provides a default value for the parameters. The default value of the parameter can be defined by `default` keyword by adding `default` keyword to a structural tag in the format `default=$default_value`whose function is an extension of optional parameters, optional parameter default value is zero.

```go
type Request struct {
    Age int `form:"age,default=18"`
}

var req Request
err := httpx.Parse(r, &req) 
```

## References

- <a href="/docs/tutorials/api/parameter" target="_blank">Api | HTTP Request Parameter Rules</a>
