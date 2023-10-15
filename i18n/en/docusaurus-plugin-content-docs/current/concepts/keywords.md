---
title: Introduction to the keywords
slug: /docs/concepts/keywords
---

## Overview

In development, we often refer to terms such as “monolithic”, “microservice”, “API”, “gRPPC”, “gRPC stub”, “Protobuf”, “rest”, “load balance” and “service discovery”, which will also be frequently mentioned in the follow-up files to ensure that there are initial concepts of those terms, we will describe some high-frequency terminology.

## Monolithic

A monolithic application refers to a single layer of applications, whose user interface and data access are integrated into a single system platform.

Single applications can operate independently and will not be affected by other applications.Its design is that the application is not solely responsible for a single task but is responsible for all the steps required to complete a particular function.Like some of the current personal financial management software, it is a monolithic application that allows users to perform a single mission in an end-to-end manner, and similar information chimneys are not part of a large application.Some text processors also belong to a monolithic application[2].Sometimes these applications are used on large computers.

In software engineering, monolithic applications are those that do not take into account modular source requests when designed.The software is generally expected to have modular features, as part of the application logic can be reverted and only a portion of the application can be replaced while maintaining it without changing the whole application.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E5%96%AE%E9%AB%94%E5%BC%8F%E6%87%89%E7%94%A8%E7%A8%8B%E5%BC%8F" target="_blank">Wikipedia Monolithic Application</a>

## Microservices

Microservices are a software architecture style based on small functional blocks focused on a single responsibility and function (Sall Building Blocks) that combine complex large applications using a modular approach and intercommunication between functional blocks using APIs that do not have language (Language-Independent/Language agnostic).This design is implemented in the HP Lab with a powerful power to change complex software systems.

Another comparison of microservices is a monolithic application.The monolithic app indicates that an application contains all required business features and is implemented in a main custom architecture (Client/Server) or multi-layer architecture (EnglishMultitier Architecture) (N-tier). While it can also be implemented in distributed applications, each business function is inseparable within a single system application.Expansion of monolithic applications requires the entire application to be placed in a new operating resource (e.g.：VMs), but in fact there is only one business component (e.g. run-off analysis report or mathematical algorithm) that consumes the most of the resources in the application but because monolithic applications cannot separate the component, there is a large amount of waste of resources in the invisible.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E5%BE%AE%E6%9C%8D%E5%8B%99" target="_blank">《Wikipedia • Microservice》</a>

## API

Application interface abbreviated to API is a computational interface that defines interactions between multiple software intermediaries, and types of calls (call) or requests that can be made, how to make calls or requests, the data format to be used, the practices to be followed, etc.It can also provide extension mechanisms that allow users to extend existing features to varying degrees by.An API can be fully customized, for a component or designed based on industry standards to ensure interoperability.Through information hidden, the API implements modular programming that allows users to use interfaces independently.

For more information see <a href="https://zh.wikipedia.org/zh-cn/%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F%E6%8E%A5%E5%8F%A3" target="_blank">《Wikipedia • Application Interfaces》</a>

## gRPC

gRPC (gRPC Remote Procedure Calls) is a remote remote application (Remote Procedure call) system initiated by Google.The system is based on HTTP/2 protocol and uses Protocol Buffers as an interface to describe the language.

Other features：

- Authorization
- Bidirectional stream
- Stream Control
- Timeout
- The most common application scenario is：

Effective interaction between multilingual services under the microservice framework. Connect the phone service and browser to the background to generate efficient client libraries

For more information see <a href="https://zh.wikipedia.org/zh-sg/GRPC" target="_blank">《Wikipedia• gRPC》</a>

## Protocol Buffers

Protocol Buffers (abbreviated：ProtoBuf) is a protocol to serialize data structures across open source platforms.It is useful for the process of storing information or communicating on the Internet.This method includes an interface that describes language, describes some data structures and provides a program tool that generates code based on these descriptions that will be used to generate or parse byte streams representing these data structures.

For more information see <a href="https://zh.wikipedia.org/zh-sg/Protocol_Buffers" target="_blank">《Wikipedia• Protocol Buffers》</a>

## RESTful API

Representation State Transfer, abbreviation: REST is a web-based software architecture style introduced by Dr. Roy Thomas Fielding in his doctoral thesis in 2000 to facilitate the transmission of information among different software/programs in networks (e.g. Internet).The performance state conversion is a set of constraints and attributes based on the hypertext transfer protocol (HTTP), a software construction style designed to provide web services.A network service that conforms or is compatible with this architecture style (called REST or RESTful) allows clients to make requests for a unified resource identifier to access and operate network resources, consistent with pre-defined statelessness operators.The performance shift thus provides the collaborative nature (interoperability) of the resources interchangeable between the computing systems of the internet.In comparison with other types of network services, such as SOAP services, access to resources on the network is provided through the set of operations defined by itself.

There are currently three mainstream web service delivery schemes, as the REST model is more concise than the complex SOAP and XML-RPC, and a growing number of web services are beginning to be designed and implemented using REST style.For example, Amazon.com provides an implementation book query for Web services close to REST style; Yahoo! Web services are also REST style.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E8%A1%A8%E7%8E%B0%E5%B1%82%E7%8A%B6%E6%80%81%E8%BD%AC%E6%8D%A2" target="_blank">《Wikipedia • REST》</a>

## ETCD

The etcd is a highly consistent distribution key storage, which provides a reliable way to store data that need to be accessed by distribution systems or machine clusters.It handles leadership elections elegantly during network partition and can tolerate machine failures, even in the leader's node.

FFor more information see <a href="https://etcd.io/" target="_blank">《etcd》</a>

## Nacos

Service is a first class citizen of the Nacos world.Nacos supports the discovery, configuration and management of almost all mainstream types. Key features of Nacos include:

- Service discovery and service health monitoring
- Dynamic Configuration Service
- Dynamic DNS services
- Services and Metadata Management

For more information see <a href="https://nacos.io/zh-cn/docs/what-is-nacos.html" target="_blank">《Nacos》</a>

## Service Discovery

Service discovery is automatic detection of equipment within a computer network and the services it provides.Service Discovery protocol helps to discover network transfer protocols for services.The purpose of the service discovery is to reduce negative configuration for the user.

Service discovery usually requires a common language to help users access another service via the software agent (softwareagents) without a user calling itself.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E6%9C%8D%E5%8A%A1%E5%8F%91%E7%8E%B0" target="_blank">《Wikipedia• Service Discovery》</a>

## Load Balance

Load balance is a computer technology that allocates load to multiple computers (computer clusters), network connections, CPU, disk drives or other resources for the purpose of optimizing the use of resources, maximizing throughput, minimizing response time, while avoiding overload. Use multiple server components with load balances to replace a single component can improve reliability through redundancy.Load balancing services are usually performed by specialized software and hardware. The main role is to rationally distribute large amounts of operations across multiple operational modules to address high and high availability issues in the Internet architecture.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E8%B4%9F%E8%BD%BD%E5%9D%87%E8%A1%A1" target="_blank">《Wikipedia • Load Balancing》</a>

## Gateway

The gateway is a server that transmits communications data from other servers, and it handles requests like a source server that has its own resource.Sometimes clients may not detect and their own communication targets are a gateway.

Distinguished from routers (many documents relating to TCP/IP used to refer to the network layer (English：Router) as gateways, which are used today in many local area networks as routes to access the network, so the usual gateways are router IPs), often used in households or in small enterprise networks to connect to the local area network and the Internet.

Gateway also often refers to equipment that transforms one protocol into another, such as a voice gateway.

In the traditional TCP/IP terminology, network equipment is divided into two categories, one gateway and the other host (host).Gateway can transfer packets between networks, but the host cannot transfer packets.In hosts (also known as terminal systems, end system), packets are processed through the TCP/IP four-tiered agreement, but can be transferred when the gateway (also known as the intermediary system, intermediate system) reaches the Internet layer only and decides the path.At that time, there was no difference between gateway and router (router).

In modern network terminology, gateway and router are defined differently.Gateway (gateway ) can move information between different agreements, while routers (router) are mobile between different networks equivalent to the traditionally referred IP gateway gateway.

The gateway, by definition, is a device connected to both networks. For the gateway, he can connect to PSTN and Ethernet, which is equivalent to VOIP, convert analogue signals from different phones into digital signals via gateways and join the protocol to retransmit them.Revert analogue telephone signals via gateways when they reach the receiving end before they can be heard on the phone.

This is the same as the route for gateways in the Ethernet to relay only three layers of data packages.By contrast, there are no routing tables in the gateway, which can only be forwarded according to the different segments prescribed.The most important aspect of the gateway is port mapping, where the user in the subnet appears to be an IP address of the extranet that corresponds to different ports, which appears to protect the user in the subnet.


For more information see <a href="https://zh.wikipedia.org/zh-sg/%E7%BD%91%E5%85%B3" target="_blank">《Wikipedia • Gateway》</a>

## SOA Governance

SOA governance (Service-Oriented Architecture (SOA) governance) refers to activities related to the implementation of control over services in the service-oriented structure.SOA governance can be seen as a subset of IT governance, which in turn is a subset of corporate governance.SOA governance focuses mainly on how resources can be used to bring value to business.SOA requires many IT support processes and many organizational processes involving business leaders.Service-oriented structures require a solid foundation based on standards and including strategies, contracts and service-level agreements.Through the use of services, businesses want to be able to quickly build and change organizational business processes.In order to achieve agility, services of the usable crude and fine particle levels are required.As a result, a service-oriented architecture has increased the need for good governance, which will help to allocate decision-making authority, roles and responsibilities and focus attention on the organizational capacity needed to succeed.

For more information see <a href="https://zh.wikipedia.org/zh-sg/SOA%E6%B2%BB%E7%90%86" target="_blank">《Wikipedia• SOA Governance》</a>

## Transactions

Database service (abbreviated: transactions) is a logical unit in the implementation of the database management system and consists of a limited database operating sequence.

Database services typically include a sequence of read/write actions to the database.Include the following two purposes：

The database operation sequence is provided with a method of restoring normal status from failure and a method of maintaining consistency in the database even under exceptional circumstances. When multiple applications have concurrent access to the database, they can provide an isolation method between these applications to prevent interferes between their operations. When a transaction is submitted to the Database Management System (DBMS), DBMS needs to ensure that all operations in the transaction are successfully completed and the results are permanently stored in the database. If some operations in the transaction are not successfully completed, all operations in the transaction need to be rolled back, back to the pre-execution status of the transaction and, at the same time, the transaction has no effect on the database or other transaction execution. All transactions are run independently.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E6%95%B0%E6%8D%AE%E5%BA%93%E4%BA%8B%E5%8A%A1" target="_blank">《Wikipedia • Database Transactions》</a>

## Health Check

Health examinations are a common model in the distribution system, which examines examples of services by means of health inspection components, health inspection units examine examples of services through health examination algorithms, and common health examination algorithms include heart examination, health examination, health examination, health examination, etc.

## Service Authentication

Authentication is also referred to as “authentication”, “authentication”, “authentication” and “authentication”, which means the confirmation of user identity by means of a certain means.

The purpose of authentication is to identify the user who is currently claiming to be an identity and indeed the user claimed.In everyday life, identification is not unusual; for example, by checking the documents of the other party, we can generally be sure of the identity of the other.While this recognition of the identity of the other party in daily life also falls into the broad sense of “authentication”, the term “authentication” is used more frequently in areas such as computers, communications, etc.

There are a number of authentication methods that are basically split into：based on shared keys, biometric-based authentication, and based on public key encryption algorithms.There are also high levels of security in different authentication methods.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81" target="_blank">《Wikipedia • Authentication》</a>

## Message queue

The message queue is a form of communication between processes or between different threads of the same process. The software store is used to handle a series of inputs, usually from users.The message queue provides an asynchronous communication protocol in which records in each store include detailed information, including when they occurred, type of input equipment and specific input parameters, sender and recipient of：messages do not need to interact with the message queue at the same time.The message will be saved in the queue until the recipient retrieves it.

For more information see <a href="https://zh.wikipedia.org/zh-sg/%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97" target="_blank">《Wikipedia • Message Queue》</a>

## References

- <a href="https://weread.qq.com/web/bookDetail/42932ba07195510b429d842" target="_blank">Service Mesh Microservice Architecture Design</a>