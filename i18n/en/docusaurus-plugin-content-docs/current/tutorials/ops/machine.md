---
title: 物理机部署
sidebar_label: 物理机部署
slug: /docs/tutorials/ops/machine
---

import { Image } from '@arco-design/web-react';

## 1、概述

本节我们介绍物理机部署，关于物理机部署后台守护进程常用的几种方式：nohup、supervisor、systemd

nohup、systemd 不需要安装，supervisor 需要使用 yum 安装，本节我们就使用 nohup 作为后台守护进程方式，systemd、supervisor 相关资料可以 google 使用方法，只需要配置一个配置文件即可。

## 2、项目代码

我们创建一个项目名称 apicode(这里我们只演示一个服务部署，其他服务都是用相同方式的)，在其中写上 api 描述文件，使用 goctl 生成 apicode 项目代码

### 2.1、apicode.api 文件

```go
syntax = "v1"

info(
    title: "this is a deploy demo"
    desc: "this is a deploy demo"
    author: "Mikael"
)

type (
    HelloReq{
        msg string `form:"msg"`
    }
    HelloResp{
        msg string `json:"msg"`
    }
)

service apicode{
    @doc "hello"
    @handler hello
    get /hello(HelloReq)returns(HelloResp)
}
```

### 2.2、使用 goctl 生成代码

```sh
$ cd apicode && goctl api go -api *.api -dir ./
$ go mod tidy
```

### 2.3、项目结构

```text
├── apicode.api
├── apicode.go
├── etc
│   └── apicode.yaml
├── go.mod
└── internal
├── config
│   └── config.go
├── handler
│   ├── hellohandler.go
│   └── routes.go
├── logic
│   └── hellologic.go
├── svc
│   └── servicecontext.go
└── types
    └── types.go
```

### 2.4、添加代码

在 hellologic.go 中添加点代码，用来输出返回，证明我们访问到了

```go
.....
func (l *HelloLogic) Hello(req *types.HelloReq) (resp *types.HelloResp, err error) {


    fmt.Printf("print -> hello %s \n", req.Msg)

    return &types.HelloResp{
        Msg: "hello->" + req.Msg,
    }, nil
}

```

启动项目

```shell
$ go run apicode.go
```

浏览器输入http://127.0.0.1:8888/hello回车访问 ，可以看到浏览器输出了我们在 logic 中添加的代码

```json
{
  "msg": "hello->zhangsan"
}
```

### 2.5、上传代码

在我们之前部署好的 gitlab 上创建一个 apicode 仓库，将代码 push 上去即可

### 2.6 、配置 jenkins 服务器的公钥

jenkins 需要来 gitlab 拉取代码进行构建，所以我们要将 jenkins 所在物理机器的公钥配置到 gitlab 中，进行免密登陆

<Image src={require('../../resource/tutorials/ops/gitlab-pz-jenkins-sshkey.jpg').default} alt='gitlab-pz-jenkins-sshkey' />

## 3、Jenkins 发布

之前我们已经将 jenkins 与 gitlab 一起部署好了，接下来我们使用 jenkins 进行代码发布，只要编写 pipline 即可

核心思路：

- 使用 jenkins 打包出来项目的二进制文件一级配置文件，打成一个压缩包
- 将压缩包同步到部署机器，使用 nohup 启动即可（或者 supervisor、systemd）

在编写 pipline 之前，因为我们需要在 jenkins 中构建 go 程序所以需要 go 环境，因为我们这次的 jenkins 是使用 docker 安装的(如果你是裸机安装的 jenkins 只需要在服务器上安装 go 环境就可以了)，那么我们要在 jenkins 容器内需要有 go 环境才可以，这里提供有 3 个办法

- 使用 jenkins 提供的 go 插件
- 在外部将 go 安装包拷贝到容器内，手动在容器中安装。
- 另外一个就是不使用 docker 安装 jenkins，直接使用裸机安装 jenkins，如果是裸机安装 jenkins 这个只需要在当前服务器安装 go 环境就可以了

这么多种办法总有一种适合你，这里我就将 go 离线包拷贝到 jenkins 容器内了，安装到/usr/local/go 下了

考虑到多数国内用户访问 golang.org、go.dev 有问题，这里我就使用第二种方式，下载离线包使用”docker cp“拷贝到容器内了。

【注】 这里也给大家提供一下 jenkins 如何通过插件来支持 go，如果条件允许使用这种方式是最好的，操作步骤如下：

点击首页“系统管理”-->"插件管理"

在可选插件中，输入“go”，可以看到 go 插件 直接安装，安装成功后重启即可。

插件安装好后，我们需要配置。点击首页“系统管理”--> "全局工具配置"，拉到下方可以看到“Go”

我们点击新增 Go, 默认是从 golang.org 安装 go，你也可以选择使用 tar 包等多种方式，然后我们点“应用”

【注】如果看到有提示“To do so , press 'Check now' in thePlugin Manager,or restart jenkins” ，就重启一下 jenkins，配合在 pipline 中添加这个语法即可

https://github.com/jenkinsci/golang-plugin

### 3.1 创建 pipline

点击首页左侧“新建 item” ， 名称输入“apicode”，选择“流水线”，然后确定

<Image src={require('../../resource/tutorials/ops/deploy-server-jenkins-pipline.jpg').default} alt='deploy-server-jenkins-pipline' />

然后点击“General” , 选择“This project is parameterized” ， "添加参数"，“Choice Parameter”，如下图

<Image src={require('../../resource/tutorials/ops/deploy-server-plpline-2.png').default} alt='deploy-server-plpline-2' />

然后编写内容如下

<Image src={require('../../resource/tutorials/ops/deploy-server-pipline-3.png').default} alt='deploy-server-pipline-3' />

直接保存。

### 3.2 编辑 pipline

【注】在编写 pipline 之前我们还有一个公钥要配置，要将 jenkins 的公钥配置到运行服务的服务器上，因为我们使用 jenkins 构建好之后要将构建好的 tar 包使用 scp 传到运行服务器上，这时候就要免密登陆

查看 jenkins 所在的物理机公钥：

```shell
$ cat /root/.ssh/id_rsa.pub
```

配置到运行服务物理机的 /root/.ssh/authorized_keys 即可。

向下滑动找到`Pipeline script`,填写脚本内容

```shell
pipeline {
      agent any

      parameters {
          gitParameter name: 'branch',
          type: 'PT_BRANCH',
          branchFilter: 'origin/(.*)',
          defaultValue: 'master',
          selectedValue: 'DEFAULT',
          sortMode: 'ASCENDING_SMART',
          description: '选择需要构建的分支'
      }
      stages {
        stage('服务信息')    {
                steps {
                    sh 'echo 分支：$branch'
                }
            }
        stage('拉取代码') {
              steps {
                  checkout([$class: 'GitSCM',
                  branches: [[name: '$branch']],
                  doGenerateSubmoduleConfigurations: false,
                  extensions: [],
                  submoduleCfg: [],
                  userRemoteConfigs: [[credentialsId: 'gitlab-cert', url: 'ssh://git@192.168.1.182:2222/root/apicode.git']]])
              }
          }

          stage('Build') {
              steps{
                  sh 'echo Build'
                  sh '/usr/local/go/bin/go build  -o apicode apicode.go'
                  sh 'mkdir deploy && cp -r ./etc ./apicode  deploy'
                  sh 'tar -zcvf deploy.tar.gz deploy'
              }
          }

          stage('Deploy') {
              steps{
                   // 192.168.1.183 : 部署服务机器ip ， 部署之前一定要把jenkins的公钥配置到192.168.1.183上免密登陆（有多种方式）
                 sh 'scp ./deploy.tar.gz root@192.168.1.183:/root/'
                 sh 'ssh root@192.168.1.183 tar -xvf /root/deploy.tar.gz'
                 sh 'ssh root@192.168.1.183 nohup /root/deploy/apicode -f  /root/deploy/etc/apicode.yaml >apicode.stdout.log 2>apicode.stderr.log &'
              }
          }
      }
    }
```

​

## 4、构建发布

点击首页，找到 apicode 这个服务点击进去

<Image src={require('../../resource/tutorials/ops/deploy-server-deploy.jpg').default} alt='deploy-server-deploy' />

点击 Build with Parameters ，选择对应的“分支”跟“服务”，开始构建

<Image src={require('../../resource/tutorials/ops/deploy-server-deploy-2.jpg').default} alt='deploy-server-deploy-2' />

构建完成，最后我们来访问 http://192.168.1.183:8889/hello?msg=mikael ，可以看到页面上输出

```json
{
  "msg": "hello->mikael"
}
```

至此，部署完成。当然你可以在前面加自己喜欢的网关进行转发到此服务中，比如 nginx、kong...
