---
title: 数据库连接 
sidebar_label: 数据库连接
slug: /docs/tutorials/mysql/connection
---

## 概述
go-zero 提供了一个强大的 sqlx 工具，用于操作数据库。

## 创建链接
### mysql
我们提供了一个快捷的方式可以创建 Mysql 链接， 
```go
func NewMysql(datasource string, opts ...SqlOption) SqlConn
```
需要传入数据库地址，数据地址格式可以参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情。

### 自定义驱动
同时我们也提供了自定义驱动的方式
```go
func NewSqlConn(driverName, datasource string, opts ...SqlOption) SqlConn 
```
需要传入驱动名称和链接地址。注意，驱动需要自行注入进来。
例如：
```go
sql.Register("clickhouse", &stdDriver{})
```

当然大部分框架已经实现了自动注入，只需要 import 一下就行， 例如

``` go
import _ "github.com/go-sql-driver/mysql"
```

### 现有的数据库连接
go-zero 可以通过一个现有的数据库来初始化 sqlx.SqlConn
```go
func NewSqlConnFromDB(db *sql.DB, opts ...SqlOption) SqlConn
```
