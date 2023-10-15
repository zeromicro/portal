---
title: go-zero Contribution Guide
slug: /docs/contributing
---

import { Image } from '@arco-design/web-react';

## Overview

<a href="https://github.com/zeromicro/go-zero" target="_blank">go-zero</a> is an open-source project based on <a href="https://github.com/zeromicro/go-zero/blob/master/LICENSE" target="_blank">MIT</a> , in which all find bugs in use, have new characteristics, and can participate in go-zero's contribution. We would welcome active participation and respond to questions raised, pr.

## Forms of contribution

* <a href="https://github.com/zeromicro/go-zero/pulls" target="_blank">Full Requests</a>
* <a href="https://github.com/zeromicro/go-zero/issues" target="_blank">Issues</a>

## Information for contributions

The code in null request for go-Zero needs to meet some specification

* Naming specification, read <a href="https://google.github.io/styleguide/go/guide.html" target="_blank">Google Go Style Guide</a>
* Mostly comment in English
* Prtime note functional features. Description requires clarity and clarity
* Add Unit Test Coverage Up to 80%+

## Contribution Code (pr)

* Go to the<a href="https://github.com/zeromicro/go-zero" target="_blank"> go-zero </a>project, fork one of <a href="https://github.com/zeromicro/go-zero" target="_blank">go-zero</a> project into its own github.
* Back to your own github's home page, find`xx/go-zero`item, where xx is your username, e.g.`anqiansong/go-zero`

<Image src={require('./resource/contributing/fork.png').default} alt='fork' title="fork" />

* Clone Code to Local

<Image src={require('./resource/contributing/clone.png').default} alt='clone' title="clone" />)

* Development Code,push to your own github.
* Go to your own go-zero project in github and click `[Pull requests]` on the floating layer to enter the Compare page.

<Image src={require('./resource/contributing/contribute.png').default} alt='new_pr' title="new_pr" />

* `base repository` select `zeromicro/go-zero` `base:master`,`head repository` select `xx/go-zero` `compare:$branch` ，`$branch` your branch，such as：

<Image src={require('./resource/contributing/compare.png').default} alt='compare' title="compare" />

* Click `to create full request` to implement pre application
* After pr，visit <a href="https://github.com/zeromicro/go-zero/pulls" target="_blank">Pull Requets</a> record at <a href="https://github.com/zeromicro/go-zero" target="_blank">go-zero</a> ，there should be a record of your own commit with the name of your branch at the time of development

<Image src={require('./resource/contributing/pr_record.png').default} alt='pr_record' title="pr_record" />

## Issue

In our communities, there are many partners who will be active in providing feedback on some of the problems encountered in the use of go-zero. Because of the larger number of communities, while we will be following community dynamics in real time, everyone's feedback has come random. When our team is still addressing the issues raised by one partner, other questions may also lead to easy neglect by the team and, in order to be able to address everyone's problems, we strongly recommend that we provide feedback through an issue approach, including, but not limited to, bugs, desired new functional features, etc. We will also be present in the issue when we achieve a new feature, where you will also be able to get the latest movement of go-zero, and you will be invited to participate actively in the discussion.

### How to raise issues

* Visit <a href="https://github.com/zeromicro/go-zero/issues" target="_blank">https://github.com/zeromicro/go-zero/issues</a>
* Click on`New Issue`to create a new issue in the top right corner
* Fill in issue title and content
* Click`to submit an issue`

## References

* <a href="https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests" target="_blank">GitHub • Pull Requests</a>
