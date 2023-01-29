---
title: 基本 CURD 
sidebar_label: 基本 CURD
slug: /docs/tutorials/mysql/curd
---

## 概述
在我们通过[创建链接](/docs/tutorials/mysql/connection)可以获得一个 sqlx.SqlConn，接着我们就可以完成各种数据库操作。

## CURD
我们提供了 **ExecCtx** 方法来完成各种 CURD 操作，简单示例：

```go
var conn sqlx.SqlConn // should be created by NewConn
r, err := conn.ExecCtx(context.Background(), "delete from user where `id` = ?", 1)
```

一般我们用于输入的参数都是使用 ？ 占位，接着通过 args 传人，这样可以有效防止 sql 注入等问题。

本个方法如果执行的sql 出现错误，也将会触发熔断操作。并且会有一定机制在服务恢复正常之后自动放行。