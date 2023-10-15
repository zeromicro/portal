---
title: Cache Management
sidebar_label: Cache Management
slug: /docs/tutorials/mysql/cache
---

## Overview

go-zero, in addition to providing sqlx.SqlConn, we also provide a sqlc.CachedConn encapsulation support for sql database cache. We recommend the following code to be generated using [goctl model -c](/docs/tutorials/mysql/connection) without manual entry. Simple Example：

```go
cachedConn := sqlc.NewConn(conn, cacheConf)
var v User
err := cachedConn.QueryRowCtx(ctx, &v, "id:1", func(ctx context.Context, conn sqlx.SqlConn, v any) error {
    return conn.QueryRowCtx(ctx, v, "select * from user where id = ?", 1)
})
```

```note
sqlc only supports the primary key, unique single record index.Other batch queries are not supported.
```

## Create sqlc.CachedConn

### NewConnWithCache1

```go
func NewConn(db sqlx.SqlConn, c cache.CacheConf, opts ...cache.Option) CachedConn
```

We can create a CachedConn with the **NewConnWithCache** method, where db is the [SqlConn](/docs/tutorials/mysql/connection) in our sqlx, which needs to be created by the user.

cache.CacheConf for our built-in Cache. He supports multiple redis to form a cluster on our business that automatically assigns key to multiple redis instances

cache.Option supports extra settings for cache such as expiration time and unfound expiry time, cache.WithExpiry(time.Hour)

Option is currently supported with the following 2 signatures：

```go
cache.WithExpiry(time.Hour); // 设置过期时间一个小时，默认 7 * 24h。
cache.WithNotFoundExpiry(time.Second * 5); // 设置notfound 的过期时间，默认是 1 分钟。
```

### NewNodeConn

```go
func NewNodeConn(db sqlx.SqlConn, rds *redis.Redis, opts ...cache.Option) CachedConn
```

We can get into a redis, initialize our CachedConn.

### NewConnWithCache2

```go
func NewConnWithCache(db sqlx.SqlConn, c cache.Cache) CachedConn
```

We also support user customized caches, of course, only if cache.Cache interfaces are implemented by ourselves.

## QueryRowCtx

```go
func (cc CachedConn) QueryRowCtx(ctx context.Context, v any, key string, query QueryCtxFn)
```

Input：

- ctx: context
- v: any 用于接受查询到的数据，需要传入指针
- key: the cache key in string Redis will search data based on this key to the cache; it will also write the query to the key of this cache.
- query: QueryCtxFn real search method that will be executed if not in cache.

About QueryCtxFn Definition

```go
type QueryCtxFn func(ctx context.Context, conn sqlx.SqlConn, v any) 
```

Instructions： The main key query will automatically complete the read-cache reading, try QueryCtxFn query if the cache does not exist and then cache the results automatically into redis.

## QueryRowIndexCtx

```go
func (cc CachedConn) QueryRowIndexCtx(ctx context.Context, v any, key string,
    keyer func(primary any) string, indexQuery IndexQueryCtxFn,
    primaryQuery PrimaryQueryCtxFn) error
```

Input：

- ctx: context
- v: any 用于接受查询到的数据，需要传入指针
- key: the cache key in string Redis will search data based on this key to the cache; it will also write the query to the key of this cache.
- keyer: func needs to return the main key based on the object queried.
- indexQuery: IndexQueryCtxFn Query Method
- primaryQuery: PrimaryQueryCtxFn method of searching for the main key

## Update Cache

```go
func (cc CachedConn) ExecCtx(ctx context.Context, exec ExecCtxFn, keys ...string)
```

Input：

- ctx: context
- exec: ExecCtxFn true sql statement.
- keys: []string needs to delete the cache key

We need to update the cache in some CURD processes so we need to pass the corresponding key into and will automatically complete the cleanup.Example:

```go
_, err := cachedConn.ExecCtx(ctx, func(ctx context.Context, conn sqlx.SqlConn) (sql.Result, error) {
    return conn.ExecCtx(ctx, "delete from user where id = ?", 1)
}, "id:1")
```

## Self-manage Cache

```go
func (cc CachedConn) SetCacheCtx(ctx context.Context, key string, val any) error
func (cc CachedConn) DelCacheCtx(ctx context.Context, keys ...string) error

```

go-zero also provides two other methods that can operate directly on cache and can be easily managed by the user themselves.

## No cache actions

go-zero also provides a method that ends with NoCache and facilitates user operations that do not need to be cached.

```go
func (cc CachedConn) QueryRowNoCache(v any, q string, args ...any) error
```
