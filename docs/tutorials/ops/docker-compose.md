---
title: Docker Compose
sidebar_label: Docker Compose
slug: /docs/tutorials/ops/docker/compose
---

import { Image } from '@arco-design/web-react';

## 1、概述

本节我们介绍使用 docker 部署

docker 部署我们要使用到 harbor 镜像象仓库了，本地代码编写完成之后，构建镜像上传到 harbor，部署机器上直接拉取镜像启动即可。

## 2、项目代码

本节代码我们跟物理机部署一节代码保持一致，但是要多一步要使用 goctl 生成 dockerfile

在 apicode 项目根目录下执行如下命令生成 Dockerfile

```sh
$ goctl docker -go apicode.go
```

### 2.5、上传代码

将代码 push 到 gitlab 上去即可

### 2.6 、配置 jenkins 服务器的公钥

jenkins 需要来 gitlab 拉取代码进行构建，所以我们要将 jenkins 所在物理机器的公钥配置到 gitlab 中，进行免密登陆

<Image
src={require('../../resource/tutorials/ops/gitlab-pz-jenkins-sshkey.jpg').default}
alt='gitlab-pz-jenkins-sshkey'
/>

## 3、镜像仓库

去 harbor 创建本项目镜像仓库

<Image
src={require('../../resource/tutorials/ops/apicode-harbor_new.png').default}
alt='gitlab-pz-jenkins-sshkey'
/>

<Image
src={require('../../resource/tutorials/ops/apicode-harbor2_new.png').default}
alt='gitlab-pz-jenkins-sshkey'
/>

查看 push 命令

<Image
src={require('../../resource/tutorials/ops/image-20220209191757422_newnew.png').default}
alt='gitlab-pz-jenkins-sshkey'
/>

```sh
$ docker push 192.168.1.180:8077/apicode/REPOSITORY[:TAG]
```

## 3、Jenkins 发布

之前我们已经将 jenkins 与 gitlab 一起部署好了，接下来我们使用 jenkins 进行代码发布，只要编写 pipline 即可

### 3.1 创建 pipline

点击首页左侧“新建 item” ， 名称输入“apicode-docker”，选择“流水线”，然后确定

<Image
src={require('../../resource/tutorials/ops/apicode-docker.png').default}
alt='gitlab-pz-jenkins-sshkey'
/>

然后点击“General” , 选择“This project is parameterized” ， "添加参数"，“Choice Parameter”，如下图

<Image
src={require('../../resource/tutorials/ops/deploy-server-plpline-2.png').default}
alt='gitlab-pz-jenkins-sshkey'
/>

然后编写内容如下

<Image
src={require('../../resource/tutorials/ops/deploy-server-pipline-3.png').default}
alt='gitlab-pz-jenkins-sshkey'
/>

直接保存。

### 3.2 编辑 pipline

【注】在编写 pipline 之前我们还有一个公钥要配置，要将 jenkins 的公钥配置到运行服务的服务器上，因为我们使用 jenkins 构建好之后要将构建好的 tar 包使用 scp 传到运行服务器上，这时候就要免密登陆

查看 jenkins 所在的物理机公钥：

```shell
$ cat /root/.ssh/id_rsa.pub
```

配置到运行服务物理机的 /root/.ssh/authorized_keys 即可。

向下滑动找到`Pipeline script`,填写脚本内容

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
         stage('获取commit_id') {
              steps {
                  echo '获取commit_id'
                  git credentialsId: 'gitlab-cert', url: 'ssh://git@192.168.1.182:2222/root/apicode.git'
                  script {
                      env.commit_id = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                  }
              }
          }
          stage('Dockerfile Build') {
              steps{
                     script{
                         env.image = sh(returnStdout: true, script: 'echo ${JOB_NAME}-${type}:${commit_id}').trim()
                         env.jobname = sh(returnStdout: true, script: 'echo ${JOB_NAME}-${type}').trim()
                     }
                     sh 'echo 镜像名称：${image} && docker build  -t ${image} .'
              }
          }

          stage('上传到镜像仓库') {
              steps{
              	  //docker login 这里要注意，会把账号密码输出到jenkins页面，可以通过port.sh类似方式处理，官网文档有这里我就不详细写了
                  sh 'docker login --username=${docker_username} --password=${docker_pwd} http://${docker_repo}'
                  sh 'docker tag  ${image} ${docker_repo}/apicode/${image}'
                  sh 'docker push ${docker_repo}/apicode/${image}'
              }
          }

          stage('Deploy') {
              steps{
                 sh 'ssh root@192.168.1.183 docker login --username=${docker_username} --password=${docker_pwd} http://${docker_repo}'
                 sh 'ssh root@192.168.1.183 docker pull ${docker_repo}/apicode/${image}'
                 //  当然这里端口号可以选择放到配置哪里都可以
                 sh 'ssh root@192.168.1.183 docker run -d -p 8889:8889 ${docker_repo}/apicode/${image}'

              }
          }
      }
    }

## 4、构建发布

点击首页，找到 apicode 这个服务点击进去

<Image
src={require('../../resource/tutorials/ops/deploy-server-deploy.jpg').default}
alt='gitlab-pz-jenkins-sshkey'
/>

点击 Build with Parameters ，选择对应的“分支”跟“服务”，开始构建

<Image
src={require('../../resource/tutorials/ops/deploy-server-deploy-2.jpg').default}
alt='gitlab-pz-jenkins-sshkey'
/>

构建完成，最后我们来访问http://192.168.1.183:8889/hello?msg=mikael ，可以看到页面上输出

```json
{
  "msg": "hello->mikael"
}
```

至此，部署完成。当然你可以在前面加自己喜欢的网关进行转发到此服务中，比如 nginx、kong...
