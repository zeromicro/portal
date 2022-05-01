"use strict";(self.webpackChunkgo_zero=self.webpackChunkgo_zero||[]).push([[8474],{3905:function(t,e,r){r.d(e,{Zo:function(){return p},kt:function(){return s}});var n=r(7294);function o(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function a(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function i(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?a(Object(r),!0).forEach((function(e){o(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function u(t,e){if(null==t)return{};var r,n,o=function(t,e){if(null==t)return{};var r,n,o={},a=Object.keys(t);for(n=0;n<a.length;n++)r=a[n],e.indexOf(r)>=0||(o[r]=t[r]);return o}(t,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);for(n=0;n<a.length;n++)r=a[n],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(t,r)&&(o[r]=t[r])}return o}var c=n.createContext({}),l=function(t){var e=n.useContext(c),r=e;return t&&(r="function"==typeof t?t(e):i(i({},e),t)),r},p=function(t){var e=l(t.components);return n.createElement(c.Provider,{value:e},t.children)},m={inlineCode:"code",wrapper:function(t){var e=t.children;return n.createElement(n.Fragment,{},e)}},d=n.forwardRef((function(t,e){var r=t.components,o=t.mdxType,a=t.originalType,c=t.parentName,p=u(t,["components","mdxType","originalType","parentName"]),d=l(r),s=o,f=d["".concat(c,".").concat(s)]||d[s]||m[s]||a;return r?n.createElement(f,i(i({ref:e},p),{},{components:r})):n.createElement(f,i({ref:e},p))}));function s(t,e){var r=arguments,o=e&&e.mdxType;if("string"==typeof t||o){var a=r.length,i=new Array(a);i[0]=d;var u={};for(var c in e)hasOwnProperty.call(e,c)&&(u[c]=e[c]);u.originalType=t,u.mdxType="string"==typeof t?t:o,i[1]=u;for(var l=2;l<a;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},5208:function(t,e,r){r.r(e),r.d(e,{default:function(){return m},frontMatter:function(){return u},metadata:function(){return c},toc:function(){return l}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],u={},c={unversionedId:"community/distributed-transaction",id:"community/distributed-transaction",isDocsHomePage:!1,title:"\u5206\u5e03\u5f0f\u4e8b\u52a1\u652f\u6301",description:"\u9700\u6c42\u573a\u666f",source:"@site/i18n/cn/docusaurus-plugin-content-docs/current/community/distributed-transaction.md",sourceDirName:"community",slug:"/community/distributed-transaction",permalink:"/cn/docs/community/distributed-transaction",editUrl:"https://github.com/zeromicro/portal/edit/main/i18n/cn/docusaurus-plugin-content-docs/current/community/distributed-transaction.md",version:"current",lastUpdatedAt:1651391716,formattedLastUpdatedAt:"5/1/2022",frontMatter:{}},l=[{value:"\u9700\u6c42\u573a\u666f",id:"\u9700\u6c42\u573a\u666f",children:[]},{value:"\u89e3\u51b3\u65b9\u6848",id:"\u89e3\u51b3\u65b9\u6848",children:[]},{value:"\u66f4\u591a\u5e94\u7528\u573a\u666f",id:"\u66f4\u591a\u5e94\u7528\u573a\u666f",children:[]}],p={toc:l};function m(t){var e=t.components,r=(0,o.Z)(t,i);return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"\u9700\u6c42\u573a\u666f"},"\u9700\u6c42\u573a\u666f"),(0,a.kt)("p",null,"\u5728\u5fae\u670d\u52a1\u67b6\u6784\u4e2d\uff0c\u5f53\u6211\u4eec\u9700\u8981\u8de8\u670d\u52a1\u4fdd\u8bc1\u6570\u636e\u4e00\u81f4\u6027\u65f6\uff0c\u539f\u5148\u7684\u6570\u636e\u5e93\u4e8b\u52a1\u529b\u4e0d\u4ece\u5fc3\uff0c\u65e0\u6cd5\u5c06\u8de8\u5e93\u3001\u8de8\u670d\u52a1\u7684\u591a\u4e2a\u64cd\u4f5c\u653e\u5728\u4e00\u4e2a\u4e8b\u52a1\u4e2d\u3002\u8fd9\u6837\u7684\u5e94\u7528\u573a\u666f\u975e\u5e38\u591a\uff0c\u6211\u4eec\u53ef\u4ee5\u5217\u4e3e\u51fa\u5f88\u591a\uff1a"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u8ba2\u5355\u7cfb\u7edf\uff1a\u9700\u8981\u4fdd\u8bc1\u521b\u5efa\u8ba2\u5355\u548c\u6263\u51cf\u5e93\u5b58\u8981\u4e48\u540c\u65f6\u6210\u529f\uff0c\u8981\u4e48\u540c\u65f6\u56de\u6eda"),(0,a.kt)("li",{parentName:"ul"},"\u8de8\u884c\u8f6c\u8d26\u573a\u666f\uff1a\u6570\u636e\u4e0d\u5728\u4e00\u4e2a\u6570\u636e\u5e93\uff0c\u4f46\u9700\u8981\u4fdd\u8bc1\u4f59\u989d\u6263\u51cf\u548c\u4f59\u989d\u589e\u52a0\u8981\u4e48\u540c\u65f6\u6210\u529f\uff0c\u8981\u4e48\u540c\u65f6\u5931\u8d25"),(0,a.kt)("li",{parentName:"ul"},"\u79ef\u5206\u5151\u6362\u573a\u666f\uff1a\u9700\u8981\u4fdd\u8bc1\u79ef\u5206\u6263\u51cf\u548c\u6743\u76ca\u589e\u52a0\u540c\u65f6\u6210\u529f\uff0c\u6216\u8005\u540c\u65f6\u5931\u8d25"),(0,a.kt)("li",{parentName:"ul"},"\u51fa\u884c\u8ba2\u7968\u573a\u666f\uff1a\u9700\u8981\u5728\u7b2c\u4e09\u65b9\u7cfb\u7edf\u540c\u65f6\u5b9a\u51e0\u5f20\u7968\uff0c\u8981\u4e48\u540c\u65f6\u6210\u529f\uff0c\u8981\u4e48\u5168\u90e8\u53d6\u6d88")),(0,a.kt)("p",null,"\u9762\u5bf9\u8fd9\u4e9b\u672c\u5730\u4e8b\u52a1\u65e0\u6cd5\u89e3\u51b3\u7684\u573a\u666f\uff0c\u6211\u4eec\u9700\u8981\u5206\u5e03\u5f0f\u4e8b\u52a1\u7684\u89e3\u51b3\u65b9\u6848\uff0c\u4fdd\u8bc1\u8de8\u670d\u52a1\u3001\u8de8\u6570\u636e\u5e93\u66f4\u65b0\u6570\u636e\u7684\u4e00\u81f4\u6027\u3002"),(0,a.kt)("h2",{id:"\u89e3\u51b3\u65b9\u6848"},"\u89e3\u51b3\u65b9\u6848"),(0,a.kt)("p",null,"go-zero\u4e0e",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dtm-labs/dtm"},"dtm"),"\u5f3a\u5f3a\u8054\u5408\uff0c\u63a8\u51fa\u4e86\u5728go-zero\u4e2d\u65e0\u7f1d\u63a5\u5165dtm\u7684\u6781\u7b80\u65b9\u6848\uff0c\u662fgo\u751f\u6001\u4e2d\u9996\u5bb6\u63d0\u4f9b\u5206\u5e03\u5f0f\u4e8b\u52a1\u80fd\u529b\u7684\u5fae\u670d\u52a1\u6846\u67b6\u3002\u8be5\u65b9\u6848\u5177\u5907\u4ee5\u4e0b\u7279\u5f81\uff1a"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"dtm\u670d\u52a1\u53ef\u4ee5\u901a\u8fc7\u914d\u7f6e\uff0c\u76f4\u63a5\u6ce8\u518c\u5230go-zero\u7684\u6ce8\u518c\u4e2d\u5fc3"),(0,a.kt)("li",{parentName:"ul"},"go-zero\u80fd\u591f\u4ee5\u5185\u5efa\u7684target\u683c\u5f0f\u8bbf\u95eedtm\u670d\u52a1\u5668"),(0,a.kt)("li",{parentName:"ul"},"dtm\u80fd\u591f\u8bc6\u522bgo-zero\u7684target\u683c\u5f0f\uff0c\u52a8\u6001\u8bbf\u95eego-zero\u4e2d\u7684\u670d\u52a1")),(0,a.kt)("p",null,"\u8be6\u7ec6\u7684\u63a5\u5165\u65b9\u5f0f\uff0c\u53c2\u89c1dtm\u6587\u6863\uff1a",(0,a.kt)("a",{parentName:"p",href:"https://dtm.pub/ref/gozero.html"},"go-zero\u652f\u6301")),(0,a.kt)("h2",{id:"\u66f4\u591a\u5e94\u7528\u573a\u666f"},"\u66f4\u591a\u5e94\u7528\u573a\u666f"),(0,a.kt)("p",null,"dtm\u4e0d\u4ec5\u53ef\u4ee5\u89e3\u51b3\u4e0a\u8ff0\u7684\u5206\u5e03\u5f0f\u4e8b\u52a1\u573a\u666f\uff0c\u8fd8\u53ef\u4ee5\u89e3\u51b3\u66f4\u591a\u7684\u4e0e\u6570\u636e\u4e00\u81f4\u6027\u76f8\u5173\u7684\u573a\u666f\uff0c\u5305\u62ec\uff1a"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u6570\u636e\u5e93\u4e0e\u7f13\u5b58\u4e00\u81f4\u6027\uff1a dtm \u7684\u4e8c\u9636\u6bb5\u6d88\u606f\uff0c\u80fd\u591f\u4fdd\u8bc1\u6570\u636e\u5e93\u66f4\u65b0\u64cd\u4f5c\uff0c\u548c\u7f13\u5b58\u66f4\u65b0/\u5220\u9664\u64cd\u4f5c\u7684\u539f\u5b50\u6027"),(0,a.kt)("li",{parentName:"ul"},"\u79d2\u6740\u7cfb\u7edf\uff1a dtm \u80fd\u591f\u4fdd\u8bc1\u79d2\u6740\u573a\u666f\u4e0b\uff0c\u521b\u5efa\u7684\u8ba2\u5355\u91cf\u4e0e\u5e93\u5b58\u6263\u51cf\u6570\u91cf\u5b8c\u5168\u4e00\u6837\uff0c\u65e0\u9700\u540e\u7eed\u7684\u4eba\u5de5\u6821\u51c6"),(0,a.kt)("li",{parentName:"ul"},"\u591a\u79cd\u5b58\u50a8\u7ec4\u5408\uff1a dtm \u5df2\u652f\u6301\u6570\u636e\u5e93\u3001Redis\u3001Mongo\u7b49\u591a\u79cd\u5b58\u50a8\uff0c\u53ef\u4ee5\u5c06\u5b83\u4eec\u7ec4\u5408\u4e3a\u4e00\u4e2a\u5168\u5c40\u4e8b\u52a1\uff0c\u4fdd\u8bc1\u6570\u636e\u7684\u4e00\u81f4\u6027")),(0,a.kt)("p",null,"\u66f4\u591a dtm \u7684\u80fd\u529b\u548c\u4ecb\u7ecd\uff0c\u53c2\u89c1",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dtm-labs/dtm"},"dtm")))}m.isMDXComponent=!0}}]);