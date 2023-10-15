---
title: Distributed transaction
sidebar_label: Distributed transaction
slug: /docs/tutorials/mysql/distribute/transaction
---

## Overview

In the microservice architecture, when we need cross-service to ensure data consistency, the original database service cannot be used to place cross-library and multiple service operations in a single transaction.There are many applications like this, we can list many：

- Order system：requires a guarantee that both orders and deductions are created or rolled back at the same time
- Cross-line transfer scenario：data is not in a database, but either the balance deduction and the balance increase are successful or failed at the same time.
- Redeem Scene：requires both credit deductions and interest increases to be successful, or failed at the same time.
- Ticket ticket scenario：requires a few tickets at the same time as a third party system, either successfully or canceled all

Faced with scenarios where these local services cannot be solved, we need distributive services solutions that ensure consistency between cross-service and database updates.

## Solution

go-zero joined [dtm](https://github.com/dtm-labs/dtm) to launch a very simple programme of seamless access to dtm in go-zero, the first microservice framework in go ecology to provide distributive services.The solution has the following features：

- dtm services can be configured to register directly to go-zero
- go-zero can access dtm servers in built-in target format
- dtm is able to recognize go-zero target format and access the service in go-zero dynamically

For more information about access, see dtm document：[ go-zero support](https://dtm.pub/ref/gozero.html)

## More Use Cases

dtm can solve not only the distribution service scenario above but also more data consistency scenarios, including：

- Database compatibility with cache： dtm second phase messages that guarantee database updates, and cache update/delete operations
- The second kill system： dtm is capable of securing the second kill scenario, creating orders that are exactly the same as the stock deduction, without subsequent manual calibration
- Multiple storage combinations： dtm support multiple storages, such as databases, Redis, Mongo and others, which can be grouped into a global issue to ensure data consistency

For more dtm abilities and descriptions, see[ dtm ](https://github.com/dtm-labs/dtm)
