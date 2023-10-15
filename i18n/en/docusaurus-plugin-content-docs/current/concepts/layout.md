---
title: Project Structure
sidebar_label: Project Structure
slug: /docs/concepts/layout
---

go-zero has its own project structure, usually generated through `goctl`.

## Project dimension

```text
.
├── consumer
├── go.mod
├── internal
│   └── model
├── job
├── pkg
├── restful
├── script
└── service
```

- consumer service consumer： queue
- internal: project Internal Accessible Public Module
- job： cron job service
- pkg： External Accessible Public Module
- restul：HTTP service directory, store services at service level
- script：script service directory, store script as dimension service
- service： gRPC service directory, store service as dimension

## Service dimension

```text
example
├── etc
│   └── example.yaml
├── main.go
└── internal
    ├── config
    │   └── config.go
    ├── handler
    │   ├── xxxhandler.go
    │   └── xxxhandler.go
    ├── logic
    │   └── xxxlogic.go
    ├── svc
    │   └── servicecontext.go
    └── types
        └── types.go
```

- example：single service directory, usually a microservice name
- etc：Static Profile Directory
- main.go：program boot entry file
- internal：Internal file for a single service, only the current service is visible
- config：Static Configuration File Static Body Declaration Directory
- handler：handler directory, optional, this layer will be managed by the general HTTP service,`handler` as fixed suffix
- logic：business directory, all business encoding files are stored below this directory,`logic` as fixed suffix
- svc：Depends on Injection directory, all the required dependencies of the logic layer are required to make explicit injections here
- types：structural directory