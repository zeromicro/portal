---
title: golang 安装
sidebar_label: golang 安装
slug: /docs/tasks
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


安装包下载地址为：https://golang.org/dl/。

如果打不开可以使用这个地址：https://golang.google.cn/dl/。


<Tabs>
<TabItem value="linux" label="Linux" default>

1、下载二进制包 go1.19.3.linux-amd64.tar.gz

2、将下载的二进制包解压至 /usr/local目录。

```shell
$ tar -C /usr/local go1.19.3.linux-amd64.tar.gz
```

3、将 /usr/local/go/bin 目录添加至 PATH 环境变量,编辑 ~/.bash_profile 或者 /etc/profile，并将以下命令添加该文件的末尾：

```shell
$ export PATH=$PATH:/usr/local/go/bin
```

添加保存之后，在命令行还需要执行如下命令才能生效

```shell
$ source ~/.bash_profile
或
$ source /etc/profile
```

</TabItem>
<TabItem value="macOS" label="MacOS">
macOS
</TabItem>
<TabItem value="windows" label="Windows">
Windows 下可以使用 .msi 后缀(在下载列表中可以找到该文件，如go1.19.3.windows-amd64.msi)的安装包来安装。

默认情况下 **.msi** 文件会安装在 **c:\Go** 目录下。你可以将 **c:\Go\bin** 目录添加到 **Path** 环境变量中。添加后你需要重启命令窗口才能生效。

验证安装成功:

```go
$ go version
go version go1.19.2 darwin/amd64
```
</TabItem>
</Tabs>

:::note
 **MAC OS X系统下你可以使用* **.pkg** *结尾的安装包直接双击来完成安装，安装目录在* **/usr/local/go/** *下。*
:::



### 3、protoc、protoc-gen-go、protoc-gen-go-grpc安装

go-zero的rpc是基于grpc的，grpc本身使用的protobuf 协议进行编码，所以如果我们是用go-zero做微服务开发（***如果只是做api单体开发可以不需要安装***），就要安装protoc、protoc-gen-go、protoc-gen-go-grpc

- （推荐）使用goctl一键安装protoc、protoc-gen-go、protoc-gen-go-grpc

  ```shell
  $ goctl env check -i -f
  ```

- 独立安装

    - protoc

      linux 64 : [protoc-21.10-linux-x86_64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.10/protoc-21.10-linux-x86_64.zip)

      mac intel : [protoc-21.10-osx-x86_64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.10/protoc-21.10-osx-x86_64.zip)

      windows 64: [protoc-21.10-win64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.10/protoc-21.10-win64.zip)

      其他操作系统请来官方github自行查找： https://github.com/protocolbuffers/protobuf/releases

      下载解压到$GOPATH/bin下即可，前提是$GOPATH/bin已经加入$PATH中 或者直接放到$PATH下也可以



- protoc-gen-go

  ```shell
  $ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
  ```

- protoc-gen-go-grpc

  ```shell
  $ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
  ```



验证protoc安装成功:

```shell
$ protoc --version
libprotoc 3.21.10
```

**Tips : **MAC OS X系统第一次在cmd中运行了protoc，会提示自动kill，需要去“系统偏好设置”->“通用”->"允许从以下位置下载App"，可以看到protoc，点击“仍要打开”即可



### 4、go-zero安装

一般我们不会直接去安装go-zero，都是使用goctl生成好项目代码（具体可见“创建项目”->"goctl生成"一节）或者基于现有代码，通过go mod tidy会自动帮我们安装go-zero依赖。

当然也可以通过如下命令直接安装go-zero依赖：

```shell
$ go get -u github.com/zeromicro/go-zero@latest
```



### 5、goctl  intellij 安装

首先打开intellij -> 设置 -> 插件（Plugin）, 搜索goctl ,可以看到”一只肚皮上有一个Zero标识的地鼠“Goctl插件 ，直接安装，重启intellij 即可。

再次打开intellij ，在项目上右键，可以看到goctl插件，查看 .api文件可以自动高亮了。



### 6、goctl  vscode 安装

首先打开vscode，点击vscode窗口最左方像俄罗斯方块一样的插件图标，在搜索中输入“goctl ”，可以看到”一只肚皮上有一个Zero标识的地鼠“Goctl插件, 直接点击安装，重启vscode。

再次打开intellij ，查看 .api文件可以自动高亮了。