---
title: gRPC demo code generation
slug: /docs/tasks/cli/grpc-demo
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

After completing the <a href="/docs/tasks/installation/goctl" target="_blank">goctl installation</a>, we can create a minimal gRPC service to get an overview of goctl's go-zero gRPC service.

## Task Targets

1. Learn how to create a minimized gRPC service using goctl
1. Preliminary understanding of the project structure of go-zero
1. Preliminary method of gRPC local debugging

## Preparing

1. <a href="/docs/tasks" target="_blank">Complete golang installation</a>
1. <a href="/docs/tasks/installation/goctl" target="_blank">Complete goctl installation</a>

## Code Generation

```shell
# Create workspaces and enter the directory
$ mkdir -p ~/workspace/rpc && cd ~/workspace/rpc
# Execute instructions generated demo service
$ goctl rpc new demo
Done.
```

After executing the instruction, a demo directory will be generated under the current directory that contains a minimized gRPC service. We will check the directory structure of the service.

```shell
# Enter the demo service directory
$ cd ~/workspace/rpc/demo
# view file list
$ ls
demo       demo.go    demo.proto democlient etc        go.mod     internal
# View directory interface
$ tree
.
├── demo
│   ├── demo.pb.go
│   └── demo_grpc.pb.go
├── demo.go
├── demo.proto
├── democlient
│   └── demo.go
├── etc
│   └── demo.yaml
├── go.mod
└── internal
    ├── config
    │   └── config.go
    ├── logic
    │   └── pinglogic.go
    ├── server
    │   └── demoserver.go
    └── svc
        └── servicecontext.go
```

:::note
API, RPC, Job Directory structure is similar to what the go-zero project structure can look at <a href="/docs/concepts/layout">Project Structure</a>
:::

## Write simple logic code

After completing the above code generation, we can find `~/workspace/api/demo/internal/logic/demologic.go` files, replace codes at line `29` as follows  :

```go
return &demo.Response{
    Pong:"pong",
}, nil
```

Then set your profile `~/workspace/rpc/depo/etc/demo.yaml`remove `3` to `7 to` lines of content, then add-on `Mode: dev` to end, making configuration file content：

```yaml
Name: demo.rpc
ListenOn: 0.0.0.0:8080
Mode: dev

```

:::Note
goctl generates minimized gRPC service by registering information about the current service from ETCD Register, so registration is not required for this demonstration, so the registration center configuration in the configuration file has been deleted.
:::

## Start service

After writing the above code, we can start the service with the following instructions：

```shell
# Enter service directory
$ cd ~/workspace/rpc/demo
# Organize dependencies
$ go mod tidy
# Run go program
$ go go run demo.go
```

When you see the following output `Starting rpc server at 0.0.0.0:8080...`indicates that the service has been successfully started, then we come to visit the gRPC service.

<Tabs>
<TabItem value="grpcurl" label="grpcurl 访问" default>

```bash
$ grpcurl -plaintext 127.0.0.1:8080 demo.Demo/Ping
``

on behalf of your service has been successfully launched when you see the following output in the terminal.

```json
{
  "pong": "pong"
}
```

:::note NOTE
grpcurl is a command-line tool for accessing gRPC services, for details, please refer to <a href="https://github.com/fullstorydev/grpcurl">《grpcurl》</a>
:::

</TabItem>

<TabItem value="grpcui" label="grpcui 访问" default>

Start the grpcui service at the terminal：

```bash
$ grpcui -plaintext 127.0.0.1:8080
````

 then visit the `Ping` interface in the browser. The service on behalf of you has started successfully when you see the following output.

 ```json
 {
  "pong": "pong"
}
 ```

 ![postman](../../resource/tasks/cli/task-grpc-demo-grpcui.png)

<center> Access in grpcui </center>

:::note
grpcui is a gRPC UI debugging tool to access gRPC services. See <a href="https://github.com/fullstorydev/grpcui">Grpcui</a>
:::

</TabItem>

<TabItem value="postman" label="Postman 中访问" default>

![postman](../../resource/tasks/cli/task-grpc-demo-postman.png)

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
