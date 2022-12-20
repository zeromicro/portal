---
title: go-zero
sidebar_label: go-zero
slug: /
hide_table_of_contents: true
---

import DocsCard from '@components/global/DocsCard';
import DocsCards from '@components/global/DocsCards';
import DocsButton from '@components/page/native/DocsButton';
import AppWizard from '@components/page/intro/AppWizard';
import Customers from "@components/global/Customers"

<head>
  <title>go-zero 缩短从需求到上线的距离</title>
  <meta
    name="description"
    content="go-zero 是一个集成了各种工程实践的 web 和 rpc 框架。通过弹性设计保障了大并发服务端的稳定性，经受了充分的实战检验。"
  />
  <link rel="canonical" href="https://go-zero.dev" />
  <link rel="alternate" href="https://go-zero.dev" hreflang="x-default" />
  <link rel="alternate" href="https://go-zero.dev" hreflang="en" />
  <meta property="og:url" content="https://go-zero.dev" />
</head>

go-zero 是一个集成了各种工程实践的 web 和 rpc 框架。通过弹性设计保障了大并发服务端的稳定性，经受了充分的实战检验。

<intro-end />

<DocsCard
  className="cordova-ee-card"
  header="缩短从需求到上线的距离"
  href="/docs/tasks"
>
  <div>
    <img src="/logos/logo.svg" class="cordova-ee-img" />
    <p>
      go-zero 包含极简的 API 定义和生成工具 goctl，可以根据定义的 api 文件一键生成 Go, iOS, Android, Kotlin, Dart, TypeScript, JavaScript 代码，并可直接运行。
    </p>
    <DocsButton className="native-ee-detail">开始教程</DocsButton>
  </div>
</DocsCard>

###

<DocsCards>

<DocsCard 
header="安装教程" 
href="/docs/tasks" 
icon="/icons/guide-installation-icon.svg" 
hoverIcon="/icons/guide-installation-icon-hover.svg">
    <p>框架及工具安装指南</p>
</DocsCard>

<DocsCard 
header="基础教程" 
href="/docs/tasks" 
icon="/icons/guide-task-icon.svg" 
hoverIcon="/icons/guide-task-icon-hover.svg">
    <p>基础教程是快速了解和使用框架的最佳方式</p>
</DocsCard>

<DocsCard
  header="框架指南"
  href="/docs/tutorials"
  icon="/icons/guide-tutorial-icon.svg"
  hoverIcon="/icons/guide-tutorial-icon-hover.svg"
>
  <p>这里拥有比基础任务更高级和全面的用法</p>
</DocsCard>

<DocsCard
  header="框架组件"
  href="/docs/components"
  icon="/icons/guide-components-icon.svg"
  hoverIcon="/icons/guide-components-icon-hover.svg"
>
  <p>框架组件更深层次了解框架工作原理</p>
</DocsCard>

</DocsCards>

## 架构图
![arch](/img/index/arch-cn.svg)

## 框架设计
轻松获得支撑千万日活服务的稳定性，内建级联超时控制、限流、自适应熔断、自适应降载等微服务治理能力，无需配置和额外代码，微服务治理中间件可无缝集成到其它现有框架使用，极简的 API 描述，一键生成各端代码，自动校验客户端请求参数合法性，大量微服务治理和并发工具包。

## 框架特点
强大的工具支持，尽可能少的代码编写，极简的接口，完全兼容 net/http，支持中间件，方便扩展，高性能，面向故障编程，弹性设计，内建服务发现、负载均衡，内建限流、熔断、降载，且自动触发，自动恢复，API 参数自动校验，超时级联控制，自动缓存控制，链路跟踪、统计报警等，高并发支撑，稳定保障了疫情期间每天的流量洪峰。

## 代码自动生成
go-zero 包含极简的 API 定义和生成工具 goctl，可以根据定义的 api 文件一键生成 Go, iOS, Android, Kotlin, Dart, TypeScript, JavaScript 代码，并可直接运行。

```bash
goctl -h
A cli tool to generate api, zrpc, model code

GitHub: https://github.com/zeromicro/go-zero
Site:   https://go-zero.dev

Usage:
  goctl [command]

Available Commands:
  api               Generate api related files
  bug               Report a bug
  completion        Generate the autocompletion script for the specified shell
  docker            Generate Dockerfile
  env               Check or edit goctl environment
  help              Help about any command
  kube              Generate kubernetes files
  migrate           Migrate from tal-tech to zeromicro
  model             Generate model code
  quickstart        quickly start a project
  rpc               Generate rpc code
  template          Template operation
  upgrade           Upgrade goctl to latest version

Flags:
  -h, --help      help for goctl
  -v, --version   version for goctl


Use "goctl [command] --help" for more information about a command.
```

## 用户列表

<Customers nbElements={6} />