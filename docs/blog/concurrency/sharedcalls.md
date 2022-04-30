# SharedCalls

go-zero microservices framework provides a lot of out-of-the-box tools, good tools not only to improve the performance of the service but also to improve the robustness of the code to avoid errors, to achieve a unified style of code for others to read and so on.

This article is about the in-process shared calls magic tool [SharedCalls](https://github.com/zeromicro/go-zero/blob/master/core/syncx/sharedcalls.go).

## Usage Scenarios

In a concurrency scenario, there may be multiple threads (concurrent threads) requesting the same resource at the same time. If each request has to go through the resource request process, in addition to being inefficient, it will also cause concurrency pressure on the resource service. For example, if the cache is invalidated and multiple requests arrive at the same time to request a resource, the resource has been invalidated in the cache, these requests will continue to access the DB to do queries, which will cause an instant increase in database pressure. The use of SharedCalls can make multiple requests at the same time only need to initiate a call to get the result, and other requests "sit and enjoy", this design effectively reduces the concurrent pressure of resource services, and can effectively prevent cache breakdown.

In a high concurrency scenario, when a hotkey cache is invalidated, multiple requests will load the resource from the database and save it to the cache at the same time, which may cause the database to be killed directly if no precautions are taken. For this scenario, the implementation has been provided in the go-zero framework, see [sqlc](https://github.com/zeromicro/go-zero/blob/master/core/stores/sqlc/cachedsql.go) and [mongoc]( https://github.com/zeromicro/go-zero/blob/master/core/stores/mongoc/cachedcollection.go) and other implementation code.

To simplify the demo code, we simulate the caching scenario by multiple threads going to fetch an id at the same time. As follows.

```go
func main() {
  const round = 5
  var wg sync.WaitGroup
  barrier := syncx.NewSharedCalls()

  wg.Add(round)
  for i := 0; i < round; i++ {
    // Multiple threads executing simultaneously
    go func() {
      defer wg.Done()
      // As you can see, multiple threads go to request resources on the same key, and the actual function to get the resource will only be called once
      val, err := barrier.Do("once", func() (interface{}, error) {
        // sleep 1 second, in order to allow multiple threads to fetch the data on the key once at the same time
        time.Sleep(time.Second)
        // A random id is generated
        return stringx.RandId(), nil
      })
      if err != nil {
        fmt.Println(err)
      } else {
        fmt.Println(val)
      }
    }()
  }

  wg.Wait()
}
```

Run and print the result as:

```
837c577b1008a0db
837c577b1008a0db
837c577b1008a0db
837c577b1008a0db
837c577b1008a0db
```

It can be seen that as long as the request is initiated at the same time on the same key, it will share the same result, which is particularly useful for scenarios such as getting DB data into the cache, and can effectively prevent cache hitting.

## Key source code analysis

- SharedCalls interface Provides abstraction of both Do and DoEx methods

  ```go
  // SharedCalls Provides abstraction of both Do and DoEx methods
  type SharedCalls interface {
    Do(key string, fn func() (interface{}, error)) (interface{}, error)
    DoEx(key string, fn func() (interface{}, error)) (interface{}, bool, error)
  }
  ```

- SharedCalls interface specific implementation of sharedGroup

  ```go
  // call represents a single request for a specified resource
  type call struct {
    wg  sync.WaitGroup  // Used to coordinate resource sharing between requesting goroutines
    val interface{}     // Used to save the return value of the request
    err error           // Used to save the errors that occurred during the request
  }
  
  type sharedGroup struct {
    calls map[string]*call
    lock  sync.Mutex
  }
  ```

- sharedGroup的Do方法

  - key parameter: can be interpreted as a unique identifier for the resource.
  - fn parameter: the real method to get the resource.
  - Processing analysis.

  ```go
  // When multiple requests use the Do method to request resources at the same time
  func (g *sharedGroup) Do(key string, fn func() (interface{}, error)) (interface{}, error) {
    // Lock
    g.lock.Lock()
  
    // According to the key, get the result of the corresponding call, and save it with the variable c
    if c, ok := g.calls[key]; ok {
      // After getting the call, release the lock, where the call may not have actual data yet, but just an empty memory placeholder
      g.lock.Unlock()
      // Call wg.Wait to determine if another goroutine is requesting resources, if it blocks, it means that another goroutine is getting resources
      c.wg.Wait()
      // When wg.Wait is no longer blocking, it means the resource acquisition is finished and the result can be returned directly
      return c.val, c.err
    }

    // If you don't get the result, you call the makeCall method to get the resource, note that it is still locked here to ensure that only one goroutine can call makecall
    c := g.makeCall(key, fn)
    // Return the result of the call
    return c.val, c.err
  }
  ```
  
- DoEx method of sharedGroup

  - Similar to the Do method, except that a boolean value is added to the return value to indicate whether the value was obtained directly by calling the makeCall method, or whether it was taken from a shared result

  ```go
  func (g *sharedGroup) DoEx(key string, fn func() (interface{}, error)) (val interface{}, fresh bool, err error) {
    g.lock.Lock()
    if c, ok := g.calls[key]; ok {
      g.lock.Unlock()
      c.wg.Wait()
      return c.val, false, c.err
    }

    c := g.makeCall(key, fn)
    return c.val, true, c.err
  }
  ```

- makeCall method of sharedGroup

  - This method is called by the Do and DoEx methods and is the method that actually initiates the resource request.
  
  ```go
  // There must be only one goroutine that enters the makeCall, because it has to be locked with a lock
  func (g *sharedGroup) makeCall(key string, fn func() (interface{}, error)) *call {
    // Create a call structure to hold the results of this request
    c := new(call)
    // wg plus 1, used to notify other goroutines requesting resources to wait for the end of this resource acquisition
    c.wg.Add(1)
    // Put the call used to save the result into the map for other goroutines to get it
    g.calls[key] = c
    // Release the lock so that other requesting goroutines can get the memory placeholder for the call
    g.lock.Unlock()
  
    defer func() {
      // delete key first, done later. can't reverse the order, because if reverse,
      // another Do call might wg.Wait() without get notified with wg.Done()
      g.lock.Lock()
      delete(g.calls, key)
      g.lock.Unlock()

      // Call wg.Done to notify other goroutines that results can be returned, so that all requests in this batch complete the sharing of results
      c.wg.Done()
    }()
  
    // Call the fn method and fill the result in the variable c
    c.val, c.err = fn()
    return c
  }
  ```

## Finally

This article mainly introduces the SharedCalls tool in go-zero framework, and does a simple sorting out of its application scenarios and key codes, hope this article can bring you some gains.
