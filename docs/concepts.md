---
title: 框架概述
sidebar_label: 框架概述
slug: /docs/concepts/overview
---

import { Image } from '@arco-design/web-react';

## go-zero

> **_缩短从需求到上线的距离_**

go-zero 是一个集成了各种工程实践的 web 和 rpc 框架。通过弹性设计保障了大并发服务端的稳定性，经受了充分的实战检验。

go-zero 包含极简的 API 定义和生成工具 goctl，可以根据定义的 api 文件一键生成 Go, iOS, Android, Kotlin, Dart, TypeScript, JavaScript 代码，并可直接运行。

## 使用 go-zero 的好处

- 轻松获得支撑千万日活服务的稳定性
- 内建级联超时控制、限流、自适应熔断、自适应降载等微服务治理能力，无需配置和额外代码
- 微服务治理中间件可无缝集成到其它现有框架使用
- 极简的 API 描述，一键生成各端代码
- 自动校验客户端请求参数合法性
- 大量微服务治理和并发工具包

<Image
      width={1500}
      src="https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/architecture.png"
      alt='架构图'
/>


## 1. go-zero 框架背景

18 年初，我们决定从 `Java+MongoDB` 的单体架构迁移到微服务架构，经过仔细思考和对比，我们决定：

- 基于 Go 语言
  - 高效的性能
  - 简洁的语法
  - 广泛验证的工程效率
  - 极致的部署体验
  - 极低的服务端资源成本
- 自研微服务框架
  - 有过很多微服务框架自研经验
  - 需要有更快速的问题定位能力
  - 更便捷的增加新特性

## 2. go-zero 框架设计思考

对于微服务框架的设计，我们期望保障微服务稳定性的同时，也要特别注重研发效率。所以设计之初，我们就有如下一些准则：

- 保持简单，第一原则
- 弹性设计，面向故障编程
- 工具大于约定和文档
- 高可用
- 高并发
- 易扩展
- 对业务开发友好，封装复杂度
- 约束做一件事只有一种方式

我们不到半年时间，我们彻底完成了从 `Java+MongoDB` 到 `Golang+MySQL` 为主的微服务体系迁移，并于 18 年 8 月底完全上线，稳定保障了业务后续迅速增长，确保了整个服务的高可用。

## 3. go-zero 项目实现和特点

go-zero 是一个集成了各种工程实践的包含 web 和 rpc 框架，有如下主要特点：

- 强大的工具支持，尽可能少的代码编写
- 极简的接口
- 完全兼容 net/http
- 支持中间件，方便扩展
- 高性能
- 面向故障编程，弹性设计
- 内建服务发现、负载均衡
- 内建限流、熔断、降载，且自动触发，自动恢复
- API 参数自动校验
- 超时级联控制
- 自动缓存控制
- 链路跟踪、统计报警等
- 高并发支撑，稳定保障了疫情期间每天的流量洪峰

如下图，我们从多个层面保障了整体服务的高可用：

<Image
      src="https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/resilience.jpg"
      alt="弹性设计"
/>

觉得不错的话，别忘 **star** 👏

## 4. Installation

在项目目录下通过如下命令安装：

```shell
GO111MODULE=on GOPROXY=https://goproxy.cn/,direct go get -u github.com/zeromicro/go-zero
```

## 5. Quick Start

0. 完整示例请查看

   [快速构建高并发微服务](https://github.com/zeromicro/zero-doc/blob/main/doc/shorturl.md)

   [快速构建高并发微服务 - 多 RPC 版](https://github.com/zeromicro/zero-doc/blob/main/docs/zero/bookstore.md)

1. 安装 goctl 工具

   `goctl` 读作 `go control`，不要读成 `go C-T-L`。`goctl` 的意思是不要被代码控制，而是要去控制它。其中的 `go` 不是指 `golang`。在设计 `goctl` 之初，我就希望通过 `她`
   来解放我们的双手 👈

   ```shell
   GO111MODULE=on GOPROXY=https://goproxy.cn/,direct go get -u github.com/zeromicro/go-zero/tools/goctl
   ```

   如果使用 go1.16 版本, 可以使用 `go install` 命令安装

   ```shell
   GOPROXY=https://goproxy.cn/,direct go install github.com/zeromicro/go-zero/tools/goctl@latest
   ```

   确保 goctl 可执行

2. 快速生成 api 服务

   ```shell
   goctl api new greet
   cd greet
   go mod init
   go mod tidy
   go run greet.go -f etc/greet-api.yaml
   ```

   默认侦听在 8888 端口（可以在配置文件里修改），可以通过 curl 请求：

   ```shell
   curl -i http://localhost:8888/from/you
   ```

   返回如下：

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json; charset=utf-8
   Traceparent: 00-45fa9e7a7c505bad3a53a024e425ace9-eb5787234cf3e308-00
   Date: Thu, 22 Oct 2020 14:03:18 GMT
   Content-Length: 14
   ```

编写业务代码：

    * api 文件定义了服务对外暴露的路由，可参考 [api 规范](https://github.com/zeromicro/zero-doc/blob/main/go-zero.dev/cn/api-grammar.md)
    * 可以在 servicecontext.go 里面传递依赖给 logic，比如 mysql, redis 等
    * 在 api 定义的 get/post/put/delete 等请求对应的 logic 里增加业务处理逻辑

3. 可以根据 api 文件生成前端需要的 Java, TypeScript, Dart, JavaScript 代码

   ```shell
   goctl api java -api greet.api -dir greet
   goctl api dart -api greet.api -dir greet
   ...
   ```

## 6. Benchmark

<Image
      src="https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/benchmark.png"
      alt='benchmark'
/>

[测试代码见这里](https://github.com/smallnest/go-web-framework-benchmark)

## 7. 文档

- [API 文档](design/grammar)

- [goctl 使用帮助](goctl/goctl)

- awesome 系列（更多文章见『微服务实践』公众号）

  - [快速构建高并发微服务](https://github.com/zeromicro/zero-doc/blob/main/doc/shorturl.md)
  - [快速构建高并发微服务 - 多 RPC 版](https://github.com/zeromicro/zero-doc/blob/main/docs/zero/bookstore.md)

- 精选 `goctl` 插件
-

| 插件                                                                         | 用途                                                                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| <a href="https://github.com/zeromicro/goctl-swagger">goctl-swagger</a>       | 一键生成 <code>api</code> 的 <code>swagger</code> 文档                                     |
| <a href="https://github.com/zeromicro/goctl-android">goctl-android</a>       | 生成 <code>java (android)</code> 端 <code>http client</code> 请求代码                      |
| <a href="https://github.com/zeromicro/goctl-go-compact">goctl-go-compact</a> | 合并 <code>api</code> 里同一个 <code>group</code> 里的 <code>handler</code> 到一个 go 文件 |

## 8. 微信公众号

`go-zero` 相关文章都会在 `微服务实践` 公众号整理呈现，欢迎扫码关注，也可以通过公众号私信我 👏

<Image
      width={300}
      src="https://zeromicro.github.io/go-zero-pages/resource/go-zero-practise.png"
      alt='wechat'
/>


## 9. 微信交流群

如果文档中未能覆盖的任何疑问，欢迎您在群里提出，我们会尽快答复。

您可以在群内提出使用中需要改进的地方，我们会考虑合理性并尽快修改。

如果您发现 **_bug_** 请及时提 **_issue_**，我们会尽快确认并修改。

为了防止广告用户、识别技术同行，请 **_star_** 后加我时注明 **github** 当前 **_star_** 数，我再拉进 **go-zero** 群，感谢！

加我之前有劳点一下 **_star_**，一个小小的 **_star_** 是作者们回答海量问题的动力 🤝

<Image
      width={300}
      src="https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/wechat.jpg"
      alt='wechat'
/>
