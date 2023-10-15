---
title: mongo Database Operations
slug: /docs/tasks/mongo/connection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Create a valid monodb database connection via monodb uri.

## Preparing

1 <a href="/docs/tasks" target="_blank">Complete golang installation</a>
2 Create a mono server on our own and we use mongodb/admin:123456@localhost as an example

## Toolkit Description

go-zero contains two mongodb toolkits, <a href="https://github.com/zeromicro/go-zero/tree/master/core/stores/mongo" target="_blank">mono</a> are deprecated, no longer supports maintenance, and <a href="https://github.com/zeromicro/go-zero/tree/master/core/stores/mon" target="_blank">mon</a> is recommended.

All presentations for this section are based on <a href="https://github.com/zeromicro/go-zero/tree/master/core/stores/mon" target="_blank">mon</a> toolkits.

We also recommend using [byctl](/docs/tasks/cli/mongo) to generate mono models for business development.

## Create Database Connection

Database connection creation provides two methods,<a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L40" target="_blank">MostNewModel</a> and <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L50" target="_blank">NewModel</a>.

## Methodological description

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L40" target="_blank">MustNewModel</a>

```golang
Function signature: 
    MustaNewModel function (uri, db, collection string, opts, ..Option) *Model 
description: 
    1. Exit log out directly when monodb links create problems.
    2. Create db and collection when db and collection do not exist.
Input:
    1. uri: mongodb uri (example: monodb:/<user>:<password>@<host>:<port>)
    2. db: Database name
    3. collection: collection name
return value:
    1. *Model: Connection management object
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L50" target="_blank">NewModel</a>

```golang
Function signature: 
    NewModel func(uri, db, collection string, opts ..Option) (*Model, error)
description: 
    1. When db and collection do not exist, db and collection will be created.
Input:
    1. uri: monodb uri (example: mongodb://<user>:<password>@<host>:<port>)
    db: Database name
    3. collection: collection name
Return value:
    1. *Model: Connect to manage object
    2. error: Create error
```

Code Example

```go
conn := mon.MustNewModel("mongodb://<user>:<password>@<host>:<port>", "db", "collection")
```

## References

- <a href="/docs/tutorials/cli/model#goctl-model-mongo-%E6%8C%87%E4%BB%A4" target="_blank">goctl model mono code generation </a>
