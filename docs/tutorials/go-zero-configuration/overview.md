---
title: go-zero 配置概述
sidebar_label: go-zero 配置概述
slug: /docs/tutorials/go-zero/configuration/overview
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

go-zero 提供了一个强大的 conf 包用于加载配置。我们目前支持的 **yaml**, **json**, **toml** 3 种格式的配置文件，go-zero 通过文件后缀会自行加载对应的文件格式。

## 如何使用

我们使用 [github.com/zeromicro/go-zero/core/conf](https://github.com/zeromicro/go-zero/tree/master/core/conf) conf 包进行配置的加载。

第一步我们会定义我们的配置结构体，其中定义我们所有需要的依赖。

第二步接着根据配置编写我们对应格式的配置文件。

第三步通过 conf.MustLoad 加载配置。

具体使用例子:

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

我们一般会在程序启动的时候进行配置的加载，同时我们一般也需要定义我们配置所需要的结构体，
在 go-zero 中，我们推荐将所有服务依赖都定义在 config 中，这样以后配置根据 config 就可以查找出所有的依赖。

我们使用 **func MustLoad(path string, v interface{}, opts ...Option)** 进行加载配置，path 为配置的路径，v 为结构体。 这个方法会完成配置的加载，如果配置加载失败，整个程序会 fatal 停止掉。

当然我们也提供了其他的加载方式，例如：

```go
func Load(file string, v interface{}, opts ...Option) error
```

## 其他格式的配置文件

我们目前支持的配置格式如下：

- json
- yaml | yml
- toml

我们程序会自动通过文件后缀进行对应格式的加载。

当然我们在 conf 包中也提供了对应格式二进制数据加载的方法：

```go

func LoadFromJsonBytes(content []byte, v interface{}) error

func LoadFromTomlBytes(content []byte, v interface{}) error

func LoadFromYamlBytes(content []byte, v interface{}) error
```

简单示例：

```go
text := []byte(`a: foo
B: bar`)

var val struct {
    A string
    B string
}
_ = LoadFromYamlBytes(text, &val)
```

:::note 注意
对于有些需要自定义 tag 的，为了方便统一，我们目前所有 tag 均为 json tag。
:::

## 大小写不敏感

conf 目前已经默认自动支持 key 大小写不敏感，例如对应如下的配置我们都可以解析出来：

```yaml
Host: "127.0.0.1"

host: "127.0.0.1"
```

## 环境变量

目前 conf 配置支持环境变量注入，我们有 2 种方式实现

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

如上，我们在 Load 时候传入 **UseEnv**， conf 会自动根据值替换字符串中的${var}或$var 当前环境变量。

### 2. env Tag

注意 env 需要 go-zero [v1.4.3](https://github.com/zeromicro/go-zero/releases/tag/v1.4.3) 以上版本才支持。

```go
var c struct {
    Name string `json:",env=SERVER_NAME"`
}

conf.MustLoad("config.yaml", &c)
```

我们可以在 json tag 的后面加上 **env=SERVER_NAME** 的标签，conf 将会自动去加载对应的环境变量。

:::note 注意
我们配置加载的顺序会优先级 **env** > **配置中的定义** > **json tag 中的 default 定义**
:::

## tag 校验规则

我们可以通过在 tag 中来声明参数接收规则，除此之外，还支持参数的校验，参数校验的规则写在 tag value 中，简单示例如下：

```go
type Config struct {
    Name string // 没有任何 tag，表示配置必填
    Port int64 `json:",default=8080"` // 如果配置中没有配置，将会初始成 8080
    Path string `json:",optional"`
}
```

如果我们在 conf 加载的时候，验证没有通过，将会报出来对应的错误。

目前 go-zero 支持的校验规则如下:

| 接收规则 | 说明                                                           | 示例                             |
| -------- | -------------------------------------------------------------- |--------------------------------|
| optional | 当前字段是可选参数，允许为零值(zero value)                     | \`json:"foo,optional"\`        |
| options  | 当前参数仅可接收的枚举值                                       | **写法 1**：竖线\                   |分割，\`json:"gender,options=foo\|bar"\` <br/>**写法 2**：数组风格，\`json:"gender,[foo,bar]"\` |
| default  | 当前参数默认值                                                 | \`json:"gender,default=male"\` |
| range    | 当前参数数值有效范围，仅对数值有效，写法规则详情见下文温馨提示 | \`json:"age,range=[0:120]"\`   |
| env      | 当前参数从环境变量获取                                         | \`json:"mode,env=MODE"\`       |

:::note range 表达式值规则

1. 左开右闭区间：(min:max]，表示大于 min 小于等于 max，当 min 缺省时，min 代表数值 0，当 max 缺省时，max 代表无穷大，min 和 max 不能同时缺省
1. 左闭右开区间：[min:max)，表示大于等于 min 小于 max，当 max 缺省时，max 代表数值 0，当 min 缺省时，min 代表无穷大，min 和 max 不能同时缺省
1. 闭区间：[min:max]，表示大于等于 min 小于等于 max，当 min 缺省时，min 代表数值 0，当 max 缺省时，max 代表无穷大，min 和 max 不能同时缺省
1. 开区间：(min:max)，表示大于 min 小于 max，当 min 缺省时，min 代表数值 0，当 max 缺省时，max 代表无穷大，min 和 max 不能同时缺省
:::

更多可以参考 [unmarshaler_test.go](https://github.com/zeromicro/go-zero/blob/master/core/mapping/unmarshaler_test.go)

## inherit 配置继承

在我们日常的配置，会出现很多重复的配置，例如 rpcClientConf 中，每个 rpc 都有一个 etcd 的配置，但是我们大部分的情况下 etcd 的配置都是一样的，我们希望可以只用配置一次etcd就可以了。
如下的例子

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

我们必须为每个 Etcd 都要加上 Hosts 等基础配置。

但是如果我们使用了 inherit 的tag 定义，使用的方式在tag 中加上 **inherit**。如下：

```go
// A RpcClientConf is a rpc client config.
	RpcClientConf struct {
		Etcd          discov.EtcdConf `json:",optional,inherit"`
        ....
    }
```

这样我们就可以简化 Etcd 的配置，他会自动向上一层寻找配置。

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
