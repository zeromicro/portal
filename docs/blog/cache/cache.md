---
title: DB caching mechanism
authors: kevwan
---

# DB caching mechanism

## QueryRowIndex

* No query criteria to Primary mapping cache
  * Goes to DB for row records via query criteria, then
    * ** write the cache of Primary to row records to redis **
    * ** save the query condition to Primary mapping to redis ** and * the framework's Take method does it automatically *
  * possible expiration order
    * Query condition to Primary mapping cache not expired
      * Primary to row record cache not expired
        * Direct return of cached row records
      * Primary to row record cache is expired
        * Get row records from Primary to DB and write to cache
          * The problem at this point is that the cache of the query condition to Primary may be about to expire, and a query within a short time will trigger another database query
          * To avoid this problem, you can make the **bold part above** the first expiration time slightly longer than the second, for example, 5 seconds
    * The cache of the query condition to Primary mapping has expired, regardless of whether the cache of Primary to row records has expired
      * The query condition to Primary mapping is re-fetched, and the new Primary to row record cache is automatically written during the fetching process, so that the expiration time for both caches is just set
* Cache with query condition to Primary mapping
  * Cache without Primary to row record
    * Query to row records via Primary to DB and write to cache
  * Cache with Primary to row records
    * Return cached results directly
