---
title: 服务分组
slug: /docs/tutorials/proto/services/group
---

## 概述

go-zero 采用 gRPC 进行服务间的通信，我们通过 proto 文件来定义服务的接口，但是在实际的开发中，我们可能会有多个服务，如果不对服务进行文件分组，那么 goctl 生成的代码将会是一个大的文件夹，这样会导致代码的可维护性变差，因此服务分组可以提高代码的可读性和可维护性。

## 服务分组

在 go-zero 中，我们通过在 proto 文件中以 service 为维度来进行文件分组，我们可以在 proto 文件中定义多个 service，每个 service 都会生成一个独立的文件夹，这样就可以将不同的服务进行分组，从而提高代码的可读性和可维护性。

除了 proto 文件中定义了 service 外，分组与否还需要在 goctl 中控制，生成带分组或者不带分组的代码取决于开发者，我们通过示例来演示一下。

### 不带分组

假设我们有一个 proto 文件，如下：

```protobuf
syntax = "proto3";

package user;

option go_package = "github.com/example/user";

message LoginReq{}
message LoginResp{}
message UserInfoReq{}
message UserInfoResp{}
message UserInfoUpdateReq{}
message UserInfoUpdateResp{}
message UserListReq{}
message UserListResp{}

message UserRoleListReq{}
message UserRoleListResp{}
message UserRoleUpdateReq{}
message UserRoleUpdateResp{}
message UserRoleInfoReq{}
message UserRoleInfoResp{}
message UserRoleAddReq{}
message UserRoleAddResp{}
message UserRoleDeleteReq{}
message UserRoleDeleteResp{}


message UserClassListReq{}
message UserClassListResp{}
message UserClassUpdateReq{}
message UserClassUpdateResp{}
message UserClassInfoReq{}
message UserClassInfoResp{}
message UserClassAddReq{}
message UserClassAddResp{}
message UserClassDeleteReq{}
message UserClassDeleteResp{}

service UserService{
  rpc Login (LoginReq) returns (LoginResp);
  rpc UserInfo (UserInfoReq) returns (UserInfoResp);
  rpc UserInfoUpdate (UserInfoUpdateReq) returns (UserInfoUpdateResp);
  rpc UserList (UserListReq) returns (UserListResp);

  rpc UserRoleList (UserRoleListReq) returns (UserRoleListResp);
  rpc UserRoleUpdate (UserRoleUpdateReq) returns (UserRoleUpdateResp);
  rpc UserRoleInfo (UserRoleInfoReq) returns (UserRoleInfoResp);
  rpc UserRoleAdd (UserRoleAddReq) returns (UserRoleAddResp);
  rpc UserRoleDelete (UserRoleDeleteReq) returns (UserRoleDeleteResp);

  rpc UserClassList (UserClassListReq) returns (UserClassListResp);
  rpc UserClassUpdate (UserClassUpdateReq) returns (UserClassUpdateResp);
  rpc UserClassInfo (UserClassInfoReq) returns (UserClassInfoResp);
  rpc UserClassAdd (UserClassAddReq) returns (UserClassAddResp);
  rpc UserClassDelete (UserClassDeleteReq) returns (UserClassDeleteResp);
}
```

我们来看一下不分组的情况下，goctl 生成的代码结构：

```bash
.
├── etc
│   └── user.yaml
├── github.com
│   └── example
│       └── user
│           ├── user.pb.go
│           └── user_grpc.pb.go
├── go.mod
├── internal
│   ├── config
│   │   └── config.go
│   ├── logic
│   │   ├── loginlogic.go
│   │   ├── userclassaddlogic.go
│   │   ├── userclassdeletelogic.go
│   │   ├── userclassinfologic.go
│   │   ├── userclasslistlogic.go
│   │   ├── userclassupdatelogic.go
│   │   ├── userinfologic.go
│   │   ├── userinfoupdatelogic.go
│   │   ├── userlistlogic.go
│   │   ├── userroleaddlogic.go
│   │   ├── userroledeletelogic.go
│   │   ├── userroleinfologic.go
│   │   ├── userrolelistlogic.go
│   │   └── userroleupdatelogic.go
│   ├── server
│   │   └── userserviceserver.go
│   └── svc
│       └── servicecontext.go
├── user.go
├── user.proto
└── userservice
    └── userservice.go

10 directories, 24 files
```

:::note 温馨提示
在不进行分组的情况下，不支持在 proto 文件中定义多个 service，否则会报错。
:::

### 带分组

首先，我们需要在 proto 文件中定义多个 service，如下：

```protobuf
syntax = "proto3";

package user;

option go_package = "github.com/example/user";

message LoginReq{}
message LoginResp{}
message UserInfoReq{}
message UserInfoResp{}
message UserInfoUpdateReq{}
message UserInfoUpdateResp{}
message UserListReq{}
message UserListResp{}
service UserService{
  rpc Login (LoginReq) returns (LoginResp);
  rpc UserInfo (UserInfoReq) returns (UserInfoResp);
  rpc UserInfoUpdate (UserInfoUpdateReq) returns (UserInfoUpdateResp);
  rpc UserList (UserListReq) returns (UserListResp);
}

message UserRoleListReq{}
message UserRoleListResp{}
message UserRoleUpdateReq{}
message UserRoleUpdateResp{}
message UserRoleInfoReq{}
message UserRoleInfoResp{}
message UserRoleAddReq{}
message UserRoleAddResp{}
message UserRoleDeleteReq{}
message UserRoleDeleteResp{}
service UserRoleService{
  rpc UserRoleList (UserRoleListReq) returns (UserRoleListResp);
  rpc UserRoleUpdate (UserRoleUpdateReq) returns (UserRoleUpdateResp);
  rpc UserRoleInfo (UserRoleInfoReq) returns (UserRoleInfoResp);
  rpc UserRoleAdd (UserRoleAddReq) returns (UserRoleAddResp);
  rpc UserRoleDelete (UserRoleDeleteReq) returns (UserRoleDeleteResp);
}

message UserClassListReq{}
message UserClassListResp{}
message UserClassUpdateReq{}
message UserClassUpdateResp{}
message UserClassInfoReq{}
message UserClassInfoResp{}
message UserClassAddReq{}
message UserClassAddResp{}
message UserClassDeleteReq{}
message UserClassDeleteResp{}
service UserClassService{
  rpc UserClassList (UserClassListReq) returns (UserClassListResp);
  rpc UserClassUpdate (UserClassUpdateReq) returns (UserClassUpdateResp);
  rpc UserClassInfo (UserClassInfoReq) returns (UserClassInfoResp);
  rpc UserClassAdd (UserClassAddReq) returns (UserClassAddResp);
  rpc UserClassDelete (UserClassDeleteReq) returns (UserClassDeleteResp);
}
```

我们来看一下带分组的情况下，goctl 生成的代码结构：

```bash
.
├── client
│   ├── userclassservice
│   │   └── userclassservice.go
│   ├── userroleservice
│   │   └── userroleservice.go
│   └── userservice
│       └── userservice.go
├── etc
│   └── user.yaml
├── github.com
│   └── example
│       └── user
│           ├── user.pb.go
│           └── user_grpc.pb.go
├── go.mod
├── internal
│   ├── config
│   │   └── config.go
│   ├── logic
│   │   ├── userclassservice
│   │   │   ├── userclassaddlogic.go
│   │   │   ├── userclassdeletelogic.go
│   │   │   ├── userclassinfologic.go
│   │   │   ├── userclasslistlogic.go
│   │   │   └── userclassupdatelogic.go
│   │   ├── userroleservice
│   │   │   ├── userroleaddlogic.go
│   │   │   ├── userroledeletelogic.go
│   │   │   ├── userroleinfologic.go
│   │   │   ├── userrolelistlogic.go
│   │   │   └── userroleupdatelogic.go
│   │   └── userservice
│   │       ├── loginlogic.go
│   │       ├── userinfologic.go
│   │       ├── userinfoupdatelogic.go
│   │       └── userlistlogic.go
│   ├── server
│   │   ├── userclassservice
│   │   │   └── userclassserviceserver.go
│   │   ├── userroleservice
│   │   │   └── userroleserviceserver.go
│   │   └── userservice
│   │       └── userserviceserver.go
│   └── svc
│       └── servicecontext.go
├── user.go
└── user.proto

19 directories, 28 files
```

通过目录结构我们可以看出，logic、server、client 目录都会根据 service 进行分组。
