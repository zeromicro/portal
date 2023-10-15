---
title: Parameter Rules
slug: /docs/tutorials/api/parameter
---

## Overview

In go-zero, we declared HTTP service via api language, and then generated HTTP service code via goctl, after our systematic introduction to <a href="/docs/tutorials" target="_blank">API norm</a>.

The rules for checking parameters are already embedded in go-zero. Next, look at the rules for receiving/checking the parameters in go-zero.

## Arguments Receive Rules

In the api description language, we can declare the parameter receiving rules in the tag. Currently, the parameter receiving rules supported by go-zero are as follows:

| <img width={100} />Receive rules | Note                                                                                                                                                | <img width={150} />Scope of entry | Sample                          |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------- |
| json                                              | json serialization                                                                                                                                  | Request Body&Response                              | \`json:"foo"\`              |
| path                                              | Route parameters                                                                                                                                    | Request Body                                       | \`path:"id"\`               |
| form                                              | post request form (supported for content-type `-data` and `x-www-urrencoded`) parameter request receiving identifier, get requested query parameter | Request Body                                       | \`form:"name"\`             |
| header                                            | HTTP Request Receipt Identifier                                                                                                                     | Request Body                                       | \`header:"Content-Length"\` |

:::note Warm reminder
go-zero does not support multiple tags to receive parameters, that is, a field can only have one tag, and the following writing may cause the parameters to not be received:

```go
type Foo {
    Name string `json:"name" form:"name"`
}
```

:::

## Parameter verification rules

In the api description language, we can state the acceptance rules for parameters in a tag in a tag. In addition to this we also support the verification of parameters, which are valid only for **request** , the parameter validation rule is written in tag value, currently supported by go-zero the following parameters：

| <img width={100} />Receive rules | Note                                                                                                                  | Sample                            |
|----------------------------------| --------------------------------------------------------------------------------------------------------------------- |-----------------------------------|
| optional                         | The current field is an optional parameter, allowing zero value (zero value)                                          | \`json:"foo,optional"\`           |
| options                          | Current parameter can only receive an enumeration value                                                               | \`json:"gender,options=foo\|bar"\` |
| default                          | Current Argument Default                                                                                              | \`json:"gender,default=male"\`    |
| range                            | The valid range of the current parameter value, only valid for the value. Details of the writing rule are given below | \`json:"age,range=[0:120]"\`      |

::note range expressed value rule

1. Left close interval：(min:max], meaning that min is less than or equal to max, when min is default, min represents value 0, max is unlimited when max is default, min and max are not allowed to default at the same time
1. Left right interval：[min:max), which indicates that it is less than min max, when max is default, max represents a value of 0, min is large when min is missing
1. Shutdown interval：[min:max], denotes less than min less than equals max, when min is default, min represents value 0, max is infinite when max is default, min and max are not allowed to coalesce
1. Open interval：(min:max), indicates that min is less than max, when min is default, min represents a value of 0, max is large when max is default,min and max cannot be used simultaneous
:::
