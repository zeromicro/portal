---
title: Create from Visual Studio Code
sidebar_label: Create from Visual Studio Code
slug: /docs/tasks/create/project/from/vscode
---

import { Image } from '@arco-design/web-react';

## Overview

Once Golang is installed, we can formally enter golang for development. The two current mainstream editors are Goland VSCode, which will describe how to create a golang project using VSCode.

VScode download reference [VSCode official net](https://code.visualstudio.com/)

:::Note taps
Current document demo version is `Version: 1.74.1 (Universal)`, this may be different if your VScode version is not consistent.
:::

## Install Go Extension

Open VScode,click on the left extension button, search `Go`and install it.

<Image src={require('../../resource/tasks/create/vscode-go-extension.png').default} alt='install go extension' title="Install Go Extension" />

## Create Go Project

Open VScode and click `Open...`in the workspace, select the specified directory or create a new folder as a project directory. Here I choose to create a new folder `hellowd`, return to the project.

<Image src={require('../../resource/tasks/create/create-from-vscode.png').default} alt='create from vscode' title="Create Project from VScode" />

## Create go module

In the top right corner of VScode, select `Toggle Panel` or use shortcuts `Command + J`, Strike `Terminal`, enter `go into the terminal and init helloowold`, go back and create a go module.

<Image src={require('../../resource/tasks/create/open-vscode-terminal.png').default} alt='open terminal' title="Open VScode Terminal (1)" /> <Image src={require('../../resource/tasks/create/create-go-module-from-vscode.png').default} alt='open terminal' title="Open VScode Terminal (2)" />

## New main.go

Create a new `main.go` file in the project directory `HELLOWORLD`, and enter the following code:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello World!")
}
```

<Image src={require('../../resource/tasks/create/create-new-file.png').default} alt='create main.go' title="New main.go" />

## Run program

In the upper right corner of VScode, select `Toggle Panel` or use shortcut `Command + J`, click `Terminal`, enter `go run main.go`, go back, run the program.

```bash
$ go run main.go
Hello World!
```

<Image src={require('../../resource/tasks/create/run-in-vscode.png').default} alt='run program' title="Run program from VScode" />
