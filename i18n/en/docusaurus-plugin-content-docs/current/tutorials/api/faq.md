---
title: FAQ
slug: /docs/tutorials/api/faq
---

## 1. How do I experience new API features?

api New Feature is currently in the testing stage. If you want to experience a new feature, you can install the latest goctl tool by commanding, and you need to turn on `GOCTL_EXPERIMENTAL`.

```bash
$ goctl env -w GOCTL_EXPERIMENTAL=on
```

Support for API new features starting from version 1.5.1, including：

1. Data type supports array type
1. Support Tag Ignore
1. Pure numbers are supported by routes, e.g. `/abc/123/`
1. api resolver migrated from antlr4 to goparser

Surely 1.5.1 If new features are enabled, there are some incompatible places

1. syntax header is required

Data type is referenced <a href="/docs/tutorials/api/types#示例" target="_blank"> Type Statement • Examples</a> in goctl 1.5.1 some description

## 2. goctl api generated error： multiple service names defined...

Declares multiple services are not supported in api syntax files such as writing below as unsupported：

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

The grey bottom texture section `foo` and `bar` is not supported and can only declare a service like：

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

## 3. goctl api does not support `any` type

Generic and weak types are not supported in api syntax.
