---
title: Basic CURD
slug: /docs/tasks/mongo/curd
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

This section presents a description of the methods associated with the mon package.

## Preparing

1 <a href="/docs/tasks/mongo/connection" target="_blank">Complete mon link creation.</a>

## Create New

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L99" target="_blank">InsertOne</a>

```golang
Function signature: 
    InsertOne function (ctx context.Context, document interface{}, opts ...mmopt.InsertOneOptions) (
            *mongo.InsertOneResult, error) 
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

func (m *defaultUserModel) Insert(ctx context.Context, data *User) error {
    if data.ID.IsZero() {
        data.ID = primitive.NewObjectID()
        data.CreateAt = time.Now()
        data.UpdateAt = time.Now()
    }

    _, err := m.conn.InsertOne(ctx, data)
    return err
}
```

## Update

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L102" target="_blank">ReplaceOne</a>

```golang
Function signature: 
    ReplaceOne function (ctx context.Context, filter, replacement interface{},
            opts ...mopt.ReplaceOpts)(*mongo.UpdateResult, error)
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

func (m *defaultUserModel) Insert(ctx context.Context, data *User) error {
    if data.ID.IsZero() {
        data.ID = primitive.NewObjectID()
        data.CreateAt = time.Now()
        data.UpdateAt = time.Now()
    }

    _, err := m.conn.InsertOne(ctx, data)
    return err
}
```

## Query

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L141" target="_blank">FindOne</a>

```golang
Function signature: 
    FindOne function (ctx context.Context, v, filter interface{}, opts ...mmopt.FindOneOptions) error 
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

## Delete

1 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L120" target="_blank">DeleteOne</a>

```golang
Function signature: 
    DeleteOne function (ctx context.Context, filter interface{}, opts ...*mopt.DeleteOptions)(int64, error)
description: 

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

## Full demo instance

```go
package main

import (
    "time"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"

    "github.com/zeromicro/go-zero/core/stores/mon"
)

type User struct {
    ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    Username string             `bson:"username,omitempty" json:"username,omitempty"`
    Password string             `bson:"password,omitempty" json:"password,omitempty"`
    UpdateAt time.Time          `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time          `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func main() {
    conn := mon.MustNewModel("mongodb://<user>:<password>@<host>:<port>", "db", "collection")
    ctx := context.Background()
    u := &User{
        ID:       primitive.ObjectID{},
        Username: "username",
        Password: "password",
        UpdateAt: time.Now(),
        CreateAt: time.Now(),
    }
    // insert one
    _, err := conn.InsertOne(ctx, u)
    if err != nil {
        panic(err)
    }

    var newUser User
    err = conn.FindOne(ctx, &newUser, bson.M{"_id": u.ID})
    if err != nil {
        panic(err)
    }

    newUser.Username = "newUsername"
    _, err = conn.ReplaceOne(ctx, bson.M{"_id": newUser.ID}, newUser)
    if err != nil {
        panic(err)
    }

    _, err = conn.DeleteOne(ctx, bson.M{"_id": newUser.ID})
    if err != nil {
        panic(err)
    }
}

```
