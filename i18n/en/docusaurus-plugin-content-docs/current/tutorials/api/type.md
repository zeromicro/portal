---
title: Type Declaration
slug: /docs/tutorials/api/types
---

## Overview

The API type declaration is very similar to the Golang type statement, but there are some nuances and we turn to the API type statement.

## Type Declaration

In the API description, the type declaration needs to satisfy the following rule:

1. Type declaration must start with `type`
1. No need to declare `structure`keywords
1. Nested Structural Declarations are not supported
1. Alias not supported

### Sample

```go

type StructureExample {
    // Basic data type example
    BaseInt     int     `json:"base_int"`
    BaseBool    bool    `json:"base_bool"`
    BaseString  string  `json:"base_string"`
    BaseByte    byte    `json:"base_byte"`
    BaseFloat32 float32 `json:"base_float32"`
    BaseFloat64 float64 `json:"base_float64"`
    // slice example
    BaseIntSlice     []int     `json:"base_int_slice"`
    BaseBoolSlice    []bool    `json:"base_bool_slice"`
    BaseStringSlice  []string  `json:"base_string_slice"`
    BaseByteSlice    []byte    `json:"base_byte_slice"`
    BaseFloat32Slice []float32 `json:"base_float32_slice"`
    BaseFloat64Slice []float64 `json:"base_float64_slice"`
    // map example
    BaseMapIntString      map[int]string               `json:"base_map_int_string"`
    BaseMapStringInt      map[string]int               `json:"base_map_string_int"`
    BaseMapStringStruct   map[string]*StructureExample `json:"base_map_string_struct"`
    BaseMapStringIntArray map[string][]int             `json:"base_map_string_int_array"`
    // anonymous example
    *Base
    // pointer example
    Base4 *Base `json:"base4"`

    // new features ( goctl >= 1.5.1 version support )
    // tag ignore example
    TagOmit string
}
```

:::tip
New API features are referenced <a href="/docs/tutorials/api/faq#1-%E6%80%8E%E4%B9%88%E4%BD%93%E9%AA%8C%E6%96%B0%E7%9A%84-api-%E7%89%B9%E6%80%A7" target="_blank"> New API Resolver Us</a>

We don't support generic, weak types, e.g. `any` type

You can participate in the discussion discussion to share your views <a href="https://github.com/zeromicro/go-zero/discussions/3121" target="_blank">https://github.com/zeroicro/go-zero/discussions/3121</a>
::