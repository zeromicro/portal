---
title: 部署准备（环境）
slug: /docs/tutorials/ops/prepare
---

import { Image } from '@arco-design/web-react';

## 1、概述

项目开发好后，我们需要部署，我们接下来要讲解三种部署方式，服务器部署、docker 部署、k8s 部署

部署之前我们先把部署相关中间件安装好，我们 cicd 主要基于 gitlab 、 jenkins（三种方式都会使用到），镜像仓库使用 harbor(docker、k8s 部署需要使用到) ，一个 k8s 集群环境（k8s 部署使用）。

至于服务使用的中间件(mysql、redis、es 等)会部署在 srv-data.com，如果你是线上使用云服务可以直接使用云服务，如果自建也最好运行在 k8s 之外。

所以我们需要配置如下：

| 服务器名称        | 作用                                                            |
| ----------------- | --------------------------------------------------------------- |
| deploy-server.com | 部署 gitlab、jenkins、harbor（预先装好 docker、docker-compose） |
| srv-data.com      | 部署 mysql、redis、es 等等，模拟独立环境,k8s 内部连接到此服务器 |
| nginx-gateway.com | 网关，独立于 k8s 集群外部                                       |
| k8s 集群          | K8s 集群                                                        |

## 2、搭建 gitlab

### 2.1 部署 gitlab

创建文件夹

```shell
$ mkdir gitlab && cd gitlab
$ vim docker-compose.yml
```

docker-compose.yml

```yaml
version: "3"

services:
  gitlab:
    image: "twang2218/gitlab-ce-zh"
    container_name: "gitlab"
    restart: always
    hostname: "192.168.1.180" #部署机器的ip,非容器ip(因为是本地不是线上所以用ip，线上的话可以用域名)
    environment:
      TZ: "Asia/Shanghai"
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://192.168.1.180'  #使用这个地址访问gitlab web ui(因为是本地不是线上所以用ip，线上的话可以用域名)
        gitlab_rails['gitlab_shell_ssh_port'] = 2222 #ssh clone代码地址
        unicorn['port'] = 8888 #gitlab一个内部端口
    ports:
      - "80:80" #web 80 端口
      #- '443:443'      #web 443 端口,本次未使用就不开放了
      - "2222:22" #ssh 检出代码 端口
    volumes:
      - ./etc:/etc/gitlab #Gitlab配置文件目录
      - ./data:/var/opt/gitlab #Gitlab数据目录
      - ./logs:/var/log/gitlab #Gitlab日志目录
```

执行

```shell
$  docker-compose up -d
```

这个执行时间可能稍微有点长，不妨你可以去泡一杯 coffee 休息一下～～

### 2.2 访问 gitlab

访问 http://192.168.1.103（即http://"docker-compose中ip/域名"）

<Image
src={require('../../resource/tutorials/ops/image-20220209100353045.png').default}
alt='gitlab'
/>

账号默认是 root

### 2.3 创建项目 k8scode

<Image
src={require('../../resource/tutorials/ops/image-20220209100813435.png').default}
alt='gitlab'
/>

### 2.4 配置 ssh 公钥

点击头像位置下箭头，“设置”

<Image
src={require('../../resource/tutorials/ops/image-20220209101148261.png').default}
alt='gitlab'
/>

<Image
src={require('../../resource/tutorials/ops/gitlab-ssh-key.png').default}
alt='gitlab'
/>

将自己的公钥配置上，点击“Add key”即可 （公钥不会生成的自己搜索，这里不详细说了）

### 2.5 上传项目

在点击项目，回到刚才创建的项目，将 k8scode 项目上传到此仓库 ssh://git@192.168.1.180:2222/root/k8scode.git 即可，到此我们的 gitlab 搭建就结束了。

## 3、harbor

### 3.1 部署 harbor

下载 harbo https://github.com/goharbor/harbor/releases/download/v2.2.0/harbor-offline-installer-v2.2.0.tgz，下载离线的offline安装会快点

下载解压后进入 harbor 文件夹

```shell
$ cd harbor && cp harbor.yml.tmpl harbor.yml
```

我们打开 harbor.yml，修改如下

```yml
hostname: 192.168.1.180 #修改为本机ip，不能使用localhost、127.0.0.1

http:
  port: 8077 #改一下http端口8077

#https: #暂时将https注释掉，我们先不通过https只铜鼓http
#  port: 443
#  certificate: /your/certificate/path
#  private_key: /your/private/key/path

data_volume: /root/harbor/data #修改一下数据目录位置

log:
  level: info
  local:
    rotate_count: 50
    rotate_size: 200M
    location: /root/harbor/log #修改一下日志目录位置
```

直接运行 “sudo ./install.sh” 稍做等待。

### 3.2 访问 harbor

浏览器输入 http://192.168.1.180:8077

账号: admin

密码: Harbor12345 (在 harbor.yml 中记录的，默认是 Harbor12345)

<Image
src={require('../../resource/tutorials/ops/image-20220209134737504.png').default}
alt='gitlab'
/>

登陆成功

<Image
src={require('../../resource/tutorials/ops/README.png').default}
alt='gitlab'
/>

到此我们 harbor 搭建完成。

## 4、jenkins

### 4.1 部署 jenkins

创建文件夹

```shell
$ mkdir jenkins && cd jenkins
$ vim docker-compose.yml
```

docker-compose.yml

```yaml
version: "3"
services:
  jenkins:
    image: "jenkins/jenkins:lts"
    container_name: jenkins
    restart: always
    environment:
      - TZ=Asia/Shanghai
    user: root
    ports:
      - "8989:8080"
      - "50000:50000"
    volumes:
      - "./jenkins_home:/var/jenkins_home"
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "/usr/bin/docker:/usr/bin/docker"
      - "/root/port.sh:/root/port.sh"
```

【注】/root/port.sh 内容如下，这个是给后续 k8s 部署使用的

```sh
#!/bin/sh

case $1 in
"identity-api") echo 1001
;;
"identity-rpc") echo 1101
;;
"usercenter-api") echo 1002
;;
"usercenter-rpc") echo 1102
;;
"message-mq") echo 1207
;;
"mqueue-rpc") echo 1106
;;
"order-api") echo 1004
;;
"order-mq") echo 1204
;;
"order-rpc") echo 1104
;;
"payment-api") echo 1005
;;
"payment-rpc") echo 1105
;;
"travel-api") echo 1003
;;
"travel-rpc") echo 1103
esac
```

执行

```shell
$ docker-compose up -d
```

这个时间也不慢，可以再去喝一杯 coffee

### 4.2 挂载工具

1）将 goctl 复制到 jenkins 容器中

```shell
$ docker cp $GOPATH/bin/goctl jenkins:/usr/local/bin
$ docker exec -it jenkins /bin/sh #进入jenkins 容器
$ goctl -v	 #验证成功
goctl version 1.3.0-20220201 linux/amd64
```

2）将 kubectl 文件复制到 jenkins 容器中

```shell
$ curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
$ sudo chmod a+x kubectl
$ docker cp kubectl jenkins:/usr/local/bin
$ docker exec -it jenkins /bin/sh #进入jenkins 容器
$ kubectl version
Client Version: version.Info{Major:"1", Minor:"23", GitVersion:"v1.23.3" .....
```

3）将 k8s 的配置.kube/config 复制到 jenkins 容器

```shell
$ docker cp ~/.kube jenkins:/root/ #前提是家目录下的.kube文件夹中存在k8s的config配置
$ docker exec -it jenkins /bin/sh #进入jenkins 容器
$ kubectl ge ns
default              Active   43m
kube-node-lease      Active   43m
kube-public          Active   43m
kube-system          Active   43m
local-path-storage   Active   43m
```

【注】上面这 4 部，也可以直接打进镜像中，我这里只是演示，留给你们自己处理。

### 4.3 访问 jenkins

http://192.168.1.180:8989

<Image
src={require('../../resource/tutorials/ops/image-20220209104638510.png').default}
alt='gitlab'
/>

第一次访问出现上面图不要慌，让你稍等一会，它在进行准备工作，准备好后会自动跳到登陆页面。

出现如下界面，说明准备好了，因为我们目录是挂载出来的，我们查看本机 jenkins_home/secrets/initialAdminPassword 密码，输入下一步即可

<Image
src={require('../../resource/tutorials/ops/image-20220209104946101.png').default}
alt='gitlab'
/>

选择“安装推荐插件“

<Image
src={require('../../resource/tutorials/ops/image-20220209105921610.png').default}
alt='gitlab'
/>

然后等待插件安装完成

<Image
src={require('../../resource/tutorials/ops/image-20220209110010562.png').default}
alt='gitlab'
/>

### 4.4 创建用户

root

root

<Image
src={require('../../resource/tutorials/ops/jenkins-user.png').default}
alt='gitlab'
/>

### 4.5 部署完成

<Image
src={require('../../resource/tutorials/ops/image-20220209111135979.png').default}
alt='gitlab'
/>

到此 jenkins 部署完成

### 4.6 添加凭据

点击左边菜单“Manage Jenkins”

<Image
src={require('../../resource/tutorials/ops/image-20220209111325922.png').default}
alt='gitlab'
/>

点击 "Manage Credentials"

<Image
src={require('../../resource/tutorials/ops/image-20220209111450217.png').default}
alt='gitlab'
/>

点击“全局”后面的三角标，然后在点击“添加凭据”

<Image
src={require('../../resource/tutorials/ops/image-20220209111612564.png').default}
alt='gitlab'
/>

进入“添加凭据”页面，类型我们选择 “SSH Username with private key” 使用私钥方式，`Username`是 gitlab 一个标识，后面添加 pipeline 你知道这个标识是代表 gitlab 的凭据自行自定义的，Private Key`即在 gitlab 配置的私钥（之前我们配置在 gitlab 的公钥对应的私钥，在这里就是我们自己本机的私钥），我们这个凭证就是给 jenkins 用来去 gitlab 时候免密拉代码用的

<Image
src={require('../../resource/tutorials/ops/image-20220209112430241.png').default}
alt='gitlab'
/>

确定即可。

### 4.7 添加 harbor 仓库配置

进入首页，点击左侧菜单`Manage Jenkins`->`Configure System`

<Image
src={require('../../resource/tutorials/ops/image-20220209112756140.png').default}
alt='gitlab'
/>

下滑动到`全局属性`条目，添加 docker 私有仓库相关信息，如图为`docker用户名`、`docker用户密码`、`docker私有仓库地址`

<Image
src={require('../../resource/tutorials/ops/image-20220210095715913.png').default}
alt='gitlab'
/>

点击 “保存”

### 4.8 配置 git

进入`Manage Jenkins`->`Global Tool Configureation`，找到 Git 条目，填写 jenkins 所在机器 git 可执行文件所在 path，如果没有的话，需要在 jenkins 插件管理中下载 Git 插件, 有就不需要管了（如下图）

<Image
src={require('../../resource/tutorials/ops/image-20220209195140145.png').default}
alt='gitlab'
/>

配置 pipline 需要的 Git Parameter 插件

点击 “系统配置” -> “插件管理”

<Image
src={require('../../resource/tutorials/ops/image-20220209200922797.png').default}
alt='gitlab'
/>

然后点击“可选插件” , 搜索中输入 “Git Parameter” , 如下图

<Image
src={require('../../resource/tutorials/ops/image-20220209201022699.png').default}
alt='gitlab'
/>

安装好，重启后即可，到此 jenkins 搭建完成。

## 5、k8s

k8s 的部署这里就不介绍了，自己用 kubeadm、rancher、kind 去安装吧，或者买个按量云容器服务，总之有一个 k8s 集群就好了。
