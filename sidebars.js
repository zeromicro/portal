module.exports = {
    concepts: [
        'concepts',
        'concepts/keywords',
        'concepts/components',
        'concepts/architecture-evolution',
        'concepts/layout'
    ],
    tasks: [
        {
            type: 'category',
            label: '安装',
            collapsed: false,
            items: [
                'tasks',
                'tasks/installation/goctl',
                'tasks/installation/protoc',
                'tasks/installation/go-zero',
                'tasks/installation/goctl-intellij',
                'tasks/installation/goctl-vscode',
            ],
        },
        {
            type: 'category',
            label: 'DSL 介绍',
            collapsed: false,
            items: [
                'tasks/dsl/api',
                'tasks/dsl/proto',
            ],
        },
        {
            type: 'category',
            label: 'CLI 代码生成',
            collapsed: false,
            items: [
                'tasks/cli/api-demo',
                'tasks/cli/grpc-demo',
                'tasks/cli/mysql',
                'tasks/cli/mongo',
                'tasks/cli/api-format',
            ],
        },
        {
            type: 'category',
            label: '创建项目',
            collapsed: false,
            items: [
                'tasks/create/goland',
                'tasks/create/vscode',
                'tasks/create/command',
            ],
        },
        {
            type: 'category',
            label: '静态配置文件管理',
            collapsed: false,
            items: [
                'tasks/static-configuration/configuration',
            ],
        },
        {
            type: 'category',
            label: 'HTTP 开发',
            collapsed: false,
            items: [
                'tasks/http/helloworld',
            ],
        },
        {
            type: 'category',
            label: 'gRPC Server 开发',
            collapsed: false,
            items: [
                'tasks/grpc/server/quickstart'
            ],
        },
        {
            type: 'category',
            label: 'gRPC Client 开发',
            collapsed: false,
            items: [
                'tasks/grpc/client/quickstart',
            ],
        },
        {
            type: 'category',
            label: 'MySQL 数据库操作',
            collapsed: false,
            items: [
                'tasks/mysql/mysql',
            ],
        },
        {
            type: 'category',
            label: 'Mongo 数据库操作',
            collapsed: false,
            items: [
                'tasks/mongo/conn',
                'tasks/mongo/curd',
            ],
        },
        {
            type: 'category',
            label: 'Redis 使用',
            collapsed: false,
            items: [
                'tasks/redis/redis',
            ],
        },
        {
            type: 'category',
            label: '内存缓存',
            collapsed: false,
            items: [
                'tasks/memory-cache',
            ],
        },
        {
            type: 'category',
            label: '队列',
            collapsed: false,
            items: [
                'tasks/queue/message-queue',
                'tasks/queue/delay-queue',
            ],
        },
        {
            type: 'category',
            label: '日志',
            collapsed: false,
            items: [
                'tasks/log/log',
            ]
        }
    ],
    tutorials: [
        {
            type: 'category',
            label: 'API 定义',
            collapsed: false,
            items: [
                'tutorials',
                'tutorials/api/type',
                'tutorials/api/route-prefix',
                'tutorials/api/route-group',
                'tutorials/api/signature',
                'tutorials/api/jwt',
                'tutorials/api/route-rule',
                'tutorials/api/parameter',
                'tutorials/api/middleware',
                'tutorials/api/import',
                'tutorials/api/faq',
            ],
        },
        {
            type: 'category',
            label: 'Proto 定义',
            collapsed: false,
            items: [
                'tutorials/proto/spec',
                'tutorials/proto/services-group',
                'tutorials/proto/faq',
            ],
        },
        {
            type: 'category',
            label: 'CLI 工具',
            collapsed: false,
            items: [
                'tutorials/cli/overview',
                'tutorials/cli/style',
                'tutorials/cli/api',
                'tutorials/cli/bug',
                'tutorials/cli/completion',
                'tutorials/cli/docker',
                'tutorials/cli/env',
                'tutorials/cli/kube',
                'tutorials/cli/migrate',
                'tutorials/cli/model',
                'tutorials/cli/quickstart',
                'tutorials/cli/rpc',
                'tutorials/cli/template',
                'tutorials/cli/upgrade',
            ],
        },
        {
            type: 'category',
            label: 'go-zero 配置',
            collapsed: false,
            items: [
                'tutorials/go-zero-configuration/overview',
                'tutorials/go-zero-configuration/service',
                'tutorials/go-zero-configuration/log',
                'tutorials/go-zero-configuration/prometheus',
            ],
        },
        {
            type: 'category',
            label: 'HTTP Server',
            collapsed: false,
            items: [
                'tutorials/http/server/configuration',
                'tutorials/http/server/request-body',
                'tutorials/http/server/response-body',
                'tutorials/http/server/middleware',
                'tutorials/http/server/jwt',
                'tutorials/http/server/error',
                'tutorials/http/server/response-ext',
            ],
        },
        {
            type: 'category',
            label: 'HTTP Client',
            collapsed: false,
            items: [
                'tutorials/http/client/index',
            ],
        },
        {
            type: 'category',
            label: 'gRPC Server',
            collapsed: false,
            items: [
                'tutorials/grpc/server/configuration',
                'tutorials/grpc/server/example',
            ],
        },
        {
            type: 'category',
            label: 'gRPC Client',
            collapsed: false,
            items: [
                'tutorials/grpc/client/configuration',
                'tutorials/grpc/client/conn',
            ],
        },
        {
            type: 'category',
            label: 'Cron job',
            collapsed: false,
            items: [
                'tutorials/cron-job/k8s',
            ],
        },
        {
            type: 'category',
            label: '消息队列',
            collapsed: false,
            items: [
                'tutorials/queue/kafka',
                'tutorials/queue/beanstalkd',
            ],
        },
        {
            type: 'category',
            label: 'MySQL',
            collapsed: false,
            items: [
                'tutorials/mysql/connection',
                'tutorials/mysql/curd',
                'tutorials/mysql/cache',
                'tutorials/mysql/bulk-insert',
                'tutorials/mysql/local-transaction',
                'tutorials/mysql/distribute-transaction',
            ],
        },
        {
            type: 'category',
            label: 'Mongo',
            collapsed: false,
            items: [
                'tutorials/mongo/connection',
                'tutorials/mongo/curd',
                'tutorials/mongo/cache',
            ],
        },
        {
            type: 'category',
            label: 'Redis',
            collapsed: false,
            items: [
                'tutorials/redis/redis-lock',
                'tutorials/redis/metric',
                'tutorials/redis/db-selection',
            ],
        },
        {
            type: 'category',
            label: 'Gateway',
            collapsed: false,
            items: [
                'tutorials/gateway/grpc',
            ],
        },
        {
            type: 'category',
            label: '日志',
            collapsed: false,
            items: [
                'tutorials/log/log',
            ]
        },
        {
            type: 'category',
            label: '流量治理',
            collapsed: false,
            items: [
                'tutorials/service-governance/limiter',
                'tutorials/service-governance/breaker',
                'tutorials/service-governance/loadbalance',
            ],
        },
        {
            type: 'category',
            label: '运维部署',
            collapsed: false,
            items: [
                'tutorials/ops/prepare',
                'tutorials/ops/machine',
                'tutorials/ops/docker-compose',
                'tutorials/ops/k8s',
            ],
        },
        {
            type: 'category',
            label: '监控',
            collapsed: false,
            items: [
                'tutorials/monitor/index'
            ]
        },
        {
            type: 'category',
            label: '定制化',
            collapsed: false,
            items: [
                'tutorials/customization/template',
            ],
        },
    ],
    // components: [
    //     'components',
    //     'components/mr',
    //     'components/fx',
    //     {
    //         type: 'category',
    //         label: '限流器',
    //         collapsed: false,
    //         items: [
    //             'components/limiter/token',
    //             'components/limiter/peroid',
    //         ],
    //     },
    //     {
    //         type: 'category',
    //         label: '日志',
    //         collapsed: false,
    //         items: [
    //             'components/log/logx',
    //             'components/log/logc',
    //         ],
    //     },
    // ],
    reference: [
        'reference',
        'reference/proto',
        'reference/examples',
        'reference/goctl-plugins',
        'reference/about-us',
    ],
    contributing: [
        'contributing',
        'contributing/doc',
        'contributing/contributors',
    ],
};
