---
title: Etcd 配置
sidebar_label: Etcd 配置
slug: /docs/tutorials/go-zero/configuration/etcd
---

## EtcdConf 概述

[EtcdConf](https://github.com/zeromicro/go-zero/blob/master/core/discov/config.go) 作为我们 Etcd 服务发现的配置。详情可以参考 rpc 服务发现。

## 参数定义

EtcdConf 定义如下

```go
// EtcdConf is the config item with the given key on etcd.
type EtcdConf struct {
	Hosts              []string
	Key                string
	User               string `json:",optional"`
	Pass               string `json:",optional"`
	CertFile           string `json:",optional"`
	CertKeyFile        string `json:",optional"`
	CACertFile         string `json:",optional"`
	InsecureSkipVerify bool   `json:",optional"`
}
```

| 参数               | 类型        | 默认值 | 说明                      |
| ------------------ | ----------- | ------ | ------------------------- |
| Hosts              | string 数组 | -      | 必填，etcd 地址数组       |
| Key                | string      | -      | 必填，etcd 服务发现的 Key |
| User               | string      | -      | etcd 用户名               |
| Pass               | string      | -      | etcd 密码                 |
| CertFile           | string      | -      | 证书文件地址              |
| CertKeyFile        | string      | -      | 证书 Key 文件地址         |
| CACertFile         | string      | -      | CA 证书地址               |
| InsecureSkipVerify | string      | -      | 是否跳过安全认证          |
