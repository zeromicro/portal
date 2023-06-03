---
title: API Import
slug: /docs/tutorials/api/import
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

In go-zero, we declared HTTP service via api language, and then generated HTTP service code via goctl, after our systematic introduction to <a href="/docs/tutorials" target="_blank">API norm</a>.

In HTTP service development, we all describe HTTP services through api description. As business volume increases, api files may grow larger, or we have some public structures. If we all write in the same api file, api files will become very large and not easy to read and maintain, we can use api import to solve these problems by introducing other api documents.

## api files import

Assume that the response format of our HTTP service is uniform for the following json format：

```json
{
"code": 0,
"msg": "success",
"data": {}
}
```

As shown by the above mentioned json, we have `code`,`msg`,`data` fields in our response format, Medium `code` and `msg` are fixed, ata is variable, we can use 2 of these fields `code`,`msg` abstraction, defined as a public structure and then introduce this structure in other api files.

Example: Assuming that we have a user service to query user information and modify user information, we can reuse `code` and `msg` abstract in base.api, then reuse and define specific response structures in user.api.

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

```go {4}
syntax = "v1"

// Import the base.api file
import "base.api"

type UserInfoReq {
    Id int64 `path:"id"`
}

type UserInfo {
    Id   int64  `path:"id"`
    Name string `json:"name"`
    Age  int    `json:"age"`
}

type UserInfoResp {
    Base // Base is the public structure in base.api, in the API description language, there is no concept of package
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

:::note tutorial
In api description, there is no package concept, so a relative path needs to be used when introducing other api files, such as `import "base.api" in the example above`and `import "./base.api" can be used if it is in the same directory`. Import supports relative and absolute paths.

In api description, we specify that all HTTP service statements are stored in main api, abstract structures are placed in other api files, and other api files are then introduced into main api files. This allows main api files to be simpler and easy to maintain, while service syntax blocks are not allowed in api files that will otherwise be misstated.

Warning：api import does not support circular import!！！
