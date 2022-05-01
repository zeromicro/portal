"use strict";(self.webpackChunkgo_zero=self.webpackChunkgo_zero||[]).push([[9650],{3905:function(e,t,n){n.d(t,{Zo:function(){return d},kt:function(){return m}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),h=l(n),m=a,p=h["".concat(c,".").concat(m)]||h[m]||u[m]||o;return n?r.createElement(p,i(i({ref:t},d),{},{components:n})):r.createElement(p,i({ref:t},d))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=h;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"},3049:function(e,t,n){n.r(t),n.d(t,{default:function(){return u},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return l}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],s={title:"go-zero cache design for business-level caching",authors:"anqiansong"},c={unversionedId:"blog/cache/business-cache",id:"blog/cache/business-cache",isDocsHomePage:!1,title:"go-zero cache design for business-level caching",description:"In the previous article go-zero cache design of persistence layer cache introduced the db layer cache, in retrospect, the main design of the db layer cache can be summarized as follows",source:"@site/docs/blog/cache/business-cache.md",sourceDirName:"blog/cache",slug:"/blog/cache/business-cache",permalink:"/docs/blog/cache/business-cache",editUrl:"https://github.com/zeromicro/portal/edit/main/docs/blog/cache/business-cache.md",version:"current",lastUpdatedAt:1651391716,formattedLastUpdatedAt:"5/1/2022",frontMatter:{title:"go-zero cache design for business-level caching",authors:"anqiansong"},sidebar:"blog",previous:{title:"go-zero cache design for persistence layer cache",permalink:"/docs/blog/cache/redis-cache"},next:{title:"Caching via collection",permalink:"/docs/blog/cache/collection"}},l=[{value:"Preface",id:"preface",children:[]},{value:"Examples of applicable scenarios",id:"examples-of-applicable-scenarios",children:[]}],d={toc:l};function u(e){var t=e.components,s=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,s,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"In the previous article ",(0,o.kt)("a",{parentName:"p",href:"redis-cache"},"go-zero cache design of persistence layer cache")," introduced the db layer cache, in retrospect, the main design of the db layer cache can be summarized as follows"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"The cache is only deleted and not updated"),(0,o.kt)("li",{parentName:"ul"},"Only one row record is always stored, i.e. the primary key corresponds to the row record"),(0,o.kt)("li",{parentName:"ul"},"Unique indexes only cache primary key values, not directly cache row records (refer to mysql indexing ideas)"),(0,o.kt)("li",{parentName:"ul"},"Anti-cache-pass-through design, default one minute"),(0,o.kt)("li",{parentName:"ul"},"No caching of multiple row records")),(0,o.kt)("h2",{id:"preface"},"Preface"),(0,o.kt)("p",null,"In large business systems, by adding cache to the persistence layer, it is believed that the cache can help relieve a lot of access pressure on the persistence layer for most single-row queries, but in actual business, data reading is not just for single-row records.\nIn addition, for high concurrency scenarios such as spike systems and class selection systems, it is not practical to rely solely on caching in the persistence layer."),(0,o.kt)("h2",{id:"examples-of-applicable-scenarios"},"Examples of applicable scenarios"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Course selection system"),(0,o.kt)("li",{parentName:"ul"},"Content social system"),(0,o.kt)("li",{parentName:"ul"},"Spike ...")),(0,o.kt)("p",null,"In these systems, we can add another layer of cache in the business layer to store key information in the system, such as student selection information and remaining places in the course in the course selection system, and content information between a certain period of time in the content social system."),(0,o.kt)("p",null,"Next, let's take a content social system as an example."),(0,o.kt)("p",null,"In the content social system, we usually query a list of content first, and then click on a piece of content to view the details."),(0,o.kt)("p",null,"Before adding biz cache, the query flow chart of content information should be as follows"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"redis-cache-05",src:n(1019).Z})),(0,o.kt)("p",null,"As we know from the diagram and the previous article ",(0,o.kt)("a",{parentName:"p",href:"redis-cache"},"go-zero cache design of persistence layer cache"),", there is no way to rely on the cache for accessing the content list.\nIf we add a layer of cache at the business layer to store key information (or even complete information) in the list, then access to multiple rows of records is not a problem, and that's what biz redis is going to do. Next, let's look at the design solution, assuming that a single row of records in the content system contains the following fields"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:null},"Field"),(0,o.kt)("th",{parentName:"tr",align:null},"Type"),(0,o.kt)("th",{parentName:"tr",align:null},"Desc"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"id"),(0,o.kt)("td",{parentName:"tr",align:null},"string"),(0,o.kt)("td",{parentName:"tr",align:null},"id")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"title"),(0,o.kt)("td",{parentName:"tr",align:null},"string"),(0,o.kt)("td",{parentName:"tr",align:null},"title")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"content"),(0,o.kt)("td",{parentName:"tr",align:null},"string"),(0,o.kt)("td",{parentName:"tr",align:null},"content")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:null},"createTime"),(0,o.kt)("td",{parentName:"tr",align:null},"time.Time"),(0,o.kt)("td",{parentName:"tr",align:null},"create time")))),(0,o.kt)("p",null,"Our goal is to get a list of content, and try to avoid the content list to go db cause access pressure, first we use redis sort set data structure to store, the amount of information in the fields need to be stored, there are two redis storage options."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"cache local information")),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"biz-redis-02",src:n(4286).Z}),"\nfor its key segment information (such as: id, etc.) in accordance with certain rules of compression, and storage, score we use ",(0,o.kt)("inlineCode",{parentName:"p"},"createTime")," millisecond value (time value equal here is not discussed), the benefits of this storage scheme is to save redis storage space.\nThat on the other hand, the disadvantage is the need for a list of detailed content of the second check (but this check is to use the persistence layer of the line record cache)"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Cache full information")),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"biz-redis-01",src:n(4030).Z}),"\nAll the content published in accordance with certain rules of compression are stored, the same score we still use ",(0,o.kt)("inlineCode",{parentName:"p"},"createTime")," millisecond value, the benefits of this storage scheme is the business of adding, deleting, checking, changing all go redis, and db layer at this time\nOn the other hand, the disadvantage is also obvious, the need for storage space, configuration requirements are higher, the cost will also increase."),(0,o.kt)("p",null,"Example\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-golang"},'type Content struct {\n    Id         string    `json:"id"`\n    Title      string    `json:"title"`\n    Content    string    `json:"content"`\n    CreateTime time.Time `json:"create_time"`\n}\n\nconst bizContentCacheKey = `biz#content#cache`\n\nfunc AddContent(r redis.Redis, c *Content) error {\n    v := compress(c)\n    _, err := r.Zadd(bizContentCacheKey, c.CreateTime.UnixNano()/1e6, v)\n    return err\n}\n\nfunc DelContent(r redis.Redis, c *Content) error {\n    v := compress(c)\n    _, err := r.Zrem(bizContentCacheKey, v)\n\n    return err\n}\n\nfunc compress(c *Content) string {\n    // todo: do it yourself\n    var ret string\n    return ret\n}\n\nfunc unCompress(v string) *Content {\n    // todo: do it yourself\n    var ret Content\n    return &ret\n}\n\nfunc ListByRangeTime(r redis.Redis, start, end time.Time) ([]*Content, error) {\n    kvs, err := r.ZrangebyscoreWithScores(bizContentCacheKey, start.UnixNano()/1e6, end.UnixNano()/1e6)\n    if err != nil {\n        return nil, err\n    }\n\n    var list []*Content\n    for _, kv := range kvs {\n        data:=unCompress(kv.Key)\n        list = append(list, data)\n    }\n\n    return list, nil\n}\n\n')),(0,o.kt)("p",null,"In the above example, redis is not set to expire, we will add, delete, change and check operations are synchronized to redis, we think the content social system list access request is relatively high case to do such a scheme design.\nIn addition, there are some data access, not want to content design system so frequently access, may be a certain period of time to access the sudden increase, after which may be a long time to visit again, so that the interval\nOr will not visit again, face this scenario, if I and how to consider the design of the cache? In go-zero content practice, there are two options to solve this problem."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Adding memory cache: The memory cache is used to store the data that may be accessed unexpectedly at present.\nAnother option is to use the ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go"},"Cache")," in the go-zero library, which is specifically\nfor memory management."),(0,o.kt)("li",{parentName:"ul"},"The other solution is to use in the go-zero library, which is dedicated to memory management.")),(0,o.kt)("h1",{id:"summary"},"Summary"),(0,o.kt)("p",null,"The above two scenarios can include most of the multi-line record cache, for multi-line record query volume is not large scenario, for the time being, there is no need to directly put biz redis in, you can first try to let db to take on, developers can be based on persistence layer monitoring and service\nThe developer can measure the need to introduce biz based on persistence layer monitoring and service monitoring."))}u.isMDXComponent=!0},4030:function(e,t,n){t.Z=n.p+"assets/images/biz-redis-01-0127f70ec68f0f517000377799a7694f.svg"},4286:function(e,t,n){t.Z=n.p+"assets/images/biz-redis-02-c74e333a1fd8a3af9c5f12314a9fb1cd.svg"}}]);