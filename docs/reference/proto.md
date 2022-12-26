---
title: Proto 定义完整示例
sidebar_label: Proto 定义完整示例
slug: /docs/reference/proto
---

## proto 示例

以下示例来自 <a href="https://developers.google.com/protocol-buffers/docs/proto3">Language Guide (proto3)</a>

```go
// 声明 proto 使用的语法版本
syntax = "proto3";

// proto 包名
package demo;

// golang 包名
option go_package = "github.com/zeromicro/example/proto/demo";

// 结构体
// SearchRequest 消息定义指定三个字段（名称/值对），每个字段对应于要包含在此类消息中的每段数据。每个字段都有一个名称和类型。
message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
}

// 如需为 .proto 文件添加注释，请使用 C/C++ 样式的 // 和 /* ... */ 语法。
/* SearchRequest represents a search query, with pagination options to
 * indicate which results to include in the response. */

message SearchRequest {
  string query = 1;
  int32 page_number = 2;  // Which page number do we want?
  int32 result_per_page = 3;  // Number of results to return per page.
}

// 保留字段编写示例
// 如果您通过完全移除或注释掉某个字段来更新消息类型，则将来的用户可以自行更新该字段编号以对
// 该类型进行更新。如果用户日后加载同一 .proto 的旧版本（包括数据损坏、隐私 bug 等），
// 这可能会导致严重问题。确保不会发生这种情况的一种方法是，指定已删除字段的字段编号
// （和/或名称，也可能导致 JSON 序列化问题）为 reserved。如果任何未来用户尝试使用这些字
// 段标识符，协议缓冲区编译器就会抱怨。
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}

// 枚举
// 在定义消息类型时，您可能希望它的某个字段仅具有一个预定义的值列表。例如，假设您想要为每个 
// SearchRequest 添加一个 corpus 字段，其中正文可以是 UNIVERSAL、WEB、IMAGES、LOCAL、
// NEWS、PRODUCTS 或 VIDEO。为此，您只需在消息定义中添加 enum 并针对每个可能的值添加一个常量。

// 在以下示例中，我们添加了一个名为 Corpus 的 enum（包含所有可能的值）和 Corpus 类型的字段：
// 如您所见，Corpus 枚举的第一个常量映射到零：每个枚举定义必须包含一个映射到零的第一个常量作为其
// 第一个元素。原因如下：
// 
// 1. 必须有一个零值，以便我们可以使用 0 作为数字的默认值。
// 2/ 零值必须是第一个元素，以便与 proto2 语义（其中第一个枚举值始终是默认值）兼容。

enum Corpus {
  CORPUS_UNSPECIFIED = 0;
  CORPUS_UNIVERSAL = 1;
  CORPUS_WEB = 2;
  CORPUS_IMAGES = 3;
  CORPUS_LOCAL = 4;
  CORPUS_NEWS = 5;
  CORPUS_PRODUCTS = 6;
  CORPUS_VIDEO = 7;
}

message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
  Corpus corpus = 4;
}

// 使用其他消息类型
// 您可以将其他消息类型用作字段类型。例如，假设您想在每条 SearchResponse 消息中包含 Result 
// 消息 - 为此，您可以在同一 .proto 中定义一个 Result 消息类型，然后在 SearchResponse 
// 中指定 Result 类型的字段：
message SearchResponse {
  repeated Result results = 1;
}

message Result {
  string url = 1;
  string title = 2;
  repeated string snippets = 3;
}

// 嵌套类型
// 您可以在其他消息类型中定义和使用消息类型，如以下示例所示：Result 消息在 SearchResponse 
// 消息中定义：
message SearchResponse {
  message Result {
    string url = 1;
    string title = 2;
    repeated string snippets = 3;
  }
  repeated Result results = 1;
}

// map
如果您想在数据定义中创建 map，协议缓冲区可提供方便的快捷方式语法：
message SearchResponse {
    map<string, Project> projects = 1;
}

// 定义服务
// 如果要将消息类型与 RPC（远程过程调用）系统配合使用，您可以在 .proto 文件中定义 RPC 服务接口，
// 协议缓冲区编译器会生成以您选择的语言编写的服务接口代码和存根。例如，如果您想使用接受 SearchRequest
//  并返回 SearchResponse 的方法定义 RPC 服务，可以在 .proto 文件中定义它，如下所示：
service SearchService {
  rpc Search(SearchRequest) returns (SearchResponse);
}
```
