---
title: 新增配置
sidebar_label: 新增配置
slug:  /docs/tasks/static/configuration/create
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

一般程序启动的时候需要通过静态配置文件加载各种配置，go-zero 目前支持各种格式的配置，本章将会演示 go-zero 如何加载静态配置。

## 任务目标

1. 学会如何定义一个配置。
1. 从静态文件中加载配置。


## 准备条件

1. <a href="/docs/tasks" target="_blank">完成 golang 安装</a> 


## 定义 Config

```go
type Config struct {
	Name string
	Host string `json:",default=0.0.0.0"`
	Port int
}
```
如上，我们定义了一个 Config struct ，里面包含几个字段，服务名称，监听地址，端口号。

## 定义配置路径

```go
var f = flag.String("f", "config.yaml", "config file")
```
我们一般希望可以在启动的时候指定配置文件的路径，所以我们定一个 flag 用于接受配置文件的路径。

## 编写配置文件
我们使用 yaml 格式当做实例，生成 config.yaml 文件。写入如下内容

```yaml
Name: demo
Host: 127.0.0.1
Port: 6370
```

## 加载配置

```go
flag.Parse()
var c Config
conf.MustLoad(*f, &c)
println(c.Name)
```

至此我们 讲 config.yaml 中的配置文件加载到 Config 中来了。我们后续可以在程序中使用我们的配置变量

## 完整实例

```go
package main

import (
	"flag"
	"github.com/zeromicro/go-zero/core/conf"
)

type Config struct {
	Name string
	Host string `json:",default=0.0.0.0"`
	Port int
}

var f = flag.String("f", "config.yaml", "config file")

func main() {
	flag.Parse()
	var c Config
	conf.MustLoad(*f, &c)
	println(c.Name)
}
```