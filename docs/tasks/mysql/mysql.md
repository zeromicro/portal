---
title: MySQL 数据库操作
slug:  /docs/tasks/mysql
---

## 概述

数据库的相关使用, 我们一般推荐使用 goctl 直接生成 model 代码，同时会自动生成 golang 结构体，CURD操作方法，缓存等，可以参考 <a href="/docs/tasks/cli/mysql" target="_blank">goctl model</a>。

但是针对特殊情况需要自行直接链接数据库的，我们也可以直接自己初始化 sql conn。

## 任务目标

1. 了解 **github.com/zeromicro/go-zero/core/stores/sqlx** 包的使用。
2. 根据 sqlx 创建一个 sql 链接。

## 创建数据库

首先在的数据库中创建如下的表。

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

## 连接到数据库

1. Mysql

 ```go
	package main

	import (
		"github.com/zeromicro/go-zero/core/stores/sqlx"
	)

	func main() {
		// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
		// 需要自行将 dsn 中的 host，账号 密码配置正确
		dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
		conn := sqlx.NewMysql(dsn)
		_ = conn
	}

	```

	:::note 注意
	想要正确的处理 time.Time ，您需要带上 parseTime 参数， [更多参数](https://github.com/go-sql-driver/mysql#parameters) 要支持完整的 UTF-8 编码，您需要将 charset=utf8 更改为 charset=utf8mb4
	:::

2. 自定义驱动

	go-zero 允许通过 DriverName 选项自定义 MySQL 驱动，例如：

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

3. 现有的数据库连接

go-zero 允许通过 现有的数据库初始化 Sql 链接，例如：

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

## 开始 CRUD

1. 插入一条数据

 我们使用上面的创建链接的方法得到一个链接之后，我们可以开始操作数据库。

```go
	package main

	import (
		"context"
		"fmt"
		"github.com/zeromicro/go-zero/core/stores/sqlx"
	)

	func main() {
		// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
		// 需要自行确保 dsn 中的 host 账号 密码都配置正确
		dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
		conn := sqlx.NewMysql(dsn)

		r, err := conn.ExecCtx(context.Background(), "insert into user (type, name) values (?, ?)", 1, "test")
		if err != nil {
			panic(err)
		}
		fmt.Println(r.RowsAffected())
	}

    ```

	执行程序，我们会在user 中插入一条记录。

2. 查询数据

	我们需要先定义一个 User 结构体，接着再查询

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
		// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
		// 需要自行确保 dsn 中的 host 账号 密码都配置正确
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

	执行上述程序，我们会看到 我们刚刚插入进去的 user 信息

3. 修改数据 我们继续修改代码

	```go
	package main

	import (
		"context"
		"fmt"

		"github.com/zeromicro/go-zero/core/stores/sqlx"
	)

	func main() {
		// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
		// 需要自行确保 dsn 中的 host 账号 密码都配置正确
		dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
		conn := sqlx.NewMysql(dsn)

		_, err := conn.ExecCtx(context.Background(), "update user set type = ? where name = ?", 2, "test")
		if err != nil {
			fmt.Println(err)
			return
		}
	}

	```

	运行上述代码，会发现数据库中的记录 type 变为 2了。

4. 删除数据

	```go
	package main

	import (
		"context"
		"fmt"

		"github.com/zeromicro/go-zero/core/stores/sqlx"
	)

	func main() {
		// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
		// 需要自行确保 dsn 中的 host 账号 密码都配置正确
		dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
		conn := sqlx.NewMysql(dsn)

		_, err := conn.ExecCtx(context.Background(), "delete from user where `id` = ?", 1)
		if err != nil {
			fmt.Println(err)
			return
		}
	}

	```

运行上述代码，会发现数据库中的记录已经被删除了。

至此，你已经完成 mysql 数据库的基本使用。

## 参考文献

- <a href="/docs/tutorials/cli/model#goctl-model-mysql-%E6%8C%87%E4%BB%A4" target="_blank">《goctl model mysql 代码生成》 </a>
