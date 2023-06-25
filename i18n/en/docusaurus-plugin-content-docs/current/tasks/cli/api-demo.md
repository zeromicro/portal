---
title: api demo code generation
slug: /docs/tasks/cli/api-demo
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

After completing the <a href="/docs/tasks/installation/goctl" target="_blank">goctl installation</a>, we can create a minimal HTTP service to get an overview of goctl's go-zero api service.

## Task Targets

1. Learn how to create a minimized HTTP service using goctl
1. Preliminary understanding of the project structure of go-zero


## Preparing

1. <a href="/docs/tasks" target="_blank">Complete golang installation</a>
1. <a href="/docs/tasks/installation/goctl" target="_blank">Complete goctl installation</a>

## Code Generation

```shell
# Create workspaces and enter the directory
$ mkdir -p ~/workspace/api && cd ~/workspace/api
# Execute instructions generated demo service
$ goctl api new demo
Done.
```
After executing the instruction, a demo directory will be generated under the current directory that contains a minimized HTTP service and we will check the directory structure of the service.

```shell
$ cd ~/workspace/api/demo
$ ls
demo.api demo.go  etc      go.mod   internal
$ tree
.
├── demo.api
├── demo.go
├── etc
│   └── demo-api.yaml
├── go.mod
└── internal
    ├── config
    │   └── config.go
    ├── handler
    │   ├── demohandler.go
    │   └── routes.go
    ├── logic
    │   └── demologic.go
    ├── svc
    │   └── servicecontext.go
    └── types
        └── types.go
```

:::note
API, RPC, Job Directory structure is similar to what the go-zero project structure can look at <a href="/docs/concepts/layout">Project Structure</a>
:::

## Write simple logic code

After completing the above code generation, we can find `~/workspace/api/demo/internal/logic/demologic.go` files, add codes between line `27` and `28`  :

```go
resp = new(types.Response)
resp.Message = req.Name
```

## Start service

After writing the above code, we can start the service with the following instructions：

```shell
# Enter service directory
$ cd ~/workspace/api/demo
# to organize dependencies
$ go mod tidy
# Run go program
$ go run demo.go
```

When you see the following output `Starting server at 0.0.0.0.0:888...`indicates that the service has been successfully started, then we come to visit the HTTP service.

<Tabs>
<TabItem value="terminal" label="终端中访问" default>

```bash
$ curl --request GET 'http://127.0.0.0.1:8888/from/me'
``````

When you see the output in the terminal `{"message":"me"}` on behalf of your service successfully started.

</TabItem>

<TabItem value="postman" label="Postman 中访问" default>

![postman](../../resource/tasks/cli/task-api-demo-postman.png)

<center> Access in Postman </center>

The service on your behalf has been successfully launched when you see the following output in Postman.

```json
{
    "message": "me"
}
```
</TabItem>
</Tabs>

When you come here following the steps in the document, congratulations, you have completed the creation and startup of the simplest go-zero api service. For instructions on using the `goctl` tool, please refer to <a href ="/docs/tutorials/cli/overview" target="_blank">"CLI Tools"</a>, for a complete description of the go-zero api service, please refer to <a href ="/docs/tutorials/http/server/configuration/service" target="_blank">《HTTP Server》</a>.
