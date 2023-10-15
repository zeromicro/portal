---
title: Route Rules
slug: /docs/tutorials/api/route/rule
---

## Overview

In go-zero, we declared HTTP service via api language, and then generated HTTP service code via goctl, after our systematic introduction to <a href="/docs/tutorials" target="_blank">API norm</a>.

In api description, there are specific routing rules that are not fully referenced to HTTP routing rules. Next, let's take a look at the routing rules in api description.

## Route Rules

In api description, routing needs to meet the following rules


1. Route must start with `/`
1. Route node must be separated by `/`
1. A router node can contain `:`but `:` must be the first character of a router node,`:` The next node value must have `path in the checkout body` tag statement, used to receive routing parameters, refer to detailed rules <a href="/docs/tutorials/api/parameter" target="_blank">routing parameters</a>.
1. Route nodes can contain letters, numbers (`goctl 1.5.1` , reference<a href="/docs/tutorials/api/faq#1-%E6%80%8E%E4%B9%88%E4%BD%93%E9%AA%8C%E6%96%B0%E7%9A%84-api-%E7%89%B9%E6%80%A7" target="_blank"> new API solver use</a>), underscore, dash

Route Example：

```go {29,33,37,41,45,49,53}
syntax = "v1"

type DemoPath3Req {
    Id int64 `path:"id"`
}

type DemoPath4Req {
    Id   int64  `path:"id"`
    Name string `path:"name"`
}

type DemoPath5Req {
    Id   int64  `path:"id"`
    Name string `path:"name"`
    Age  int    `path:"age"`
}

type DemoReq {}

type DemoResp {}

service Demo {
    // route example /foo
    @handler demoPath1
    get /foo (DemoReq) returns (DemoResp)

    // route example /foo/bar
    @handler demoPath2
    get /foo/bar (DemoReq) returns (DemoResp)

    // route example /foo/bar/:id，where id is a field in the request body
    @handler demoPath3
    get /foo/bar/:id (DemoPath3Req) returns (DemoResp)

    // route example /foo/bar/:id/:name，where id and name are fields in the request body
    @handler demoPath4
    get /foo/bar/:id/:name (DemoPath4Req) returns (DemoResp)

    // route example /foo/bar/:id/:name/:age，where id, name, age are the fields in the request body
    @handler demoPath5
    get /foo/bar/:id/:name/:age (DemoPath5Req) returns (DemoResp)

    // route example /foo/bar/baz-qux
    @handler demoPath6
    get /foo/bar/baz-qux (DemoReq) returns (DemoResp)

    // route example/foo/bar_baz/123(support version after goctl 1.5.1)
    @handler demoPath7
    get /foo/bar_baz/123 (DemoReq) returns (DemoResp)
}


```
