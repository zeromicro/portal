---
title: 基本 CURD
slug:  /docs/tasks/mongo/curd
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本章节介绍 mon 包的 CURD 相关方法的介绍。

## 准备条件

1. <a href="/docs/tasks/mongo/connection" target="_blank">完成 mon 的链接创建。</a>

## 新增

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L99" target="_blank">InsertOne</a>

```golang
函数签名: 
    InsertOne func(ctx context.Context, document interface{}, opts ...*mopt.InsertOneOptions) (
			*mongo.InsertOneResult, error) 
说明: 
    1. 新增单个文档记录。
入参:
    1. ctx: context
    2. document: 记录信息
    3. opts: 操作选项
返回值:
    1. *mongo.InsertOneResult: 新增结果，包含新增记录的 _id
    2. error: 执行结果

示例:
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

## 更新

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L102" target="_blank">ReplaceOne</a>

```golang
函数签名: 
    ReplaceOne func(ctx context.Context, filter, replacement interface{},
			opts ...*mopt.ReplaceOptions) (*mongo.UpdateResult, error)
说明: 
    1. 更新单个文档记录。
入参:
    1. ctx: context
    2. filter: 过滤条件
    3. replacement: 更新记录
    4. opts: 操作选项
返回值:
    1. *mongo.ReplaceOptions: 更新结果，包含更新的 _id, 匹配的数量等信息
    2. error: 执行结果

示例:
type User struct {
	ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	// TODO: Fill your own fields
	UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
	CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}

func (m *defaultUserModel) Update(ctx context.Context, data *User) error {
	data.UpdateAt = time.Now()

	_, err := m.conn.ReplaceOne(ctx, bson.M{"_id": data.ID}, data)
	return err
}
```

## 查询

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L141" target="_blank">FindOne</a>

 ```golang
	函数签名: 
		FindOne func(ctx context.Context, v, filter interface{}, opts ...*mopt.FindOneOptions) error 
	说明: 
		1. 查询单个文档记录。
	入参:
		1. ctx: context
		2. v: 查询结果
		2. filter: 过滤条件
		3. opts: 操作选项
	返回值:
		1. error: 执行结果

	示例:
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

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L141" target="_blank">Find</a>

	```golang
	函数签名: 
		Find func(ctx context.Context, v, filter interface{}, opts ...*mopt.FindOptions) error 
	说明: 
		1. 查询单个文档记录。
	入参:
		1. ctx: context
		2. v: 查询结果(数组指针)
		2. filter: 过滤条件
		3. opts: 操作选项
	返回值:
		1. error: 执行结果

	示例:
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

## 删除

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L120" target="_blank">DeleteOne</a>

```golang
函数签名: 
    DeleteOne func(ctx context.Context, filter interface{}, opts ...*mopt.DeleteOptions) (int64, error)
说明: 
    1. 新增单个文档记录。
入参:
    1. ctx: context
    2. filter: 过滤条件
    3. opts: 操作选项
返回值:
    1. int64: 删除数量
    2. error: 执行结果

示例:
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

	_, err = m.conn.DeleteOne(ctx, bson.M{"_id": oid})
	return err
}
```

## 完整 demo 实例

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

	// 查询
	var newUser User
	err = conn.FindOne(ctx, &newUser, bson.M{"_id": u.ID})
	if err != nil {
		panic(err)
	}

	// 更新
	newUser.Username = "newUsername"
	_, err = conn.ReplaceOne(ctx, bson.M{"_id": newUser.ID}, newUser)
	if err != nil {
		panic(err)
	}

	// 删除
	_, err = conn.DeleteOne(ctx, bson.M{"_id": newUser.ID})
	if err != nil {
		panic(err)
	}
}

```
