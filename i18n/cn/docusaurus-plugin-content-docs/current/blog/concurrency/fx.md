---
title: 数据的流处理利器
authors: kevwan
---

# fx

`fx`是一个完整的流处理组件。
它与 `MapReduce` 类似，`fx` 也有一个并发处理函数：`Parallel(fn, options)`。但同时，它又不仅仅是并发处理。`From(chan)`, `Map(fn)`, `Filter(fn)`, `Reduce(fn)`等，从数据源读入流，处理流数据，最后聚合流数据。这是不是有点像Java Lambda？如果你以前是个Java开发者，看到这个就能明白基本的设计。

##整体API
让我们来了解一下 `fx` 是如何整体构建的。
![dc500acd526d40aabfe4f53cf5bd180a_tplv-k3u1fbpfcp-zoom-1.png](../../resource/dc500acd526d40aabfe4f53cf5bd180a_tplv-k3u1fbpfcp-zoom-1.png)

标记的部分是整个`fx`中最重要的部分。

1. 从诸如 `From(fn)` 等API中，产生一个数据流 `Stream` 。
2. 一个用于转换、聚合和评估 `Stream` 的API集合


所以列出目前支持的`Stream API`。

| API | 函数 |
|---|---|
| `Distinct(fn)` | 在fn中选择一个特定的项目类型，并将其去掉。|
| `Filter(fn, option)` | fn指定特定的规则，符合规则的 `element` 被传递到下一个 `stream`。|
| `Group(fn)` | 根据fn，`stream` 中的元素被分为不同的组。|
| `Head(num)` | 取出 `stream` 中的前n个元素，生成一个新的 `stream`。|
| `Map(fn, option)` | 将每个元素转换为另一个对应的元素，并将其传递给下一个 `stream`。|
| `Merge()` | 将所有的ele合并成一个 `slice`，并生成一个新的 `stream`。|
| `Reverse()` | 反转 `stream` 中的元素。[使用双指针] | 
| `Sort(fn)` | 根据 fn 对 `stream` 中的元素进行排序。
| `Tail(num)` | 取出 `stream` 的最后 n 个元素，生成一个新的 `stream`。[使用一个双链表] | 
| `Walk(fn, option)` | 将fn应用于 `source` 的每个元素。生成一个新的 `stream` |


不再生成一个新的`stream`，做最后的评估操作。

| API | 函数 |
|---|---|
| `ForAll(fn)` | 根据fn处理`stream`，不再生成 `stream` [评估操作] |
| `ForEach(fn)` | 对 `stream` 中的所有元素进行fn[求值操作] !
| `Parallel(fn, option)` | 同时对每个 `element` 应用给定的fn和给定数量的worker[求值操作] |
| `Reduce(fn)` | 直接处理 `stream` [评估操作] |
| `Done()` | 不做任何事情，等待所有操作完成 |

## 用法

```go
result := make(map[string]string)
fx.From(func(source chan<- interface{}) {
  for _, item := range data {
    source <- item
  }
}).Walk(func(item interface{}, pipe chan<- interface{}) {
  each := item.(*model.ClassData)

  class, err := l.rpcLogic.GetClassInfo()
  if err != nil {
    l.Errorf("get class %s failed: %s", each.ClassId, err.Error())
    return
  }
  
  students, err := l.rpcLogic.GetUsersInfo(class.ClassId)
  if err != nil {
    l.Errorf("get students %s failed: %s", each.ClassId, err.Error())
    return
  }

  pipe <- &classObj{
    classId: each.ClassId
    studentIds: students
  }
}).ForEach(func(item interface{}) {
    o := item.(*classObj)
    result[o.classId] = o.studentIds
})
```

1. `From()`从一个 `slice` 生成 `stream`。
2. `Walk()` 接收一个 `stream`，对流中的每个 `ele` 进行转换和重组，生成一个新的 `stream`。
3. 最后，`stream` 的输出（`fmt.Println`），存储（`map,slice`）和持久化（`db操作`）由 `evaluation operation` 完成。



## 简单分析一下

`fx` 中的函数命名是有语义的。开发人员只需要知道业务逻辑需要什么样的转换，并调用匹配的函数。


因此，下面是对几个比较典型的函数的简要分析。

### Walk()

`Walk()` 是由整个 `fx` 的多个函数作为底层实现的，如 `Map()`、`Filter()` 等。

所以本质是：`Walk()` 负责将传递的函数同时应用于 **输入流** 的每一个 `ele'，并生成一个新的 `stream`。

按照源代码，它被分为两个子函数：按 `worker` 自定义计数，默认计数为 `worker`。

```go
// Custom workers
func (p Stream) walkLimited(fn WalkFunc, option *rxOptions) Stream {
	pipe := make(chan interface{}, option.workers)

	go func() {
		var wg sync.WaitGroup
    // channel<- If the set number of workers is reached, the channel is blocked, so as to control the number of concurrency.
    // Simple goroutine pool
		pool := make(chan lang.PlaceholderType, option.workers)

		for {
      // Each for loop will open a goroutine. If it reaches the number of workers, it blocks
			pool <- lang.Placeholder
			item, ok := <-p.source
			if !ok {
				<-pool
				break
			}
			// Use WaitGroup to ensure the integrity of task completion
			wg.Add(1)
			threading.GoSafe(func() {
				defer func() {
					wg.Done()
					<-pool
				}()

				fn(item, pipe)
			})
		}

		wg.Wait()
		close(pipe)
	}()

	return Range(pipe)
}
```

- 使用 `buffered channel` 作为并发队列，限制并发的数量。
- `waitgroup`来保证任务完成的完整性

另一个`walkUnlimited()`：也使用`waitgroup`进行并发控制，因为没有自定义的并发限制，所以没有其他 `channel` 进行并发控制。


### Tail()

介绍这个主要是因为`ring`是一个双链表，简单的算法还是很有意思的。

```go
func (p Stream) Tail(n int64) Stream {
	source := make(chan interface{})

	go func() {
		ring := collection.NewRing(int(n))
    // Sequence insertion, the order of the source is consistent with the order of the ring
		for item := range p.source {
			ring.Add(item)
		}
    // Take out all the items in the ring
		for _, item := range ring.Take() {
			source <- item
		}
		close(source)
	}()

	return Range(source)
}
```

至于为什么 `Tail()` 可以取出源头的最后n个，这就留给大家去微调了。下面是我的理解。
![f93c621571074e44a2d403aa25e7db6f_tplv-k3u1fbpfcp-zoom-1.png](../../resource/f93c621571074e44a2d403aa25e7db6f_tplv-k3u1fbpfcp-zoom-1.png)

:::tip

假设有以下情况，`Tail(5)`。
- `水流大小` ：7
- `环的大小`：5

:::



这里你可以使用拉开环形链表的方法，此时，用对称轴除以全长，翻转多余的元素，以下元素就是 `Tail(5)` 需要的部分。


:::tip
这里使用图表是为了更清晰的表现，但大家也应该看一下代码。要测试的算法 
:::



### 流变换设计


分析整个 `fx`，你会发现，整体设计遵循一个设计模板。

```go
func (p Stream) Transform(fn func(item interface{}) interface{}) Stream {
	// make channel
	source := make(chan interface{})
    // goroutine worker
	go func() {
		// transform
        for item := range p.source {
			...
			source <- item
			...
		}
		...
		// Close the input, but still can output from this stream. Prevent memory leaks
		close(source)
	}()
	// channel -> stream
	return Range(source)
}
```

- `channel` 作为流的容器
- 开启 `goroutine` 来转换 `source`，聚合，并发送至 `channel`。
- 已处理，`close(outputStream)`。
- `channel -> stream`。



## 总结

这就结束了对 `fx` 的基本介绍。如果你对其他的API源代码感兴趣，你可以按照上面的API列表逐一阅读。

同时，也建议你看一下`java stream`的API，你可以对这个 `stream call` 有更深的了解。

同时，在`go-zero`中还有许多有用的组件工具。良好的使用工具将大大有助于提高服务性能和开发效率。希望这篇文章能给你带来一些收获。



