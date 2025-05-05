---
title: swagger generation
slug: /docs/tutorials/cli/swagger
---

import { Image } from '@arco-design/web-react';

Generate Swagger documentation from API files, supporting both JSON and YAML formats.

:::note Note
Requires goctl version greater than 1.8.2
:::

## Command

```bash
goctl api swagger -h
Generate swagger file from api

Usage:
  goctl api swagger [flags]

Flags:
      --api string   API file
      --dir string   Output directory
  -h, --help         Help for swagger
      --yaml         Generate YAML format
```

## Features

### Basic Information Configuration

n the info section, you can describe the basic information of Swagger using title, description, version, etc.

```go
info (
    title: "Demo API"                        // Corresponds to the title in Swagger
    description: "Demo API generates Swagger..."  // Corresponds to the description in Swagger
    version: "v1"                            // Corresponds to the version in Swagger
)
```

<Image
src={require('../../resource/tutorials/cli/info_basic.png').default}
alt='swagger info'
/>

### Terms of Service and Contact Information

In the info section, you can describe the terms of service and contact information using termsOfService, contactName, contactURL, contactEmail, etc.
```go
info (
    termsOfService: "https://github.com/zeromicro/go-zero"  // API terms of service URL
    contactName: "keson.an"                                // Technical support contact name
    contactURL: "https://github.com/zeromicro/go-zero"     // Contact-related link
    contactEmail: "example@gmail.com"                      // Contact email
)
```

### License Information

In the info section, you can describe the license information using licenseName, licenseURL, etc.

```go
info (
    licenseName: "MIT"  // License type (e.g., MIT/Apache 2.0/GPL, etc.)
    licenseURL: "https://github.com/zeromicro/go-zero/blob/master/LICENSE"  // License details URL
)
```

<Image
src={require('../../resource/tutorials/cli/info_contact.png').default}
alt='swagger info'
/>

### Protocol and Host Configuration

In the info section, you can configure the protocol and host using schemes, host, basePath, etc.

```go
info (
    consumes: "application/json"  // Default request content type, multiple values can be separated by commas
    produces: "application/json"  // Default response content type, multiple values can be separated by commas
    schemes: "https"              // Supported protocols (http/https/ws/wss), multiple values can be configured
    host: "example.com"           // API service host address (without protocol)
    basePath: "/v1"               // API base path, all endpoints will have this prefix
)
```

### Business Error Code Definition

Supports global and interface-level business error code definitions: Prerequisite: wrapCodeMsg is enabled. Business error code descriptions are based on the code field in code-msg.

```go
// Global error code description definition
info (
    wrapCodeMsg: "true"
    bizCodeEnumDescription: "1001-Not logged in<br>1002-No permission to operate"
)

// Interface-level error code description definition
service Swagger {
 @doc (
  bizCodeEnumDescription: "1003-User does not exist<br>1004-Illegal operation" // Interface-level business error code enumeration description, overrides global business error codes. JSON format, key is the business error code, value is the description of the error code. Only effective when wrapCodeMsg is true.
 )
 @handler login
 post /user/login (UserLoginReq) returns (UserLoginResp)
}

// Interface-level error code description definition
service Swagger {
 @doc (
  bizCodeEnumDescription: "1003-User does not exist<br>1004-Illegal operation" // Interface-level business error code enumeration description, overrides global business error codes. JSON format, key is the business error code, value is the description of the error code. Only effective when wrapCodeMsg is true.
 )
 @handler login
 post /user/login (UserLoginReq) returns (UserLoginResp)
}
```

<Image
src={require('../../resource/tutorials/cli/biz_code.png').default}
alt='swagger info'
/>

### Code-Message Format Generation

When wrapCodeMsg: "true" is set in the info section, all response bodies will be wrapped in a code-message format. This format is only effective for Swagger generation, and the field names are fixed and cannot be changed. It is unrelated to the actual response body of go-zero.

```go
// Enable code-message format wrapping for Swagger generation
info (
    wrapCodeMsg: "true"
)
```

Generated code-message format example:

```json
{
  "code": 0,
  "msg": "OK",
  "data": {original response body}
}
```

<Image
src={require('../../resource/tutorials/cli/code_msg.png').default}
alt='swagger info'
/>


### Custom Authentication Types

Define multiple authentication methods using securityDefinitionsFromJson, and declare the authentication type for all routes under a group using the authType field in @server. For the API authentication JSON format, refer to the OpenAPI Specification standard: https://swagger.io/specification/v2/#security-definitions-object

```go
info (
    securityDefinitionsFromJson: `{"apiKey":{"type":"apiKey","name":"x-api-key","in":"header"},"petstore_auth":{"type":"oauth2","authorizationUrl":"http://swagger.io/api/oauth/dialog","flow":"implicit","scopes":{"write:pets":"modify pets in your account","read:pets":"read your pets"}}}`
)

@server (
    authType: apiKey // Declare that /user/info uses the apiKey authentication type
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

### Tags Grouping

Use the tags attribute in @server to group routes in Swagger：

```go
@server (
    tags: "User Operations"
)
service Swagger {
 @handler login
 post /user/login (UserLoginReq) returns (UserLoginResp)
}

@server (
    tags: "User Operations"
)
service Swagger {
 @handler userInfo
 post /user/info (UserInfoReq) returns (UserInfoResp)
}
```

The above routes /user/login and /user/info will be grouped under the User Operations tag in Swagger.

<Image
src={require('../../resource/tutorials/cli/tags.png').default}
alt='swagger info'
/>

### Response Body Example Display

Use the example tag in structures to add example values for fields in the response body. The example tag also supports JSON request bodies.

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

### Parameter Control

Structures support go-zero parameter tags:

- range: Numeric range restriction, e.g., range=[1:10000]
- options: Enumeration value restriction, e.g., options=golang|java|python
- default: Default value, e.g., default=male
- optional: Optional parameter

```go
type DemoReq {
    Id int `json:"id,range=[1:10000],example=10"` // Valid range
    Language string `json:"language,options=golang|java|python|typescript|rust"` // Enumeration
    Gender string `json:"gender,default=male,options=male|female,example=male"` // Default value
    Name string `json:"name,optional"` // Optional
}
```

<Image
src={require('../../resource/tutorials/cli/parameter.png').default}
alt='swagger info'
/>

### Rich Structure Types

- Supports complex nested structures, including:
- Basic types and their arrays, maps
- Objects and their pointers
- Multi-level nested structures
- Complex combinations like arrays of arrays, maps of maps, etc

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

### Path Parameters

Path parameters are variable parameters embedded directly in the URL path. In API definitions, use the path:"parameterName" tag to declare them. When generating Swagger, path parameters will automatically be converted to {$path} format.

```go
type UserInfoReq {
    Id int `path:"id"`  // Define path parameter id
}

type UserInfoResp {
    Id int `json:"id,example=10"`
    Name string `json:"name,example=keson.an"`
}

@server(
    prefix: /api
)
service Swagger {
    @handler userInfo
    get /user/info/:id (UserInfoReq) returns (UserInfoResp)  // Use :id in the URL
}
```

<Image
src={require('../../resource/tutorials/cli/path_parameter.png').default}
alt='swagger info'
/>
