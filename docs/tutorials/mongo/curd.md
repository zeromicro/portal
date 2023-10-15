---
title: 基本 CURD 
sidebar_label: 基本 CURD
slug: /docs/tutorials/mongo/curd
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本章节介绍 mon 包的 CURD 相对复杂的方法介绍。

## 准备条件

1. <a href="/docs/tasks/mongo/connection" target="_blank">完成 mon 的链接创建。</a>
2. <a href="/docs/tasks/mongo/curd" target="_blank">基本 CURD 学习。</a>

## 新增

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L96" target="_blank">InsertMany</a>

```golang
函数签名: 
    InsertMany func(ctx context.Context, documents []interface{}, opts ...*mopt.InsertManyOptions) (
			*mongo.InsertManyResult, error) 
说明: 
    1. 新增多个文档记录。
入参:
    1. ctx: context
    2. documents: 记录信息
    3. opts: 操作选项
返回值:
    1. *mongo.InsertManyResult: 新增结果，包含新增记录的 _id 列表
    2. error: 执行结果

示例:
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

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/bulkinserter.go#L22" target="_blank">BulkInserter</a>

```golang
函数签名: 
    NewBulkInserter(coll Collection, interval ...time.Duration) (*BulkInserter, error) 
说明: 
    1. 如果存在大批量新增数据时，可以使用。
    2. 插入过程会按 bulk(1000) 或 周期时间分组插入。
入参:
    1. coll: mongo 连接对象
    2. interval: 批量插入周期, intervals[0] 是有效值
返回值:
    1. *BulkInserter: bulk 模块对象
    2. error: 创建结果

示例:
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

## 更新

1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L111" target="_blank">UpdateOne</a>

```golang
函数签名: 
    UpdateOne (ctx context.Context, filter, update interface{},
			opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
说明: 
    1. 更新单个文档记录。
入参:
    1. ctx: context
    2. filter: 过滤条件
    3. update: 更新记录
    4. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含更新的 _id, 匹配的数量等信息
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

	_, err := m.conn.UpdateOne(ctx, bson.M{"_id": data.ID}, data)
	return err
}
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L105" target="_blank">UpdateByID</a>

```golang
函数签名: 
    UpdateByID (ctx context.Context, id, update interface{},
			opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
说明: 
    1. 通过 _id 更新单个文档记录。
入参:
    1. ctx: context
    2. id: _id
    3. update: 更新记录
    4. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含更新的 _id, 匹配的数量等信息
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

	_, err := m.conn.UpdateByID(ctx, data.ID, data)
	return err
}
```

3. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L108" target="_blank">UpdateMany</a>

```golang
函数签名: 
    UpdateMany (ctx context.Context, filter, update interface{},
			opts ...*mopt.UpdateOptions) (*mongo.UpdateResult, error)
说明: 
    1. 更新多个文档记录。
入参:
    1. ctx: context
    2. filter: 过滤条件
    3. update: 更新记录
    4. opts: 操作选项
返回值:
    1. *mongo.UpdateResult: 更新结果，包含更新的 _id 列表, 匹配的数量等信息
    2. error: 执行结果

示例:
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

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L61" target="_blank">DeleteMany</a>

```golang
函数签名: 
    DeleteMany func(ctx context.Context, filter interface{}, opts ...*mopt.DeleteOptions) (
			*mongo.DeleteResult, error)
说明: 
    1. 新增单个文档记录。
入参:
    1. ctx: context
    2. filter: 过滤条件
    3. opts: 操作选项
返回值:
    1. *mongo.DeleteResult: 删除结果
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

	_, err = m.conn.DeleteMany(ctx, bson.M{"_id": oid})
	return err
}
```
