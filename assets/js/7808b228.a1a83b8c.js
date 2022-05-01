"use strict";(self.webpackChunkgo_zero=self.webpackChunkgo_zero||[]).push([[4733],{3905:function(e,t,r){r.d(t,{Zo:function(){return d},kt:function(){return m}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=c(r),m=o,h=p["".concat(l,".").concat(m)]||p[m]||u[m]||a;return r?n.createElement(h,i(i({ref:t},d),{},{components:r})):n.createElement(h,i({ref:t},d))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},9326:function(e,t,r){r.r(t),r.d(t,{default:function(){return u},frontMatter:function(){return s},metadata:function(){return l},toc:function(){return c}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],s={},l={unversionedId:"deployment/service-monitor",id:"deployment/service-monitor",isDocsHomePage:!1,title:"Monitor",description:"In microservice governance, service monitoring is also a very important link. Monitoring whether a service is working normally needs to be carried out from multiple dimensions, such as:* mysql indicators",source:"@site/docs/deployment/service-monitor.md",sourceDirName:"deployment",slug:"/deployment/service-monitor",permalink:"/docs/deployment/service-monitor",editUrl:"https://github.com/zeromicro/portal/edit/main/docs/deployment/service-monitor.md",version:"current",lastUpdatedAt:1651391716,formattedLastUpdatedAt:"5/1/2022",frontMatter:{},sidebar:"docs",previous:{title:"Service Deployment",permalink:"/docs/deployment/service-deployment"},next:{title:"Trace",permalink:"/docs/deployment/trace"}},c=[{value:"Microservice indicator monitoring based on prometheus",id:"microservice-indicator-monitoring-based-on-prometheus",children:[]},{value:"Prometheus architecture",id:"prometheus-architecture",children:[]},{value:"go-zero service indicator monitoring based on prometheus",id:"go-zero-service-indicator-monitoring-based-on-prometheus",children:[]},{value:"Types of indicators monitored by go-zero",id:"types-of-indicators-monitored-by-go-zero",children:[]},{value:"grafana dashboard",id:"grafana-dashboard",children:[]}],d={toc:c};function u(e){var t=e.components,s=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},d,s,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"In microservice governance, service monitoring is also a very important link. Monitoring whether a service is working normally needs to be carried out from multiple dimensions, such as:* mysql indicators"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"mongo indicators"),(0,a.kt)("li",{parentName:"ul"},"redis indicator"),(0,a.kt)("li",{parentName:"ul"},"Request log"),(0,a.kt)("li",{parentName:"ul"},"Service index statistics"),(0,a.kt)("li",{parentName:"ul"},"Service health check\n...")),(0,a.kt)("p",null,"The monitoring work is very large, and this section only uses the ",(0,a.kt)("inlineCode",{parentName:"p"},"service indicator monitoring")," as an example for illustration."),(0,a.kt)("h2",{id:"microservice-indicator-monitoring-based-on-prometheus"},"Microservice indicator monitoring based on prometheus"),(0,a.kt)("p",null,"After the service is online, we often need to monitor the service so that we can find the problem early and make targeted optimization. The monitoring can be divided into various forms, such as log monitoring, call chain monitoring, indicator monitoring, and so on. Through indicator monitoring, the changing trend of service indicators can be clearly observed, and the operating status of the service can be understood, which plays a very important role in ensuring the stability of the service."),(0,a.kt)("p",null,"Prometheus is an open source system monitoring and warning tool that supports a powerful query language, PromQL, allowing users to select and aggregate time series data in real time. Time series data is actively pulled by the server through the HTTP protocol, or it can be pushed through an intermediate gateway. Data, you can obtain monitoring targets through static configuration files or service discovery"),(0,a.kt)("h2",{id:"prometheus-architecture"},"Prometheus architecture"),(0,a.kt)("p",null,"The overall architecture and ecosystem components of Prometheus are shown in the following figure:\n",(0,a.kt)("img",{alt:"prometheus-flow",src:r(9938).Z})),(0,a.kt)("p",null,"Prometheus Server pulls monitoring indicators directly from the monitoring target or indirectly through the push gateway. It stores all captured sample data locally and executes a series of rules on this data to summarize and record new time series or existing data. Generate an alert. The monitoring data can be visualized through Grafana or other tools"),(0,a.kt)("h2",{id:"go-zero-service-indicator-monitoring-based-on-prometheus"},"go-zero service indicator monitoring based on prometheus"),(0,a.kt)("p",null,"The go-zero framework integrates prometheus-based service indicator monitoring. Below we use go-zero\u2019s official example short url to demonstrate how to collect and monitor service indicators:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"The first step is to install Prometheus first, please refer to the official documentation for the installation steps")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"go-zero does not enable prometheus monitoring by default. The opening method is very simple. You only need to add the following configuration to the shorturl-api.yaml file, where Host is the Prometheus Server address, which is a required configuration, the Port port is not filled in and the default is 9091, and the Path is used The path to pull metrics is /metrics by default"),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"Prometheus:\n  Host: 127.0.0.1\n  Port: 9091\n  Path: /metrics\n"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Edit the prometheus configuration file prometheus.yml, add the following configuration, and create targets.json"),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},"- job_name: 'file_ds'\n  file_sd_configs:\n  - files:\n    - targets.json\n"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Edit the targets.json file, where targets is the target address configured by shorturl, and add several default tags"),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-yaml"},'[\n    {\n        "targets": ["127.0.0.1:9091"],\n        "labels": {\n            "job": "shorturl-api",\n            "app": "shorturl-api",\n            "env": "test",\n            "instance": "127.0.0.1:8888"\n        }\n    }\n]\n'))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Start the prometheus service, listening on port 9090 by default"),(0,a.kt)("pre",{parentName:"li"},(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"$ prometheus --config.file=prometheus.yml\n"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("p",{parentName:"li"},"Enter ",(0,a.kt)("inlineCode",{parentName:"p"},"http://127.0.0.1:9090/")," in the browser, and then click ",(0,a.kt)("inlineCode",{parentName:"p"},"Status")," -> ",(0,a.kt)("inlineCode",{parentName:"p"},"Targets")," to see the job whose status is Up, and the default label we configured can be seen in the Labels column\n",(0,a.kt)("img",{alt:"prometheus-start",src:r(5033).Z}),"\nThrough the above steps, we have completed the configuration work of Prometheus for the indicator monitoring collection of the shorturl service. For the sake of simplicity, we have performed manual configuration. In the actual production environment, we generally use the method of regularly updating configuration files or service discovery to configure monitoring. Goals, space is limited, not explained here, interested students please check the relevant documents on their own"))),(0,a.kt)("h2",{id:"types-of-indicators-monitored-by-go-zero"},"Types of indicators monitored by go-zero"),(0,a.kt)("p",null,"go-zero currently adds monitoring of request metrics to the http middleware and rpc interceptor."),(0,a.kt)("p",null,"Mainly from the two dimensions of request time and request error. The request time uses the Histogram metric type to define multiple Buckets to facilitate quantile statistics. The request error uses the Counter type, and the path tag rpc metric is added to the http metric. Added the method tag for detailed monitoring.\nNext, demonstrate how to view monitoring indicators:"),(0,a.kt)("p",null,"First execute the following command multiple times on the command line"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},'$ curl -i "http://localhost:8888/shorten?url=http://www.xiaoheiban.cn"\n')),(0,a.kt)("p",null,'Open Prometheus and switch to the Graph interface, and enter the {path="/shorten"} command in the input box to view the monitoring indicators, as shown below:\n',(0,a.kt)("img",{alt:"prometheus-graph",src:r(8327).Z})),(0,a.kt)("p",null,"We use PromQL grammar query to filter the indicators whose path is /shorten, and the results show the indicator name and indicator value. The code value in the http_server_requests_code_total indicator is the status code of http, 200 indicates that the request is successful, and http_server_requests_duration_ms_bucket separately counts the results of different buckets. , You can also see that all the indicators have added the default indicators we configured\nThe Console interface mainly displays the index results of the query. The Graph interface provides us with a simple graphical display interface. In the actual production environment, we generally use Grafana for graphical display."),(0,a.kt)("h2",{id:"grafana-dashboard"},"grafana dashboard"),(0,a.kt)("p",null,"Grafana is a visualization tool with powerful functions and supports multiple data sources such as Prometheus, Elasticsearch, Graphite, etc. For simple installation, please refer to the official documentation. The default port of grafana is 3000. After installation, enter http://localhost:3000/ in the browser. , The default account and password are both admin."),(0,a.kt)("p",null,"The following demonstrates how to draw the visual interface based on the above indicators:\nClick on the left sidebar ",(0,a.kt)("inlineCode",{parentName:"p"},"Configuration"),"->",(0,a.kt)("inlineCode",{parentName:"p"},"Data Source"),"->",(0,a.kt)("inlineCode",{parentName:"p"},"Add data source")," to add a data source, where the HTTP URL is the address of the data source\n",(0,a.kt)("img",{alt:"grafana",src:r(8997).Z})),(0,a.kt)("p",null,"Click on the left sidebar to add dashboard, and then add Variables to facilitate filtering for different tags, such as adding app variables to filter different services\n",(0,a.kt)("img",{alt:"grafana-app",src:r(5725).Z})),(0,a.kt)("p",null,"Enter the dashboard and click Add panel in the upper right corner to add a panel to count the qps of the interface in the path dimension\n",(0,a.kt)("img",{alt:"grafana-app",src:r(1090).Z})),(0,a.kt)("p",null,"The final effect is shown below. Different services can be filtered by service name. The panel shows the trend of qps with path /shorten.\n",(0,a.kt)("img",{alt:"grafana-app",src:r(3119).Z})),(0,a.kt)("h1",{id:"summary"},"Summary"),(0,a.kt)("p",null,"The above demonstrates the simple process of go-zero based on prometheus+grafana service indicator monitoring. In the production environment, different dimensions of monitoring and analysis can be done according to the actual scenario. Now go-zero's monitoring indicators are mainly for http and rpc, which is obviously insufficient for the overall monitoring of the service, such as the monitoring of container resources, the monitoring of dependent mysql, redis and other resources, and the monitoring of custom indicators, etc. Go-zero will continue to optimize in this regard. Hope this article can help you"))}u.isMDXComponent=!0},5725:function(e,t,r){t.Z=r.p+"assets/images/grafana-app-6ae23aaa9ab3d5d0868c21b1dbc90cd8.png"},3119:function(e,t,r){t.Z=r.p+"assets/images/grafana-panel-4971b25b21da517224632d1f93884dd0.png"},1090:function(e,t,r){t.Z=r.p+"assets/images/grafana-qps-025c82913aa773c323d4b5ccbdb500d4.png"},8997:function(e,t,r){t.Z=r.p+"assets/images/grafana-556280f94240eee2bfa8eed716dd8e6a.png"},9938:function(e,t,r){t.Z=r.p+"assets/images/prometheus-flow-eb3f52cdf8f6936642d678b7998c87e6.png"},8327:function(e,t,r){t.Z=r.p+"assets/images/prometheus-graph-5b8778ca7105fa26889dd96551ffd83a.webp"},5033:function(e,t,r){t.Z=r.p+"assets/images/prometheus-start-aef99727e28503450d25f56d4969be48.png"}}]);