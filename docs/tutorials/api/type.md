---
title: 类型声明
slug: /docs/tutorials/api/types
---

## 概述

API 的类型声明和 Golang 的类型声明非常相似，但是有一些细微的差别，接下来我们来看一下 API 的类型声明吧。

## 类型声明

在 API 描述语言中，类型声明需要满足如下规则:

1. 类型声明必须以 `type` 开头
1. 不需要声明 `struct`关键字
1. 不支持嵌套结构体声明
1. 不支持别名

### 示例

```go

type StructureExample {
    // 基本数据类型示例
    BaseInt     int     `json:"base_int"`
    BaseBool    bool    `json:"base_bool"`
    BaseString  string  `json:"base_string"`
    BaseByte    byte    `json:"base_byte"`
    BaseFloat32 float32 `json:"base_float32"`
    BaseFloat64 float64 `json:"base_float64"`
    // 切片示例
    BaseIntSlice     []int     `json:"base_int_slice"`
    BaseBoolSlice    []bool    `json:"base_bool_slice"`
    BaseStringSlice  []string  `json:"base_string_slice"`
    BaseByteSlice    []byte    `json:"base_byte_slice"`
    BaseFloat32Slice []float32 `json:"base_float32_slice"`
    BaseFloat64Slice []float64 `json:"base_float64_slice"`
    // map 示例
    BaseMapIntString      map[int]string               `json:"base_map_int_string"`
    BaseMapStringInt      map[string]int               `json:"base_map_string_int"`
    BaseMapStringStruct   map[string]*StructureExample `json:"base_map_string_struct"`
    BaseMapStringIntArray map[string][]int             `json:"base_map_string_int_array"`
    // 匿名示例
    *Base
    // 指针示例
    Base4 *Base `json:"base4"`
    
    // 新的特性（ goctl >= 1.5.1 版本支持 ）
    // 数组示例
    BaseIntStaticArray [2]int `json:"base_int_array"`
    BaseBoolStaticArray [2]bool `json:"base_bool_array"`
    BaseStringStaticArray [2]string `json:"base_string_array"`
    BaseByteStaticArray [2]byte `json:"base_byte_array"`
    BaseFloat32StaticArray [2]float32 `json:"base_float32_array"`
    BaseFloat64StaticArray [2]float64 `json:"base_float64_array"`
    BaseMapStringStaticIntArray map[string][2]int `json:"base_map_string_static_int_array"`
    // 标签忽略示例
    TagOmit string
}
```

:::tip
API 新特性使用可参考<a href="/docs/tutorials/api/faq#1-%E6%80%8E%E4%B9%88%E4%BD%93%E9%AA%8C%E6%96%B0%E7%9A%84-api-%E7%89%B9%E6%80%A7" target="_blank"> 新版 API 解析器使用</a>
:::