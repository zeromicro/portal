---
title: 数据库连接 
sidebar_label: 数据库连接
slug: /docs/tutorials/mysql/connection
---

## 概述

go-zero 提供了一个强大的 sqlx 工具，用于操作数据库。
所有 SQL 相关操作的包在 **github.com/zeromicro/go-zero/core/stores/sqlx**

## 创建链接

### mysql

我们提供了一个快捷的方式可以创建 Mysql 链接，具体实现在 <https://github.com/zeromicro/go-zero/blob/master/core/stores/sqlx/mysql.go#L11>

```go
func NewMysql(datasource string, opts ...SqlOption) SqlConn
```

需要传入数据库地址，数据地址格式可以参考 <https://github.com/go-sql-driver/mysql#dsn-data-source-name> 获取详情。

### 自定义驱动

Go数据库驱动的目的是为了实现数据库的通用访问方式，使得开发人员可以通过相同的API对不同类型的数据库进行操作。这样做的好处有以下几点：

1. 数据库驱动抽象了底层数据库的细节，提供了一种统一的编程接口，简化了程序员的工作。

2. 数据库驱动可以支持多种类型的数据库，使得开发人员可以灵活地选择和使用适合自己的数据库，而无需关心具体的数据库实现细节。

3. 通过数据库驱动，开发人员可以实现自定义的数据库连接、事务、语句等操作，以满足不同场景下的需求。

总之，Go设计数据库驱动的初衷是为了提高开发效率和代码可复用性，降低开发成本，并且在保证性能的前提下提供更加灵活的数据库访问方式。
具体详情可以参考： <https://golang.org/s/sqldrivers>

go-zero 也提供了自定义驱动的方式， 基于底层对 database/sql/driver 的包装。

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
