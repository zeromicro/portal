---
title: doc Contribution guide
slug: /docs/contributing/doc
---

import { Image } from '@arco-design/web-react';

## Overview

<a href="https://github.com/zeromicro/portal" target="_blank">The portal</a> is a go-zero official document web site in which all find bugs in use, have new features, etc. to participate in the contribution of the portal. We very much welcome everyone's active participation and will respond to the various questions raised, pr etc.

## Contributing Steps

For how pr can refer to the <a href="https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests" target="_blank">GitHub Pull Request</a> document.

## Contribution norms

1. The original intention of the document under the **Quick Start** menu: to tell the developer how to use it (usage), but not why it is used (background & scene). As long as it is reserved, the developer can run out of the expected results according to the documentation, no need for detailed introduction.
2. The original intention of the document under the **Guide** menu: the document in the guide is more important than [task], and it is necessary to tell developers how to use (usage), but also to inform them Why it is used like this (background & scene), reveals more usages that developers cannot dig out from the usage level.
3. **Components** menu: from basic usage to in-depth principles
4. All document titles have 2 level titles ("#") as the starting title. The subtitle is not higher than 5 levels (contains 5 levels, i.e. "####"), and the level title is reserved for the document large title.
5. The document proposes to start with a secondary title [Overview] and then the text.
6. Hyperlinks suggest using `<a href="url" target="_blank">content</a>`to prevent users from opening new pages and shutting down the current page inconveniently.
7. Image component is recommended to use Image, support zoom expansion, use <a href="/docs/example" target="_blank">example</a>
<Image src={require('../resource/contributing/example_pic.png').default} alt='example_pic' title="example_pic" />

8. Propose components to be carried by the document itself, using a reference <a href="/docs/example" target="_blank">example</a>
<Image src={require('../resource/contributing/example_tips.png').default} alt='example_tips' title="example_tips" />

9. If there is an external link in the document, it is recommended to add the title to the document at the end

## References

- <a href="https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests" target="_blank">《Github • Pull Request》</a>