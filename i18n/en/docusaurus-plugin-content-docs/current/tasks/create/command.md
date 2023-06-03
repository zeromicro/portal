---
title: Create from command line
sidebar_label: Create from command line
slug: /docs/tasks/create/project/from/command
---

## Overview

We can enter golang officially after completing Golang installation, and the two current mainstream editors are Goland VSCode; in addition to this, we can create the Golang project from the terminal. This paper will describe how to create a golang project using the command line.

## Create project

```bash
# Create a golang project
➜ ~  mkdir -p ~/workspace/helloworld/ && cd ~/workspace/helloworld
➜ helloworld  # crete go module
➜ helloworld  go mod init helloworld
go: creating new go.mod: module helloworld
➜ helloworld  # create main.go
➜ helloworld  touch main.go
➜ helloworld  # add code
➜ helloworld  echo 'package main
>
> import "fmt"
>
> func main() {
>   fmt.Println("Hello World!")
> }
> ' > main.go
```

## Run main.go

```bash
➜ go run main.go
Hello World!
```