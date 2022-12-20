---
title: proto 语法
sidebar_label: proto 语法
slug: /docs/tasks/dsl/proto
---

## 概述

Protocol buffers 是 Google 的语言中立、平台中立、可扩展的结构化数据序列化机制——想想 XML，但更小、更快、更简单。您定义了一次数据的结构化方式，然后您可以使用特殊生成的源代码轻松地将结构化数据写入各种数据流并使用各种语言从中读取结构化数据。

:::note 注意
在 go-zero 框架开发中，我们使用 <a href="https://developers.google.com/protocol-buffers/docs/proto3" target="_blank">《Language Guide (proto3)》</a> 版本。
:::

## 快速入门

### 示例 1. 编写最简单的 rpc 服务

```jsx
// 声明 proto 语法版本，固定值
syntax = "proto3";

// proto 包名
package greet;

// 生成 golang 代码后的包名
option go_package = "example/proto/greet";

// 定义请求体
message SayHelloReq {}
// 定义响应体
message SayHelloResp {}

// 定义 Greet 服务
service Greet {
  // 定义一个 SayHello 一元 rpc 方法，请求体和响应体必填。
  rpc SayHello(SayHelloReq) returns (SayHelloResp);
}
```

### 示例 2. 编写流式请求服务示例

```jsx
// 声明 proto 语法版本，固定值
syntax = "proto3";

// proto 包名
package greet;

// 生成 golang 代码后的包名
option go_package = "example/proto/greet";

// 定义结构体
message SayHelloReq {}

message SayHelloResp {}

message SendMessageReq{
  string message = 1;
}
message SendMessageResp{
  int32 status = 1;
}

message GetMessageReq{
  int32 id = 1;
}
message GetMessageResp{
  string message = 1;
}

// 定义 Greet 服务
service Greet {
  // 定义客户端流式 rpc
  rpc SendMessage(stream SendMessageReq) returns (SendMessageResp);
  // 定义服务端流式 rpc
  rpc GetMessage(GetMessageReq) returns (stream GetMessageResp);
  // 定义双向流式 rpc
  rpc PushMessage(stream SendMessageReq) returns (stream GetMessageResp);
}
```

### 示例 3. 编写 rpc 分组示例

```jsx
// 声明 proto 语法版本，固定值
syntax = "proto3";

// proto 包名
package greet;

// 生成 golang 代码后的包名
option go_package = "example/proto/greet";

// 定义结构体
message SendMessageReq{
  string message = 1;
}
message SendMessageResp{
  int32 status = 1;
}

message GetMessageReq{
  int32 id = 1;
}
message GetMessageResp{
  string message = 1;
}

// 定义 Greet 服务
service Greet {
  // 定义客户端流式 rpc
  rpc SendMessage(stream SendMessageReq) returns (SendMessageResp);
  // 定义服务端流式 rpc
  rpc GetMessage(GetMessageReq) returns (stream GetMessageResp);
  // 定义双向流式 rpc
  rpc PushMessage(stream SendMessageReq) returns (stream GetMessageResp);
}

// 定义 Greet 服务
service Greet {
  rpc SayHello(SayHelloReq) returns (SayHelloResp);
}

// 定义 Greet 服务
service Message {
  // 定义客户端流式 rpc
  rpc SendMessage(stream SendMessageReq) returns (SendMessageResp);
  // 定义服务端流式 rpc
  rpc GetMessage(GetMessageReq) returns (stream GetMessageResp);
  // 定义双向流式 rpc
  rpc PushMessage(stream SendMessageReq) returns (stream GetMessageResp);
}
```

## 参考文献

- <a href="https://developers.google.com/protocol-buffers/docs/proto3" target="_blank">《Language Guide (proto3)》</a>
- <a href="https://grpc.io/docs/" target="_blank">《gRPC》</a>