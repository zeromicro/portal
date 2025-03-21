---
title: goctl 插件资源
slug: /docs/reference/goctl/plugins
---

## 概述

goctl api 提供了 plugin 命令来支持对 api 进行功能扩展，当 goctl api 中的功能不满足你的使用，
或者需要对 goctl api 进行功能自定义的扩展，那么插件功能将非常适合开发人员进行自给自足，详情见
<a href="/docs/tutorials/cli/api#plugin" target="_blank">goctl api plugin</a>

## 插件资源

- [goctl-go-compact](https://github.com/zeromicro/goctl-go-compact)
  goctl 默认的一个路由一个文件合并成一个文件

- [goctl-swagger](https://github.com/zeromicro/goctl-swagger)
  通过 api 文件生成 swagger 文档

- [goctl-php](https://github.com/zeromicro/goctl-php)
  goctl-php 是一款基于 goctl 的插件，用于生成 php 调用端（服务端） http server 请求代码

- [goctl-helper](https://plugins.jetbrains.com/plugin/25693-goctl-helper)
  goctl-helper 是一款基于 goland 的插件，用于生成简单的api protobuf文件

- [goctl-proto](https://github.com/liferod/goctl-proto)
  通过 api 文件生成 protobuf 文件，使用该文件生成 rpc 代码，参考[这里](https://go-zero.dev/docs/tutorials/cli/rpc#goctl-rpc-protoc)
- [goctl-validate](https://github.com/linabellbiu/goctl-validate)
  一个go-zero请求参数验证的插件，用于在生成的types.go文件中使用validatioin/Validator接口自动添加请求验证逻辑
