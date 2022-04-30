# go-zero.dev

[English](README.md) | 中文简体

----

该 [网站](https://doc.go-zero.dev/cn) 是用
[Docusaurus 2](https://v2.docusaurus.io/)构建的. 页面和组件是用 TypeScript 编写的，样式采用的
[CSS Modules](https://github.com/css-modules/css-modules).

## 安装

```shell
$ yarn
```


注意：在 Linux 操作系统上你可能需要安装 `autoconf` 包，在 Ubuntu 可以通过执行命令
`sudo apt-get install autoconf` 来安装。

## 本地环境

```shell
$ yarn start
```

该指令可以启动一个本地服务器，然后自动打开一个网页，在用户代码变更后可以通过热更新来启动，所以无需重启启动。

## 构建生产环境

```shell
$ yarn build
```

该指令可以构建一个静态站点内容，其输出目录默认为 `build`，在构建成功后你可以通过如下指令启动网页来进行测试。
```shell
$ npm run serve
```


# 贡献

本文档支持多语言环境（en | zh-cn），在贡献前请先阅读 [国际化](https://docusaurus.io/zh-CN/docs/i18n/introduction) 支持,
对应 `Page`,`Route`,`Sidebars`,`Markdown` 更新请不要忘记同步变更对应的 i18n 内容。

pr 前请确保本地本地测试已通过，`Page`, `Maekdown` 等内容中的超链接如果不能访问将会阻碍网页应用的启动。

本网页默认为英文，对于中文支持的相关内容在 `i18n/cn` 目录下，更多细节可阅读 [docusaurus](https://docusaurus.io) 了解详情。


