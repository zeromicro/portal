---
title: Basic CURD
sidebar_label: Basic CURD
slug: /docs/tutorials/mongo/curd
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This section describes the relatively complex way to introduce the CURD in the mon package.

## Preparing

1. <a href="/docs/tasks/mongo/connection" target="_blank">Complete mongo connection</a>
2. <a href="/docs/tasks/mongo/curd" target="_blank">Basic CURD。</a>

## Create New

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L96" target="_blank">InsertMany</a>

```golang
Function signature: 
    InsertMany func(ctx context.Context, documents []interface{}, opts ...*mopt.InsertManyOptions) (
            *mongo.InsertManyResult, error) 
description: 
    1. Add a single document record.
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

func (m *defaultUserModel) InsertMany(ctx context.Context, data []*User) error {
    var docs = make([]interface{}, 0, len(data))
    for _, d := range data {
        if d.ID.IsZero() {
            d.ID = primitive.NewObjectID()
            d.CreateAt = time.Now()
            d.UpdateAt = time.Now()
        }
        docs = append(docs, d)
    }

    _, err := m.conn.InsertMany(ctx, docs)
    return err
}
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/bulkinserter.go#L22" target="_blank">BulkInserter</a>

```golang
Function signature: 
    NewBulkInserter(coll Collection, interval ...time.Duration) (*BulkInserter, error) 
description: 
    1. Use if large quantities of new data are present.
    Insert the process by bulk (1000) or cycle time.
inputs:
    1. coll: mongo connectin NewObjectID
    2. interval: Batch insertion period, intervals[0] is a valid value
returns:
    1. *BulkInserter: bulk module object
    2. error: Create results

Example:
type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

// NewUserModel returns a model for the mongo.
func NewUserModel(url, db, collection string) UserModel {
    conn := mon.MustNewModel(url, db, collection)
    blk, err := mon.NewBatchInserter(conn.Collection, time.Second)
    if err != nil {
        log.Fatal(err)
    }

    return &customUserModel{
        defaultUserModel: newDefaultUserModel(conn),
        blk:              blk,
    }
}

func (m *customUserModel) BatchInsert(ctx context.Context, data []*User) error {
    m.blk.SetResultHandler(func(result *mongo.InsertManyResult, err error) {
        if err != nil {
            log.Println(err)
        }
    })

    for _, d := range data {
        if d.ID.IsZero() {
            d.ID = primitive.NewObjectID()
            d.CreateAt = time.Now()
            d.UpdateAt = time.Now()
        }
        m.blk.Insert(d)
    }
    m.blk.Flush()
    return nil
}
```

## Update

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L111" target="_blank">UpdateOne</a>

```golang
Function signature: 
    UpdateOne (ctx context.Context, filter, update interface{},
            opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
description: 
    1. Update a single document record.
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

    _, err := m.conn.UpdateOne(ctx, bson.M{"_id": data.ID}, data)
    return err
}
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L105" target="_blank">UpdateByID</a>

```golang
Function signature: 
    UpdateByID (ctx context.Context, id, update interface{},
            opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
description: 
    1. Update individual document records by _id.
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

    _, err := m.conn.UpdateByID(ctx, data.ID, data)
    return err
}
```

3 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L108" target="_blank">UpdateMany</a>

```golang
Function signature: 
    UpdateMany (ctx context.Context, filter, update interface{},
            opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
description: 
    1. More document records.
Input:
    1. ctx: context
    2. document: record information
    3. opts: operating options
return value:
    1. *mongo.InsertOneResult: New result, including the _id of the new record
    2. error: Results of the

Example:
type User struct {
    ID   primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    Name string             `bson:"name,omitempty" json:"name,omitempty"`
    Age  int                `bson:"age,omitempty" json:"age,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *customUserModel) UpdateAge(ctx context.Context, name string, age int) error {
    _, err := m.conn.UpdateMany(ctx, bson.M{"name": name}, bson.M{"$set": bson.M{"age": age}})
    return err
}
```

## Query

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L141" target="_blank">FindOne</a>

```golang
Function signature: 
   FindOne func(ctx context.Context, v, filter interface{}, opts ...*mopt.FindOneOptions) 
note: 
    . Query individual document records.
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
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

    err = m.conn.FindOne(ctx, &data, bson.M{"_id": oid})
    switch err {
    case nil:
        return &data, nil
    case mon.ErrNotFound:
        return nil, ErrNotFound
    default:
        return nil, err
    }
}
```

2 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L141" target="_blank">Find</a>

```golang
Function signature: 
    Find func(ctx context.Context, v, filter interface{}, opts ...*mopt.FindOptions) error 
description: 
    1. Query individual document records.
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Find(ctx context.Context, id string) ([]*User, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, ErrInvalidObjectId
    }

    var data []*User

    err = m.conn.Find(ctx, &data, bson.M{"_id": oid})
    return data, nil
}
```

## Delete

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L120" target="_blank">DeleteOne</a>

```golang
Function signature: 
   DeleteOne func(ctx context.Context, filter interface{}, opts ...*mopt.DeleteOptions) (int64, error)
note: 
    . Add a single document record.
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
ype User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Delete(ctx context.Context, id string) error {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return ErrInvalidObjectId
    }

    _, err = m.conn.DeleteOne(ctx, bson.M{"_id": oid})
    return err
}
```

2  <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L61" target="_blank">DeleteMany</a>

```golang
Function signature: 
    DeleteMany func(ctx context.Context, filter interface{}, opts ...*mopt.DeleteOptions) (
            *mongo.DeleteResult, error)
description: 
    1. Delete a single document record.
Input:
    1. ctx: context
    2. v: record result
    2. filter: filter condition
    3. opts: operating options
return value:
    1. error: Results of the

Example:
type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Delete(ctx context.Context, id string) error {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return ErrInvalidObjectId
    }

    _, err = m.conn.DeleteMany(ctx, bson.M{"_id": oid})
    return err
}
```
