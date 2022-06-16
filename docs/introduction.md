# Introduction

# go-zero ![GitHub Repo stars](https://img.shields.io/github/stars/zeromicro/go-zero?style=social) ![GitHub forks](https://img.shields.io/github/forks/zeromicro/go-zero?style=social)

[![Go](https://github.com/zeromicro/go-zero/workflows/Go/badge.svg?branch=master)](https://github.com/zeromicro/go-zero/actions)
[![codecov](https://codecov.io/gh/zeromicro/go-zero/branch/master/graph/badge.svg)](https://codecov.io/gh/zeromicro/go-zero)
[![Go Report Card](https://goreportcard.com/badge/github.com/zeromicro/go-zero)](https://goreportcard.com/report/github.com/zeromicro/go-zero)
[![Release](https://img.shields.io/github/v/release/zeromicro/go-zero.svg?style=flat-square)](https://github.com/zeromicro/go-zero)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 0. What is go-zero?

go-zero is a web and rpc framework with lots of engineering best practices builtin. It’s born to ensure the stability of the busy services with resilience design, and has been serving sites with tens of millions users for years.

go-zero contains simple API description syntax and code generation tool called `goctl`. You can generate Go, iOS, Android, Kotlin, Dart, TypeScript, JavaScript from .api files with `goctl`.

Advantages of go-zero:

* improve the stability of the services with tens of millions of daily active users
* builtin chained timeout control, concurrency control, rate limit, adaptive circuit breaker, adaptive load shedding, even no configuration needed
* builtin middlewares also can be integrated into your frameworks
* simple API syntax, one command to generate couple of different languages
* automatically validate the request parameters from clients
* plenty of builtin microservice management and concurrent toolkits

<img src="https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/architecture-en.png" alt="Architecture" width="1500" />

## 1. Backgrounds of go-zero

At the beginning of 2018, we decided to re-design our system, from a monolithic architecture with Java+MongoDB to a microservice architecture. After researches and comparisons, we chose to:

* Golang based
  * great performance
  * simple syntax
  * proven engineering efficiency
  * extreme deployment experience
  * less server resource consumption
* Self-designed microservice architecture
  * I have rich experience on designing microservice architectures
  * easy to location the problems
  * easy to extend the features

## 2. Design considerations

Stability and productivity are two major goals that we wanted to archive. From the very beginning, we set the following design principles:

* keep it simple
* high availability
* stable on high concurrency
* easy to extend
* resilience design, failure-oriented programming
* business logic development friendly while encapsulating the complexity as possible
* one thing, one way

After almost half a year, we finished the transfer from a monolithic system to a microservice system, and deployed on August 2018. The new system guaranteed the business growth, and the system stability.

## 3. The features of go-zero

go-zero is a web and rpc framework that integrates lots of engineering practices. The highlights of the features are listed below:

* powerful tool included, less code to write
* simple interfaces
* fully compatible with net/http
* middlewares are supported, easy to extend
* high performance
* failure-oriented programming, resilience design
* builtin service discovery, load balancing
* builtin concurrency control, adaptive circuit breaker, adaptive load shedding, auto trigger, auto recover
* automatic validation of API request parameters
* chained timeout control
* automatic management of data caching
* call tracing, metrics and monitoring
* high concurrency protected

As shown below, go-zero implements layers of protection mechanisms:

![Resilience](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/resilience-en.png)

## 4. Future development plans of go-zero

* automatic generate API mock server code, make the client debugging easier
* automacit generate simple integration tests for the server side from the .api files

## 5. Installation

Run the following command under your project:

```shell
go get -u github.com/zeromicro/go-zero
```

## 6. Quick Start

0. Full examples can be checked out from below:

   [Rapid development of microservice systems](https://github.com/zeromicro/zero-doc/blob/main/doc/shorturl-en.md)

   [Rapid development of microservice systems - multiple RPCs](https://github.com/zeromicro/zero-doc/blob/main/doc/bookstore-en.md)
1. Install goctl

   `goctl` can be read as `go control`. `goctl` means not to be controlled by code, instead, we control it. The inside `go` is not `golang`. At the very beginning, the tool was aimed to help us improve the productivity, and make our lives easier.

   ```shell
   GO111MODULE=on go get -u github.com/zeromicro/go-zero/tools/goctl
   ```

   make sure goctl is executable.
2. Create an API file, like greet.api, you can install the plugin of goctl in vs code, api syntax is supported.

   ```go
   type Request struct {
     Name string `path:"name,options=you|me"` // parameters are auto validated
   }

   type Response struct {
     Message string `json:"message"`
   }

   service greet-api {
     @handler GreetHandler
     get /greet/from/:name(Request) returns (Response);
   }
   ```

   The .api files also can be generate by goctl, like below:

   ```shell
   goctl api -o greet.api
   ```
3. Generate the go server side code

   ```shell
   goctl api go -api greet.api -dir greet
   ```

   The generated files look like:

   ```
   ├── greet
   │   ├── etc
   │   │   └── greet-api.yaml        // configuration file
   │   ├── greet.go                  // main file
   │   └── internal
   │       ├── config
   │       │   └── config.go         // configuration definition
   │       ├── handler
   │       │   ├── greethandler.go   // get/put/post/delete routes are defined here
   │       │   └── routes.go         // routes list
   │       ├── logic
   │       │   └── greetlogic.go     // request logic can be written here
   │       ├── svc
   │       │   └── servicecontext.go // service context, mysql/redis can be passed in here
   │       └── types
   │           └── types.go          // request/response defined here
   └── greet.api                     // api description file
   ```

   The generated code can be run directly:

   ```shell
   cd greet
   go mod init
   go mod tidy
   go run greet.go -f etc/greet-api.yaml
   ```

   By default, it is listening on port 8888. The port can be changed in the configuration file.

   You can check it by curl:

   ```shell
   curl -i http://localhost:8888/greet/from/you
   ```

   The response looks like:

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json; charset=utf-8
   Traceparent: 00-45fa9e7a7c505bad3a53a024e425ace9-eb5787234cf3e308-00
   Date: Sun, 30 Aug 2020 15:32:35 GMT
   Content-Length: 0

   null
   ```
4. Write the business logic code

   * the dependencies can be passed into the logic within servicecontext.go, like mysql, reds etc.
   * add the logic code in logic package according to .api file
5. Generate code like Java, TypeScript, Dart, JavaScript etc. just from the api file

   ```shell
   goctl api java -api greet.api -dir greet
   goctl api dart -api greet.api -dir greet
   ...
   ```

## 7. Benchmark

![benchmark](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/benchmark.png)

[Checkout the test code](https://github.com/smallnest/go-web-framework-benchmark)

## 8. Documents (adding)

* [Rapid development of microservice systems](https://github.com/zeromicro/zero-doc/blob/main/doc/shorturl-en.md)
* [Rapid development of microservice systems - multiple RPCs](https://github.com/zeromicro/zero-doc/blob/main/docs/zero/bookstore-en.md)
* [Examples](https://github.com/zeromicro/zero-examples)

## 9. Important notes

* Use grpc 1.29.1, because etcd lib doesn’t support latter versions.

  `google.golang.org/grpc v1.29.1`
* For protobuf compatibility, use `protocol-gen@v1.3.2`.

  ` go get -u github.com/golang/protobuf/protoc-gen-go@v1.3.2`

## 10. Chat group

Join the chat via https://join.slack.com/t/go-zeroworkspace/shared_invite/zt-m39xssxc-kgIqERa7aVsujKNj~XuPKg
