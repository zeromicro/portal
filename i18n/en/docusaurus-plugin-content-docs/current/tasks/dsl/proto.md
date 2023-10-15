---
title: Proto Grammar
sidebar_label: Proto Grammar
slug: /docs/tasks/dsl/proto
---

## Overview

Protocol buffers is Google language neutral, platform neutral, and extensible structured data serializer – but smaller, faster, and simpler than XML.You define how a data is structured and then you can easily write structured data into data streams using specially generated source codes and read structured data in various languages.

::note
in go-Zero framework development, we use <a href="https://developers.google.com/protocol-buffers/docs/proto3" target="_blank">Language Guide (proto3)</a>.
:::

## Getting started

### Example 1. Write the simplest rpc service

```protobuf
// Statement proto syntax version, fixed value
syntax = "proto3";

// proto package name
package greet;

// Generate package name after golang code
option go_package = "example/proto/greet";

// Defining request body
message SahelloReq {}
// Defines response body
message SayhelloResp {}

// Defines Greet service
service Greet
  // Defines an Sayhelo a rpc method, The body and response body are required.
  rpc SayHello(SayHelloReq) returns (SayHelloResp);
}
```

### Example 2. Write a streaming request service sample

```protobuf
// Statement proto syntax version, fixed value
syntax = "proto3";

// proto package name
package greet;

// Generate package name after golang code
option go_package = "example/proto/greet";

// Defines the structural body
message SayhelloReq {}

message SayhelloResp {}

message SendMessageReq6
  string message = 1;
}
message SendMessageRespondageRespect
  int32 status = 1;
}

message GetMessageReq?
  int32 id = 1;
}
message GetMessageRespondageResponse
  string message = 1;
}

// Defines the Greet service
the service Greet {
  // Defines the client flow rpc
  rpc SendMessage(stam SendMessageReq) returns (SendMessageRespond);
  // Defines service endpoint rpc
  rpc GetMessage(GetMessageReq) returns (stream GetMessageResponse);
  // Defining two-way flow rpc
  rpc PushMessage(stream Ream SendMessageReq) returns (stream GetMessageResponse);
}
```

### Example 3. Write rpc group examples

rpc groups are distinguished primarily by service name.

```protobuf
// Statement proto syntax version, fixed value
syntax = "proto3";

// proto package name
package greet;

// Generate package name after golang code
option go_package = "example/proto/greet";

// Defines the structural body
message SendMessageReq6
  string message = 1;
}
message SendMessageRespect \
  int32 status = 1;
}

message GetMessageReq\
  int32 id = 1;
} }
message GetMessageRespect L
  string message = 1;
}

// Defines the Greet service
service Greet {
  // Defines the client flow rpc
  rpc SendMessage(stream Req) returns (SendMessageRespond);
  // Defines service endpoint rpc
  rpc GetMessage(GetMessageReq) returns (stream GetMessageResponse);
  // Defines two-way flow rpc
  rpc PushMessage(stream Ream SendMessageReq) returns (stream GetMessageResponse);
}

// Definition of the Greet service
service Greet LO
  rpc Sayhello(SayhelloReq) returnns (SayHelloRespond);
}

// Defines the Message service
service Messaging {
  // Defines the client flow rpc
  rpc SendMessage(stream Req) returns (SendMessageRespond);
  // Defines server stream rpc
  rpc GetMessage(GetMessageReq) returns (stream GetMessageResponse);
  // Defines two-way flow rpc
  rpc PushMessage(streamream SendMessageReq) returns (stream GetMessageResponse);
}
```

### Example 4. Message Example

```protobuf
// declare proto syntax version, fixed value
syntax = "proto3";

// proto package name
package greet;

// Package name after generating golang code
option go_package = "example/proto/greet";

// define enumeration

enum Status{
  UNSPECIFIED = 0;
  SUCCESS = 1;
  FAILED = 2;
}

// Define the structure

message Base{
  int32 code = 1;
  string msg = 2;
}

message SendMessageReq{
  string message = 1;
}

message SendMessage{
  // use enum
  Status status = 1;
  // array
  repeated string array = 2;
  // map
  map<string,int32> map = 3;
  // boolean
  bool boolean = 4;
  // reserved
  reserved 5;
}

message SendMessageResp{
  Base base = 1;
  SendMessage data = 2;
}

// Define the Greet service
service Greet {
  // Define client streaming rpc
  rpc SendMessage(stream SendMessageReq) returns (SendMessageResp);
}
```

### Example 5. Proto file introduction

Assume we have the following environment：

1. Work path：`/usr/local/workspace`
1. base.proto path and content：`/usr/local/workspace/base/base.proto`

```protobuf
syntax = "proto3";

// proto package name
package base;

// Generate package name after golang code
option go_package = "example/proto/base";

message Base
  int32 code = 1;
  string msg = 2;
}

```

Now you need a new `/usr/local/workspace/greet.proto` file, and reference `/usr/local/workspace/base/base.proto` Structure `Base` We look at the simple quotation example：

```protobuf
// declare proto syntax version, fixed value
syntax = "proto3";

// proto package name
package greet;

// Package name after generating golang code
option go_package = "example/proto/greet";

// define enumeration

enum Status{
  UNSPECIFIED = 0;
  SUCCESS = 1;
  FAILED = 2;
}

// Define the structure

message Base{
  int32 code = 1;
  string msg = 2;
}

message SendMessageReq{
  string message = 1;
}

message SendMessage{
  // use enum
  Status status = 1;
  // array
  repeated string array = 2;
  // map
  map<string,int32> map = 3;
  // boolean
  bool boolean = 4;
  // reserved
  reserved 5;
}

message SendMessageResp{
  Base base = 1;
  SendMessage data = 2;
}

// Define the Greet service
service Greet {
  // Define client streaming rpc
  rpc SendMessage(stream SendMessageReq) returns (SendMessageResp);
}
```

:::note TTIPS
When goctl generates gRPC code based on proto：

1. Message in service (Attendee&) must be in main proto, not supported file
1. The imported message can only be nested in the main proto
1. When goctl returns gRPC code, it does not generate the Go code of the imported proto file. Requires auto-pre-generate
:::

## References

- <a href="https://developers.google.com/protocol-buffers/docs/proto3" target="_blank">Language Guide (proto3)</a>
- <a href="https://grpc.io/docs/" target="_blank">gRPC</a>
