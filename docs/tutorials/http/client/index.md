---
title: Client
sidebar_label: Client
slug: /docs/tutorials/http/client/index
---

## 概述

HTTP Client 是一个用于发送 HTTP 请求的库，它支持如下功能：

1. Content-Type 自动识别，仅支持 `application/json` 和 `application/x-www-form-urlencoded` 两种格式
2. 支持将 path 参数自动填充到 url
3. 支持将结构体中 header 填充到 http 请求头

## 请求示例

### GET、POST Form 请求

Get 和 Post form 请求的使用方式是一样的，只需要将结构体中的字段标记为 `form` 即可。

```go
type Request struct {
    Node   string `path:"node"`
    ID     int    `form:"id"`
    Header string `header:"X-Header"`
}

var domain = flag.String("domain", "http://localhost:3333", "the domain to request")

func main() {
    flag.Parse()

    req := types.Request{
        Node:   "foo",
        ID:     1024,
        Header: "foo-header",
    }
    resp, err := httpc.Do(context.Background(), http.MethodGet, *domain+"/nodes/:node", req)
    // resp, err := httpc.Do(context.Background(), http.MethodPost, *domain+"/nodes/:node", req)
    if err != nil {
        fmt.Println(err)
        return
    }

    io.Copy(os.Stdout, resp.Body)
}
```

以上内等同于如下 curl:

```bash
# get
curl --location 'http://localhost:3333/nodes/foo?id=1024' \
--header 'X-Header: foo-header'

# post
curl --location 'http://localhost:3333/nodes/foo' \
--header 'X-Header: foo-header' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'id=1024'
```

### POST Json 请求

Post Json 请求的使用方式是一样的，只需要将结构体中的字段标记为 `json` 即可。

```go
type Request struct {
    Node   string `path:"node"`
    Body   map[string]string `json:"body"` // json 请求体，这里以 string 为例，你可以使用任意类型
    Header string `header:"X-Header"`
}

var domain = flag.String("domain", "http://localhost:3333", "the domain to request")

func main() {
    flag.Parse()

    req := types.Request{
        Node:   "foo",
        Header: "foo-header",
        Body:   map[string]string{
            "foo":"foo",
            "bar":"bar",
        },
    }
    resp, err := httpc.Do(context.Background(), http.MethodPost, *domain+"/nodes/:node", req)
    if err != nil {
        fmt.Println(err)
        return
    }

    io.Copy(os.Stdout, resp.Body)
}
```

以上请求等同于如下 curl：

```bash
curl --location 'http://localhost:3333/nodes/foo' \
--header 'X-Header: foo-header' \
--header 'Content-Type: application/json' \
--data '{
    "foo":"foo",
    "bar":"bar"
}'
```

:::tip 温馨提示
httpc 默认使用的是 http.DefaultClient，这个不能指定
:::
