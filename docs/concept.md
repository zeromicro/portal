# Concepts

## go-zero

go-zero is a web and rpc framework with many engineering best practices builtin. It was created with the goal of allowing developers to rapidly develop resilient services with rock-solid stability, and has been used to develop web applications with tens of millions users.

## goctl

`goctl` is an auxiliary tool designed to improve engineering efficiency and reduce errors for developers by providing boilerplates.

## goctl plugins

`goctl` has an extensible plugin system with multiple plugins. These plugins allow developers to generate boilerplate code and configuration for other architecture elements. Examples include `goctl-go-compact` which merges all goctl-generated routes into one file, the `goctl-swagger` plugin for generating swagger documents from api definitions, or the `goctl-php` plugin for generating php client code, etc.

## IntelliJ/Visual Studio Code plugins

There are also plugins available for the IntelliJ family of IDEs as well as for Visual Studio Code. These plugins expose the CLI functions in the interface of the IDE and provide additional syntax highlighting for API definition files.

## API file

An API file refers to a plaintext file used to define and describe an API service. It ends with the `.api` suffix and contains an IDL (Interface Description Language) describing the API syntax.

## goctl environment

In order to use `goctl` the following is required:

* a Golang environment
* `protoc`, the protobuf compiler
* the `protoc-gen-go` plugin
* a go project either using go modules or on the GOPATH

If you don't have all of this setup, please visit the [prepare](prepare/prepare) of the documentation to get started.

## go-zero-demo

Quickstart demos are recommended to get started with go-zero. 

See below for how to create this in your home directory.

```shell
$ cd ~
$ git clone https://github.com/zeromicro/go-zero-demo
```
