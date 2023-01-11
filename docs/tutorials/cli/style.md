---
title:  文件风格
slug: /docs/tutorials/cli/style
---

## 概述

goctl 生成代码支持对文件和文件夹的命名风格进行格式化，可以满足不同开发者平时的阅读习惯，不过在 Golang 中，文件夹和文件命名规范推荐使用全小写风格，详情可参考 <a href="https://google.github.io/styleguide/go/" target="_blank">Go Style</a>。

## 格式化符号

在 goctl 代码生成中，可以通过 `go` 和 `zero` 组成格式化符号来格式化文件和文件夹的命名风格，如常见的风格格式化符号如下：

- lowercase: `gozero`
- camelcase: `goZero`
- snakecase: `go_zero`

## 格式化符号表参考

假设我们有一个源字符串 `welcome_to_go_zero`，其参考格式化符号表如下：

| 格式化符号 | 格式化后的字符串 | 说明 |
| --- | --- | --- |
| `gozero` | `welcometogozero` | lower case |
| `goZero` | `welcomeToGoZero` | camel case |
| `go_zero` | `welcome_to_go_zero` | snake case |
| `Go#zero` | `Welcome#to#go#zero` | 自定义分隔符，如分割符 `#` |
| `GOZERO` | `WELCOMETOGOZERO` | upper case |
| `_go#zero_` | `_welcome#to#go#zero_` | 前缀、后缀及自定义分割符，这里使用 `_` 作为前缀和后缀，使用 `#` 作为分割符 |

:::note 非法格式化符号

- go
- gOZero
- zero
- goZEro
- goZERo
- goZeRo
- foo
:::

## 使用

格式化符号是在 goctl 代码生成时使用的，由 `style` 参数来对格式化符进行控制，如：

```bash
# 生成 lower case 文件和目录示例
$ goctl api new demo -style gozero
# 生成 snake case 文件和目录示例
$ goctl api new demo -style go_zero
# 生成 camel case 文件和目录示例
$ goctl api new demo -style goZero
```
