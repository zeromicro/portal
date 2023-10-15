---
title: 内存缓存使用
sidebar_label: 内存缓存使用
slug:  /docs/tasks/memory-cache
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本章节主要介绍 <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L30" target="_blank">cache</a> 的使用。

## 准备条件

1. <a href="/docs/tasks" target="_blank">完成 golang 安装</a>

## 创建

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L44" target="_blank">NewCache</a>

```golang
函数签名: 
    NewCache func(expire time.Duration, opts ...CacheOption) (*Cache, error) 
说明: 
    创建 cache 对象。
入参:
    1. expire: 过期时间
    2. opts: 操作选项
    2.1 WithLimit: 设置 cache 存储数据数量上限
    2.2 WithName: 设置 cache 名称，输出日志时会打印
返回值:
    1. *Cache: cache对象
    2. error: 创建结果
```

## 方法说明

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L100" target="_blank">Set</a>

 ```golang
	函数签名: 
		Set func(key string, value interface{}) 
	说明: 
		添加值到缓存。
	入参:
		1. key: key
		2. value: 值

	示例:
		cache, err := NewCache(time.Second*2, WithName("any"))
		if err != nil {
			log.Fatal(err)
		}
		cache.Set("first", "first element")
	```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L105" target="_blank">SetWithExpire</a>

	```golang
	函数签名: 
		SetWithExpire func(key string, value interface{}, expire time.Duration)
	说明: 
		添加值到缓存, 同时指定过期时间
	入参:
		1. key: key
		2. value: 值
		3. expire: 过期时间

	示例:
		cache, err := NewCache(time.Second*2, WithName("any"))
		if err != nil {
			log.Fatal(err)
		}
		cache.SetWithExpire("first", "first element", time.Second)
	```

3. <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L88" target="_blank">Get</a>

	```golang
	函数签名: 
		Get func(key string) (interface{}, bool)
	说明: 
		查询缓存
	入参:
		1. key: key

	返回值:
		1. interface{}: value
		2. bool: 是否存在

	示例:
		cache, err := NewCache(time.Second*2, WithName("any"))
		if err != nil {
			log.Fatal(err)
		}
		cache.Set("first", "first element")

		v, exist := cache.Get("first")
		if !exist {
			// deal with not exist
		}
		value, ok := v.(string)
		if !ok {
			// deal with type error
		}
		// use value
	```

4. <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L79" target="_blank">Del</a>

	```golang
	函数签名: 
		Del func(key string)
	说明: 
		删除缓存。
	入参:
		1. key: key

	示例:
		cache, err := NewCache(time.Second*2, WithName("any"))
		if err != nil {
			log.Fatal(err)
		}
		cache.Del("first")
	```

4. <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L123" target="_blank">Take</a>

	```golang
	函数签名: 
		Take funcTake(key string, fetch func() (interface{}, error)) (interface{}, error)
	说明: 
		获取缓存，如果缓存中存在，则返回缓存中的值，如果缓存不存在，则执行 fetch 函数的返回结果。
	入参:
		1. key: key
		2. fetch: 自定义返回结果

	示例:
		cache, err := NewCache(time.Second*2, WithName("any"))
		if err != nil {
			log.Fatal(err)
		}

		v, err := cache.Take("first", func() (interface{}, error) {
			return "first element", nil
		})
		println(v) // output: first element
		
		cache.Set("first", "first element 2")

		v, err = cache.Take("first", func() (interface{}, error) {
			return "first element", nil
		})
		println(v) // // output: first element 2
 ```
