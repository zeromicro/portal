---
title: 常见问题
slug: /docs/tutorials/proto/faq
---

## 1. goctl 生成 gRPC 代码时 proto 使用规范

1. 在使用 goctl 生成 gRPC 代码时，编写的所有 rpc 方法的请求体和响应体必须在主 proto 中声明 message，即不支持从外包外 message，以下是 **不支持** 的 import 示例：

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

1. 在满足 1 的情况，proto import 只支持 message 引入，不支持 service 引入。

## 2. 为什么使用 goctl 生成 gRPC 代码时 proto 不支持使用包外 proto 和 service?

对于包外的 proto，goctl 没法完全控制，有几个问题 goctl 没法解决：
1. 包外的 proto 如果层级很深，亦或在其他公共仓库中，goctl 没法确定包外 proto 是否已经生成了 pb.go
2. 如果包外的 proto 生成了 pb.go，那些 pb.go 生成在哪些目录下，是否在同一个工程中，如果在当前工程外，pb.go 所在工程是否使用了 go module 等等，goctl 没法得知，因此没法定位到其真正的 go package。
3. 如果包外的 proto 没有生成，既然其属于公共 proto，那么 goctl 是否需要针对每次引入都要生成，这个也无从解决

## 3. goctl 生成 gRPC 不支持 `google/protobuf/empty.proto` 包的 import
答案，同 1，2


