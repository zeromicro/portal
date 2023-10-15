---
title: Hello World
slug: /docs/tasks/http/hello-world
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This section shows how to create a simple HTTP service using go-zero.

## Sample

<Tabs>

<TabItem value="etc/helloworld.yaml" label="etc/helloworld.yaml" default>

```yaml
Name: HelloWorld.api
Host: 127.0.0.1
Port: 8080
```

</TabItem>

<TabItem value="main.go" label="main.go" default>

```go
func main() {
    var restConf rest.RestConf
    conf.MustLoad("etc/helloworld.yaml", &restConf)
    s, err := rest.NewServer(restConf)
    if err != nil {
        log.Fatal(err)
        return
    }

    s.AddRoute(rest.Route{ // Add routes
        Method: http.MethodGet,
        Path:   "/hello/world",
        Handler: func(writer http.ResponseWriter, request *http.Request) { // HTTP Handler
            httpx.OkJson(writer, "Hello World!")
        },
    })

    defer s.Stop()
    s.Start() // Run service
}
```

</TabItem>

</Tabs>

rest service configuration accessible <a href="/docs/tutorials/http/server/configuration" target="_blank"> HTTP service configuration</a>

Can start a simple HTTP service in addition to using the above method

1. Quickly create a HTTP service with goctl: <a href="/docs/tutorials/cli/api#new" target="_blank"> goctl api new </a>
2. Quickly create and start a HTTP service with goctl, with reference <a href="/docs/tutorials/cli/quickstart" target="_blank"> goctl quickstart </a>

## References

- <a href="/docs/tutorials/cli/overview" target="_blank"> Overview of goctl directives </a>
- <a href="/docs/tutorials/http/server/configuration" target="_blank"> HTTP Service Configuration</a>
