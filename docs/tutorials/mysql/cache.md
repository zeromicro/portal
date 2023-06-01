---
title: 缓存管理
sidebar_label: 缓存管理
slug: /docs/tutorials/mysql/cache
---

## 概述
go-zero 除了提供 sqlx.SqlConn, 我们也提供了一个 sqlc.CachedConn 的封装，用于sql 数据库缓存的支持，我们建议如下代码使用 [goctl model -c](/docs/tutorials/mysql/connection) 进行生成，无需手动录入。
简单实例如下：
```go
cachedConn := sqlc.NewConn(conn, cacheConf)
var v User
err := cachedConn.QueryRowCtx(ctx, &v, "id:1", func(ctx context.Context, conn sqlx.SqlConn, v any) error {
	return conn.QueryRowCtx(ctx, v, "select * from user where id = ?", 1)
})
```

```note 
sqlc 只支持主键，唯一键的单条记录索引方式。其他批量查询的方式不支持。
```

## 创建 sqlc.CachedConn
### NewConnWithCache
```go
func NewConn(db sqlx.SqlConn, c cache.CacheConf, opts ...cache.Option) CachedConn
```
我们可以通过**NewConnWithCache** 方法创建一个 CachedConn，其中 db 就是我们sqlx中的 [SqlConn](/docs/tutorials/mysql/connection)，需要用户自行创建。

cache.CacheConf 为我们内置Cache的配置，他支持多个 redis 组成一个我们业务上面的集群，我们会自动将key 分配到多个 redis 实例上面

cache.Option 支持对 cache 进行额外设置，例如对过期时间和未找到的过期时间进行设置， cache.WithExpiry(time.Hour)

目前支持的 cache.Option 有如下的2个签名：
```go
cache.WithExpiry(time.Hour); // 设置过期时间一个小时，默认 7 * 24h。
cache.WithNotFoundExpiry(time.Second * 5); // 设置notfound 的过期时间，默认是 1 分钟。
```


### NewNodeConn
```go
func NewNodeConn(db sqlx.SqlConn, rds *redis.Redis, opts ...cache.Option) CachedConn
```
我们可以直接传入一个 redis，初始化我们的 CachedConn。

### NewConnWithCache
```go
func NewConnWithCache(db sqlx.SqlConn, c cache.Cache) CachedConn
```
当然我们也支持用户自定义的缓存，只需要自行实现 cache.Cache 接口即可。

## 主键查找
```go
func (cc CachedConn) QueryRowCtx(ctx context.Context, v any, key string, query QueryCtxFn)
```
入参说明：
- ctx: context
- v: any 用于接受查询到的数据，需要传入指针
- key: string redis 中的缓存key，会根据这个key到缓存中查询数据；也会将查询到的数据写入到这个缓存的key 中。
- query: QueryCtxFn 真实的查询方式，如果缓存中没有，将会执行这个查询方式。

关于 QueryCtxFn 定义
```go
type QueryCtxFn func(ctx context.Context, conn sqlx.SqlConn, v any) 
```

说明：
主键查询将会自动完成redis缓存的读取，如果缓存中不存在则会尝试 QueryCtxFn 查询，接着在将结果自动缓存到redis中。

## 唯一键所有查询
```go
func (cc CachedConn) QueryRowIndexCtx(ctx context.Context, v any, key string,
	keyer func(primary any) string, indexQuery IndexQueryCtxFn,
	primaryQuery PrimaryQueryCtxFn) error
```
入参说明：
- ctx: context
- v: any 用于接受查询到的数据，需要传入指针
- key: string redis 中的缓存key，会根据这个key到缓存中查询数据；也会将查询到的数据写入到这个缓存的key 中。
- keyer: func 需要根据查询到的对象返回对应的主键。
- indexQuery: IndexQueryCtxFn 索引查询方法
- primaryQuery: PrimaryQueryCtxFn 更加主键查询的方法

## 更新缓存

```go
func (cc CachedConn) ExecCtx(ctx context.Context, exec ExecCtxFn, keys ...string)
```
入参说明：
- ctx: context
- exec: ExecCtxFn 真正的 sql 语句。
- keys: []string 需要删除缓存key

我们在一些 CURD 的过程中需要更新缓存，就需要将对应的key传入，会自动完成redis 清理。示例:
```go
_, err := cachedConn.ExecCtx(ctx, func(ctx context.Context, conn sqlx.SqlConn) (sql.Result, error) {
	return conn.ExecCtx(ctx, "delete from user where id = ?", 1)
}, "id:1")
```

## 自行管理缓存
```go
func (cc CachedConn) SetCacheCtx(ctx context.Context, key string, val any) error
func (cc CachedConn) DelCacheCtx(ctx context.Context, keys ...string) error

```

go-zero 也提供另外2个方法可以直接对 cache 进行操作，方便用户自行管理。

## 无缓存操作
go-zero 也提供了以 NoCache 结尾的方法，方便用户无需缓存的操作。
```go
func (cc CachedConn) QueryRowNoCache(v any, q string, args ...any) error
```
