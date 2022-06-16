# Coding APIs

## Create a file

```shell
$vim service/user/api/user.api  
```

- Define a request(LoginReq) and responese(LoginReply) and a user-api service with a ```POST``` method, path ```/user/login``` with the ```LoginReq``` request and ```LoginReply``` response.

```text
type (
    LoginReq {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    LoginReply {
        Id           int64 `json:"id"`
        Name         string `json:"name"`
        Gender       string `json:"gender"`
        AccessToken  string `json:"accessToken"`
        AccessExpire int64 `json:"accessExpire"`
        RefreshAfter int64 `json:"refreshAfter"`
    }
)

service user-api {
    @handler login
    post /user/login (LoginReq) returns (LoginReply)
}
```

## Generate api services

### Use goctl to generate api files with .api definitions

```shell
$cd book/service/user/api
$goctl api go -api user.api -dir . 
```

```text
Done.
```

### Use a Plugin in Intellij

Right-click on the `user.api` file, and then click to enter `New`->`Go Zero`->`Api Code`, enter the target directory selection, that is, the target storage directory of the api source code, the default is the directory where user.api is located, select Click OK after finishing the list.

![ApiGeneration](../resource/goctl-api.png)
![ApiGenerationDirectorySelection](../resource/goctl-api-select.png)

#### By Keymap

Open user.api, enter the editing area, use the shortcut key `Command+N` (for macOS) or `alt+insert` (for windows), select `Api Code`, and also enter the directory selection pop-up window, after selecting the directory Just click OK.
