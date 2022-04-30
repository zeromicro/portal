---
title: Efficient keyword replacement and sensitive word filtering tool
authors: kevwan
---

## Efficient keyword replacement and sensitive word filtering tool

## 1. Introduction to the algorithm

Build a keyword tree using an efficient trie tree, as shown in the following figure, and then find whether the connected characters in the string form a path in the tree in turn

<img src="https://raw.githubusercontent.com/zeromicro/zero-doc/main/doc/images/trie.png" alt="trie" width="350" />

I found that [this article](https://juejin.im/post/6844903750490914829) on Nuggets is written in more detail, you can read it first, the specific principle is not detailed here.

## 2. keyword replacement

Support keyword overlap, automatically select the longest keywords, code examples are as follows.

```go
replacer := stringx.NewReplacer(map[string]string{
  "Japan": "France",
  "Japan's capital": "Tokyo",
  "Tokyo": "Japan's capital",
})
fmt.Println(replacer.Replace("The capital of Japan is Tokyo"))
```

You can get.

```Plain Text
Tokyo is the capital of Japan
```

The sample code can be found in `stringx/replace/replace.go`

## 3. Find sensitive words

The code example is as follows.

```go
filter := stringx.NewTrie([]string{
  "AV actor",
  "Aoi Air",
  "AV",
  "Japanese AV actress",
  "AV actor porn",
})
keywords := filter.FindKeywords("Japanese AV actress and TV and movie actress. Asuka AV actress is xx debut, Japanese AV actresses the best performance is AV actor porn performance ")
fmt.Println(keywords)
```

can get.

```Plain Text
[Aoi Air Japanese AV actress AV actor porn AV AV actor]
```

## 4. sensitive word filtering

Code examples are as follows.

```go
filter := stringx.NewTrie([]string{
  "AV actor",
  "Aoi Air",
  "AV",
  "Japanese AV actress",
  "AV Actor Porn",
}, stringx.WithMask('?')) // default replace with *
safe, keywords, found := filter.Filter("Japanese AV actress and TV and movie actress. Asuka AV actress is xx debut, Japanese AV actresses the best performance is AV actor porn performance ")
fmt.Println(safe)
fmt.Println(keywords)
fmt.Println(found)
```

You can get.

```Plain Text
Japan ???? Part-time TV and movie actress. ????? Actress is xx debut, ?????? Their best performances are ?????? Acting
[Aoi Air Japanese AV actress AV actor porn AV AV actor]
true
```

Example code is in `stringx/filter/filter.go`

## 5. Benchmark

| Sentences | Keywords | Regex | go-zero |
| --------- | -------- | -------- | ------- |
| 10000 | 10000 | 16min10s | 27.2ms |
