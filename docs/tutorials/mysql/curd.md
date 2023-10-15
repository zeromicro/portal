---
title: 基本 CURD 
sidebar_label: 基本 CURD
slug: /docs/tutorials/mysql/curd
---

## 概述
在我们通过[创建链接](/docs/tutorials/mysql/connection)可以获得一个 sqlx.SqlConn，接着我们就可以完成各种数据库操作。
我们强烈建议使用 [goctl model](/docs/tutorials/cli/model) 自动生成 sql 代码，无需手动录入。

SqlConn 基本的方法如下
```go
type (
    // SqlConn only stands for raw connections, so Transact method can be called.
	SqlConn interface {
		Session
		// RawDB is for other ORM to operate with, use it with caution.
		// Notice: don't close it.
		RawDB() (*sql.DB, error)
		Transact(fn func(Session) error) error
		TransactCtx(ctx context.Context, fn func(context.Context, Session) error) error
	}

	// StmtSession interface represents a session that can be used to execute statements.
	StmtSession interface {
		Close() error
		Exec(args ...any) (sql.Result, error)
		ExecCtx(ctx context.Context, args ...any) (sql.Result, error)
		QueryRow(v any, args ...any) error
		QueryRowCtx(ctx context.Context, v any, args ...any) error
		QueryRowPartial(v any, args ...any) error
		QueryRowPartialCtx(ctx context.Context, v any, args ...any) error
		QueryRows(v any, args ...any) error
		QueryRowsCtx(ctx context.Context, v any, args ...any) error
		QueryRowsPartial(v any, args ...any) error
		QueryRowsPartialCtx(ctx context.Context, v any, args ...any) error
	}
)
```

## ExecCtx
我们提供了 **ExecCtx** 方法来完成各种增删改的操作。
简单示例：

```go
var conn sqlx.SqlConn // should be created by NewConn
r, err := conn.ExecCtx(context.Background(), "delete from user where `id` = ?", 1)
```

一般我们用于输入的参数都是使用 ？ 占位，接着通过 args 传入，这样可以有效防止 sql 注入等问题。

本个方法如果执行的sql 出现错误，也将会触发熔断。并且会有一定机制在服务恢复正常之后自动放行。详情见熔断。

## QueryRowCtx
我们提供了 **QueryRowCtx** 进行普通的查询操作，
简单示例：

```go

type User struct {
	Id   int64  `db:"id"`
	Name string `db:"name"`
}

var conn sqlx.SqlConn
var u User
err := conn.QueryRowCtx(context.Background(), &u, "select id, name from user where id = ? limit 1", 1)
if err != nil {
	fmt.Println(err)
	return
}
_ = u
```

这样我们就可以从 user 表中查出 id 为 1 的数据。相关常见的错误可以见下方 **常见错误**

## QueryRowPartialCtx
QueryRowPartialCtx 其实和 QueryRowCtx 都是提供用户查询数据使用的。
但是我们为了保证 User 中定义的所有字段都能过准确的被查询处理，所以设计 QueryRowCtx 的时候，强制校验查询出来的列需要与定义的 field 一致。
例如如下定义和Sql会报错。
```go
type User struct {
	Id   int64  `db:"id"`
	Name string `db:"name"`
    Age int `db:"age"`
}

var conn sqlx.SqlConn
var u User
err := conn.QueryRowCtx(context.Background(), &u, "select id, name from user where id = ? limit 1", 1)
if err != nil { // err == ErrNotMatchDestination
	fmt.Println(err) // not matching destination to scan
	return
}
```
因为我们定义的 age ，并没有在 sql 中查询出来，会导致变量不一致的情况。如果用户确实有宽表，只需要查询部分字段，我们提供了 **QueryRowPartialCtx** 进行查询，这个方法即使查询的列不够也不会报错。

```go
type User struct {
	Id   int64  `db:"id"`
	Name string `db:"name"`
    Age int `db:"age"`
}

var conn sqlx.SqlConn
var u User
err := conn.QueryRowPartialCtx(context.Background(), &u, "select id, name from user where id = ? limit 1", 1)
if err != nil { // err == nil
	fmt.Println(err) 
	return
}
_ = u // age is default 0
```

## QueryRowsCtx
我们也提供了 **QueryRowsCtx** 进行批量查询的语句，
简单示例：

```go
type User struct {
	Id   int64  `db:"id"`
	Name string `db:"name"`
}

var conn sqlx.SqlConn
var users []*User
err := conn.QueryRowsCtx(context.Background(), &users, "select id, name from user where name = ?", "dylan")
if err != nil {
	fmt.Println(err)
	return
}
_ = users
```
这样我们就可以查询所有叫 dylan 的 users。注意当数据库中没有 user 的时候，我们是不会返回 ErrNotFound 的，这块和 QueryRowCtx 是不同的。


## 常见的错误
在我们执行 sql 语句中一些常见的错误如下：

```go
var (
	// ErrNotMatchDestination is an error that indicates not matching destination to scan.
	ErrNotMatchDestination = errors.New("not matching destination to scan")
	// ErrNotReadableValue is an error that indicates value is not addressable or interfaceable.
	ErrNotReadableValue = errors.New("value not addressable or interfaceable")
	// ErrNotSettable is an error that indicates the passed in variable is not settable.
	ErrNotSettable = errors.New("passed in variable is not settable")
	// ErrUnsupportedValueType is an error that indicates unsupported unmarshal type.
	ErrUnsupportedValueType = errors.New("unsupported unmarshal type")

    ErrNotFound = sql.ErrNoRows
)
```

当然还有包括 sql 底层网络错误，这里不在列举。