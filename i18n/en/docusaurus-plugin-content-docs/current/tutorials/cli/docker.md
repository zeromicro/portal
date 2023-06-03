---
title: goctl docker
slug: /docs/tutorials/cli/docker
---

## Overview

The goctl docker command is used to generate a Dockerfile file file and build a Docker mirror.

## goctl docker directive

```bash
$ goctl docker --help
Generate Dockerfile

Usage:
  goctl docker [flags]

Flags:
      --base string      The base image to build the docker image, default scratch (default "scratch")
      --branch string    The branch of the remote repo, it does work with --remote
      --exe string       The executable name in the built image
      --go string        The file that contains main function
  -h, --help             help for docker
      --home string      The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --port int         The port to expose, default none
      --remote string    The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                         The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --tz string        The timezone of the container (default "Asia/Shanghai")
      --version string   The goctl builder golang image version
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                        |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| base                                                 | string                                              | NO                                             | scratch                                            | Base Image                                                                                                        |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                           |
| exe                                                  | string                                              | NO                                             | Primary function filename                          | Output executable name                                                                                            |
| go                                                   | string                                              | YES                                            | Empty string                                       | Primary function filename                                                                                         |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                     |
| port                                                 | int                                                 | NO                                             | 0                                                  | Port number to be exposed, if not transmitted or passed 0                                                         |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed |
| tz                                                   | string                                              | NO                                             | `Asia/Shanghai`                                    | Set Time Zone                                                                                                     |
| version                                              | string                                              | YES                                            | Empty string                                       | Golang Mirror Version Number                                                                                      |

## Examples

We create a Demo project with `goctl api new hello` command, then enter the project directory, execute `goctl docker` command, generate a Dockerfile file.

The following end instructions demonstrate how to create a goctl project from scratch, then generate a Dockerfile file file to finally build a Docker mirror, and finally run a Docker container.

```bash
# go to your personal home directory
$ cd ~

# create a hello project
$ goctl api new hello
Done.

# enter the hello project directory
$ cd hello

# view directory structure
$ tree
.
├── etc
│   └── hello-api.yaml
├── go.mod
├── hello.api
├── hello.go
└── internal
    ├── config
    │   └── config.go
    ├── handler
    │   ├── hellohandler.go
    │   └── routes.go
    ├── logic
    │   └── hellologic.go
    ├── svc
    │   └── servicecontext.go
    └── types
        └── types.go

7 directories, 10 files

# generate Dockerfile
$ goctl docker --go hello.go --exe hello
Hint: run "docker build ..." command in dir:
    /Users/keson/hello
Done.

# view Dockerfile
$ cat Dockerfile
FROM golang:alpine AS builder

LABEL stage=gobuilder

ENV CGO_ENABLED 0
ENV GOPROXY https://goproxy.cn,direct
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

RUN apk update --no-cache && apk add --no-cache tzdata

WORKDIR /build

ADD go.mod .
ADD go.sum .
RUN go mod download
COPY . .
COPY ./etc /app/etc
RUN go build -ldflags="-s -w" -o /app/hello hello.go


FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /usr/share/zoneinfo/Asia/Shanghai
ENV TZ Asia/Shanghai

WORKDIR /app
COPY --from=builder /app/hello /app/hello
COPY --from=builder /app/etc /app/etc

CMD ["./hello", "-f", "etc/hello-api.yaml"]

$ go mod tidy
go: finding module for package github.com/zeromicro/go-zero/core/conf
go: finding module for package github.com/zeromicro/go-zero/core/logx
go: finding module for package github.com/zeromicro/go-zero/rest
go: finding module for package github.com/zeromicro/go-zero/rest/httpx
go: found github.com/zeromicro/go-zero/core/conf in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/rest in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/rest/httpx in github.com/zeromicro/go-zero v1.4.3
go: found github.com/zeromicro/go-zero/core/logx in github.com/zeromicro/go-zero v1.4.3

# execute command `docker build` to build image in hello directory
$ docker build -t hello:v1 .
[+] Building 72.5s (20/20) FINISHED
 => [internal] load build definition from Dockerfile                                                     0.0s
 => => transferring dockerfile: 37B                                                                      0.0s
 => [internal] load .dockerignore                                                                        0.0s
 => => transferring context: 2B                                                                          0.0s
 => [internal] load metadata for docker.io/library/golang:alpine                                         1.0s
 => [internal] load build context                                                                        0.2s
 => => transferring context: 142.47kB                                                                    0.1s
 => [builder  1/10] FROM docker.io/library/golang:alpine@sha256:a9b24b67dc83b3383d22a14941c2b2b2ca6a10  25.5s
 => => resolve docker.io/library/golang:alpine@sha256:a9b24b67dc83b3383d22a14941c2b2b2ca6a103d805cac682  0.0s
 => => sha256:7f1d6579712341e8062db43195deb2d84f63b0f2d1ed7c3d2074891085ea1b56 116.88MB / 116.88MB      19.9s
 => => sha256:a9b24b67dc83b3383d22a14941c2b2b2ca6a103d805cac6820fd1355943beaf1 1.65kB / 1.65kB           0.0s
 => => sha256:d34d005738c897bad9671117acf4a27fe7d5ab80e129bf2aba2fa7c344c416e4 1.16kB / 1.16kB           0.0s
 => => sha256:3b877c93f9b7d6e7c07329c02d3a29d306b35bbe06d1c79d00d54d6ce2e5a360 5.13kB / 5.13kB           0.0s
 => => sha256:261da4162673b93e5c0e7700a3718d40bcc086dbf24b1ec9b54bca0b82300626 3.26MB / 3.26MB           2.7s
 => => sha256:bc729abf26b5aade3c4426d388b5ea6907fe357dec915ac323bb2fa592d6288f 286.22kB / 286.22kB       1.8s
 => => sha256:652874aefa1343799c619d092ab9280b25f96d97939d5d796437e7288f5599c9 156B / 156B               2.3s
 => => extracting sha256:261da4162673b93e5c0e7700a3718d40bcc086dbf24b1ec9b54bca0b82300626                0.2s
 => => extracting sha256:bc729abf26b5aade3c4426d388b5ea6907fe357dec915ac323bb2fa592d6288f                0.1s
 => => extracting sha256:7f1d6579712341e8062db43195deb2d84f63b0f2d1ed7c3d2074891085ea1b56                5.2s
 => => extracting sha256:652874aefa1343799c619d092ab9280b25f96d97939d5d796437e7288f5599c9                0.0s
 => [builder  2/10] RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories     0.6s
 => [builder  3/10] RUN apk update --no-cache && apk add --no-cache tzdata                              24.6s
 => [builder  4/10] WORKDIR /build                                                                       0.0s
 => [builder  5/10] ADD go.mod .                                                                         0.0s
 => [builder  6/10] ADD go.sum .                                                                         0.0s
 => [builder  7/10] RUN go mod download                                                                 11.3s
 => [builder  8/10] COPY . .                                                                             0.0s
 => [builder  9/10] COPY ./etc /app/etc                                                                  0.0s
 => [builder 10/10] RUN go build -ldflags="-s -w" -o /app/hello hello.go                                 9.1s
 => [stage-1 1/5] COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates  0.0s
 => [stage-1 2/5] COPY --from=builder /usr/share/zoneinfo/Asia/Shanghai /usr/share/zoneinfo/Asia/Shangh  0.0s
 => [stage-1 3/5] WORKDIR /app                                                                           0.0s
 => [stage-1 4/5] COPY --from=builder /app/hello /app/hello                                              0.0s
 => [stage-1 5/5] COPY --from=builder /app/etc /app/etc                                                  0.0s
 => exporting to image                                                                                   0.1s
 => => exporting layers                                                                                  0.1s
 => => writing image sha256:586fe3aab42d3d27ad73118334be072577801de18c22694b380161f00656dd7a             0.0s
 => => naming to docker.io/library/hello:v1                                                              0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them

# Run service
$ docker run --rm -it -p 8888:8888 hello:v1
Starting server at 0.0.0.0:8888...

# Open a new terminal and execute curl for testing
$ curl -i http://localhost:8888/from/you
curl -i http://localhost:8888/from/you
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Traceparent: 00-7950f2af01228e73c5adcf1670e309d2-2d8262ef5bd4f5a2-00
Date: Fri, 06 Jan 2023 06:41:34 GMT
Content-Length: 4

null%
```