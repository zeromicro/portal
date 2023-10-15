---
title: Architecture Evolution
sidebar_label: Architecture Evolution
slug: /docs/concepts/architecture-evolution
---

import { Image } from '@arco-design/web-react';

## Structure evolution history

The software architecture is an abstract description of the overall structure and components of the software, which is used to guide the design of various aspects of large software systems.The software architecture will include software components, relationships between components, features of components, and features of relationships between components.The software architecture can be developed in comparison with the building structure.The software architecture is the basis for the construction of computer software, the development of the system and the planning of the project, which lists the tasks to be performed by the development team.

Architecture is the product of the continuous evolution of the software, and in historical evolution, the current overall evolution of the structure is broken down into

- The Age of Original Distribution
- The Age of the Month of Single Systems
- The SOA Age
- The Age of Microservice
- The Cloud Age
- The Serverless Age

## Architectural Pattern

Architectural Patterns is a common, reusable solution in the software architecture for commonly encountered problems in a given environment.which is similar to the software design model, but with wider coverage, efforts are made to address different issues in software engineering, such as computer hardware performance restrictions, high availability and minimal business risks.Some architectural patterns are implemented through the software framework.

### Layered Architecture Pattern

Layered Architecture Pattern, one of the most common architecture models in the architecture model, also known as n Layer Architecture Mode, is mostly used in Java EE applications and is well known to most architects, designers and developers, and it matches traditional IT communications and organizational structures in most companies, making it a natural option for most business applications development.

Components in the layered architecture patterns are organized into horizontal layers where each layer performs a specific role in the application (e.g. signifies logic or business logic).Although the layered architecture mode does not specify the number and type of layers that must exist in the mode, most tiered structures contain four standard layers：representing layers, business layers, persistent layers and database layers (figures 1-1).In some cases, the business layer and the persistent layer are merged into one business layer, especially when the persistence logic (e. g. SQL or HSQL) is embedded in the components of the business layer.As a result, smaller applications may have only three floors, while larger and more complex business applications may contain five or more layers.

Each layer of layered architecture pattern has specific roles and responsibilities in the application.For example, the expression layer will handle all user interfaces and browser communication logic, while the business layer will be responsible for implementing specific business rules associated with the request.Each layer of the architecture forms an abstract around what needs to be done to meet specific business requests.For example, the layer does not need to know or worry about how to get client data; it simply needs to display the information on the screen in a specific format.Similarly, the business layer does not need to be interested in how to format client data to be displayed on the screen, or even where the client data comes from; it simply needs to obtain data from the persistent layer, implement the business logic (e. g. compute or aggregate data) for data and pass the information up to the representation level.

<Image src={require('../resource/concepts/layered-arch-example.png').default} alt='Layered Architecture' />

<center>
  《Layered Architecture Pattern》
</center>

The Layered Architecture Pattern features:

- Overall agility low：overall agility is the ability to react quickly to changing environments.While this mode of isolation can be changed through the isolation functional layer, most of the achieved monolithic properties and the close coupling of the components that are usually associated with it make changes in this schematic mode cumbersome and time-consuming.
- Low cost of deployment: Because of this, deployment of this pattern can become a problem, especially for large applicationsA small change to the component may require the redeployment of the entire application (or most of the application), resulting in the need to plan, schedule and execute deployment either during working hours or on weekends.As a result, this model is not easily adapted to the continued delivery of pipelines, further reducing the overall rating of deployment.
- Testing high：makes this pattern relatively easy to test because the component belongs to a particular layer in the architecture, and other layers can be simulated or rooted.The developer can simulate tests within the component or screen to isolate the business component, or the business layer to test some screen features.
- Performance low：While some hierarchical structures are indeed well executed, this mode is not suitable for high-performance applications because business requests have to be met through multiple layers of structures.
- Extensive low：is often difficult to extend for applications built using this scheme's mode due to the strong coupling and overall implementation trend of this pattern.You can expand the hierarchical structure by splitting layers into separate physical deployment or copying the entire application to multiple nodes, but overall, particle size is too wide and makes the extension costly.
- Low development cost: The layered architecture is easy to develop, mainly because this mode is well known and not complicated to implementAs most companies develop applications by separating skill sets by layer (representation, business, database), this model is a natural option for most business application development.Linkages between corporate communication and organizational structures and the way in which they develop software are outlined as so-called laws of well-being.You can get more information about this fascinating correlation by Google Lead.

### Event-Driven Architecture Pattern

Event-Driven Architecture Pattern is a popular distribution async mode to generate high-scalable applications.It is also highly adaptable, both for small applications and for large, complex applications.The event driver structure consists of highly separated, single-use event processing components that are asynchronous to receive and dispose of them.

The incident-driven architecture mode consists of two main topographic structures, intermediaries and agents.When you need to organize multiple steps in an event through a central mediator, you usually use a mediator and you use a proxy pop when you want to link events together without using a central mediator.Because the structural features and implementation strategies of these two types of pools differ, it is important to know each of them to understand which of the particular situations best fit for you.

<Image src={require('../resource/concepts/event-driven-arch.png').default} alt='Event-driven architecture' />

<center>
  《Event-Driven Architecture Pattern》
</center>

In an event-driven structure, there are usually more than a dozen to hundreds of event queues.This mode does not specify the implementation of event queue components; it can be a message queue, web service endpoint, or any combination of them.

The Event-Driven Architecture Pattern features:

- Overall agility high：overall agility is the ability to react quickly to changing environments.Because the event processor component is a single use and is completely separated from other event processor components, changes are usually isolated to one or more event processors and can be made quickly without affecting other components.
- Deploying the elevator：overall, this mode is relatively easy to deploy due to the coupling properties of the event processor component.Proxies tend to be easier to deploy than mediated spots, mainly because event mediators are closely coupled to some extent with event processors：event processor components may also require event mediators to change and require both to deploy any given changes.
- Testing low：is not too difficult, but it does require some specialized test client or test tool to generate events.The asynchronous nature of this pattern also complicates testing.
- Performance High：While it is certainly possible to achieve an event driver structure with poor performance due to all message transmission infrastructure, the mode generally uses its asynchronous function to achieve high performance; in other words, the ability to perform coupling parallel asynchronous operations exceeds the cost of queuing and queuing messages.
- Extensible height：in this mode is naturally achieved by highly independent and coupling event handlers.Each event processor can be expanded individually to achieve the scalability of the fine particles.
- The development of terrain：may be complicated by the asynchronous nature of the pattern and the need for contract creation and for more advanced error processing conditions for unresponsive event handlers and failed agents in the code.

### Microkernel Architecture Pattern

Microkernel Architecture Pattern (sometimes referred to as Plugin Architecture Pattern) is the natural pattern of implementing product-based applications.Product-based applications are applications that are packaged as typical third-party products and offer multiple versions for download.However, many companies have also developed and disseminated their internal business applications, such as software products, including versions, distribution instructions and insertable functionalities.These are also well suited to this pattern.Microkernel Architecture Mode allows you to add additional application features as plugins to core applications, providing extenability, and separation of functions.

The core system of the micronuclear architecture model traditionally contains only the minimal functions required for the system to operate.Many operating systems have implemented the micronuclear architecture model, which is also the name of the model.From the point of view of business applications, core systems are usually defined as general business logic and do not have custom codes for special circumstances, special rules or complex conditions.

<Image src={require('../resource/concepts/microkernel-arch.png').default} alt='Microkernel architecture' />
<center>
  《Microkernel Architecture Pattern》
</center>

The plugin module is a separate, independent component with specialized handling, additional functionality and custom code designed to enhance or expand core systems to generate additional business features.Usually, plugins should be separate from other plugins but you can certainly design plugins that require the presence of other plugins.In any way, it is important to keep communications between plugins to a minimum in order to avoid dependency.

Microkernel Architecture Features:

- Overall agility high：overall agility is the ability to react quickly to changing environments.Through loose coupling of plugins modules, changes can be largely isolated and quickly implemented.In general, the core systems of most micronuclear structures tend to become stable quickly and therefore rather robust and require little change over time.
- High deployment costs: depending on how the pattern is implemented, plugin modules can be dynamically added to the core system at runtime (e. g. hot deployment), minimizing downtime during deployment
- Test high：plugin module can be tested separately and can easily be simulated by core systems to demonstrate or prototype specific features with little or no change to core systems.
- Performance High：Although the microkernel mode is not in itself suitable for high-performance applications, most applications built using the microkernel architecture mode perform well, because you can customize and simplify applications to include only those functions you need. The JBoss Application Server is a good example：with its plugin architecture, you can reduce the application server to include only the features you need, remove expensive unused features such as memory consume remote access, message transmission and caching, CPU and threads, and reduce the speed of the application server.
- Extensible low：is low because most micro-kernel architecture implementation is product based and typically small and is implemented as a single unit and therefore not highly extensive.Depending on how you implement the plugin module, you can sometimes provide scalability at the plugin functional level, but overall, this mode is not known for generating highly scalable applications.
- The development of a mirror：micronuclear architecture requires thoughtful design and contract governance that is quite complex to achieve.Contractual version controls, internal plugin registries, plugin particles, and a wide range of options available for plugin connections add to the complexity involved in implementing this mode.

### Microservices Architecture Pattern

The Microservices Architecture Pattern, a single application and a viable alternative to a service-oriented structure, is rapidly spreading in the industry.As this architecture model continues to evolve, there is much confusion in industry about the full content of the model and the manner in which it will be realized.This section of the report will provide you with the benefits (and weights) of this important architecture model and the key concepts and basic knowledge necessary to understand its relevance to your application.

The most important concept of understanding this model may be that of the service component.Rather than considering services in the micro-service architecture, consider the service component, which can range from a single module to a large part of the application.The service component contains one or more modules (e.g. Java class), which represent mono-purpose functions (e.g. providing weather in a particular city or town) or separate parts of large business applications (e.g. stock exchange sales or determining car insurance rates).Design of the right level of service component particles is one of the biggest challenges in the micro-service architecture.This challenge will be discussed in more detail in the section on the development of the services components below.

<Image src={require('../resource/concepts/basic-microservices-arch.png').default} alt='Basic Microservices architecture pattern' />
<center>
  Basic Microservice Framework Patterns
</center>

The micro-service architecture model addresses many of the common problems in single-body applications and service-oriented structures.As major application components are split into smaller, separately deployed cells, applications built using the Microservice Architecture model are generally more robust, provide better scalability and can more easily support continued delivery.

Microservices Architecture Pattern features:

- Overall agility high：overall agility is the ability to react quickly to changing environments.As a result of the concept of individual deployment modules, changes are usually isolated from individual service components and can be deployed quickly and easily.In addition, applications built using this mode are often very low coupling, which also helps to promote change.
- High deployment cost: Due to the fine-grained and independent nature of remote services, the deployment rate of the microservice model is very highThe service is normally deployed as a separate software module and is therefore capable of “hot deployment” at any time during the day or night.The overall deployment risk is also noticeable because the failed deployment can be restored faster and only affected the operation of the services being deployed, leading to the continuation of all other operations.
- Testing high：allows more targeted testing by separating business features and isolating them into separate applications.The regression test for a particular service component is much easier and more feasible than the regression test for an entire single application.In addition, since the service components in this mode are loosely coupled, from a development perspective, it is much less likely that changes will destroy the other part of the application, thus reducing the test burden that has to be tested for a small part of the application.
- Performance low：while you can create applications from this mode and perform very well, overall, because of the distributional features of the micro-service architecture model, this mode is not suitable for high-performance applications.
- Extensible height：is allowed to fine-tune application extensions because applications are split into individual deployed cells.For example, the management area of stock exchange applications may not need to be expanded because of the low number of users of this function, but the trading distribution services component may need to be expanded, as most trading applications require high throughput for this purpose.
- The development of specifier：is easier because the function is isolated to separate and distinct service components.The possibility for developers to change a service component to affect other service components is much less likely, thereby reducing the required coordination among developers or development teams.

### Space-Based Architecture Pattern

Space-Based Architecture Pattern (sometimes also known as cloud architecture model) minimize the constraints on the extension of applications.The name of the pattern derives from the concept of group space, the concept of distributed shared memory.High scalability is achieved by removing central database constraints and using copied memory data grids.Application data is saved in memory and copied between all active processing cells.Processing modules can be activated and closed dynamically as user load increases and decreases and thus address variable extensivity.As there is no centralized database, the database bottlenecks have been eliminated and almost unlimited outreach is provided within the application.

Most Web-based business applications follow the same general request process：requests from browser to reach the web server, then the application server, and lastly the database server.While this pattern applies to a small number of users, as user load increases, bottlenecks begin to emerge first at the network server, then at the application server level, and then at the database server level.The normal response to bottlenecks based on increased user load is the extension of the web server.This is relatively easy and inexpensive and can sometimes solve bottlenecks.However, in most high-user loads, the extended web server level will only transfer bottlenecks to application servers.Extended application servers may be more complex and expensive than web servers, and often simply move bottlenecks to database servers, which are more difficult and expensive.Even if you can expand the database, you eventually get a triangle topography structure, with the widest part of the triangle being the web server (the easiest to expand) and the smallest part the database (the most difficult to extende).

Space-based architecture models are specifically designed to address and address scalability and parallelism issues.It is also a useful architecture model for applications with variable and unpredictable concurrent users.Structurally addressing extreme and variable scalability issues is often better than trying to expand databases or convert caching technologies into non-scalable structures.

<Image src={require('../resource/concepts/space-based-arch.png').default} alt='Space-based architecture pattern' />

<center>
  Space-based Architecture Pattern
</center>

Space-Based Architecture Pattern features:

- Overall agility high：overall agility is the ability to react quickly to changing environments.As the processing module (examples of deployed applications) can be launched and closed quickly, applications can respond well to changes associated with increased or reduced user load (environmental change).Because of the size and dynamic properties of this mode, the architecture created with this mode is usually well responsive to the encoding changes.
- Deploying SP：while space-based structures are not usually coupleted and distributed, they are dynamic, and complex cloud-based tools allow applications to easily “push” to servers and simplify deployment.
- Test low：is very expensive and time-consuming to achieve a very high user load in the test environment, making it difficult to test the application's extension.
- High performance：is achieved by building memory data access and cache mechanisms into this mode.
- Extensible high：high scalability stems from the fact that reliance on centralized databases is low or non-existent, thus removing this limiting bottleneck in the extensible equation.
- Low development cost: Complex caching and in-memory data grid products make the development of this pattern relatively complex, mainly due to unfamiliarity with the tools and products used to create such architectures.In addition, special care must be taken in developing these types of architecture to ensure that nothing in the source code does not affect performance and extensiveness.

## Microservices

Microservices are a software architecture style based on small functional blocks focused on a single responsibility and function (Sall Building Blocks) that combine complex large applications using a modular approach and intercommunication between functional blocks using APIs that do not have language (Language-Independent/Language agnostic).

Another comparison of microservices is a monolithic application.The monolithic app indicates that an application contains all required business features and is implemented in a main custom architecture (Client/Server) or multi-layer architecture (English：Multitier Architecture) (N-tier). While it can also be implemented in distributed applications, each business function is inseparable within a single system application.

Microservices are also limited on planning：

### Database

- Each service has a database and services with the same attributes can be shared with the same database.
- All services share the same database, but different tables and do not have cross-domain access.
- Each service has its own database, which will not be shared, even if it is the same attribute.

### Events

The most important of microservices is the independence and autonomy of each service, and therefore there should be no communication between services and services.Where communication exists, it should also be done in an asynchronous manner to avoid the problem of close interdependence.To achieve this purpose, the following two methods can be used：

#### Event Storage

This allows you to broadcast events in the service cluster and listen to them and handle them in each service without making a close correlation between the services, which are stored in the event storage center.This means that all events can be rebroadcast when microservices are back online and deployed.This also results in the removal, destruction and non-need to obtain information from other services at any time in the microservice database.

#### Message queue

This allows you to broadcast messages in the service cluster and pass them to each service.Such as NSSQ or RabbitMQ with this feature.You can broadcast an "Create a New User" event on A Service, which can be passed with new user profiles.The B service listens to this event and handles it upon receipt.These processes are processed asynchronously, which means that A service does not require a BS service to continue after the event has been processed, and this also represents the result that A service cannot access B services.Almost like the event storage centre, but something different is：message queue will not save the event.Once the event is digested (received), it will disappear from the queue and this is well suited to the moment when a welcome message is sent.

### Service registration & discover

When a single micro-service is online, register its own IP location, service content with the Service Exploration Center (e.g.：Consul), so that it does not need to indicate its IP position to each micro-service or set it separately for each micro-service.When the service needs to be called to another service, it will be asked what IP location the service explores and then can be directed to the target service. The intention is that all services can be centrally located and will not be dispersed among each micro-service and that the Service Exploration Centre can carry out health checks at regular intervals (e.g. via：TCP calls, HTTP calls, Ping) and removed from the Service Center if the service does not respond within the time period to avoid other microservices being diverted to an unresponsive service.

## References

- <a href="https://zh.wikipedia.org/zh-sg/%E8%BD%AF%E4%BB%B6%E6%9E%B6%E6%9E%84" target="_blank">Software Architecture Wikipedia</a>
- <a href="https://zh.m.wikipedia.org/zh-sg/%E6%9E%B6%E6%9E%84%E6%A8%A1%E5%BC%8F" target="_blank">Architecture Pattern Wikipedia</a>
- <a href="https://zh.m.wikipedia.org/zh-sg/%E5%BE%AE%E6%9C%8D%E5%8B%99" target="_blank">Microservice Wikipedia</a>
- <a href="http://icyfenix.cn/architecture/architect-history/" target="_blank">Phoenix Architecture - History of Service Structure Evolution</a>
- <a href="https://www.oreilly.com/content/software-architecture-patterns/" target="_blank">Software archive patterns.</a>
