---
title: api syntax
slug: /docs/tasks/dsl/api
---

## Overview

api is the domain characteristic language of go-zero (below is api language or api description), which is intended to humanize as the most basic description language for generating HTTP services.

The api field feature language contains syntax versions, info blocks, structural statements, service descriptions, etc., where the structure is almost the same as the Golang structural syntax, but only the `structure` keywords.

## Getting started

This is a quick introduction to api file writing only in demo form. More detailed examples can be found in <a href="/docs/reference" target="_blank">Full Example of API Definitions</a>, detailed api syntax norms can be referenced <a href="/docs/tutorials" target="_blank">API norms</a>.

### Example 1. Write the easiest ping routing service

```go
syntax = "v1"

// Defines HTTP service
service foo {
    get /ping
}
```

### Example 2. Write a login interface api file

```go
syntax = "v1"

type (
    // Define the request body of the login interface
    LoginReq {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    // Define the response body of the login interface
    LoginResp {
        Id       int64  `json:"id"`
        Name     string `json:"name"`
        Token    string `json:"token"`
        ExpireAt string `json:"expireAt"`
    }
)

// Define an HTTP service
// The name of the microservice is user, and the generated code directory and configuration file will be related to the value of user
service user {
    // Define the name and method of the go file converted by http.HandleFunc
    @handler Login
    // define interface
    // The request method is post
    // route to /user/login
    // The request body is LoginReq
    // The response body is LoginResp, and the response body must be modified with the returns keyword
    post /user/login (LoginReq) returns (LoginResp)
}


```

### Example 3. Write a simple user service api file

```go
syntax = "v1"

type (
    // Define the json request body of the login interface
    LoginReq {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    // Define the json response body of the login interface
    LoginResp {
        Id       int64  `json:"id"`
        Name     string `json:"name"`
        Token    string `json:"token"`
        ExpireAt string `json:"expireAt"`
    }
)

type (
    // Define the json request body for obtaining user information
    GetUserInfoReq {
        Id int64 `json:"id"`
    }
    // Define the json response body for getting user information
    GetUserInfoResp {
        Id   int64  `json:"id"`
        Name string `json:"name"`
        Desc string `json:"desc"`
    }
    // Define the json request body for updating user information
    UpdateUserInfoReq {
        Id   int64  `json:"id"`
        Name string `json:"name"`
        Desc string `json:"desc"`
    }
)

// define HTTP service
// The @server syntax block is mainly used to control the meta information when generating HTTP services. Currently, the supported functions are:
// 1. Route grouping
// 2. Middleware declaration
// 3. Route prefix
// 4. Timeout configuration
// 5. jwt authentication switch
// All declarations are only valid for routes in the current service
@server (
    // Represents the routes under the current service code block will be placed in the login directory when generating code
    group: login
    // Define route prefix as "/v1"
    prefix: /v1
)
// The name of the microservice is user, and the generated code directory and configuration file will be related to the value of user
service user {
    // Define the name and method of the go file converted by http.HandleFunc, each interface will be followed by a handler
    @handler login
    // define the interface
    // The request method is post
    // route to /user/login
    // The request body is LoginReq
    // The response body is LoginResp, and the response body must be modified with the returns keyword
    post /user/login (LoginReq) returns (LoginResp)
}

// The @server syntax block is mainly used to control the meta information when generating HTTP services. Currently, the supported functions are:
// 1. Route grouping
// 2. Middleware declaration
// 3. Route prefix
// 4. Timeout configuration
// 5. jwt authentication switch
// All declarations are only valid for routes in the current service
@server (
    // Represents that all routes under the current service code block require jwt authentication
    // When goctl generates code, the interface under the current service code block will be
    // Add jwt related codes to the information, the Auth value is the jwt key, expired
    // The name of the golang structure configured with other information
    jwt: Auth
    // Represents the routes under the current service code block will be placed in the user directory when generating code
    group: user
    // Define route prefix as "/v1"
    prefix: /v1
)
// Note that when defining multiple service code blocks, the service names must be consistent, so the service names here must
// Same as the service name above, serving user.
service user {
    // Define the name and method of the go file converted by http.HandleFunc, each interface will be followed by a handler
    @handler getUserInfo
    // define the interface
    // The request method is post
    // route to /user/info
    // The request body is GetUserInfoReq
    // The response body is GetUserInfoResp, the response body must be decorated with the returns keyword
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)

    // Define the name and method of the go file converted by http.HandleFunc, each interface will be followed by a handler
    @handler updateUserInfo
    // define the interface
    // The request method is post
    // route to /user/info/update
    // The request body is UpdateUserInfoReq
    // Since the response body is not required, it can be ignored
    post /user/info/update (UpdateUserInfoReq)
}


```

### Example 4. Write api services with intermediate

```go
syntax = "v1"

type GetUserInfoReq {
    Id int64 `json:"id"`
}

type GetUserInfoResp {
    Id   int64  `json:"id"`
    Name string `json:"name"`
    Desc string `json:"desc"`
}

// The @server syntax block is mainly used to control the meta information when generating HTTP services. Currently, the supported functions are:
// 1. Route grouping
// 2. Middleware declaration
// 3. Route prefix
// 4. Timeout configuration
// 5. jwt authentication switch
// All declarations are only valid for routes in the current service
@server (
    // Define a middleware for authentication control. Multiple middleware are separated by English commas, such as Middleware1, Middleware2, and middleware are executed in the order of declaration
    middleware: AuthInterceptor
)
// Define a service named user
service user {
    // Define the name and method of the go file converted by http.HandleFunc, each interface will be followed by a handler
    @handler getUserInfo
    // define the interface
    // The request method is post
    // route to /user/info
    // The request body is GetUserInfoReq
    // The response body is GetUserInfoResp, the response body must be decorated with the returns keyword
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)
}

```

### Example 5. Write api services with timeout configuration

```go
syntax = "v1"

type GetUserInfoReq {
    Id int64 `json:"id"`
}

type GetUserInfoResp {
    Id   int64  `json:"id"`
    Name string `json:"name"`
    Desc string `json:"desc"`
}

// The @server syntax block is mainly used to control the meta information when generating HTTP services. Currently, the supported functions are:
// 1. Route grouping
// 2. Middleware declaration
// 3. Route prefix
// 4. Timeout configuration
// 5. jwt authentication switch
// All declarations are only valid for routes in the current service
@server (
    // Define a timeout configuration with a timeout duration of 3 seconds, which can be filled in as a string form of time.Duration here, for details, please refer to
    // https://pkg.go.dev/time#Duration.String
    timeout: 3s
)
// Define a service named user
service user {
    // Define the name and method of the go file converted by http.HandleFunc, each interface will be followed by a handler
    @handler getUserInfo
    // define the interface
    // The request method is post
    // route to /user/info
    // The request body is GetUserInfoReq
    // The response body is GetUserInfoResp, the response body must be decorated with the returns keyword
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)
}


```

### Example 6. Structure Reference

```go
syntax = "v1"

type Base {
    Code int    `json:"code"`
    Msg  string `json:"msg"`
}

type UserInfo {
    Id   int64  `json:"id"`
    Name string `json:"name"`
    Desc string `json:"desc"`
}

type GetUserInfoReq {
    Id int64 `json:"id"`
}

type GetUserInfoResp {
    // api supports nesting of anonymous structures, and also supports structure references
    Base
    Data UserInfo `json:"data"`
}

// Define a service named user
service user {
    // Define the name and method of the go file converted by http.HandleFunc, each interface will be followed by a handler
    @handler getUserInfo
    // define the interface
    // The request method is post
    // route to /user/info
    // The request body is GetUserInfoReq
    // The response body is GetUserInfoResp, the response body must be decorated with the returns keyword
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)
}

```

### Example 7. Control api service for max request body control

```go
syntax = "v1"

type GetUserInfoReq {
    Id int64 `json:"id"`
}

type GetUserInfoResp {
    Id   int64  `json:"id"`
    Name string `json:"name"`
    Desc string `json:"desc"`
}

// The @server syntax block is mainly used to control the meta information when generating HTTP services. Currently, the supported functions are:
// 1. Route grouping
// 2. Middleware declaration
// 3. Route prefix
// 4. Timeout configuration
// 5. jwt authentication switch
// All declarations are only valid for routes in the current service
@server (
    // Define a request with a request body limited to 1MB, supported by goctl >= 1.5.0
    maxBytes: 1048576
)
// Define a service named user
service user {
    // Define the name and method of the go file converted by http.HandleFunc, each interface will be followed by a handler
    @handler getUserInfo
    // define the interface
    // The request method is post
    // route to /user/info
    // The request body is GetUserInfoReq
    // The response body is GetUserInfoResp, the response body must be decorated with the returns keyword
    post /user/info (GetUserInfoReq) returns (GetUserInfoResp)
}
```

## References

- <a href="/docs/reference" target="_blank">Full Example of API Defining</a>
- <a href="/docs/tutorials" target="_blank">API Norms</a>
