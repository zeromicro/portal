---
title: Load Balancing
slug: /docs/tutorials/service/governance/lb
---

## Overview

Load Balancing is a technology used in distributed systems that enhances the system's performance and reliability by balancing the workloads of different nodes in the system.In the field of computer science, the load balance has become an indispensable technology, especially in the context of Internet applications and data centres, and its application has become more widespread.

In traditional computer systems, an application usually operates only on a single computer.However, as computer technology continues to evolve, distributed systems have been introduced whereby applications are operated on multiple computers in order to improve the system's outreach and reliability.However, the overall performance of the system is reduced because of the potential imbalance in processing capacity and load between the various nodes in the system.In order to address this problem, the burden balancing technology has emerged.

Load balance allows requests to be distributed to different nodes in the system, thus balancing the workloads of nodes.This can be done through different algorithms.For example, an algorithm based on a query distributes requests sequentially to each node, while weight-based algorithms give more requests to nodes with higher weights.There are also more complex algorithms, such as payload balancing methods based on feedback, which adjust the load balance strategy to the actual performance of nodes.

## Common Algorithm

Load equilibrium is an important technology in distributed systems that allows requests to be circulated to different nodes in the system, thus balancing the workloads and improving the performance and reliability of the system.The following is a description of the common load balance method and its achievement.

### Load equilibrium algorithms based on polls

The load-balancing method based on the query is a simple payload balancing method that circulates requests sequentially to each node and repeats the process.This algorithm applies to situations where nodes in the system have the same processing capacity, but in practice improvements are needed as nodes may have different processing capabilities.

### Weight based load balance algorithm

The weight-based load balancing method is an algorithm that takes into account the ability of nodes to process and assigns requests to nodes with higher weight.The weight can be set according to the processing capacity of the node.For example, more capable nodes can handle more requests by setting a higher weight.

### Load equilibrium algorithm based on minimum connections

Load Balancers, based on minimum connections, are an algorithm that takes into account the load of nodes and assigns requests to the least connected node.This algorithm is applicable to applications scenes with longer connections, as the peers with longer connections may affect the number of connections to other nodes.

### Load equilibrium algorithm based on IP hash

The payload balance based on IP hash is an algorithm for distribution based on the requested source IP address.It hash the requested source IP address and assign the request to the corresponding node based on hash results.This algorithm ensures that requests from the same IP address are assigned to the same node, thereby maintaining consistency in the session.

### P2C（Power of Two Choices）

The P2C (Power of Two Choices) algorithm, a randomized load balancing method, was proposed by Jeff Dean and Luiz Andre Barroso in 2001.

The P2C algorithm is an improved random algorithm that avoids the worst selection and load imbalances.The core idea of the P2C algorithm is：to select two nodes randomly from all available nodes and then select a less loaded node based on the load of these two nodes.The advantage of doing so is that if only one node is randomly selected, it may be selected to higher load nodes, leading to a load imbalance, while two nodes can be compared to avoid the worst selection.

Specifically, the P2C algorithm implements the following：

1. Sort all available nodes by load size, from small to size.
2. Select two nodes randomly.
3. Select the less loaded nodes in two nodes as the nodes selected by the load balancer. The advantage of the P2C algorithm is that it can increase the performance and reliability of the system by selecting smaller nodes with a guaranteed load balance.In addition, the simple implementation of the P2C algorithm does not require much computing and storing resources and is therefore widely used in practical applications.

***Summary***

These load balances have their respective advantages and disadvantages and require the selection of appropriate algorithms in practical applications based on specific scenarios.In addition, the achievement of the load balance can be achieved in different ways such as hardware load balancers, software load balancers or DNS load balancers.Among them, the hardware load balancers have the advantages of high performance, reliability and flexibility, but they are costly; the software load balancers have the advantages of flexibility and customizability, but performance may be low; the DNS load balancer can assign requests to different nodes based on domain name resolution, but there may be problems with DNS cache.

## Practise

In go-zero, the load balance method is mainly applied to the client of the gRPC and is used to distribute requests to different gRPC servers, using P2C algorithms. See <a href="https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/balancer/p2c/p2c.go" target="_blank">p2c.go for more information</a>

## References

- <a href="https://github.com/zeromicro/go-zero/blob/master/zrpc/internal/balancer/p2c/p2c.go" target="_blank">go-zero • p2c</a>
