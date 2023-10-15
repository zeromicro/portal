---
title: goctl migrate
slug: /docs/tutorials/cli/migrate
---

## Overview

goctl migrates to go-zero from `tal-tech` to `zeroicro`.

## goctl migrate directive

```bash
goctl migrate --help
Migrate is a transition command to help users migrate their projects from tal-tech to zeromicro version

Usage:
  goctl migrate [flags]

Flags:
  -h, --help             help for migrate
  -v, --verbose          Verbose enables extra logging
      --version string   The target release version of github.com/zeromicro/go-zero to migrate (default "v1.3.0")
```

| <img width={100} /> Parameter field | <img width={150} /> Parameter Type | <img width={200} /> Required? | <img width={200} /> Default value | <img width={800} /> Parameter Description                      |
| ---------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------- |
| verbose                                              | boolean                                             | NO                                             | false                                              | Whether to output log                                                           |
| version                                              | string                                              | NO                                             | `v1.3.0`                                           | Migration from `tal-tech` to `zeroicro` after organization, default is `v1.3.0` |

Please <a href="https://github.com/zeromicro/go-zero/releases" target="_blank">click here</a> for a list of versions of the release organized by zeroicro
