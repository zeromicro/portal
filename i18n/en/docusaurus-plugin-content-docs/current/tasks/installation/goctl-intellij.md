---
title: goctl-intelij installation
sidebar_label: goctl-intelij installation
slug: /docs/tasks/installation/goctl-intellij
---

import { Image } from '@arco-design/web-react';
import DocsCard from '@components/global/DocsCard';
import DocsButton from '@components/page/native/DocsButton';
import { IconMoreVertical } from '@arco-design/web-react/icon';

## Overview

goctl-intelij is an intelij editor plugin for go-zero api describing language that supports api describing language highlighting, syntax detection, quick hint and creating template features.

Project address：https://github.com/zeroicro/goctl-intelij

## Installation

goctl-intelij installation have 2 ways

- Install from disk
- Intelij Plugin Center Installation

### 1. Install from disk

###
<DocsCard
  className="cordova-ee-card"
  header="Goctl-1.1.3.zip"
  href="https://github.com/zeromicro/goctl-intellij/releases/download/v1.1.3/Goctl-1.1.3.zip"
>
  <div>
    <img src="/logos/logo.svg" class="cordova-ee-img" />
    <p>
      intelij minimum release requirement： 193.0 (2019.3)
      Installation package size： 6.55MB
    </p>
    <DocsButton className="native-ee-detail">Click to download</DocsButton>
  </div>
</DocsCard>

###

Downloaded zip files need not be unpressed, then open `Goland` | `Preferences...` | `Plugins`, find more ices <IconMoreVertical />, select `Install Plugins from Disk...`

<Image src={require('.././../resource/tasks/installation/goland-plugin.png').default} alt='goland plugin center' />

### 2. Install from plugin center

Open `Goland` | `Preferences...` | `Plugins`, selected `Marketplace` Options bar,enter `Goctl` for search installation

<Image src={require('.././../resource/tasks/installation/goland-plugin-goctl.png').default} alt='goland plugin goctl' />