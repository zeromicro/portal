module.exports = {
    concepts: [
        'concepts',
        'concepts/components',
        'concepts/architecture-evolution',
        'concepts/service-governance',
        'concepts/ops'
    ],
    tasks: [
        {
            type: 'category',
            label: '安装',
            collapsed: false,
            items: [
                'tasks',
                'tasks/installation/protoc',
                'tasks/installation/goctl',
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
                'tasks/cli/mongo',
                'tasks/cli/mysql',
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
            label: '程序调试',
            collapsed: false,
            items: [
                'tasks/run/goland',
                'tasks/run/vscode',
            ],
        },
        {
            type: 'category',
            label: '静态配置文件管理',
            collapsed: false,
            items: [
                'tasks/static-configuration/create',
                'tasks/static-configuration/update',
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
                'tasks/grpc/server/helloworld',
                'tasks/grpc/server/debug',
            ],
        },
        {
            type: 'category',
            label: 'gRPC Client 开发',
            collapsed: false,
            items: [
                'tasks/grpc/client/helloworld',
            ],
        },
        {
            type: 'category',
            label: 'MySQL 数据库操作',
            collapsed: false,
            items: [
                'tasks/mysql/conn',
                'tasks/mysql/curd',
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
        'tasks/memory-cache',
        {
            type: 'category',
            label: 'Redis 使用',
            collapsed: false,
            items: [
                'tasks/timer-task/process',
            ],
        },
        {
            type: 'category',
            label: '消息队列',
            collapsed: false,
            items: [
                'tasks/message-queue/kafka',
            ],
        },
        {
            type: 'category',
            label: '延时队列',
            collapsed: false,
            items: [
                'tasks/delay-queue/beanstalkd',
            ],
        }
    ],
    tutorials: [
        {
            type: 'category',
            label: 'API 定义',
            collapsed: false,
            items: [
                'tutorials',
                'tutorials/api/route-prefix',
                'tutorials/api/route-group',
                'tutorials/api/signature',
                'tutorials/api/route-rule',
                'tutorials/api/parameter',
                'tutorials/api/middleware',
                'tutorials/api/import',
            ],
        },
        {
            type: 'category',
            label: 'Proto 定义',
            collapsed: false,
            items: [
                'tutorials/proto/spec',
                'tutorials/proto/services-group',
            ],
        },
        {
            type: 'category',
            label: 'CLI 工具',
            collapsed: false,
            items: [
                'tutorials/cli/overview',
                'tutorials/cli/api',
                'tutorials/cli/bug',
                'tutorials/cli/completion',
                'tutorials/cli/docker',
                'tutorials/cli/env',
                'tutorials/cli/kube',
                'tutorials/cli/migrate',
                'tutorials/cli/model',
                'tutorials/cli/quickstart',
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
                'tutorials/go-zero-configuration/etcd',
                'tutorials/go-zero-configuration/redis',
                'tutorials/go-zero-configuration/mysql',
                'tutorials/go-zero-configuration/postgresql',
                'tutorials/go-zero-configuration/mongo',
                'tutorials/go-zero-configuration/prometheus',
                'tutorials/go-zero-configuration/trace',
            ],
        },
        {
            type: 'category',
            label: 'HTTP Server',
            collapsed: false,
            items: [
                {
                    type: 'category',
                    label: '配置',
                    collapsed: false,
                    items: [
                        'tutorials/http/server/configuration/service',
                        'tutorials/http/server/configuration/redis',
                        'tutorials/http/server/configuration/mysql',
                        'tutorials/http/server/configuration/rpc-client',
                        'tutorials/http/server/configuration/log',
                    ]
                },
                'tutorials/http/server/request-body',
                'tutorials/http/server/response-body',
                'tutorials/http/server/header',
                'tutorials/http/server/jwt',
                'tutorials/http/server/error',
                'tutorials/http/server/route-rule',
                'tutorials/http/server/signature',
                'tutorials/http/server/cros',
                'tutorials/http/server/context',
                'tutorials/http/server/security',
                'tutorials/http/server/mock',
            ],
        },
        {
            type: 'category',
            label: 'HTTP Client',
            collapsed: false,
            items: [
                'tutorials/http/client/get',
                'tutorials/http/client/post-form',
                'tutorials/http/client/post-json',
                'tutorials/http/client/timeout',
                'tutorials/http/client/header',
            ],
        },
        {
            type: 'category',
            label: 'gRPC Server',
            collapsed: false,
            items: [
                {
                    type: 'category',
                    label: '配置',
                    collapsed: false,
                    items: [
                        'tutorials/grpc/server/configuration/service',
                        'tutorials/grpc/server/configuration/redis',
                        'tutorials/grpc/server/configuration/mysql',
                        'tutorials/grpc/server/configuration/log',
                    ]
                },
                'tutorials/grpc/server/debug',
                {
                    type: 'category',
                    label: '服务注册',
                    collapsed: false,
                    items: [
                        'tutorials/grpc/server/service-register/direct',
                        'tutorials/grpc/server/service-register/etcd',
                        'tutorials/grpc/server/service-register/nacos',
                        'tutorials/grpc/server/service-register/consul',
                        'tutorials/grpc/server/service-register/dns',
                    ]
                },
                {
                    type: 'category',
                    label: '中间件',
                    collapsed: false,
                    items: [
                        'tutorials/grpc/server/middleware/auth',
                        'tutorials/grpc/server/middleware/breaker',
                        'tutorials/grpc/server/middleware/recover',
                        'tutorials/grpc/server/middleware/prometheus',
                        'tutorials/grpc/server/middleware/timeout',
                    ]
                },
                'tutorials/grpc/server/security',
                'tutorials/grpc/server/error',
                'tutorials/grpc/server/options',
                'tutorials/grpc/server/mock',
            ],
        },
        {
            type: 'category',
            label: 'gRPC Client',
            collapsed: false,
            items: [
                {
                    type: 'category',
                    label: '配置',
                    collapsed: false,
                    items: [
                        'tutorials/grpc/client/configuration/service',
                        'tutorials/grpc/client/configuration/redis',
                        'tutorials/grpc/client/configuration/mysql',
                        'tutorials/grpc/client/configuration/log',
                    ]
                },
                {
                    type: 'category',
                    label: '服务发现',
                    collapsed: false,
                    items: [
                        'tutorials/grpc/client/service-discover/direct',
                        'tutorials/grpc/client/service-discover/etcd',
                        'tutorials/grpc/client/service-discover/nacos',
                        'tutorials/grpc/client/service-discover/consul',
                        'tutorials/grpc/client/service-discover/dns',
                    ]
                },
                {
                    type: 'category',
                    label: '中间件',
                    collapsed: false,
                    items: [
                        'tutorials/grpc/client/middleware/breaker',
                        'tutorials/grpc/client/middleware/duration',
                        'tutorials/grpc/client/middleware/timeout',
                        'tutorials/grpc/client/middleware/trace',
                    ]
                },
                'tutorials/grpc/client/security',
                'tutorials/grpc/client/error',
                'tutorials/grpc/client/options',
                'tutorials/grpc/client/mock',
            ],
        },
        {
            type: 'category',
            label: 'Cron job',
            collapsed: false,
            items: [
                'tutorials/cron-job/k8s',
                'tutorials/cron-job/process',
            ],
        },
        {
            type: 'category',
            label: '消息队列',
            collapsed: false,
            items: [
                'tutorials/message-queue/kafka',
                'tutorials/message-queue/rabbitmq',
            ],
        },
        {
            type: 'category',
            label: '延时队列',
            collapsed: false,
            items: [
                'tutorials/delay-queue/beanstalkd',
            ],
        },
        {
            type: 'category',
            label: 'MySQL',
            collapsed: false,
            items: [
                'tutorials/mysql/configuration',
                'tutorials/mysql/connection',
                'tutorials/mysql/curd',
                'tutorials/mysql/timeout',
                'tutorials/mysql/cache',
                'tutorials/mysql/page-query',
                'tutorials/mysql/bulk-insert',
                'tutorials/mysql/bulk-update',
                'tutorials/mysql/partition-query',
                'tutorials/mysql/local-transaction',
                'tutorials/mysql/distribute-transaction',
            ],
        },
        {
            type: 'category',
            label: 'PostgreSQL',
            collapsed: false,
            items: [
                'tutorials/postgresql/configuration',
                'tutorials/postgresql/connection',
                'tutorials/postgresql/curd',
                'tutorials/postgresql/timeout',
                'tutorials/postgresql/cache',
                'tutorials/postgresql/page-query',
                'tutorials/postgresql/bulk-insert',
                'tutorials/postgresql/bulk-update',
                'tutorials/postgresql/partition-query',
            ],
        },
        {
            type: 'category',
            label: 'Mongo',
            collapsed: false,
            items: [
                'tutorials/mongo/configuration',
                'tutorials/mongo/connection',
                'tutorials/mongo/curd',
                'tutorials/mongo/timeout',
                'tutorials/mongo/cache',
            ],
        },
        {
            type: 'category',
            label: 'ElasticSearch',
            collapsed: false,
            items: [
                'tutorials/elasticsearch/configuration',
                'tutorials/elasticsearch/connection',
                'tutorials/elasticsearch/curd',
                'tutorials/elasticsearch/statistics',
            ],
        },
        {
            type: 'category',
            label: 'Redis',
            collapsed: false,
            items: [
                'tutorials/redis/single-node',
                'tutorials/redis/multi-nodes',
                'tutorials/redis/cluster',
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
                'tutorials/monitor/health-check',
                'tutorials/monitor/log-collection',
                'tutorials/monitor/trace',
                'tutorials/monitor/metrics',
                'tutorials/monitor/alert',
            ],
        },
        {
            type: 'category',
            label: '定制化',
            collapsed: false,
            items: [
                'tutorials/customization/template',
                'tutorials/customization/http',
            ],
        },
    ],
    components: [
        'components',
        'components/mr',
        'components/fx',
        {
            type: 'category',
            label: '限流器',
            collapsed: false,
            items: [
                'components/limiter/token',
                'components/limiter/peroid',
            ],
        },
        {
            type: 'category',
            label: '日志',
            collapsed: false,
            items: [
                'components/log/logx',
                'components/log/logc',
            ],
        },
    ],
    reference: [
        'reference',
        'reference/proto',
    ],
    contributing: [
        'contributing',
        'contributing/doc',
    ],
};
