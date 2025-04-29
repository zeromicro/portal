---
title: swagger 生成
slug: /docs/tutorials/cli/swagger
---

import { Image } from '@arco-design/web-react';

根据 api 文件生成 swagger 文档，支持生成 json 和 yaml 格式的文档。

:::note 温馨提示
要求 goctl 版本大于1.8.2
:::

## 指令

```bash
goctl api swagger -h
Generate swagger file from api

Usage:
  goctl api swagger [flags]

Flags:
      --api string        api 文件
      --dir string        输出目录
      --filename string   生成的 swagger 文件名（不包括扩展名）
  -h, --help              help for swagger
      --yaml              是否生成 yaml 格式
```

## 主要特性说明

### 基础信息配置

在 info 中可以通过 `title`, `description`, `version` 等信息对 swagger 基本信息进行描述

```go
info (
    title: "演示 API"                        // 对应 swagger 中的标题
    description: "演示 api 生成 swagger..."  // 对应 swagger 中的描述
    version: "v1"                            // 对应 swagger 中的版本
)
```

<Image
src={require('../../resource/tutorials/cli/info_basic.png').default}
alt='swagger info'
/>

### 服务条款与联系人

在 info 中可以通过 `termsOfService`, `contactName`, `contactURL`, `contactEmail` 等信息对 swagger 服务条款与联系人信息进行说明

```go
info (
    termsOfService: "https://github.com/zeromicro/go-zero"  // API服务条款URL
    contactName: "keson.an"                                // 技术支持联系人姓名
    contactURL: "https://github.com/zeromicro/go-zero"     // 联系人相关链接
    contactEmail: "example@gmail.com"                      // 联系人邮箱
)
```

### 许可证信息

在 info 中可以通过 `licenseName`, `licenseURL` 等信息对 swagger 许可证信息进行说明

```go
info (
    licenseName: "MIT"  // 许可证类型(如 MIT/Apache 2.0/GPL等)
    licenseURL: "https://github.com/zeromicro/go-zero/blob/master/LICENSE"  // 许可证详情URL
)
```

<Image
src={require('../../resource/tutorials/cli/info_contact.png').default}
alt='swagger info'
/>

### 协议与主机配置

在 info 中可以通过 `schemes`, `host`, `basePath` 等信息对 swagger 协议与主机进行配置

```go
info (
    consumes: "application/json"  // 默认请求内容类型，可配置多个用逗号分隔
    produces: "application/json"  // 默认响应内容类型，可配置多个用逗号分隔
    schemes: "https"              // 支持协议(http/https/ws/wss)，可配置多个
    host: "example.com"           // API服务主机地址(不带协议头)
    basePath: "/v1"               // API基础路径，所有接口都会添加此前缀
)
```

### 业务错误码定义

支持全局和接口级别的业务错误码定义：
前提是开启了 wrapCodeMsg，业务错误码说明是基于 code-msg 中 code 字段进行额外说明的。

```go
// 全局错误码描述定义
info (
    wrapCodeMsg: true // 注意：布尔值语法在 goctl 1.8.4 版本支持，老版本可写成 wrapCodeMsg: "true"
    bizCodeEnumDescription: "1001-未登录<br>1002-无权限操作"
)

// 接口级别错误码描述定义
service Swagger {
	@doc (
	    // 接口级别业务错误码枚举描述，会覆盖全局的业务错误码，json 格式,key 为业务错误码，value 为该错误码的描述，
	    // 仅当 wrapCodeMsg 为 true 时生效
	    // 注意，如果声明了 useDefinitions 为 true 时，方法级别业务错误码不会生效，因为对于复用的结构体在多个方法下如果业务不一样，无法都兼顾生成。
		bizCodeEnumDescription: " 1003-用不存在<br>1004-非法操作" 
	)
	@handler login
	post /user/login (UserLoginReq) returns (UserLoginResp)
}
```

<Image
src={require('../../resource/tutorials/cli/biz_code.png').default}
alt='swagger info'
/>

### code-msg 格式生成

在 info 中设置 wrapCodeMsg: "true" 后，所有响应体会被包装为 code-msg 格式，此格式仅对 swagger 生成有效，且字段名称为固定值，不可变更，和 go-zero 实际响应体无关联。

```go
// 开启 swagger 生成时使用 code-msg 格式包裹
info (
    wrapCodeMsg: true // 注意：布尔值语法在 goctl 1.8.4 版本支持，老版本可写成 wrapCodeMsg: "true"
)
```

生成的 code-msg 参考格式：

```json
{
  "code": 0,
  "msg": "OK",
  "data": {原响应体}
}
```

<Image
src={require('../../resource/tutorials/cli/code_msg.png').default}
alt='swagger info'
/>


### 自定义鉴权类型

通过 securityDefinitionsFromJson 定义多种鉴权方式，然后在 @server 中通过 `authType` 字段类声明该分组下的所有路由的鉴权方式。
api 鉴权 json 格式请参考 open api spec 标准说明，详情见 https://swagger.io/specification/v2/#security-definitions-object

```go
info (
    securityDefinitionsFromJson: `{"apiKey":{"type":"apiKey","name":"x-api-key","in":"header"},"petstore_auth":{"type":"oauth2","authorizationUrl":"http://swagger.io/api/oauth/dialog","flow":"implicit","scopes":{"write:pets":"modify pets in your account","read:pets":"read your pets"}}}`
)

@server (
    authType: apiKey // 声明/user/info 使用 apiKey 鉴权类型
)
service Swagger {
	@handler userInfo
	post /user/info (UserInfoReq) returns (UserInfoResp)
}
```

<Image
src={require('../../resource/tutorials/cli/auth_type_definition.png').default}
alt='swagger info'
/>

<Image
src={require('../../resource/tutorials/cli/auth_type_check.png').default}
alt='swagger info'
/>

### tags 分组

在 @server 中使用 tags 属性可在 swagger 中对路由进行分组，也兼容从 summary 关键字中获取，tags 声明的优先级高于 summary。

```go
@server (
    tags: "用户操作"
)
service Swagger {
	@handler login
	post /user/login (UserLoginReq) returns (UserLoginResp)
}

@server (
    tags: "用户操作"
)
service Swagger {
	@handler userInfo
	post /user/info (UserInfoReq) returns (UserInfoResp)
}
```

以上路由 `/user/login` 和 `/user/info`  都会被放在 swagger 的 `用户操作` 分组下。

<Image
src={require('../../resource/tutorials/cli/tags.png').default}
alt='swagger info'
/>

### 响应体示例展示

在结构体中通过 example 标签为字段可为响应体添加示例值，example 示例也支持 json 请求体。

```go
type UserInfoResp {
    Id int `json:"id,example=10"`
    Name string `json:"name,example=keson.an"`
}
```

<Image
src={require('../../resource/tutorials/cli/example.png').default}
alt='swagger info'
/>

### 参数控制

结构体支持 go-zero 参数标签：

- range: 数值范围限制，如 range=[1:10000]
- options: 枚举值限制，如 options=golang|java|python
- default: 默认值，如 default=male
- optional: 可选参数

```go
type  DemoReq {
    Id int `json:"id,range=[1:10000],example=10"`// 有效范围值
    Language string `json:"language,options=golang|java|python|typescript|rust"`// 枚举
    Gender string `json:"gender,default=male,options=male|female,example=male"`// 默认值
    Name string `json:"name,optional"` // 非必填
}
```

<Image
src={require('../../resource/tutorials/cli/parameter.png').default}
alt='swagger info'
/>

### 丰富的结构体类型

- 支持复杂嵌套结构体，包括：
- 基本类型及其数组、map
- 对象及其指针
- 多层嵌套结构
- 数组的数组、map 的 map 等复杂组合

```go
type ComplexJsonLevel2 {}
type ComplexJsonLevel1 {
    Integer int `json:"integer,example=1"`
    Object ComplexJsonLevel2 `json:"object"`
    PointerObject *ComplexJsonLevel2 `json:"pointerObject"`
}

type ComplexJsonReq {
    ArrayArrayInteger [][]int `json:"arrayArrayInteger"`
    MapMapObject map[string]map[string]ComplexJsonLevel1 `json:"mapMapObject"`
    ArrayPointerObject []*ComplexJsonLevel1 `json:"arrayPointerObject"`
}
```

<Image
src={require('../../resource/tutorials/cli/complex.png').default}
alt='swagger info'
/>

### path 参数

Path 参数是指直接嵌入在 URL 路径中的变量参数，在 API 定义中使用 path:"参数名" 标签声明，在生成 swagger 时会自动将 path 参数转化为 {$path} 这样的形式。

```go
type UserInfoReq {
    Id int `path:"id"`  // 定义 path 参数 id
}

type UserInfoResp{
    Id int `json:"id,example=10"`
    Name string `json:"name,example=keson.an"`
}

@server(
    prefix: /api
)
service Swagger {
    @handler userInfo
    get /user/info/:id (UserInfoReq) returns (UserInfoResp)  // URL 中使用 :id 匹配
}
```

<Image
src={require('../../resource/tutorials/cli/path_parameter.png').default}
alt='swagger info'
/>

### 生成 definitions 格式

如果你想对响应体或者 json 请求体生成为引用类型，即所有结构体都存放在 model 模型中，在使用到相关结构体时使用 `ref` 去关联，可以在 api info 中声明。
声明写法 `useDefinitions: true`， 写法示例：

```go
syntax = "v1"

info(
    ...
    useDefinitions: true // 注意：布尔值语法在 goctl 1.8.4 版本支持，老版本可写成 useDefinitions: "true"
    ...
)
...
```

<Image
src={require('../../resource/tutorials/cli/definitions.png').default}
alt='swagger info'
/>
