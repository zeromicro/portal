---
title: 配置中心
sidebar_label: 配置中心
slug:  /docs/tasks/configcenter
---

go-zero 即将在新版本(v1.7.1)中支持配置中心功能, 本文提前介绍下配置中心的简单使用，使用注意事项和特点介绍。代码 https://github.com/zeromicro/go-zero/pull/3035.

## 使用demo

```go
package main

import (
        "github.com/zeromicro/go-zero/core/configcenter"
        "github.com/zeromicro/go-zero/core/configcenter/subscriber"
)

// 配置结构定义
type TestSt struct {
        Name string `json:"name"`
}

func main() {
        // 创建 etcd subscriber
        ss := subscriber.MustNewEtcdSubscriber(subscriber.EtcdConf{
            Hosts: []string{"localhost:2379"}, // etcd 地址
            Key:   "test1",    // 配置key
       })
        
        // 创建 configurator
        cc := configurator.MustNewConfigCenter[TestSt](configurator.Config{
                Type: "json", // 配置值类型：json,yaml,toml
        }, ss)

        // 获取配置
        // 注意: 配置如果发生变更，调用的结果永远获取到最新的配置
        v, err := cc.GetConfig() 
        if err != nil {
                panic(err)
        }
        println(v.Name)
        
        // 如果想监听配置变化，可以添加 listener
        cc.AddListener(func() {
                v, err := cc.GetConfig()
                if err != nil {
                        panic(err)
                }
                println(v.Name)
        })

        select {}
}
```

## 使用注意事项

1. configurator 支持的模板类型: struct, string。

2. 如果想使用更多配置类型([]struct,map,[]map...)，可以使用 string 类型，获取到数据后，自行进行解析。

    ```go
    func main() {
            // 创建 etcd subscriber
            ss := subscriber.MustNewEtcdSubscriber(subscriber.EtcdConf{
                Hosts: []string{"localhost:2379"}, // etcd 地址
                Key:   "test1",    // 配置key
            })
            
            // 创建 configurator
            cc := configurator.MustNewConfigCenter[string](configurator.Config{
                    Type: "json", // 配置值类型：json,yaml,toml
            }, ss)
    
            // 获取配置
            // 注意: 配置如果发生变更，调用的结果永远获取到最新的配置
            v, err := cc.GetConfig() 
            if err != nil {
                    panic(err)
            }
            
            // 对 cc.GetConfig() 结果 自定义解析方式
    }
    ```
3. 如果是 struct 模板类型，configurator 的解析器和静态配置方式是一样的，都会进行 config 的校验。详细规则请参考: <a href="docs/tutorials/api/parameter" target="_blank">参数规则</a>

```go
// 配置结构定义
type TestSt struct {
        Name string `json:",optional"`
        age  int    `json:",default=20"`
}
```

## 特点介绍

1. configurator 内置快照数据，可以高性能提供能力。

2. configurator 支持自定义 subscriber，可以根据自己的技术栈自定义扩展，go-zero 默认支持 etcd。

```go
package main

import (
        "sync"

        "github.com/zeromicro/go-zero/core/configcenter"
)

type TestSt struct {
        Name string `json:"name"`
}

// 自定义 Subscriber
type MySubscriber struct {
        listeners []func()
        lock      sync.Mutex
}

// 实现自定义 AddListener 
func (m *MySubscriber) AddListener(listener func()) error {
        m.lock.Lock()
        m.listeners = append(m.listeners, listener)
        m.lock.Unlock()
        return nil
}

// 实现自定义 Value
func (m *MySubscriber) Value() (string, error) {
        return "", nil
}

func main() {
        mySubscriber := &MySubscriber{}

        cc := configurator.MustNewConfigCenter[TestSt](configurator.Config{
                Type: "json",
        }, mySubscriber) // 注入自定义 Subscriber

        v, err := cc.GetConfig()
        if err != nil {
                panic(err)
        }
        println(len(v.Name))
}
```