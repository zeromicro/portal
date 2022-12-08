---
title: protoc 安装
sidebar_label: protoc 安装
slug: /docs/tasks/installation/protoc
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## 使用 goctl 一键安装 

```shell
$ goctl env check -i -f
```

## 独立安装

### protoc

<Tabs>
<TabItem value="linux" label="Linux" default>

linux 64 : [protoc-21.10-linux-x86_64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.10/protoc-21.10-linux-x86_64.zip)

</TabItem>
<TabItem value="mac" label="MacOS" default>

mac intel : [protoc-21.10-osx-x86_64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.10/protoc-21.10-osx-x86_64.zip)

</TabItem>
<TabItem value="windows" label="Windows" default>

windows 64: [protoc-21.10-win64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.10/protoc-21.10-win64.zip)

</TabItem>
<TabItem value="other" label=" 其他" default>

其他操作系统请来官方github自行查找： https://github.com/protocolbuffers/protobuf/releases

</TabItem>
</Tabs>


下载解压到$GOPATH/bin下即可，前提是$GOPATH/bin已经加入$PATH中 或者直接放到$PATH下也可以



### protoc-gen-go

  ```shell
  $ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
  ```

### protoc-gen-go-grpc

  ```shell
  $ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
  ```



验证protoc安装成功:

```shell
$ protoc --version
libprotoc 3.21.10
```

:::note 
**MAC OS X ** 系统第一次在cmd中运行了protoc，会提示自动kill，需要去“系统偏好设置”->“通用”->"允许从以下位置下载App"，可以看到protoc，点击“仍要打开”即可
:::