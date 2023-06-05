---
title: API specification
sidebar_label: API specification
slug: /docs/tutorials
---

## Overview

api is the domain characteristic language of go-zero (below is api language or api description), which is intended to humanize as the most basic description language for generating HTTP services.

The api field feature language contains syntax versions, info blocks, structural statements, service descriptions, etc., where the structure is almost the same as the Golang structural syntax, but only the `structure` keywords.

## Targets

- Learning sex
- Readability
- Expansion Freedom
- HTTP Service 1 click to generate
- Write an api file to generate multilingual code services

## Syntax Token

api syntax is described using [ to extend the Bakos style(EBNF)](https://zh.m.wikipedia.org/zh-sg/%E6%89%A9%E5%B1%95%E5%B7%B4%E7%A7%91%E6%96%AF%E8%8C%83%E5%BC%8F) and specified in the extended Bakos style.

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

`Production` is composed of `Term` and the following operators, with the following operators' priority increasing：

```text
|   alternation
()  grouping
[]  option (0 or 1 times)
{}  repetition (0 to n times)
```

Form `a...b` indicates a set of characters from a to b as an alternative, eg. `0...9` represents a valid number from 0 to 9.

`` for ENBF end symbols.

::note  
Generate names if lowercase, then end token,camel peak production names are non-terminator token, e.g.：

```ebnf
// 终结 token
number = "0"..."9" .
lower_letter = "a"..."z" .

// 非终结 token
DataType = TypeLit | TypeGroup .
TypeLit  = TypeAlias | TypeStruct .
```

:::

## Source representation

Source code representation is the most basic element used to describe api syntax.

### Characters

```text
newline = /* indicates line replacement, Unicode value is U+000A */ .
unicode_char = /* Unicode characters other than newline newline.*/
unicode_letter = /* letter a.z|A..Z Unicode */
unicode_digit = /* value 0...9 Unicode */
```

### Letters and Numbers

Underline character `_` (U+005F) is considered to be lowercase.

```text
letter        = "A"..."Z" | "a"..."z" | "_" .
decimal_digit = "0" … "9" .
```

## Abstract syntax tree

Abstract tree (**A**bstract **S**yntax **T**ree, AST), or syntax tree (Syntax tree), is an abstract expression of source syntax structure.It presents the syntax structure of the programming language in a tree and each node on the tree denotes a structure in the source code.The expression is “abstract” because the syntax does not indicate every detail that appears in the true syntax.For example, nested brackets are implicit in the tree structure and are not presented in the form of nodes; and a condition like if-condition-then can be represented by nodes with three branches.

The abstract syntax tree is the tree of the code.They are an essential component of the compiler's modus operandi.When the compiler converts some code, there are basically the following steps：

- Lexical Analysis
- Syntax Analysis
- Code Generation

![AST process](./resource/tasks/dsl/ast-process.png)

<center>
  AST Analytics Process
</center>

### Lexical Analysis

Lexical Analysis is a process in computer science to convert character sequences to token (token) sequences.The procedure or function for the analysis of the word is called the word analyst (lexical analyzer, abbreviation), also known as scanner.The semiconductor is generally in the form of a function, for syntax analyst calls.

In api language, word analysis is a process of converting characters to a dictionary of synonyms, including `comments` and `Token`.

#### Word Element

##### Note

2 formats in api field feature language：

1. One line notes start with `//` and end of line.

   ```go
   // This is an example of a single line comment
   ```

2. Multi-line comment (document note) starts with `/*` and ends with first `*/`.

   ```go
   /*This is the document annotation */
   /*
   in multiple lines of document annotation
*/
   ```

##### Token

Token is the most basic element of the constituent node consisting of `identifier (identifier)`,`keyword (keyword)`,`operator (operator)`,`punctuation)`,`word volume (literal)`,`Whitespace (White space)`Generically by`spaces (U+0020)`,`Horizontal tabs (U+0009)`,`Car returns (U+000D)`and `newlines (U+000A)`In api language, Token does not contain `operator(operator)`.

The Golang Structure of Token is defined as：

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

Example api statement `syntax="v1"` its word is：

| Text   | DataType    |
| ------ | ----------- |
| syntax | Identifiers |
| =      | Operator    |
| "v1"   | String      |

###### ID

ID 标识符一般是结构体，变量，类型等的名称实体，ID 标识符一般有 1 到 n 个字母和数字组成，且开头必须为字母（记住上文提到的 `_` 也被当做小写字母看待），其 EBNF 表示法为：

```ebnf
identifier = letter { letter | unicode_digit } .
```

ID Identifier Example：

```text
a
_a1
GoZero
```

The ID identifier is pre-defined,api follows [Golang Predefined ID identifier](https://go.dev/ref/spec#Predeclared_identifiers).

```go
Predefined type:
    any bool byte comparable
    complex64 complex128 error float32 float64
    int int8 int16 int32 int64 rune string
    uint uint8 uint16 uint32 uint64 uintptr

predefined constants:
    true false iota

zero:
    nil

predefined functions:
    append cap close complex copy delete imag len
    make new panic print println real recover
```

###### Keywords

The keywords are some special ID identifiers, are system reserved, api keywords follow Golang keyword, and Golang keywords cannot be used as identifiers in the structure.

Golang Keywords

```go
break        default      func         interface    select
case         defer        go           map          struct
chan         else         goto         package      switch
const        fallthrough  if           range        type
continue     for          import       return       var
```

###### Punctuation Marks

Punctuation can be used to split token, expressions, groups, and below is punctuation in api language：

```text
-    ,    (    )
*    .    [    ]
/    ;    {    }
=    :    ,    ;
...
```

###### String

String font volume is a constant of a sequence of characters.Golang strings are used in api, with 2 forms： original string (raw string) and normal string (double quote).

The string sequence of the original string is between two dequotation marks, except for a counterquotation number, any character can appear, such as \`foo\`；

The string sequence of a normal string is between two quotes except two quotes and any characters can appear, like "foo".

:::note
In api language, the double quotation string does not support `\"` to implement string.
:::

```ebnf
string_lit             = raw_string_lit | interpreted_string_lit .
raw_string_lit         = "`" { unicode_char | newline } "`" .
interpreted_string_lit = `"` { unicode_value | byte_value } `"` .
```

String Example：

```text
// Original string
``
`foo`
`bar`
`json:"baz"`

// normal string
""
"foo"
"bar"
```

### Syntax analysis

Syntax Analysis is also called syntax resolution, which is the process of converting the synonym element into a tree, whereas the syntax tree generally consists of nodes (Node), expression (Expression) and statement (Statement) which, in addition to the translation of terms into trees, require the completion of a semantic analysis.

#### Node

Node is a variation of token, an interface type, a basic element of an expression and statement, defined as： in a structure in Golang

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

#### Expression

Expression are the basic element of the constituent statement. They can be understood as "phrases" in a sentence and the expression contained in api language as follows:：

1. Data Type Expression
1. Field expression in structure
1. key-value expression
1. Service Declaration Expression
1. HTTP Request/Response Body Expression
1. HTTP Router Expression

The structure of Golang in api is defined as：

```go
// Expr represents an expression in the AST.
type Expr interface {
    Node
    exprNode()
}
```

#### Statement

Statement is the basic element of the abstract syntax tree, which can be understood as an article, and statement is a number of sentences that make up the article, and the api language contains statements as follows:

1. @doc statement
1. @handler statement
1. @server statement
1. Request / Response Body Statement for HTTP Service
1. Comment statement
1. Import statement
1. info statement
1. HTTP Router Expression
1. HTTP service declaration statement
1. Syntax statement
1. Structure statement

The structure of Golang in api is defined as：

```go
// Stmt represents a statement in the AST.
type Stmt interface {
    Node
    stmtNode()
}
```

### Code Generation

Once we have an abstract syntax tree, we can use it to print or generate different codes, which can be supported by api abstract syntax when it is done：

1. Print AST
1. api file format
1. Golang HTTP Service Generation
1. TypeScript Code Generation
1. Dart code generation
1. Kotlin Code Generation

In addition to this, extensions can be made based on AST such as plugin：

1. goctl-go-compact
1. goctl-swagger
1. goctl-php

## api syntax marker

```go
api = SyntaxStmt | InfoStmt | { ImportStmt } | { TypeStmt } | { ServiceStmt } .
```

### Syntax statement

Syntax statements are used to mark the api language version, different versions may have different syntax structures and are optimized as versions are upgraded, the current version is `v1`.

EBNF syntax expressed as：

```go
SyntaxStmt = "syntax" "=" "v1" .
```

syntax example：

```go
syntax = "v1"
```

### info statement

info is meta information in api language that is only used to describe the current api file,**Advertisement**does not participate in code generation, it differs from annotation but notes generally exist with a syntax that is used to describe the entire api message, of course, does not exclude future participation in code generation: EBNF for info is：

```go
InfoStmt         = "info" "(" { InfoKeyValueExpr } ")" .
InfoKeyValueExpr = InfoKeyLit [ interpreted_string_lit ] .
InfoKeyLit       = identifier ":" .
```

info writing sample：

```go
// Block of info without key-value
info ()

// blocks containing key-value
info (
    foo: "bar"
    bar:
)
```

### Import statement

`import` statements are syntax blocks to introduce other api files in api, which support relative/absolute path,**does not support** `package` design whose EBNF is：

```go
ImportStmt        = ImportLiteralStmt | ImportGroupStmt .
ImportLiteralStmt = "import" interpreted_string_lit .
ImportGroupStmt   = "import" "(" { interpreted_string_lit } ")" .
```

`import` statement writing sample：

```go
// Single line import
import "foo"
import "/path/to/file"

// import group
import ()
import (
    "bar"
    "relative/to/file"
)
```

### Data Type

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

Sample data type writing：

```go
// Alias [1]
type Int int
type Integer = int

// Empty structure
type Foo {}

// Structrue literal
type Bar {
    Foo int               `json:"foo"`
    Bar bool              `json:"bar"`
    Baz []string          `json:"baz"`
    Qux map[string]string `json:"qux"`
}

type Baz {
    Bar    `json:"baz"`
    // inline [2]
    Qux {
        Foo string `json:"foo"`
        Bar bool   `json:"bar"`
    } `json:"baz"`
}

// Empty type group
type ()

// Type Group
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

:::caution takes note of
[1] While aliases are supported in syntax, alias are intercepted during semicolon analysis, or will be liberalized in the future.

[2] While syntax supports inline structures, alias are intercepted when semicolon analyses, this will or will be liberalized in the future.

In addition：

1. The current api syntax supports an array but blocks an array during semiconductor analysis and is currently proposed to replace it with a slice or be released in the future.
2. Package design is not supported, e.g. `time.Time`.

:::

### Service statement

The service statement is a visual description of the HTTP service, which contains definitions of requests to handler, request method, request routing, requester, response,jwt switch, intermediate declaration etc.

Its EBNF expression is：

```go
ServiceStmt     = [ AtServerStmt ] "service" ServiceNameExpr "("
                  { ServiceItemStmt } ")" .
ServiceNameExpr = identifier [ "-api" ] .
```

#### @server statement

@server is a meta description of a service statement that contains but is not limited to：

- jwt switch
- Middleware
- Route Group
- Route Prefix

EBNF for @server expressed as：

```go
AtServerStmt     = "@server" "(" {  AtServerKVExpr } ")" .
AtServerKVExpr   = AtServerKeyLit [ AtServerValueLit ] .
AtServerKeyLit   = identifier ":" .
AtServerValueLit = PathLit | identifier { "," identifier } .
PathLit          = `"` { "/" { identifier | "-" identifier} } `"` .
```

@server write sample：

```go
// Empty content
@server()

// has content
@server (
    // jwt declaration
    // if key is fixed as 'jwt:', On behalf of the jwt credit declaration
    // value for the configuration file structure name
    jwt: Auth

    // Route prefix
    // If the key is fixed to 'prefix:'
    // for routing prefix statement, alue is a specific routing prefix value, The string does not let it start with /
    prefix: /v1

    // routing group
    // if key is fixed to 'group:', Group statements on behalf of routing groups
    // value for specific groupings, Goctl Generates code by grouping folders according to this value
    group: Foo

    // Middle
    // If key is fixed to middle leware:", For intermediate declaration
    //value for specific intermediate function name, Goctl Generates the intermediate function based on this value
    middleware: AuthorInterceptor

    // Timeout control
    // If key is fixed to timeout:", Represents timeout configurations for
    // value for specific duration, and when goctl is generated the timeout for this value
    timeout: 3s

    // other key-value, In addition to these built-in keys, other key-values
    // can also be passed to goctl and its plugins as an annotation message, but for
    // currently, goctl is not used.
    foo: bar
)
```

#### ServiceItemStmt

ServiceItemStmt is a description of a HTTP request, including @doc statement, handler statement, routing information, its EBNF expression is：

```go
ServiceItemStmt = [ AtDocStmt ] AtHandlerStmt RouteStmt .
```

##### @doc statement

The @doc statement is a meta information description for a single route, generally key-value and can be passed to goctl and its plugins for extension generation, EBNF representation is：

```go
AtDocStmt        = AtDocLiteralStmt | AtDocGroupStmt .
AtDocLiteralStmt = "@doc" interpreted_string_lit .
AtDocGroupStmt   = "@doc" "(" { AtDocKVExpr } ")" .
AtDocKVExpr      = AtServerKeyLit  interpreted_string_lit .
AtServerKeyLit   = identifier ":" .
```

@doc Example writing：

```go
// doc doc
@doc "foo"

// empty @doc group
@doc ()

// @doc group with content
@doc (
    foo: "bar"
    bar: "baz"
)
```

##### @handler statement

@handler is handler information control over a single route, mainly used to generate golang http.HandleFunc, its EBNF expressed as：

```go
AtHandlerStmt = "@handler" identifier .
```

@handler writing sample：

```go
@handler foo
```

##### Routing statement

Routing statements are a specific description of this single HTTP request, including request method, request path, request, response body, EBNF representation as：

```go
RouteStmt = Method PathExpr [ BodyStmt ] [ "returns" ] [ BodyStmt ].
Method    = "get"     | "head"    | "post" | "put" | "patch" | "delete" |
            "connect" | "options" | "trace" .
PathExpr  = "/" identifier { ( "-" identifier ) | ( ":" identifier) } .
BodyStmt  = "(" identifier ")" .
```

Router statement writing sample：

```go
// There is no request and response policy
get /ping

// / only the requesting body
get /foo (foo)

// Only the responding body
post /foo returns (foo)

// The request and response body
post /foo (foo) returns (bar)
```

Sample service writing

```go
// with syntax @server
@server (
    prefix: /v1
    group: Login
)
service user {
    @doc "login example"
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
    @doc "login example"
    @handler login
    post /user/login (LoginReq) returns (LoginResp)

    @handler getUserInfo
    get /user/info/:id (GetUserInfoReq) returns (GetUserInfoResp)
}


// without syntax @server
service user {
    @doc "login example"
    @handler login
    post /user/login (LoginReq) returns (LoginResp)

    @handler getUserInfo
    get /user/info/:id (GetUserInfoReq) returns (GetUserInfoResp)
}
```

:::note Tips
The full api syntax example can be referenced <a href="/docs/reference" target="_blank">Full Example of API Definitions</a>
:::

## References

[ Wikipedia AST ](https://zh.m.wikipedia.org/zh-cn/%E6%8A%BD%E8%B1%A1%E8%AA%9E%E6%B3%95%E6%A8%B9) [ What are they and how to use them](https://www.twilio.com/blog/abstract-syntax-trees)
