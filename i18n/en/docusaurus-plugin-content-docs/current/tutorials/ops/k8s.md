---
title: K8s
sidebar_label: K8s
slug: /docs/tutorials/ops/k8s
---

import { Image } from '@arco-design/web-react';

## 1. Overview

Previously, the deployment environment section had already been set up to make gitlab, jenkins, harbor, k8s, and we'll write jenkin's pipline to publish our services fully into k8s through jenkins.

## 2. Middlewares Deployment

Deploy mysql, redis, es and others outside the k8s, simulate online independent environments (you want to deploy some middleware inside the k8s self-handling, this time focus on how to deploy the microservices developed by go-zero into the k8s cluster). Here I am using the docker-compose-env.yaml of the project and installing all the dependent third-party intermediate environments directly on the srv-data.com (192.168.1.181) server, provided the server is docker, dock-compose.

Login to 192.168.1.181

```shell
mkdir data && cd data && vim docker-compose.yml
docker-compose up -d
docker-compose ps #查看确认
```

## 3. Independent configuration

Put the configuration of each service independently and uniformly in a git warehouse, so that only one person can be given permission to change the files in this repository directly. When jenkins do cd, you will first pull the code to automatically build the configuration of the corresponding service and see the following pipline.

Why not configure center?

1) Modification of db, redis and so forth requires restart of services, but some configuration does not require reboot of service, the shipping dimension has a record of which is more likely to cause online accidents.

2) Easy to roll back.We found a new version online, and we changed the new version configuration.This is a time when there is a problem with online user feedback. If we build files into a mirror, you can roll back the previous version plus configuration directly using the k8s line command.If the configuration center is used, the code is rolled back, and the previous version will be reconfigured to escort the center back

Independent online repository directory structure is as follows (this structure is related to the writing in pipline)

go-zero official k8s configuration demo address: <https://github.com/zeroicro/zero-examples/blob/main/discovery/k8s/client/etc/k8s.yaml>

Also reference is made to configuration repository address ： <https://github.com/Mikaelemmmm/go-zero-looklook-pro-conf>

[NOTE ] 1. Modified Middle,Database, redis etc to change to 192.168.1.181 This machine is used as an intermediate for online environments.

2. another is our service discovery that we are deployed online in k8s, go-zero directly supports k8s service discoveries, so letcd is not required. We need to change target,k8s configuration when we configure zrpc customers.

## 4. Mirror Repository

Go to harbor to create this project's mirror repository

<Image src={require('../../resource/tutorials/ops/image-20220209190928092_new.png').default} alt='image-20220209190928092_new' />

<Image src={require('../../resource/tutorials/ops/image-20220209191633736.png').default} alt='image-20220209191633736' />

View the push command

<Image src={require('../../resource/tutorials/ops/image-20220209191757422.png').default} alt='image-20220209191757422' />

```sh
docker push 192.168.1.180:8077/k8scode/REPOSITORY[:TAG]
```

## 5. Write the pipline of jenkins

### 5.1 Configuration parameters

Visit <http://192.168.1.1180:8989/> Open jenkins, enter jenkins homepage, click on the left menu `to create an Item`

We first create a service pipeline

<Image src={require('../../resource/tutorials/ops/image-20220209195418130.png').default} alt='image-20220209195418130' />

Then click on “General”, select "This project is parameterized", "Add parameter", "Choice Parameter", like the beacon

<Image src={require('../../resource/tutorials/ops/image-20220209195724082.png').default} alt='image-20220209195724082' />

Then write the following

<Image src={require('../../resource/tutorials/ops/image-20220209195853856.png').default} alt='image-20220209195853856' />

Save directly.

### 5.2 Edit pipline

Swipe down to find `Pipeline scripts`, fill in script content

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

:::note is very important
when building optimization：pipline is using "/usr/local/bin/goctl kube xxxx" we're deploying using k8s yaml without etcds, but this deployment needs to be specified for the built k8s yaml. The idea is to look at the k8s service in this article below go-zero below ：<https://mp.weixin.qq.com/s/-WaWJaM_ePEQOf7ExNJe7w>

I have already specified the serviceAccount

So you need to create find-endpoints on your k8s, this serviceAccount and bind the corresponding permissions. yaml file I am ready. You just need to do it

Execute command kubectl apply -f auth.yaml, the auth.yaml file as follows:：

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

pipline generating k8s yaml files can support serviceAccount without using a template to specify serviceAccount at the time of generation; directly-specify -serviceAcount in pipline and add serviceAccount in the yaml generating k8s

```shell
/usr/local/bin/goctl kube deploy -secret docker-login -replicas 2 -nodePort 3${port} -requestCpu 200 -requestMem 50 -limitCpu 300 -limitMem 100 -name ${JOB_NAME}-${type} -namespace k8scode -image ${docker_repo}/${image} -o ${deployYaml} -port ${port} --serviceAccount find-endpoints
```

2. ${credentialsId}will replace your specific credentials with a string of strings in the "Add Credit" module, so we've filled in gitlab-cert here. If you are not this own replacement,${gitUrl}needs to be replaced with a git repository address for your code, other variables in${xxx}form need no modification, keeping it as it is.

3. This is a little different from the official document. Since my project folder is different, goctl generated dockerfile files that I adjusted manually because I did not create a dockerfile, when I created the project, placing the dockerfile together in the directory when creating the project, so no goctl was required to build the mirror
:::

## 6, Configure k8s pull private repository image

k8s, by default, can only pull a public mirror image of a hole in a repository. If a private repository image is pulled out, it is the error of the drill `ErrImagePull` and `ImagePullBackOff`

1. First Jenkins Publish Machine Login harbor

```shell
$ docker login 192.168.1.180:8077
$ Username: admin
$ Password:
Login Succeeded
```

2. Generate login harbor profile in k8s

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

3. Base64 encryption of key files

```shell
$ cat /root/.docker/config.json  | base64 -w 0

ewoJImF1dGhzIjogewoJCSIxOTIuMTY4LjEuMTgwOjgwNzciOiB7CgkJCSJhdXRoIjogIllXUnRhVzQ2U0dGeVltOXlNVEl6TkRVPSIKCQl9Cgl9Cn0=
```

4, Create docker-secret.yaml

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

## 7. Buildings

We go into the home page, click on the service name "Go to the details page

<Image src={require('../../resource/tutorials/ops/image-20220209201812134.png').default} alt='image-20220209201812134' />

Then see that we have configured an identity service like the shape, click "Build with Parameters", then select rpc, click "Start Build"

<Image src={require('../../resource/tutorials/ops/image-20220209201927466.png').default} alt='image-20220209201927466' />

The first time you build your code will fail. It's what should be initialized and it's good to do again.

Successfully Deployed

<Image src={require('../../resource/tutorials/ops/image-20220211142524599.png').default} alt='image-20220211142524599' />

<Image src={require('../../resource/tutorials/ops/image-20220211142613065.png').default} alt='image-20220211142613065' />

<Image src={require('../../resource/tutorials/ops/image-20220211142729231.png').default} alt='image-20220211142729231' />

In the same way, build identity-api, then configure usercenter services to build usercenter-rpc, build usercenter-api, then configure other services and build. This time we build identity-api, identity-rpc, usercenter-api and usercenter-api.

## 8. Add gateway

Because our api service will be exposed to nodeport ports through goctl, indexing the nodeport service in k8s in k8scode namespace, and then configuring nodeport in nginx.

This time, we have an independent VM installed nginx in addition to k8s, which exposes the k8s backend api service to nginx via nodeport, then nginx configures this api service in its configuration, so nginx is used as a gateway.

The nginx installation is no longer said here. Remember to have the auth_request module, and you don't have to install it yourself.

nginx configuration

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

If you are on the line, you should configure multiple nginx to remain highly available, there will be a slb before nginx and your domain names including the https' configurations should be parsed to slb, firewalls and so on before slb.

## 9. Final remarks

The whole series will come to an end and the overall architecture should be shown, as the first chapter shows, and it is the hope of this series to help you.
