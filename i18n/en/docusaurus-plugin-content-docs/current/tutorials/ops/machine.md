---
title: Physical deployment
sidebar_label: Physical deployment
slug: /docs/tutorials/ops/machine
---

import { Image } from '@arco-design/web-react';

## 1. Overview

This section describes the physical deployment of the machine, and some of the ways in which the physical deployment background daemon is commonly used：nohup, supervisor, systemd

Nohup, systemd does not need installation, supervisor needs to use yum to install, this section uses nohup as a background daemon method, systemd, supervisor data can use a google method, just one configuration file to configure it.

## 2. Project code

We create a project name apicode (here we show only one service deployed, other services are in the same way), write api description file and use goctl to generate apicode project code

### 2.1, apicode.api file

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

### 2.2 Use goctl to generate code

```sh
$ cd apicode && goctl api go -api *.api -dir ./
$ go mod tidy
```

### 2.3 Project structure

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

### 2.4 Add code

Add a point code to hellologic.go to export return to prove that we visited

```go
.....
func (l *HelloLogic) Hello(req *types.HelloReq) (resp *types.HelloResp, err error) {


    fmt.Printf("print -> hello %s \n", req.Msg)

    return &types.HelloResp{
        Msg: "hello->" + req.Msg,
    }, nil
}

```

Start Project

```shell
$ go run apicode.go
```

Browser input http:///127.0.0.1:8888/hello return visit to see your browser output the code we added in the logic

```json
{
  "msg": "hello->zhangsan"
}
```

### 2.5 Upload code

Create an apicode repository on our previous gitlab deployed, get code push up

### 2.6 Public key for configuring jenkins server

jenkins needs a gitlab pull code to build, so we want to configure the public key of the jenkins physical machine to gitlab and unencrypt login

<Image src={require('../../resource/tutorials/ops/gitlab-pz-jenkins-sshkey.jpg').default} alt='gitlab-pz-jenkins-sshkey' />

## 3. Jenkins deployment

We have already deployed jenkins with gitlab and then we use jenkins to publish the code as long as you write pipline

Core ideas：

- Use jenkins to pack the binary level profile of the project into a compression package
- Sync packets to deploy machines, start with nohup (or erverisor, systemd)

Before writing pipline, because we need to build a go program in jenkins, because our jenkins is installed using a docker (if you are naked installed in jenkins simply need to install the go environment on the servers), then we need a go environment in jenkins containers where there are three options available

- A go plugin using jenkins
- Copy the package to the container at the outlet installation and install it manually in the container.
- The other is to install jenkins without a docker and jenkins directly with nuds. If jenkins is installed only on the current server

There is always one way to fit you, and here I copy the go offline package into the jenkins container, installed to /usr/local/go

Given that most domestic users have problems accessing golang.org, go.dev here, I use the second mode to download the offline package using the docker cp “copied into the container.”

'Note' Here also provides you with jenkins how to support gos through plugins and if conditions allow this to be the best, the action steps below：

Tap "System Managers" on the front page -->"Plugin Management"

In an optional plugin, enter 'go', see the go plugin installed directly, and reboot after the installation has succeeded.

Once the plugin is installed, we need to configure it.Tap "System Management" on the front page --> "Global Tool Configuration", pull down to see "Go"

We click on a new Go, installing gos from golang.org by default. You can also choose how to use tar packages, and then we click "app"

'To do so, press 'check now' in the thePlugin Manager, or start jenkins', reboot jenkins with the addition of this syntax in pipline

https://github.com/jenkinsci/golang-plugin

### 3.1 Create pipline

Click "New Item" on the left side of the front page, enter "apicode-docker", select "Waterlines", then determine

<Image src={require('../../resource/tutorials/ops/deploy-server-jenkins-pipline.jpg').default} alt='deploy-server-jenkins-pipline' />

Then click on “General”, select "This project is parameterized", "Add parameter", "Choice Parameter", like the beacon

<Image src={require('../../resource/tutorials/ops/deploy-server-plpline-2.png').default} alt='deploy-server-plpline-2' />

Then write the following

<Image src={require('../../resource/tutorials/ops/deploy-server-pipline-3.png').default} alt='deploy-server-pipline-3' />

Save directly.

### 3.2 Edit pipline

'Note' We have a public key to configure before writing pipline to configure jenkins public key to the server running the service because we build using jenkins and then upload the built tar package to the running server using scp.

View jenkins host public key：

```shell
$ cat /root/.ssh/id_rsa.pub
```

Configure to the /root/.ssh/authorized_keys running the service physics.

Swipe down to find `Pipeline scripts`, fill in script content

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

## 4. Build Publication

Click on the home page to find the apicode service to click on it

<Image src={require('../../resource/tutorials/ops/deploy-server-deploy.jpg').default} alt='deploy-server-deploy' />

Tap Build with Parameters, select the corresponding "branch" to "Service" to start building

<Image src={require('../../resource/tutorials/ops/deploy-server-deploy-2.jpg').default} alt='deploy-server-deploy-2' />

Build finished, we go to http://192.168.1.183:8889/hello?msg=mikael to see output on page

```json
{
  "msg": "hello->mikael"
}
```

至此，部署完成。Of course you can forward your favorite gateway to this service like nginx, kong...
