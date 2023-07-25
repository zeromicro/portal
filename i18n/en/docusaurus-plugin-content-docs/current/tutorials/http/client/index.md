---
title: Client
sidebar_label: Client
slug: /docs/tutorials/http/client/index
---

## Overview

HTTP Client is a library to send HTTP requests, which supports the following functions：

1. Content-Type auto-recognition, only supported `application/json` and `application/x-www-form-urlencoded`
2. Support auto fill path arguments to url
3. Support to fill header in structure to the HTML request header

## Request Example

### GET, POST Form Requests

Get and Post form requests are used in the same way. Only fields in the structure need to be marked as `form`

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

The above is equivalent to the following curl:

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

### POST Json request

Post Json requests are used in the same way. Just label the fields in the structure as `json`.

```go
type Request struct {
    Node   string `path:"node"`
    Foo    string `json:"foo"`
    Bar    string `json:"bar"`
    Header string `header:"X-Header"`
}

var domain = flag.String("domain", "http://localhost:3333", "the domain to request")

func main() {
    flag.Parse()

    req := types.Request{
        Node:   "foo",
        Header: "foo-header",
        Foo:    "foo",
        Bar:    "bar",
    }
    resp, err := httpc.Do(context.Background(), http.MethodPost, *domain+"/nodes/:node", req)
    if err != nil {
        fmt.Println(err)
        return
    }

    io.Copy(os.Stdout, resp.Body)
}
```

The above request is equivalent to the following curl：

```bash
curl --location 'http://localhost:3333/nodes/foo' \
--header 'X-Header: foo-header' \
--header 'Content-Type: application/json' \
--data '{
    "foo":"foo",
    "bar":"bar"
}'
```

:::tip hint
httpc is used by http.DefaultClient, this cannot be specified
:::
