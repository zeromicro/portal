---
title: API Import
slug: /docs/tutorials/api/import
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

在 go-zero 中，我们通过 api 语言来声明 HTTP 服务，然后通过 goctl 生成 HTTP 服务代码，在之前我们系统性的介绍了 <a href="/docs/tutorials" target="_blank">API 规范</a>。

在 HTTP 服务开发中，我们都是通过 api 描述语言来描述 HTTP 服务，随着业务量的增加，api 文件可能会越来越大，又或者我们有一些公共结构体，如果我们都写在同一个 api 文件中，那么 api文件将变成非常巨大，不易阅读和维护，我们可以通过 api import 来引入其他 api 文件解决这类问题。

## api 文件引入

假设我们 HTTP 服务的响应格式统一为如下 json 格式：

```json
{
"code": 0,
"msg": "success",
"data": {}
}
```

通过如上 json 可以看出，我们的响应格式中有 `code`、`msg`、`data` 三个字段，其中 `code` 和 `msg` 是固定的，data 是可变的，我们可以将其中2个字段 `code`，`msg` 抽象出来，定义为一个公共的结构体，然后在其他 api 文件中引入这个结构体。

示例，假设我们有一个用户服务来查询用户信息和修改用户信息，我们可以将 `code` 和 `msg` 抽象在 base.api 中，然后 user.api 中复用和定义具体的响应结构体即可。

<Tabs>

<TabItem value="base.api" label="base.api" default>

```go
syntax =  "v1"

type Base {
    Code int    `json:"code"`
    Msg  string `json:"msg"`
}
```

</TabItem>

<TabItem value="user.api" label="user.api" default>

```go
syntax =  "v1"

// 引入 base.api 文件
import "base.api"

type UserInfoReq {
    Id int64 `path:"id"`
}

type UserInfo {
    Id int64    `path:"id"`
    Name string `json:"name"`
    Age int     `json:"age"`
}

type UserInfoResp {
    Base // Base 为 base.api 中的公共结构体，在 api 描述语言中，没有 package 的概念
    Data UserInfo `json:"data"`
}

type UserInfoUpdateReq {
    Id int64 `json:"id"`
    UserInfo
}

type UserInfoUpdateResp {
    Base
}

service user {
    @handler userInfo
    get /user/info/:id (UserInfoReq) returns (UserInfoResp)

    @handler userInfoUpdate
    post /user/info/update (UserInfoUpdateReq) returns (UserInfoUpdateResp)
}
```

</TabItem>

</Tabs>

:::note 温馨提示
在 api 描述语言中，没有 package 的概念，所以在引入其他 api 文件时，需要使用相对路径，如上面示例中的 `import "base.api"`，如果是在同一个目录下，亦可以使用 `import "./base.api"`。 import 支持相对路径和绝对路径。

在 api 描述语言中，我们规定将所有 service 语法块声明的 HTTP 服务信息都放在 main api文件中，抽象结构体放在其他 api 文件中，然后在 main api 文件中引入其他 api 文件，这样可以让 main api 文件更加简洁，易于维护，而被引入的 api 文件中不允许出现 service 语法块，否则会报错。

特别注意：api 引入不支持循环引入！！！
