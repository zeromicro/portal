---
title: swagger
slug: /docs/tutorials/cli/swagger
---

import { Image } from '@arco-design/web-react';

Generate Swagger documents based on API files, and support the generation of documents in JSON and YAML formats.

:::note Tips
The current function is in the experimental stage, and the requirements are:
1. The version of goctl is greater than 1.8.2.
2. Enable the experimental function.
```bash
goctl env -w GOCTL_EXPERIMENTAL=on
```
:::

## Command

```bash
goctl api swagger -h
Generate swagger file from api

Usage:
  goctl api swagger [flags]

Flags:
      --api string   The api file
      --dir string   The target dir
  -h, --help         help for swagger
      --yaml         Generate swagger yaml file, default to json
```

## api 写法示例

1. All the information such as the title, description, version, protocol, contact person, license, host, and basePath of Swagger is written in the api info, and you can refer to the following api examples.
2. If the generated Swagger needs to be wrapped with the code-msg package, you can enable wrapCodeMsg in the info description and set it to a true string. The generated response body examples and models will be wrapped with code-msg, and the format template is as follows:
```json
{
  "code": $code,
  "msg": $msg,
  "data": $responseData
}
```

Example:

```json
{
    "code": 0,
    "msg": "ok",
    "data": {
      "id": 1,
      "name": "keson.an"
    }
}
```
3. Custom business error codes: When wrapCodeMsg is enabled, you can enumerate and describe business error codes through the bizCodeEnumDescription field in api info, which makes it convenient to render the enumeration information into the swagger document when generating swagger. The syntax can be referred to the following example.
4. Group APIs, corresponding to Swagger's tags. You can group them using the tags field in @server. The tags field supports multiple groupings, and multiple groupings should be separated by commas.
5. For other Swagger instructions, you can refer to the examples below.

```go
syntax = "v1"

info (
	title:                  "Demo API" // title corresponding to Swagger
	description:            "Generating Swagger files using the API demo." // description corresponding to Swagger
	version:                "v1" // version corresponding to Swagger
	termsOfService:         "https://github.com/zeromicro/go-zero" // termsOfService corresponding to Swagger
	contactName:            "keson.an" // contactName corresponding to Swagger
	contactURL:             "https://github.com/zeromicro/go-zero" // contactURL corresponding to Swagger
	contactEmail:           "example@gmail.com" // contactEmail corresponding to Swagger
	licenseName:            "MIT" // licenseName corresponding to Swagger
	licenseURL:             "https://github.com/zeromicro/go-zero" // licenseURL corresponding to Swagger
	consumes:               "application/json" // consumes corresponding to Swagger,default value is `application/json`
	produces:               "application/json" // produces corresponding to Swagger,default value is `application/json`
	schemes:                "https" // schemes corresponding to Swagger,default value is `https``
	host:                   "example.com" // host corresponding to Swagger,default value is `127.0.0.1`
	basePath:               "/v1" // basePath corresponding to Swagger,default value is `/`
	wrapCodeMsg:            "true" // to wrap in the universal code-msg structure, like {"code":0,"msg":"OK","data":$data}
	bizCodeEnumDescription: "1001-User not login<br>1002-User permission denied" // enums of business error codes, in JSON format, with the key being the business error code and the value being the description of that error code. This only takes effect when wrapCodeMsg is set to true.
)

type (
	QueryReq {
		Id     int    `form:"id,range=[1:10000],example=10"`
		Name   string `form:"name,example=keson.an"`
		Avatar string `form:"avatar,optional,example=https://example.com/avatar.png"`
	}
	QueryResp {
		Id   int    `json:"id,example=10"`
		Name string `json:"name,example=keson.an"`
	}
	PathQueryReq {
		Id   int    `path:"id,range=[1:10000],example=10"`
		Name string `form:"name,example=keson.an"`
	}
	PathQueryResp {
		Id   int    `json:"id,example=10"`
		Name string `json:"name,example=keson.an"`
	}
)

@server (
	tags:    "query" // tags corresponding to Swagger
	summary: "query API set" // summary corresponding to Swagger
)
service Swagger {
	@doc (
		description: "query demo"
	)
	@handler query
	get /query (QueryReq) returns (QueryResp)

	@doc (
		description: "show path query demo"
	)
	@handler queryPath
	get /query/:id (PathQueryReq) returns (PathQueryResp)
}

type (
	FormReq {
		Id   int    `form:"id,range=[1:10000],example=10"`
		Name string `form:"name,example=keson.an"`
	}
	FormResp {
		Id   int    `json:"id,example=10"`
		Name string `json:"name,example=keson.an"`
	}
)

@server (
	tags:    "form" // tags corresponding to Swagger
	summary: "form API set" // summary corresponding to Swagger
)
service Swagger {
	@doc (
		description: "form demo"
	)
	@handler form
	post /form (FormReq) returns (FormResp)
}

type (
	JsonReq {
		Id       int    `json:"id,range=[1:10000],example=10"`
		Name     string `json:"name,example=keson.an"`
		Avatar   string `json:"avatar,optional"`
		Language string `json:"language,options=golang|java|python|typescript|rust"`
		Gender   string `json:"gender,default=male,options=male|female,example=male"`
	}
	JsonResp {
		Id       int    `json:"id"`
		Name     string `json:"name"`
		Avatar   string `json:"avatar"`
		Language string `json:"language"`
		Gender   string `json:"gender"`
	}
	ComplexJsonLevel2 {
		// basic
		Integer int     `json:"integer,example=1"`
		Number  float64 `json:"number,example=1.1"`
		Boolean bool    `json:"boolean,options=true|false,example=true"`
		String  string  `json:"string,example=some text"`
	}
	ComplexJsonLevel1 {
		// basic
		Integer int     `json:"integer,example=1"`
		Number  float64 `json:"number,example=1.1"`
		Boolean bool    `json:"boolean,options=true|false,example=true"`
		String  string  `json:"string,example=some text"`
		// Object
		Object        ComplexJsonLevel2  `json:"object"`
		PointerObject *ComplexJsonLevel2 `json:"pointerObject"`
	}
	ComplexJsonReq {
		// basic
		Integer int     `json:"integer,example=1"`
		Number  float64 `json:"number,example=1.1"`
		Boolean bool    `json:"boolean,options=true|false,example=true"`
		String  string  `json:"string,example=some text"`
		// basic array
		ArrayInteger []int     `json:"arrayInteger"`
		ArrayNumber  []float64 `json:"arrayNumber"`
		ArrayBoolean []bool    `json:"arrayBoolean"`
		ArrayString  []string  `json:"arrayString"`
		// basic array array
		ArrayArrayInteger [][]int     `json:"arrayArrayInteger"`
		ArrayArrayNumber  [][]float64 `json:"arrayArrayNumber"`
		ArrayArrayBoolean [][]bool    `json:"arrayArrayBoolean"`
		ArrayArrayString  [][]string  `json:"arrayArrayString"`
		// basic map
		MapInteger map[string]int     `json:"mapInteger"`
		MapNumber  map[string]float64 `json:"mapNumber"`
		MapBoolean map[string]bool    `json:"mapBoolean"`
		MapString  map[string]string  `json:"mapString"`
		// basic map array
		MapArrayInteger map[string][]int     `json:"mapArrayInteger"`
		MapArrayNumber  map[string][]float64 `json:"mapArrayNumber"`
		MapArrayBoolean map[string][]bool    `json:"mapArrayBoolean"`
		MapArrayString  map[string][]string  `json:"mapArrayString"`
		// basic map map
		MapMapInteger map[string]map[string]int     `json:"mapMapInteger"`
		MapMapNumber  map[string]map[string]float64 `json:"mapMapNumber"`
		MapMapBoolean map[string]map[string]bool    `json:"mapMapBoolean"`
		MapMapString  map[string]map[string]string  `json:"mapMapString"`
		// Object
		Object        ComplexJsonLevel1  `json:"object"`
		PointerObject *ComplexJsonLevel1 `json:"pointerObject"`
		// Object array
		ArrayObject        []ComplexJsonLevel1  `json:"arrayObject"`
		ArrayPointerObject []*ComplexJsonLevel1 `json:"arrayPointerObject"`
		// Object map
		MapObject        map[string]ComplexJsonLevel1  `json:"mapObject"`
		MapPointerObject map[string]*ComplexJsonLevel1 `json:"mapPointerObject"`
		// Object array array
		ArrayArrayObject        [][]ComplexJsonLevel1  `json:"arrayArrayObject"`
		ArrayArrayPointerObject [][]*ComplexJsonLevel1 `json:"arrayArrayPointerObject"`
		// Object array map
		ArrayMapObject        []map[string]ComplexJsonLevel1  `json:"arrayMapObject"`
		ArrayMapPointerObject []map[string]*ComplexJsonLevel1 `json:"arrayMapPointerObject"`
		// Object map array
		MapArrayObject        map[string][]ComplexJsonLevel1  `json:"mapArrayObject"`
		MapArrayPointerObject map[string][]*ComplexJsonLevel1 `json:"mapArrayPointerObject"`
	}
	ComplexJsonResp {
		// basic
		Integer int     `json:"integer,example=1"`
		Number  float64 `json:"number,example=1.1"`
		Boolean bool    `json:"boolean,options=true|false,example=true"`
		String  string  `json:"string,example=some text"`
		// basic array
		ArrayInteger []int     `json:"arrayInteger"`
		ArrayNumber  []float64 `json:"arrayNumber"`
		ArrayBoolean []bool    `json:"arrayBoolean"`
		ArrayString  []string  `json:"arrayString"`
		// basic array array
		ArrayArrayInteger [][]int     `json:"arrayArrayInteger"`
		ArrayArrayNumber  [][]float64 `json:"arrayArrayNumber"`
		ArrayArrayBoolean [][]bool    `json:"arrayArrayBoolean"`
		ArrayArrayString  [][]string  `json:"arrayArrayString"`
		// basic map
		MapInteger map[string]int     `json:"mapInteger"`
		MapNumber  map[string]float64 `json:"mapNumber"`
		MapBoolean map[string]bool    `json:"mapBoolean"`
		MapString  map[string]string  `json:"mapString"`
		// basic map array
		MapArrayInteger map[string][]int     `json:"mapArrayInteger"`
		MapArrayNumber  map[string][]float64 `json:"mapArrayNumber"`
		MapArrayBoolean map[string][]bool    `json:"mapArrayBoolean"`
		MapArrayString  map[string][]string  `json:"mapArrayString"`
		// basic map map
		MapMapInteger map[string]map[string]int     `json:"mapMapInteger"`
		MapMapNumber  map[string]map[string]float64 `json:"mapMapNumber"`
		MapMapBoolean map[string]map[string]bool    `json:"mapMapBoolean"`
		MapMapString  map[string]map[string]string  `json:"mapMapString"`
		// Object
		Object        ComplexJsonLevel1  `json:"object"`
		PointerObject *ComplexJsonLevel1 `json:"pointerObject"`
		// Object array
		ArrayObject        []ComplexJsonLevel1  `json:"arrayObject"`
		ArrayPointerObject []*ComplexJsonLevel1 `json:"arrayPointerObject"`
		// Object map
		MapObject        map[string]ComplexJsonLevel1  `json:"mapObject"`
		MapPointerObject map[string]*ComplexJsonLevel1 `json:"mapPointerObject"`
		// Object array array
		ArrayArrayObject        [][]ComplexJsonLevel1  `json:"arrayArrayObject"`
		ArrayArrayPointerObject [][]*ComplexJsonLevel1 `json:"arrayArrayPointerObject"`
		// Object array map
		ArrayMapObject        []map[string]ComplexJsonLevel1  `json:"arrayMapObject"`
		ArrayMapPointerObject []map[string]*ComplexJsonLevel1 `json:"arrayMapPointerObject"`
		// Object map array
		MapArrayObject        map[string][]ComplexJsonLevel1  `json:"mapArrayObject"`
		MapArrayPointerObject map[string][]*ComplexJsonLevel1 `json:"mapArrayPointerObject"`
	}
)

@server (
	tags:    "postJson" // tags corresponding to Swagger
	summary: "json API set" // summary corresponding to Swagger
)
service Swagger {
	@doc (
		description: "simple json request body API"
	)
	@handler jsonSimple
	post /json/simple (JsonReq) returns (JsonResp)

	@doc (
		description: "complex json request body API"
	)
	@handler jsonComplex
	post /json/complex (ComplexJsonReq) returns (ComplexJsonResp)
}


```

## swagger demo

<Image
src={require('../../resource/tutorials/cli/swagger-ui-example.png').default}
alt='swagger ui'
/>


