---
title: goctl-intellij 安装
sidebar_label: goctl-intellij 安装
slug: /docs/tasks/installation/goctl-intellij
---

import { Image } from '@arco-design/web-react';
import DocsCard from '@components/global/DocsCard';
import DocsButton from '@components/page/native/DocsButton';
import { IconMoreVertical } from '@arco-design/web-react/icon';

## 概述

goctl-intellij 是 go-zero api 描述语言的 intellij 编辑器插件，支持 api 描述语言高亮、语法检测、快速提示、创建模板特性。

项目地址：<https://github.com/zeromicro/goctl-intellij>

## 安装

goctl-intellij 安装方式有 2 种

- 从磁盘安装
- intellij 插件中心安装

### 1. 从磁盘安装

###

<DocsCard
  className="cordova-ee-card"
  header="Goctl-1.1.3.zip"
  href="<https://github.com/zeromicro/goctl-intellij/releases/download/v1.1.3/Goctl-1.1.3.zip>"
>
  <div>
    <img src="/logos/logo.svg" class="cordova-ee-img" />
    <p>
      intellij 最低版本要求： 193.0（2019.3）
      安装包大小： 6.55MB
    </p>
    <DocsButton className="native-ee-detail">点击下载</DocsButton>
  </div>
</DocsCard>

###

下载的 zip 文件无需解压，然后打开 `Goland` | `Preferences...` | `Plugins`，找到更多图标 <IconMoreVertical />，选择 `Install Plugin from Disk...`

<Image
      src={require('.././../resource/tasks/installation/goland-plugin.png').default}
      alt='goland plugin center'
/>

### 2. 从插件中心安装

打开 `Goland` | `Preferences...` | `Plugins`，选中 `Marketplace` 选项栏，在搜索框输入 `Goctl` 进行搜索安装

<Image
      src={require('.././../resource/tasks/installation/goland-plugin-goctl.png').default}
      alt='goland plugin goctl'
/>
