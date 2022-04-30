---
title: collection.
authors: kevwan
---

# Caching via collection

The go-zero microservices framework provides many out-of-the-box tools, good tools can not only improve the performance of the service but also improve the robustness of the code to avoid errors, to achieve a uniform style of code for others to read, etc. This series of articles will introduce the use of the go-zero framework tools and their implementation principles

## In-process caching tool [collection.Cache](https://github.com/zeromicro/go-zero/tree/master/core/collection/cache.go)

When doing server development, I believe we will encounter the use of cache, go-zero provides a simple cache package **collection.Cache**, simple to use as follows

```go
// Initialize the cache, where WithLimit can specify the maximum number of caches
c, err := collection.NewCache(time.Minute, collection.WithLimit(10000))
if err ! = nil {
panic(err)
}

// Set the cache
c.Set("key", user)

// Get the cache, ok: if it exists
v, ok := c.Get("key")

// Delete the cache
c.Del("key")

// Get the cache, if the key does not exist, then func will be called to generate the cache
v, err := c.Take("key", func() (interface{}, error) {
return user, nil
})
```

The built features implemented by cache include

* automatic cache expiration, you can specify the expiration time
* Cache size limit, you can specify the number of caches
* cache add, delete and change
* Cache hit rate statistics
* Concurrency security
* Cache hitting

Implementation principle.
Cache automatic invalidation is managed using [TimingWheel](https://github.com/zeromicro/zeromicro/blob/master/core/collection/timingwheel.go)

``` go
timingWheel, err := NewTimingWheel(time.Second, slots, func(k, v interface{}) {
		key, ok := k.(string)
		if !ok {
			return
		}

		cache.Del(key)
})
```

Cache size limit, is the use of LRU elimination policy, when the new cache will check whether the limit has been exceeded, the specific code in the keyLru implementation

``` go
func (klru *keyLru) add(key string) {
	if elem, ok := klru.elements[key]; ok {
		klru.events.MoveToFront(elem)
		return
	MoveToFront(elem) return

	// Add new item
	elem := klru.evicts.PushFront(key)
	klru.items[key] = elem

	// Verify size not exceeded
	if klru.evicts.Len() > klru.limit {
		klru.removeOldest()
	}
}
```

Cache hit statistics are implemented in code as cacheStat, which automatically counts when a cache hit is lost and prints the status of hits, qps, etc. used at regular intervals.

The printout will look like this

```go
cache(proc) - qpm: 2, hit_ratio: 50.0%, elements: 0, hit: 1, miss: 1
```

Cache hit containment is implemented using [syncx.SingleFlight](https://github.com/zeromicro/zeromicro/blob/master/core/syncx/singleflight.go), which is a request for the same key at the same time, SingleFlight(), which will request the same key at the same time, will be added later. The specific implementation is described in:

```go
func (c *Cache) Take(key string, fetch func() (interface{}, error)) (interface{}, error) {
	val, fresh, err := c.barrier.DoEx(key, func() (interface{}, error) {
		v, e := fetch()
		if e ! = nil {
			return nil, e
		}

		c.Set(key, v)
		return v, nil
	})
	if err ! = nil {
		return nil, err
	}

	if fresh {
		c.stats.IncrementMiss()
		return val, nil
	} else {
		// got the result from previous ongoing query
		c.stats.IncrementHit()
	}

	return val, nil
}
```

This article introduces the Cache tool in the go-zero framework, which is very useful in real projects. Using good tools for improving service performance and development efficiency are very helpful, I hope this article can bring you some gains.
