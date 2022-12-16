---
title: API 定义完整示例
sidebar_label: API 定义完整示例
slug: /docs/reference
---

## api 示例

下文仅展示 api 文件的完整写法和对应语法块的存在意义，如需查看 api 规范定义，可参考 [《API 规范》](/docs/tutorials)

```go
// 我是单行注释写法
/*
我是文本注释的写法
*/

// syntax 是 api 文件中必不可少的语句，用于描述当前 api 文件支持的语法版本
// 当前为固定写法，且必须放在除注释外的最顶部。
syntax = "v1"

// info 语法块，用于描述 api 文件信息的，相当于 api 文件的 meta，如果被
// import 的 api 文件也声明了 info 语句块，则会进行 key-value 合并，
// 如果 import 的 api 文件和父 api 文件存在相同 key，则子 api 文件
// 所对应的 key 的值会覆盖父 api 文件中相同 key 的值。
info (
    title:   "api 文件完整示例写法"
    desc:    "演示如何编写 api 文件"
    author:  "keson.an"
    date:    "2022 年 12 月 26 日"
    version: "v1"
)


```
