# Goctl 安装

## 前言
Goctl在go-zero项目开发着有着很大的作用，其可以有效的帮助开发者大大提高开发效率，减少代码的出错率，缩短业务开发的工作量，更多的Goctl的介绍请阅读[Goctl介绍](index),
在这里我们强烈推荐大家安装，因为后续演示例子中我们大部分都会以goctl进行演示。

## 安装(mac&linux)
1. 下载安装

  ```shell title="下载安装"
  # Go 1.15 及之前版本
  GO111MODULE=on GOPROXY=https://goproxy.cn/,direct go get -u github.com/zeromicro/go-zero/tools/goctl@latest

  # Go 1.16 及以后版本
  GOPROXY=https://goproxy.cn/,direct go install github.com/zeromicro/go-zero/tools/goctl@latest
  ```

2. 环境变量检测

   `go get` 下载编译后的二进制文件位于 `$GOPATH/bin` 目录下，要确保`$GOPATH/bin`已经添加到环境变量。
    ```shell title="添加环境变量"
    $ sudo vim /etc/paths
    ```
   在最后一行添加如下内容
    ```text
    $GOPATH/bin
    ```

:::tip

`$GOPATH` 为你本机上的文件地址

:::

3. 安装结果验证
    ```shell title="打印 goctl 版本"
    $ goctl -v
    goctl version 1.1.4 darwin/amd64
    ```

:::tip

windows用户添加环境变量请自行google

:::
