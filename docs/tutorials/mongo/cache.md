---
title: 缓存管理
sidebar_label: 缓存管理
slug: /docs/tutorials/mongo/cache
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述
本章节介绍 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc" target="_blank">monc</a> 的用法。

## 准备条件
1. <a href="/docs/tasks/mongo/connection" target="_blank">完成 mon 的链接创建。</a> 

## 创建链接对象
数据库的连接创建提供了五个方法。
1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L31" target="_blank">MustNewModel</a>
```golang
函数签名: 
    MustNewModel func(uri, db, collection string, c cache.CacheConf, opts ...cache.Option) *Model
说明: 
    1. 当 mongodb 连接创建存在问题时，会直接进退退出，输出错误日志。
    2. 当 db 和 collection 不存在时，会创建 db 和 collection。
入参:
    1. uri: mongodb uri 
    2. db: 数据库名
    3. collection: 集合名
    4. c: cache cluster config
    5. opts: WithExpiry 自定义过期时间，WithNotFoundExpiry 没有记录时，缓存空记录时间(防止缓存穿透)
返回值:
    1. *Model: 连接管理对象
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L41" target="_blank">MustNewNodeModel</a>
```golang
函数签名: 
    MustNewNodeModel func(uri, db, collection string, rds *redis.Redis, opts ...cache.Option) *Model
说明: 
    1. 当 mongodb 连接创建存在问题时，会直接进退退出，输出错误日志。
    2. 当 db 和 collection 不存在时，会创建 db 和 collection。
入参:
    1. uri: mongodb uri 
    2. db: 数据库名
    3. collection: 集合名
    4. rds: redis 链接对象
    5. opts: WithExpiry 自定义过期时间，WithNotFoundExpiry 没有记录时，缓存空记录时间(防止缓存穿透)
返回值:
    1. *Model: 连接管理对象
```

3. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L51" target="_blank">NewModel</a>
```golang
函数签名: 
    NewModel func(uri, db, collection string, conf cache.CacheConf, opts ...cache.Option) (*Model, error) 
说明: 
    1. 当 db 和 collection 不存在时，会创建 db 和 collection。
入参:
    1. uri: mongodb uri 
    2. db: 数据库名
    3. collection: 集合名
    4. c: cache cluster config
    5. opts: WithExpiry 自定义过期时间，WithNotFoundExpiry 没有记录时，缓存空记录时间(防止缓存穿透)
返回值:
    1. *Model: 连接管理对象
    2. error: 创建错误
```

4. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L62" target="_blank">NewNodeModel</a>
```golang
函数签名: 
    NewNodeModel func(uri, db, collection string, rds *redis.Redis, opts ...cache.Option) (*Model, error)
说明: 
    1. 当 db 和 collection 不存在时，会创建 db 和 collection。
入参:
    1. uri: mongodb uri 
    2. db: 数据库名
    3. collection: 集合名
    4. rds: redis 链接对象
    5. opts: WithExpiry 自定义过期时间，WithNotFoundExpiry 没有记录时，缓存空记录时间(防止缓存穿透)
返回值:
    1. *Model: 连接管理对象
    2. error: 创建错误
```

5. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L31" target="_blank">NewModelWithCache</a>
```golang
函数签名: 
    NewModelWithCache func(uri, db, collection string, c cache.Cache) (*Model, error)
说明: 
    1. 当 db 和 collection 不存在时，会创建 db 和 collection。
入参:
    1. uri: mongodb uri 
    2. db: 数据库名
    3. collection: 集合名
    4. c: 自定义 cache 实现
返回值:
    1. *Model: 连接管理对象
    2. error: 创建错误
```

## 新增
1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L174" target="_blank">InsertOne</a>
```golang
函数签名: 
    InsertOne func(ctx context.Context, key string, document interface{},
	opts ...*mopt.InsertOneOptions) (*mongo.InsertOneResult, error) 
说明: 
    1. 新增单条记录，新增同时会清理 key 缓存。
入参:
    1. ctx: context 
    2. key: 缓存 key
    3. document: 记录
    4. opts: 操作选项
返回值:
    1. *mongo.InsertOneResult: 新增结果，包含记录 _id 信息
    2. error: 操作结果
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L189" target="_blank">InsertOneNoCache</a>
```golang
函数签名: 
    InsertOneNoCache func(ctx context.Context, document interface{},
	opts ...*mopt.InsertOneOptions) (*mongo.InsertOneResult, error)
说明: 
    1. 新增单条记录，不会清理缓存。
入参:
    1. ctx: context 
    2. document: 记录
    3. opts: 操作选项
返回值:
    1. *mongo.InsertOneResult: 新增结果，包含记录 _id 信息
    2. error: 操作结果
```

## 更新
1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L221" target="_blank">UpdateByID</a>
```golang
函数签名: 
    UpdateByID func(ctx context.Context, key string, id, update interface{},
	opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error) 
说明: 
    1. 通过 _id 更新记录，同时会清理 key 缓存。
入参:
    1. ctx: context 
    2. key: 缓存 key
    3. id: 记录 _id
    4. update: 记录
    5. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含记录 _id 信息
    2. error: 操作结果
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L236" target="_blank">UpdateByIDNoCache</a>
```golang
函数签名: 
    UpdateByIDNoCache func(ctx context.Context, id, update interface{},
	opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error) 
说明: 
    1. 通过 _id 更新记录，不会清理缓存。
入参:
    1. ctx: context 
    3. id: 记录 _id
    3. update: 记录
    4. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含记录 _id 信息
    2. error: 操作结果
```

3. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L242" target="_blank">UpdateMany</a>
```golang
函数签名: 
    UpdateMany func(ctx context.Context, keys []string, filter, update interface{},
	opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)  
说明: 
    1. 更新多条记录，同时会清理 keys 缓存。
入参:
    1. ctx: context 
    2. keys: 缓存 key 列表
    3. filter: 过滤条件
    4. update: 记录
    5. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含记录 _id 信息
    2. error: 操作结果
```

4. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L257" target="_blank">UpdateManyNoCache</a>
```golang
函数签名: 
    UpdateManyNoCache func(ctx context.Context, filter, update interface{},
	opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
说明: 
    1. 通过 _id 更新记录，不会清理缓存。
入参:
    1. ctx: context 
    2. filter: 过滤条件
    3. update: 记录
    4. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含记录 _id 信息
    2. error: 操作结果
```

5. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L263" target="_blank">UpdateOne</a>
```golang
函数签名: 
    UpdateOne func(ctx context.Context, key string, filter, update interface{},
	opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
说明: 
    1. 更新单条记录，同时清理 key 缓存。
入参:
    1. ctx: context 
    2. key: 缓存 key
    3. filter: 过滤条件
    4. update: 记录
    5. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含记录 _id 信息
    2. error: 操作结果
```

6. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L221" target="_blank">UpdateOneNoCache</a>
```golang
函数签名: 
    UpdateOneNoCache func(ctx context.Context, filter, update interface{},
	opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
说明: 
    1. 更新单条记录，不会清理缓存。
入参:
    1. ctx: context 
    2. filter: 过滤条件
    3. update: 记录
    4. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含记录 _id 信息
    2. error: 操作结果
```

## 查询

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L107" target="_blank">FindOne</a>
```golang
函数签名: 
    FindOne func(ctx context.Context, key string, v, filter interface{},
	opts ...*mopt.FindOneOptions) error
说明: 
    1. 查询单条记录，优先通过缓存 key 查找，查不到会从数据库查找再插入缓存中，
    如果数据库也不存在会在缓存中插入空记录，防止缓存穿透。
入参:
    1. ctx: context 
    2. key: 缓存 key
    3. v: 查询记录结果
    4. filter: 查询条件
    5. opts: 操作选项
返回值:
    1. error: 操作结果
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L115" target="_blank">FindOneNoCache</a>
```golang
函数签名: 
    FindOneNoCache func(ctx context.Context, v, filter interface{},
	opts ...*mopt.FindOneOptions) error
说明: 
    1. 查询单条记录，不使用缓存。
入参:
    1. ctx: context 
    2. v: 查询记录结果
    3. filter: 查询条件
    4. opts: 操作选项
返回值:
    1. error: 操作结果
```

## 删除

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L86" target="_blank">DeleteOne</a>
```golang
函数签名: 
    DeleteOne func(ctx context.Context, key string, filter interface{},
	opts ...*mopt.DeleteOptions) (int64, error)
说明: 
    1. 删除单条记录，同时会清理 key 缓存
入参:
    1. ctx: context 
    2. key: 缓存 key
    3. filter: 查询条件
    4. opts: 操作选项
返回值:
    1. int64: 删除个数
    2. error: 操作结果
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L101" target="_blank">DeleteOneNoCache</a>
```golang
函数签名: 
    DeleteOneNoCache func(ctx context.Context, filter interface{},
	opts ...*mopt.DeleteOptions) (int64, error) 
说明: 
    1. 删除单条记录，同时会清理 key 缓存
入参:
    1. ctx: context 
    2. filter: 查询条件
    3. opts: 操作选项
返回值:
    1. int64: 删除个数
    2. error: 操作结果
```