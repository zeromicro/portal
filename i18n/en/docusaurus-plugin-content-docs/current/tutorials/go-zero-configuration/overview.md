---
title: go-zero configuration overview
sidebar_label: go-zero configuration overview
slug: /docs/tutorials/go-zero/configuration/overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

go-Zero provides a powerful conf package to load configurations.We currently support **yaml**, **json**, **toml** 3 format configuration files, go-zero will load their own file format by suffix.

## How to use

We use package [github.com/zeromicro/go-zero/core/conf](https://github.com/zeromicro/go-zero/tree/master/core/conf) conf to load it.

As a first step, we will define our configuration structure, which defines all our needs dependency.

The second step goes on to prepare a configuration file based on the configuration.

Third party loading configuration via conf.MustLoad

Specific Usage:

<Tabs>

<TabItem value="go" label="main.go" default>

```go
package main

import (
    "flag"

    "github.com/zeromicro/go-zero/core/conf"
)

type Config struct {
    Host string `json:",default=0.0.0.0"`
    Port int
}

var f = flag.String("f", "config.yaml", "config file")

func main() {
    flag.Parse()
    var c Config
    conf.MustLoad(*f, &c)
    println(c.Host)
}
```

</TabItem>

<TabItem value="yaml" label="config.yaml">

```yaml
Host: 127.0.0.1
Port: 8888
```

</TabItem>
</Tabs>

We typically load the configuration when the program is started, and we generally need to define the structure we need for the configuration, In go-zero we recommend that all service dependencies be defined in the config so that the configuration can find all dependencies later based on the config configuration.

We use **func MostLoad(path string, v interface{}, opts ..Option)** to load configuration, path to configuration, v to structure. This method will complete the configuration load. If the configuration load fails, the whole app will stop dropping.

Of course we also offer other means of loading, eg:：

```go
func Load(file string, v interface{}, opts ...Option) error
```

## Other formatting profiles

We currently support the configuration format below：

- json
- yaml | yml
- toml

Our program will automatically load the corresponding format with a file suffix.

We also provide a way to load binary data in conf package：

```go

func LoadFromJsonBytes(content []byte, v interface{}) error

func LoadFromTomlBytes(content []byte, v interface{}) error

func LoadFromYamlBytes(content []byte, v interface{}) error
```

Simple Example：

```go
text := []byte(`a: foo
B: bar`)

var val struct {
    A string
    B string
}
_ = LoadFromYamlBytes(text, &val)
```

:::note
For some of those who need custom tag, for ease of harmonization, we currently all tag are json tag.
:::

## Case insensitive

conf now automatically supports key case insensitivity by default, for example, we can parse out the following configurations：

```yaml
Host: "127.0.0.1"

host: "127.0.0.1"
```

## Environment Variables

Current conf configuration supports environment variable injections, we have 2 ways to implement

### 1. **conf.UseEnv()**

```go

var c struct {
    Name string
}

conf.MustLoad("config.yaml", &c, conf.UseEnv())

```

```config.yaml
Name: ${SERVER_NAME}
```

As above, we pass in **UseEnv** during Load, and conf will automatically replace the ${var} or $var current environment variable in the string according to the value.

### 2. env Tag

Note that env requires go-zero [v1.4.3](https://github.com/zeromicro/go-zero/releases/tag/v1.4.3) to be supported.

```go
var c struct {
    Name string `json:",env=SERVER_NAME"`
}

conf.MustLoad("config.yaml", &c)
```

We can add **env=SERVER_NAME** , after json tag and conf will automatically load the corresponding environment variable.

::note  
We configure the order of loading priority **env** > **definition in configuration** > **definition of default in json tag**
:::

## tag checksum rule

We can state the rules for the reception of parameters in a tag in a tag, in addition to supporting the verification of parameters, which are written in tag value, as simple as：

```go
type Config struct {
    Name string // No tag, indicating configuration required
    Port int64 `json:",default=8080"` //  If not configured in the configuration, it will be 8080
    Path string `json:",optional"`
}
```

If we are loading in conf the verification is not passed, the corresponding error will be reported.

The currently supported verification rules for go-zero are as follows:

| Receive rules | Note                                                                                                                  | Sample                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| optional      | The current field is an optional parameter, allowing zero value (zero value)                                          | \`json:"foo,optional"\`                                                                                                                            |
| options       | Current parameter can only receive an enumeration value                                                               | **Protestant 1**：portrait line\|split,\`json:`gender,options=foo\|bar"\` <br/>**prototype 2**：array style,\`json:"gender,[foo,bar]"\` |
| default       | Current Argument Default                                                                                              | \`json:"gender,default=male"\`                                                                                                                     |
| range         | The valid range of the current parameter value, only valid for the value. Details of the writing rule are given below | \`json:"age,range=[0,120]"\`                                                                                                                       |
| env           | Current parameters are taken from environmental variables                                                             | \`json:"mode,env=MODE"\`                                                                                                                           |

::note range expressed value rule
1. Left close interval：(min:max], meaning that min is less than or equal to max, when min is default, min represents value 0, max is unlimited when max is default, min and max are not allowed to default at the same time
1. Left right interval：[min:max), which indicates that it is less than min max, when max is default, max represents a value of 0, min is large when min is missing
1. Shutdown interval：[min:max], denotes less than min less than equals max, when min is default, min represents value 0, max is infinite when max is default, min and max are not allowed to coalesce
1. Open interval：(min:max), indicates that min is less than max, when min is default, min represents a value of 0, max is large when max is default,min and max cannot be used simultaneous
:::

More reference [unmarshaler_test.go](https://github.com/zeromicro/go-zero/blob/master/core/mapping/unmarshaler_test.go)


## inherit 配置继承
In our daily configuration, there are many duplicate configurations, such as rpcClientConf where each rpc has a etcd configuration, but in most of our cases the etcd configuration is the same and we hope it can be configured only once. Examples below

```goc
type Config struct {
    Etcd     discov.EtcdConf
    UserRpc  zrpc.RpcClientConf
    PortRpc  zrpc.RpcClientConf
    OtherRpc zrpc.RpcClientConf
}

const str = `
Etcd:
  Key: rpcServer"
  Hosts:
    - "127.0.0.1:6379"
    - "127.0.0.1:6377"
    - "127.0.0.1:6376"

UserRpc:
  Etcd:
    Key: UserRpc
    Hosts:
    - "127.0.0.1:6379"
    - "127.0.0.1:6377"
    - "127.0.0.1:6376"

PortRpc:
  Etcd:
    Key: PortRpc
    Hosts:
    - "127.0.0.1:6379"
    - "127.0.0.1:6377"
    - "127.0.0.1:6376"

OtherRpc:
  Etcd:
    Key: OtherRpc
    Hosts:
    - "127.0.0.1:6379"
    - "127.0.0.1:6377"
    - "127.0.0.1:6376"
`

```

We must add Hosts to every Etcd and other base configurations.

But if we use the tag definition inherit, the method used is to add **to the tag**.The following is：

```go
// A RpcClientConf is a rpc client config.
    RpcClientConf struct {
        Etcd          discov.EtcdConf `json:",optional,inherit"`
        ....
    }
```

This will allow us to simplify the Etcd configuration, which he will automatically look to the top level.

```go
const str = `
Etcd:
  Key: rpcServer"
  Hosts:
    - "127.0.0.1:6379"
    - "127.0.0.1:6377"
    - "127.0.0.1:6376"

UserRpc:
  Etcd:
    Key: UserRpc

PortRpc:
  Etcd:
    Key: PortRpc

OtherRpc:
  Etcd:
    Key: OtherRpc
`
```
