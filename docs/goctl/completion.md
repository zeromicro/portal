# Goctl Completion
Goctl Completion only supports unix-like operating systems

## Usage
```shell
$ goctl completion -h
NAME:
   goctl completion - generation completion script, it only works for unix-like OS

USAGE:
   goctl completion [command options] [arguments...]

OPTIONS:
   --name value, -n value  the filename of auto complete script, default is [goctl_autocomplete]
```

## Generate autocomplete file
```shell
$ goctl completion
Generate autocomplete successfully!
Execute the following script to set up the shell.
echo PROG=goctl source /Users/keson/.goctl/.auto_complete/zsh/goctl_autocomplete >> ~/.zshrc && source ~/.zshrc
or
echo PROG=goctl source /Users/keson/.goctl/.auto_complete/bash/goctl_autocomplete >> ~/.bashrc && source ~/.bashrc
```

## shell configuration
* zsh
```shell
$ echo PROG=goctl source /Users/keson/.goctl/.auto_complete/zsh/goctl_autocomplete >> ~/.zshrc && source ~/.zshrc
```
* bash
```shell
$ echo PROG=goctl source /Users/keson/.goctl/.auto_complete/bash/goctl_autocomplete >> ~/.bashrc && source ~/.bashrc
```

## Demo effect
Use the `tab` key to bring up the autocomplete prompt

```shell
$ goctl
api -- generate api-related files
bug -- report a bug
completion -- generates a completion script, which is only available for unix-like operating systems
docker -- generates a Docker file
help h -- displays a list of commands or help information for a command
kube -- generates kubernetes files
migrate -- migrate from tal-tech to zeromicro
model -- Generate model code
rpc -- generate rpc code
template -- Template operations
upgrade -- upgrade goctl to the latest version
```
