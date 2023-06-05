---
title: Bulk insert
sidebar_label: Bulk insert
slug: /docs/tutorials/mysql/bulk/insert
---

## Overview
go-zero provides a simple bulk encapsulation that uses the scenario where, for example, there is a large number of logs that require bulk writing and can be used without attention to results.

Simple Example：
```go
    var conn sqlx.SqlConn
    blk, err := sqlx.NewBulkInserter(conn, "insert into user (id, name) values (?, ?)")
    if err != nil {
        panic(err)
    }
    defer blk.Flush()
    blk.Insert(1, "test1")
    blk.Insert(2, "test2")
```
BulkInserter current logic will collect 1000 records or perform library operations at one time per sec.

The BulkInserter is based on [ executors.PeriodicalExecutor](https://github.com/zeromicro/go-zero/blob/master/core/executors/periodicalexecutor.go) and will write the data when collecting enough data or when it meets a certain period of time, while his writing is asynchronous and the result can only be processed by callbacks.

## Create BulkInserter
We created BulkInserter with **sqlx.NewBulkInserter** who needs a sqlx.SqlConn and an insert sql statement.

```go
func NewBulkInserter(sqlConn SqlConn, stmt string) (*BulkInserter, error)
```

## Insert data
```go
func (bi *BulkInserter) Insert(args ...any) error
```
Be aware of args, for each parameter in insert, need and ? A counterpart.Also because Insert is an asynchronous operation, there will be no inserts back in this place.

## flushes
Because insertion is an asynchronous process, if we have an immediate library or the program is about to exit, we need to manually flush it out.The framework has been added **PeriodicalExecutor** to **pro.AddShutdown Listener**.So there is no need to be interested in quitting operations and simply call flush on your own when the business needs it.
```go
blk.Flush()
```

## Set Result Callback
If we have a business that needs to follow the results of each batch insertion, because our insertion is asynchronous, we need to set the results back manually.
```go
blk.SetResultHandler(func(result sql.Result, err error) {
    if err != nil {
        logx.Error(err)
        return
    }
    fmt.Println(result.RowsAffected())
})
```
