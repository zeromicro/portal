---
title: DB 选择
sidebar_label: DB 选择
slug: /docs/tutorials/redis/db/selection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview
本章节主要介绍 go-zero redis 组件对 db 选择的考虑。

## 说明
go-zero redis 组件，没有提供 db 相关的配置，默认使用 db0。主要因为 <a href="https://redis.io/docs/reference/cluster-spec/#implemented-subset" target="_blank">redis cluster</a> 的默认也仅支持 db0, 不支持 db 的选择。 如果存在通过 db 区分不同的业务场景，建议使用多个 redis 实例进行管理。如果真存在选择 db 场景，且无法避开，可以参考 <a href="https://github.com/zeromicro/go-zero/pull/3071" target="_blank"> PR </a> 自行处理。