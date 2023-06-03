---
title: Configuration File
slug: /docs/tasks/static/configuration
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Normally started with a static configuration file to load configurations. The go-zero configuration currently supports various formats. This chapter will demonstrate how go-zero will load static configurations.

## Task Targets

1. Learn how to define a configuration.
1. Load configuration from static file.

## Preparing

1. <a href="/docs/tasks" target="_blank">Complete golang installation</a>

## Define Config

```go
type Config struct {
    Name string
    Host string `json:",default=0.0.0.0"`
    Port int
}
```

As above, we defined a Config struct, which contains several fields, service name, listener addresses, port number.

## Define configuration path

```go
var f = flag.String("f", "config.yaml", "config file")
```

We generally want to specify the path to the configuration file at startup, so we have a flag path to accept the configuration file.

## Write configuration

We use yaml as an instance to generate config.yaml files.Write the following

```yaml
Name: demo
Host: 127.0.0.1
Port: 6370
```

## Load Configuration

```go
flag.Parse()
var c Config
conf.MustLoad(*f, &c)
println(c.Name)
```

Here the configuration file in config.yaml is loaded into Config file.We can then use our configuration variable in the program

## Full Instance

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
