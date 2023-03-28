---
title: 常见问题
slug: /docs/tutorials/api/faq
---

## 1. 怎么体验新的 API 特性？

api 新特性目前处于测试阶段，如果你想体验新特性，可以通过如下命令安装最新的 goctl 工具，且需要开启 `GOCTL_EXPERIMENTAL` 环境变量。

```bash
$ goctl env -w GOCTL_EXPERIMENTAL=on
```

从 1.5.1 版本开始内测支持 API 新特性，新特性包括：

1. 数据类型支持 `any` 类型
1. 数据类型支持数组类型
1. 支持标签忽略
1. 路由支持纯数字，如 `/abc/123/`
1. api 解析器从 antlr4 迁移到 goparser

数据类型写法可参考 <a href="/docs/tutorials/api/types#示例" target="_blank"> 《类型声明 • 示例》</a> 中 goctl 1.5.1 说明部分内容

## 2. goctl api 生成报错： multiple service names defined ...

在 api 语法文件中，不支持声明多个 service，比如如下写法是不支持的：

```go {1,6}
service foo {
    @handler fooPing
    get /foo/ping
}

service bar {
    @handler barPing
    get /bar/ping
}
```

灰色底纹部分 `foo` 和 `bar` 是不支持的，只能声明一个 service，比如：

```go {1,6}
service foo {
    @handler fooPing
    get /foo/ping
}

service foo {
    @handler barPing
    get /bar/ping
}
```

## 3. goctl api 不支持 `any` 类型

any 类型在 1.5.1 才开始内测支持，新特性可参考 <a href="/docs/tutorials/api/faq#1-怎么体验新的-api-特性" target="_blank"> 《常见问题 • 1. 怎么体验新的 API 特性？》</a>

## 4. 