---
title: Full Example of Proto Definition
sidebar_label: Full Example of Proto Definition
slug: /docs/reference/proto
---

## Proto Example

The following example is from <a href="https://developers.google.com/protocol-buffers/docs/proto3">Language Guide (proto3)</a>

```protobuf
// Statement proto use syntax
syntax = "proto3";

// proto package name
package demo;

// golang package name
option go_package = "github. om/zeroicro/example/proto/demo";

// Structure
// SearchRequest Message definition specifies three fields (name/value), each field corresponds to each of the data to be included in such messages.Each field has a name and type.
message SearchRequest {
  string = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
}

// If required. Roto file add annotations, use C/C++ style // / *...*/ syntax.
/* SearchRequest presents a search query, with identification options to
 * indicating which results to include in the response. */

message SearchRequest {
  string = 1;
  int32 page_number = 2; // Which page number do we want?
  int32 result_per_page = 3; // Number of results to return per page.
}

// Keep the field writing sample
// If you update the message type by completely removing or annoying a field, future users will be free to update the field number to
// that type.If users load later older versions of the same .proto (including data breaks, privacy bugs etc.),
// this may cause serious problems.One way to ensure that this does not happen is to reserve the field number
// (and/or the name that may also cause JSON serialization problems) that has been deleted.If any future user attempts to use these words
// segment identifier, the protocol buffer compiler will complain.
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}

// Enums
// In defining message type, you may want a field to have only one predefined list of values.For example, suppose you want to add a corpus field for each 
// SearchRequest where the body can be UNIVERSAL, WEB, IMAGES, LOCAL,
//NEWS, PRODUCTS or VIDEO.For this, you simply need to add enum in the message definition and add a constant to each possible value.

// In the following example, we've added a field named Corpus (containing all possible values) and Corpus type：
/ / as you see, the first constant map of the Corpus enumeration to zero：each item must contain a first constant to zero as its
// first element.The reason is the following：
// 
// 1. Must have a zero value so that we can use 0 as a default value for numbers.
// Zero must be the first element to be compatible with proto2 in which the first value is always the default.

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
  Corpus corps = 4;
}

// Use other message type
// You can use other message types as field type.message SearchResponse {
  repeated Result results = 1;
}

message Result {
  string url = 1;
  string title = 2;
  repeated string snippets = 3;
}

message SearchResponse {
  message Result {
    string url = 1;
    string title = 2;
    repeated string snippets = 3;
  }
  repeated Result results = 1;
}

// map
message SearchResponse {
    map<string, Project> projects = 1;
}For example, if you want to use the method of accepting SearchRequest
// and return SearchResponse to define RPC services, it can be defined in a .proto file as shown below in：
service SearchService 6
  rpc Search(SearchRequest) returns (Search);
}
```
