# Enterprise RPC framework zRPC

The recent hot open source project [go-zero](https://github.com/zeromicro/go-zero) is an integrated variety of engineering practices including Web and RPC protocols for a full-featured microservices framework, today we will analyze the RPC part of [zRPC](https://) github.com/zeromicro/go-zero/tree/master/zrpc).

The underlying dependency of zRPC on gRPC has built-in modules for service registration, load balancing, and interceptors, which also include adaptive load dropping, adaptive fusion, flow limiting, and other microservice governance schemes, making it an easy-to-use enterprise-class RPC framework that can be used directly in production.

### zRPC First Look

zRPC supports both direct connection and etcd-based service discovery. We use etcd-based service discovery as an example to demonstrate the basic use of zRPC.

##### Configuration

Create the hello.yaml configuration file with the following configuration.

```yml
Name: hello.rpc           // Service name
ListenOn: 127.0.0.1:9090  // Listen address
Etcd:
  Hosts:
    - 127.0.0.1:2379      // ETCD service address
  Key: hello.rpc          // Service registration key
```

##### Create proto file

Create the hello.proto file and generate the corresponding go code

```protobuf
syntax = "proto3";

package pb;

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

Code Generation

```shell
$ protoc --go_out=plugins=grpc:. hello.proto
```

##### Server

```go
package main

import (
    "context"
    "flag"
    "log"

    "example/zrpc/pb"

    "github.com/zeromicro/go-zero/core/conf"
    "github.com/zeromicro/go-zero/zrpc"
    "google.golang.org/grpc"
)

type Config struct {
    zrpc.RpcServerConf
}

var cfgFile = flag.String("f", "./hello.yaml", "cfg file")

func main() {
    flag.Parse()

    var cfg Config
    conf.MustLoad(*cfgFile, &cfg)

    srv, err := zrpc.NewServer(cfg.RpcServerConf, func(s *grpc.Server) {
        pb.RegisterGreeterServer(s, &Hello{})
    })
    if err != nil {
        log.Fatal(err)
    }
    srv.Start()
}

type Hello struct{}

func (h *Hello) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
    return &pb.HelloReply{Message: "hello " + in.Name}, nil
}
```

##### Client

```go
package main

import (
    "context"
    "log"

    "example/zrpc/pb"

    "github.com/zeromicro/go-zero/core/discov"
    "github.com/zeromicro/go-zero/zrpc"
)

func main() {
    client := zrpc.MustNewClient(zrpc.RpcClientConf{
        Etcd: discov.EtcdConf{
            Hosts: []string{"127.0.0.1:2379"},
            Key:   "hello.rpc",
        },
    })

    conn := client.Conn()
    hello := pb.NewGreeterClient(conn)
    reply, err := hello.SayHello(context.Background(), &pb.HelloRequest{Name: "go-zero"})
    if err != nil {
        log.Fatal(err)
    }
    log.Println(reply.Message)
}
```

Start the service and see if the service is registered:

```shell
$ ETCDCTL_API=3 etcdctl get hello.rpc --prefix
hello.rpc/7587849401504590084
127.0.0.1:9090
```

Run the client to see the output.

```
hello go-zero
```

This example demonstrates the basic use of zRPC, and you can see that building an RPC service with zRPC is very simple and requires only a few lines of code, so let's continue our exploration

### zRPC Principle Analysis

The following figure shows the architecture diagram and main components of zRPC

![zrpc](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/zrpc.png)

zRPC consists of the following main modules.

- discov: service discovery module, which implements the service discovery function based on etcd
- resolver: service registration module, which implements the resolver.Builder interface of gRPC and registers to gRPC
- interceptor: interceptor, intercept request and response processing
- balancer: load balancer module that implements the p2c load balancing algorithm and is registered to gRPC
- client: zRPC client, responsible for initiating requests
- server: zRPC server, responsible for processing requests

The main components of zRPC and the main functions of each module are introduced here, among which the resolver and balancer modules implement the open interfaces of gRPC and realize custom resolver and balancer. The interceptor module is the focus of the entire zRPC functionality.


### Interceptor module

gRPC provides interceptor function, mainly for additional processing before and after the request interception operation, which interceptor contains client-side interceptor and server-side interceptor, and is divided into a unary interceptor and stream (Stream) interceptor, here we mainly explain the unary interceptor, stream interceptor the same.

![interceptor](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/interceptor.png)

The client-side interceptor is defined as follows:

```go
type UnaryClientInterceptor func(ctx context.Context, method string, req, reply interface{}, cc *ClientConn, invoker UnaryInvoker, opts ...CallOption) error
```

where method is the method name, req, reply are the request and response parameters, cc is the client connection object, invoker parameter is the real execution of the rpc method handler is actually called in the interceptor execution

The server-side interceptor is defined as follows:

```go
type UnaryServerInterceptor func(ctx context.Context, req interface{}, info *UnaryServerInfo, handler UnaryHandler) (resp interface{}, err error)
```

req is the request parameter, info contains the request method properties, and handler is the wrapper for the server-side method, which is also called in the interceptor.

zRPC has a rich set of built-in interceptors, including adaptive dowload, adaptive fusion, permission validation, prometheus metrics collection, etc. Due to the large number of interceptors, space is limited to analyze all the interceptors one by one, here we mainly analyze two, adaptive fusion and prometheus service monitoring metrics collection.

#### Built-in interceptor analysis

##### Adaptive fuse (breaker)

When the client initiates a request to the server, the client will record the error returned by the server, and when the error reaches a certain percentage, the client will fuse the process itself, discarding a certain percentage of requests to protect downstream dependencies, and can automatically recover. zRPC adaptive fusion follows the [Google SRE](https://landing.google.com/sre/sre-book/chapters/handling-overload) with the following algorithm for overload protection.

requests: total number of requests

accepts: number of normal requests

K: multiplier (Google SRE recommends 2)

The aggressiveness of the fusion can be modified by changing the value of K. Decreasing the value of K will make the adaptive fusion algorithm more aggressive, and increasing the value of K will make it less aggressive.

The circuit is defined [as follows](https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/clientinterceptors/breakerinterceptor.go):

```go
func BreakerInterceptor(ctx context.Context, method string, req, reply interface{},
	cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
	breakerName := path.Join(cc.Target(), method)
	return breaker.DoWithAcceptable(breakerName, func() error {
		return invoker(ctx, method, req, reply, cc, opts...)
	}, codes.Acceptable)
}
```

The accept method implements the Google SRE overload protection algorithm to determine whether to fuse

```go
func (b *googleBreaker) accept() error {
	 //  Accepts is the number of normal requests, total is the total number of requests
   accepts, total := b.history()
   weightedAccepts := b.k * float64(accepts)
   // Algorithm Implementation
   dropRatio := math.Max(0, (float64(total-protection)-weightedAccepts)/float64(total+1))
   if dropRatio <= 0 {
      return nil
   }
	 // Whether the ratio is exceeded
   if b.proba.TrueOnProba(dropRatio) {
      return ErrServiceUnavailable
   }

   return nil
}
```

`doReq` method first determine whether the fuse, meet the conditions directly return error (circuit breaker is open), does not meet the conditions of the request count to accumulate

```go
func (b *googleBreaker) doReq(req func() error, fallback func(err error) error, acceptable Acceptable) error {
   if err := b.accept(); err != nil {
      if fallback != nil {
         return fallback(err)
      } else {
         return err
      }
   }

   defer func() {
      if e := recover(); e != nil {
         b.markFailure()
         panic(e)
      }
   }()
	
   // RPC requests are executed here
   err := req()
   // Normal requests for both total and accepts will add 1
   if acceptable(err) {
      b.markSuccess()
   } else {
     // Only total will add 1 if the request fails
      b.markFailure()
   }

   return err
}
```

##### prometheus metrics collection

Service monitoring is an important tool to understand the current operation status of the service and the trend of changes, monitoring relies on the collection of service metrics, the collection of monitoring metrics through prometheus is the mainstream solution in the industry, zRPC also uses prometheus to collect the metrics

[prometheus interceptors](https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/serverinterceptors/prometheusinterceptor.go)定义如下：

This interceptor mainly collects the monitoring metrics of the service, here it mainly collects the time consumption and invocation errors of RPC methods, here it mainly uses Prometheus' Histogram and Counter data types

```go
func UnaryPrometheusInterceptor() grpc.UnaryServerInterceptor {
	return func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (
		interface{}, error) {
    // Record a time before execution
		startTime := timex.Now()
		resp, err := handler(ctx, req)
    // After execution, the time taken to execute the call is calculated via Since
		metricServerReqDur.Observe(int64(timex.Since(startTime)/time.Millisecond), info.FullMethod)
    // The error code corresponding to the method
		metricServerReqCodeTotal.Inc(info.FullMethod, strconv.Itoa(int(status.Code(err))))
		return resp, err
	}
}
```

#### Adding Custom Interceptors

In addition to the rich built-in interceptors, zRPC also supports the addition of custom interceptors

The Client side adds a one-dimensional interceptor via the AddInterceptor method.


```go
func (rc *RpcClient) AddInterceptor(interceptor grpc.UnaryClientInterceptor) {
	rc.client.AddInterceptor(interceptor)
}
```

The Server side adds monadic interceptors via the AddUnaryInterceptors method:

```go
func (rs *RpcServer) AddUnaryInterceptors(interceptors ...grpc.UnaryServerInterceptor) {
	rs.server.AddUnaryInterceptors(interceptors...)
}
```

### resolver module

zRPC service registration architecture diagram.
：

![resolver](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/resolver.png)

The resolver module is customized in zRPC to implement the service registration function. zRPC relies on gRPC at the bottom, and to customize resolver in gRPC you need to implement the resolver.Builder interface.

```go
type Builder interface {
	Build(target Target, cc ClientConn, opts BuildOptions) (Resolver, error)
	Scheme() string
}
```

Where the Build method returns the Resolver, the Resolver is defined as follows:

```go
type Resolver interface {
	ResolveNow(ResolveNowOptions)
	Close()
}
```

There are two types of resolver defined in zRPC, direct and discov, here we mainly analyze discov based on etcd to do service discovery, custom resolver needs to be registered through the Register method provided by gRPC code as follows:
```go
func RegisterResolver() {
	resolver.Register(&dirBuilder)
	resolver.Register(&disBuilder)
}
```

When we start our zRPC Server, we call the Start method, which registers the corresponding service address in etcd as follows.

```go
func (ags keepAliveServer) Start(fn RegisterFn) error {
	if err := ags.registerEtcd(); err != nil {
		return err
	}
	return ags.Server.Start(fn)
}
```

When we start the zRPC client, the Build method of our custom resolver is called inside gRPC. zRPC executes the UpdateState method of resolver.ClientConn by calling within the Build method, which registers the service address inside the gRPC client.

```go
func (d *discovBuilder) Build(target resolver.Target, cc resolver.ClientConn, opts resolver.BuildOptions) (
	resolver.Resolver, error) {
	hosts := strings.FieldsFunc(target.Authority, func(r rune) bool {
		return r == EndpointSepChar
	})
	sub, err := discov.NewSubscriber(hosts, target.Endpoint)
	if err != nil {
		return nil, err
	}

	update := func() {
		var addrs []resolver.Address
		for _, val := range subset(sub.Values(), subsetSize) {
			addrs = append(addrs, resolver.Address{
				Addr: val,
			})
		}
		cc.UpdateState(resolver.State{
			Addresses: addrs,
		})
	}
	sub.AddListener(update)
	update()
	return &nopResolver{cc: cc}, nil
}
```

In discov, all addresses of the specified service are retrieved from etcd by calling the load method at:

```go
func (c *cluster) load(cli EtcdClient, key string) {
	var resp *clientv3.GetResponse
	for {
		var err error
		ctx, cancel := context.WithTimeout(c.context(cli), RequestTimeout)
		resp, err = cli.Get(ctx, makeKeyPrefix(key), clientv3.WithPrefix())
		cancel()
		if err == nil {
			break
		}

		logx.Error(err)
		time.Sleep(coolDownInterval)
	}

	var kvs []KV
	c.lock.Lock()
	for _, ev := range resp.Kvs {
		kvs = append(kvs, KV{
			Key: string(ev.Key),
			Val: string(ev.Value),
		})
	}
	c.lock.Unlock()

	c.handleChanges(key, kvs)
}
```

and listens for changes in the service address via watch:

```go
func (c *cluster) watch(cli EtcdClient, key string) {
	rch := cli.Watch(clientv3.WithRequireLeader(c.context(cli)), makeKeyPrefix(key), clientv3.WithPrefix())
	for {
		select {
		case wresp, ok := <-rch:
			if !ok {
				logx.Error("etcd monitor chan has been closed")
				return
			}
			if wresp.Canceled {
				logx.Error("etcd monitor chan has been canceled")
				return
			}
			if wresp.Err() != nil {
				logx.Error(fmt.Sprintf("etcd monitor chan error: %v", wresp.Err()))
				return
			}
			c.handleWatchEvents(key, wresp.Events)
		case <-c.done:
			return
		}
	}
}
```

This part mainly introduces how to customize the resolver in zRPC, as well as the principle of service discovery based on etcd, through this part of the introduction you can understand the principle of service registration and discovery inside zRPC, the source code is more just a rough analysis of the entire process, if you are more interested in the source code of zRPC can learn on their own

### balancer module

Load balancing schematic.

![](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/balancer.png)

Avoiding overload is an important indicator of a load balancing strategy, and a good load balancing algorithm can balance server-side resources well. The commonly used load balancing algorithms are Rotation, Random, Hash, Weighted Rotation, etc. However, in order to cope with various complex scenarios, simple load balancing algorithms often do not perform well enough, such as the round robin algorithm when the service response time becomes longer, it is easy to cause the load to stop balancing, so the default load balancing algorithm P2C (Power of Two Choices) is customized in zRPC, similar to resolver, in order to customize balancer also needs to Builder interface defined by gRPC. Since it is similar to resolver, we will not take you through the analysis of how to customize the balancer.

Note that zRPC is a client-side load balancing, common and through the nginx intermediate proxy way

The default load balancing algorithm in the zRPC framework is P2C, and the main idea of this algorithm is to

1. do two random selection operations from the list of available nodes to get nodes A and B
2. compare the two nodes A and B and select the node with the lowest load as the selected node

The pseudo code is as follows.

![](https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/random_pseudo.png)

The main algorithm logic is implemented in the Pick method.

```go
func (p *p2cPicker) Pick(ctx context.Context, info balancer.PickInfo) (
	conn balancer.SubConn, done func(balancer.DoneInfo), err error) {
	p.lock.Lock()
	defer p.lock.Unlock()

	var chosen *subConn
	switch len(p.conns) {
	case 0:
		return nil, nil, balancer.ErrNoSubConnAvailable
	case 1:
		chosen = p.choose(p.conns[0], nil)
	case 2:
		chosen = p.choose(p.conns[0], p.conns[1])
	default:
		var node1, node2 *subConn
		for i := 0; i < pickTimes; i++ {
			a := p.r.Intn(len(p.conns))
			b := p.r.Intn(len(p.conns) - 1)
			if b >= a {
				b++
			}
			node1 = p.conns[a]
			node2 = p.conns[b]
			if node1.healthy() && node2.healthy() {
				break
			}
		}
		chosen = p.choose(node1, node2)
	}

	atomic.AddInt64(&chosen.inflight, 1)
	atomic.AddInt64(&chosen.requests, 1)
	return chosen.conn, p.buildDoneFunc(chosen), nil
}
```

The choose method compares the loads of randomly selected nodes to determine which node to choose.

```go
func (p *p2cPicker) choose(c1, c2 *subConn) *subConn {
	start := int64(timex.Now())
	if c2 == nil {
		atomic.StoreInt64(&c1.pick, start)
		return c1
	}

	if c1.load() > c2.load() {
		c1, c2 = c2, c1
	}

	pick := atomic.LoadInt64(&c2.pick)
	if start-pick > forcePick && atomic.CompareAndSwapInt64(&c2.pick, pick, start) {
		return c2
	} else {
		atomic.StoreInt64(&c1.pick, start)
		return c1
	}
}
```

The above mainly introduces the design idea and code implementation of the default load balancing algorithm of zRPC, how the custom balancer is registered to gRPC, the resolver provides the Register method to register, the same balancer also provides the Register method to register.

```go
func init() {
	balancer.Register(newBuilder())
}

func newBuilder() balancer.Builder {
	return base.NewBalancerBuilder(Name, new(p2cPickerBuilder))
}
```

How does gRPC know which balancer to use after registering a balancer? Here we need to use the configuration item to configure, through the grpc.WithBalancerName method at the time of NewClient.

```go
func NewClient(target string, opts ...ClientOption) (*client, error) {
	var cli client
	opts = append(opts, WithDialOption(grpc.WithBalancerName(p2c.Name)))
	if err := cli.dial(target, opts...); err != nil {
		return nil, err
	}

	return &cli, nil
}
```

This part mainly introduces the implementation principle of the load balancing algorithm in zRPC and the specific implementation method, and then introduces how zRPC registers the custom balancer and how to choose the custom balancer, through this part you should have a further understanding of load balancing

### Summary

First, the basic usage of zRPC is introduced. You can see that zRPC is very simple to use, and only a few lines of code are needed to build a high-performance RPC service with service governance capabilities.

Next, we introduce several important modules of zRPC and their implementation principles, and analyze some to the source code. The interceptor module is the focus of zRPC, which has a rich set of built-in functions, such as fusion, monitoring, load reduction, etc., which are essential for building highly available microservices. The customization of the load balancing algorithm is no longer a mystery.

Finally, zRPC is an RPC framework that has undergone various engineering practices, and is a rare open source project, whether you want to use it for production or learn the design patterns. We hope you can learn more about zRPC through this article.
