---
title: goctl kube
slug: /docs/tutorials/cli/kube
---

## Overview

goctl kube can quickly generate kubernetes employment resource files.

Make k8s yaml file for head?Believe you have met： as well.

- There are many parameters for K8S yaml, you need to write to the edge?
- What is the number of rollback versions to keep?
- How to detect successful startup and how do you explore?
- How to allocate and limit resources?
- How do I set the timezone?Otherwise, print log is GMT standard time
- How do I expose services to other service calls?
- How to configure horizontal scaling-up based on CPU and memory usage rates?

First of all, you need to know about these points of knowledge and secondly to make them clear and easy to understand. Once again, writing is still easy to make!

## goctl Kube directive

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

goctl kube currently supports generating employment yaml files.

### goctl kube deploy directive

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

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                        |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                           |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                     |
| image                                                | string                                              | YES                                            | Empty string                                       | Image name                                                                                                        |
| imagePullPolicy                                      | string                                              | YES                                            | Empty string                                       | Image pull policy, Always: Always pull, Never: Never pull, IfNotPresent: Pull when it does not exist              |
| limitCpu                                             | int                                                 | NO                                             | `1000`                                             | cpu resource usage limit                                                                                          |
| limitMem                                             | int                                                 | NO                                             | `1024`                                             | Maximum memory usage                                                                                              |
| maxReplicas                                          | int                                                 | NO                                             | `10`                                               | Maximum number of replicas                                                                                        |
| minReplicas                                          | int                                                 | NO                                             | `3`                                                | Minimum number of replicas                                                                                        |
| name                                                 | string                                              | YES                                            | Empty string                                       | deployment 名称                                                                                                     |
| namespace                                            | string                                              | YES                                            | Empty string                                       | k8s Domain Space                                                                                                  |
| nodePort                                             | int                                                 | YES                                            | 0                                                  | Service port to be exposed                                                                                        |
| o                                                    | string                                              | YES                                            | Empty string                                       | yaml file name                                                                                                    |
| port                                                 | int                                                 | YES                                            | 0                                                  | Port to listen                                                                                                    |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed |
| replicas                                             | int                                                 | NO                                             | `3`                                                | Number of replicas                                                                                                |
| requestCpu                                           | int                                                 | NO                                             | `500`                                              | cpu limit                                                                                                         |
| requestMem                                           | int                                                 | NO                                             | `512`                                              | Memory limit                                                                                                      |
| revisions                                            | int                                                 | NO                                             | `1`                                                | Number of reserved versions, easy to roll back                                                                    |
| secret                                               | string                                              | NO                                             | Empty string                                       | Pull the key of the mirror                                                                                        |
| serviceAccount                                       | string                                              | NO                                             | Empty string                                       | Service account                                                                                                   |
| targetPort                                           | int                                                 | NO                                             | 0                                                  | Target port                                                                                                       |


## Examples

We use the redis image as an example of how to generate employment yaml files using goctl kube uploy instructions.

```bash
$ goctl kube deploy -name redis -namespace adhoc -image redis:6-alpine -o redis.yaml -port 6379
Done.
```

After executing the above command, redis.yaml files will be generated in the current directory, following：

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
