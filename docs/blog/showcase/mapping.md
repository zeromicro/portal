
# Mapping

The go-zero serialization and deserialization of text is used in three main places

* deserialization of http api request bodies
* Serialization of http api return body
* deserialization of configuration files

This article assumes that the reader has already defined the api file and modified the configuration file, if you are not familiar with it, you can refer to

* [Quickly build highly concurrent microservices](shorturl)

## 1. deserialization of http api request body

In the deserialization process, go-zero implements its own deserialization mechanism for request data `data format` and `data validation` requirements

### 1.1 `Data format` to order.api file as an example

```
type (
	createOrderReq struct {
		token string `path: "token"` // user token
		productId string `json: "productId"` // product ID
		num int `json: "num"` // number of products
	}
	createOrderRes struct {
		success bool `json: "success"` // success or not
	}
	findOrderReq struct {
		token string `path: "token"` // user token
		page int `form: "page"` // number of pages
		pageSize int8 `form: "pageSize"` // page size
	}
	findOrderRes struct {
		orderInfo []orderInfo `json: "orderInfo"` // product ID
	}
	orderInfo struct {
		productId string `json: "productId"` // product ID
		productName string `json: "productName"` // product name
		num int `json: "num"` // number of products
	}
	deleteOrderReq struct {
		id string `path: "id"`
	}
	deleteOrderRes struct {
		success bool `json: "success"` // whether it succeeded
	}
)

service order {
    @doc(
        summary: create order
    )
    @handler CreateOrderHandler
    post /order/add/:token(createOrderReq) returns(createOrderRes)

    @doc(
        summary: get order
    )
    @handler FindOrderHandler
    get /order/find/:token(findOrderReq) returns(findOrderRes)

    @doc(
        summary: delete an order
    )
    @handler: DeleteOrderHandler
    delete /order/:id(deleteOrderReq) returns(deleteOrderRes)
}
```

There are three types of tags for deserialization of http api request bodies.

* ``path``: parameter deserialization in http url path
  * ``/order/add/1234567`` will resolve the token to 1234567
* `form`: http form form deserialization, you need to add Content-Type: multipart/form-data in the header
  * `/order/find/1234567?page=1&pageSize=20` will parse out the token as 1234567, page as 1 and pageSize as 20

* `json`: http request json body deserialization, need header header add Content-Type: application/json
  * `{"productId": "321", "num":1}` will parse out productId as 321 and num as 1

### 1.2 `Data validation` using user.api file as an example

```
type (
	createUserReq struct {
		age int8 `json: "age,default=20,range=(12:100]"` // age
		name string `json: "name"` // Name
		alias string `json: "alias,optional"` // Alias
		sex string `json: "sex,options=male|female"` // Sex
		avatar string `json: "avatar,default=default.png"` // avatar
	}
	createUserRes struct {
		success bool `json: "success"` // success or not
	}
)

service user {
    @doc(
        summary: create order
    )
    @handler CreateUserHandler
    post /user/add(createUserReq) returns(createUserRes)
}
```

There are many ways to validate data, including but not limited to.

* ``age``: default is not entered as 20, enter then the range of values is (12:100], open and closed before
* `name`: required, cannot be empty
* `alias`: optional, can be empty
* `sex`: required, the value is `male` or `female`.
* `avatar`: optional, default is `default.png`

See [unmarshaler_test.go](https://github.com/zeromicro/go-zero/blob/master/core/mapping/unmarshaler_test.go) for more details

## 2. Serialization of http api return body

* Use the official default `encoding/json` package for serialization, so I won't go over it here

## 3. deserialization of configuration files

* `Configuration file deserialization` and `http api request body deserialization` use the same set of parsing rules, see `http api request body deserialization`
