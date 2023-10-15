---
title: doc 贡献指南
slug: /docs/contributing/doc
---

import { Image } from '@arco-design/web-react';

## 概述

<a href="https://github.com/zeromicro/portal" target="_blank">portal</a> 是 go-zero 官方文档网站，大家在使用中发现 bug，有新的特性等，均可以参与到 portal 的贡献中来，我们非常欢迎大家的积极参与，也会最快响应大家提出的各种问题，pr 等。

## 贡献步骤

关于如何 pr 可以参考 <a href="https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests" target="_blank">Github Pull Request</a> 文档。

## 贡献规范

1. **快速开始** 菜单下的文档初衷：点到为止，告诉开发者该怎么用（用法），不告知其为何这么用（背景&场景），需要有所保留，开发者能够根据文档跑出预期结果即可，无需详细介绍。
2. **指南** 菜单下的文档初衷：指南中文档相比【任务】则要更甚之，要告诉开发者该怎么用（用法），更要告知其为何这么用（背景&场景），从用法层面暴露更多开发者挖掘不到的用法。
3. **组件**菜单：从基本用法到深入原理
4. 所有文档标题以 2 级标题（即 "##"）作为起始标题，子标题建议不高于 5 级（包含 5 级，即 "#####"），一级标题归文档大标题保留所有。
5. 文档建议以二级标题【概述】开头，然后正文。
6. 超链接建议用 `<a href="url" target="_blank">content</a>`，防止用户新开页面而关掉当前页面带来不便。
7. 图片组件建议用 Image，支持放大缩放，用法参考 <a href="/docs/example" target="_blank">example</a>
<Image
      src={require('../resource/contributing/example_pic.png').default}
      alt='example_pic'
      title="example_pic"
/>

8. 温馨提示、警告、说明等建议用文档自身携带的组件，用法参考 <a href="/docs/example" target="_blank">example</a>
<Image
      src={require('../resource/contributing/example_tips.png').default}
      alt='example_tips'
      title="example_tips"
/>

9. 文档中如果有外链，建议在文末补充 【参考文献】标题

## 参考文献

- <a href="https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests" target="_blank">《Github • Pull Request》</a>
