---
title: goctl model
slug: /docs/tutorials/cli/model
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

The database model code generation instruction provided by goctl model for goctl is currently supported by MySQL, PostgreSQL, Mongo code generation, MySQL support from sql files and database connections and PostgreSQL support from database connections only.

## goctl model directive

```bash
$ goctl model  --help
Generate model code

Usage:
  goctl model [command]

Available Commands:
  mongo       Generate mongo model
  mysql       Generate mysql model
  pg          Generate postgresql model

Flags:
  -h, --help   help for model


Use "goctl model [command] --help" for more information about a command.
```

### goctl model mono directive

Mongo is generated different than MySQL. MySQL and MySQL can read a table of information (field name, data type, index, etc.) from the scheme_information library, while Mongo is a document type database, we are temporarily unable to read a record from the db to get the field information, even if it is not necessarily complete (some fields may be omitempty modifications, if any) where type type is self-writing+ code generated.

```bash
$ goctl model mongo --help
Generate mongo model

Usage:
  goctl model mongo [flags]

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -c, --cache           Generate code with cache [optional]
  -d, --dir string      The target dir
  -e, --easy            Generate code with auto generated CollectionName for easy declare [optional]
  -h, --help            help for mongo
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --style string    The file naming format, see [https://github.com/zeromicro/go-zero/tree/master/tools/goctl/config/readme.md]
  -t, --type strings    Specified model type name
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                        |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                           |
| cache                                                | boolean                                             | NO                                             | `false`                                            | Whether or not to generate code with cache                                                                        |
| dir                                                  | string                                              | NO                                             | Current working directory                          | Generate Code Output Directory                                                                                    |
| easy                                                 | boolean                                             | NO                                             | `false`                                            | Exposure pool name variable                                                                                       |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                     |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a>                                |
| type                                                 | []string                                            | YES                                            | `nil`                                              | Structure Type Name                                                                                               |

#### Examples

Below are examples of generating a user structure.

1. Whether or not to generate code with cache

```bash
# enter user home
$ cd ~

# make dir named demo 
$ mkdir demo && cd demo

# generate mongo code by goctl
$ goctl model mongo --type User --dir cache --cache

# view layout
$ tree
.
└── cache
    ├── error.go
    ├── usermodel.go
    ├── usermodelgen.go
    └── usertypes.go

1 directory, 4 files

```

View code

<Tabs>
<TabItem value="error.go" label="error.go" default>

```go
package model

import (
    "errors"

    "github.com/zeromicro/go-zero/core/stores/mon"
)

var (
    ErrNotFound        = mon.ErrNotFound
    ErrInvalidObjectId = errors.New("invalid objectId")
)
```

</TabItem>
<TabItem value="usermodel.go" label="usermodel.go" default>

```go
package model

import (
    "github.com/zeromicro/go-zero/core/stores/cache"
    "github.com/zeromicro/go-zero/core/stores/monc"
)

var _ UserModel = (*customUserModel)(nil)

type (
    // UserModel is an interface to be customized, add more methods here,
    // and implement the added methods in customUserModel.
    UserModel interface {
        userModel
    }

    customUserModel struct {
        *defaultUserModel
    }
)

// NewUserModel returns a model for the mongo.
func NewUserModel(url, db, collection string, c cache.CacheConf) UserModel {
    conn := monc.MustNewModel(url, db, collection, c)
    return &customUserModel{
        defaultUserModel: newDefaultUserModel(conn),
    }
}
```

</TabItem>

<TabItem value="usermodelgen.go" label="usermodelgen.go" default>

```go
// Code generated by goctl. DO NOT EDIT.
package model

import (
    "context"
    "time"

    "github.com/zeromicro/go-zero/core/stores/monc"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

var prefixUserCacheKey = "cache:user:"

type userModel interface {
    Insert(ctx context.Context, data *User) error
    FindOne(ctx context.Context, id string) (*User, error)
    Update(ctx context.Context, data *User) error
    Delete(ctx context.Context, id string) error
}

type defaultUserModel struct {
    conn *monc.Model
}

func newDefaultUserModel(conn *monc.Model) *defaultUserModel {
    return &defaultUserModel{conn: conn}
}

func (m *defaultUserModel) Insert(ctx context.Context, data *User) error {
    if data.ID.IsZero() {
        data.ID = primitive.NewObjectID()
        data.CreateAt = time.Now()
        data.UpdateAt = time.Now()
    }

    key := prefixUserCacheKey + data.ID.Hex()
    _, err := m.conn.InsertOne(ctx, key, data)
    return err
}

func (m *defaultUserModel) FindOne(ctx context.Context, id string) (*User, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, ErrInvalidObjectId
    }

    var data User
    key := prefixUserCacheKey + id
    err = m.conn.FindOne(ctx, key, &data, bson.M{"_id": oid})
    switch err {
    case nil:
        return &data, nil
    case monc.ErrNotFound:
        return nil, ErrNotFound
    default:
        return nil, err
    }
}

func (m *defaultUserModel) Update(ctx context.Context, data *User) error {
    data.UpdateAt = time.Now()
    key := prefixUserCacheKey + data.ID.Hex()
    _, err := m.conn.ReplaceOne(ctx, key, bson.M{"_id": data.ID}, data)
    return err
}

func (m *defaultUserModel) Delete(ctx context.Context, id string) error {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return ErrInvalidObjectId
    }
    key := prefixUserCacheKey + id
    _, err = m.conn.DeleteOne(ctx, key, bson.M{"_id": oid})
    return err
}
```

</TabItem>

<TabItem value="usertypes.go" label="usertypes.go" default>

```go
package model

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}
```

</TabItem>
</Tabs>

2. Generate code without cache

```bash
# enter user home
$ cd ~

# make dir named demo 
$ mkdir demo && cd demo

# generate mongo code by goctl
$ goctl model mongo --type User --dir nocache

# view layout
$ tree
.
└── nocache
    ├── error.go
    ├── usermodel.go
    ├── usermodelgen.go
    └── usertypes.go

1 directory, 4 files
```

View code

<Tabs>
<TabItem value="error.go" label="error.go" default>

```go
package model

import (
    "errors"

    "github.com/zeromicro/go-zero/core/stores/mon"
)

var (
    ErrNotFound        = mon.ErrNotFound
    ErrInvalidObjectId = errors.New("invalid objectId")
)
```

</TabItem>
<TabItem value="usermodel.go" label="usermodel.go" default>

```go
package model

import "github.com/zeromicro/go-zero/core/stores/mon"

var _ UserModel = (*customUserModel)(nil)

type (
    // UserModel is an interface to be customized, add more methods here,
    // and implement the added methods in customUserModel.
    UserModel interface {
        userModel
    }

    customUserModel struct {
        *defaultUserModel
    }
)

// NewUserModel returns a model for the mongo.
func NewUserModel(url, db, collection string) UserModel {
    conn := mon.MustNewModel(url, db, collection)
    return &customUserModel{
        defaultUserModel: newDefaultUserModel(conn),
    }
}
```

</TabItem>

<TabItem value="usermodelgen.go" label="usermodelgen.go" default>

```go
// Code generated by goctl. DO NOT EDIT.
package model

import (
    "context"
    "time"

    "github.com/zeromicro/go-zero/core/stores/mon"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type userModel interface {
    Insert(ctx context.Context, data *User) error
    FindOne(ctx context.Context, id string) (*User, error)
    Update(ctx context.Context, data *User) error
    Delete(ctx context.Context, id string) error
}

type defaultUserModel struct {
    conn *mon.Model
}

func newDefaultUserModel(conn *mon.Model) *defaultUserModel {
    return &defaultUserModel{conn: conn}
}

func (m *defaultUserModel) Insert(ctx context.Context, data *User) error {
    if data.ID.IsZero() {
        data.ID = primitive.NewObjectID()
        data.CreateAt = time.Now()
        data.UpdateAt = time.Now()
    }

    _, err := m.conn.InsertOne(ctx, data)
    return err
}

func (m *defaultUserModel) FindOne(ctx context.Context, id string) (*User, error) {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return nil, ErrInvalidObjectId
    }

    var data User

    err = m.conn.FindOne(ctx, &data, bson.M{"_id": oid})
    switch err {
    case nil:
        return &data, nil
    case mon.ErrNotFound:
        return nil, ErrNotFound
    default:
        return nil, err
    }
}

func (m *defaultUserModel) Update(ctx context.Context, data *User) error {
    data.UpdateAt = time.Now()

    _, err := m.conn.ReplaceOne(ctx, bson.M{"_id": data.ID}, data)
    return err
}

func (m *defaultUserModel) Delete(ctx context.Context, id string) error {
    oid, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return ErrInvalidObjectId
    }

    _, err = m.conn.DeleteOne(ctx, bson.M{"_id": oid})
    return err
}
```

</TabItem>

<TabItem value="usertypes.go" label="usertypes.go" default>

```go
package model

import (
    "time"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
    ID primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
    // TODO: Fill your own fields
    UpdateAt time.Time `bson:"updateAt,omitempty" json:"updateAt,omitempty"`
    CreateAt time.Time `bson:"createAt,omitempty" json:"createAt,omitempty"`
}
```

</TabItem>
</Tabs>

### goctl model mysql directive

The goctl model mysql directive is used to generate MySQL based model code that supports the generation of cached and non-cached code.MySQL code generation support from sql files. Database connection to two sources to generate code.

```bash
$ goctl model mysql --help
Generate mysql model

Usage:
  goctl model mysql [command]

Available Commands:
  datasource  Generate model from datasource
  ddl         Generate mysql model from ddl

Flags:
  -h, --help                     help for mysql
  -i, --ignore-columns strings   Ignore columns while creating or updating rows (default [create_at,created_at,create_time,update_at,updated_at,update_time])
      --strict                   Generate model in strict mode


Use "goctl model mysql [command] --help" for more information about a command.
```

#### goctl model mysql datasource directive

goctl model mysql datasource instructions are used to generate model code from database connections.

```bash
$ goctl model mysql datasource --help
Generate model from datasource

Usage:
  goctl model mysql datasource [flags]

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -c, --cache           Generate code with cache [optional]
  -d, --dir string      The target dir
  -h, --help            help for datasource
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --idea            For idea plugin [optional]
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                        The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
      --style string    The file naming format, see [https://github.com/zeromicro/go-zero/tree/master/tools/goctl/config/readme.md]
  -t, --table strings   The table or table globbing patterns in the database
      --url string      The data source of database,like "root:password@tcp(127.0.0.1:3306)/database"


Global Flags:
  -i, --ignore-columns strings   Ignore columns while creating or updating rows (default [create_at,created_at,create_time,update_at,updated_at,update_time])
      --strict                   Generate model in strict mode
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                                                                                                                                                                                                                                                                                   |
| cache                                                | boolean                                             | NO                                             | `false`                                            | Whether or not to generate code with cache                                                                                                                                                                                                                                                                                                                                |
| dir                                                  | string                                              | NO                                             | Current working directory                          | Generate Code Output Directory                                                                                                                                                                                                                                                                                                                                            |
| easy                                                 | boolean                                             | NO                                             | `false`                                            | Exposure pool name variable                                                                                                                                                                                                                                                                                                                                               |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                                                                                                                                                                                                                                                                             |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed                                                                                                                                                                                                                                                         |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a>                                                                                                                                                                                                                                                                                        |
| table                                                | []string                                            | YES                                            | `nil`                                              | Table to generate code                                                                                                                                                                                                                                                                                                                                                    |
| url                                                  | string                                              | YES                                            | Empty string                                       | Database connection,format{{username}}:{{password}}@tcp({{host_port}}) /{{db}}                                                                                                                                                                                                                                                                                            |
| ignore-columns                                       | []string                                            | NO                                             | `nil`                                              | Fields that need to be ignored, inserted or updated, such as `create_time`                                                                                                                                                                                                                                                                                                |
| strict                                               | boolean                                             | NO                                             | `false`                                            | Whether it is a strict mode and, if it is rigid, the modified field `unsigned` will be converted to the corresponding data type, primarily for numerical types, e.g.：if the name of the database indicates `bigint` type, The result is`unsigned` modifies the corresponding golang data type to `int64`, For `uint64`, if strict is false, no modification to `unsigned` |

#### goctl model mysql ddl directive

goctl model mysql ddl instructions are used to generate model code from sql files.

```bash
$ goctl model mysql ddl --help
Generate mysql model from ddl

Usage:
  goctl model mysql ddl [flags]

Flags:
      --branch string     The branch of the remote repo, it does work with --remote
  -c, --cache             Generate code with cache [optional]
      --database string   The name of database [optional]
  -d, --dir string        The target dir
  -h, --help              help for ddl
      --home string       The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --idea              For idea plugin [optional]
      --remote string     The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                          The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
  -s, --src string        The path or path globbing patterns of the ddl
      --style string      The file naming format, see [https://github.com/zeromicro/go-zero/tree/master/tools/goctl/config/readme.md]


Global Flags:
  -i, --ignore-columns strings   Ignore columns while creating or updating rows (default [create_at,created_at,create_time,update_at,updated_at,update_time])
      --strict                   Generate model in strict mode
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                                                                                                                                                                                                                                                                                   |
| cache                                                | boolean                                             | NO                                             | `false`                                            | Whether or not to generate code with cache                                                                                                                                                                                                                                                                                                                                |
| dir                                                  | string                                              | NO                                             | Current working directory                          | Generate Code Output Directory                                                                                                                                                                                                                                                                                                                                            |
| easy                                                 | boolean                                             | NO                                             | `false`                                            | Exposure pool name variable                                                                                                                                                                                                                                                                                                                                               |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                                                                                                                                                                                                                                                                             |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed                                                                                                                                                                                                                                                         |
| src                                                  | string                                              | YES                                            | Empty string                                       | sql file path                                                                                                                                                                                                                                                                                                                                                             |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a>                                                                                                                                                                                                                                                                                        |
| ignore-columns                                       | []string                                            | NO                                             | `nil`                                              | Fields that need to be ignored, inserted or updated, such as `create_time`                                                                                                                                                                                                                                                                                                |
| strict                                               | boolean                                             | NO                                             | `false`                                            | Whether it is a strict mode and, if it is rigid, the modified field `unsigned` will be converted to the corresponding data type, primarily for numerical types, e.g.：if the name of the database indicates `bigint` type, The result is`unsigned` modifies the corresponding golang data type to `int64`, For `uint64`, if strict is false, no modification to `unsigned` |

#### MySQL type mapping relationships

<Tabs>

<TabItem value="strict model" label="strict 为 true 时，且 unsigned 修饰" default>

| <img width={100} /> MySQL DataType | <img width={200} /> is null constraint? | <img width={400} /> Golang DataType|
| --- | --- | --- |
| bit | NO | byte |
| tinyint | NO | uint64 |
| tinyint | YES | sql.NullInt64 |
| smallint | NO | uint64 |
| smallint | YES | sql.NullInt64 |
| mediumint | NO | uint64 |
| mediumint | YES | sql.NullInt64 |
| int | NO | uint64 |
| int | YES | sql.NullInt64 |
| middleint | NO | uint64 |
| middleint | YES | sql.NullInt64 |
| int1 | NO | uint64 |
| int1 | YES | sql.NullInt64 |
| int2 | NO | uint64 |
| int2 | YES | sql.NullInt64 |
| int3 | NO | uint64 |
| int3 | YES | sql.NullInt64 |
| int4 | NO | uint64 |
| int4 | YES | sql.NullInt64 |
| int8 | NO | iunt64 |
| int8 | YES | sql.NullInt64 |
| integer | NO | uint64 |
| integer | YES | sql.NullInt64 |
| bigint | NO | uint64 |
| bigint | YES | sql.NullInt64 |
| float | NO | float64 |
| float | YES | sql.NullFloat64 |
| float4 | NO | float64 |
| float4 | YES | sql.NullFloat64 |
| float8 | NO | float64 |
| float8 | YES | sql.NullFloat64 |
| date | NO | time.Time |
| datetime | NO | time.Time |
| timstamp | NO | time.Time |
| time | NO | string |
| year | NO | int64 |
| char | NO | string |
| varchar | NO | string |
| nvarchar | NO | string |
| nchar | NO | string |
| character | NO | string |
| longvarchar | NO | string |
| linestring | NO | string |
| multilinestring | NO | string |
| binary | NO | string |
| varbinary | NO | string |
| tinytext | NO | string |
| text | NO | string |
| mediumtext | NO | string |
| longtext | NO | string |
| enum | NO | string |
| set | NO | string |
| json | NO | string |
| blob | NO | string |
| longblob | NO | string |
| mediumblob | NO | string |
| tinyblob | NO | string |
| bool | NO | bool |
| bllean | NO | bool |

</TabItem>

<TabItem value="no strict model" label="strict 不为 true 时" default>

| <img width={100} /> MySQL 类型 | <img width={200} /> 是否为 null 约束 | <img width={400} /> Golang 类型 |
| --- | --- | --- |
| bit | NO | byte |
| tinyint | NO | int64 |
| tinyint | YES | sql.NullInt64 |
| smallint | NO | int64 |
| smallint | YES | sql.NullInt64 |
| mediumint | NO | int64 |
| mediumint | YES | sql.NullInt64 |
| int | NO | int64 |
| int | YES | sql.NullInt64 |
| middleint | NO | int64 |
| middleint | YES | sql.NullInt64 |
| int1 | NO | int64 |
| int1 | YES | sql.NullInt64 |
| int2 | NO | int64 |
| int2 | YES | sql.NullInt64 |
| int3 | NO | int64 |
| int3 | YES | sql.NullInt64 |
| int4 | NO | int64 |
| int4 | YES | sql.NullInt64 |
| int8 | NO | int64 |
| int8 | YES | sql.NullInt64 |
| integer | NO | int64 |
| integer | YES | sql.NullInt64 |
| bigint | NO | int64 |
| bigint | YES | sql.NullInt64 |
| float | NO | float64 |
| float | YES | sql.NullFloat64 |
| float4 | NO | float64 |
| float4 | YES | sql.NullFloat64 |
| float8 | NO | float64 |
| float8 | YES | sql.NullFloat64 |
| date | NO | time.Time |
| datetime | NO | time.Time |
| timstamp | NO | time.Time |
| time | NO | string |
| year | NO | int64 |
| char | NO | string |
| varchar | NO | string |
| nvarchar | NO | string |
| nchar | NO | string |
| character | NO | string |
| longvarchar | NO | string |
| linestring | NO | string |
| multilinestring | NO | string |
| binary | NO | string |
| varbinary | NO | string |
| tinytext | NO | string |
| text | NO | string |
| mediumtext | NO | string |
| longtext | NO | string |
| enum | NO | string |
| set | NO | string |
| json | NO | string |
| blob | NO | string |
| longblob | NO | string |
| mediumblob | NO | string |
| tinyblob | NO | string |
| bool | NO | bool |
| bllean | NO | bool |

</TabItem>

</Tabs>

### goctl model pg directive

goctl model pg instructions are used to generate Go language code from PostgreSQL database.

```bash
$ goctl model pg --help
Generate postgresql model

Usage:
  goctl model pg [flags]
  goctl model pg [command]

Available Commands:
  datasource  Generate model from datasource

Flags:
  -h, --help   help for pg


Use "goctl model pg [command] --help" for more information about a command.
```

#### goctl model pg datasource directive

```bash
$ goctl model pg datasource --help
Generate model from datasource

Usage:
  goctl model pg datasource [flags]

Flags:
      --branch string   The branch of the remote repo, it does work with --remote
  -c, --cache           Generate code with cache [optional]
  -d, --dir string      The target dir
  -h, --help            help for datasource
      --home string     The goctl home path of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
      --idea            For idea plugin [optional]
      --remote string   The remote git repo of the template, --home and --remote cannot be set at the same time, if they are, --remote has higher priority
                            The git repo directory must be consistent with the https://github.com/zeromicro/go-zero-template directory structure
  -s, --schema string   The table schema (default "public")
      --strict          Generate model in strict mode
      --style string    The file naming format, see [https://github.com/zeromicro/go-zero/tree/master/tools/goctl/config/readme.md]
  -t, --table string    The table or table globbing patterns in the database
      --url string      The data source of database,like "postgres://root:password@127.0.0.1:5432/database?sslmode=disable"
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                                                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| branch                                               | string                                              | NO                                             | Empty string                                       | Remote template name is used only if `remote` has value                                                                                                                                                                                                                                                                                                                   |
| cache                                                | boolean                                             | NO                                             | `false`                                            | Whether or not to generate code with cache                                                                                                                                                                                                                                                                                                                                |
| dir                                                  | string                                              | NO                                             | Current working directory                          | Generate Code Output Directory                                                                                                                                                                                                                                                                                                                                            |
| easy                                                 | boolean                                             | NO                                             | `false`                                            | Exposure pool name variable                                                                                                                                                                                                                                                                                                                                               |
| home                                                 | string                                              | NO                                             | `${HOME}/.goctl`                                   | Local Template File Directory                                                                                                                                                                                                                                                                                                                                             |
| idea                                                 | boolean                                             | NO                                             | `false`                                            | Whether to use as idea, please ignore this field                                                                                                                                                                                                                                                                                                                          |
| remote                                               | string                                              | NO                                             | Empty string                                       | Remote template is a git repository address. Priority is higher than `home` field value when this field is passed                                                                                                                                                                                                                                                         |
| strict                                               | boolean                                             | NO                                             | `false`                                            | Whether it is a strict mode and, if it is rigid, the modified field `unsigned` will be converted to the corresponding data type, primarily for numerical types, e.g.：if the name of the database indicates `bigint` type, The result is`unsigned` modifies the corresponding golang data type to `int64`, For `uint64`, if strict is false, no modification to `unsigned` |
| style                                                | string                                              | NO                                             | `gozero`                                           | Named style symbols for output files and directories, see<a href="/docs/tutorials/cli/style" target="_blank"> file style</a>                                                                                                                                                                                                                                                                                        |
| table                                                | []string                                            | YES                                            | `nil`                                              | Table to generate code                                                                                                                                                                                                                                                                                                                                                    |
| url                                                  | string                                              | YES                                            | Empty string                                       | Database connection,format postprogres://{{username}}:{{password}}@{{host_port}}/{{db}}?sslmode=disabled                                                                                                                                                                                                                                                                  |

#### PostgreSQL Type Map Relationships

| <img width={100} /> PostgreSQL Type | <img width={800} /> Golang Type |
| ---------------------------------------------------- | ------------------------------------------------ |
| bool                                                 | bool                                             |
| _bool                                                | pq.BoolArray                                     |
| boolean                                              | bool                                             |
| tinyint                                              | int64                                            |
| smallint                                             | int64                                            |
| mediumint                                            | int64                                            |
| int                                                  | int64                                            |
| int1                                                 | int64                                            |
| int2                                                 | int64                                            |
| _int2                                                | pq.Int64Array                                    |
| int3                                                 | int64                                            |
| int4                                                 | int64                                            |
| _int4                                                | pq.Int64Array                                    |
| int8                                                 | int64                                            |
| _int8                                                | pq.Int64Array                                    |
| integer                                              | int64                                            |
| _integer                                             | pq.Int64Array                                    |
| bigint                                               | int64                                            |
| float                                                | float64                                          |
| float4                                               | float64                                          |
| _float4                                              | pq.Float64Array                                  |
| float8                                               | float64                                          |
| _float8                                              | pq.Float64Array                                  |
| double                                               | float64                                          |
| decimal                                              | float64                                          |
| dec                                                  | float64                                          |
| fixed                                                | float64                                          |
| real                                                 | float64                                          |
| bit                                                  | byte                                             |
| date                                                 | time.Time                                        |
| datetime                                             | time.Time                                        |
| timestamp                                            | time.Time                                        |
| time                                                 | string                                           |
| year                                                 | int64                                            |
| linestring                                           | string                                           |
| multilinestring                                      | string                                           |
| nvarchar                                             | string                                           |
| nchar                                                | string                                           |
| char                                                 | string                                           |
| _char                                                | pq.StringArray                                   |
| character                                            | string                                           |
| varchar                                              | string                                           |
| _varchar                                             | pq.StringArray                                   |
| binary                                               | string                                           |
| bytea                                                | string                                           |
| longvarbinary                                        | string                                           |
| varbinary                                            | string                                           |
| tinytext                                             | string                                           |
| text                                                 | string                                           |
| _text                                                | pq.StringArray                                   |
| mediumtext                                           | string                                           |
| longtext                                             | string                                           |
| enum                                                 | string                                           |
| set                                                  | string                                           |
| json                                                 | string                                           |
| jsonb                                                | string                                           |
| blob                                                 | string                                           |
| longblob                                             | string                                           |
| mediumblob                                           | string                                           |
| tinyblob                                             | string                                           |
| ltree                                                | []byte                                           |
