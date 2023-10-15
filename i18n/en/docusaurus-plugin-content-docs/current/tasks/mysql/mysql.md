---
title: MySQL database operations
slug: /docs/tasks/mysql
---

## Overview

Database usage, we generally recommend direct model code using goctl, and automatic golang structure, CURD operation, cache, etc. can be referenced <a href="/docs/tasks/cli/mysql" target="_blank">goctl model</a>.

But we can also initialize sql conn directly, if a particular situation requires direct links to the database.

## Task Targets

1. Learn about the use of **github.com/zeroicro/go-zero/core/stores/sqlx**.
2. Create a sql link from sqlx.

## Create Database

First create tables in the database as follows.

```sql
CREATE TABLE user (
    id bigint AUTO_INCREMENT,
    name varchar(255) NOT NULL DEFAULT '' COMMENT 'The username',
    type tinyint(1) NULL DEFAULT 0 COMMENT 'The user type, 0:normal,1:vip, for test golang keyword',
    create_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB COLLATE utf8mb4_general_ci COMMENT 'user table';
```

## Connect to database

1. Mysql

```go
package main

import (
    "github.com/zeroicro/go-zero/core/stores/sqlx"
)

func main()
    // reference https://github. om/go-sql-driver/mysql#dsn-data-source-name for details
    // Require yourself to host in dsn, password configured correct
    dsn := "user:pass@tcp(127.0.0. :3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    conn := sqlx.NewMysql(dsn)
    _= conn
}

```

::note
In order to correctly process time.Time you need to take the time parameter, [more parameters](https://github.com/go-sql-driver/mysql#parameters) To support the full UTF-8 encoding, you need to change charset=utf8 to charset=utf8mb4
:::

2. Custom driver

go-zero allows to customize MySQL drivers with the DriverName option, eg:：

```go
package main

import (
    "github.com/zeromicro/go-zero/core/stores/sqlx"
)

func main() {
    dsn := "user:pass@tcp(127.0.0.1:3307)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    conn := sqlx.NewSqlConn("mysql", dsn)
    _ = conn
}

```

3. Existing database connection

go-zero is allowed to initialize Sql links through existing databases, e.g.：

```go
package main

import (
    "database/sql"
    "github.com/zeromicro/go-zero/core/stores/sqlx"
)

func main() {
    sqlDB, err := sql.Open("mysql", "mydb_dsn")
    if err != nil {
        panic(err)
    }
    conn := sqlx.NewSqlConnFromDB(sqlDB)
    _ = conn
}

```

## Start CRUD

1. Insert a data

We can start operating the database when we get a link using the above method of creating the link.

```go
package main

import (
    "context"
    "fmt"
    "github.com/zeromicro/go-zero/core/stores/sqlx"
)

func main() {
    // Refer to https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
    // You need to configure the host, account and password in the dsn correctly
    dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    conn := sqlx.NewMysql(dsn)

    r, err := conn.ExecCtx(context.Background(), "insert into user (type, name) values (?, ?)", 1, "test")
    if err != nil {
        panic(err)
    }
    fmt.Println(r.RowsAffected())
}

```

Execute, we'll insert a record in the user.

2. Query data

We need to define a user structure before searching directly

```go
package main

import (
    "context"
    "database/sql"
    "time"

    "github.com/zeromicro/go-zero/core/stores/sqlx"
)

type User struct {
    Id       int64          `db:"id"`
    Name     sql.NullString `db:"name"` // The username
    Type     int64          `db:"type"` // The user type, 0:normal,1:vip, for test golang keyword
    CreateAt sql.NullTime   `db:"create_at"`
    UpdateAt time.Time      `db:"update_at"`
}

func main() {
    // Refer to https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
    // You need to configure the host, account and password in the dsn correctly
    dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    conn := sqlx.NewMysql(dsn)

    var u User
    query := "select id, name, type, create_at, update_at from user where id=?"
    err := conn.QueryRowCtx(context.Background(), &u, query, 1)
    if err != nil {
        panic(err)
    }
}

```

Execute the above program, we will see user information we just inserted into

3. Modify the data we continue to use the custom code

```go
package main

import (
    "context"
    "fmt"

    "github.com/zeromicro/go-zero/core/stores/sqlx"
)

func main() {
    // Refer to https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
    // You need to configure the host, account and password in the dsn correctly
    dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    conn := sqlx.NewMysql(dsn)

    _, err := conn.ExecCtx(context.Background(), "update user set type = ? where name = ?", 2, "test")
    if err != nil {
        fmt.Println(err)
        return
    }
}

```

Run the above code to find the record type in the database to 2.

4. Data deletion

```go
package main

import (
    "context"
    "fmt"

    "github.com/zeromicro/go-zero/core/stores/sqlx"
)

func main() {
    // Refer to https://github.com/go-sql-driver/mysql#dsn-data-source-name for details
    // You need to configure the host, account and password in the dsn correctly
    dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    conn := sqlx.NewMysql(dsn)

    _, err := conn.ExecCtx(context.Background(), "delete from user where `id` = ?", 1)
    if err != nil {
        fmt.Println(err)
        return
    }
}

```

Run the above code to find that records in the database have been deleted.

To this point, you have completed the basic use of the mysql database.

## References

- <a href="/docs/tutorials/cli/model#goctl-model-mysql-%E6%8C%87%E4%BB%A4" target="_blank">Goctl model mysql Code Generated </a>
