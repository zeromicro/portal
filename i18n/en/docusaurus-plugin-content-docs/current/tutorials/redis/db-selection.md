---
title: DB Selection
slug: /docs/tutorials/redis/db/selection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview
This section focuses on the go-zero redis component considerations of db selection.

## Description
go-zero redis component, no db associated configuration, default db0.Db selection is not supported by default due mainly to the <a href="https://redis.io/docs/reference/cluster-spec/#implemented-subset" target="_blank">redis cluster</a> and only db0 is supported. If a different business scenario is differentiated by db, it is recommended to use multiple redis to be managed.If you really choose db scene, you can refer to <a href="https://github.com/zeromicro/go-zero/pull/3071" target="_blank"> PR </a> for self-processing.