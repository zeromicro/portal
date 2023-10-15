---
title: Database connection
sidebar_label: Database connection
slug: /docs/tutorials/mongo/connection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This section describes the use of the option to create a link

## Preparing

1. <a href="/docs/tasks/mongo/connection" target="_blank">Complete mongo connection</a>

## <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L99" target="_blank">WithTimeout</a>

Sets the timeout of the mongo operation.

### Example

```golang

func NewUserModel(url, db, collection string) UserModel {
    conn := mon.MustNewModel(url, db, collection, mon.WithTimeout(time.Second))
    return &customUserModel{
        defaultUserModel: newDefaultUserModel(conn),
    }
}
```
