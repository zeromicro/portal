---
title: 批量插入
sidebar_label: 批量插入
slug: /docs/tutorials/mysql/bulk/insert
---

## Overview
go-zero 提供了一个简单批量插入的封装，他的使用场景是例如有大量的日志需要批量写入，不用关心结果的时候可以使用本方式。

简单实例：
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
BulkInserter 目前的逻辑将会在收集到 1000 个记录或者每个1秒进行一次落库操作。

BulkInserter 是基于 [executors.PeriodicalExecutor](https://github.com/zeromicro/go-zero/blob/master/core/executors/periodicalexecutor.go) 实现的，他会在收集到足够数据的记录的时候或者满足一定时长的时候写入数据，同时他的写入是异步操作，错误的结果只能够通过回调进行处理。

## 创建 BulkInserter
我们通过 **sqlx.NewBulkInserter** 创建 BulkInserter，他需要一个 sqlx.SqlConn 和一个插入 sql 语句。

```go
func NewBulkInserter(sqlConn SqlConn, stmt string) (*BulkInserter, error)
```

## 插入数据
```go
func (bi *BulkInserter) Insert(args ...any) error
```
注意其中 args，为 insert 中的每个参数，需要和 ？ 一一对应。同时因为 Insert 其实是一个异步操作，这个地方不会有插入 error 返回。

## flushes
因为的插入其实是一个异步过程，如果我们有业务需要立即入库或者程序即将退出，我们需要手动 flush 一下。框架已经在 **PeriodicalExecutor** 添加了 **proc.AddShutdownListener**。所以无需关心退出时的操作，只需要在业务需要的时候自己调用flush。
```go
blk.Flush()
```

## 设置结果回调
如果我们有业务需要关注每次批量插入的结果，因为我们的插入是异步行为，所以我们需要手动设置结果回调。
```go
blk.SetResultHandler(func(result sql.Result, err error) {
    if err != nil {
        logx.Error(err)
        return
    }
    fmt.Println(result.RowsAffected())
})
```
