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
  <title>go-zero shorten the distance from demand to offline</title>
  <meta
    name="description"
    content="go-zero is a web and rpc framework that integrates various engineering practices.Flexible design guarantees stability at the same end and undergoes a full operational test."
  />
  <link rel="canonical" href="https://go-zero.dev" />
  <link rel="alternate" href="https://go-zero.dev" hreflang="x-default" />
  <link rel="alternate" href="https://go-zero.dev" hreflang="en" />
  <meta property="og:url" content="https://go-zero.dev" />
</head>

go-zero is a web and rpc framework that integrates various engineering practices.Flexible design guarantees stability at the same end and undergoes a full operational test.

<intro-end />

<DocsCard
  className="cordova-ee-card"
  header="go-zero shorten the distance from demand to offline"
  href="/docs/tasks"
>
  <div>
    <img src="/logos/logo.svg" class="cordova-ee-img" />
    <p>
      go-zero contains very simple API definitions and generation tools goctl. Can generate Go, iOS, Android, Kotlin, Dart, TypeScript, JavaScript code based on defined api files and can be run directly.
    </p>
    <DocsButton className="native-ee-detail">Start tutorial</DocsButton>
  </div>
</DocsCard>

###

<DocsCards>

<DocsCard
  header="Get Started"
  href="/docs/tutorials"
  icon="/icons/guide-tutorial-icon.svg"
  hoverIcon="/icons/guide-tutorial-icon-hover.svg"
>
  <p>Here's more advanced and comprehensive usage than basic tasks</p>
</DocsCard>

<DocsCard
  header="Components"
  href="/docs/components"
  icon="/icons/guide-components-icon.svg"
  hoverIcon="/icons/guide-components-icon-hover.svg"
>
  <p>A deeper understanding of how the framework works</p>
</DocsCard>

</DocsCards>

## Architecture
![arch](/img/index/arch-cn.svg)

## Framework design
Easy access to stability to support tens of millions of days of living services, end-to-timeout controls, limited flow, adaptive smelting, adaptive downloading capabilities such as microservices without configuration and extra code. Micro-service governance middleware can be seamlessly integrated into other existing frameworks, abbreviated API descriptions, one-click generation of end codes, auto-calibration of client requests parameters and a large number of microservice governance and parallel toolkits.

## Framework Features
Powerful tool support, minimum code writing, very simple interfaces, fully compatible net/http, supports intermediaries, easy expansion, high performance, troubleshooting, adaptive design, internal service discovery, load balance, internal build limit flow, melting, downloading and automatic trigger, automatic recovery, API parameter auto, timebound control, auto-cache control, link tracking, statistical alert, etc., high and supported in order to stabilize daily flow peaks during the epidemic.

## Code Autogenerate
go-zero contains very simple API definitions and generation tools goctl. Can generate Go, iOS, Android, Kotlin, Dart, TypeScript, JavaScript code based on defined api files and can be run directly.

```bash
goctl -h
A cli tool to generate api, gRPC, model code

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

## Users

<Customers nbElements={6} />