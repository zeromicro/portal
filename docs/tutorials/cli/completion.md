---
title: goctl completion
slug: /docs/tutorials/cli/completion
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述

goctl 采用了 <a href="https://github.com/spf13/cobra" target="_blank"> Cobra </a> 框架开发，因此其继承了 Cobra 的自动补全功能，在 goctl 中，我们提供了 `bash`、`fish`、`zsh`、`powershell` 的自动补全功能。

## goctl completion 指令

```bash
$ goctl completion --help
Generate the autocompletion script for goctl for the specified shell.
See each sub-command's help for details on how to use the generated script.

Usage:
  goctl completion [command]

Available Commands:
  bash        Generate the autocompletion script for bash
  fish        Generate the autocompletion script for fish
  powershell  Generate the autocompletion script for powershell
  zsh         Generate the autocompletion script for zsh

Flags:
  -h, --help   help for completion


Use "goctl completion [command] --help" for more information about a command.
```

目前 goctl 支持 `bash`、`fish`、`zsh`、`powershell` 的自动补全功能，如果你是 Windows 操作系统且使用的是 powershell，你可以选择 `goctl completion powershell` 来生成脚本，如果你是 Linux 或者 Mac 操作系统，你可以选择除 `goctl completion powershell` 外的另外 3个来生成脚本，但要根据你当前的 shell 来选择。

:::note 查看当前 shell
在 Linux 或者 Mac 操作系统中，可以通过 `echo $SHELL` 来查看当前 shell，如果是 `zsh`，则选择 `goctl completion zsh` 来生成脚本，如果是 `bash`，则选择 `goctl completion bash` 来生成脚本，如果是 `fish`，则选择 `goctl completion fish` 来生成脚本。
:::


### goctl completion bash 指令

```bash
$ goctl completion bash --help
Generate the autocompletion script for the bash shell.

This script depends on the 'bash-completion' package.
If it is not installed already, you can install it via your OS's package manager.

To load completions in your current shell session:

	source <(goctl completion bash)

To load completions for every new session, execute once:

#### Linux:

	goctl completion bash > /etc/bash_completion.d/goctl

#### macOS:

	goctl completion bash > $(brew --prefix)/etc/bash_completion.d/goctl

You will need to start a new shell for this setup to take effect.

Usage:
  goctl completion bash

Flags:
  -h, --help              help for bash
      --no-descriptions   disable completion descriptions
```

在 Linux 或者 Mac 操作系统中，如果你使用的是 `bash`，你可以通过 `goctl completion bash` 来生成脚本，需要注意的是，`goctl completion bash` 依赖 `bash-completion` 包的支持，如果你的操作系统没有安装此包的话，建议自行安装一下。

1. 临时生效

临时生效仅对当前终端 session 有用，是一次性的。

```bash
$ source <(goctl completion bash)
```

2. 永久生效

永久生效设置按照操作系统的不同，其设置方法也不同，设置后需要重新启动终端才生效，目前针对 Linux 和 MacOS 的设置方法如下：


<Tabs>

<TabItem value="Linux" label="Linux" default>

```bash
$ goctl completion bash > /etc/bash_completion.d/goctl
```

</TabItem>

<TabItem value="MacOS" label="MacOS" default>

```bash
$ goctl completion bash > $(brew --prefix)/etc/bash_completion.d/goctl
```

</TabItem>

</Tabs>


### goctl completion fish 指令

```bash
$ goctl completion fish --help
Generate the autocompletion script for the fish shell.

To load completions in your current shell session:

	goctl completion fish | source

To load completions for every new session, execute once:

	goctl completion fish > ~/.config/fish/completions/goctl.fish

You will need to start a new shell for this setup to take effect.

Usage:
  goctl completion fish [flags]

Flags:
  -h, --help              help for fish
      --no-descriptions   disable completion descriptions
```

1. 临时生效

临时生效仅对当前终端 session 有用，是一次性的。

```bash
$ goctl completion fish | source
```

2. 永久生效

```bash
$ goctl completion fish > ~/.config/fish/completions/goctl.fish
```

### goctl completion powershell 指令

```bash
$ goctl completion powershell --help
Generate the autocompletion script for powershell.

To load completions in your current shell session:

	goctl completion powershell | Out-String | Invoke-Expression

To load completions for every new session, add the output of the above command
to your powershell profile.

Usage:
  goctl completion powershell [flags]

Flags:
  -h, --help              help for powershell
      --no-descriptions   disable completion descriptions
```

1. 临时生效

临时生效仅对当前终端 session 有用，是一次性的。

```bash
$ goctl completion powershell | Out-String | Invoke-Expression
```

2. 永久生效

需要将如下输出添加到 powershell 的配置文件中。

```bash
$ goctl completion powershell | Out-String | Invoke-Expression
```


### goctl completion zsh 指令

```bash
$ goctl completion zsh --help
Generate the autocompletion script for the zsh shell.

If shell completion is not already enabled in your environment you will need
to enable it.  You can execute the following once:

	echo "autoload -U compinit; compinit" >> ~/.zshrc

To load completions in your current shell session:

	source <(goctl completion zsh); compdef _goctl goctl

To load completions for every new session, execute once:

#### Linux:

	goctl completion zsh > "${fpath[1]}/_goctl"

#### macOS:

	goctl completion zsh > $(brew --prefix)/share/zsh/site-functions/_goctl

You will need to start a new shell for this setup to take effect.

Usage:
  goctl completion zsh [flags]

Flags:
  -h, --help              help for zsh
      --no-descriptions   disable completion descriptions
```

:::tip 温馨提示
如果你使用的是 zsh，且 shell completion 没有启用，那么你可以通过如下指令开启：

```bash
echo "autoload -U compinit; compinit" >> ~/.zshrc
```

:::

1. 临时生效

临时生效仅对当前终端 session 有用，是一次性的。

```bash
$ source <(goctl completion zsh); compdef _goctl goctl
```

2. 永久生效

永久生效设置按照操作系统的不同，其设置方法也不同，设置后需要重新启动终端才生效，目前针对 Linux 和 MacOS 的设置方法如下：


<Tabs>

<TabItem value="Linux" label="Linux" default>

```bash
$ goctl completion zsh > "${fpath[1]}/_goctl"
```

</TabItem>

<TabItem value="MacOS" label="MacOS" default>

```bash
$ goctl completion zsh > $(brew --prefix)/share/zsh/site-functions/_goctl
```

</TabItem>

</Tabs>