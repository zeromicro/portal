---
title: goctl bug
slug: /docs/tutorials/cli/bug
---

import { Image } from '@arco-design/web-react';

## 概述

goctl bug 是一个用于提交 goctl bug 的工具，它会自动收集 goctl 的版本信息、操作系统信息、goctl 的配置信息，然后快速在 GitHub 上创建一个 issue 模板，方便开发者快速提交 bug。

## 使用

开发者只需要在终端输入如下指令，即可快速打开浏览器，创建一个 issue 模板：

```bash
$ goctl bug
```

Github issue 模板如下：

```markdown
<!-- Please answer these questions before submitting your issue. Thanks! -->

### What category of issue (<code>goctl</code> or <code>sdk</code>)?

### What type of issue (<code>feature</code>|<code>bug</code>|<code>suggestion</code>)?

### What version of Goctl are you using (<code>goctl --version</code>)?

<pre>
$ goctl --version
1.4.3
</pre>

### Does this issue reproduce with the latest release?


### What operating system and processor architecture are you using ?
<pre>
OS = "darwin"
ARCH = "arm64"
GOCTL_VERSION = "1.4.3"
GO_VERSION = "go1.18.3"
</pre>

### What did you do?

<!--
If possible, provide a recipe for reproducing the error.
A complete runnable program is good.
A link on play.golang.org is best.
-->



### What did you expect to see?



### What did you see instead?


```

<Image
      src={require('../../resource/tutorials/cli/github-issue.png').default}
      alt='github issue template'
/>

----

:::note 说明
模板中 `goctl version`、`OS`、`ARCH`、`GOCTL_VERSION`、`GO_VERSION` 信息会自动填充当前开发者系统上的信息，开发者无需手动填写。
:::