module.exports = {
  docs: [
    {
      id: "introduction",
      type: "doc",
    },
    {
      id: "concept",
      type: "doc",
    },
    {
      label: "Preparation",
      type: "category",
      items: [
        "prepare/prepare",
        "prepare/dev-flow",
        "prepare/golang-install",
        "prepare/gomod-config",
        "prepare/goctl-install",
        "prepare/protoc-install",
        "prepare/prepare-other",
      ],
    },
    {
      label: "Development Specification",
      type: "category",
      items: [
        "develop/dev-specification",
        "develop/naming-spec",
        "develop/coding-spec",
      ],
    },
    {
      label: "Configuration",
      type: "category",
      items: [
        "configuration/api",
        "configuration/rpc",
      ],
    },
    {
      label: "Getting Started",
      type: "category",
      items: [
        "quick-start/quick-start",
        "quick-start/monolithic-service",
        "quick-start/micro-service",
      ],
    },
    {
      label: "Components",
      type: "category",
      items:[
        "component/components",
        "component/logx"
      ]
    },
    {
      label: "Guides",
      type: "category",
      items: [
        "advance/advance",
        "advance/business-dev",
        "advance/service-design",
        "advance/model-gen",
        "advance/api-coding",
        "advance/business-coding",
        "advance/jwt",
        "advance/middleware",
        "advance/rpc-call",
        "advance/error-handle",
        "advance/template",
      ],
    },
    {
      label: "Deployment",
      type: "category",
      items: [
        "deployment/ci-cd",
        "deployment/log-collection",
        "deployment/service-deployment",
        "deployment/service-monitor",
        "deployment/trace",
      ],
    },
    {
      label: "FAQ",
      type: "category",
      items: [
        "faq/troubleshooting",
        "faq/error"
      ],
    },
  ].filter(Boolean),
  goctl: [
    {
      id: "goctl/goctl",
      type: "doc",
    },
    {
      id: "goctl/installation",
      type: "doc",
    },
    {
      id: "goctl/api",
      type: "doc",
    },
    {
      id: "goctl/zrpc",
      type: "doc",
    },
    {
      id: "goctl/model",
      type: "doc",
    },
    {
      id: "goctl/plugin",
      type: "doc",
    },
    {
      id: "goctl/template-cmd",
      type: "doc",
    },
    {
      id: "goctl/other",
      type: "doc",
    },
    {
      id: "goctl/commands",
      type: "doc",
    },
    {
      id: "goctl/completion",
      type: "doc",
    },
  ].filter(Boolean),
  eco: [
    {
      type: "doc",
      id: "eco/plugins",
    },
    {
      type: "doc",
      id: "eco/editor",
    },
    {
      type: "doc",
      id: "eco/intellij",
    },
    {
      type: "doc",
      id: "eco/vscode",
    },
    {
      type: "doc",
      id: "eco/distributed-transaction",
    },
    {
      type: "doc",
      id: "eco/showcase",
    },
  ].filter(Boolean),
  community: [
    {
      type: "doc",
      id: "community/about-us",
    },
    {
      type: "doc",
      id: "community/contribute",
    },
    {
      type: "doc",
      id: "community/contributor",
    },
  ].filter(Boolean),
  design: [
    {
      type: "doc",
      id: "design/design",
    },
    {
      type: "doc",
      id: "design/go-zero-design",
    },
    {
      type: "doc",
      id: "design/go-zero-features",
    },
    {
      type: "doc",
      id: "design/grammar",
    },
    {
      type: "doc",
      id: "design/api-dir",
    },
    {
      type: "doc",
      id: "design/rpc-dir",
    },
  ].filter(Boolean),
  resource: [
    {
      type: "doc",
      id: "resource-center/learning-resource",
    },
    {
      type: "doc",
      id: "resource-center/wechat",
    },
    {
      type: "doc",
      id: "resource-center/gotalk",
    },
    {
      type: "doc",
      id: "resource-center/goreading",
    },
    {
      type: "doc",
      id: "resource-center/source",
    },
  ].filter(Boolean),
  blog: [
    {
      type: "doc",
      id: "blog/blog",
    },
    {
      type: "category",
      label: "Governance",
      items: [
        "blog/governance/bloom",
        "blog/governance/breaker-algorithms",
        "blog/governance/loadshedding",
        "blog/governance/periodlimit",
        "blog/governance/tokenlimit",
      ],
    },
    {
      type: "category",
      label: "Cache",
      items: [
        "blog/cache/cache",
        "blog/cache/redis-cache",
        "blog/cache/business-cache",
        "blog/cache/collection",
      ],
    },
    {
      type: "category",
      label: "Components",
      items: [
        "blog/tool/executors",
        "blog/tool/keywords",
        "blog/tool/logx",
      ],
    },
    {
      type: "category",
      label: "Concurrency",
      items: [
        "blog/concurrency/fx",
        "blog/concurrency/mapreduce",
        "blog/concurrency/stream",
        "blog/concurrency/redis-lock",
        "blog/concurrency/sharedcalls",
      ],
    },
    {
      type: "category",
      label: "Principle",
      items: [
        "blog/principle/timing-wheel",
      ],
    },
    {
      type: "category",
      label: "Showcase",
      items: [
        "blog/showcase/shorturl",
        "blog/showcase/zrpc",
        "blog/showcase/mysql",
        "blog/showcase/mapping",
        "blog/showcase/datacenter",
        "blog/showcase/go-queue",
        "blog/showcase/go-zero-looklook",
        "blog/showcase/metric",
      ],
    },
    {
      type: "category",
      label: "Exchange",
      items: [
        "blog/share/online-exchange",
        "blog/share/goctl-share-part-one",
      ],
    },
  ].filter(Boolean),
}
