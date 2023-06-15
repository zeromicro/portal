---
title: API 规范
sidebar_label: API 规范
slug: /docs/tutorials
---

## 概述

api 是 go-zero 自研的领域特性语言（下文称 api 语言 或 api 描述语言），旨在实现人性化的基础描述语言，作为生成 HTTP 服务最基本的描述语言。

api 领域特性语言包含语法版本，info 块，结构体声明，服务描述等几大块语法组成，其中结构体和 Golang 结构体 语法几乎一样，只是移出了 `struct` 关键字。

## 目标

- 学习成本低
- 可读性强
- 扩展自由
- HTTP 服务一键生成
- 编写一个 api 文件，生成多种语言代码服务

## 语法标记符号

api 语法是使用 [扩展巴科斯范式（EBNF）](https://zh.m.wikipedia.org/zh-sg/%E6%89%A9%E5%B1%95%E5%B7%B4%E7%A7%91%E6%96%AF%E8%8C%83%E5%BC%8F) 来描述的，在扩展巴科斯范式中指定

```text
Syntax      = { Production } .
Production  = production_name "=" [ Expression ] "." .
Expression  = Term { "|" Term } .
Term        = Factor { Factor } .
Factor      = production_name | token [ "…" token ] | Group | Option | Repetition .
Group       = "(" Expression ")" .
Option      = "[" Expression "]" .
Repetition  = "{" Expression "}" .
```

`Production` 由 `Term` 和如下操作符组成，如下操作符优先级递增：

```text
|   alternation
()  grouping
[]  option (0 or 1 times)
{}  repetition (0 to n times)
```

形式 `a...b` 表示从 a 到 b 的一组字符作为替代，如 `0...9` 代表 0 到 9 的有效数值。

`.` 表示 ENBF 的终结符号。

:::note 注意
产生式的名称如果为小写，则代表终结 token，驼峰式的产生式名称则为非终结符 token，如：

```ebnf
// 终结 token
number = "0"..."9" .
lower_letter = "a"..."z" .

// 非终结 token
DataType = TypeLit | TypeGroup .
TypeLit  = TypeAlias | TypeStruct .
```

:::

## 源代码表示

源代码表示是用来描述 api 语法的最基础元素。

### 字符

```text
newline        = /* 代表换行符， Unicode 值为 U+000A */ .
unicode_char   = /* 除换行符 newline 外的其他 Unicode 字符 */ .
unicode_letter = /* 字母 a...z|A...Z Unicode */ .
unicode_digit  = /* 数值 0...9 Unicode */ .
```

### 字母和数字

下划线字符 `_` (U+005F) 被视为小写字母。

```text
letter        = "A"..."Z" | "a"..."z" | "_" .
decimal_digit = "0" … "9" .
```

## 抽象语法树

抽象语法树（**A**bstract **S**yntax **T**ree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。之所以说语法是“抽象”的，是因为这里的语法并不会表示出真实语法中出现的每个细节。比如，嵌套括号被隐含在树的结构中，并没有以节点的形式呈现；而类似于 if-condition-then 这样的条件跳转语句，可以使用带有三个分支的节点来表示。

抽象语法树是代码的树形表示。它们是编译器工作方式的基本组成部分。当编译器转换一些代码时，基本上有以下步骤：

- 词法分析（Lexical Analysis）
- 语法分析（Syntax Analysis）
- 代码生成（Code Generation）

![ast process](./resource/tasks/dsl/ast-process.png)

<center>AST 分析过程</center>

### 词法分析

词法分析（Lexical Analysis）是计算机科学中将字符序列转换为记号（token）序列的过程。进行词法分析的程序或者函数叫作词法分析器（lexical analyzer，简称 lexer），也叫扫描器（scanner）。词法分析器一般以函数的形式存在，供语法分析器调用。

在 api 语言中，词法分析是将字符转换为词法元素序列的过程，其中词法元素包括 `注释` 和 `Token`。

#### 词法元素

##### 注释

在 api 领域特性语言中有 2 种格式：

1. 单行注释以 `//` 开始，行尾结束。

   ```go
   // 这是一个单行注释示例
   ```

2. 多行注释（文档注释）以 `/*` 开始，以第一个 `*/` 结束。

   ```go
   /*这是在同意行内的文档注释*/
   /*
   这是在多行的文档注释
   */
   ```

##### Token

Token 是组成节点的最基本元素，由 `标识符（identifier）`、`关键字（keyword）`、`运算符（operator）`、`标点符号（punctuation）`、`字面量（literal）`组成，`空白符（White space）`一般由`空格（U+0020）`、`水平制表符（U+0009）`、`回车符（U+000D）`和 `换行符（U+000A）`组成，在 api 语言中，Token 不包含 `运算符（operator）`。

Token 的 Golang 结构体定义为：

```go
type Token struct {
    Type     Type
    Text     string
    Position Position
}

type Position struct {
    Filename string
    Line     int
    Column   int
}
```

如 api 语句 `syntax="v1"`，其词法化后的为：

| 文本   | 类型   |
| ------ | ------ |
| syntax | 标识符 |
| =      | 操作符 |
| "v1"   | 字符串 |

###### ID 标识符

ID 标识符一般是结构体，变量，类型等的名称实体，ID 标识符一般有 1 到 n 个字母和数字组成，且开头必须为字母（记住上文提到的 `_` 也被当做小写字母看待），其 EBNF 表示法为：

```ebnf
identifier = letter { letter | unicode_digit } .
```

ID 标识符示例：

```text
a
_a1
GoZero
```

有些 ID 标识符是预先定义的，api 沿用了 [Golang 预定义 ID 标识符](https://go.dev/ref/spec#Predeclared_identifiers) 。

```go
预定义类型:
    any bool byte comparable
    complex64 complex128 error float32 float64
    int int8 int16 int32 int64 rune string
    uint uint8 uint16 uint32 uint64 uintptr

预定义常量:
    true false iota

零值:
    nil

预定义函数:
    append cap close complex copy delete imag len
    make new panic print println real recover
```

###### 关键字

关键字是一些特殊的 ID 标识符，是系统保留字，api 的关键字沿用了 Golang 关键字，结构体中不得使用 Golang 关键字作为标识符。

Golang 关键字

```go
break        default      func         interface    select
case         defer        go           map          struct
chan         else         goto         package      switch
const        fallthrough  if           range        type
continue     for          import       return       var
```

###### 标点符号

标点符号可以用于对 Token、表达式做分割、分组，以下是 api 语言中的标点符号：

```text
-    ,    (    )
*    .    [    ]
/    ;    {    }
=    :    ,    ;
...
```

###### 字符串

字符串字面量是由一组字符序列组成的常量。在 api 中沿用了 Golang 的字符串，有 2 种形式： 原始字符串（raw string）和普通符串（双引号字符串）。

原始字符串的字符序列在两个反引号之间，除反引号外，任何字符都可以出现，如 \`foo\`；

普通字符串的字符序列在两个双引号之间，除双引号外，任何字符都可以出现，如 "foo"。

:::note 注意
在 api 语言中，双引号字符串不支持 `\"` 来实现字符串转义。
:::

```ebnf
string_lit             = raw_string_lit | interpreted_string_lit .
raw_string_lit         = "`" { unicode_char | newline } "`" .
interpreted_string_lit = `"` { unicode_value | byte_value } `"` .
```

字符串示例：

```text
// 原始字符串
``
`foo`
`bar`
`json:"baz"`

// 普通字符串
""
"foo"
"bar"
```

### 语法分析

语法分析（Syntax Analysis）又叫语法解析，这个过程是将词法元素转换为树的过程，而语法树一般由节点（Node）、表达式（Expression）、语句（Statement）组成，语法解析的过程除了词汇转换成树外，还需要完成语义分析。

#### 节点

节点（Node）是 Token 的变体，是一个接口类型，是组成表达式、语句的基本元素，其在 Golang 中的结构体定义为：

```go
// Node represents a node in the AST.
type Node interface {
    // Pos returns the position of the first character belonging to the node.
    Pos() token.Position
    // End returns the position of the first character immediately after the node.
    End() token.Position
    // Format returns the node's text after format.
    Format(...string) string
    // HasHeadCommentGroup returns true if the node has head comment group.
    HasHeadCommentGroup() bool
    // HasLeadingCommentGroup returns true if the node has leading comment group.
    HasLeadingCommentGroup() bool
    // CommentGroup returns the node's head comment group and leading comment group.
    CommentGroup() (head, leading CommentGroup)
}
```

#### 表达式

表达式（Expression）是组成语句的基本元素，可以理解为一个句子中的 “短语”，在 api 语言中包含的表达式如下：

1. 数据类型表达式
1. 结构体中的 field 表达式
1. key-value 表达式
1. 服务声明表达式
1. HTTP 请求/响应体表达式
1. HTTP 路由表达式

在 api 中 Golang 的结构体定义为：

```go
// Expr represents an expression in the AST.
type Expr interface {
    Node
    exprNode()
}
```

#### 语句

语句（Statement）是组成抽象语法树的基本元素，抽象语法树可以理解成一篇文章，而语句是组成文章的多条句子，在 api 语言中包含语句如下：

1. @doc 语句
1. @handler 语句
1. @server 语句
1. HTTP 服务的请求/响应体语句
1. 注释语句
1. import 语句
1. info 语句
1. HTTP 路由语句
1. HTTP 服务声明语句
1. syntax 语句
1. 结构体语句

在 api 中 Golang 的结构体定义为：

```go
// Stmt represents a statement in the AST.
type Stmt interface {
    Node
    stmtNode()
}
```

### 代码生成

我们一旦有了抽象语法树，就可以通过它来打印或者生成不同的代码了，在 api 抽象语法树行成后，可以支持：

1. 打印 AST
1. api 语言格式化
1. Golang HTTP 服务生成
1. Typescript 代码生成
1. Dart 代码生成
1. Kotlin 代码生成

除此之外，还可以根据 AST 进行扩展，比如插件：

1. goctl-go-compact
1. goctl-swagger
1. goctl-php

## api 语法标记

```go
api = SyntaxStmt | InfoStmt | { ImportStmt } | { TypeStmt } | { ServiceStmt } .
```

### syntax 语句

syntax 语句用于标记 api 语言的版本，不同的版本可能语法结构有所不同，随着版本的提升会做不断的优化，当前版本为 `v1`。

syntax 的 EBNF 表示为：

```go
SyntaxStmt = "syntax" "=" "v1" .
```

syntax 语法写法示例：

```go
syntax = "v1"
```

### info 语句

info 语句是 api 语言的 meta 信息，其仅用于对当前 api 文件进行描述，**暂**不参与代码生成，其和注释还是有一些区别，注释一般是依附某个 syntax 语句存在，而 info 语句是用于描述整个 api 信息的，当然，不排除在将来会参与到代码生成里面来，info 语句的 EBNF 表示为：

```go
InfoStmt         = "info" "(" { InfoKeyValueExpr } ")" .
InfoKeyValueExpr = InfoKeyLit [ interpreted_string_lit ] .
InfoKeyLit       = identifier ":" .
```

info 语句写法示例：

```go
// 不包含 key-value 的 info 块
info ()

// 包含 key-value 的 info 块
info (
    foo: "bar"
    bar:
)
```

### import 语句

`import` 语句是在 api 中引入其他 api 文件的语法块，其支持相对/绝对路径，**不支持** `package` 的设计，其 EBNF 表示为：

```go
ImportStmt        = ImportLiteralStmt | ImportGroupStmt .
ImportLiteralStmt = "import" interpreted_string_lit .
ImportGroupStmt   = "import" "(" { interpreted_string_lit } ")" .
```

`import` 语句写法示例：

```go
// 单行 import
import "foo"
import "/path/to/file"

// import 组
import ()
import (
    "bar"
    "relative/to/file"
)
```

### 数据类型

api 中的数据类型基本沿用了 Golang 的数据类型，用于对 rest 服务的请求/响应体结构的描述，其 EBNF 表示为：

```go
TypeStmt          = TypeLiteralStmt | TypeGroupStmt .
TypeLiteralStmt   = "type" TypeExpr .
TypeGroupStmt     = "type" "(" { TypeExpr } ")" .
TypeExpr          = identifier [ "=" ] DataType .
DataType          = AnyDataType | ArrayDataType | BaseDataType |
                    InterfaceDataType | MapDataType | PointerDataType |
                    SliceDataType | StructDataType .
AnyDataType       = "any" .
ArrayDataType     = "[" { decimal_digit } "]" DataType .
BaseDataType      = "bool"    | "uint8"     | "uint16"     | "uint32" | "uint64"  |
                    "int8"    | "int16"     | "int32"      | "int64"  | "float32" |
                    "float64" | "complex64" | "complex128" | "string" | "int"     |
                    "uint"    | "uintptr"   | "byte"       | "rune"   | "any"     | .

InterfaceDataType = "interface{}" .
MapDataType       = "map" "[" DataType "]" DataType .
PointerDataType   = "*" DataType .
SliceDataType     = "[" "]" DataType .
StructDataType    = "{" { ElemExpr } "}" .
ElemExpr          = [ ElemNameExpr ]  DataType [ Tag ].
ElemNameExpr      = identifier { "," identifier } .
Tag               = raw_string_lit .
```

数据类型写法示例：

```go
// 别名类型 [1]
type Int int
type Integer = int

// 空结构体
type Foo {}

// 单个结构体
type Bar {
    Foo int               `json:"foo"`
    Bar bool              `json:"bar"`
    Baz []string          `json:"baz"`
    Qux map[string]string `json:"qux"`
}

type Baz {
    Bar    `json:"baz"`
    // 结构体内嵌 [2]
    Qux {
        Foo string `json:"foo"`
        Bar bool   `json:"bar"`
    } `json:"baz"`
}

// 空结构体组
type ()

// 结构体组
type (
    Int int
    Integer = int
    Bar {
        Foo int               `json:"foo"`
        Bar bool              `json:"bar"`
        Baz []string          `json:"baz"`
        Qux map[string]string `json:"qux"`
    }
)

```

:::caution 注意
[1] 虽然语法上支持别名，但是在语义分析时会对别名进行拦截，这或在将来进行放开。

[2] 虽然语法上支持结构体内嵌，但是在语义分析时会对别名进行拦截，这或在将来进行放开。

除此之外：

1. 目前 api 语法中虽然支持了数组的语法，但是在语义分析时会对数组进行拦截，目前建议用切片替代，这或在将来放开。
2. 不支持 package 设计，如 `time.Time`。

:::

### service 语句

service 语句是对 HTTP 服务的直观描述，包含请求 handler，请求方法，请求路由，请求体，响应体，jwt 开关，中间件声明等定义。

其 EBNF 表示为：

```go
ServiceStmt     = [ AtServerStmt ] "service" ServiceNameExpr "("
                  { ServiceItemStmt } ")" .
ServiceNameExpr = identifier [ "-api" ] .
```

#### @server 语句

@server 语句是对一个服务语句的 meta 信息描述，其对应特性包含但不限于：

- jwt 开关
- 中间件
- 路由分组
- 路由前缀

@server 的 EBNF 表示为：

```go
AtServerStmt     = "@server" "(" {  AtServerKVExpr } ")" .
AtServerKVExpr   = AtServerKeyLit [ AtServerValueLit ] .
AtServerKeyLit   = identifier ":" .
AtServerValueLit = PathLit | identifier { "," identifier } .
PathLit          = `"` { "/" { identifier | "-" identifier} } `"` .
```

@server 写法示例：

```go
// 空内容
@server()

// 有内容
@server (
    // jwt 声明
    // 如果 key 固定为 “jwt:”，则代表开启 jwt 鉴权声明
    // value 则为配置文件的结构体名称
    jwt: Auth

    // 路由前缀
    // 如果 key 固定为 “prefix:”
    // 则代表路由前缀声明，value 则为具体的路由前缀值，字符串中没让必须以 / 开头
    prefix: /v1

    // 路由分组
    // 如果 key 固定为 “group:”，则代表路由分组声明
    // value 则为具体分组名称，在 goctl生成代码后会根据此值进行文件夹分组
    group: Foo

    // 中间件
    // 如果 key 固定为 middleware:”，则代表中间件声明
    // value 则为具体中间件函数名称，在 goctl生成代码后会根据此值进生成对应的中间件函数
    middleware: AuthInterceptor

    // 超时控制
    // 如果 key 固定为  timeout:”，则代表超时配置
    // value 则为具体中duration，在 goctl生成代码后会根据此值进生成对应的超时配置
    timeout: 3s

    // 其他 key-value，除上述几个内置 key 外，其他 key-value
    // 也可以在作为 annotation 信息传递给 goctl 及其插件，但就
    // 目前来看，goctl 并未使用。
    foo: bar
)
```

#### 服务条目

服务条目（ServiceItemStmt）是对单个 HTTP 请求的描述，包括 @doc 语句，handler 语句，路由语句信息，其 EBNF 表示为：

```go
ServiceItemStmt = [ AtDocStmt ] AtHandlerStmt RouteStmt .
```

##### @doc 语句

@doc 语句是对单个路由的 meta 信息描述，一般为 key-value 值，可以传递给 goctl 及其插件来进行扩展生成，其 EBNF 表示为：

```go
AtDocStmt        = AtDocLiteralStmt | AtDocGroupStmt .
AtDocLiteralStmt = "@doc" interpreted_string_lit .
AtDocGroupStmt   = "@doc" "(" { AtDocKVExpr } ")" .
AtDocKVExpr      = AtServerKeyLit  interpreted_string_lit .
AtServerKeyLit   = identifier ":" .
```

@doc 写法示例：

```go
// 单行 @doc
@doc "foo"

// 空 @doc 组
@doc ()

// 有内容的 @doc 组
@doc (
    foo: "bar"
    bar: "baz"
)
```

##### @handler 语句

@handler 语句是对单个路由的 handler 信息控制，主要用于生成 golang http.HandleFunc 的实现转换方法，其 EBNF 表示为：

```go
AtHandlerStmt = "@handler" identifier .
```

@handler 写法示例：

```go
@handler foo
```

##### 路由语句

路由语句是对单此 HTTP 请求的具体描述，包括请求方法，请求路径，请求体，响应体信息，其 EBNF 表示为：

```go
RouteStmt = Method PathExpr [ BodyStmt ] [ "returns" ] [ BodyStmt ].
Method    = "get"     | "head"    | "post" | "put" | "patch" | "delete" |
            "connect" | "options" | "trace" .
PathExpr  = "/" identifier { ( "-" identifier ) | ( ":" identifier) } .
BodyStmt  = "(" identifier ")" .
```

路由语句写法示例：

```go
// 没有请求体和响应体的写法
get /ping

// 只有请求体的写法
get /foo (foo)

// 只有响应体的写法
post /foo returns (foo)

// 有请求体和响应体的写法
post /foo (foo) returns (bar)
```

service 写法示例

```go
// 带 @server 的写法
@server (
    prefix: /v1
    group: Login
)
service user {
    @doc "登录"
    @handler login
    post /user/login (LoginReq) returns (LoginResp)

    @handler getUserInfo
    get /user/info/:id (GetUserInfoReq) returns (GetUserInfoResp)
}
@server (
    prefix: /v1
    middleware: AuthInterceptor
)
service user {
    @doc "登录"
    @handler login
    post /user/login (LoginReq) returns (LoginResp)

    @handler getUserInfo
    get /user/info/:id (GetUserInfoReq) returns (GetUserInfoResp)
}


// 不带 @server 的写法
service user {
    @doc "登录"
    @handler login
    post /user/login (LoginReq) returns (LoginResp)

    @handler getUserInfo
    get /user/info/:id (GetUserInfoReq) returns (GetUserInfoResp)
}
```

:::note 温馨提示
完整的 api 语法示例可参考 <a href="/docs/reference" target="_blank">《API 定义完整示例》</a>
:::

## 参考文献

[抽象语法树-维基百科](https://zh.m.wikipedia.org/zh-cn/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9)
[ASTs - What are they and how to use them](https://www.twilio.com/blog/abstract-syntax-trees)
