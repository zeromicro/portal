---
title: Response Parameters
sidebar_label: Response Parameters
slug: /docs/tutorials/http/server/response-body
---

## Overview

In go-zero, the `Write` method of `http.ResponseWriter` is supported to return the response parameters, and the `Header` method of `http.ResponseWriter` is supported to return the response headersFor other response formats, see <https://github.com/zeromicro/x/blob/main/http/responses.go> , currently <a href="https://github.com/zeromicro/x" target="_blank">zeromicro/x</a> implements an extension to xml.

## Sample

### Json Response Parameters

```go
type Response struct {
    Name   string `json:"name"`
    Age    int    `json:"age"`
}

resp := &Response{Name: "jack", Age: 18}
httpx.OkJson(w, resp)
```
