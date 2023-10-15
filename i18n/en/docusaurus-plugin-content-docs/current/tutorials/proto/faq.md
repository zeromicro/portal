---
title: FAQ
slug: /docs/tutorials/proto/faq
---

## 1. proto use when goctl generates gRPC code

1. When using goctl to generate gRPC code, the requested body and response for all rpc methods must state message, i.e. not supported from outsourced external message, the following is **not supported** import sample：

```protobuf
syntax = "proto3";

package greet;

import "base.proto"

service demo{
  rpc (base.DemoReq) returns (base.DemoResp);
}
```

正确写法

```protobuf
syntax = "proto3";

package greet;

message DemoReq{}
message DemoResp{}

service demo{
  rpc (DemoReq) returns (DemoResp);
}
```

1. In cases where 1 is met, proto import only supports message introduction, and service import is not supported.

## Why does the use of packages proto and service when goctl is used to generate gRPC code?

For outsourced proto,goctl is not fully controlled, there are several issues goctl not resolving：

1. Outgoing proto if level is deep, or in other public warehouses, goctl is unable to determine whether the outpaced proto has generated pb.go
2. If the proto generated pb.go, with pb.go generated in which directory, whether it is in the same project, if out of the current project, pb.go works like go module etc. goctl is not known and therefore has no legal location to its true go package.
3. If the outsourced proto is not generated, since it is public proto, whether goctl needs to be generated for each introduction, nor is it possible to resolve

## 3. goctl generation gRPC does not support `google/protocol/empty.proto` package import

Answers, with 1,2
