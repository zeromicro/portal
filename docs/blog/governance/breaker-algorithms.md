# Fusing Principle and Implementation

For example, if the review service depends on the audit service and the audit service depends on the anti-spam service, when the review service calls the audit service, the audit service calls the anti-spam service, and the anti-spam service times out, the audit service logic waits because the audit service depends on the anti-spam service and the anti-spam service times out, and the review service keeps calling the audit service. service, the review service may be down due to a large number of requests piling up

![call_chain](../../resource/call_chain.png)

As you can see, an exception in the middle of the entire call chain can cause a number of problems in the upstream call service, and even cause the entire call chain to go down, which is very scary. Therefore, when a service calls another service as the caller, in order to prevent problems with the called service, which in turn leads to problems with the calling service, so the calling service needs to protect itself, and the common means of protection is ***fuse***

### Fuse principle

The fuse mechanism is actually a reference to the protection mechanism of fuses in our daily life. When the circuit is overloaded, the fuse will automatically break, thus ensuring that the electrical appliances in the circuit are not damaged. The fuse mechanism in service governance refers to the fact that when a service call is initiated, if the error rate returned by the called party exceeds a certain threshold, then subsequent requests will not really be initiated, but the error will be returned directly by the calling party.

In this model, the service caller maintains a state machine for each invoked service (invocation path), in which there are three states.

- Closed: In this state, we need a counter to record the number of failed calls and the total number of requests, if the failure rate reaches a preset threshold within a certain time window, it switches to the disconnected state, which opens a timeout, and when it reaches that time it switches to the semi-closed state, the timeout is to give the system a chance to fix the errors that caused the call to fail The timeout is to give the system a chance to correct the error that caused the call to fail, in order to return to the normal working state. In the closed state, call errors are time-based and reset at specific intervals, which prevents accidental errors from causing the fuse to go into a disconnected state
- Open (Open): In this state, the request will immediately return an error, and will generally start a timeout timer, when the timer times out, the state switches to half-open state, you can also set a timer to periodically detect whether the service is restored
- Half-Open (Half-Open): In this state, the application is allowed to send a certain number of requests to the called service, if these calls are normal, then the called service can be considered to have returned to normal, when the fuse switches to the closed state, while the need to reset the count. If this part still has calls that fail, the called party is still considered not to have recovered and the fuser switches to the closed state and then resets the counter. The half-open state can effectively prevent a service that is recovering from being broken again by a sudden large number of requests

![breaker_state](../../resource/breaker_state.png)

The introduction of fusing in service governance makes the system more stable and resilient, provides stability while the system recovers from errors, and reduces the impact of errors on system performance by quickly rejecting service calls that could lead to errors without waiting for the actual error to return

### Fuse introduction

The above describes the principle of fuses, after understanding the principle, have you thought about how we can introduce fuses? One option is to include fuses in the business logic, but obviously it is not elegant or generic enough, so we need to integrate fuses within the framework, which is built into the [zRPC](https://github.com/zeromicro/go-zero/tree/master/zrpc) framework

We know that the fuse is mainly used to protect the caller, the caller needs to go through the fuse first when initiating a request, and the client-side interceptor has just this function, so the fuse is implemented in the zRPC framework within the client-side interceptor, the principle of the interceptor is as follows.

![interceptor](../../resource/interceptor.png)

The corresponding code is

```go
func BreakerInterceptor(ctx context.Context, method string, req, reply interface{},
	cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts . . grpc.CallOption) error {
  // Fuse based on request method
	breakerName := path.Join(cc.Target(), method)
	return breaker.DoWithAcceptable(breakerName, func() error {
    // Really initiate the call
		return invoker(ctx, method, req, reply, cc, opts...)
    // codes.Acceptable determines what kind of error to add to the fused error count
	}, codes.Acceptable)
}
```

### Fuse implementation

The fuse implementation in zRPC is referenced from [Google Sre Overload Protection Algorithm](https://landing.google.com/sre/sre-book/chapters/handling-overload/#eq2101), which is based on the following principles.

- Number of requests (requests): the sum of the number of requests initiated by the caller
- number of requests accepted (accepts): the number of requests normally processed by the caller

Under normal circumstances, these two values are equal, and as the called party's service starts to reject requests with exceptions, the value of accepts starts to gradually become smaller than the number of requests, at which point the caller can continue to send requests until requests = K * accepts, and once this limit is exceeded, the fuse is turned back on and new requests will be discarded locally with a certain probability of returning errors directly, the probability is calculated as follows.

![client_rejection2](../../resource/client_rejection2.png)

By modifying the K(multiplier) in the algorithm, the sensitivity of the fuser can be adjusted, when decreasing the multiplier will make the adaptive fusing algorithm more sensitive, when increasing the multiplier will make the adaptive fusing algorithm less sensitive, for example, suppose that the upper limit of the caller's requests is adjusted from requests = 2 * acceptst to requests = 1.1 * accepts then it means that one out of every ten requests from the caller will trigger the fuse

The code path is go-zero/core/breaker

```go
type googleBreaker struct {
	k float64 // multiplier default 1.5
	stat *collection.RollingWindow // sliding time window, used to count failed and successful requests
	proba *mathx.Proba // dynamic probability
}
```

Adaptive fusion algorithm implementation

```go
func (b *googleBreaker) accept() error {
	accepts, total := b.history() // number of requests accepted and total number of requests
	weightedAccepts := b.k * float64(accepts)
  // Calculate the probability of dropping a request
	dropRatio := math.Max(0, (float64(total-protection)-weightedAccepts)/float64(total+1))
	if dropRatio <= 0 {
		return nil
	}
	// dynamically determine if the fuse is triggered
	if b.proba.TrueOnProba(dropRatio) {
		return ErrServiceUnavailable
	}

	return nil
}
```

The doReq method is called each time a request is initiated. In this method, it is first validated by accept whether the fuse is triggered. acceptable is used to determine which errors count towards the failure count and is defined as follows.

```go
func Acceptable(err error) bool {
	switch status.Code(err) {
	case codes.DeadlineExceeded, codes.Internal, codes.Unavailable, codes.DataLoss: // exception request error
		return false
	default:
		return true
	}
}
```

If the request is normal, the number of requests and the number of requests accepted will be added by one by markSuccess, if the request is not normal, only the number of requests will be added by one

```go
func (b *googleBreaker) doReq(req func() error, fallback func(err error) error, acceptable Acceptable) error {
	// Determine if the fuse is triggered
  if err := b.accept(); err ! = nil {
		if fallback ! = nil {
			return fallback(err)
		} else {
			return err
		}
	}

	defer func() {
		if e := recover(); e ! = nil {
			b.markFailure()
			panic(e)
		}
	}()
	
  // Execute the real call
	err := req()
  // Normal request count
	if acceptable(err) {
		b.markSuccess()
	} else {
    // abnormal request count
		b.markFailure()
	}

	return err
}
```

### Summary

The caller can use the fuse mechanism for self-protection to prevent the call to the downstream service exceptions, or take too long to affect the business logic of the caller, many full-featured microservices framework will be built-in fuse. In fact, not only between the microservice calls need to fuse, when calling dependent resources, such as mysql, redis, etc. can also introduce the fuse mechanism.


