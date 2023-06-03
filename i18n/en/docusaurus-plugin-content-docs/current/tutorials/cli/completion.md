---
title: goctl completion
slug: /docs/tutorials/cli/completion
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

goctl uses <a href="https://github.com/spf13/cobra" target="_blank"> Cobra </a> framework development, so it inherits Cobra auto completion, in goctl, They provide the auto-completion features of `cash`,`fish`,`zsh`and`powershell`.

## goctl completion directive

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

Currently goctl supports `cash`,`fish`,`zsh`and`power shell` if you are Windows operating system and use powershell, You can choose `goctl complete power shell` to generate scripts. If you are Linux or Mac operating systems, you can choose to create scripts other than `goctl complete power shell` but only by your current shell.

:::note for the current shell
in Linux or Mac operating systems, see the current shell, by `echo $SHELL` Effect is `zsh`, then select `goctl completion zsh` to generate script, The result is `cash`, select `goctl completion cash` to generate the script, The result is `fish`, select `goctl complete fish` to generate scripts.
:::


### goctl completion bash directive

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

In Linux or Mac operating systems, if you are using `cash`you can generate scripts by `goctl completion bash` , note that,`goctl completion bash` dependency `bash-completion` package support, if your operating system is not installed, it is recommended to install it yourself.

1. Temporary entry into force

Temporary entry is only useful for the current terminal session and is one-time in nature.

```bash
$ source <(goctl completion bash)
```

2. Permanent entry into force

Permanently effective settings differ according to operating system and their setup method, need to restart terminals to take effect after setup. Currently settings for Linux and MacOS are set below：


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

### goctl completion fish directive

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

1. Temporary entry into force

Temporary entry is only useful for the current terminal session and is one-time in nature.

```bash
$ goctl completion fish | source
```

2. Permanent entry into force

```bash
$ goctl completion fish > ~/.config/fish/completions/goctl.fish
```

### goctl completion powershell  directive

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

1. Temporary entry into force

Temporary entry is only useful for the current terminal session and is one-time in nature.

```bash
$ goctl completion powershell | Out-String | Invoke-Expression
```

2. Permanent entry into force

The following output needs to be added to the power shell's profile.

```bash
$ goctl completion powershell | Out-String | Invoke-Expression
```


### goctl completion zsh directive

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

::tip hint  
If you are using zsh, and shell completion is not enabled, you can enable： by following instructions

```bash
echo "autoload -U compinit; compinit" >> ~/.zshrc
```

:::

1. Temporary entry into force

Temporary entry is only useful for the current terminal session and is one-time in nature.

```bash
$ source <(goctl completion zsh); compdef _goctl goctl
```

2. Permanent entry into force

Permanently effective settings differ according to operating system and their setup method, need to restart terminals to take effect after setup. Currently settings for Linux and MacOS are set below：


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