---
title: Docker Compose
sidebar_label: Docker Compose
slug: /docs/tutorials/ops/docker/compose
---

import { Image } from '@arco-design/web-react';

## 1. Overview

This section describes the use of docker deployment

The docker deploys us to use the harbor mirror repository. Once the local code is written, build the mirror to be uploaded to harbor.

## 2. Project code

This section code is consistent with a section code deployed by the physical machine, but needs to use goctl to generate a dockerfile step

Execute the following command to generate Dockerfile at the root of the apicode project

```sh
$ goctl docker -go apicode.go
```

### 2.1 Upload code

Push the code to the gitlab

### 2.2 Public key for configuring jenkins server

jenkins needs a gitlab pull code to build, so we want to configure the public key of the jenkins physical machine to gitlab and unencrypt login

<Image src={require('../../resource/tutorials/ops/gitlab-pz-jenkins-sshkey.jpg').default} alt='gitlab-pz-jenkins-sshkey' />

## 3. Mirror Repository

Go to harbor to create this project's mirror repository

<Image src={require('../../resource/tutorials/ops/apicode-harbor_new.png').default} alt='gitlab-pz-jenkins-sshkey' />

<Image src={require('../../resource/tutorials/ops/apicode-harbor2_new.png').default} alt='gitlab-pz-jenkins-sshkey' />

View the push command

<Image src={require('../../resource/tutorials/ops/image-20220209191757422_newnew.png').default} alt='gitlab-pz-jenkins-sshkey' />

```sh
$ docker push 192.168.1.180:8077/apicode/REPOSITORY[:TAG]
```

## 4. Jenkins deployment

We have already deployed jenkins with gitlab and then we use jenkins to publish the code as long as you write pipline

### 4.1 Create pipline

Click "New Item" on the left side of the front page, enter "apicode-docker", select "Waterlines", then determine

<Image src={require('../../resource/tutorials/ops/apicode-docker.png').default} alt='gitlab-pz-jenkins-sshkey' />

Then click on “General”, select "This project is parameterized", "Add parameter", "Choice Parameter", like the beacon

<Image src={require('../../resource/tutorials/ops/deploy-server-plpline-2.png').default} alt='gitlab-pz-jenkins-sshkey' />

Then write the following

<Image src={require('../../resource/tutorials/ops/deploy-server-pipline-3.png').default} alt='gitlab-pz-jenkins-sshkey' />

Save directly.

### 4.2 Edit pipline

'Note' We have a public key to configure before writing pipline to configure jenkins public key to the server running the service because we build using jenkins and then upload the built tar package to the running server using scp.

View jenkins host public key：

```shell
$ cat /root/.ssh/id_rsa.pub
```

Configure to the /root/.ssh/authorized_keys running the service physics.

Swipe down to find `Pipeline scripts`, fill in script content

```pipeline
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
```

## 5. Build Publication

Click on the home page to find the apicode service to click on it

<Image src={require('../../resource/tutorials/ops/deploy-server-deploy.jpg').default} alt='gitlab-pz-jenkins-sshkey' />

Tap Build with Parameters, select the corresponding "branch" to "Service" to start building

<Image src={require('../../resource/tutorials/ops/deploy-server-deploy-2.jpg').default} alt='gitlab-pz-jenkins-sshkey' />

Build finished, we go to http://192.168.1.183:8889/hello?msg=mikael to see output on page

```json
{
  "msg": "hello->mikael"
}
```

As of then, deployment has been completed.Of course you can forward your favorite gateway to this service like nginx, kong...
