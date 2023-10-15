---
title: Memory cache usage
sidebar_label: Memory cache usage
slug: /docs/tasks/memory-cache
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This section mainly describes the use of <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L30" target="_blank">cache</a>.

## Preparing

1 <a href="/docs/tasks" target="_blank">Complete golang installation</a>

## Create

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L44" target="_blank">NewCache</a>

```golang
Function signature: 
    NewCache func(expire time.Duration, opts ...CacheOption) (*Cache, error) 
description: 
    create cache objects.
Attention:
    1. expire: expiration time
    2. opts: Action option
    2.1 WithLimit: Set maximum cache data
    2.2 WithName: Setup cache name, output log printing
return value:
    1. *Cache: cache object
    2. error: create result
```

## Methodological description

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L100" target="_blank">Set</a>

```golang
Function signature: 
    Set func(key string, value interface{}) 
description: 
    add value to cache.
Attention:
    1. key: key
    2. value: value

Example:
    cache, err := NewCache(time.Second*2, WithName("any"))
    if err != nil {
        log.Fatal(err)
    }
    cache.Set("first", "first element")
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L105" target="_blank">SetWithExpire</a>

```golang
Function signature: 
    SetWithExpire func(key string, value interface{}, expire time.Duration)cache, err := NewCache(time.Second*2, WithName("any"))
    if err != nil {
        log.Fatal(err)
    }
    cache.SetWithExpire("first", "first element", time.Second)
description: 
    add value to cache and specify expiration time
to participate:
    1. key: key
    2. value: value
    3. expire: Expiration Time

Example:
    cache, err := NewCache(time.Second*2, WithName("any"))
    if err != nil {
        log.Fatal(err)
    }
    cache.SetWithExpire("first", "first element", time.Second)
```

3 <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L88" target="_blank">Get</a>

```golang
Function signature: 
    Get func(key string) (interface{}, bool)
description: 
    query cache
join:
    key: key

returned value:
    1. interface{}: value
    2. bool: exists

Example:
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

4 <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L79" target="_blank">Del</a>

```golang
Function signature: 
    Del func(key string)
description: 
    Delete cache.
Attention:
    1. key: key
    2. value: value

Example:
    cache, err := NewCache(time.Second*2, WithName("any"))
    if err != nil {
        log.Fatal(err)
    }
    cache.Del("first")
```

4 <a href="https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go#L123" target="_blank">Take</a>

```golang
Function signature: 
    Take funcTake(key string, fetch func() (interface{}, error)) (interface{}, error)
description: 
    Fetch function returns the result if cache exists and if cache does not exist.
Attention:
    1. key: key
    2. fetch: Custom return result

Example:
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
