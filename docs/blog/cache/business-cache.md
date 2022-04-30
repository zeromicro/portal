---
title: go-zero cache design for business-level caching
authors: anqiansong
---

# go-zero cache design for business-level caching

In the previous article [go-zero cache design of persistence layer cache](redis-cache) introduced the db layer cache, in retrospect, the main design of the db layer cache can be summarized as follows

* The cache is only deleted and not updated
* Only one row record is always stored, i.e. the primary key corresponds to the row record
* Unique indexes only cache primary key values, not directly cache row records (refer to mysql indexing ideas)
* Anti-cache-pass-through design, default one minute
* No caching of multiple row records

## Preface

In large business systems, by adding cache to the persistence layer, it is believed that the cache can help relieve a lot of access pressure on the persistence layer for most single-row queries, but in actual business, data reading is not just for single-row records.
In addition, for high concurrency scenarios such as spike systems and class selection systems, it is not practical to rely solely on caching in the persistence layer.

## Examples of applicable scenarios

* Course selection system
* Content social system
* Spike ...

In these systems, we can add another layer of cache in the business layer to store key information in the system, such as student selection information and remaining places in the course in the course selection system, and content information between a certain period of time in the content social system.

Next, let's take a content social system as an example.

In the content social system, we usually query a list of content first, and then click on a piece of content to view the details.

Before adding biz cache, the query flow chart of content information should be as follows


![redis-cache-05](../../resource/redis-cache-05.png)

As we know from the diagram and the previous article [go-zero cache design of persistence layer cache](redis-cache), there is no way to rely on the cache for accessing the content list.
If we add a layer of cache at the business layer to store key information (or even complete information) in the list, then access to multiple rows of records is not a problem, and that's what biz redis is going to do. Next, let's look at the design solution, assuming that a single row of records in the content system contains the following fields

|Field|Type|Desc|
|---|---|---|
|id|string|id|
|title|string|title|
|content|string|content|
|createTime|time.Time|create time|

Our goal is to get a list of content, and try to avoid the content list to go db cause access pressure, first we use redis sort set data structure to store, the amount of information in the fields need to be stored, there are two redis storage options.

* cache local information
  
![biz-redis-02](../../resource/biz-redis-02.svg)
for its key segment information (such as: id, etc.) in accordance with certain rules of compression, and storage, score we use `createTime` millisecond value (time value equal here is not discussed), the benefits of this storage scheme is to save redis storage space.
That on the other hand, the disadvantage is the need for a list of detailed content of the second check (but this check is to use the persistence layer of the line record cache)



* Cache full information
  
![biz-redis-01](../../resource/biz-redis-01.svg)
All the content published in accordance with certain rules of compression are stored, the same score we still use `createTime` millisecond value, the benefits of this storage scheme is the business of adding, deleting, checking, changing all go redis, and db layer at this time
On the other hand, the disadvantage is also obvious, the need for storage space, configuration requirements are higher, the cost will also increase.

Example：
```golang
type Content struct {
    Id         string    `json:"id"`
    Title      string    `json:"title"`
    Content    string    `json:"content"`
    CreateTime time.Time `json:"create_time"`
}

const bizContentCacheKey = `biz#content#cache`

func AddContent(r redis.Redis, c *Content) error {
    v := compress(c)
    _, err := r.Zadd(bizContentCacheKey, c.CreateTime.UnixNano()/1e6, v)
    return err
}

func DelContent(r redis.Redis, c *Content) error {
    v := compress(c)
    _, err := r.Zrem(bizContentCacheKey, v)

    return err
}

func compress(c *Content) string {
    // todo: do it yourself
    var ret string
    return ret
}

func unCompress(v string) *Content {
	// todo: do it yourself
	var ret Content
	return &ret
}

func ListByRangeTime(r redis.Redis, start, end time.Time) ([]*Content, error) {
	kvs, err := r.ZrangebyscoreWithScores(bizContentCacheKey, start.UnixNano()/1e6, end.UnixNano()/1e6)
	if err != nil {
		return nil, err
	}

	var list []*Content
	for _, kv := range kvs {
		data:=unCompress(kv.Key)
		list = append(list, data)
	}

	return list, nil
}

```

In the above example, redis is not set to expire, we will add, delete, change and check operations are synchronized to redis, we think the content social system list access request is relatively high case to do such a scheme design.
In addition, there are some data access, not want to content design system so frequently access, may be a certain period of time to access the sudden increase, after which may be a long time to visit again, so that the interval
Or will not visit again, face this scenario, if I and how to consider the design of the cache? In go-zero content practice, there are two options to solve this problem.


* Adding memory cache: The memory cache is used to store the data that may be accessed unexpectedly at present.
  Another option is to use the [Cache](https://github.com/zeromicro/go-zero/blob/master/core/collection/cache.go) in the go-zero library, which is specifically
  for memory management.
* The other solution is to use in the go-zero library, which is dedicated to memory management.

# Summary
The above two scenarios can include most of the multi-line record cache, for multi-line record query volume is not large scenario, for the time being, there is no need to directly put biz redis in, you can first try to let db to take on, developers can be based on persistence layer monitoring and service
The developer can measure the need to introduce biz based on persistence layer monitoring and service monitoring.
