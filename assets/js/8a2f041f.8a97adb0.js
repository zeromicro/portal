"use strict";(self.webpackChunkgo_zero=self.webpackChunkgo_zero||[]).push([[9556],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=r.createContext({}),l=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=l(e.components);return r.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=l(t),m=i,g=u["".concat(c,".").concat(m)]||u[m]||d[m]||a;return t?r.createElement(g,o(o({ref:n},p),{},{components:t})):r.createElement(g,o({ref:n},p))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,o=new Array(a);o[0]=u;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var l=2;l<a;l++)o[l]=t[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},5043:function(e,n,t){t.r(n),t.d(n,{default:function(){return d},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return l}});var r=t(7462),i=t(3366),a=(t(7294),t(3905)),o=["components"],s={},c={unversionedId:"advance/business-coding",id:"advance/business-coding",isDocsHomePage:!1,title:"Business Coding",description:"In the previous section, we have written user.api based on the preliminary requirements to describe which services the user service provides to the outside world. In this section, we will continue with the previous steps.",source:"@site/docs/advance/business-coding.md",sourceDirName:"advance",slug:"/advance/business-coding",permalink:"/docs/advance/business-coding",editUrl:"https://github.com/zeromicro/portal/edit/main/docs/advance/business-coding.md",version:"current",lastUpdatedAt:1651391716,formattedLastUpdatedAt:"5/1/2022",frontMatter:{},sidebar:"docs",previous:{title:"API Coding",permalink:"/docs/advance/api-coding"},next:{title:"JWT",permalink:"/docs/advance/jwt"}},l=[{value:"Add Mysql configuration",id:"add-mysql-configuration",children:[]},{value:"Improve yaml configuration",id:"improve-yaml-configuration",children:[]},{value:"Improve service dependence",id:"improve-service-dependence",children:[]},{value:"Fill in the login logic",id:"fill-in-the-login-logic",children:[]}],p={toc:l};function d(e){var n=e.components,t=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"In the previous section, we have written user.api based on the preliminary requirements to describe which services the user service provides to the outside world. In this section, we will continue with the previous steps.\nUse business coding to tell how go-zero is used in actual business."),(0,a.kt)("h2",{id:"add-mysql-configuration"},"Add Mysql configuration"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"$ vim service/user/api/internal/config/config.go\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},'package config\n\nimport "github.com/zeromicro/go-zero/rest"\n\ntype Config struct {\n    rest.RestConf\n    Mysql struct{\n        DataSource string\n    }\n    \n    CacheRedis cache.CacheConf\n}\n')),(0,a.kt)("h2",{id:"improve-yaml-configuration"},"Improve yaml configuration"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"$ vim service/user/api/etc/user-api.yaml\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"Name: user-api\nHost: 0.0.0.0\nPort: 8888\nMysql:\n  DataSource: $user:$password@tcp($url)/$db?charset=utf8mb4&parseTime=true&loc=Asia%2FShanghai\nCacheRedis:\n  - Host: $host\n    Pass: $pass\n    Type: node\n")),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"$user: mysql database user"),(0,a.kt)("p",{parentName:"div"},"$password: mysql database password"),(0,a.kt)("p",{parentName:"div"},"$url: mysql database connection address"),(0,a.kt)("p",{parentName:"div"},"$db: mysql database db name, that is, the database where the user table is located"),(0,a.kt)("p",{parentName:"div"},"$host: Redis connection address Format: ip:port, such as: 127.0.0.1:6379"),(0,a.kt)("p",{parentName:"div"},"$pass: redis password"),(0,a.kt)("p",{parentName:"div"},"For more configuration information, please refer to ",(0,a.kt)("a",{parentName:"p",href:"../configuration/api"},"api configuration introduction")))),(0,a.kt)("h2",{id:"improve-service-dependence"},"Improve service dependence"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"$ vim service/user/api/internal/svc/servicecontext.go\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},"type ServiceContext struct {\n    Config    config.Config\n    UserModel model.UserModel\n}\n\nfunc NewServiceContext(c config.Config) *ServiceContext {\n    conn:=sqlx.NewMysql(c.Mysql.DataSource)\n    return &ServiceContext{\n        Config: c,\n        UserModel: model.NewUserModel(conn,c.CacheRedis),\n    }\n}\n")),(0,a.kt)("h2",{id:"fill-in-the-login-logic"},"Fill in the login logic"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"$ vim service/user/api/internal/logic/loginlogic.go\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-go"},'func (l *LoginLogic) Login(req types.LoginReq) (*types.LoginReply, error) {\n    if len(strings.TrimSpace(req.Username)) == 0 || len(strings.TrimSpace(req.Password)) == 0 {\n        return nil, errors.New("Invalid parameter")\n    }\n    \n    userInfo, err := l.svcCtx.UserModel.FindOneByNumber(req.Username)\n    switch err {\n    case nil:\n    case model.ErrNotFound:\n        return nil, errors.New("Username does not exist")\n    default:\n        return nil, err\n    }\n    \n    if userInfo.Password != req.Password {\n        return nil, errors.New("User password is incorrect")\n    }\n    \n    // ---start---\n    now := time.Now().Unix()\n    accessExpire := l.svcCtx.Config.Auth.AccessExpire\n    jwtToken, err := l.getJwtToken(l.svcCtx.Config.Auth.AccessSecret, now, l.svcCtx.Config.Auth.AccessExpire, userInfo.Id)\n    if err != nil {\n        return nil, err\n    }\n    // ---end---\n    \n    return &types.LoginReply{\n        Id:           userInfo.Id,\n        Name:         userInfo.Name,\n        Gender:       userInfo.Gender,\n        AccessToken:  jwtToken,\n        AccessExpire: now + accessExpire,\n        RefreshAfter: now + accessExpire/2,\n    }, nil\n}  \n')),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"For the code implementation of ","[start]","-","[end]"," in the above code, please refer to the ",(0,a.kt)("a",{parentName:"p",href:"jwt"},"Jwt Authentication")," chapter"))))}d.isMDXComponent=!0}}]);