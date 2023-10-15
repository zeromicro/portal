---
title: Local transaction
sidebar_label: Local transaction
slug: /docs/tutorials/mysql/local/transaction
---

## Overview
sqlx.SqlConn provides the basic service mechanism, simple instance：
```go
    var conn sqlx.SqlConn
    err := conn.TransactCtx(context.Background(), func(ctx context.Context, session sqlx.Session) error {
        r, err := session.ExecCtx(ctx, "insert into user (id, name) values (?, ?)", 1, "test")
        if err != nil {
            return err
        }
        r ,err =session.ExecCtx(ctx, "insert into user (id, name) values (?, ?)", 2, "test")
        if err != nil {
            return err
        }
    })
```

