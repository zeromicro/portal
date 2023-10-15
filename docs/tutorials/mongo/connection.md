---
title: 数据库连接 
sidebar_label: 数据库连接
slug: /docs/tutorials/mongo/connection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

本章节介绍创建链接的 option 的用法

## 准备条件

1. <a href="/docs/tasks/mongo/connection" target="_blank">完成 mon 的链接创建。</a>

## <a href="https://github.com/zeromicro/go-zero/blob/master/core/stores/mon/collection.go#L99" target="_blank">WithTimeout</a>

设置 mongo 操作的超时时间。

### 示例:

```golang

func NewUserModel(url, db, collection string) UserModel {
	conn := mon.MustNewModel(url, db, collection, mon.WithTimeout(time.Second))
	return &customUserModel{
		defaultUserModel: newDefaultUserModel(conn),
	}
}
```
