---
title: goctl quickstart
sidebar_label: goctl quickstart
slug: /docs/tutorials/cli/quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

goctl quickstart is used to quickly generate api, rpc services and start up and can help first go-zero developers quickly get to get started. Once demo starts and accesses, developers can read a simple source directory of services, go-zero engineering structure to get an overview of go-zero.

## goctl quickstart directive

```bash
$ goctl quickstart --help
quickly start a project

Usage:
  goctl quickstart [flags]

Flags:
  -h, --help                  help for quickstart
  -t, --service-type string   specify the service type, supported values: [mono, micro] (default "mono")
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description        |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| service-type                                         | string                                              | NO                                             | mono                                               | Generate demo service type, mono：mono service, micro：microservice |


## Examples

<Tabs>

<TabItem value="生成单体服务" label="生成单体服务" default>

If the `mono` type is selected, goctl generates a minimized HTTP service and starts the HTTP service.

1. Generate code
```bash
# enter user home
$ cd ~

# mkdir
$ mkdir quickstart && cd quickstart

# generate mono service
$ goctl quickstart --service-type mono
go: creating new go.mod: module greet
>> Generating quickstart api project...
Done.
>> go mod tidy
go: finding module for package github.com/zeromicro/go-zero/core/logx
go: finding module for package github.com/zeromicro/go-zero/rest
go: finding module for package github.com/zeromicro/go-zero/rest/httpx
go: finding module for package github.com/zeromicro/go-zero/core/conf
go: found github.com/zeromicro/go-zero/core/conf in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/rest in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/rest/httpx in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/core/logx in github.com/zeromicro/go-zero v1.4.3
>> Ready to start an API server...
>> Run 'curl http://127.0.0.1:8888/ping' after service startup...
Starting server at 127.0.0.1:8888...
```

2. curl

open a new terminal, execute curl test

```bash
$ curl -i http://127.0.0.1:8888/ping
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Traceparent: 00-2102678b8c7c5906b792c618b054c9a1-60194e95cceff37f-00
Date: Fri, 06 Jan 2023 08:52:30 GMT
Content-Length: 14

{"msg":"pong"}%
```

</TabItem>

<TabItem value="生成微服务" label="生成微服务" default>

If the `micro` type is selected, goctl generates a gRPC service and a HTTP service, then starts gRPC service to communicate with the HTTP service.

1. Generate service

```bash
# enter user home
$ cd ~

# mkdir
$ mkdir quickstart && cd quickstart

# generate micro service
$ goctl quickstart --service-type micro
Detected that the "/Users/keson/quickstart/greet" already exists, do you clean up? [y: YES, n: NO]: y
Clean workspace...
go: creating new go.mod: module greet
>> Generating quickstart zRPC project...
[goctl-env]: preparing to check env

[goctl-env]: looking up "protoc"
[goctl-env]: "protoc" is installed

[goctl-env]: looking up "protoc-gen-go"
[goctl-env]: "protoc-gen-go" is installed

[goctl-env]: looking up "protoc-gen-go-grpc"
[goctl-env]: "protoc-gen-go-grpc" is installed

[goctl-env]: congratulations! your goctl environment is ready!
[command]: protoc greet.proto --go_out . --go-grpc_out .
Done.
>> Generating quickstart api project...
Done.
>> go mod tidy
go: finding module for package github.com/zeromicro/go-zero/core/conf
go: finding module for package github.com/zeromicro/go-zero/core/logx
go: finding module for package github.com/zeromicro/go-zero/core/service
go: finding module for package google.golang.org/grpc/reflection
go: finding module for package github.com/zeromicro/go-zero/zrpc
go: finding module for package github.com/zeromicro/go-zero/rest
go: finding module for package github.com/zeromicro/go-zero/rest/httpx
go: finding module for package google.golang.org/grpc
go: finding module for package google.golang.org/grpc/codes
go: finding module for package google.golang.org/grpc/status
go: finding module for package google.golang.org/protobuf/reflect/protoreflect
go: finding module for package google.golang.org/protobuf/runtime/protoimpl
go: found github.com/zeromicro/go-zero/core/conf in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/rest in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/rest/httpx in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/core/logx in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/zrpc in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/core/service in github.com/zeromicro/go-zero v1.4.3
go: found google.golang.org/grpc in google.golang.org/grpc v1.51.0
go: found google.golang.org/grpc/reflection in google.golang.org/grpc v1.51.0
go: found google.golang.org/grpc/codes in google.golang.org/grpc v1.51.0
go: found google.golang.org/grpc/status in google.golang.org/grpc v1.51.0
go: found google.golang.org/protobuf/reflect/protoreflect in google.golang.org/protobuf v1.28.1
go: found google.golang.org/protobuf/runtime/protoimpl in google.golang.org/protobuf v1.28.1
>> Ready to start a zRPC server...
>> Ready to start an API server...
>> Run 'curl http://127.0.0.1:8888/ping' after service startup...
Starting rpc server at 127.0.0.1:8080...
Starting server at 127.0.0.1:8888...
```

2. curl

Open a new terminal and execute curl test

```bash
$ curl -i http://127.0.0.1:8888/ping
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Traceparent: 00-b7c7bd5b28a49ab97960ed83d2888f1a-4da22e03825041e7-00
Date: Fri, 06 Jan 2023 08:55:33 GMT
Content-Length: 14

{"msg":"pong"}
```

</TabItem>

</Tabs>