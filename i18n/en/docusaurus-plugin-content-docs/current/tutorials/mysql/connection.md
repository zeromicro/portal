---
title: Database connection
sidebar_label: Database connection
slug: /docs/tutorials/mysql/connection
---

## Overview

go-zero provides a powerful sqlx tool to operate the database. Packages for all SQL related operations in **github.com/zeroicro/go-zero/core/stores/sqlx**

## Create DB Connection

### mysql

We provide a quick way to create MySQL links that are now available at https://github.com/zeromicro/go-zero/blob/master/core/stores/sqlx/mysql.go#L11

```go
func NewMysql(datasource string, opts ...SqlOption) SqlConn
```

A database address needs to be imported. The data address format can be found at https://github.com/go-sql-driver/mysql#dsn-data-source-name for details.

### Custom driver

The purpose of the Go-database drive is to achieve universal access to the database that allows developers to operate different types of databases through the same APIs.The advantage of doing this is that it has been achieved by the prime minister：

1. The database drives the abstraction of the details of the underlying database, provides a unified programming interface and simplifies the work of the programmers.

2. Database drivers can support multiple types of databases, allowing developers the flexibility to select and use databases that are appropriate to their own, without having to pay attention to the details of specific databases.

3. By database driving, developers can implement customized database connections, services, statements, etc. to meet the needs of different scenarios.

In summary, the go-design database driver was originally intended to improve development efficiency and code replicability, reduce development costs and provide more flexible access to databases with guaranteed performance. Details can be found in： https://golang.org/s/sqlrivers

go-zero also provides a custom driver, based on bottom packing of database/sql/driver.

```go
func NewSqlConn(driverName, datasource string, opts ...SqlOption) SqlConn 
```

The driver name and link address are required.Note, drivers need to inject themselves. Example:

```go
sql.Register("clickhouse", &stdDriver{})
```

当然大部分框架已经实现了自动注入，只需要 import 一下就行， 例如

``` go
import _ "github.com/go-sql-driver/mysql"
```

### Existing database connection

go-zero can initialize sqlx.SqlConn through an existing database

```go
func NewSqlConnFromDB(db *sql.DB, opts ...SqlOption) SqlConn
```
