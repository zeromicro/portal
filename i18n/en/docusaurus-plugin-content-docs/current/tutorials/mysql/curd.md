---
title: Basic CURD
sidebar_label: Basic CURD
slug: /docs/tutorials/mysql/curd
---

## Overview

We can get a sqlx.SqlConn at [to create a link](/docs/tutorials/mysql/connection) and then we can complete various database operations. We strongly recommend using [goctl model](/docs/tutorials/cli/model) to generate sql code automatically, without manual entry.

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

We have provided **ExecCtx** methods to complete various additions and deletions. Simple Example：

```go
var conn sqlx.SqlConn // should be created by NewConn
r, err := conn.ExecCtx(context.Background(), "delete from user where `id` = ?", 1)
```

Normally we use the input parameters placeholder ? 占位，接着通过 args 传入，这样可以有效防止 sql 注入等问题。

This method will also trigger melting if an error occurs with the sql executed.There is also a mechanism for automatic release once the service has returned to normal.See melting for details.

## QueryRowCtx

We provided **QueryRowCtx** for normal query, Simple Example：

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

This way we can use data from user tables that you have provided with an account id 1.Common errors can be found below **common errors**

## QueryRowPartialCtx

Both QueryRowPartialCtx and QueryRowCtx provide user queries for data use. But in order to ensure that all fields defined in the User are processed with accuracy, so when QueryRowCtx is designed, the queryVerify QueryRowCtx list needs to match the defined field. For example, the definition and Sql report errors.

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

Because our defined age is not queried in sql, this will cause inconsistency in variables.If the user does have a wide table, only some fields need to be queried. We provided  **QueryRowPartialCtx** this method is not enough for a list of timely queries.

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

We also provided **QueryRowsCtx** for bulk queryRowsCt, Simple Example：

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

This will make it possible to find all users named dylan.Note that we will not return ErrNotFound when there is no user in the database, this block is different from QueryRowCtx.

## Common Errors

Some common errors in our sql statements below：

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

There is, of course, a network error including sql bottom, not listing.
