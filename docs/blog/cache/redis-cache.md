# go-zero cache design for persistence layer cache

## Cache design principles

We only delete caches, we don't update them. Once the data in the DB is modified, we delete the corresponding cache directly instead of updating it.

Let's see how to delete the cache in the right order.

* Delete the cache first, then update the DB

![redis-cache-01](../../resource/redis-cache-01.png)

Let's look at the case of two concurrent requests. A requests to update the data and deletes the cache first, then B requests to read the data, at this time the cache has no data, it will load the data from DB and write back to the cache, then A updates the DB, then at this time the data in the cache will remain dirty until the cache expires or there is a new request to update the data. As shown in the figure

![redis-cache-02](../../resource/redis-cache-02.png)

* Update the DB first, then delete the cache

  ![redis-cache-03](. /../resource/redis-cache-03.png)

A request to update the DB first, then B request to read the data, at this time the return is the old data, at this time can be considered as A request has not been updated, the final consistency, can be accepted, and then A deleted the cache, subsequent requests will get the latest data, as shown in the figure
![redis-cache-04](../../resource/redis-cache-04.png)

Let's look at the normal request flow again.

* The first request updates the DB and deletes the cache
* The second request reads the cache and has no data, so it reads the data from the DB and writes it back to the cache
* Subsequent read requests can all read directly from the cache
  ![redis-cache-05](../../resource/redis-cache-05.png)

Let's look at what happens with DB queries, assuming there are seven columns of data in the row record ABCDEFG.

* A request that queries only part of the column data, such as a request for ABC, CDE or EFG among them, as in the figure
  ![redis-cache-06](../../resource/redis-cache-06.png)

* Query a single complete row of records, as shown
  ![redis-cache-07](. /../resource/redis-cache-07.png)

* Query multiple rows of records with some or all columns, as in
  ![redis-cache-08](. /../resource/redis-cache-08.png)

For the above three cases, first, we do not use partial queries because partial queries cannot be cached, and once cached, there is no way to locate what data needs to be deleted once the data is updated; second, for multi-row queries, according to the actual scenario and needs, we will establish the corresponding mapping from query conditions to primary keys in the business layer; and for single-row complete record queries, go-zero has a built-in complete cache management approach. So the core principle is: **go-zero must cache complete row records**.

Let's detail the three built-in cache handling scenarios for go-zero.

* Primary key-based caching
  ```text
  PRIMARY KEY (``id``)
  ```

This is relatively the easiest cache to handle, just use the primary key as the key to cache row records in redis.

* Caching based on unique indexes
  ![redis-cache-09](../../resource/redis-cache-09.webp)

In the database design, if you look up data by index, the engine will first look up the primary key in the index->primary key tree and then look up the row records by the primary key, which introduces an indirect layer to solve the problem of index-to-row record correspondence. The same principle is used in go-zero's cache design.

Index-based caching is divided into single-column unique indexes and multi-column unique indexes.

But for go-zero, single-column and multi-column are just different ways to generate cache keys, the control logic behind them is the same. Then go-zero has built-in cache management to better control data consistency issues, and also built-in to prevent cache breakthroughs, penetrations, and avalanches (these were carefully discussed during the gopherchina conference, see the subsequent gopherchina sharing video).

In addition, go-zero has built-in statistics for cache accesses and access hits, as follows.

```text
dbcache(sqlc) - qpm: 5057, hit_ratio: 99.7%, hit: 5044, miss: 13, db_fails: 0
```

You can see more detailed statistics, so that we can analyze the cache usage. For cases where the cache hit rate is very low or the request volume is very small, we can remove the cache, which can also reduce the cost.

* The single column unique index is as follows.
  ```text
  UNIQUE KEY `product_idx` (`product`)
  ```

* A multi-column unique index is as follows.
  ```text
  UNIQUE KEY `vendor_product_idx` (`vendor`, `product`)
  ```
## Explanation of caching code

### 1. Primary key based caching logic
![redis-cache-10](../../resource/redis-cache-10.png)

The concrete implementation code is as follows.
```go
func (cc CachedConn) QueryRow(v interface{}, key string, query QueryFn) error {
  return cc.cache.Take(v, key, func(v interface{}) error {
    return query(cc.db, v)
  })
}
```

The `Take` method here is to go through the `key` to get the data from the cache first, if you get it, return it directly, if not, then go through the `query` method to the `DB` to read the full row and write it back to the cache, and then return the data. The whole logic is still relatively simple to understand.

Let's look at the implementation of `Take` in detail.

```go
func (c cacheNode) Take(v interface{}, key string, query func(v interface{}) error) error {
  return c.doTake(v, key, query, func(v interface{}) error {
    return c.SetCache(key, v)
  })
}
```

The logic of `Take` is as follows.

* Find the data from the cache using the key
* If found, return the data
* If not found, use the query method to read the data
* After reading, call c.SetCache(key, v) to set the cache

The `doTake` code and explanation are as follows.
```go
// v - The data object to be read
// key - The cache key
// query - The Method used to read complete data from DB
// cacheVal - Thme Method used to write cache
func (c cacheNode) doTake(v interface{}, key string, query func(v interface{}) error,
  cacheVal func(v interface{}) error) error {
  // Use a barrier to prevent cache hitting and ensure that only one request is made to 
  // load the data corresponding to the key within a process
  val, fresh, err := c.barrier.DoEx(key, func() (interface{}, error) {
    // Read data from the cache
    if err := c.doGetCache(key, v); err != nil {
      // If it's a pre-placeholder (to prevent cache penetration), then return the pre-defined errNotFound
      // If it's an unknown error, then return it directly, because we can't just drop the cache error and send all requests to the DB.
      // This will hang the DB in a high concurrency scenario
      if err == errPlaceholder {
        return nil, c.errNotFound
      } else if err != c.errNotFound {
        // why we just return the error instead of query from db,
        // because we don't allow the disaster pass to the DBs.
        // fail fast, in case we bring down the dbs.
        return nil, err
      }

      // Request DB
      // If the returned error is errNotFound, then we need to set the placeholder in the cache to prevent cache penetration
      if err = query(v); err == c.errNotFound {
        if err = c.setCacheWithNotFound(key); err != nil {
          logx.Error(err)
        }

        return nil, c.errNotFound
      } else if err != nil {
        // Statistics DB failure
        c.stat.IncrementDbFails()
        return nil, err
      }

      // Writing data to cache
      if err = cacheVal(v); err != nil {
        logx.Error(err)
      }
    }
    
    // Return json serialized data
    return jsonx.Marshal(v)
  })
  if err != nil {
    return err
  }
  if fresh {
    return nil
  }

  // got the result from previous ongoing query
  c.stat.IncrementTotal()
  c.stat.IncrementHit()

  // Write the data to the incoming v object
  return jsonx.Unmarshal(val.([]byte), v)
}
```

### 2. Caching logic based on unique index
Because this block is more complex, I have marked the response blocks and logic with different colors. `block 2` is actually the same as the primary key-based cache, so here we focus on the logic of `block 1`.
![redis-cache-11](../../resource/redis-cache-11.webp)

The block 1 part of the code block is divided into two cases.

* The primary key can be found from the cache through the index, so the logic of `block 2` will be done directly with the primary key, and the logic of the cache based on the primary key will be followed as above.

* The primary key cannot be found from the cache through the index.
  * Search the complete row from DB by index, if there is `error`, return
  * When the complete row record is found, the cache of primary key to complete row record and index to primary key will be written to `redis` at the same time.
  * Return the required row data
  
```go
// v - The data object to be read
// key - Cache key generated by indexing
// keyer - Method for generating primary key-based cache keys with primary keys
// indexQuery - Method to read complete data from DB with index, need to return primary key
// primaryQuery - Method to get complete data from DB with primary key
func (cc CachedConn) QueryRowIndex(v interface{}, key string, keyer func(primary interface{}) string,
  indexQuery IndexQueryFn, primaryQuery PrimaryQueryFn) error {
  var primaryKey interface{}
  var found bool

  //  First query the cache by index to see if there is a cache of indexes to the primary key
  if err := cc.cache.TakeWithExpire(&primaryKey, key, func(val interface{}, expire time.Duration) (err error) {
    // If there is no index to the primary key cache, then query the complete data by index
    primaryKey, err = indexQuery(cc.db, v)
    if err != nil {
      return
    }

    // The complete data is queried by the index, set found, and used directly later, no need to read data from the cache again
    found = true
    // Save the primary key to complete data mapping to the cache, the TakeWithExpire method already saves the index to primary key mapping to the cache
    return cc.cache.SetCacheWithExpire(keyer(primaryKey), v, expire+cacheSafeGapBetweenIndexAndPrimary)
  }); err != nil {
    return err
  }

  // The data has already been found by the index, just return it
  if found {
    return nil
  }

  // Read data from the cache by primary key, and if the cache doesn't have it, read it from the DB by primaryQuery method and write back to the cache before returning the data.
  return cc.cache.Take(v, keyer(primaryKey), func(v interface{}) error {
    return primaryQuery(cc.db, v, primaryKey)
  })
}
```

Let's look at a practical example
```go
func (m *defaultUserModel) FindOneByUser(user string) (*User, error) {
  var resp User
  // Generate index-based key
  indexKey := fmt.Sprintf("%s%v", cacheUserPrefix, user)
  
  err := m.QueryRowIndex(&resp, indexKey,
    // Generate key for complete data cache based on primary key
    func(primary interface{}) string {
      return fmt.Sprintf("user#%v", primary)
    },
    // Index-based DB query method
    func(conn sqlx.SqlConn, v interface{}) (i interface{}, e error) {
      query := fmt.Sprintf("select %s from %s where user = ? limit 1", userRows, m.table)
      if err := conn.QueryRow(&resp, query, user); err != nil {
        return nil, err
      }
      return resp.Id, nil
    },
    // Primary key-based DB query method
    func(conn sqlx.SqlConn, v, primary interface{}) error {
      query := fmt.Sprintf("select %s from %s where id = ?", userRows, m.table)
      return conn.QueryRow(&resp, query, primary)
    })
  
  // error handling, need to determine whether the return is sqlc.ErrNotFound, if so, we use this package definition of ErrNotFound return
  // Avoid user awareness of whether the cache is being used, and also isolate the underlying dependencies
  switch err {
    case nil:
      return &resp, nil
    case sqlc.ErrNotFound:
      return nil, ErrNotFound
    default:
      return nil, err
  }
}
```

All of the above automatic cache management code is available via [goctl](../../goctl/goctl), and our team's internal `CRUD` and cache are basically generated via [goctl](../../goctl/goctl), which saves a lot of development time, and the cache code itself is very error-prone, and even with good code experience, it's hard to get it right every time, so we recommend using automatic cache code generation tools to avoid errors whenever possible.
