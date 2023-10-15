---
title: Cache Management
sidebar_label: Cache Management
slug: /docs/tutorials/mongo/cache
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This section introduces the usage of <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc" target="_blank">monc</a>.

## Preparing

1. <a href="/docs/tasks/mongo/connection" target="_blank">Complete mongo connection</a>

## Create connection

Connection creation of the database provides five methods.

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L31" target="_blank">MustNewModel</a>

```golang
Function signature: 
    MustNewModel func(uri, db, collection string, c cache.CacheConf, opts ...cache.Option) *Model
description: 
    1. Exit log out directly when monodb links create problems.
    2. Create db and collection when db and collection do not exist.
inputs:
    1. uri: mongodb uri 
    2. db: the database name
    3. collection: the collection name
    4. c: cache cluster config
    5. opts: WithExpiry the expiry，WithNotFoundExpiry Cache empty record time when there is no record (prevent cache pass-through)
returns:
    1. *Model: coonection object
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L41" target="_blank">MustNewNodeModel</a>

```golang
Function signature: 
     MustNewNodeModel func(uri, db, collection string, rds *redis.Redis, opts ...cache.Option) *Model
description: 
    1. Exit log out directly when monodb links create problems.
    2. Create db and collection when db and collection do not exist.
inputs:
    1. uri: mongodb uri 
    2. db: the database name
    3. collection: the collection name
    4. rds: redis connection
    5. opts: WithExpiry Custom expiration time, WithNotFoundExpiry Cache empty record time when there is no record (prevent cache penetration)
retruns:
    1. *Model: connection object
```

3 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L51" target="_blank">NewModel</a>

```golang
Function signature: 
     NewModel func(uri, db, collection string, conf cache.CacheConf, opts ...cache.Option) (*Model, error) 
description: 
    1. When db and collection do not exist, db and collection will be created.
inputs:
    1. uri: mongodb uri 
    2. db: the database name
    4. c: cache cluster config
    5. opts: WithExpiry Custom expiration time, WithNotFoundExpiry Cache empty record time when there is no record (prevent cache penetration)
retruns:
    1. *Model: Connection management objects
    2. error: error
```

4 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L62" target="_blank">NewNodeModel</a>

```golang
Function signature: 
    NewNodeModel func(uri, db, collection string, rds *redis.Redis, opts ...cache.Option) (*Model, error)
description: 
    1. When db and collection do not exist, db and collection will be created.
inputs:
    1. uri: mongodb uri 
    2. db: the database name
    3. collection: the collection name
    4. rds: redis collection
    5. opts: WithExpiry Custom expiration time, WithNotFoundExpiry Cache empty record time when there is no record (prevent cache penetration)
returns:
    1. *Model: Connection management objects
    2. error: Creation error
```

5 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L31" target="_blank">NewModelWithCache</a>

```golang
Function signature: 
    NewModelWithCache func(uri, db, collection string, c cache.Cache) (*Model, error)
description: 
    1. db and collection are created when db and collection do not exist.
入参:
    1. uri: mongodb uri 
    2. db: 数据库名
    3. collection: 集合名
    4. c: 自定义 cache 实现
返回值:
    1. *Model: 连接管理对象
    2. error: 创建错误
```

## 新增

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L174" target="_blank">InsertOne</a>

```golang
Function signature: 
    InsertOne func(ctx context.Context, key string, document interface{},
    opts ...*mopt.InsertOneOptions) (*mongo.InsertOneResult, error) 
description: 
    1. Add a new record and clean key cache.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
var prefixUserCacheKey = "cache:user:"

type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Insert(ctx context.Context, data *User) error {
    if data.ID.IsZero() {
        data.ID = primitive.NewObjectID()
        data.CreateAt = time.Now()
        data.UpdateAt = time.Now()
    }

    key := prefixUserCacheKey + data.ID.Hex()
    _, err := m.conn.InsertOne(ctx, key, data)
    return err
}
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L189" target="_blank">InsertOneNoCache</a>

```golang
Function signature: 
    InsertOneNoCache func(ctx context.Context, document interface{},
    opts ...*mopt.InsertOneOptions) (*mongo.InsertOneResult, error)
description: 
    1. Add a single record and don't clear the cache.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Insert(ctx context.Context, data *User) error {
    if data.ID.IsZero() {
        data.ID = primitive.NewObjectID()
        data.CreateAt = time.Now()
        data.UpdateAt = time.Now()
    }

    _, err := m.conn.InsertOneNoCache(ctx, data)
    return err
}
```

## Update

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L221" target="_blank">UpdateByID</a>

```golang
Function signature: 
    UpdateByID func(ctx context.Context, key string, id, update interface{},
    opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error) 
description: 
    1. Update record with _id and clean key cache.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
var prefixUserCacheKey = "cache:user:"

type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Update(ctx context.Context, data *User) error {
    data.UpdateAt = time.Now()
    key := prefixUserCacheKey + data.ID.Hex()
    _, err := m.conn.UpdateByID(ctx, key, bson.M{"_id": data.ID}, data)

    return err
}
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L236" target="_blank">UpdateByIDNoCache</a>

```golang
Function signature: 
    UpdateByIDNoCache func(ctx context.Context, id, update interface{},
    opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error) 
Note: 
    1. Update record by _id and not clear cache.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Update(ctx context.Context, data *User) error {
    data.UpdateAt = time.Now()
    key := prefixUserCacheKey + data.ID.Hex()
    _, err := m.conn.UpdateByIDNoCache(ctx, bson.M{"_id": data.ID}, data)

    return err
}
```

3 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L242" target="_blank">UpdateMany</a>

```golang
Function signature: 
    UpdateMany func(ctx context.Context, keys []string, filter, update interface{},
    opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)  
description: 
    1. More records are updated and keys are cleaned up.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
var prefixUserCacheKey = "cache:user:"

type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) UpdateMany(ctx context.Context, name string, data []*User) error {
    var keys = make([]string, 0, len(data))
    for _, v := range data {
        keys = append(keys, prefixUserCacheKey+v.ID.Hex())
        v.UpdateAt = time.Now()
    }
    _, err := m.conn.UpdateMany(ctx, keys, bson.M{"name": name}, data)

    return err
}
```

4 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L257" target="_blank">UpdateManyNoCache</a>

```golang
Function signature: 
    UpdateManyNoCache func(ctx context.Context, filter, update interface{},
    opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
description: 
    1. Update record by _id and not clear cache.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) UpdateMany(ctx context.Context, name string, data []*User) error {
    _, err := m.conn.UpdateManyNoCache(ctx, bson.M{"name": name}, data)

    return err
}
```

5 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L263" target="_blank">UpdateOne</a>

```golang
Function signature: 
    UpdateOne func(ctx context.Context, key string, filter, update interface{},
    opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
description: 
    1. Update single record and clean key cache.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
var prefixUserCacheKey = "cache:user:"

type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Update(ctx context.Context, data *User) error {
    data.UpdateAt = time.Now()
    key := prefixUserCacheKey + data.ID.Hex()

    _, err := m.conn.UpdateOne(ctx, key, bson.M{"name": data.Name}, data)
    return err
}
```

6 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L221" target="_blank">UpdateOneNoCache</a>

```golang
Function signature: 
    UpdateOneNoCache func(ctx context.Context, filter, update interface{},
    opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
Note: 
    1. Update the single entry and won't clear the cache.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Update(ctx context.Context, data *User) error {
    data.UpdateAt = time.Now()

    _, err := m.conn.UpdateOneNoCache(ctx, bson.M{"name": data.Name}, data)
    return err
}
```

## 查询

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L107" target="_blank">FindOne</a>

```golang
Method name: 
    FindOne func(ctx context.Context, key string, v, filter interface{},
    opts ...*mopt.FindOneOptions) error
Description: 
    1. If a single record is queried, the cache key is used as the first priority, and if it does not exist, it is inserted into the cache again.
    If the database does not exist, we will insert an empty record into the cache to prevent cache penetration.
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
var prefixUserCacheKey = "cache:user:"

type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) FindOne(ctx context.Context, id string) (*User, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, ErrInvalidObjectId
    }

    var data User
    key := prefixUserCacheKey + id
    err = m.conn.FindOne(ctx, key, &data, bson.M{"_id": oid})
    switch err {
    case nil:
        return &data, nil
    case monc.ErrNotFound:
        return nil, ErrNotFound
    default:
        return nil, err
    }
}
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L115" target="_blank">FindOneNoCache</a>

```golang
Function signatures: 
    FindOneNoCache func(ctx context.Context, v, filter interface{},
    opts ...*mopt.FindOneOptions) error
description: 
    . Query single record without cache.
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) FindOne(ctx context.Context, id string) (*User, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, ErrInvalidObjectId
    }

    var data User
    err = m.conn.FindOneNoCache(ctx, &data, bson.M{"_id": oid})
    switch err {
    case nil:
        return &data, nil
    case monc.ErrNotFound:
        return nil, ErrNotFound
    default:
        return nil, err
    }
}
```

## Delete

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L86" target="_blank">DeleteOne</a>

```golang
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
var prefixUserCacheKey = "cache:user:"

var prefixUserCacheKey = "cache:user:"

type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Delete(ctx context.Context, id string) error {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return ErrInvalidObjectId
    }
    key := prefixUserCacheKey + id
    _, err = m.conn.DeleteOne(ctx, key, bson.M{"_id": oid})
    return err
}
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/monc/cachedmodel.go#L101" target="_blank">DeleteOneNoCache</a>

```golang
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Delete(ctx context.Context, id string) error {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return ErrInvalidObjectId
    }
    _, err = m.conn.DeleteOneNoCache(ctx, bson.M{"_id": oid})
    return err
}
```
