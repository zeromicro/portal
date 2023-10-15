---
title: goctl bug
slug: /docs/tutorials/cli/bug
---

import { Image } from '@arco-design/web-react';

## Overview

goctl bug is a tool used to submit goctl bugs that automatically collects goctl, operating system information, goctl configuration information, and then quickly create an issue template on GitHub to facilitate quick submission of bugs.

## Usage

Developers only need to enter the following command in the terminal to quickly open the browser and create an issue template：

```bash
$ goctl bug
```

Github issue template is as follows：

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

<Image src={require('../../resource/tutorials/cli/github-issue.png').default} alt='github issue template' />

----

::note
in template `goctl version`,`OS`,`ARCH`,`GOCTL_VERSION`,`GO_VERN` Information will automatically fill the current developer system, Sender is not required to fill in manually.
:::
