const path = require('path');
const adJSON = require('./scripts/data/ad.json');

const BASE_URL = '/docs';

module.exports = {
    title: 'go-zero Documentation',
    tagline:
        'go-zero is a web and rpc framework with lots of builtin engineering practices. It’s born to ensure the stability of the busy services with resilience design and has been serving sites with tens of millions of users for years.',
    url: 'https://go-zero.dev',
    baseUrl: `${BASE_URL}/`,
    i18n: {
        defaultLocale: 'zh',
        locales: ['zh', 'en'],
        localeConfigs: {
            zh: {label: '简体中文'},
            en: {label: 'English'},
        },
    },
    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/meta/favicon.ico',
    organizationName: 'zeromicro',
    projectName: 'go-zero',
    themeConfig: {
        metadata: [
            {
                name: "keywords",
                content: 'go-zero,gozero,go-zero doc,go-zero 文档,gozero 文档,goctl,goctl 文档',
            },
            {
                name: "description",
                content: "go-zero is a web and rpc framework with lots of builtin engineering practices. It’s born to ensure the stability of the busy services with resilience design and has been serving sites with tens of millions of users for years."
            }
        ],
        colorMode: {
            defaultMode: 'light',
        },
        footer: {
            links: [
                {
                    title: 'ZEROMICRO',
                    items: [
                        {
                            label: 'go-queue',
                            href: 'https://github.com/zeromicro/go-queue',
                        },
                        {
                            label: "awesome-zero",
                            href: "https://github.com/zeromicro/awesome-zero",
                        },
                        {
                            label: "zero-example",
                            href: "https://github.com/zeromicro/zero-example",
                        },
                    ],
                },
                {
                    title: "友情链接",
                    items: [
                        {
                            label: "旧文档",
                            href: "https://legacy.go-zero.dev",
                        },
                        {
                            label: "开发路线图",
                            href: "https://github.com/zeromicro/go-zero/blob/master/ROADMAP.md",
                        },
                        {
                            html: `
                <a href="https://landscape.cncf.io/?selected=go-zero" target="_blank" rel="noreferrer noopener" aria-label="CNCF">
                  <img src="https://landscape.cncf.io/images/left-logo.svg" alt="CNCF" width="100" height="50" />
                </a>
              `,
                        },
                    ],
                },
                {
                    title: '社区',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/zeromicro/go-zero',
                        },
                        {
                            label: 'Discord',
                            href: 'https://discord.gg/4JQvC5A4Fe',
                        }
                    ],
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} zeromicro.`,
        },
        navbar: {
            hideOnScroll: true,
            logo: {
                alt: 'Site Logo',
                src: `/logos/go-zero-docs-dark.svg`,
                srcDark: `/logos/go-zero-docs-light.svg`,
                href: '/',
                target: '_self',
                width: 200,
                height: 60,
            },
            items: [
                {
                    type: 'doc',
                    docId: 'index',
                    label: '概念',
                    position: 'left',
                },
                {
                    type: 'doc',
                    docId: 'tasks',
                    label: ' 任务',
                    position: 'left',
                },
                {
                    type: 'doc',
                    docId: 'tutorials',
                    label: ' 指南',
                    position: 'left',
                },
                {
                    type: 'doc',
                    docId: 'components',
                    label: '组件',
                    position: 'left',
                },
                {
                    type: 'doc',
                    docId: 'reference',
                    label: '参考',
                    position: 'left',
                },
                {
                    type: 'doc',
                    docId: 'contributing',
                    label: '贡献',
                    position: 'left',
                },
                {
                    type: 'search',
                    position: 'right',
                },
                {
                    type: 'separator',
                    position: 'right',
                },
                {
                    type: 'localeDropdown',
                    position: 'right',
                    dropdownItemsBefore: [],
                    dropdownItemsAfter: [],
                    className: 'icon-link language navbar__item',
                },
                {
                    type: 'iconLink',
                    position: 'right',
                    icon: {
                        alt: 'github logo',
                        src: `/logos/github.svg`,
                        href: 'https://github.com/zeromicro/go-zero',
                        target: '_blank',
                    },
                },
                {
                    type: 'iconLink',
                    position: 'right',
                    icon: {
                        alt: 'discord logo',
                        src: `/logos/discord.svg`,
                        href: 'https://discord.com/invite/4JQvC5A4Fe',
                        target: '_blank',
                    },
                },
            ],
        },
        tagManager: {
            trackingID: 'GTM-TKMGCBC',
        },
        tableOfContents: {
            minHeadingLevel: 2,
            maxHeadingLevel: 5,
        },
        prism: {
            theme: {plain: {}, styles: []},
            magicComments: [
                {
                    className: 'theme-code-block-highlighted-line',
                    line: 'highlight-next-line',
                    block: {start: 'highlight-start', end: 'highlight-end'},
                },
                {
                    className: 'code-block-error-line',
                    line: 'This will error',
                },
            ],
            // https://github.com/FormidableLabs/prism-react-renderer/blob/master/src/vendor/prism/includeLangs.js
            additionalLanguages: ['shell-session', 'http'],
        },
        algolia: {
            appId: 'foo',
            apiKey: 'foo',
            indexName: 'foo',
            contextualSearch: true,
        },
    },
    plugins: [
        'docusaurus-plugin-sass',
        [
            'docusaurus-plugin-module-alias',
            {
                alias: {
                    'styled-components': path.resolve(__dirname, './node_modules/styled-components'),
                    react: path.resolve(__dirname, './node_modules/react'),
                    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
                    '@components': path.resolve(__dirname, './src/components'),
                },
            },
        ],
        [
            '@docusaurus/plugin-content-docs',
            {
                routeBasePath: '/',
                sidebarPath: require.resolve('./sidebars.js'),
                editUrl: ({versionDocsDirPath, docPath, locale}) => {
                    if ((match = docPath.match(/concepts\/(.*)\.md/)) != null) {
                        return `https://github.com/zeromicro/portal/tree/main/docs/concepts/${match[1]}.md`;
                    }
                    if ((match = docPath.match(/tasks\/(.*)\.md/)) != null) {
                        return `https://github.com/zeromicro/portal/tree/main/docs/tasks/${match[1]}.md`;
                    }
                    if ((match = docPath.match(/components\/(.*)\.md/)) != null) {
                        return `https://github.com/zeromicro/portal/tree/main/docs/components/${match[1]}.md`;
                    }
                    if ((match = docPath.match(/contributing\/(.*)\.md/)) != null) {
                        return `https://github.com/zeromicro/portal/tree/main/docs/contributing/${match[1]}.md`;
                    }
                    if ((match = docPath.match(/reference\/(.*)\.md/)) != null) {
                        return `https://github.com/zeromicro/portal/tree/main/docs/reference/${match[1]}.md`;
                    }
                    if ((match = docPath.match(/tutorials\/(.*)\.md/)) != null) {
                        return `https://github.com/zeromicro/portal/tree/main/docs/tutorials/${match[1]}.md`;
                    }
                    return `https://github.com/zeromicro/portal/tree/main/docs/${versionDocsDirPath}/${docPath}`;
                },
                exclude: ['README.md'],
                lastVersion: 'current',
            },
        ],
        '@docusaurus/plugin-content-pages',
        '@docusaurus/plugin-debug',
        '@docusaurus/plugin-sitemap',
        '@ionic-internal/docusaurus-plugin-tag-manager',
        function (context, options) {
            return {
                name: 'zeromicro-docs-ads',
                contentLoaded({ content, actions: { setGlobalData, addRoute } }) {
                    return setGlobalData({ prismicAds: adJSON });
                },
            };
        },
    ],
    themes: [
        [
            //overriding the standard docusaurus-theme-classic to provide custom schema
            path.resolve(__dirname, 'docusaurus-theme-classic'),
            {
                customCss: [
                    require.resolve('./node_modules/modern-normalize/modern-normalize.css'),
                    require.resolve('./node_modules/@ionic-internal/ionic-ds/dist/tokens/tokens.css'),
                    require.resolve('./src/styles/custom.scss'),
                ],
            },
        ],
        path.resolve(__dirname, './node_modules/@docusaurus/theme-search-algolia'),
    ],
    customFields: {},
};
