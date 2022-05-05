const visit = require("unist-util-visit")
const ssrTemplate = require("./src/internals/ssr.template")
const consts = require("./src/config/consts")
const customFields = require("./src/config/customFields")
const math = require("remark-math")
const katex = require("rehype-katex")

function variable() {
  const RE_VAR = /{@([\w-_]+)@}/g
  const getVariable = (full, partial) =>
    partial ? customFields[partial] : full

  function textVisitor(node) {
    node.value = node.value.replace(RE_VAR, getVariable)
  }

  function linkVisitor(node) {
    node.url = node.url.replace(RE_VAR, getVariable)

    if (node.title) {
      node.title = node.title.replace(RE_VAR, getVariable)
    }
  }

  function transformer(ast) {
    visit(ast, "text", textVisitor)
    visit(ast, "code", textVisitor)
    visit(ast, "link", linkVisitor)
  }

  return transformer
}

const config = {
  title: "go-zero",
  tagline: "go-zero 是一个集成了各种工程实践的 web 和 rpc 框架",
  url: `https://${consts.domain}`,
  baseUrl: `${consts.baseUrl}`,
  baseUrlIssueBanner: false,
  favicon: `/img/favicon.png`,
  organizationName: `${consts.organizationName}`,
  projectName: `${consts.projectName}`,
  customFields: customFields,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cn'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      cn: {
        label: '中文简体',
        direction: 'ltr',
      },
    },
  },
  plugins: [
    require.resolve("./plugins/webpack-ts/index"),
    require.resolve("./plugins/optimize/index"),
    require.resolve("./plugins/manifest/index"),
    require.resolve("./plugins/delay-code-block-appearance"),
    [
      "@docusaurus/plugin-pwa",
      {
        pwaHead: [
          {
            tagName: "link",
            rel: "manifest",
            href: `${consts.baseUrl}/manifest.webmanifest`,
          },
          {
            tagName: "meta",
            name: "theme-color",
            content: "#d14671",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-capable",
            content: "yes",
          },
          {
            tagName: "meta",
            name: "apple-mobile-web-app-status-bar-style",
            content: "#21222c",
          },
        ],
      },
    ],
  ],
  themeConfig: {
    announcementBar: {
      id: 'document tip',
      backgroundColor: '#d14671', // 默认为 `#fff`.
      textColor: '#ffffff', // 默认为 `#000`.
      isCloseable: true, // 默认为 `true`.
    },
    gtag: {
      trackingID: 'G-XZD0YKV3XQ',
      anonymizeIP: true,
    },
    autoCollapseSidebarCategories: true,
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false, // 主题控制开关
      respectPrefersColorScheme: true,
      switchConfig: {
        darkIcon: '🌙',
        lightIcon: '\u2600',
        darkIconStyle: {
          marginLeft: '2px',
        },
        lightIconStyle: {
          marginLeft: '1px',
        },
      },
    },
    prism: {
      defaultLanguage: "go-zero",
      additionalLanguages: [
        "rust", "csharp", "julia", "cpp", "java", "ebnf", "ini", "toml", "go", "bash", "protobuf"],
      theme: require("./src/internals/prism-github"),
      darkTheme: require("./src/internals/prism-dracula"),
    },
    navbar: {
      title: " ",
      logo: {
        alt: "go-zero",
        src: `/img/navbar/go-zero.svg`,
      },
      items: [
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          label: "Docs",
          position: "left",
          items: [
            {
              label: "Preparation",
              to: "/docs/prepare/prepare",
            },
            {
              label: "Getting Started",
              to: "/docs/quick-start/quick-start",
            },
            {
              label: "Guides",
              to: "/docs/advance/advance",
            }
          ],
        },
        {
          label: "goctl",
          position: "left",
          sidebarId: 'goctl',
          items: [
            {
              label: "Installation",
              to: "/docs/goctl/goctl",
            },
            {
              label: "API Command",
              to: "/docs/goctl/api",
            },
            {
              label: "RPC Command",
              to: "/docs/goctl/zrpc",
            },
            {
              label: "Model Command",
              to: "/docs/goctl/model",
            },
            {
              label: "Completion",
              to: "/docs/goctl/completion",
            },
          ],
        },
        {
          label: "Tool",
          position: "left",
          items: [
            {
              label: "Goctl Plugin",
              to: "/docs/eco/plugins",
            },
            {
              label: "Editor Plugin",
              to: "/docs/eco/editor",
            },
          ],
        },
        {
          label: "Community",
          position: "left",
          items: [
            {
              label: "About us",
              to: "/docs/community/about-us",
            },
            {
              label: "Showcase",
              to: "/docs/community/showcase",
            },
            {
              label: "Contributing",
              to: "/docs/community/contribute",
            },
            {
              label: "Contributor",
              to: "/docs/community/contributor",
            },
            {
              label: "GitHub",
              to: customFields.githubUrl,
            },
            {
              label: "Discord",
              to: customFields.discordUrl,
            },
          ],
        },
        {
          label: "Blog",
          position: "left",
          sidebarId: 'blog',
          to: '/docs/blog/blog',
        },
        {
          label: "More",
          position: "left",
          items: [
            {
              label: "Resource Center",
              to: "/docs/resource-center/learning-resource",
            },
            {
              label: "Video Tutorial",
              to: customFields.videosUrl,
            },
            {
              label: "Development Roadmap",
              to: customFields.roadMapUrl,
            },
            {
              label: "Design Docs",
              to: "/docs/design/design",
            },
            {
              label: "FAQ",
              to: "/docs/faq/troubleshooting",
            },
          ],
        },
      ],
    },
    footer: {
      links: [
        {
          title: "zeromicro",
          items: [
            {
              label: "zero-api",
              href: customFields.zeroApiUrl,
            },
            {
              label: "go-queue",
              href: customFields.goQueueUrl,
            },
            {
              label: "awesome-zero",
              href: customFields.awesomeZeroUrl,
            },
            {
              label: "zero-example",
              href: customFields.zeroExamplesUrl,
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: customFields.githubUrl,
            },
            {
              label: "Discord",
              href: customFields.discordUrl,
            },
          ],
        },
        {
          title: "Links",
          items: [
            {
              label: "Older Doc",
              href: customFields.oldDocUrl,
            },
            {
              label: "Blog",
              to: "/docs/blog/blog",
            },
            {
              label: "Roadmap",
              href: customFields.roadMapUrl,
            },
            {
              label: "CNCF",
              href: customFields.cncfUrl,
            },
          ],
        },
        {
          title: "Chat",
          items: [
            {
              label: `${consts.discord}`,
              href: `image//:`,
            },
          ],
        },
      ],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          remarkPlugins: [variable, math],
          rehypePlugins: [katex],
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: ({locale, docPath}) => {
            return locale==='en'?`https://github.com/zeromicro/portal/edit/main/docs/${docPath}`:`https://github.com/zeromicro/portal/edit/main/i18n/cn/docusaurus-plugin-content-docs/current/${docPath}`
          },
          showLastUpdateTime: true,
        },
        sitemap: {
          changefreq: "daily",
          priority: 0.7,
          trailingSlash: false,
        },
        theme: {
          customCss: [
            require.resolve("./src/css/katex.min.css"),
            require.resolve("./src/css/_global.css"),
          ],
        },
      },
    ],
  ],
  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "zh"],
        highlightSearchTermsOnTargetPage: true
      }
    ]
  ]
}

module.exports = {
  ...config,
  ssrTemplate: ssrTemplate(config),
}
