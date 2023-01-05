---
title: 参数规则
slug: /docs/tutorials/api/parameter
---

## 概述

在 go-zero 中，我们通过 api 语言来声明 HTTP 服务，然后通过 goctl 生成 HTTP 服务代码，在之前我们系统性的介绍了 <a href="/docs/tutorials" target="_blank">API 规范</a>。

在 go-zero 中已经内置了一些参数校验的规则，接下来我们来看一下 go-zero 中的参数接收/校验规则吧。

## 参数接收规则

在 api 描述语言中，我们可以通过在 tag 中来声明参数接收规则，目前 go-zero 支持的参数接收规则如下：

| <img width={100}/>接收规则 | 说明 | <img width={150}/>生效范围 | 示例 |
| --- | --- | --- | --- |
| json | json 序列化 | 请求体&响应体 | \`json:"foo"\` |
| path | 路由参数 | 请求体 | \`path:"id"\` |
| form | post 请求的表单参数请求接收标识，get 请求的 query 参数接收标识 | 请求体 | \`form:"name"\` |
| header | http 请求体接收标识 | 请求体 |\`header:"Content-Length"\` |

:::note 温馨提示
go-zero 中不支持多 tag 来接收参数，即一个字段只能有一个 tag，如下写法可能会导致参数接收不到：

```go
type Foo {
    Name string `json:"name" form:"name"`
}
```
:::

## 参数校验规则

在 api 描述语言中，我们可以通过在 tag 中来声明参数接收规则，除此之外，还支持参数的校验，参数校验的规则仅对 **请求体** 有效，参数校验的规则写在 tag value中，目前 go-zero 支持的参数校验规则如下：

| <img width={100}/>接收规则 | 说明 | 示例 |
| --- | --- | --- |
| optional | 当前字段是可选参数，允许为零值(zero value) | \`json:"foo,optional"\` |
| options | 当前参数仅可接收的枚举值 | **写法1**：竖线\|分割，\`json:"gender,options=foo\|bar"\` <br/>**写法2**：数组风格，\`json:"gender,[foo,bar]"\` |
| default | 当前参数默认值 | \`json:"gender,default=male"\` |
| range | 当前参数数值有效范围，仅对数值有效，写法规则详情见下文温馨提示 | \`json:"age,range=[0,120]"\` |
| env |  当前参数从环境变量获取 | \`json:"mode,env=MODE"\` |

:::note range 表达式值规则
1. 左开右闭区间：(min:max]，表示大于 min 小于等于 max，当 min 缺省时，min 代表数值 0，当 max 缺省时，max 代表无穷大，min 和 max 不能同时缺省
1. 左闭右开区间：[min:max)，表示大于等于 min 小于 max，当 max 缺省时，max 代表数值 0，当 min 缺省时，min 代表无穷大，min 和 max 不能同时缺省
1. 闭区间：[min:max]，表示大于等于 min 小于等于 max，当 min 缺省时，min 代表数值 0，当 max 缺省时，max 代表无穷大，min 和 max 不能同时缺省
1. 开区间：(min:max)，表示大于 min 小于 max，当 min 缺省时，min 代表数值 0，当 max 缺省时，max 代表无穷大，min 和 max 不能同时缺省
:::