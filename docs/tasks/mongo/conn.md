---
title: 数据库链接
slug:  /docs/tasks/mongo/connection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述
通过 mongodb 的 uri 创建个可用的 mongodb 数据库连接。

## 准备条件
1. <a href="/docs/tasks" target="_blank">完成 golang 安装</a> 

## 工具包说明
go-zero 包含两个 mongodb 工具包，其中 <a href="https://github.com/zeromicro/go-zero/tree/master/core/stores/mongo" target="_blank">mongo</a> 包已经废弃，后续不再支持维护，推荐使用 <a href="https://github.com/zeromicro/go-zero/tree/master/core/stores/mon" target="_blank">mon</a> 工具包。 

本章节的所有介绍都是基于 <a href="https://github.com/zeromicro/go-zero/tree/master/core/stores/mon" target="_blank">mon</a> 工具包。

## 创建数据库连接
数据库的连接创建提供了两个方法，<a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L40" target="_blank">MustNewModel</a> 和 <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L50" target="_blank">NewModel</a>。

## 方法说明
1. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L40" target="_blank">MustNewModel</a>
```golang
函数签名: 
    MustNewModel func(uri, db, collection string, opts ...Option) *Model 
说明: 
    1. 当 mongodb 连接创建存在问题时，会直接进退退出，输出错误日志。
    2. 当 db 和 collection 不存在时，会创建 db 和 collection。
入参:
    1. uri: mongodb uri (example: mongodb://<user>:<password>@<host>:<port>)
    2. db: 数据库名
    3. collection: 集合名
返回值:
    1. *Model: 连接管理对象
```

2. <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/model.go#L50" target="_blank">NewModel</a>
```golang
函数签名: 
    NewModel func(uri, db, collection string, opts ...Option) (*Model, error)
说明: 
    1. 当 db 和 collection 不存在时，会创建 db 和 collection。
入参:
    1. uri: mongodb uri (example: mongodb://<user>:<password>@<host>:<port>)
    2. db: 数据库名
    3. collection: 集合名
返回值:
    1. *Model: 连接管理对象
    2. error: 创建错误
```