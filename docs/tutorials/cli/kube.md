---
title: goctl kube
slug: /docs/tutorials/cli/kube
---

## 概述

goctl kube 可以快速生成 kubernetes deployment 资源文件。

头疼的 k8s yaml 文件编写？相信你也遇到过：

- K8S yaml 参数很多，需要边写边查？
- 保留回滚版本数怎么设？
- 如何探测启动成功，如何探活？
- 如何分配和限制资源？
- 如何设置时区？否则打印日志是 GMT 标准时间
- 如何暴露服务供其它服务调用？
- 如何根据 CPU 和内存使用率来配置水平伸缩？

首先，你需要知道有这些知识点，其次要把这些知识点都搞明白也不容易，再次，每次编写依然容易出错！

## goctl kube 指令

```bash
$ goctl kube --help
Generate kubernetes files

Usage:
  goctl kube [command]

Available Commands:
  deploy      Generate deployment yaml file

Flags:
  -h, --help   help for kube


Use "goctl kube [command] --help" for more information about a command.
```

goctl kube 目前支持生成 deployment yaml 文件。

### goctl kube deploy 指令

```bash
$ goctl kube deploy --help
Generate deployment yaml file

Usage:
  goctl kube deploy [flags]

Flags:
      --branch string            The branch of the remote repo, it does work with --remote
  -h, --help                     help for deploy
      --home string              The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --image string             The docker image of deployment (required)
      --imagePullPolicy string   Image pull policy. One of Always, Never, IfNotPresent
      --limitCpu int             The limit cpu to deploy (default 1000)
      --limitMem int             The limit memory to deploy (default 1024)
      --maxReplicas int          The max replicas to deploy (default 10)
      --minReplicas int          The min replicas to deploy (default 3)
      --name string              The name of deployment (required)
      --namespace string         The namespace of deployment (required)
      --nodePort int             The nodePort of the deployment to expose
      --o string                 The output yaml file (required)
      --port int                 The port of the deployment to listen on pod (required)
      --remote string            The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                                 The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --replicas int             The number of replicas to deploy (default 3)
      --requestCpu int           The request cpu to deploy (default 500)
      --requestMem int           The request memory to deploy (default 512)
      --revisions int            The number of revision history to limit (default 5)
      --secret string            The secret to image pull from registry
      --serviceAccount string    The ServiceAccount for the deployment
      --targetPort int           The targetPort of the deployment, default to port
```

| <img width={100}/> 参数字段 | <img width={150}/> 参数类型 |<img width={200}/> 是否必填 | <img width={200}/> 默认值 | <img width={800}/> 参数说明 |
| --- | --- | --- | --- | --- |
| branch | string | NO | 空字符串 | 远程模板所在 git 分支名称，仅当 `remote` 有值时使用 |
| home | string | NO | `${HOME}/.goctl` | 本地模板文件目录 |
| image | string | YES | 空字符串 | 镜像名称 |
| imagePullPolicy | string | YES | 空字符串 | 镜像拉取策略，Always：总是拉取，Never：从不拉取，IfNotPresent：不存在时拉取 |
| limitCpu | int | NO | `1000` | cpu 资源使用上限 |
| limitMem | int | NO | `1024` | 内存资源使用上限 |
| maxReplicas | int | NO | `10` | 最大保副本数 |
| minReplicas | int | NO | `3` | 最小保副本数 |
| name | string | YES | 空字符串 | deployment 名称 |
| namespace | string | YES | 空字符串 | k8s 域名空间 |
| nodePort | int | YES | 0 | 需要暴露的服务端口 |
| o | string | YES | 空字符串 |  yaml 文件名称 |
| port | int | YES | 0 | 需要监听的端口 |
| remote | string | NO | 空字符串 | 远程模板所在 git 仓库地址，当此字段传值时，优先级高于 `home` 字段值 |
| replicas | int | NO | `3` | 副本数 |
| requestCpu | int | NO | `500` | cpu 需求额度 |
| requestMem | int | NO | `512` | 内存需求额度 |
| revisions | int | NO | `1` | 保留的版本数量，便于回滚 |
| secret | string | NO | 空字符串 | 拉取镜像的密钥 |
| serviceAccount | string | NO | 空字符串 | 服务账户 |
| targetPort | int | NO | 0 | 目标 port |

## 使用示例

我们以 redis 镜像为例子演示如何使用 goctl kube deploy 指令生成 deployment yaml 文件。

```bash
$ goctl kube deploy -name redis -namespace adhoc -image redis:6-alpine -o redis.yaml -port 6379
Done.
```

执行上述命令后，会在当前目录下生成 redis.yaml 文件，内容如下：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: adhoc
  labels:
    app: redis
spec:
  replicas: 3
  revisionHistoryLimit: 5
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:6-alpine
        ports:
        - containerPort: 6379
        readinessProbe:
          tcpSocket:
            port: 6379
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          tcpSocket:
            port: 6379
          initialDelaySeconds: 15
          periodSeconds: 20
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1024Mi
        volumeMounts:
        - name: timezone
          mountPath: /etc/localtime
      volumes:
        - name: timezone
          hostPath:
            path: /usr/share/zoneinfo/Asia/Shanghai

---

apiVersion: v1
kind: Service
metadata:
  name: redis-svc
  namespace: adhoc
spec:
  ports:
  - port: 6379
    targetPort: 6379
  selector:
    app: redis

---

apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: redis-hpa-c
  namespace: adhoc
  labels:
    app: redis-hpa-c
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: redis
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: 80

---

apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: redis-hpa-m
  namespace: adhoc
  labels:
    app: redis-hpa-m
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: redis
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: memory
      targetAverageUtilization: 80
```
