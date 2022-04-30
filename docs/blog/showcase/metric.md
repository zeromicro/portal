
# Microservice metrics monitoring based on prometheus

After a service goes live, we often need to monitor the service so that we can find problems early and make targeted optimizations, which can be divided into various forms, such as log monitoring, call chain monitoring, metrics monitoring, and so on. Through metrics monitoring, we can clearly observe the trend of service indicators and understand the operation status of the service, which plays a very important role in ensuring the stability of the service.

[prometheus](https://prometheus.io/) is an open source system monitoring and alerting tool that supports the powerful query language PromQL allowing users to select and aggregate time series data in real time, time series data is actively pulled by the server through the HTTP protocol to obtain, but also through the intermediate gateway to push time series data. Monitoring targets can be obtained through static profiles or service discovery

## Architecture of Prometheus

The overall architecture of Prometheus and the ecosystem components are shown in the following figure.

![prometheus](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/prometheus.png)

Prometheus Server pulls monitoring metrics directly from monitoring targets or indirectly through push gateways. It stores all grabbed sample data locally and executes a set of rules on this data to aggregate and record new time series of existing data or generate alerts. Monitoring data can be visualized via [Grafana](https://grafana.com/) or other tools

## go-zero prometheus-based service metrics monitoring

The [go-zero](https://github.com/zeromicro/go-zero) framework integrates prometheus-based service metrics monitoring, and we use the following go-zero official example [shorturl](https://github.com/zeromicro) /go-zero/blob/master/doc/shorturl.md) to demonstrate how service metrics are collected and monitored.

- The first step requires Prometheus to be installed first, please refer to [official documentation](https://prometheus.io/) for installation steps
- go-zero does not open prometheus monitoring by default, open the way is very simple, just need to add the following configuration in the shorturl-api.yaml file, where Host for Prometheus Server address is required configuration, Port port is not filled default 9091, Path for the path used to pull metrics default for / metrics

```go
Prometheus:
  Host: 127.0.0.1
  Port: 9091
  Path: /metrics
```

- Edit the prometheus configuration file prometheus.yml, add the following configuration, and create targets.json

```go
- job_name: 'file_ds'
    file_sd_configs:
    - files:
      - targets.json
```

- Edit the targets.json file, where targets is the target address for the shorturl configuration, and add a few default tags

```go
[
    {
        "targets": ["127.0.0.1:9091"],
        "labels": {
            "job": "shorturl-api",
            "app": "shorturl-api",
            "env": "test",
            "instance": "127.0.0.1:8888"
        }
    }
]
```

- Start the prometheus service, listening on port 9090 by default

```go
prometheus --config.file=prometheus.yml
```

- Type http://127.0.0.1:9090/ in the browser and click Status -> Targets to see the Job with the status Up and the Lables bar with the default labels we configured

![Job status is Up](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/prom_up.png)

Through the above steps we have completed the configuration of prometheus metrics monitoring collection for the shorturl service, in order to demonstrate the simplicity of our manual configuration, in the actual production environment is generally used to regularly update the configuration file or service discovery to configure the monitoring targets, space is limited here not to expand the explanation, interested students please check the relevant documentation on their own

## go-zero monitoring metrics type

go-zero currently adds monitoring of request metrics to the http middleware and rpc interceptor.

The main two dimensions are request time consumption and request error. The request time consumption uses the Histogram metric type to define multiple Buckets to facilitate subdivision statistics, the request error uses the Counter type, and the path tag is added to the http metric and the method tag is added to the rpc metric for subdivision monitoring.

Next, we demonstrate how to view the monitoring metrics.

First, execute the following command multiple times at the command line

```go
curl -i "http://localhost:8888/shorten?url=http://www.xiaoheiban.cn"
```

Open Prometheus and switch to the Graph interface, enter the command {path="/shorten"} in the input box to view the monitoring metrics, as follows

![Query Panel](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/panel.png)

We filter the metrics with the path of /shorten by ProQL syntax query, the result shows the metric name and the value of the metric, where the code value in the http_server_requests_code_total metric is the status code of http, 200 indicates a successful request, http_server_requests The _duration_ms_bucket shows the statistics of different bucket results, and we can also see that all the indicators are added to the default indicators we configured.

The Console interface mainly shows the results of the query metrics, and the Graph interface provides us with a simple graphical display interface, in the actual production environment we generally use Grafana for graphical display

## grafana visual interface

[grafana](https://grafana.com/) is a visualization tool, powerful, supports multiple data sources Prometheus, Elasticsearch, Graphite, etc., installation is relatively simple please refer to [official documentation](https://grafana.com/docs/ grafana/latest/), grafana default port 3000, after installation and then browser enter http://localhost:3000/, the default account and password are admin

The following demonstrates how to visualize the interface based on the above indicators.

- Click the left sidebar Configuration->Data Source->Add data source to add the data source, where the HTTP URL is the address of the data source

The HTTP URL is the address of the data source![datasource](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/datasource.png)

- Click on the left sidebar to add a dashboard, then add Variables to facilitate filtering for different tags, such as adding app variables to filter different services

![variables](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/variables.png)

- Go to the dashboard and click Add panel in the upper right corner to add a panel to count the qps of the interface in the path dimension

![qps](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/qps.png)

- The final result is shown below, you can filter different services by service name, the panel shows the trend of qps for path as /shorten

![qps panel](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/qps_panel.png)

## Summary

The above demonstrates the simple process of prometheus+grafana based service metrics monitoring in go-zero, and the production environment can do different dimensions of monitoring and analysis according to the actual scenario. Now go-zero's monitoring metrics are mainly for http and rpc, which is obviously still insufficient for the overall monitoring of services, such as monitoring of container resources, monitoring of dependent mysql, redis and other resources, and monitoring of custom metrics, etc. go-zero will continue to optimize in this area. Hope this article can bring you help!

