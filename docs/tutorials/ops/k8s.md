---
title: K8s
sidebar_label: K8s
slug: /docs/tutorials/ops/k8s
---

import { Image } from '@arco-design/web-react';

## 1、概述

之前部署环境一节我们已经把 gitlab、jenkins、harbor、k8s 都已经搭建好了，这一节我们来编写 jenkins 的 pipline 将我们的服务通过 jenkins 完整的发布到 k8s 中。

## 2、部署中间件

将 mysql、redis、es 等部署到 k8s 之外 ， 模拟用作线上独立环境（至于线上你想把某些中间件部署到 k8s 内部这个自行处理，本次重点是如何将 go-zero 开发的微服务部署到 k8s 集群内部），这里我就直接使用项目下的 docker-compose-env.yaml 了，把所有依赖的第三方中间件环境直接安装在 srv-data.com(192.168.1.181)这台服务器，前提是这台服务器已经安装好 docker、docker-compose。

登陆到 192.168.1.181

```shell
$ mkdir data && cd data && vim docker-compose.yml
$ docker-compose up -d
$ docker-compose ps #查看确认
```

## 3、独立配置

将每个服务的配置都独立出来，统一放在一个 git 仓库，这样只给一个人线上仓库的权限，如果线上配置有变直接修改这个仓库的文件，在 jenkins 做 cd 的时候，会先拉取代码在拉取对应服务的配置自动构建，具体可以看后面的 pipline。

【问】为什么不用配置中心？

1）修改 db、redis 等需要重启服务，但是有一些配置又不需要重启服务，运维又要去记，记混了比较容易造成线上事故

2）方便回滚。我们发新版本到线上，并且又改了新版本配置。这时候线上用户反馈有问题，线上需要快速回滚的话，如果我们使用将文件构建到镜像中，直接使用 k8s 一行命令就可以将上一个版本代码加配置直接回滚回来。如果使用了配置中心，回滚了代码，还要将上个版本的配置去陪中心改回来很麻烦，

独立线上仓库目录结构如下（这个结构是跟 pipline 中写法相关的）

go-zero 官方 k8s 配置 demo 地址: https://github.com/zeromicro/zero-examples/blob/main/discovery/k8s/client/etc/k8s.yaml

也可以参考配置仓库地址 ： https://github.com/Mikaelemmmm/go-zero-looklook-pro-conf

【注】1、修改配置中的中间件，数据库、redis 等都要改成 192.168.1.181 这台机器，我们把这台机器当成线上环境的中间件。

​ 2、另外一个就是我们的服务发现，线上我们部署在 k8s 中，go-zero 直接支持 k8s 服务发现，所以不需要 etcd 等，我们在配置 zrpc client 的时候，要改成 target，k8s 的配置方式。

## 4、镜像仓库

去 harbor 创建本项目镜像仓库

<Image
src={require('../../resource/tutorials/ops/image-20220209190928092_new.png').default}
alt='image-20220209190928092_new'
/>

<Image
src={require('../../resource/tutorials/ops/image-20220209191633736.png').default}
alt='image-20220209191633736'
/>

查看 push 命令

<Image
src={require('../../resource/tutorials/ops/image-20220209191757422.png').default}
alt='image-20220209191757422'
/>

```sh
$ docker push 192.168.1.180:8077/k8scode/REPOSITORY[:TAG]
```

## 5、编写 jenkins 的 pipline

### 5.1 配置参数

访问 http://192.168.1.180:8989/ 打开 jenkins，进入 jenkins 首页，点击左侧菜单`新建Item`

我们先创建一个服务的流水线

<Image
src={require('../../resource/tutorials/ops/image-20220209195418130.png').default}
alt='image-20220209195418130'
/>

然后点击“General” , 选择“This project is parameterized” ， "添加参数"，“Choice Parameter”，如下图

<Image
src={require('../../resource/tutorials/ops/image-20220209195724082.png').default}
alt='image-20220209195724082'
/>

然后编写内容如下

<Image
src={require('../../resource/tutorials/ops/image-20220209195853856.png').default}
alt='image-20220209195853856'
/>

直接保存。

### 5.2 编写 pipline

向下滑动找到`Pipeline script`,填写脚本内容

```pipline
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
              sh 'echo 构建服务类型：${JOB_NAME}-$type'
          }
      }


      stage('拉取代码') {
          steps {
              checkout([$class: 'GitSCM',
              branches: [[name: '$branch']],
              doGenerateSubmoduleConfigurations: false,
              extensions: [],
              submoduleCfg: [],
              userRemoteConfigs: [[credentialsId: 'gitlab-cert', url: 'ssh://git@192.168.1.180:2222/root/k8scode.git']]])
          }
      }
      stage('获取commit_id') {
          steps {
              echo '获取commit_id'
              git credentialsId: 'gitlab-cert', url: 'ssh://git@192.168.1.180:2222/root/k8scode.git'
              script {
                  env.commit_id = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
              }
          }
      }
      stage('拉取配置文件') {
              steps {
                  checkout([$class: 'GitSCM',
                  branches: [[name: '$branch']],
                  doGenerateSubmoduleConfigurations: false,
                  extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'conf']],
                  submoduleCfg: [],
                  userRemoteConfigs: [[credentialsId: 'gitlab-cert', url: 'ssh://git@192.168.1.180:2222/root/k8scode-pro-conf.git']]])
              }
        }

      stage('goctl版本检测') {
          steps{
              sh '/usr/local/bin/goctl -v'
          }
      }

      stage('Dockerfile Build') {
          steps{
                 sh 'yes | cp  -rf conf/${JOB_NAME}/${type}/${JOB_NAME}.yaml  app/${JOB_NAME}/cmd/${type}/etc'   //线上配置文件
                 sh 'cd app/${JOB_NAME}/cmd/${type} && /usr/local/bin/goctl docker -go ${JOB_NAME}.go && ls -l'
                 script{
                     env.image = sh(returnStdout: true, script: 'echo ${JOB_NAME}-${type}:${commit_id}').trim()
                 }
                 sh 'echo 镜像名称：${image} && cp app/${JOB_NAME}/cmd/${type}/Dockerfile ./  && ls -l && docker build  -t ${image} .'
          }
      }

      stage('上传到镜像仓库') {
          steps{
          	  //docker login 这里要注意，会把账号密码输出到jenkins页面，可以通过port.sh类似方式处理，官网文档有这里我就不详细写了
              sh 'docker login --username=${docker_username} --password=${docker_pwd} http://${docker_repo}'
              sh 'docker tag  ${image} ${docker_repo}/k8scode/${image}'
              sh 'docker push ${docker_repo}/k8scode/${image}'
          }
      }

      stage('部署到k8s') {
          steps{
              script{
                  env.deployYaml = sh(returnStdout: true, script: 'echo ${JOB_NAME}-${type}-deploy.yaml').trim()
                  env.port=sh(returnStdout: true, script: '/root/port.sh ${JOB_NAME}-${type}').trim()
              }

              sh 'echo ${port}'

              sh 'rm -f ${deployYaml}'
              sh '/usr/local/bin/goctl kube deploy -secret docker-login -replicas 2 -nodePort 3${port} -requestCpu 200 -requestMem 50 -limitCpu 300 -limitMem 100 -name ${JOB_NAME}-${type} -namespace k8scode -image ${docker_repo}/${image} -o ${deployYaml} -port ${port} -serviceAccount find-endpoints '
              sh '/usr/local/bin/kubectl apply -f ${deployYaml}'
          }
      }

       stage('Clean') {
           steps{
               sh 'docker rmi -f ${image}'
               sh 'docker rmi -f ${docker_repo}/${image}'
               cleanWs notFailBuild: true
           }
       }
  }
}
```

:::note 非常重要
1、构建优化：pipline 中使用"/usr/local/bin/goctl kube xxx"生 k8s yaml 的时候，我们是使用 k8s 方式部署不需要 etcd，但是这种方式部署需要为生成的 k8s yaml 中指定 serviceAccount。 原理可以看这篇文章下方 go-zero 的 k8s 服务发现讲解 ：https://mp.weixin.qq.com/s/-WaWJaM_ePEQOf7ExNJe7w

我这边已经指定好了 serviceAccount

所以你需要在你的 k8s 创建 find-endpoints 这个 serviceAccount 并绑定相应权限，yaml 文件我已经准备好了，你只需要执行

kubectl apply -f auth.yaml 即可 ，auth.yaml 文件如下：

```yaml
#创建账号
apiVersion: v1
kind: ServiceAccount
metadata:
  namespace: k8scode
  name: find-endpoints

---
#创建角色对应操作
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: discov-endpoints
rules:
  - apiGroups: [""]
    resources: ["endpoints"]
    verbs: ["get", "list", "watch"]

---
#给账号绑定角色
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: find-endpoints-discov-endpoints
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: discov-endpoints
subjects:
  - kind: ServiceAccount
    name: find-endpoints
    namespace: k8scode
```

pipline 生成 k8s yaml 的文件可以不需要使用模版方式支持 serviceAccount 可以在生成时候指定 serviceAccount，也就是说 pipline 中可以直接指定-serviceAcount 直接就在生成 k8s 的 yaml 中添加 serviceAccount : find-endpoints，如下命令

```shell
/usr/local/bin/goctl kube deploy -secret docker-login -replicas 2 -nodePort 3${port} -requestCpu 200 -requestMem 50 -limitCpu 300 -limitMem 100 -name ${JOB_NAME}-${type} -namespace k8scode -image ${docker_repo}/${image} -o ${deployYaml} -port ${port} --serviceAccount find-endpoints
```

2、${credentialsId}要替换为你的具体凭据值，即【添加凭据】模块中的一串字符串，我们之前配置的是gitlab-cert所以这里就填写gitlab-cert，如果你不是这个自己要更换，${gitUrl}需要替换为你代码的 git 仓库地址，其他的${xxx}形式的变量无需修改，保持原样即可。

3、这里跟官方文档有一点点不一样，由于我项目文件夹目录不同，goctl 生成的 dockerfile 文件我手动做了点调整，在一个我不是在构建时候生成的 dockerfile，是在创建项目时候就把 dockerfile 一起放在目录下，这样构建镜像时候不需要 goctl 了
:::

## 6、配置 k8s 拉取私有仓库镜像

k8s 在默认情况下，只能拉取 harbor 镜像仓库的公有镜像，如果拉取私有仓库镜像，则是会报 `ErrImagePull` 和 `ImagePullBackOff` 的错误

1、先在 jenkins 发布机器登陆 harbor

```shell
$ docker login 192.168.1.180:8077
$ Username: admin
$ Password:
Login Succeeded
```

2、在 k8s 中生成登陆 harbor 配置文件

```shell
#查看上一步登陆harbor生成的凭证
$ cat /root/.docker/config.json
{
	"auths": {
		"192.168.1.180:8077": {
			"auth": "YWRtaW46SGFyYm9yMTIzNDU="
		}
}
```

3、对秘钥文件进行 base64 加密

```shell
$ cat /root/.docker/config.json  | base64 -w 0

ewoJImF1dGhzIjogewoJCSIxOTIuMTY4LjEuMTgwOjgwNzciOiB7CgkJCSJhdXRoIjogIllXUnRhVzQ2U0dGeVltOXlNVEl6TkRVPSIKCQl9Cgl9Cn0=
```

4、创建 docker-secret.yaml

```yml
apiVersion: v1
kind: Secret
metadata:
  name: docker-login
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: ewoJImF1dGhzIjogewoJCSIxOTIuMTY4LjEuMTgwOjgwNzciOiB7CgkJCSJhdXRoIjogIllXUnRhVzQ2U0dGeVltOXlNVEl6TkRVPSIKCQl9Cgl9Cn0=
```

```shell
$ kubectl create -f docker-secret.yaml -n k8scode

secret "docker-login" created
```

## 7、构建

我们进入首页，点击”服务名称“进入详情页

<Image
src={require('../../resource/tutorials/ops/image-20220209201812134.png').default}
alt='image-20220209201812134'
/>

然后可以看到，上面我们配置好的 identity 服务，如下图 ，点击“Build with Parameters”， 然后选择 rpc,点击“开始构建”

<Image
src={require('../../resource/tutorials/ops/image-20220209201927466.png').default}
alt='image-20220209201927466'
/>

【注】第一次构建在拉代码时候都会失败，应该是初始化啥东西，再点一次就好了。

部署成功

<Image
src={require('../../resource/tutorials/ops/image-20220211142524599.png').default}
alt='image-20220211142524599'
/>

<Image
src={require('../../resource/tutorials/ops/image-20220211142613065.png').default}
alt='image-20220211142613065'
/>

<Image
src={require('../../resource/tutorials/ops/image-20220211142729231.png').default}
alt='image-20220211142729231'
/>

同样道理，在去构建 identity-api，再去配置 usercenter 服务 构建 usercenter-rpc、构建 usercenter-api，接着配置其他服务、构建即可，本次我们先只构建 identity-api、identity-rpc、usercenter-rpc、usercenter-api 给大家演示。

## 8、添加网关

因为我们的 api 服务通过 goctl 发布在 k8s 中都会暴露 nodeport 端口，索引我们看下 k8s 中 k8scode 命名空间下的 service 的 nodeport 端口服务，然后将 nodeport 配置在 nginx 即可。

本次我们独立一台虚拟机在 k8s 之外，安装 nginx，将 k8s 后端 api 服务通过 nodeport 方式把端口暴露给 nginx，然后 nginx 在配置中配置此 api 服务，这样 nginx 就充当网关使用。

nginx 的安装就不再这里多说了，记得一定要有 auth_request 模块，没有的话自己去安装。

nginx 的配置

```conf
server{
    listen 8081;
    access_log /var/log/nginx/k8scode.com_access.log;
    error_log /var/log/nginx//k8scode.com_error.log;

    location ~ /usercenter/ {
       auth_request /auth;
       auth_request_set $user $upstream_http_x_user;
       proxy_set_header x-user $user;

       proxy_set_header Host $http_host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header REMOTE-HOST $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_pass http://192.168.1.182:31002;
   }

   location ~ /travel/ {
       auth_request /auth;
       auth_request_set $user $upstream_http_x_user;
       proxy_set_header x-user $user;

       proxy_set_header Host $http_host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header REMOTE-HOST $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_pass http://192.168.1.182:31003;
   }


   ......
}
```

如果是线上的话，应该配置多台 nginx 保持高可用，在 nginx 前面还会有一个 slb，你的域名包括 https 配置都应该解析到 slb，在 slb 前面在有防火墙等这些。

## 9、结束语

至此，整个系列就结束了，整体架构图应该如第一篇所展示，本系列希望能给你带来帮助。
