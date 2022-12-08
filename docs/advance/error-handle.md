# Error Handling

Error handling is an indispensable part of services. Normally, if a http status code is not in the `2xx` series, it can be considered as an http request error.

The error message of a response is returned in plain text. In addition, some other types of errors were defined and retured. Common practice is to pass two fields: `code` and `msg` that are used to describe the business processing results, and the response body can be formatted as json.

## Business error response format

* Normal business processing
    ```json
    {
      "code": 0,
      "msg": "successful",
      "data": {
        ....
      }
    }
    ```

* An error occurred in the business processing 
    ```json
    {
      "code": 10001,
      "msg": "something wrong"
    }
    ```

## Login of the user APIs 
Previously, when we handled the login logic if the username did not exist, an error was directly returned. Let's try the `login` and pass a username that does not exist to see the result.

```shell
curl -X POST \
  http://127.0.0.1:8888/user/login \
  -H 'content-type: application/json' \
  -d '{
	"username":"1",
	"password":"123456"
}'
```
```text
HTTP/1.1 400 Bad Request
Content-Type: text/plain; charset=utf-8
X-Content-Type-Options: nosniff
Date: Tue, 09 Feb 2021 06:38:42 GMT
Content-Length: 19

Username does not exist
```
Next we will return it in json format

## Custom error
* First add a `baseerror.go` file in common and fill in the code
    ```shell
    $ cd common
    $ mkdir errorx&&cd errorx
    $ vim baseerror.go
    ```
    ```goalng
    package errorx
    
    const defaultCode = 1001
    
    type CodeError struct {
        Code int    `json:"code"`
        Msg  string `json:"msg"`
    }
    
    type CodeErrorResponse struct {
        Code int    `json:"code"`
        Msg  string `json:"msg"`
    }
    
    func NewCodeError(code int, msg string) error {
        return &CodeError{Code: code, Msg: msg}
    }
    
    func NewDefaultError(msg string) error {
        return NewCodeError(defaultCode, msg)
    }
    
    func (e *CodeError) Error() string {
        return e.Msg
    }
    
    func (e *CodeError) Data() *CodeErrorResponse {
        return &CodeErrorResponse{
            Code: e.Code,
            Msg:  e.Msg,
        }
    }
    
    ```

* Replace errors in login logic with CodeError custom errors
    ```go
    if len(strings.TrimSpace(req.Username)) == 0 || len(strings.TrimSpace(req.Password)) == 0 {
            return nil, errorx.NewDefaultError("Invalid parameter")
        }
    
        userInfo, err := l.svcCtx.UserModel.FindOneByNumber(req.Username)
        switch err {
        case nil:
        case model.ErrNotFound:
            return nil, errorx.NewDefaultError("Username does not exist")
        default:
            return nil, err
        }
    
        if userInfo.Password != req.Password {
            return nil, errorx.NewDefaultError("User password is incorrect")
        }
    
        now := time.Now().Unix()
        accessExpire := l.svcCtx.Config.Auth.AccessExpire
        jwtToken, err := l.getJwtToken(l.svcCtx.Config.Auth.AccessSecret, now, l.svcCtx.Config.Auth.AccessExpire, userInfo.Id)
        if err != nil {
            return nil, err
        }
    
        return &types.LoginReply{
            Id:           userInfo.Id,
            Name:         userInfo.Name,
            Gender:       userInfo.Gender,
            AccessToken:  jwtToken,
            AccessExpire: now + accessExpire,
            RefreshAfter: now + accessExpire/2,
        }, nil
    ```

* Use custom errors
    ```shell
    $ vim service/user/api/user.go
    ```
    ```go
    func main() {
        flag.Parse()
    
        var c config.Config
        conf.MustLoad(*configFile, &c)
    
        ctx := svc.NewServiceContext(c)
        server := rest.MustNewServer(c.RestConf)
        defer server.Stop()
    
        handler.RegisterHandlers(server, ctx)
    
        // Custom error
        httpx.SetErrorHandler(func(err error) (int, interface{}) {
            switch e := err.(type) {
            case *errorx.CodeError:
                return http.StatusOK, e.Data()
            default:
                return http.StatusInternalServerError, nil
            }
        })
    
        fmt.Printf("Starting server at %s:%d...\n", c.Host, c.Port)
        server.Start()
    }
    ```
* Restart service verification
    ```shell
    $ curl -i -X POST \
      http://127.0.0.1:8888/user/login \
      -H 'content-type: application/json' \
      -d '{
            "username":"1",
            "password":"123456"
    }'
    ```
    ```text
    HTTP/1.1 200 OK
    Content-Type: application/json
    Date: Tue, 09 Feb 2021 06:47:29 GMT
    Content-Length: 40
    
    {"code":1001,"msg":"Username does not exist"}
    ```
